import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Settings } from 'lucide-react';

interface PDFOptionsDialogProps {
  onGeneratePDF: (options: PDFOptions) => void;
}

export interface PDFOptions {
  paperSize: 'a4' | 'a5' | 'letter';
  orientation: 'portrait' | 'landscape';
  fontSize: 'small' | 'medium' | 'large';
}

export function PDFOptionsDialog({ onGeneratePDF }: PDFOptionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PDFOptions>({
    paperSize: 'a4',
    orientation: 'portrait',
    fontSize: 'medium'
  });

  const handleGeneratePDF = () => {
    onGeneratePDF(options);
    setIsOpen(false);
  };

  const paperSizes = [
    { value: 'a4', label: 'A4 (210 × 297 mm)', description: 'Standard size' },
    { value: 'a5', label: 'A5 (148 × 210 mm)', description: 'Compact, mobile-friendly' },
    { value: 'letter', label: 'Letter (8.5 × 11 in)', description: 'US standard' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Download className="mr-2" size={16} />
          Download PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2" size={18} />
            PDF Options
          </DialogTitle>
          <DialogDescription>
            Customize your PDF format, size, and font options for the best mobile and printing experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="paperSize" className="text-sm font-medium">
              Paper Size
            </Label>
            <Select 
              value={options.paperSize} 
              onValueChange={(value: 'a4' | 'a5' | 'letter') => 
                setOptions(prev => ({ ...prev, paperSize: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paperSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <div>
                      <div className="font-medium">{size.label}</div>
                      <div className="text-xs text-gray-500">{size.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orientation" className="text-sm font-medium">
              Orientation
            </Label>
            <Select 
              value={options.orientation} 
              onValueChange={(value: 'portrait' | 'landscape') => 
                setOptions(prev => ({ ...prev, orientation: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait (Vertical)</SelectItem>
                <SelectItem value="landscape">Landscape (Horizontal)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fontSize" className="text-sm font-medium">
              Font Size
            </Label>
            <Select 
              value={options.fontSize} 
              onValueChange={(value: 'small' | 'medium' | 'large') => 
                setOptions(prev => ({ ...prev, fontSize: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (Compact)</SelectItem>
                <SelectItem value="medium">Medium (Standard)</SelectItem>
                <SelectItem value="large">Large (Easy to read)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> A5 size with portrait orientation works best for mobile viewing and saves paper when printing.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleGeneratePDF} className="flex-1">
              <Download className="mr-2" size={16} />
              Generate PDF
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}