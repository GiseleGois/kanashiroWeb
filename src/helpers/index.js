import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateAndSendExcel = (invoiceData, handleSendInvoice) => {
  const worksheet = XLSX.utils.json_to_sheet(invoiceData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'InvoiceData');

  // Generate a unique filename for the Excel file
  const fileName = `invoice_data_${new Date().getTime()}.xlsx`;

  // Convert the workbook to a binary string
  const excelData = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

  // Create a Blob from the binary string
  const blob = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });

  // Save the Excel file using file-saver
  saveAs(blob, fileName);

  // Call the handleSendInvoice function with the phone number as an argument
  handleSendInvoice(invoiceData[0].phone);
};

// Utility function to convert a string to an ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
