const PDFDocument = require('pdfkit');
const Payroll = require('../models/Payroll');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.generatePayslip = async (req, res) => {
    try {
        const { payrollId, recordId } = req.params;

        const payroll = await Payroll.findById(payrollId);
        if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

        const record = payroll.records.id(recordId);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        // Create a document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Payslip_${record.employeeName}_${payroll.month}_${payroll.year}.pdf`);

        // Pipe the document to the response
        doc.pipe(res);

        // --- PDF Content ---

        // Header
        doc.fontSize(20).text('SalaryBook', { align: 'center' });
        doc.fontSize(12).text('Smart Payroll Management System', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('PAYSLIP', { align: 'center', underline: true });
        doc.fontSize(12).text(`${payroll.month} ${payroll.year}`, { align: 'center' });
        doc.moveDown();

        // Employee Details
        doc.rect(50, 150, 500, 80).stroke();
        doc.fontSize(10);

        const leftColX = 60;
        const leftColValueX = 150;
        const rightColX = 300;
        const rightColValueX = 400;
        const row1Y = 160;
        const row2Y = 180;
        const row3Y = 200;

        doc.text('Employee Name:', leftColX, row1Y).text(record.employeeName, leftColValueX, row1Y, { bold: true });
        doc.text('Designation:', rightColX, row1Y).text(record.designation, rightColValueX, row1Y);

        doc.text('Department:', leftColX, row2Y).text(record.department, leftColValueX, row2Y);
        doc.text('Pay Period:', rightColX, row2Y).text(`${payroll.month} ${payroll.year}`, rightColValueX, row2Y);

        doc.text('Status:', leftColX, row3Y).text(record.status === 'Paid' ? 'PAID' : 'PROCESSED', leftColValueX, row3Y);

        doc.moveDown(4);

        // Financials Table
        const tableTop = 260;
        doc.font('Helvetica-Bold');
        doc.text('Earnings', 60, tableTop);
        doc.text('Amount', 200, tableTop, { align: 'right' });
        doc.text('Deductions', 300, tableTop);
        doc.text('Amount', 450, tableTop, { align: 'right' });
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        doc.font('Helvetica');

        let y = tableTop + 25;

        // Earnings List
        const earnings = [
            { label: 'Basic Salary', value: record.baseSalary },
            { label: 'House Rent Allowance', value: record.allowanceDetails.houseRent },
            { label: 'Transport Allowance', value: record.allowanceDetails.transport },
            { label: 'Medical Allowance', value: record.allowanceDetails.medical },
            { label: 'Other Allowances', value: record.allowanceDetails.other },
            { label: 'Overtime', value: record.allowanceDetails.overtime },
        ];

        // Deductions List
        const deductions = [
            { label: 'Income Tax', value: record.deductionDetails.tax },
            { label: 'Provident Fund', value: record.deductionDetails.providentFund },
            { label: 'Loan Repayment', value: record.deductionDetails.loanRepayment },
            { label: 'Other Deductions', value: record.deductionDetails.other },
        ];

        const maxRows = Math.max(earnings.length, deductions.length);

        for (let i = 0; i < maxRows; i++) {
            const earn = earnings[i];
            const ded = deductions[i];

            if (earn) {
                doc.text(earn.label, 60, y);
                doc.text(earn.value.toLocaleString(), 200, y, { align: 'right' });
            }
            if (ded) {
                doc.text(ded.label, 300, y);
                doc.text(ded.value.toLocaleString(), 450, y, { align: 'right' });
            }
            y += 20;
        }

        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 10;

        // Totals
        doc.font('Helvetica-Bold');
        doc.text('Total Earnings', 60, y);
        doc.text(record.grossPay.toLocaleString(), 200, y, { align: 'right' });

        doc.text('Total Deductions', 300, y);
        doc.text(record.totalDeductions.toLocaleString(), 450, y, { align: 'right' });

        y += 30;
        doc.rect(50, y, 500, 30).fill('#f0f0f0').stroke();
        doc.fillColor('black').fontSize(12).text('NET PAY', 60, y + 8);
        doc.text(`$${record.netPay.toLocaleString()}`, 450, y + 8, { align: 'right' });

        // Footer
        doc.fontSize(10).text('This is a computer-generated document and does not require a signature.', 50, 700, { align: 'center', color: 'gray' });

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Error generating payslip:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
