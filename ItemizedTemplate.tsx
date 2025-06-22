import { TemplateProps } from '@/types/invoice';

export function ItemizedTemplate({ invoiceData, theme }: TemplateProps) {
  const themeColors = {
    blue: 'hsl(207, 90%, 54%)',
    green: 'hsl(122, 39%, 49%)',
    orange: 'hsl(33, 100%, 48%)',
    purple: 'hsl(291, 64%, 42%)'
  };

  const primaryColor = themeColors[theme];

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
            {invoiceData.shopDetails.name}
          </h1>
          <p className="text-gray-600">{invoiceData.shopDetails.address}</p>
          {invoiceData.shopDetails.gstin && (
            <p className="text-sm text-gray-500">GSTIN: {invoiceData.shopDetails.gstin}</p>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
          <p className="text-sm text-gray-600">#{invoiceData.invoiceNumber}</p>
          <p className="text-sm text-gray-600">{invoiceData.date}</p>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Customer Information</h3>
        <p>{invoiceData.customerDetails.name}</p>
        {invoiceData.customerDetails.contact && <p>{invoiceData.customerDetails.contact}</p>}
        {invoiceData.customerDetails.address && <p>{invoiceData.customerDetails.address}</p>}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Items</h3>
        {invoiceData.items.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{index + 1}. {item.name}</h4>
              <span className="font-bold text-lg">₹{item.total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Quantity: {item.quantity}</p>
                <p>Unit Price: ₹{item.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p>GST Rate: {item.gstPercent}%</p>
                <p>GST Amount: ₹{item.gstAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-sm">
                Subtotal: ₹{item.subtotal.toFixed(2)} + GST: ₹{item.gstAmount.toFixed(2)} = ₹{item.total.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div 
        className="mt-6 p-4 rounded-lg" 
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Amount (Before Tax):</span>
            <span>₹{invoiceData.totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total GST:</span>
            <span>₹{invoiceData.totals.totalGST.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div 
              className="flex justify-between text-xl font-bold" 
              style={{ color: primaryColor }}
            >
              <span>Grand Total:</span>
              <span>₹{invoiceData.totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
