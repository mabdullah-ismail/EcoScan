import React from 'react';

export default function AnalysisResults() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen">
      {/* Content for AnalysisResults */}
      
{/*  TopAppBar  */}
<header className="bg-[#F8FAF9] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50">
<div className="text-xl font-black text-[#5E7D6B] dark:text-emerald-400 flex items-center gap-2 font-['Public_Sans'] font-semibold tracking-tight">
<span className="material-symbols-outlined" data-icon="eco">eco</span>
      EcoScan PK
    </div>
<button className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95">
<span className="material-symbols-outlined" data-icon="history">history</span>
</button>
</header>
<main className="px-container-margin py-stack-md max-w-2xl mx-auto space-y-stack-lg">
{/*  Identified Material Section  */}
<section className="space-y-stack-md">
<div className="flex items-center gap-stack-md">
<div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant shadow-sm">
<img className="w-full h-full object-cover" data-alt="close-up photo of traditional pakistani red clay bricks with textured surface and earthy orange color" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGEeaN4AjeRXp9ytVZxKlWYjD2-YCD4PIA08o0Nz9ELXmYzaftN-NvzSL9fOOB0ArXC2uior7mmS9vAP988GUxqRLMk9cvmatUV7VJz_9gtmnuqRahs_4hYqN3wdHQkeDdM58iToME3ZfkS18Ctc4rf4YmrZ0602S2qBbrGSrRnAYe3V_nAAl7-ML69Eaw3ipV_JXhBHJ9oKVqhkG_yQeAtB88BdGPxXanKBTl8scRs5Ui8vONG9R7qax-VDqM3wlxYFsxZ1F0U2A"/>
<div className="absolute inset-0 bg-black/10"></div>
</div>
<div className="flex-1">
<p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Detected Object</p>
<h1 className="font-headline-md text-headline-md text-on-background">Identified Material: Red Clay Bricks</h1>
<div className="flex items-center gap-1 mt-1 text-primary">
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
<span className="font-label-bold text-label-bold">98% Match Confidence</span>
</div>
</div>
</div>
<div className="bg-surface-container-low rounded-xl p-stack-md flex justify-between items-center border border-outline-variant/30">
<div>
<p className="font-label-sm text-label-sm text-secondary">Current Price (Lahore)</p>
<p className="font-headline-md text-headline-md text-on-surface">18,500 PKR / 1000 pcs</p>
</div>
<div className="text-right">
<span className="material-symbols-outlined text-secondary" data-icon="location_on">location_on</span>
<p className="font-label-sm text-label-sm text-secondary">Market Avg</p>
</div>
</div>
</section>
{/*  Eco-Alternative Highlight Card  */}
<section className="space-y-stack-md">
<div className="flex justify-between items-end">
<h2 className="font-headline-md text-headline-md text-on-background">Recommended Alternative</h2>
<span className="bg-tertiary/10 text-tertiary font-label-bold text-label-sm px-3 py-1 rounded-full border border-tertiary/20">Sustainable Pick</span>
</div>
{/*  Bento-style Card  */}
<div className="bg-white rounded-2xl border-2 border-primary overflow-hidden shadow-sm">
<div className="bg-primary p-stack-md flex justify-between items-center">
<h3 className="font-headline-md text-headline-md text-on-primary">Eco-Alternative: Fly Ash Bricks</h3>
<span className="material-symbols-outlined text-on-primary" data-icon="auto_awesome">auto_awesome</span>
</div>
<div className="p-stack-md space-y-stack-md">
<div className="grid grid-cols-2 gap-stack-md">
<div className="bg-primary-container/10 p-stack-md rounded-xl border border-primary-container/20">
<div className="flex items-center gap-1 mb-1">
<span className="material-symbols-outlined text-primary text-[20px]" data-icon="trending_down">trending_down</span>
<p className="font-label-bold text-label-bold text-primary">Cost Benefit</p>
</div>
<p className="font-display-xl text-display-xl text-on-primary-fixed">20%</p>
<p className="font-label-sm text-label-sm text-on-primary-fixed-variant">Cheaper per unit</p>
</div>
<div className="bg-tertiary-container/10 p-stack-md rounded-xl border border-tertiary-container/20">
<div className="flex items-center gap-1 mb-1">
<span className="material-symbols-outlined text-tertiary text-[20px]" data-icon="eco">eco</span>
<p className="font-label-bold text-label-bold text-tertiary">Impact</p>
</div>
<p className="font-display-xl text-display-xl text-on-tertiary-fixed">45%</p>
<p className="font-label-sm text-label-sm text-on-tertiary-fixed-variant">Carbon Savings</p>
</div>
</div>
<div className="space-y-stack-sm">
<p className="font-body-md text-body-md text-on-surface-variant">Fly ash bricks are lighter, more durable, and require less mortar, significantly reducing overall construction costs in Punjab region.</p>
</div>
{/*  Urdu Player Button  */}
<button className="w-full flex items-center justify-center gap-stack-sm bg-surface-container-high py-touch-target-min rounded-xl text-on-secondary-container hover:bg-surface-variant transition-colors active:scale-95 group">
<span className="material-symbols-outlined group-active:scale-110" data-icon="volume_up" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
<span className="font-label-bold text-label-bold">Play Urdu Description</span>
</button>
</div>
</div>
</section>
{/*  Supplier Section  */}
<section className="space-y-stack-md">
<h3 className="font-label-bold text-label-bold text-secondary uppercase tracking-widest">Verified Supplier Nearby</h3>
<div className="flex items-center gap-stack-md p-stack-md bg-white rounded-xl border border-outline-variant shadow-sm">
<div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-3xl" data-icon="factory">factory</span>
</div>
<div className="flex-1">
<p className="font-label-bold text-label-bold text-on-surface">Indus Eco-Materials Co.</p>
<p className="font-label-sm text-label-sm text-secondary">Raiwind Rd, Lahore • 4.8km away</p>
</div>
<div className="flex items-center text-primary">
<span className="material-symbols-outlined text-sm" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="font-label-bold text-label-bold ml-1">4.9</span>
</div>
</div>
</section>
</main>
{/*  Bottom Action Bar (Contextual FAB replacement)  */}
<div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md p-container-margin border-t border-outline-variant z-40">
<button className="w-full h-touch-target-min bg-primary text-on-primary rounded-xl font-label-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
<span className="material-symbols-outlined" data-icon="chat">chat</span>
      Contact Supplier via WhatsApp
    </button>
</div>
{/*  BottomNavBar (Hidden on desktop)  */}
<nav className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 md:hidden">
{/*  Scanner  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 transition-all scale-95" href="#">
<span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">Scanner</span>
</a>
{/*  Analysis (Active)  */}
<a className="flex flex-col items-center justify-center bg-[#5E7D6B]/10 dark:bg-emerald-900/30 text-[#5E7D6B] dark:text-emerald-400 rounded-xl px-4 py-1 transition-all scale-95" href="#">
<span className="material-symbols-outlined" data-icon="analytics" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">Analysis</span>
</a>
{/*  History  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 transition-all scale-95" href="#">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">History</span>
</a>
{/*  Market  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 transition-all scale-95" href="#">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">Market</span>
</a>
</nav>

    </div>
  );
}
