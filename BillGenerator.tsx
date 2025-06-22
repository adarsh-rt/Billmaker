import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Download, Printer, Heart } from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';
import { ShopDetailsForm } from './ShopDetailsForm';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { ItemsManager } from './ItemsManager';
import { InvoicePreview } from './InvoicePreview';
import { PDFOptionsDialog } from './PDFOptionsDialog';
import { generatePDF, printInvoice, type PDFOptions } from '@/lib/pdfGenerator';
import { 
  InvoiceItem, 
  ShopDetails, 
  CustomerDetails, 
  InvoiceData, 
  TemplateType, 
  ThemeType 
} from '@/types/invoice';

export function BillGenerator() {
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [theme, setTheme] = useState<ThemeType>('blue');
  const [shopDetails, setShopDetails] = useState<ShopDetails>({
    name: '',
    address: '',
    gstin: '',
  });
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    contact: '',
    address: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Apply theme class to document root
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  // Initialize with one item
  useEffect(() => {
    if (items.length === 0) {
      setItems([{
        id: Date.now(), // Use timestamp for unique ID
        name: '',
        quantity: 1,
        price: 0,
        gstPercent: 18,
        subtotal: 0,
        gstAmount: 0,
        total: 0,
      }]);
    }
  }, [items.length]);

  const calculateTotals = () => {
    const validItems = items.filter(item => item.name.trim() !== '' && item.quantity > 0 && item.price > 0);
    
    let subtotal = 0;
    let totalGST = 0;
    
    validItems.forEach(item => {
      subtotal += item.subtotal;
      totalGST += item.gstAmount;
    });
    
    const grandTotal = subtotal + totalGST;
    
    return {
      subtotal,
      totalGST,
      grandTotal,
    };
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV${year}${month}${day}${random}`;
  };

  const createInvoiceData = (): InvoiceData => {
    const validItems = items.filter(item => item.name.trim() !== '' && item.quantity > 0 && item.price > 0);
    const totals = calculateTotals();
    
    return {
      shopDetails: {
        name: shopDetails.name || 'Your Shop Name',
        address: shopDetails.address || 'Your Shop Address',
        gstin: shopDetails.gstin,
      },
      customerDetails: {
        name: customerDetails.name || 'Customer Name',
        contact: customerDetails.contact,
        address: customerDetails.address,
      },
      items: validItems,
      totals,
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toLocaleDateString('en-IN'),
    };
  };

  const handleGeneratePDF = (options: PDFOptions) => {
    const invoiceData = createInvoiceData();
    generatePDF(invoiceData, theme, options);
  };

  const handlePrint = () => {
    printInvoice('invoicePreview');
  };

  const invoiceData = createInvoiceData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Receipt className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Bill Bana</h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  GST Bill Generator for Small Shops
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={theme} onValueChange={(value: ThemeType) => setTheme(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue Theme</SelectItem>
                  <SelectItem value="green">Green Theme</SelectItem>
                  <SelectItem value="orange">Orange Theme</SelectItem>
                  <SelectItem value="purple">Purple Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <TemplateSelector 
              selectedTemplate={template}
              onTemplateChange={setTemplate}
            />
            
            <ShopDetailsForm 
              shopDetails={shopDetails}
              onShopDetailsChange={setShopDetails}
            />
            
            <CustomerDetailsForm 
              customerDetails={customerDetails}
              onCustomerDetailsChange={setCustomerDetails}
            />
            
            <ItemsManager 
              items={items}
              onItemsChange={setItems}
            />
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <PDFOptionsDialog onGeneratePDF={handleGeneratePDF} />
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Printer className="mr-2" size={16} />
                Print Invoice
              </Button>
            </div>
          </div>

          {/* Invoice Preview */}
          <InvoicePreview 
            invoiceData={invoiceData}
            template={template}
            theme={theme}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600">
              Made with <Heart className="inline text-red-500" size={16} /> for Indian shopkeepers
            </p>
            <p className="text-sm text-gray-500 mt-1">Bill Bana - Free GST Bill Generator</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
