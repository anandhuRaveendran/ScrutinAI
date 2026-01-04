require("dotenv").config();

const express = require("express");
const isAuth = require("../middleware/isAuth");
const { Ollama } = require("ollama");

const router = express.Router();

/* ============================
   OLLAMA CLIENT (CLOUD SETUP)
   ============================ */
const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
    },
});

/* ============================
   AUDIT ROUTE
   ============================ */
router.post("/audit", isAuth, async (req, res) => {
    const contractCode = req.body.code;

    if (!contractCode) {
        return res.status(400).json({ error: "Smart contract code is required." });
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

CRITICAL: Ensure the JSON is complete and properly closed. Return ONLY valid JSON.

Contract to analyze:

\`\`\`solidity
${contractCode}
\`\`\`
`;

    try {
        console.log("🤖 Sending to OLLAMA...");

        const stream = await ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a smart contract security auditor. You MUST respond with ONLY valid JSON, with no markdown formatting, no code blocks, and no additional text. The response must be parseable by JSON.parse(). Ensure the JSON is COMPLETE with all closing brackets.",
                },
                { role: "user", content: prompt },
            ],
            stream: true,
            options: {
                temperature: 0.2,
                num_predict: 12000,
            },
        });

        let aiResult = "";

        for await (const chunk of stream) {
            aiResult += chunk.message.content;
        }

        console.log("✅ Received AI response");
        console.log("Response length:", aiResult.length);

        if (!aiResult || aiResult.trim() === "" || aiResult === "{}") {
            return res.status(500).json({
                error: "AI returned empty response",
            });
        }

        /* -------- Clean AI Output -------- */
        aiResult = aiResult
            .trim()
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        /* -------- Parse JSON -------- */
        try {
            const auditData = JSON.parse(aiResult);

            if (!auditData.riskScore || !auditData.summary || !auditData.vulnerabilities) {
                return res.status(200).json({
                    success: true,
                    audit: {
                        riskScore: auditData.riskScore || 5,
                        status: auditData.status || "Unknown",
                        summary: auditData.summary || {
                            totalVulnerabilities: 0,
                            critical: 0,
                            high: 0,
                            medium: 0,
                            low: 0,
                            gasOptimizations: 0,
                        },
                        vulnerabilities: auditData.vulnerabilities || [],
                        recommendations: auditData.recommendations || {
                            immediate: ["Incomplete AI response – manual review recommended"],
                            bestPractices: [],
                            longTerm: [],
                        },
                    },
                    warning: "Incomplete AI response",
                    timestamp: new Date().toISOString(),
                    contractLength: contractCode.length,
                });
            }

            return res.status(200).json({
                success: true,
                audit: auditData,
                timestamp: new Date().toISOString(),
                contractLength: contractCode.length,
            });

        } catch (parseError) {
            console.error("❌ JSON Parse Error:", parseError.message);

            return res.status(200).json({
                success: true,
                audit: {
                    riskScore: 5,
                    status: "Unknown",
                    summary: {
                        totalVulnerabilities: 0,
                        critical: 0,
                        high: 0,
                        medium: 0,
                        low: 0,
                        gasOptimizations: 0,
                    },
                    vulnerabilities: [],
                    recommendations: {
                        immediate: ["AI response format error – manual review required"],
                        bestPractices: [parseError.message],
                        longTerm: [],
                    },
                    rawReport: aiResult.substring(0, 1000),
                },
                parseError: true,
                timestamp: new Date().toISOString(),
                contractLength: contractCode.length,
            });
        }

    } catch (err) {
        console.error("❌ Error during audit:", err);
        return res.status(500).json({
            error: "Failed to audit contract",
            details: err.message || "Unknown error occurred",
        });
    }
});


router.post("/generate-pdf", isAuth, async (req, res) => {

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

module.exports = router;
