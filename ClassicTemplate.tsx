import { TemplateProps } from '@/types/invoice';

export function ClassicTemplate({ invoiceData, theme }: TemplateProps) {
  const themeColors = {
    blue: 'hsl(207, 90%, 54%)',
    green: 'hsl(122, 39%, 49%)',
    orange: 'hsl(33, 100%, 48%)',
    purple: 'hsl(291, 64%, 42%)'
  };

  const primaryColor = themeColors[theme];

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <div className="border-b-2 pb-4 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl font-bold text-gray-900">{invoiceData.shopDetails.name}</h1>
        <p className="text-gray-600">{invoiceData.shopDetails.address}</p>
        {invoiceData.shopDetails.gstin && (
          <p className="text-sm text-gray-500">GSTIN: {invoiceData.shopDetails.gstin}</p>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bill To:</h2>
          <p className="font-medium">{invoiceData.customerDetails.name}</p>
          {invoiceData.customerDetails.contact && (
            <p className="text-sm text-gray-600">{invoiceData.customerDetails.contact}</p>
          )}
          {invoiceData.customerDetails.address && (
            <p className="text-sm text-gray-600">{invoiceData.customerDetails.address}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Invoice #: <span className="font-medium">{invoiceData.invoiceNumber}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date: <span className="font-medium">{invoiceData.date}</span>
          </p>
        </div>
      </div>
      
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr style={{ backgroundColor: primaryColor }}>
            <th className="border border-gray-300 px-4 py-2 text-left text-white">Item</th>
            <th className="border border-gray-300 px-4 py-2 text-right text-white">Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-right text-white">Price</th>
            <th className="border border-gray-300 px-4 py-2 text-right text-white">GST%</th>
            <th className="border border-gray-300 px-4 py-2 text-right text-white">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">₹{item.price.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.gstPercent}%</td>
              <td className="border border-gray-300 px-4 py-2 text-right">₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-6 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>₹{invoiceData.totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Total GST:</span>
            <span>₹{invoiceData.totals.totalGST.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 mt-2 pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total:</span>
              <span>₹{invoiceData.totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
