import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ExpenseDetails: React.FC = () => {
  const { currentRoute, goBack } = useNavigateApp();
  const { expenses, deleteExpense } = useApp();

  const expenseId = currentRoute.params?.id;
  const expense = expenses.find(e => e.id === expenseId);

  if (!expense) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-500">Expense Not Found</h2>
        <p className="text-sm text-gray-500">This transaction log could not be fetched.</p>
        <button onClick={goBack} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">Go Back</button>
      </div>
    );
  }

  const itemsTotal = expense.items.reduce((s, it) => s + (it.price * it.quantity), 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Transaction Summary</h2>
            <p className="text-[10px] text-gray-400">View parsed product logs</p>
          </div>
        </div>

        <button 
          onClick={() => { deleteExpense(expense.id); goBack(); }}
          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl transition-all"
          title="Delete record"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>

      {/* Details Box */}
      <div className="glass-card rounded-[24px] p-6 space-y-6">
        
        {/* Merchant & Cost */}
        <div className="text-center space-y-2 border-b border-gray-150/40 dark:border-slate-800/30 pb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <span className="material-symbols-outlined text-3xl font-bold">storefront</span>
          </div>
          <h3 className="font-headline-md text-2xl font-black text-gray-800 dark:text-white">{expense.merchant}</h3>
          <p className="text-3xl font-black text-[#3525cd] dark:text-[#c3c0ff] font-mono">₹{expense.amount.toFixed(0)}</p>
          <div className="flex gap-2 justify-center items-center text-[10px] text-gray-400 font-bold uppercase">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">{expense.category}</span>
            <span>•</span>
            <span>💳 {expense.paymentMethod}</span>
          </div>
        </div>

        {/* Date / Metadata Info */}
        <div className="grid grid-cols-2 gap-sm p-4 bg-white/30 dark:bg-slate-800/10 border border-white/10 rounded-2xl text-xs font-semibold">
          <div>
            <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Transaction Date</span>
            📅 {expense.date}
          </div>
          <div>
            <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Payment Method</span>
            💳 {expense.paymentMethod}
          </div>
        </div>

        {/* Product Items Table */}
        {expense.items.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Items</h4>
            <div className="space-y-2 bg-white/20 dark:bg-slate-800/10 p-3 rounded-2xl border border-white/10">
              {expense.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex gap-2">
                    <span className="text-gray-400">x{it.quantity}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{it.name}</span>
                  </div>
                  <span className="font-mono text-gray-600 dark:text-gray-300">₹{(it.price * it.quantity).toFixed(0)}</span>
                </div>
              ))}
              
              {/* Financial aggregates inside table */}
              <div className="border-t border-dashed border-gray-200/40 dark:border-slate-800/40 my-2 pt-2 space-y-1.5 text-[10px] text-right font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-mono text-gray-600 dark:text-gray-300">₹{itemsTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GST (5%)</span>
                  <span className="font-mono text-gray-600 dark:text-gray-300">₹{expense.gst.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Tax (2%)</span>
                  <span className="font-mono text-gray-600 dark:text-gray-300">₹{expense.tax.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {expense.notes && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scanned Notes</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 bg-white/20 dark:bg-slate-800/10 p-3 rounded-xl border border-white/10 leading-relaxed italic">
              "{expense.notes}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
