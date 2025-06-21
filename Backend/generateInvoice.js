const PDFDocument = require('pdfkit');

function generateInvoice(res, data) {
    const doc = new PDFDocument();

    const fileName = `Maintenance_Invoice_${data.id}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res); // Start piping AFTER setting headers

    doc.fontSize(18).text('Maintenance Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${data.id}`);
    doc.text(`Name: ${data.name}`);
    doc.text(`Property ID: ${data.property_id}`);
    doc.text(`Mobile: ${data.mobile_number}`);
    doc.text(`Payment Method: ${data.payment_method}`);
    doc.text(`Amount: ₹${data.amount}`);
    doc.text(`Late Fee: ₹${data.late_fee || 0}`);
    doc.text(`Total Paid: ₹${(data.amount || 0) + (data.late_fee || 0)}`);
    doc.text(`Status: ${data.payment_status}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.end(); // Important: finalize the PDF
}

module.exports = generateInvoice;
