import { Eye } from 'lucide-react';
import { InvoiceData, TemplateType, ThemeType } from '@/types/invoice';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { SimpleTemplate } from './templates/SimpleTemplate';
import { ItemizedTemplate } from './templates/ItemizedTemplate';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  template: TemplateType;
  theme: ThemeType;
}

export function InvoicePreview({ invoiceData, template, theme }: InvoicePreviewProps) {
  const renderTemplate = () => {
    const props = { invoiceData, theme };
    
    switch (template) {
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'simple':
        return <SimpleTemplate {...props} />;
      case 'itemized':
        return <ItemizedTemplate {...props} />;
      default:
        return <ClassicTemplate {...props} />;
    }
  };

  const hasItems = invoiceData.items.length > 0 && invoiceData.items.some(item => item.name.trim() !== '');

  return (
    <div className="lg:sticky lg:top-24 lg:h-fit">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="text-primary mr-2" size={20} />
          Invoice Preview
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div id="invoicePreview" className="invoice-preview bg-white p-6">
            {hasItems ? (
              renderTemplate()
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Eye size={48} className="mx-auto mb-4 opacity-50" />
                <p>Fill in the details to see invoice preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
