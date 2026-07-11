import { jsPDF } from "jspdf";

function DownloadReport({ analysis }) {
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("ResumeIQ", 20, 20);

    doc.setFontSize(14);
    doc.text("AI Resume Analysis Report", 20, 30);

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(16);
    doc.text(`ATS Score: ${analysis.ats_score}%`, 20, 50);

    doc.setFontSize(14);
    doc.text("Overall Feedback", 20, 65);

    const feedback = doc.splitTextToSize(
      analysis.overall_feedback,
      170
    );

    doc.text(feedback, 20, 75);

    let y = 75 + feedback.length * 8 + 10;

    doc.setFontSize(14);
    doc.text("Detected Skills", 20, y);

    y += 10;

    analysis.detected_skills.forEach((skill) => {
      doc.text(`• ${skill}`, 25, y);
      y += 8;
    });

    y += 8;

    doc.text("Recommendations", 20, y);

    y += 10;

    analysis.recommendations.forEach((item) => {
      const text = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(text, 25, y);
      y += text.length * 8;
    });

    doc.save("ResumeIQ_Report.pdf");
  };

  return (
    <button
      onClick={downloadPDF}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
    >
      ⬇ Download Report
    </button>
  );
}

export default DownloadReport;