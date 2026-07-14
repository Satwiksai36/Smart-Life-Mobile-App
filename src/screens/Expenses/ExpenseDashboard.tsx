import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ExpenseDashboard: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { expenses, budgets, deleteExpense } = useApp();

  const currentMonth = '2026-07';
  
  // Calculations
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudgetLimit = Object.values(budgets).reduce((sum, v) => sum + v, 0);
  const totalProgress = totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0;

  // Category breakdown spent
  const getCategorySpent = (category: string) => {
    return monthlyExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const categories = Object.keys(budgets);

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-black text-primary">Expense Tracker</h2>
          <p className="text-xs text-gray-500">Scan receipts via AI & enforce budgets boundaries</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('budget')}
            className="p-2.5 bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20"
            title="Budgets Boundaries"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
          <button 
            onClick={() => navigate('expense_analytics')}
            className="p-2.5 bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20"
            title="Expense Charts"
          >
            <span className="material-symbols-outlined text-lg">show_chart</span>
          </button>
        </div>
      </div>

      {/* Main Budget Card Summary */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Spent This Month</span>
            <h3 className="text-3xl font-black text-primary mt-1">₹{totalSpent.toFixed(0)}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Monthly Budget Boundary</span>
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1">₹{totalBudgetLimit.toFixed(0)}</h4>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                totalProgress > 90 ? 'bg-red-500' :
                totalProgress > 75 ? 'bg-amber-500' :
                'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, totalProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
            <span>{totalProgress.toFixed(0)}% utilized</span>
            <span>₹{Math.max(0, totalBudgetLimit - totalSpent).toFixed(0)} remaining</span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid for scanning/adding */}
      <div className="grid grid-cols-2 gap-sm">
        <button
          onClick={() => navigate('receipt_scanner')}
          className="flex items-center justify-center gap-2 p-4 bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-sm"
        >
          <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
          Scan Receipt
        </button>
        <button
          onClick={() => navigate('manual_expense')}
          className="flex items-center justify-center gap-2 p-4 bg-white/50 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/60 text-gray-700 dark:text-gray-200 border border-white/20 rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-sm"
        >
          <span className="material-symbols-outlined text-xl">edit_note</span>
          Log Cost Manually
        </button>
      </div>

      {/* Category Limits Breakdown */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category Breakdown</h3>
        <div className="space-y-3">
          {categories.map(cat => {
            const limit = budgets[cat];
            const spent = getCategorySpent(cat);
            const ratio = limit > 0 ? (spent / limit) * 100 : 0;
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700 dark:text-gray-200">{cat}</span>
                  <span className="text-gray-500">₹{spent.toFixed(0)} <span className="text-[10px] text-gray-400">/ ₹{limit}</span></span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      ratio > 95 ? 'bg-red-500' :
                      ratio > 75 ? 'bg-amber-500' :
                      'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, ratio)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions list */}
      <div className="glass-card rounded-[24px] p-6 flex flex-col min-h-[300px]">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Recent Expenses</h3>
        
        <div className="space-y-3 scrollbar-hide">
          {monthlyExpenses.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">payments</span>
              <p className="text-xs font-semibold">No expenses logged for this month</p>
            </div>
          ) : (
            monthlyExpenses.map(exp => (
              <div 
                key={exp.id}
                className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-800/20 border border-white/25 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                onClick={() => navigate('expense_details', { id: exp.id })}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3525cd] text-xl">
                      {
                        exp.category === 'Food' ? 'restaurant' :
                        exp.category === 'Travel' ? 'local_taxi' :
                        exp.category === 'Bills' ? 'receipt' :
                        exp.category === 'Shopping' ? 'shopping_bag' :
                        'payments'
                      }
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-700 dark:text-gray-200">{exp.merchant}</h4>
                    <div className="flex gap-2 items-center text-[10px] text-gray-400 mt-0.5">
                      <span className="font-semibold">{exp.category}</span>
                      <span>•</span>
                      <span>📅 {exp.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-xs text-primary dark:text-[#c3c0ff]">₹{exp.amount.toFixed(0)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteExpense(exp.id); }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">close</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
