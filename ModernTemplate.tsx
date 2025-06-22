import { TemplateProps } from '@/types/invoice';

export function ModernTemplate({ invoiceData, theme }: TemplateProps) {
  const themeColors = {
    blue: { primary: 'hsl(207, 90%, 54%)', secondary: 'hsl(207, 84%, 66%)' },
    green: { primary: 'hsl(122, 39%, 49%)', secondary: 'hsl(122, 35%, 62%)' },
    orange: { primary: 'hsl(33, 100%, 48%)', secondary: 'hsl(33, 100%, 65%)' },
    purple: { primary: 'hsl(291, 64%, 42%)', secondary: 'hsl(291, 47%, 64%)' }
  };

  const colors = themeColors[theme];

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <div 
        className="rounded-lg p-6 mb-6" 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` 
        }}
      >
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{invoiceData.shopDetails.name}</h1>
          <p className="opacity-90">{invoiceData.shopDetails.address}</p>
          {invoiceData.shopDetails.gstin && (
            <p className="text-sm opacity-75 mt-1">GSTIN: {invoiceData.shopDetails.gstin}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Bill To</h3>
          <p className="font-medium">{invoiceData.customerDetails.name}</p>
          {invoiceData.customerDetails.contact && (
            <p className="text-sm text-gray-600">{invoiceData.customerDetails.contact}</p>
          )}
          {invoiceData.customerDetails.address && (
            <p className="text-sm text-gray-600">{invoiceData.customerDetails.address}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-right">
          <h3 className="font-semibold text-gray-900 mb-2">Invoice Details</h3>
          <p className="text-sm">
            Invoice #: <span className="font-medium">{invoiceData.invoiceNumber}</span>
          </p>
          <p className="text-sm">
            Date: <span className="font-medium">{invoiceData.date}</span>
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {invoiceData.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity} × ₹{item.price.toFixed(2)} ({item.gstPercent}% GST)
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{item.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{invoiceData.totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total GST:</span>
            <span>₹{invoiceData.totals.totalGST.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div 
              className="flex justify-between text-xl font-bold" 
              style={{ color: colors.primary }}
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
