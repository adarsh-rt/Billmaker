import { InvoiceData, ThemeType } from '@/types/invoice';

export interface PDFOptions {
  paperSize: 'a4' | 'a5' | 'letter';
  orientation: 'portrait' | 'landscape';
  fontSize: 'small' | 'medium' | 'large';
}

declare global {
  interface Window {
    jspdf: {
      jsPDF: new (orientation?: string, unit?: string, format?: string) => any;
    };
  }
}

const themes = {
  blue: { primary: '#1976D2', secondary: '#42A5F5' },
  green: { primary: '#388E3C', secondary: '#66BB6A' },
  orange: { primary: '#F57C00', secondary: '#FFB74D' },
  purple: { primary: '#7B1FA2', secondary: '#BA68C8' }
};

export function generatePDF(invoiceData: InvoiceData, theme: ThemeType, options: PDFOptions = { paperSize: 'a4', orientation: 'portrait', fontSize: 'medium' }) {
  if (!window.jspdf) {
    console.error('jsPDF not loaded');
    return;
  }

  const { jsPDF } = window.jspdf;
  const orientation = options.orientation === 'landscape' ? 'l' : 'p';
  const doc = new jsPDF(orientation, 'mm', options.paperSize);
  const themeColors = themes[theme];
  
  // Font size multipliers based on option
  const fontSizeMultiplier = {
    small: 0.8,
    medium: 1.0,
    large: 1.2
  }[options.fontSize];
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);
  
  let yPos = margin;
  
  // Set font
  doc.setFont('helvetica');
  
  // Header Section
  doc.setFontSize(18 * fontSizeMultiplier);
  doc.setTextColor(themeColors.primary);
  doc.text(invoiceData.shopDetails.name, margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10 * fontSizeMultiplier);
  doc.setTextColor('#000000');
  
  // Wrap shop address
  const addressLines = doc.splitTextToSize(invoiceData.shopDetails.address, contentWidth * 0.6);
  addressLines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 4;
  });
  
  if (invoiceData.shopDetails.gstin) {
    doc.text(`GSTIN: ${invoiceData.shopDetails.gstin}`, margin, yPos);
    yPos += 6;
  }
  
  // Invoice details (right side)
  doc.setFontSize(14 * fontSizeMultiplier);
  doc.setTextColor(themeColors.primary);
  doc.text('INVOICE', pageWidth - margin - 30, margin + 5);
  
  doc.setFontSize(9 * fontSizeMultiplier);
  doc.setTextColor('#000000');
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, pageWidth - margin - 50, margin + 12);
  doc.text(`Date: ${invoiceData.date}`, pageWidth - margin - 50, margin + 18);
  
  yPos += 10;
  
  // Divider line
  doc.setLineWidth(0.5);
  doc.setDrawColor('#cccccc');
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;
  
  // Customer details
  doc.setFontSize(11 * fontSizeMultiplier);
  doc.setTextColor('#000000');
  doc.text('Bill To:', margin, yPos);
  yPos += 6;
  
  doc.setFontSize(10 * fontSizeMultiplier);
  doc.text(invoiceData.customerDetails.name, margin, yPos);
  yPos += 5;
  
  if (invoiceData.customerDetails.contact) {
    doc.text(invoiceData.customerDetails.contact, margin, yPos);
    yPos += 5;
  }
  
  if (invoiceData.customerDetails.address) {
    const custAddressLines = doc.splitTextToSize(invoiceData.customerDetails.address, contentWidth * 0.7);
    custAddressLines.forEach((line: string) => {
      doc.text(line, margin, yPos);
      yPos += 4;
    });
  }
  
  yPos += 8;
  
  // Table header
  const tableStartY = yPos;
  const rowHeight = 8;
  const headerHeight = 10;
  
  // Column positions and widths
  const col1 = margin;
  const col2 = margin + 80;
  const col3 = margin + 100;
  const col4 = margin + 130;
  const col5 = margin + 150;
  const tableWidth = contentWidth;
  
  // Header background
  doc.setFillColor(themeColors.primary);
  doc.rect(margin, yPos - 2, tableWidth, headerHeight, 'F');
  
  // Header text
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(9 * fontSizeMultiplier);
  doc.text('Item', col1 + 2, yPos + 5);
  doc.text('Qty', col2 + 2, yPos + 5);
  doc.text('Rate', col3 + 2, yPos + 5);
  doc.text('GST%', col4 + 2, yPos + 5);
  doc.text('Amount', col5 + 2, yPos + 5);
  
  yPos += headerHeight;
  
  // Table rows
  doc.setTextColor('#000000');
  doc.setFontSize(8 * fontSizeMultiplier);
  
  invoiceData.items.forEach((item) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    
    // Row background (alternating)
    if (invoiceData.items.indexOf(item) % 2 === 1) {
      doc.setFillColor('#f9f9f9');
      doc.rect(margin, yPos - 2, tableWidth, rowHeight, 'F');
    }
    
    // Wrap item name if too long
    const itemNameLines = doc.splitTextToSize(item.name, 75);
    const itemNameText = itemNameLines[0] + (itemNameLines.length > 1 ? '...' : '');
    
    doc.text(itemNameText, col1 + 2, yPos + 4);
    doc.text(item.quantity.toString(), col2 + 2, yPos + 4);
    doc.text(`₹${item.price.toFixed(2)}`, col3 + 2, yPos + 4);
    doc.text(`${item.gstPercent}%`, col4 + 2, yPos + 4);
    doc.text(`₹${item.total.toFixed(2)}`, col5 + 2, yPos + 4);
    
    yPos += rowHeight;
  });
  
  yPos += 5;
  
  // Totals section
  const totalsX = pageWidth - margin - 60;
  
  // Totals background
  doc.setFillColor('#f5f5f5');
  doc.rect(totalsX - 5, yPos - 2, 65, 25, 'F');
  
  doc.setFontSize(9 * fontSizeMultiplier);
  doc.text(`Subtotal: ₹${invoiceData.totals.subtotal.toFixed(2)}`, totalsX, yPos + 4);
  yPos += 6;
  doc.text(`Total GST: ₹${invoiceData.totals.totalGST.toFixed(2)}`, totalsX, yPos + 4);
  yPos += 8;
  
  // Grand total
  doc.setFontSize(11 * fontSizeMultiplier);
  doc.setTextColor(themeColors.primary);
  doc.text(`Grand Total: ₹${invoiceData.totals.grandTotal.toFixed(2)}`, totalsX, yPos + 4);
  
  // Footer
  yPos = pageHeight - 15;
  doc.setFontSize(7 * fontSizeMultiplier);
  doc.setTextColor('#666666');
  doc.text('Made with ❤️ for Indian shopkeepers', margin, yPos);
  doc.text('Bill Bana - Free GST Bill Generator', pageWidth - margin - 45, yPos);
  
  // Generate filename
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `Invoice_${invoiceData.invoiceNumber}_${timestamp}.pdf`;
  
  // Optimized mobile download
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    try {
      // Create blob with proper MIME type
      const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
      
      // Use modern download API if available
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Try native sharing on mobile
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        navigator.share({
          files: [file],
          title: 'Invoice PDF',
          text: 'Generated invoice from Bill Bana'
        }).catch(() => {
          // Fallback to download
          downloadBlob(pdfBlob, filename);
        });
      } else {
        downloadBlob(pdfBlob, filename);
      }
    } catch (error) {
      console.error('Mobile PDF generation error:', error);
      doc.save(filename);
    }
  } else {
    // Desktop - normal save
    doc.save(filename);
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function printInvoice(elementId: string) {
  const printWindow = window.open('', '_blank');
  const invoiceContent = document.getElementById(elementId)?.innerHTML;
  
  if (!invoiceContent) {
    console.error('Invoice content not found');
    return;
  }
  
  printWindow?.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body class="p-4">
      ${invoiceContent}
    </body>
    </html>
  `);
  
  printWindow?.document.close();
  printWindow?.focus();
  
  setTimeout(() => {
    printWindow?.print();
    printWindow?.close();
  }, 250);
}
