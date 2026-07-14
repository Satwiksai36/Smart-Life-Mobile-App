import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ExpenseAnalytics: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { expenses, budgets } = useApp();

  const currentMonth = '2026-07';
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categories = Object.keys(budgets);
  const dataByCategory = categories.map(cat => {
    const spent = monthlyExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    const limit = budgets[cat];
    return {
      name: cat,
      spent,
      limit,
      percentage: limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0
    };
  }).sort((a, b) => b.spent - a.spent);

  // Mock points for trend graph (Last 5 days of spend)
  // [X, Y] mapping on 300x120 SVG grid
  const trendPoints = [
    { label: 'Jul 10', amount: 49.00, x: 20, y: 70 },
    { label: 'Jul 11', amount: 0.00, x: 80, y: 110 },
    { label: 'Jul 12', amount: 6.80, x: 140, y: 105 },
    { label: 'Jul 13', amount: 24.50, x: 200, y: 90 },
    { label: 'Jul 14', amount: 84.75, x: 260, y: 30 } // highest point
  ];

  // SVG Polyline Path
  const polylinePath = trendPoints.map(p => `${p.x},${p.y}`).join(' ');
  // SVG Area Fill Path
  const areaPath = `20,110 ${polylinePath} 260,110`;

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Expense Analytics</h2>
          <p className="text-[10px] text-gray-400">Weekly and monthly budget insights</p>
        </div>
      </div>

      {/* Monthly Trend Card (SVG Line Chart) */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Spend Velocity</span>
          <h3 className="font-headline-md text-lg font-black mt-0.5">July Trend Graph</h3>
        </div>

        {/* SVG Render */}
        <div className="w-full bg-white/20 dark:bg-slate-900/20 p-2 rounded-2xl border border-white/10 relative">
          <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
            {/* Gridlines */}
            <line x1="20" y1="30" x2="280" y2="30" stroke="rgba(0,0,0,0.05)" strokeDasharray="3,3" />
            <line x1="20" y1="70" x2="280" y2="70" stroke="rgba(0,0,0,0.05)" strokeDasharray="3,3" />
            <line x1="20" y1="110" x2="280" y2="110" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

            {/* Gradient Area Definition */}
            <defs>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area under the line */}
            <polygon points={areaPath} fill="url(#areaGrad)" />

            {/* Line Path */}
            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePath}
            />

            {/* Nodes */}
            {trendPoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="#3525cd" />
                <circle cx={p.x} cy={p.y} r="7" fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-pulse" />
                <text x={p.x} y="119" fontSize="6" fontWeight="bold" fill="#777587" textAnchor="middle">{p.label}</text>
                {p.amount > 0 && (
                  <text x={p.x} y={p.y - 8} fontSize="6" fontWeight="black" fill="#3525cd" textAnchor="middle">₹{p.amount.toFixed(0)}</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Allocation breakdown list */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category Allocation</h3>
        
        <div className="space-y-4">
          {dataByCategory.map(item => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    item.name === 'Food' ? 'bg-amber-400' :
                    item.name === 'Travel' ? 'bg-blue-400' :
                    item.name === 'Bills' ? 'bg-purple-400' :
                    item.name === 'Shopping' ? 'bg-pink-400' :
                    'bg-gray-400'
                  }`} />
                  <span className="font-bold text-gray-700 dark:text-gray-200">{item.name} Allocation</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-gray-800 dark:text-white">₹{item.spent.toFixed(0)}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1.5">({item.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700/50 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    item.percentage > 90 ? 'bg-red-500' :
                    item.percentage > 75 ? 'bg-amber-500' :
                    'bg-indigo-600'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="glass-card rounded-[24px] p-6 bg-slate-900 text-white space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
          <span className="material-symbols-outlined text-lg">insights</span>
          Aura Monthly Assessment
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-medium">
          Your total expenditure this month is <span className="font-bold text-white">₹{totalSpent.toFixed(0)}</span>. Category limits are well-balanced. We advise postponing additional shopping logs to optimize your monthly reserves by 8%.
        </p>
      </div>

    </div>
  );
};
