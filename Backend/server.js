require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const puppeteer = require('puppeteer');
const { Ollama } =require('ollama')

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: {
    'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
  }
});


function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildReportHTML({ title = 'Audit Report', htmlContent = '', generatedAt = new Date() }) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>${title}</title>
      <style>
        @page { margin: 20mm; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; color: #111827; background: #fff; -webkit-print-color-adjust: exact; margin:0; padding:0 0 30px; }
        .container { padding: 24px; max-width: 900px; margin: 0 auto; }
        .vulnerability, .stat-card, .section { page-break-inside: avoid; break-inside: avoid; }
        h1 { font-size: 28px; color: #0b63d6; margin-bottom: 6px; }
        h2 { font-size: 20px; color: #0b63d6; margin-top: 28px; margin-bottom: 6px; }
        h3 { font-size: 16px; color: #374151; margin-top: 14px; margin-bottom: 6px; }
        .stats-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin:16px 0; }
        .stat-card { background:#f9fafb; padding:12px; border-radius:8px; border:1px solid #e5e7eb; text-align:center; }
        .vulnerability { border-radius:8px; padding:12px; border:1px solid #e5e7eb; margin-bottom:14px; background:#fff; }
        .badge { display:inline-block; padding:6px 10px; border-radius:999px; color:#fff; font-weight:600; font-size:12px; text-transform:uppercase; }
        .badge-critical { background:#dc2626; } .badge-high { background:#ea580c; } .badge-medium { background:#ca8a04; color:#111827; } .badge-low { background:#2563eb; }
        pre { background:#f3f4f6; padding:12px; overflow:auto; border-radius:6px; font-family: monospace; font-size:12px; }
        .footer { color:#6b7280; font-size:12px; text-align:center; margin-top:24px; border-top:1px solid #e5e7eb; padding-top:12px; }
        img { max-width:100%; height:auto; display:block; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ ${title}</h1>
        <div style="color:#374151; margin-bottom:8px;"><strong>Generated:</strong> ${new Date(generatedAt).toLocaleString()}</div>
        ${htmlContent}
        <div class="footer">
          <div>Disclaimer: This audit report is generated using AI and should be reviewed by security professionals before deployment.</div>
          <div style="margin-top:6px;">© ${new Date().getFullYear()} Smart Contract Auditor</div>
        </div>
      </div>
    </body>
  </html>
  `;
}

app.post('/generate-pdf', async (req, res) => {
  const start = Date.now();
  try {
    const { htmlContent, auditData, fileName = 'audit-report.pdf' } = req.body;
    let html = htmlContent;

    if (!html && auditData) {
      const summary = auditData.summary || {};
      const vulnerabilities = auditData.vulnerabilities || [];
      const vulnHtml = vulnerabilities.map(v => `
        <div class="vulnerability ${v.severity?.toLowerCase() || ''}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3>${escapeHtml(v.name || 'Unnamed Issue')}</h3>
              <div style="color:#6b7280; font-size:13px;">${escapeHtml(v.location || '')}</div>
            </div>
            <div>
              <span class="badge ${v.severity === 'Critical' ? 'badge-critical' : v.severity === 'High' ? 'badge-high' : v.severity === 'Medium' ? 'badge-medium' : 'badge-low'}">${escapeHtml(v.severity || '')}</span>
            </div>
          </div>
          <div style="margin-top:10px; font-size:13px; color:#374151;">
            <div><strong>Attack Vector:</strong> ${escapeHtml(v.vector || 'N/A')}</div>
            <div style="margin-top:6px;"><strong>Impact:</strong> ${escapeHtml(v.impact || 'N/A')}</div>
            <div style="margin-top:6px;"><strong>Remediation:</strong> ${escapeHtml(v.remediation || 'N/A')}</div>
            ${v.vulnerableCode ? `<div style="margin-top:8px;"><strong>Vulnerable Code:</strong><pre>${escapeHtml(v.vulnerableCode)}</pre></div>` : ''}
            ${v.fixedCode ? `<div style="margin-top:8px;"><strong>Fixed Code:</strong><pre>${escapeHtml(v.fixedCode)}</pre></div>` : ''}
          </div>
        </div>
      `).join('\n');

      html = `
        <div>
          <h2>Overview</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-number">${summary.totalVulnerabilities || 0}</div><div class="stat-label">Total Issues</div></div>
            <div class="stat-card"><div class="stat-number">${summary.critical || 0}</div><div class="stat-label">Critical</div></div>
            <div class="stat-card"><div class="stat-number">${summary.high || 0}</div><div class="stat-label">High</div></div>
            <div class="stat-card"><div class="stat-number">${summary.medium || 0}</div><div class="stat-label">Medium</div></div>
            <div class="stat-card"><div class="stat-number">${summary.low || 0}</div><div class="stat-label">Low</div></div>
          </div>
          <h2>Vulnerabilities</h2>
          ${vulnHtml || '<div>No vulnerabilities detected</div>'}
        </div>
      `;
    }

    const fullHtml = buildReportHTML({ title: 'Smart Contract Audit Report', htmlContent: html, generatedAt: auditData?.timestamp || Date.now() });

    console.log('[PDF] Generating PDF...');

    // Launch puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set content and wait until network idle (images/styles loaded)
    await page.setContent(fullHtml, { waitUntil: 'networkidle2', timeout: 60000 });

    // extra wait to let fonts/images settle
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });

    await browser.close();

    console.log(`[PDF] Done in ${Date.now() - start}ms, size=${pdfBuffer.length} bytes`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length,
    });
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF] generation error:', err);
    return res.status(500).json({ error: 'PDF generation failed', details: err.message });
  }
});

app.post('/audit', async (req, res) => {
  const contractCode = req.body.code;

  if (!contractCode) {
    return res.status(400).json({ error: 'Smart contract code is required.' });
  }

  console.log(`📝 Received contract for audit (${contractCode.length} chars)`);

  const prompt = `
You are an expert blockchain security researcher and smart contract auditor.

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
1. Return ONLY the JSON object - no markdown formatting, no \`\`\`json tags, no explanatory text
2. Identify ALL vulnerability types: reentrancy, overflow/underflow, access control, unchecked calls, delegatecall, randomness, DoS, front-running, timestamp dependence, tx.origin usage, etc.
3. Extract ACTUAL code snippets from the provided contract
4. Provide working FIXED code for each vulnerability
5. Assign severity based on: Critical (direct fund loss), High (major security issue), Medium (potential issue), Low (best practice)
6. Calculate overall riskScore: 9-10 = Critical, 7-8 = High Risk, 4-6 = Medium Risk, 1-3 = Low Risk
7. Be thorough but concise
8. If the contract is safe, still return the structure with empty arrays

Contract to analyze:

\`\`\`solidity
${contractCode}
\`\`\`
`;

  try {
    console.log('🤖 Sending to OLLAMA...');

    const response = await ollama.chat(
      {
        model: 'gpt-oss:120b-cloud',
        messages: [
          {
            role: 'system',
            content: 'You are a smart contract security auditor. You MUST respond with ONLY valid JSON, with no markdown formatting, no code blocks, and no additional text. The response must be parseable by JSON.parse().'
          },
          { role: 'user', content: prompt }
        ],
        stream: true,
        temperature: 0.2, // Lower temperature for more consistent output
        max_tokens: 4000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    let aiResult = response.data?.choices?.[0]?.message?.content || '{}';
    console.log('✅ Received AI response');
    console.log('Raw AI response (first 200 chars):', aiResult.substring(0, 200));

    // Clean up the response - remove markdown code blocks if present
    aiResult = aiResult.trim();
    aiResult = aiResult.replace(/^```json\s*/i, '');
    aiResult = aiResult.replace(/^```\s*/i, '');
    aiResult = aiResult.replace(/\s*```$/i, '');
    aiResult = aiResult.trim();

    // Try to parse the JSON
    try {
      const auditData = JSON.parse(aiResult);
      console.log('✅ Successfully parsed JSON');
      console.log(`📊 Found ${auditData.vulnerabilities?.length || 0} vulnerabilities`);

      // Validate required fields
      if (!auditData.riskScore || !auditData.vulnerabilities || !auditData.summary) {
        console.warn('⚠️ Invalid audit response structure, creating fallback');
        throw new Error('Invalid audit response structure');
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
      console.error('Raw response causing error:', aiResult);

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
            bestPractices: ['Please try again or contact support'],
            longTerm: []
          },
          rawReport: aiResult // Include raw response for debugging
        },
        timestamp: new Date().toISOString(),
        contractLength: contractCode.length,
        parseError: true
      });
    }

  } catch (err) {
    console.error('❌ Error during audit:', err?.response?.data || err.message);

    // Handle specific error types
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return res.status(408).json({
        error: 'Audit request timed out',
        details: 'The contract analysis took too long. Try with a smaller contract or try again.'
      });
    }

    if (err?.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        details: 'Too many audit requests. Please wait a moment and try again.'
      });
    }

    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return res.status(500).json({
        error: 'API authentication failed',
        details: 'There is an issue with the AI service configuration. Please contact support.'
      });
    }

    return res.status(500).json({
      error: 'Failed to audit contract',
      details: err?.response?.data?.error || err.message
    });
  }
});

// Optional: Add endpoint to get audit history
app.get('/audit-history/:contractHash', async (req, res) => {
  // Implement audit history retrieval if you store audits
  res.status(200).json({ message: 'Feature coming soon' });
});

// Optional: Add endpoint for quick vulnerability check
app.post('/quick-scan', async (req, res) => {
  const contractCode = req.body.code;

  if (!contractCode) {
    return res.status(400).json({ error: 'Smart contract code is required.' });
  }

  const quickPrompt = `
Perform a QUICK security scan of this Solidity contract. Return ONLY a JSON object:
{
  "riskLevel": "<Low|Medium|High|Critical>",
  "riskScore": <1-10>,
  "quickFindings": ["<finding 1>", "<finding 2>"],
  "recommendFullAudit": <boolean>
}

Contract:
\`\`\`solidity
${contractCode}
\`\`\`
`;

  try {
    const response = await ollama.chat({
      model: 'gpt-oss:120b-cloud',
        messages: [
          { role: 'system', content: 'You are a smart contract security scanner. Return only valid JSON.' },
          { role: 'user', content: quickPrompt }
        ],
        stream: false,
      options: {
        temperature: 0.2
      }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let result = response.data?.choices?.[0]?.message?.content || '{}';
    result = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const scanData = JSON.parse(result);
    res.status(200).json({ success: true, scan: scanData });

  } catch (err) {
    console.error('Quick scan error:', err);
    res.status(500).json({ error: 'Quick scan failed' });
  }
});

app.post('/checkcontract', async (req, res) => {
  const { contractAddress } = req.body;

  if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    return res.status(400).json({ error: 'A valid contract address is required.' });
  }

  let contractSource = '';
  let bscRes;

  try {
    // Step 1: Fetch smart contract source (testnet then mainnet)
    console.log('➡️ Fetching source code from BscScan...');

    bscRes = await axios.get('https://api-testnet.bscscan.com/api', {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: contractAddress,
        apikey: process.env.BSC_API_KEY
      },
      timeout: 10000
    });

    contractSource = bscRes.data?.result?.[0]?.SourceCode;

    if (!contractSource || contractSource.trim() === '') {
      bscRes = await axios.get('https://api.bscscan.com/api', {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address: contractAddress,
          apikey: process.env.BSC_API_KEY
        },
        timeout: 10000
      });

      contractSource = bscRes.data?.result?.[0]?.SourceCode;
    }

    if (!contractSource || contractSource.trim() === '') {
      return res.status(404).json({ error: 'Contract source code not found or not verified.' });
    }

    console.log(`✅ Source code fetched (${contractSource.length} chars)`);

    // Step 2: Build simple prompt asking only for a risk score
    const prompt = `
Your task is to audit the given smart contract and return a single risk score.

Please only respond with one sentence that clearly states:

- Whether the contract is considered Safe or Risky
- A risk score out of 10 (1 = very safe, 10 = very risky)

Do not include detailed explanations.

Example response:
"Risky: 7/10"

Now audit the following contract:

\`\`\`solidity
${contractSource}
\`\`\`
`;

    // Step 3: Call Perplexity AI
    const aiRes =  await ollama.chat({
      model: 'gpt-oss:120b-cloud',
        messages: [
          { role: 'system', content: 'You are a smart contract security risk analyzer.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiOutput = aiRes.data?.choices?.[0]?.message?.content || '';
    console.log('🔍 AI raw output:', aiOutput);

    // Step 4: Extract "Risky/Safe" and score using regex
    const match = aiOutput.match(/(Risky|Safe)[^\d]*(\d{1,2})\/10/i);

    if (!match) {
      return res.status(500).json({
        error: 'Could not extract score from AI response.',
        aiOutput
      });
    }

    const risk = match[1];
    const score = parseInt(match[2]);

    return res.json({ risk, score });

  } catch (error) {
    console.error('❌ Error during contract check:', error?.response?.data || error.message);
    return res.status(500).json({
      error: 'Internal error while checking contract risk.',
      details: error?.message || 'Unknown error'
    });
  }
});



app.post('/nonaudit', async (req, res) => {
  const { code, contractAddress } = req.body;
  let contractCode = code;

  // Try to fetch from BscScan if no code was pasted directly
  if (!contractCode && contractAddress) {
    // Validate contract address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return res.status(400).json({ error: 'Invalid contract address format.' });
    }

    let bscRes;
    try {
      // First, test without API key to check basic connectivity
      console.log('Testing BSC Testnet API connectivity without API key...');
      let testRes;
      try {
        testRes = await axios.get(`https://api-testnet.bscscan.com/api`, {
          params: {
            module: 'contract',
            action: 'getsourcecode',
            address: contractAddress,
          },
          timeout: 10000
        });
        console.log('Testnet API test (no key):', testRes.data);
      } catch (testErr) {
        console.log('Testnet API test failed:', testErr.message);
      }

      // Now try with API key
      console.log('Fetching from BSC Testnet with API key...');
      console.log('Contract Address:', contractAddress);
      console.log('API Key Status:', process.env.BSC_API_KEY ? 'Set' : 'NOT SET');

      bscRes = await axios.get(`https://api-testnet.bscscan.com/api`, {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address: contractAddress,
          apikey: process.env.BSC_API_KEY,
        },
        timeout: 15000
      });

      console.log('Testnet BscScan response:', JSON.stringify(bscRes.data, null, 2));

      // Check API response status
      if (bscRes.data.status === "0") {
        console.log('Testnet API returned error:', bscRes.data.message || bscRes.data.result);
      } else if (bscRes.data.result && bscRes.data.result[0]) {
        const result = bscRes.data.result[0];
        console.log('Contract found on testnet:');
        console.log('- Contract Name:', result.ContractName || 'N/A');
        console.log('- Compiler Version:', result.CompilerVersion || 'N/A');
        console.log('- Source Code Length:', result.SourceCode?.length || 0);

        if (result.SourceCode && result.SourceCode.trim() !== '') {
          contractCode = result.SourceCode;
          console.log('✓ Source code successfully retrieved from testnet');
        } else {
          console.log('⚠ Contract exists on testnet but source code is empty or not verified');
        }
      }

      // If not found on testnet, try mainnet
      if (!contractCode || contractCode.trim() === '') {
        console.log('Source code not found on testnet, trying mainnet...');

        // Test mainnet connectivity
        try {
          const mainnetTestRes = await axios.get(`https://api.bscscan.com/api`, {
            params: {
              module: 'contract',
              action: 'getsourcecode',
              address: contractAddress,
            },
            timeout: 10000
          });
          console.log('Mainnet API test (no key):', mainnetTestRes.data);
        } catch (mainnetTestErr) {
          console.log('Mainnet API test failed:', mainnetTestErr.message);
        }

        bscRes = await axios.get(`https://api.bscscan.com/api`, {
          params: {
            module: 'contract',
            action: 'getsourcecode',
            address: contractAddress,
            apikey: process.env.BSC_API_KEY,
          },
          timeout: 15000
        });

        console.log('Mainnet BscScan response:', JSON.stringify(bscRes.data, null, 2));

        if (bscRes.data.status === "0") {
          console.log('Mainnet API returned error:', bscRes.data.message || bscRes.data.result);
        } else if (bscRes.data.result && bscRes.data.result[0]) {
          const result = bscRes.data.result[0];
          console.log('Contract found on mainnet:');
          console.log('- Contract Name:', result.ContractName || 'N/A');
          console.log('- Compiler Version:', result.CompilerVersion || 'N/A');
          console.log('- Source Code Length:', result.SourceCode?.length || 0);

          if (result.SourceCode && result.SourceCode.trim() !== '') {
            contractCode = result.SourceCode;
            console.log('✓ Source code successfully retrieved from mainnet');
          }
        }
      }

      // If still empty, provide detailed error information
      if (!contractCode || contractCode.trim() === '') {
        const errorDetails = {
          testnet_status: bscRes?.data?.status || 'unknown',
          testnet_message: bscRes?.data?.message || 'no message',
          contract_exists: bscRes?.data?.result?.[0] ? 'yes' : 'no',
          is_verified: bscRes?.data?.result?.[0]?.SourceCode ? 'yes' : 'no'
        };

        console.log('Contract retrieval failed. Details:', errorDetails);

        // Provide specific error messages based on the response
        if (bscRes?.data?.result?.[0]?.ABI === "Contract source code not verified") {
          return res.status(404).json({
            error: 'Contract exists but source code is not verified on BSCScan.',
            details: 'Please verify your contract on BSCScan to enable auditing.',
            debug: errorDetails
          });
        } else if (bscRes?.data?.message?.includes('Invalid address format')) {
          return res.status(400).json({
            error: 'Invalid contract address format.',
            details: 'Please provide a valid Ethereum/BSC address starting with 0x.',
            debug: errorDetails
          });
        } else {
          return res.status(404).json({
            error: 'Contract not verified. No source code found on testnet or mainnet.',
            details: 'Contract may not exist, may not be verified, or there may be an API issue.',
            debug: errorDetails
          });
        }
      }

    } catch (err) {
      console.error('Error fetching smart contract from BscScan:', err?.response?.data || err.message);

      // Provide more specific error handling
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Unable to connect to BSCScan API.',
          details: 'Network connectivity issue or BSCScan API is down.',
          debug: { error_code: err.code, message: err.message }
        });
      } else if (err?.response?.status === 403) {
        return res.status(403).json({
          error: 'BSCScan API access forbidden.',
          details: 'Invalid API key or API key permissions issue.',
          debug: err?.response?.data
        });
      } else if (err?.response?.status === 429) {
        return res.status(429).json({
          error: 'BSCScan API rate limit exceeded.',
          details: 'Too many requests. Please try again later.',
          debug: err?.response?.data
        });
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        return res.status(408).json({
          error: 'Request timeout.',
          details: 'BSCScan API took too long to respond.',
          debug: { timeout: '15 seconds', message: err.message }
        });
      }

      return res.status(500).json({
        error: 'Failed to fetch contract code from BscScan.',
        details: err?.response?.data || err.message,
        debug: {
          status: err?.response?.status,
          statusText: err?.response?.statusText
        }
      });
    }
  }

  // Final check
  if (!contractCode || contractCode.trim() === '') {
    return res.status(400).json({
      error: 'Smart contract code or contract address is required.',
      details: 'Please provide either contract source code directly or a valid verified contract address.'
    });
  }

  console.log('✓ Contract code obtained, proceeding with audit...');
  console.log('Contract code length:', contractCode.length);

  // Prepare prompt for AI
  const prompt = `
You are an expert blockchain security researcher and smart contract auditor.
Please:
1. Identify vulnerabilities (e.g., reentrancy, arithmetic overflows, authorization issues).
2. Explain potential attacker vectors and positive or negative impact.
3. Suggest remediations or secure patterns.
4. Highlight vulnerable code lines if possible.
5. Give an overall risk rating out of 10 (10 being very risky, 1 being very safe).
6. Return proper references or citations. No need to show code corrections. Use this code:
\`\`\`solidity
${contractCode}
\`\`\`
`;

  try {
    // Call Perplexity AI
    console.log('Sending contract to Perplexity AI for audit...');
    const aiRes = await ollama.chat({
      model: 'gpt-oss:120b-cloud',
        messages: [
          { role: 'system', content: 'You are a helpful smart contract audit agent.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiResult = aiRes.data?.choices?.[0]?.message?.content || 'No response from API';
    console.log('✓ Audit completed successfully');

    // Simple status detection
    let status = "Unknown";
    if (/vulnerab|risk|danger|critical|exploit/i.test(aiResult)) status = "Risky";
    else if (/no vulnerab|safe|secure|no issues/i.test(aiResult)) status = "Safe";

    res.json({ status, audit: aiResult });

  } catch (err) {
    console.error('Error auditing contract:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to audit contract.',
      details: err?.response?.data || err.message,
      debug: {
        perplexity_api_key_set: !!process.env.PERPLEXITY_API_KEY
      }
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.PERPLEXITY_API_KEY
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🛡️  Smart Contract Auditor API                       ║
║                                                        ║
║  Status: ✅ Running                                    ║
║  Port: ${PORT}                                        ║
║  URL: http://localhost:${PORT}                        ║
║                                                        ║
║  Endpoints:                                            ║
║  POST /audit - Full contract audit                    ║
║  POST /quick-scan - Quick security scan               ║
║  GET /health - Health check                           ║
║                                                        ║
║  API Key: ${process.env.OLLAMA_API_KEY ? '✅ Configured' : '❌ Missing'}                             ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Smart contract auditor running at http://localhost:${process.env.PORT}`);
});

