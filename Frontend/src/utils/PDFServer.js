// callPDFServer.js (client-side)
async function downloadReportPdfServer({ htmlContent, auditData, fileName = 'audit-report.pdf' }) {
    const res = await fetch('http://localhost:3001/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlContent, auditData, fileName }),
    });
    if (!res.ok) throw new Error('PDF download failed: ' + await res.text());
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export { downloadReportPdfServer };
