import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ManualExpenseEntry: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { addExpense } = useApp();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-07-14');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;

    addExpense({
      merchant: merchant.trim(),
      date,
      amount: parseFloat(amount),
      gst: parseFloat((parseFloat(amount) * 0.05).toFixed(2)),
      tax: parseFloat((parseFloat(amount) * 0.02).toFixed(2)),
      paymentMethod,
      category,
      items: [], // Manual entry doesn't require line items
      notes: notes.trim()
    });

    goBack();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Log Manual Expense</h2>
          <p className="text-[10px] text-gray-400">Record transaction details</p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Merchant & Amount row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="merchant">Merchant Name</label>
            <input 
              id="merchant"
              type="text"
              required
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Target Stores"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="amount">Amount Spent (₹)</label>
            <input 
              id="amount"
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none font-bold"
            />
          </div>
        </div>

        {/* Date, Category, Payment Method */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="date">Transaction Date</label>
            <input 
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
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
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="payment">Payment Method</label>
            <select
              id="payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Google Pay">Google Pay</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="notes">Notes</label>
          <textarea 
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Purchased office supplies for design layout workshop..."
            className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100/50 dark:border-slate-800/30">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-800/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20"
          >
            Save Record
          </button>
        </div>

      </form>

    </div>
  );
};
