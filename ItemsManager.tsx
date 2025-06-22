import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { InvoiceItem } from '@/types/invoice';

interface ItemsManagerProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

export function ItemsManager({ items, onItemsChange }: ItemsManagerProps) {
  const [nextId, setNextId] = useState(() => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  });

  const addItem = () => {
    const newId = Date.now(); // Use timestamp for unique ID
    const newItem: InvoiceItem = {
      id: newId,
      name: '',
      quantity: 1,
      price: 0,
      gstPercent: 18,
      subtotal: 0,
      gstAmount: 0,
      total: 0,
    };
    onItemsChange([...items, newItem]);
    setNextId(newId + 1);
  };

  const removeItem = (id: number) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate totals when quantity, price, or GST changes
        if (field === 'quantity' || field === 'price' || field === 'gstPercent') {
          const subtotal = updatedItem.quantity * updatedItem.price;
          const gstAmount = (subtotal * updatedItem.gstPercent) / 100;
          const total = subtotal + gstAmount;
          
          return {
            ...updatedItem,
            subtotal,
            gstAmount,
            total,
          };
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onItemsChange(updatedItems);
  };

  const calculateSummary = () => {
    const validItems = items.filter(item => item.name.trim() !== '' && item.quantity > 0 && item.price > 0);
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = validItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalGST = validItems.reduce((sum, item) => sum + item.gstAmount, 0);
    const grandTotal = subtotal + totalGST;
    
    return { totalItems, subtotal, totalGST, grandTotal };
  };

  const summary = calculateSummary();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShoppingCart className="text-primary mr-2" size={20} />
          Items
        </h2>
        <Button
          onClick={addItem}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center"
        >
          <Plus className="mr-1" size={16} />
          Add Item
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="item-row border border-gray-200 rounded-lg p-4 fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Item {item.id}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <Label className="block text-xs font-medium text-gray-700 mb-1">
                  Item Name *
                </Label>
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Enter item name"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity *
                </Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="1"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (₹) *
                </Label>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label className="block text-xs font-medium text-gray-700 mb-1">
                  GST % *
                </Label>
                <Select
                  value={item.gstPercent.toString()}
                  onValueChange={(value) => updateItem(item.id, 'gstPercent', parseInt(value))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-3 text-right text-sm text-gray-600">
              Total: ₹<span className="font-medium">{item.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
            <p>No items added yet. Click "Add Item" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
