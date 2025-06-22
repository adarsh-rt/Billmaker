import { Button } from '@/components/ui/button';
import { FileText, FileCheck, File, List } from 'lucide-react';
import { TemplateType } from '@/types/invoice';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    { id: 'classic' as const, name: 'Classic', icon: FileText },
    { id: 'modern' as const, name: 'Modern', icon: FileCheck },
    { id: 'simple' as const, name: 'Simple', icon: File },
    { id: 'itemized' as const, name: 'Itemized', icon: List },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="text-primary mr-2" size={20} />
        Choose Invoice Template
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Button
              key={template.id}
              variant={isSelected ? "default" : "outline"}
              className={`p-4 h-auto flex-col ${
                isSelected 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-gray-200 hover:border-primary"
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <Icon size={24} className="mb-2" />
              <span className="text-sm font-medium">{template.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
