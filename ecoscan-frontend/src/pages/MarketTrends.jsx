import React from 'react';

export default function MarketTrends() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen">
      {/* Content for MarketTrends */}
      
{/*  TopAppBar  */}
<header className="bg-[#F8FAF9] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
<div className="flex justify-between items-center w-full px-6 py-3">
<div className="text-xl font-black text-[#5E7D6B] dark:text-emerald-400 flex items-center gap-2 font-['Public_Sans'] tracking-tight">
<span className="material-symbols-outlined" data-icon="eco">eco</span>
                EcoScan PK
            </div>
<div className="flex gap-4">
<button className="transition-all duration-200 active:scale-95 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="transition-all duration-200 active:scale-95 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
<main className="max-w-7xl mx-auto px-container-margin py-stack-md space-y-stack-lg">
{/*  Market Status Header  */}
<section className="flex flex-col md:flex-row md:items-center justify-between gap-stack-sm">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Lahore Material Trends</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time construction cost index for Punjab region.</p>
</div>
<div className="flex items-center gap-unit bg-primary-container/10 border border-primary-container/20 px-stack-md py-stack-sm rounded-full w-fit">
<span className="relative flex h-3 w-3">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
</span>
<span className="font-label-bold text-label-bold text-primary">Market Status: Active</span>
</div>
</section>
{/*  Top Material Trends Bento Grid  */}
<section className="space-y-stack-md">
<div className="flex items-center justify-between">
<h2 className="font-headline-md text-headline-md text-on-surface">Top Material Trends</h2>
<button className="text-primary font-label-bold flex items-center gap-1 hover:underline">
                    View All <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
{/*  Bricks Card  */}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md hover:border-primary-container transition-colors">
<div className="flex justify-between items-start mb-stack-md">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Bricks (Per 1000)</p>
<h3 className="font-display-xl text-display-xl text-on-surface">₨14,500</h3>
</div>
<div className="bg-error-container text-on-error-container px-stack-sm py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
<span className="font-label-bold text-label-sm">2.4%</span>
</div>
</div>
<div className="h-24 w-full flex items-end gap-1 px-1">
{/*  Mock sparkline  */}
<div className="w-full bg-primary/20 h-[40%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[55%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[45%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[60%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[75%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[65%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[85%] rounded-t-sm"></div>
<div className="w-full bg-primary h-[100%] rounded-t-sm"></div>
</div>
<p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-stack-sm">Last 30 Days Volatility</p>
</div>
{/*  Cement Card  */}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md hover:border-primary-container transition-colors">
<div className="flex justify-between items-start mb-stack-md">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cement (Per Bag)</p>
<h3 className="font-display-xl text-display-xl text-on-surface">₨1,210</h3>
</div>
<div className="bg-primary/10 text-primary px-stack-sm py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-sm" data-icon="trending_down">trending_down</span>
<span className="font-label-bold text-label-sm">0.8%</span>
</div>
</div>
<div className="h-24 w-full flex items-end gap-1 px-1">
{/*  Mock sparkline  */}
<div className="w-full bg-primary/20 h-[80%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[70%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[75%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[60%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[50%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[55%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[45%] rounded-t-sm"></div>
<div className="w-full bg-primary h-[40%] rounded-t-sm"></div>
</div>
<p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-stack-sm">Last 30 Days Volatility</p>
</div>
{/*  Steel Card  */}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md hover:border-primary-container transition-colors">
<div className="flex justify-between items-start mb-stack-md">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Steel (Per Tonne)</p>
<h3 className="font-display-xl text-display-xl text-on-surface">₨265k</h3>
</div>
<div className="bg-surface-variant text-on-surface-variant px-stack-sm py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-sm" data-icon="horizontal_rule">horizontal_rule</span>
<span className="font-label-bold text-label-sm">0.0%</span>
</div>
</div>
<div className="h-24 w-full flex items-end gap-1 px-1">
{/*  Mock sparkline  */}
<div className="w-full bg-primary/20 h-[60%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[62%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[58%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[60%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[60%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[61%] rounded-t-sm"></div>
<div className="w-full bg-primary/20 h-[59%] rounded-t-sm"></div>
<div className="w-full bg-primary h-[60%] rounded-t-sm"></div>
</div>
<p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-stack-sm">Last 30 Days Volatility</p>
</div>
</div>
</section>
{/*  Weekly Prediction Section  */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
<div className="bg-tertiary-container text-on-tertiary-container rounded-2xl p-stack-lg relative overflow-hidden flex flex-col justify-between min-h-[320px]">
<div className="relative z-10">
<h2 className="font-headline-lg text-headline-lg mb-unit">Weekly Prediction</h2>
<p className="font-body-md text-body-md opacity-90 max-w-md">Our AI models predict a <span className="font-bold">4.2% decrease</span> in aggregate costs by next Tuesday. Ideal window for bulk procurement begins in 48 hours.</p>
</div>
<div className="relative z-10 space-y-stack-md mt-stack-lg">
<div className="bg-white/10 backdrop-blur-md rounded-xl p-stack-md border border-white/20">
<div className="flex justify-between items-center mb-unit">
<span className="font-label-bold">Confidence Score</span>
<span className="font-label-bold">89%</span>
</div>
<div className="h-2 bg-white/20 rounded-full overflow-hidden">
<div className="h-full bg-white w-[89%]"></div>
</div>
</div>
<button className="w-full bg-white text-tertiary font-label-bold py-touch-target-min rounded-xl shadow-lg active:scale-[0.98] transition-transform">
                        Download Planning Report (PDF)
                    </button>
</div>
{/*  Abstract Graphic  */}
<div className="absolute -right-16 -top-16 opacity-20">
<span className="material-symbols-outlined text-[300px]" data-icon="analytics">analytics</span>
</div>
</div>
{/*  Regional Insights / Secondary Bento  */}
<div className="space-y-gutter">
<div className="bg-surface-container-high border border-outline-variant rounded-2xl p-stack-md flex items-center gap-stack-md">
<div className="bg-primary/10 p-3 rounded-full text-primary">
<span className="material-symbols-outlined" data-icon="location_on">location_on</span>
</div>
<div>
<h4 className="font-label-bold text-on-surface">Hotspot: Raiwind Industrial Area</h4>
<p className="font-body-md text-label-sm text-on-surface-variant">Supplies are 15% cheaper due to new local kiln openings.</p>
</div>
</div>
<div className="bg-surface-container-high border border-outline-variant rounded-2xl p-stack-md flex items-center gap-stack-md">
<div className="bg-primary/10 p-3 rounded-full text-primary">
<span className="material-symbols-outlined" data-icon="warning">warning</span>
</div>
<div>
<h4 className="font-label-bold text-on-surface">Logistics Alert</h4>
<p className="font-body-md text-label-sm text-on-surface-variant">Delayed shipments from Sheikhupura expected due to rain.</p>
</div>
</div>
<div className="grid grid-cols-2 gap-gutter">
<div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md text-center">
<p className="font-label-sm text-on-surface-variant mb-unit">Sand (Truckload)</p>
<p className="font-headline-md text-on-surface">₨38,000</p>
<span className="text-[10px] font-bold text-primary">+₨2,000 vs LW</span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md text-center">
<p className="font-label-sm text-on-surface-variant mb-unit">Crush (Cubic Ft)</p>
<p className="font-headline-md text-on-surface">₨125</p>
<span className="text-[10px] font-bold text-error">-₨5 vs LW</span>
</div>
</div>
</div>
</section>
</main>
{/*  BottomNavBar  */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
<button className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 scale-95 transition-transform duration-150">
<span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">Scanner</span>
</button>
<button className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 scale-95 transition-transform duration-150">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">Analysis</span>
</button>
<button className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 scale-95 transition-transform duration-150">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">History</span>
</button>
<button className="flex flex-col items-center justify-center bg-[#5E7D6B]/10 dark:bg-emerald-900/30 text-[#5E7D6B] dark:text-emerald-400 rounded-xl px-4 py-1 scale-95 transition-transform duration-150">
<span className="material-symbols-outlined" data-icon="trending_up" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">Market</span>
</button>
</nav>

    </div>
  );
}
