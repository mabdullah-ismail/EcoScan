import React from 'react';

export default function RecentScans() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen">
      {/* Content for RecentScans */}
      
{/*  TopAppBar  */}
<header className="bg-[#F8FAF9] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center w-full px-6 py-3 fixed top-0 z-50">
<div className="text-xl font-black text-[#5E7D6B] dark:text-emerald-400 flex items-center gap-2 font-['Public_Sans'] font-semibold tracking-tight">
<span className="material-symbols-outlined" data-icon="eco">eco</span>
<span>EcoScan PK</span>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 text-slate-500 dark:text-slate-400">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
</button>
<button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 text-slate-500 dark:text-slate-400">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>
<main className="pt-20 px-container-margin max-w-2xl mx-auto">
{/*  Search Bar Section  */}
<div className="mb-stack-lg">
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline" data-icon="search">search</span>
</div>
<input className="w-full h-touch-target-min bg-white border-2 border-outline-variant rounded-xl pl-12 pr-4 focus:border-primary focus:ring-0 font-body-md transition-all" placeholder="Search scan history..." type="text"/>
</div>
</div>
{/*  Page Title  */}
<div className="mb-stack-md">
<h1 className="font-headline-md text-headline-md text-on-surface">Recent Scans</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Review and manage your environmental material audits.</p>
</div>
{/*  History List  */}
<div className="space-y-stack-sm">
{/*  List Item 1  */}
<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="close-up of stacked grey concrete blocks on a construction site with sharp textures and natural daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADmVf0fAj8vTLm9RXrwP89kNgdQWdh-leLbcCX1OMrJHyh4kUnT01gcrgrDoekJ6gNkebiu0tbuWgdOzzVrgJhc0QrNoqXB2UAL67AAlH6fVPhpdQ4C84ukW62x_3OkBfC2tD8UdnozXbj8-Gbs8SBZNH-tFYQGnu8hY6GQtVBr_7JC7VE4rsJ4xJ50a7e4L76iykCTSnTyHmZZ27Hj8pkfZBFnoRBJsafnhh1ugjVEGTPCyCTDjH6_NK0kwwwYVjsF0nLpua7HcY"/>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-label-bold text-label-bold text-on-surface truncate">Cement (Type-1)</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Oct 24, 2023 • Site Alpha</p>
</div>
<div className="text-right">
<p className="font-label-bold text-label-bold text-primary">PKR 1,250</p>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">STABLE</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="chevron_right">chevron_right</span>
</div>
{/*  List Item 2  */}
<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="rusty and new construction steel bars bundled together in a warehouse with industrial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDligt2Fa66vy3QqCSziBbP9tTtP-WmRg5Zz9ER6pRAQ6gO3zACZfAqc4bary3jxGMNxGpmW1o8DoPxzHauPT-fvtACvsAIEJjt7CmNpD6i2hhfthanrc_NRCxiK5Fk3Uys3JsN1CzAXYmg2pE-o2ixCcH4EUoF204_h0a2KdAxe3y2gYeavYQq7v7zl3jCWCq2dQ33N93LgINqbW-XF-EUyOkakWiUNSj5zGClv9bVhioCZ3M7mQCh_f9RHM6-SI4lAPFZDpOYXS8"/>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-label-bold text-label-bold text-on-surface truncate">Steel Bars (Grade 60)</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Oct 22, 2023 • DHA Phase 6</p>
</div>
<div className="text-right">
<p className="font-label-bold text-label-bold text-primary">PKR 265,000</p>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-on-error-container">↑ 4.2%</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="chevron_right">chevron_right</span>
</div>
{/*  List Item 3  */}
<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="neatly stacked red clay bricks on a wooden pallet under bright outdoor sunlight with high contrast" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTmJJD2ZiKGIt-QlpmRtI9mRdFNtt-_rZ6iR-udIlZwrehm3huxjR-hg5oKcsXQzMq6F_qVo5fnzFMb4lA21qtR2E28Cap_FsUD2nH_r0yayApkpNyuYzOJpTNcTwBuZl7XqE1xApMeVQFbU0u3sCV0khpzA_CdkLIn68FN1T2Uiri9TOWvRkbLLz1XuuuU8KRyEQyWxMhsgKM0U1kEIf9XxA99bxGly8hyY12l0UsR8mBHJiZlTMKaguISTkSV895mKLb-BCGRkU"/>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-label-bold text-label-bold text-on-surface truncate">Red Bricks (First Class)</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Oct 19, 2023 • Gulberg III</p>
</div>
<div className="text-right">
<p className="font-label-bold text-label-bold text-primary">PKR 18/pc</p>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">STABLE</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="chevron_right">chevron_right</span>
</div>
{/*  List Item 4  */}
<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="close-up of crushed grey gravel stones with detailed textures and subtle shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArjjnJxzFuyBbtE1ZcwWzZvv4n9JSreMIAFFZS7EtaqBixc-bkl9RuSuaofoQ6gmGfAl96xc3McsPNdqHEfL2zaCwQC30_5G5KB5NUHZ54GBkEU58K5z7zL8HWDIGGBbHdfCKXZ1W_HiIZVwGxwkkIDMBADX0IUY4GDPi5mwmCrb9Il8S3HKS2axEJkiQB8HsAL-NUD94DNLakv0KmTxKNXNsDVh2qiVWqzoGKGZiIT2TCmW7tQx_94OdP4kSu4_KHZ2j3fVoGfIk"/>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-label-bold text-label-bold text-on-surface truncate">Crushed Stone (Sargodha)</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Oct 15, 2023 • Site Beta</p>
</div>
<div className="text-right">
<p className="font-label-bold text-label-bold text-primary">PKR 110/cu.ft</p>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">↓ 1.5%</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="chevron_right">chevron_right</span>
</div>
{/*  List Item 5  */}
<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="freshly poured wet concrete texture on a industrial floor being smoothed by a worker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhCWICTsSYtcfGuHif8HvpM9s6_PmgpF0bnCEniwa20P5M7xIRuh6OiwLAe1HnjOp6dL6Uqh-AOXmQmxweJPWhDj3BOxD-QRwvqPeP2oB_37I_WA91rjz4fFiDuKL2IFLGgB8iHk7yk60O_MYz00hCSPGUMtOrLDu16jRMZFuGWcQemQdVeO4tuinoRwzXeJXsIUyTcTsuafoSUvaIhqhC2NCP3HtCXOqQ5JzbLE2_O8SvZ6Jhov54XPRd76vH34sP6oucpayx7Sc"/>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-label-bold text-label-bold text-on-surface truncate">Ready Mix Concrete</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Oct 12, 2023 • Model Town</p>
</div>
<div className="text-right">
<p className="font-label-bold text-label-bold text-primary">PKR 18,500</p>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-on-error-container">↑ 0.8%</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="chevron_right">chevron_right</span>
</div>
</div>
{/*  Empty State / End of List  */}
<div className="mt-stack-lg py-stack-lg text-center border-t border-slate-200">
<p className="font-label-sm text-label-sm text-outline">You've reached the end of your recent history.</p>
<button className="mt-stack-md text-primary font-label-bold flex items-center justify-center gap-2 mx-auto hover:underline">
        View All History <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</main>
{/*  BottomNavBar  */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
{/*  Scanner  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-transform duration-150 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">Scanner</span>
</a>
{/*  Analysis  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-transform duration-150 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">Analysis</span>
</a>
{/*  History (Active)  */}
<a className="flex flex-col items-center justify-center bg-[#5E7D6B]/10 dark:bg-emerald-900/30 text-[#5E7D6B] dark:text-emerald-400 rounded-xl px-4 py-1 transition-transform duration-150 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="history" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">History</span>
</a>
{/*  Market  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-transform duration-150 active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
<span className="font-['Public_Sans'] text-[12px] font-medium mt-1">Market</span>
</a>
</nav>

    </div>
  );
}
