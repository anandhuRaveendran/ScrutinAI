import React, { useState, useRef } from "react";
import { Shield, AlertTriangle, Code, X, Maximize2, Download, CheckCircle } from "lucide-react";
import { downloadReportPdfServer } from '../../utils/PDFServer';

const SeverityBadge = ({ severity }) => {
  const colors = {
    Critical: 'bg-red-600',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-[#04d9ff]'
  };

  return (
    <span className={`${colors[severity] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
      {severity}
    </span>
  );
};

const RiskScoreGauge = ({ score, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;
  const getColor = () => {
    if (score >= 8) return '#ef4444';
    if (score >= 5) return '#f59e0b';
    return '#10b981';
  };

  const getLabel = () => {
    if (score >= 8) return 'Critical Risk';
    if (score >= 5) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle cx="64" cy="64" r="56" stroke="#2d3748" strokeWidth="10" fill="transparent" />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={getColor()}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold" style={{ color: getColor() }}>
            {score}
          </span>
          <span className="text-xs text-gray-400">/ {maxScore}</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="text-sm font-bold" style={{ color: getColor() }}>
          {getLabel()}
        </div>
      </div>
    </div>
  );
};

const VulnerabilityCard = ({ vuln, index }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-[#0f172a] rounded-lg p-4 mb-3 border border-gray-700 hover:border-[#04d9ff] transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-500">#{index + 1}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{vuln.name}</h3>
            {vuln.location && (
              <p className="text-xs text-gray-400 mt-1">📍 {vuln.location}</p>
            )}
          </div>
        </div>
        <SeverityBadge severity={vuln.severity} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs font-semibold text-[#04d9ff] mb-1">⚔️ Attack Vector</div>
          <p className="text-xs text-gray-300">{vuln.vector}</p>
        </div>
        <div>
          <div className="text-xs font-semibold text-red-400 mb-1">💥 Impact</div>
          <p className="text-xs text-gray-300">{vuln.impact}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-semibold text-green-400 mb-1">✅ Remediation</div>
        <p className="text-xs text-gray-300">{vuln.remediation}</p>
      </div>

      {vuln.vulnerableCode && vuln.fixedCode && (
        <>
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 text-[#04d9ff] hover:text-[#06f0ff] text-xs font-semibold"
          >
            <Code size={14} />
            {showCode ? 'Hide' : 'Show'} Code Comparison
          </button>

          {showCode && (
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <div className="bg-red-900/20 border border-red-500/50 rounded p-2 mb-2">
                  <span className="text-red-400 font-semibold text-xs">❌ Vulnerable Code</span>
                </div>
                <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto text-red-300 max-h-48">
                  <code>{vuln.vulnerableCode}</code>
                </pre>
              </div>
              <div>
                <div className="bg-green-900/20 border border-green-500/50 rounded p-2 mb-2">
                  <span className="text-green-400 font-semibold text-xs">✅ Fixed Code</span>
                </div>
                <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto text-green-300 max-h-48">
                  <code>{vuln.fixedCode}</code>
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      {vuln.references && vuln.references.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs font-semibold text-[#04d9ff] mb-1">📚 References</div>
          <ul className="text-xs text-gray-400 space-y-1">
            {vuln.references.map((ref, idx) => (
              <li key={idx}>• {ref}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const downloadPDF = (reportRef) => {
  const element = reportRef.current;
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <html>
      <head>
        <title>Smart Contract Audit Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
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
          .critical { border-left: 6px solid #dc2626; }
          .high { border-left: 6px solid #ea580c; }
          .medium { border-left: 6px solid #ca8a04; }
          .low { border-left: 6px solid #04d9ff; }
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
          .recommendation-box {
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
          .vuln-section {
            margin-bottom: 15px;
          }
          .vuln-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
            font-size: 13px;
          }
          .vuln-content {
            color: #6b7280;
            font-size: 13px;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin: 8px 0;
          }
          .page-break {
            page-break-after: always;
          }
          @media print {
            body { padding: 20px; }
            .vulnerability { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>🛡️ Smart Contract Security Audit Report</h1>
        <div class="header-info">
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Audit Type:</strong> Comprehensive AI-Powered Security Analysis</p>
        </div>
        ${element.innerHTML}
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p><strong>Disclaimer:</strong> This audit report is generated using AI and should be reviewed by security professionals before deployment.</p>
          <p style="margin-top: 10px;">© ${new Date().getFullYear()} Smart Contract Auditor</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export default function AuditReportModal({ open, onClose, report }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);

      // Get audit data from report
      const auditData = report.audit || report;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `audit-report-${timestamp}.pdf`;

      // Call the PDF generation API
      await downloadReportPdfServer({
        auditData,
        fileName
      });

      console.log('✅ PDF downloaded successfully');
    } catch (err) {
      console.error('❌ PDF Download Error:', err);
      alert('Failed to download PDF: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!open || !report) return null;

  // Handle both old text format and new structured format
  const auditData = report.audit || report;
  const isStructured = auditData.vulnerabilities && Array.isArray(auditData.vulnerabilities);

  // Fallback for non-structured response
  if (!isStructured) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
        <div className="relative bg-[#1A2536] text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          <button onClick={onClose} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-white z-10">
            <X size={24} />
          </button>
          <div className="text-2xl font-bold text-center py-5 border-b border-[#23262F]">
            Audit Report
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 text-sm">
                ⚠️ <strong>Note:</strong> The audit report is in legacy text format.
                For structured analysis with code fixes, please try again.
              </p>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded">
              {auditData.rawReport || (typeof auditData === 'string' ? auditData : JSON.stringify(auditData, null, 2))}
            </pre>
          </div>
          <div className="border-t border-gray-700 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#04d9ff] hover:bg-[#03b8d9] text-black font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div
        className={`relative bg-[#1A2536] text-white rounded-xl shadow-2xl flex flex-col
          ${fullscreen ? "w-full h-full" : "w-full max-w-6xl h-[90vh]"}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#04d9ff] to-[#0ea5e9] rounded-t-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Smart Contract Audit Report</h1>
              <p className="text-black/70 text-xs font-medium">AI-Powered Security Analysis</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              title="Toggle Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${isDownloading
                ? 'bg-white/10 cursor-not-allowed opacity-50'
                : 'bg-white/20 hover:bg-white/30'
                }`}
              title={isDownloading ? 'Generating PDF...' : 'Download PDF'}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={18} />
                  PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-4 border-b border-gray-700 overflow-x-auto">
          {['overview', 'vulnerabilities', 'recommendations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all whitespace-nowrap ${activeTab === tab
                ? 'bg-[#04d9ff] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={reportRef} className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Risk Score */}
              <div className="bg-[#0f172a] rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold mb-4">Overall Risk Assessment</h2>
                <div className="flex justify-center items-center gap-8 flex-wrap">
                  <RiskScoreGauge score={auditData.riskScore || 0} />
                  <div className="text-left">
                    <div className="text-sm text-gray-400">Contract Status</div>
                    <div className={`text-3xl font-bold mt-2 ${auditData.riskScore >= 7 ? 'text-red-500' :
                      auditData.riskScore >= 4 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                      {auditData.status || 'Unknown'}
                    </div>
                    {report.timestamp && (
                      <div className="text-xs text-gray-500 mt-2">
                        Audited: {new Date(report.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="bg-[#0f172a] rounded-lg p-3 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-[#04d9ff]">{auditData.summary?.totalVulnerabilities || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Total Issues</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-3 text-center border border-red-500">
                  <div className="text-2xl font-bold text-red-400">{auditData.summary?.critical || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Critical</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-3 text-center border border-orange-500">
                  <div className="text-2xl font-bold text-orange-400">{auditData.summary?.high || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">High</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-3 text-center border border-yellow-500">
                  <div className="text-2xl font-bold text-yellow-400">{auditData.summary?.medium || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Medium</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-3 text-center border border-[#04d9ff]">
                  <div className="text-2xl font-bold text-[#04d9ff]">{auditData.summary?.low || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Low</div>
                </div>
              </div>

              {/* Success Message if No Vulnerabilities */}
              {auditData.summary?.totalVulnerabilities === 0 && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">Contract Looks Good! ✨</h3>
                  <p className="text-gray-300 text-sm">
                    No major vulnerabilities detected. However, always conduct a professional audit before mainnet deployment.
                  </p>
                </div>
              )}

              {/* Vulnerability Distribution */}
              {auditData.summary && auditData.summary.totalVulnerabilities > 0 && (
                <div className="bg-[#0f172a] rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3">Vulnerability Distribution</h3>
                  <div className="space-y-2">
                    {[
                      { severity: 'Critical', count: auditData.summary.critical, color: 'bg-red-500' },
                      { severity: 'High', count: auditData.summary.high, color: 'bg-orange-500' },
                      { severity: 'Medium', count: auditData.summary.medium, color: 'bg-yellow-500' },
                      { severity: 'Low', count: auditData.summary.low, color: 'bg-[#04d9ff]' }
                    ].map(item => {
                      const percentage = auditData.summary.totalVulnerabilities > 0
                        ? (item.count / auditData.summary.totalVulnerabilities) * 100
                        : 0;
                      return (
                        <div key={item.severity} className="flex items-center gap-3">
                          <div className="w-20">
                            <SeverityBadge severity={item.severity} />
                          </div>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className={`${item.color} h-2 rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-16 text-right text-sm text-gray-300">
                            {item.count} ({percentage.toFixed(0)}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vulnerabilities' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Detailed Vulnerability Analysis</h2>
              {auditData.vulnerabilities && auditData.vulnerabilities.length > 0 ? (
                auditData.vulnerabilities.map((vuln, idx) => (
                  <VulnerabilityCard key={vuln.id || idx} vuln={vuln} index={idx} />
                ))
              ) : (
                <div className="text-center text-gray-400 py-12 bg-[#0f172a] rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg">No vulnerabilities detected</p>
                  <p className="text-sm mt-2">This contract appears to be secure based on AI analysis.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Security Recommendations</h2>

              {auditData.recommendations?.immediate && auditData.recommendations.immediate.length > 0 && (
                <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-md font-bold text-red-400 mb-2">🚨 Immediate Actions Required</h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {auditData.recommendations.immediate.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {auditData.recommendations?.bestPractices && auditData.recommendations.bestPractices.length > 0 && (
                <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-start gap-3">
                    <Shield className="text-yellow-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-md font-bold text-yellow-400 mb-2">⚡ Best Practices</h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {auditData.recommendations.bestPractices.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {auditData.recommendations?.longTerm && auditData.recommendations.longTerm.length > 0 && (
                <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#04d9ff]">
                  <div className="flex items-start gap-3">
                    <Shield className="text-[#04d9ff] w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-md font-bold text-[#04d9ff] mb-2">🎯 Long-term Improvements</h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {auditData.recommendations.longTerm.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {(!auditData.recommendations ||
                (auditData.recommendations.immediate?.length === 0 &&
                  auditData.recommendations.bestPractices?.length === 0 &&
                  auditData.recommendations.longTerm?.length === 0)) && (
                  <div className="text-center text-gray-400 py-12 bg-[#0f172a] rounded-lg">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg">No specific recommendations</p>
                    <p className="text-sm mt-2">The contract follows good security practices.</p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-3 text-center text-xs text-gray-400">
          AI-Powered Smart Contract Auditor • Generated {new Date().toLocaleDateString()} •
          <span className="text-yellow-400 ml-1">⚠️ Always perform professional audits before mainnet deployment</span>
        </div>
      </div>
    </div>
  );
}