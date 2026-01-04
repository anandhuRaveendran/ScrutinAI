// callPDFServer.js (client-side)
/**
 * Download Audit Report as PDF from Server
 * Calls the backend PDF generation API and triggers download
 */
async function downloadReportPdfServer({ htmlContent, auditData, fileName = 'audit-report.pdf' }) {
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        const res = await fetch(`${apiUrl}/audit/generate-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important: Include cookies for authentication
            body: JSON.stringify({ htmlContent, auditData, fileName }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`PDF download failed: ${errorText}`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('PDF Download Error:', error);
        throw error;
    }
}

export { downloadReportPdfServer };
