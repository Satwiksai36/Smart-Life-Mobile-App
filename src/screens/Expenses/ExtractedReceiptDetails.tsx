import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp, ReceiptItem } from '../../context/AppContext';

export const ExtractedReceiptDetails: React.FC = () => {
  const { currentRoute, navigate } = useNavigateApp();
  const { addExpense } = useApp();

  const receiptData = currentRoute.params?.receiptData;

  const [merchant, setMerchant] = useState(receiptData?.merchant || 'Unknown');
  const [date, setDate] = useState(receiptData?.date || '2026-07-14');
  const [amount, setAmount] = useState<number>(receiptData?.amount || 0);
  const [gst, setGst] = useState<number>(receiptData?.gst || 0);
  const [tax, setTax] = useState<number>(receiptData?.tax || 0);
  const [category, setCategory] = useState(receiptData?.category || 'Food');
  const [paymentMethod, setPaymentMethod] = useState(receiptData?.paymentMethod || 'Credit Card');
  const [notes, setNotes] = useState(receiptData?.notes || 'Parsed via OCR Scanner');

  // List of items state
  const [items, setItems] = useState<ReceiptItem[]>(receiptData?.items || []);

  const handleItemChange = (index: number, field: keyof ReceiptItem, val: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: val
    };
    setItems(updated);

    // Recalculate totals if price or quantity changed
    if (field === 'price' || field === 'quantity') {
      const sum = updated.reduce((s, it) => s + (it.price * it.quantity), 0);
      const calculatedGst = parseFloat((sum * 0.05).toFixed(2));
      const calculatedTax = parseFloat((sum * 0.02).toFixed(2));
      setGst(calculatedGst);
      setTax(calculatedTax);
      setAmount(parseFloat((sum + calculatedGst + calculatedTax).toFixed(2)));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      merchant,
      date,
      amount,
      gst,
      tax,
      paymentMethod,
      category,
      items,
      notes
    });
    navigate('expenses');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Verify OCR Results</h2>
          <p className="text-[10px] text-gray-400">Validate parsed fields before logging</p>
        </div>
      </div>

      {/* Verification Board */}
      <form onSubmit={handleSave} className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Merchant */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Merchant Name</label>
          <input 
            type="text"
            required
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-bold"
          />
        </div>

        {/* Date, Category, Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Purchase Date</label>
            <input 
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Budget Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs font-bold"
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs font-bold"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Google Pay">Google Pay</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        {/* Itemized breakdown table */}
        <div className="border-t border-gray-100/50 dark:border-slate-800/30 pt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Itemized Products</h4>
          
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white/20 dark:bg-slate-800/10 p-2 rounded-xl border border-white/10">
                <input 
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="col-span-6 px-2 py-1.5 rounded-lg glass-input text-xs"
                  placeholder="Item Name"
                />
                <input 
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="col-span-2 px-2 py-1.5 rounded-lg glass-input text-xs text-center"
                  placeholder="Qty"
                />
                <input 
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className="col-span-4 px-2 py-1.5 rounded-lg glass-input text-xs text-right"
                  placeholder="Price"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="border-t border-gray-100/50 dark:border-slate-800/30 pt-4 grid grid-cols-3 gap-sm text-right text-xs">
          <div>
            <span className="block text-gray-400">GST (5%)</span>
            <span className="font-bold font-mono">₹{gst.toFixed(0)}</span>
          </div>
          <div>
            <span className="block text-gray-400">Service Tax (2%)</span>
            <span className="font-bold font-mono">₹{tax.toFixed(0)}</span>
          </div>
          <div>
            <span className="block text-[#3525cd] dark:text-[#c3c0ff] font-bold">Total Bill Amount</span>
            <span className="text-sm font-black font-mono text-primary">₹{amount.toFixed(0)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100/50 dark:border-slate-800/30">
          <button
            type="button"
            onClick={() => navigate('expenses')}
            className="flex-1 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-800/30"
          >
            Discard
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20"
          >
            Save Expense record
          </button>
        </div>

      </form>
      
    </div>
  );
};
