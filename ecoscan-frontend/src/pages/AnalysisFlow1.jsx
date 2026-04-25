import React from 'react';

export default function AnalysisFlow1() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen">
      {/* Content for AnalysisFlow1 */}
      
{/*  Top Navigation Bar  */}
<header className="fixed top-0 left-0 w-full z-50 bg-[#F8FAF9] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 py-3 transition-all duration-200">
<div className="text-xl font-black text-[#5E7D6B] dark:text-emerald-400 flex items-center gap-2 font-['Public_Sans'] font-semibold tracking-tight">
<span className="material-symbols-outlined text-[#5E7D6B] dark:text-emerald-400" data-icon="eco">eco</span>
<span>EcoScan PK</span>
</div>
<div className="flex items-center gap-4">
<button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">
<span className="material-symbols-outlined" data-icon="flash_on">flash_on</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
</header>
{/*  Main Live View Area (Simulated Camera Canvas)  */}
<main className="relative h-screen w-full flex flex-col justify-center items-center">
{/*  Live Camera Backdrop  */}
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover" data-alt="Close-up high-resolution texture of weathered grey industrial concrete wall with fine cracks and subtle grit details in neutral daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG_RFCGpROQ3KNkelEEAumG8VyvbB1bQkeEsR07wUqng0ZKu7K1ThHWaxQNEilE7eVTLS1OqZK-RTO7rMogqk_QmdCEDpv3UvsW3lab4uNZeiLMfgfjkugfiMZq4CaZN_fU160A0HOcCt_KmUFZiIQK2Tk1LA3_UuHQY8Bt_n03WCDdxy9C042RK-bDpO7BcYxTlycVgiUtuBDIq6wr6bxP8YcgO7l-DkTOSO_7FhWbGtGF7CqmgVAqL--0EE8ujGhjr_XhM1GWEU"/>
</div>
{/*  Scanning Interface Overlays  */}
<div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
{/*  Scanning Frame  */}
<div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl border-2 border-white/50 scanner-frame overflow-hidden">
{/*  Corner Indicators  */}
<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#5E7D6B]"></div>
<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#5E7D6B]"></div>
<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5E7D6B]"></div>
<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5E7D6B]"></div>
{/*  Animating Scan Line (Conceptual Representation)  */}
<div className="scan-line"></div>
{/*  Detection Label  */}
<div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
<p className="text-white font-label-sm flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        ALIGNED
                    </p>
</div>
</div>
{/*  Material Detail Overlay  */}
<div className="mt-8 text-center bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 max-w-xs">
<p className="text-white font-label-bold">Detecting Surface...</p>
<p className="text-white/70 font-label-sm mt-1">Keep the material within the green corners for optimal analysis.</p>
</div>
</div>
{/*  Floating UI Components  */}
{/*  Recent Scan Thumbnail  */}
<div className="absolute bottom-28 left-6 z-20 group">
<div className="relative w-16 h-16 rounded-xl border-2 border-white overflow-hidden shadow-lg hover:scale-105 transition-transform">
<img className="w-full h-full object-cover" data-alt="Small preview image showing a texture of red masonry bricks with grey mortar joints in a professional grid pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiiszFUdNpzrwH9O_TOivTA-EyAP7BTZc1pI3B3SKxvgXQNuuWnZn0hyiZ2Ld7NaN88LN-Ew0MrAWLjEmt-4Xo-hXSx8d_9vsmH6wvTeEcn5hSLQftRhT3X7MMLeUgQ1YllTE839MYPwNV1V_xZ87qIZx1QYw3WVwTWi7dzPluoks5igs5WftBpOf_dAa_NH1jxLymfob-vr1JC-55q8y8eQyELJq_MzCVVhQFjiH2rNZNtjxYUFQ2vCUDdNaJcQ6BGNmuHACBkLs"/>
<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
</div>
<p className="text-white font-label-sm mt-2 text-center drop-shadow-md">Recent</p>
</div>
{/*  Gallery / History Access  */}
<div className="absolute bottom-28 right-6 z-20">
<button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg">
<span className="material-symbols-outlined" data-icon="photo_library">photo_library</span>
</button>
<p className="text-white font-label-sm mt-2 text-center drop-shadow-md">Gallery</p>
</div>
{/*  Shutter Button Container  */}
<div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
<button className="group flex items-center justify-center p-1 rounded-full border-4 border-white/30 hover:border-white transition-colors duration-200">
<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-90 transition-transform duration-100">
<div className="w-16 h-16 rounded-full border-2 border-[#5E7D6B] flex items-center justify-center">
<span className="material-symbols-outlined text-[#5E7D6B] text-4xl" data-icon="photo_camera">photo_camera</span>
</div>
</div>
</button>
</div>
</main>
{/*  Bottom Navigation Bar  */}
<nav className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 pb-6 pt-2">
{/*  Active Tab: Scanner  */}
<a className="flex flex-col items-center justify-center bg-[#5E7D6B]/10 dark:bg-emerald-900/30 text-[#5E7D6B] dark:text-emerald-400 rounded-xl px-4 py-1 transition-transform duration-150 scale-95" href="#">
<span className="material-symbols-outlined" data-icon="photo_camera" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">Scanner</span>
</a>
{/*  Inactive Tab: Analysis  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-transform duration-150" href="#">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">Analysis</span>
</a>
{/*  Inactive Tab: History  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-transform duration-150" href="#">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">History</span>
</a>
{/*  Inactive Tab: Market  */}
<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition-transform duration-150" href="#">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
<span className="font-['Public_Sans'] text-[12px] font-medium">Market</span>
</a>
</nav>
{/*  Side Panel (Responsive Web Hidden)  */}
<div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-[#F8FAF9]/80 backdrop-blur-xl border-r border-slate-200 z-40 p-6 flex-col gap-8">
<div>
<h3 className="font-label-bold text-[#5E7D6B] uppercase tracking-wider mb-4">Current Session</h3>
<div className="space-y-4">
<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
<p className="font-label-sm text-slate-500">Scan ID</p>
<p className="font-label-bold text-slate-900">#PX-2024-0012</p>
</div>
<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
<p className="font-label-sm text-slate-500">Stability</p>
<div className="flex items-center gap-2 mt-1">
<div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-emerald-500 w-[92%]"></div>
</div>
<span className="font-label-sm text-emerald-600">92%</span>
</div>
</div>
</div>
</div>
<div>
<h3 className="font-label-bold text-[#5E7D6B] uppercase tracking-wider mb-4">Location</h3>
<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
<span className="material-symbols-outlined text-slate-400" data-icon="location_on">location_on</span>
<div>
<p className="font-label-bold text-slate-900">Islamabad, Sector G-10</p>
<p className="font-label-sm text-slate-500">Project: Green-Rise Hub</p>
</div>
</div>
</div>
<div className="mt-auto">
<button className="w-full py-4 bg-[#5E7D6B] text-white rounded-xl font-label-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="cloud_upload">cloud_upload</span>
                BATCH UPLOAD
            </button>
</div>
</div>

    </div>
  );
}
