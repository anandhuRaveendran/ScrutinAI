/**
 * PDF Generation Utilities
 * Helper functions for generating professional audit report PDFs
 */

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Build complete HTML document for PDF generation
 */
function buildReportHTML({ title, htmlContent, generatedAt }) {
    const date = generatedAt ? new Date(generatedAt).toLocaleString() : new Date().toLocaleString();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #ffffff;
            color: #1f2937;
            line-height: 1.6;
        }
        
        h1 { 
            color: #04d9ff; 
            border-bottom: 4px solid #04d9ff;
            padding-bottom: 15px;
            margin-bottom: 20px;
            font-size: 32px;
        }
        
        h2 { 
            color: #04d9ff; 
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 24px;
        }
        
        h3 { 
            color: #04d9ff;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .header-info {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .header-info p {
            margin: 5px 0;
            color: #374151;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #e5e7eb;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #04d9ff;
            display: block;
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 13px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .vulnerability { 
            border: 2px solid #e5e7eb; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 10px;
            background: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }
        
        .vulnerability.critical { border-left: 6px solid #dc2626; }
        .vulnerability.high { border-left: 6px solid #ea580c; }
        .vulnerability.medium { border-left: 6px solid #ca8a04; }
        .vulnerability.low { border-left: 6px solid #04d9ff; }
        
        pre { 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 8px; 
            overflow-x: auto;
            border: 1px solid #d1d5db;
            font-size: 11px;
            font-family: 'Courier New', monospace;
            line-height: 1.5;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .badge { 
            display: inline-block; 
            padding: 6px 14px; 
            border-radius: 20px; 
            color: white; 
            font-size: 11px; 
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .badge-critical { background: #dc2626; }
        .badge-high { background: #ea580c; }
        .badge-medium { background: #ca8a04; }
        .badge-low { background: #04d9ff; }
        
        .recommendation-section {
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            border-left: 5px solid;
        }
        
        .rec-immediate { 
            background: #fef2f2; 
            border-left-color: #dc2626; 
        }
        
        .rec-best { 
            background: #fef3c7; 
            border-left-color: #f59e0b; 
        }
        
        .rec-longterm { 
            background: #e0f9ff; 
            border-left-color: #04d9ff; 
        }
        
        .recommendation-section h3 {
            margin-top: 0;
            margin-bottom: 15px;
        }
        
        .recommendation-section ul {
            padding-left: 20px;
        }
        
        .recommendation-section li {
            margin: 8px 0;
            color: #374151;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        
        .footer p {
            margin: 10px 0;
        }
        
        @media print {
            body { padding: 20px; }
            .vulnerability { page-break-inside: avoid; }
            .recommendation-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <h1>🛡️ Smart Contract Security Audit Report</h1>
    
    <div class="header-info">
        <p><strong>Generated:</strong> ${date}</p>
        <p><strong>Audit Type:</strong> Comprehensive AI-Powered Security Analysis</p>
    </div>
    
    ${htmlContent}
    
    <div class="footer">
        <p><strong>Disclaimer:</strong> This audit report is generated using AI and should be reviewed by security professionals before deployment.</p>
        <p>© ${new Date().getFullYear()} ScrutinAI - Smart Contract Auditor</p>
    </div>
</body>
</html>
    `.trim();
}

module.exports = {
    escapeHtml,
    buildReportHTML
};
