// app/powerbi/page.tsx
import React from 'react';

export default function PowerBIReportPage() {
    const pdfUrl = "/Top In-Demand Skills.pdf";

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
                📊 Power BI Analysis Report
            </h1>

            <embed
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="900px"
                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />

            {/* Alternative using iframe */}
            {/* 
      <iframe
        src={pdfUrl}
        width="100%"
        height="900px"
        style={{ border: 'none', borderRadius: 8 }}
      />
      */}
        </div>
    );
}
