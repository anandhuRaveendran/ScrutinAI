require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.post('/audit', async (req, res) => {
  const contractCode = req.body.code;

  if (!contractCode) {
    return res.status(400).json({ error: 'Smart contract code is required.' });
  }


  const prompt = `
You are an expert blockchain security researcher and smart contract auditor. 
Please: 

1. Identify vulnerabilities (e.g., reentrancy, arithmetic overflows, authorization issues). 
2. Explain potential attacker vectors and positive or negative impact. 
3. Suggest remediations or secure patterns. 
4. Highlight vulnerable code lines if possible. 
5. Return proper references or citations. No need to show code corrections. 
6. Whether the contract is considered Safe or Risky
- A risk score out of 10 (1 = very safe, 10 = very risky)
Do not include detailed explanations.
Example response:
"Risky: 7/10"

Use this code: 

\`\`\`solidity
${contractCode}
\`\`\`
`;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: 'You are a helpful smart contract audit agent.' },
          { role: 'user', content : prompt}
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResult = response.data?.choices?.[0]?.message?.content || 'No response from API';

    res.status(200).json({ audit: aiResult });
  } catch (err) {
    console.error('Error auditing contract:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to audit contract.' });
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
    const aiRes = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro',
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
    const aiRes = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro',
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

app.listen(process.env.PORT, () => {
  console.log(`✅ Smart contract auditor running at http://localhost:${process.env.PORT}`);
});

	