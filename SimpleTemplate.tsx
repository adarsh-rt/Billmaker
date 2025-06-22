import { TemplateProps } from '@/types/invoice';

export function SimpleTemplate({ invoiceData }: TemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white">
      <div className="text-center border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{invoiceData.shopDetails.name}</h1>
        <p className="text-gray-600">{invoiceData.shopDetails.address}</p>
        {invoiceData.shopDetails.gstin && (
          <p className="text-sm text-gray-500">GSTIN: {invoiceData.shopDetails.gstin}</p>
        )}
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">INVOICE</h2>
        <p className="text-sm">
          Invoice #: {invoiceData.invoiceNumber} | Date: {invoiceData.date}
        </p>
      </div>
      
      <div className="mb-6">
        <p><strong>Customer:</strong> {invoiceData.customerDetails.name}</p>
        {invoiceData.customerDetails.contact && (
          <p><strong>Contact:</strong> {invoiceData.customerDetails.contact}</p>
        )}
        {invoiceData.customerDetails.address && (
          <p><strong>Address:</strong> {invoiceData.customerDetails.address}</p>
        )}
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-2">Item</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Rate</th>
            <th className="text-right py-2">GST</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2">{item.name}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
              <td className="text-right py-2">{item.gstPercent}%</td>
              <td className="text-right py-2">₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-6 text-right space-y-1">
        <p>Subtotal: ₹{invoiceData.totals.subtotal.toFixed(2)}</p>
        <p>Total GST: ₹{invoiceData.totals.totalGST.toFixed(2)}</p>
        <p className="text-xl font-bold border-t border-gray-300 pt-2">
          Grand Total: ₹{invoiceData.totals.grandTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
