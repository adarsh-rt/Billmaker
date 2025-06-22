export interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  gstPercent: number;
  subtotal: number;
  gstAmount: number;
  total: number;
}

export interface ShopDetails {
  name: string;
  address: string;
  gstin: string;
}

export interface CustomerDetails {
  name: string;
  contact: string;
  address: string;
}

export interface InvoiceTotals {
  subtotal: number;
  totalGST: number;
  grandTotal: number;
}

export interface InvoiceData {
  shopDetails: ShopDetails;
  customerDetails: CustomerDetails;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  invoiceNumber: string;
  date: string;
}

export type TemplateType = 'classic' | 'modern' | 'simple' | 'itemized';
export type ThemeType = 'blue' | 'green' | 'orange' | 'purple';

export interface TemplateProps {
  invoiceData: InvoiceData;
  theme: ThemeType;
}
