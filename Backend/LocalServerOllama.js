require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Ollama } = require('ollama');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Initialize Ollama client for LOCAL installation
const ollama = new Ollama({
    host: 'http://localhost:11434' // LOCAL Ollama server
});

app.post('/audit', async (req, res) => {
    const contractCode = req.body.code;

    if (!contractCode) {
        return res.status(400).json({ error: 'Smart contract code is required.' });
    }

    console.log(`📝 Received contract for audit (${contractCode.length} chars)`);

    const prompt = `You are an expert blockchain security researcher and smart contract auditor.

Analyze this Solidity smart contract and return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this EXACT structure:

{
  "riskScore": <number from 1-10>,
  "status": "Safe" or "Risky" or "Critical",
  "summary": {
    "totalVulnerabilities": <total count>,
    "critical": <count>,
    "high": <count>,
    "medium": <count>,
    "low": <count>,
    "gasOptimizations": <count>
  },
  "vulnerabilities": [
    {
      "id": 1,
      "name": "Vulnerability Name",
      "severity": "Critical" or "High" or "Medium" or "Low",
      "riskScore": <1-10>,
      "location": "ContractName.functionName or line number",
      "vector": "Brief description of how this can be exploited",
      "impact": "What damage this vulnerability can cause",
      "remediation": "Specific steps to fix this issue",
      "vulnerableCode": "Actual code snippet from the contract",
      "fixedCode": "Corrected version of the code",
      "references": ["Reference 1", "Reference 2"]
    }
  ],
  "recommendations": {
    "immediate": ["Action 1", "Action 2"],
    "bestPractices": ["Practice 1", "Practice 2"],
    "longTerm": ["Improvement 1", "Improvement 2"]
  }
}

CRITICAL RULES:
1. Return ONLY the JSON object - no markdown formatting, no \`\`\`json tags, no explanatory text before or after
2. Identify ALL vulnerability types: reentrancy, overflow/underflow, access control, unchecked calls, delegatecall, randomness, DoS, front-running, timestamp dependence, tx.origin usage, etc.
3. Extract ACTUAL code snippets from the provided contract
4. Provide working FIXED code for each vulnerability
5. Assign severity based on: Critical (direct fund loss), High (major security issue), Medium (potential issue), Low (best practice)
6. Calculate overall riskScore: 9-10 = Critical, 7-8 = High Risk, 4-6 = Medium Risk, 1-3 = Low Risk
7. Be thorough but concise
8. If the contract is safe, still return the structure with empty vulnerabilities array

Contract to analyze:

\`\`\`solidity
${contractCode}
\`\`\`

Remember: Return ONLY the JSON object, nothing else.`;

    try {
        console.log('🤖 Sending to Local Ollama (llama3.2)...');

        // STREAMING mode for local Ollama
        let fullResponse = '';

        const stream = await ollama.chat({
            model: 'llama3.2', // Use llama3.2 (available locally)
            messages: [
                {
                    role: 'system',
                    content: 'You are a smart contract security auditor. You MUST respond with ONLY valid JSON, with no markdown formatting, no code blocks, and no additional text. The response must be parseable by JSON.parse(). Start your response with { and end with }.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: true,
            options: {
                temperature: 0.2,
                num_predict: 4000,
                top_p: 0.9
            }
        });

        // Collect streamed response
        for await (const chunk of stream) {
            if (chunk.message?.content) {
                fullResponse += chunk.message.content;
                // Show progress
                if (fullResponse.length % 500 === 0) {
                    process.stdout.write('.');
                }
            }
        }
        console.log(''); // New line after dots

        console.log('✅ Received AI response');
        console.log('Raw AI response length:', fullResponse.length);
        console.log('Raw AI response (first 500 chars):', fullResponse.substring(0, 500));

        // If response is empty, provide meaningful error
        if (!fullResponse || fullResponse.trim() === '') {
            console.error('❌ Empty response from Ollama');
            return res.status(500).json({
                error: 'AI service returned empty response',
                details: 'Ollama did not generate any output. Make sure Ollama is running: ollama serve'
            });
        }

        // Clean up the response - remove markdown code blocks if present
        let aiResult = fullResponse.trim();

        // Remove markdown code blocks
        aiResult = aiResult.replace(/^```json\s*/i, '');
        aiResult = aiResult.replace(/^```\s*/i, '');
        aiResult = aiResult.replace(/\s*```$/i, '');
        aiResult = aiResult.trim();

        // Try to extract JSON if there's text before/after
        const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            aiResult = jsonMatch[0];
        }

        console.log('Cleaned response (first 300 chars):', aiResult.substring(0, 300));

        // Try to parse the JSON
        try {
            const auditData = JSON.parse(aiResult);
            console.log('✅ Successfully parsed JSON');
            console.log(`📊 Found ${auditData.vulnerabilities?.length || 0} vulnerabilities`);

            // Validate required fields
            if (!auditData.riskScore || !auditData.vulnerabilities || !auditData.summary) {
                console.warn('⚠️ Invalid audit response structure, attempting to fix...');

                // Try to fix common issues
                const fixedData = {
                    riskScore: auditData.riskScore || 5,
                    status: auditData.status || 'Unknown',
                    summary: auditData.summary || {
                        totalVulnerabilities: 0,
                        critical: 0,
                        high: 0,
                        medium: 0,
                        low: 0,
                        gasOptimizations: 0
                    },
                    vulnerabilities: Array.isArray(auditData.vulnerabilities) ? auditData.vulnerabilities : [],
                    recommendations: auditData.recommendations || {
                        immediate: ['AI response structure incomplete - please try again'],
                        bestPractices: ['Consider manual review by security expert'],
                        longTerm: []
                    }
                };

                return res.status(200).json({
                    success: true,
                    audit: fixedData,
                    timestamp: new Date().toISOString(),
                    contractLength: contractCode.length,
                    warning: 'Response structure was incomplete and has been normalized'
                });
            }

            // Return structured data
            return res.status(200).json({
                success: true,
                audit: auditData,
                timestamp: new Date().toISOString(),
                contractLength: contractCode.length
            });

        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError.message);
            console.error('Raw response causing error (first 1000 chars):', aiResult.substring(0, 1000));

            // Create a fallback response with the raw text
            return res.status(200).json({
                success: true,
                audit: {
                    riskScore: 5,
                    status: 'Unknown',
                    summary: {
                        totalVulnerabilities: 0,
                        critical: 0,
                        high: 0,
                        medium: 0,
                        low: 0,
                        gasOptimizations: 0
                    },
                    vulnerabilities: [],
                    recommendations: {
                        immediate: ['AI response format error - manual review required'],
                        bestPractices: ['The AI returned invalid JSON format. Please try again.'],
                        longTerm: ['Consider using a different AI model or manual audit']
                    },
                    rawReport: aiResult.substring(0, 2000)
                },
                timestamp: new Date().toISOString(),
                contractLength: contractCode.length,
                parseError: true,
                errorDetails: parseError.message
            });
        }

    } catch (err) {
        console.error('❌ Error during audit:', err);
        console.error('Error details:', {
            message: err.message,
            error: err.error,
            status_code: err.status_code,
            code: err.code
        });

        // Handle specific error types
        if (err.message?.includes('connect ECONNREFUSED')) {
            return res.status(500).json({
                error: 'Cannot connect to Ollama',
                details: 'Ollama server is not running. Please start it with: ollama serve',
                hint: 'Make sure Ollama is installed and running at http://localhost:11434'
            });
        }

        if (err.status_code === 404 || err.message?.includes('not found')) {
            return res.status(500).json({
                error: 'Model not found',
                details: 'The model "llama3.2" is not installed. Please run: ollama pull llama3.2',
                availableModels: 'Try: llama3.2, codellama, llama2, mistral',
                hint: 'Run "ollama list" to see installed models'
            });
        }

        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
            return res.status(408).json({
                error: 'Audit request timed out',
                details: 'The contract analysis took too long. Try with a smaller contract or try again.'
            });
        }

        return res.status(500).json({
            error: 'Failed to audit contract',
            details: err.message,
            hint: 'Make sure Ollama is running: ollama serve'
        });
    }
});

// Quick scan endpoint
app.post('/quick-scan', async (req, res) => {
    const contractCode = req.body.code;

    if (!contractCode) {
        return res.status(400).json({ error: 'Smart contract code is required.' });
    }

    const quickPrompt = `Perform a QUICK security scan of this Solidity contract. Return ONLY a JSON object:
{
  "riskLevel": "Low" or "Medium" or "High" or "Critical",
  "riskScore": <1-10>,
  "quickFindings": ["finding 1", "finding 2"],
  "recommendFullAudit": true or false
}

Contract:
\`\`\`solidity
${contractCode}
\`\`\`

Return ONLY the JSON object.`;

    try {
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [
                { role: 'system', content: 'You are a smart contract security scanner. Return only valid JSON.' },
                { role: 'user', content: quickPrompt }
            ],
            stream: false,
            options: { temperature: 0.2 }
        });

        let result = response.message?.content || '{}';
        result = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = jsonMatch[0];

        const scanData = JSON.parse(result);
        res.status(200).json({ success: true, scan: scanData });

    } catch (err) {
        console.error('Quick scan error:', err);
        res.status(500).json({
            error: 'Quick scan failed',
            details: err.message
        });
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Test Ollama connection
        const list = await ollama.list();
        const models = list.models?.map(m => m.name) || [];

        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            ollama: {
                connected: true,
                host: 'http://localhost:11434',
                installedModels: models,
                recommendedModel: 'llama3.2'
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            ollama: {
                connected: false,
                host: 'http://localhost:11434',
                error: err.message,
                hint: 'Start Ollama with: ollama serve'
            }
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🛡️  Smart Contract Auditor API                       ║
║                                                        ║
║  Status: ✅ Running                                    ║
║  Port: ${PORT}                                        ║
║  URL: http://localhost:${PORT}                        ║
║                                                        ║
║  Ollama: LOCAL Installation                           ║
║  Host: http://localhost:11434                         ║
║  Model: llama3.2                                      ║
║                                                        ║
║  Endpoints:                                            ║
║  POST /audit - Full contract audit                    ║
║  POST /quick-scan - Quick security scan               ║
║  GET /health - Health check & models                  ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);

    // Check Ollama connection
    try {
        const list = await ollama.list();
        const models = list.models?.map(m => m.name) || [];

        if (models.length === 0) {
            console.log(`
⚠️  No Ollama models installed!

Run these commands:
1. ollama pull llama3.2
2. ollama pull codellama  (optional, good for code)

Then restart this server.
      `);
        } else {
            console.log('✅ Ollama connected successfully!');
            console.log('📦 Installed models:', models.join(', '));

            if (!models.includes('llama3.2') && !models.some(m => m.startsWith('llama3.2'))) {
                console.log('\n⚠️  Model "llama3.2" not found. Installing...');
                console.log('Run: ollama pull llama3.2');
            }
        }
    } catch (err) {
        console.log(`
❌ Cannot connect to Ollama!

Follow these steps to fix:

WINDOWS:
1. Download: https://ollama.com/download/windows
2. Install and run Ollama
3. Open Command Prompt and run:
   ollama pull llama3.2
4. Restart this server

MAC:
1. Install: brew install ollama
2. Start: ollama serve
3. Pull model: ollama pull llama3.2
4. Restart this server

LINUX:
1. Install: curl -fsSL https://ollama.com/install.sh | sh
2. Start: ollama serve
3. Pull model: ollama pull llama3.2
4. Restart this server

Error: ${err.message}
    `);
    }
});