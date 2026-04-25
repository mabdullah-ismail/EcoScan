import React from 'react';

export default function SustainableAudit() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen">
      {/* Content for SustainableAudit */}
      
    <div id="root"></div>

    {/*  React and Routing Libraries  */}
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/history@5/umd/history.development.js"></script>
    <script src="https://unpkg.com/react-router@6.3.0/umd/react-router.development.js"></script>
    <script src="https://unpkg.com/react-router-dom@6.3.0/umd/react-router-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const { createRoot } = ReactDOM;
        const { MemoryRouter, Routes, Route, Link, useNavigate, useLocation } = ReactRouterDOM;

        // --- Common Components ---

        const TopAppBar = ({ title = "EcoScan PK", showBack = false, rightIcons = [] }) => {
            const navigate = useNavigate();
            return (
                <header className="fixed top-0 left-0 w-full z-50 bg-[#F8FAF9] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 py-3">
                    <div className="text-xl font-black text-[#5E7D6B] dark:text-emerald-400 flex items-center gap-2 font-['Public_Sans'] font-semibold tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined">eco</span>
                        <span>{title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {rightIcons.map((icon, idx) => (
                            <button key={idx} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">
                                <span className="material-symbols-outlined">{icon}</span>
                            </button>
                        ))}
                    </div>
                </header>
            );
        };

        const BottomNavBar = () => {
            const location = useLocation();
            const navigate = useNavigate();
            
            const tabs = [
                { id: 'scanner', label: 'Scanner', icon: 'photo_camera', path: '/' },
                { id: 'analysis', label: 'Analysis', icon: 'analytics', path: '/analysis' },
                { id: 'history', label: 'History', icon: 'history', path: '/history' },
                { id: 'market', label: 'Market', icon: 'trending_up', path: '/market' },
            ];

            return (
                <nav className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 pb-6 pt-2">
                    {tabs.map(tab => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <button 
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={`flex flex-col items-center justify-center px-4 py-1 transition-all duration-150 scale-95 ${isActive ? 'bg-[#5E7D6B]/10 dark:bg-emerald-900/30 text-[#5E7D6B] dark:text-emerald-400 rounded-xl' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'}`}
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                                <span className="font-['Public_Sans'] text-[12px] font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            );
        };

        // --- Screens ---

        const ScannerScreen = () => {
            const navigate = useNavigate();
            return (
                <div className="bg-background overflow-hidden h-screen">
                    <TopAppBar rightIcons={['flash_on', 'settings']} />
                    <main className="relative h-full w-full flex flex-col justify-center items-center pt-16 pb-24">
                        <div className="absolute inset-0 z-0">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG_RFCGpROQ3KNkelEEAumG8VyvbB1bQkeEsR07wUqng0ZKu7K1ThHWaxQNEilE7eVTLS1OqZK-RTO7rMogqk_QmdCEDpv3UvsW3lab4uNZeiLMfgfjkugfiMZq4CaZN_fU160A0HOcCt_KmUFZiIQK2Tk1LA3_UuHQY8Bt_n03WCDdxy9C042RK-bDpO7BcYxTlycVgiUtuBDIq6wr6bxP8YcgO7l-DkTOSO_7FhWbGtGF7CqmgVAqL--0EE8ujGhjr_XhM1GWEU" alt="concrete wall texture" />
                        </div>
                        
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl border-2 border-white/50 scanner-frame overflow-hidden">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#5E7D6B]"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#5E7D6B]"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5E7D6B]"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5E7D6B]"></div>
                                <div className="scan-line"></div>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <p className="text-white font-label-sm flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        ALIGNED
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 text-center bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 max-w-xs mx-4">
                                <p className="text-white font-label-bold">Detecting Surface...</p>
                                <p className="text-white/70 font-label-sm mt-1">Keep the material within the green corners for optimal analysis.</p>
                            </div>
                        </div>

                        {/* Recent Scan Thumbnail */}
                        <div className="absolute bottom-28 left-6 z-20 group cursor-pointer" onClick={() => navigate('/history')}>
                            <div className="relative w-16 h-16 rounded-xl border-2 border-white overflow-hidden shadow-lg hover:scale-105 transition-transform">
                                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiiszFUdNpzrwH9O_TOivTA-EyAP7BTZc1pI3B3SKxvgXQNuuWnZn0hyiZ2Ld7NaN88LN-Ew0MrAWLjEmt-4Xo-hXSx8d_9vsmH6wvTeEcn5hSLQftRhT3X7MMLeUgQ1YllTE839MYPwNV1V_xZ87qIZx1QYw3WVwTWi7dzPluoks5igs5WftBpOf_dAa_NH1jxLymfob-vr1JC-55q8y8eQyELJq_MzCVVhQFjiH2rNZNtjxYUFQ2vCUDdNaJcQ6BGNmuHACBkLs" alt="recent" />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            <p className="text-white font-label-sm mt-2 text-center drop-shadow-md">Recent</p>
                        </div>

                        {/* Shutter Button */}
                        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
                            <button onClick={() => navigate('/analysis')} className="group flex items-center justify-center p-1 rounded-full border-4 border-white/30 hover:border-white transition-colors duration-200">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-90 transition-transform duration-100">
                                    <div className="w-16 h-16 rounded-full border-2 border-[#5E7D6B] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#5E7D6B] text-4xl">photo_camera</span>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Gallery */}
                        <div className="absolute bottom-28 right-6 z-20">
                            <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg">
                                <span className="material-symbols-outlined">photo_library</span>
                            </button>
                            <p className="text-white font-label-sm mt-2 text-center drop-shadow-md">Gallery</p>
                        </div>
                    </main>

                    {/* Side Panel (Desktop only) */}
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
                        <div className="mt-auto">
                            <button className="w-full py-4 bg-[#5E7D6B] text-white rounded-xl font-label-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">cloud_upload</span>
                                BATCH UPLOAD
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        const AnalysisScreen = () => {
            return (
                <div className="bg-background min-h-screen pb-32">
                    <TopAppBar rightIcons={['history']} />
                    <main className="px-container-margin py-stack-md max-w-2xl mx-auto space-y-stack-lg pt-20">
                        <section className="space-y-stack-md">
                            <div className="flex items-center gap-stack-md">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant shadow-sm">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGEeaN4AjeRXp9ytVZxKlWYjD2-YCD4PIA08o0Nz9ELXmYzaftN-NvzSL9fOOB0ArXC2uior7mmS9vAP988GUxqRLMk9cvmatUV7VJz_9gtmnuqRahs_4hYqN3wdHQkeDdM58iToME3ZfkS18Ctc4rf4YmrZ0602S2qBbrGSrRnAYe3V_nAAl7-ML69Eaw3ipV_JXhBHJ9oKVqhkG_yQeAtB88BdGPxXanKBTl8scRs5Ui8vONG9R7qax-VDqM3wlxYFsxZ1F0U2A" alt="bricks" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-sm text-secondary uppercase tracking-wider mb-1">Detected Object</p>
                                    <h1 className="font-headline-md text-on-background">Red Clay Bricks</h1>
                                    <div className="flex items-center gap-1 mt-1 text-primary">
                                        <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                        <span className="font-label-bold">98% Match Confidence</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-surface-container-low rounded-xl p-stack-md flex justify-between items-center border border-outline-variant/30">
                                <div>
                                    <p className="font-label-sm text-secondary">Current Price (Lahore)</p>
                                    <p className="font-headline-md text-on-surface">18,500 PKR / 1000 pcs</p>
                                </div>
                                <div className="text-right">
                                    <span className="material-symbols-outlined text-secondary">location_on</span>
                                    <p className="font-label-sm text-secondary">Market Avg</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-stack-md">
                            <div className="flex justify-between items-end">
                                <h2 className="font-headline-md text-on-background">Recommended Alternative</h2>
                                <span className="bg-tertiary/10 text-tertiary font-label-bold text-label-sm px-3 py-1 rounded-full border border-tertiary/20">Sustainable Pick</span>
                            </div>
                            <div className="bg-white rounded-2xl border-2 border-primary overflow-hidden shadow-sm">
                                <div className="bg-primary p-stack-md flex justify-between items-center">
                                    <h3 className="font-headline-md text-on-primary">Fly Ash Bricks</h3>
                                    <span className="material-symbols-outlined text-on-primary">auto_awesome</span>
                                </div>
                                <div className="p-stack-md space-y-stack-md">
                                    <div className="grid grid-cols-2 gap-stack-md">
                                        <div className="bg-primary-container/10 p-stack-md rounded-xl border border-primary-container/20 text-center">
                                            <p className="font-label-bold text-primary">Cost Benefit</p>
                                            <p className="font-display-xl text-on-primary-fixed">20%</p>
                                            <p className="font-label-sm text-on-primary-fixed-variant">Cheaper</p>
                                        </div>
                                        <div className="bg-tertiary-container/10 p-stack-md rounded-xl border border-tertiary-container/20 text-center">
                                            <p className="font-label-bold text-tertiary">Impact</p>
                                            <p className="font-display-xl text-on-tertiary-fixed">45%</p>
                                            <p className="font-label-sm text-on-tertiary-fixed-variant">Carbon Savings</p>
                                        </div>
                                    </div>
                                    <p className="font-body-md text-on-surface-variant">Fly ash bricks are lighter, more durable, and require less mortar, significantly reducing overall construction costs in Punjab region.</p>
                                    <button className="w-full flex items-center justify-center gap-stack-sm bg-surface-container-high py-4 rounded-xl text-on-secondary-container hover:bg-surface-variant transition-colors group">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>volume_up</span>
                                        <span className="font-label-bold">Play Urdu Description</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-stack-md">
                            <h3 className="font-label-bold text-secondary uppercase tracking-widest">Verified Supplier Nearby</h3>
                            <div className="flex items-center gap-stack-md p-stack-md bg-white rounded-xl border border-outline-variant shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                                    <span className="material-symbols-outlined text-3xl">factory</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-bold text-on-surface">Indus Eco-Materials Co.</p>
                                    <p className="font-label-sm text-secondary">Raiwind Rd, Lahore • 4.8km away</p>
                                </div>
                                <div className="flex items-center text-primary">
                                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                    <span className="font-label-bold ml-1">4.9</span>
                                </div>
                            </div>
                        </section>
                    </main>
                    <div className="fixed bottom-24 left-0 w-full bg-white/80 backdrop-blur-md p-container-margin border-t border-outline-variant z-40 md:relative md:bottom-0 md:bg-transparent md:border-none">
                        <button className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                            <span className="material-symbols-outlined">chat</span>
                            Contact Supplier via WhatsApp
                        </button>
                    </div>
                </div>
            );
        };

        const MarketScreen = () => {
            return (
                <div className="bg-surface min-h-screen pb-24">
                    <TopAppBar rightIcons={['notifications', 'account_circle']} />
                    <main className="max-w-7xl mx-auto px-container-margin py-stack-md space-y-stack-lg pt-20">
                        <section className="flex flex-col md:flex-row md:items-center justify-between gap-stack-sm">
                            <div>
                                <h1 className="font-headline-lg text-on-surface">Lahore Material Trends</h1>
                                <p className="font-body-md text-on-surface-variant">Real-time construction cost index for Punjab region.</p>
                            </div>
                            <div className="flex items-center gap-unit bg-primary-container/10 border border-primary-container/20 px-stack-md py-stack-sm rounded-full w-fit">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                <span className="font-label-bold text-primary ml-2">Market Status: Active</span>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {[
                                { name: 'Bricks (Per 1000)', price: '₨14,500', trend: '2.4%', up: true, icon: 'trending_up' },
                                { name: 'Cement (Per Bag)', price: '₨1,210', trend: '0.8%', up: false, icon: 'trending_down' },
                                { name: 'Steel (Per Tonne)', price: '₨265k', trend: '0.0%', neutral: true, icon: 'horizontal_rule' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md hover:border-primary-container transition-colors">
                                    <div className="flex justify-between items-start mb-stack-md">
                                        <div>
                                            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">{item.name}</p>
                                            <h3 className="font-display-xl text-on-surface">{item.price}</h3>
                                        </div>
                                        <div className={`px-stack-sm py-1 rounded-full flex items-center gap-1 ${item.neutral ? 'bg-surface-variant' : (item.up ? 'bg-error-container text-on-error-container' : 'bg-primary/10 text-primary')}`}>
                                            <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                            <span className="font-label-bold text-label-sm">{item.trend}</span>
                                        </div>
                                    </div>
                                    <div className="h-24 w-full flex items-end gap-1 px-1">
                                        {[40, 55, 45, 60, 75, 65, 85, 100].map((h, i) => (
                                            <div key={i} className={`w-full ${i === 7 ? 'bg-primary' : 'bg-primary/20'} rounded-t-sm`} style={{height: `${h}%`}}></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                            <div className="bg-tertiary-container text-on-tertiary-container rounded-2xl p-stack-lg relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                                <div className="relative z-10">
                                    <h2 className="font-headline-lg mb-unit">Weekly Prediction</h2>
                                    <p className="font-body-md opacity-90 max-w-md">Our AI models predict a <span className="font-bold">4.2% decrease</span> in aggregate costs by next Tuesday. Ideal window for bulk procurement begins in 48 hours.</p>
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
                                    <button className="w-full bg-white text-tertiary font-label-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
                                        Download Planning Report (PDF)
                                    </button>
                                </div>
                                <div className="absolute -right-16 -top-16 opacity-20">
                                    <span className="material-symbols-outlined text-[300px]">analytics</span>
                                </div>
                            </div>

                            <div className="space-y-gutter">
                                <div className="bg-surface-container-high border border-outline-variant rounded-2xl p-stack-md flex items-center gap-stack-md">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="font-label-bold text-on-surface">Hotspot: Raiwind Industrial</h4>
                                        <p className="font-body-md text-label-sm text-on-surface-variant">Supplies are 15% cheaper due to new local kiln openings.</p>
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
                </div>
            );
        };

        const HistoryScreen = () => {
            const historyItems = [
                { title: 'Cement (Type-1)', date: 'Oct 24, 2023', site: 'Site Alpha', price: 'PKR 1,250', status: 'STABLE', statusBg: 'bg-tertiary-fixed', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADmVf0fAj8vTLm9RXrwP89kNgdQWdh-leLbcCX1OMrJHyh4kUnT01gcrgrDoekJ6gNkebiu0tbuWgdOzzVrgJhc0QrNoqXB2UAL67AAlH6fVPhpdQ4C84ukW62x_3OkBfC2tD8UdnozXbj8-Gbs8SBZNH-tFYQGnu8hY6GQtVBr_7JC7VE4rsJ4xJ50a7e4L76iykCTSnTyHmZZ27Hj8pkfZBFnoRBJsafnhh1ugjVEGTPCyCTDjH6_NK0kwwwYVjsF0nLpua7HcY' },
                { title: 'Steel Bars (Grade 60)', date: 'Oct 22, 2023', site: 'DHA Phase 6', price: 'PKR 265,000', status: '↑ 4.2%', statusBg: 'bg-error-container', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDligt2Fa66vy3QqCSziBbP9tTtP-WmRg5Zz9ER6pRAQ6gO3zACZfAqc4bary3jxGMNxGpmW1o8DoPxzHauPT-fvtACvsAIEJjt7CmNpD6i2hhfthanrc_NRCxiK5Fk3Uys3JsN1CzAXYmg2pE-o2ixCcH4EUoF204_h0a2KdAxe3y2gYeavYQq7v7zl3jCWCq2dQ33N93LgINqbW-XF-EUyOkakWiUNSj5zGClv9bVhioCZ3M7mQCh_f9RHM6-SI4lAPFZDpOYXS8' },
                { title: 'Red Bricks (First Class)', date: 'Oct 19, 2023', site: 'Gulberg III', price: 'PKR 18/pc', status: 'STABLE', statusBg: 'bg-tertiary-fixed', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTmJJD2ZiKGIt-QlpmRtI9mRdFNtt-_rZ6iR-udIlZwrehm3huxjR-hg5oKcsXQzMq6F_qVo5fnzFMb4lA21qtR2E28Cap_FsUD2nH_r0yayApkpNyuYzOJpTNcTwBuZl7XqE1xApMeVQFbU0u3sCV0khpzA_CdkLIn68FN1T2Uiri9TOWvRkbLLz1XuuuU8KRyEQyWxMhsgKM0U1kEIf9XxA99bxGly8hyY12l0UsR8mBHJiZlTMKaguISTkSV895mKLb-BCGRkU' },
                { title: 'Crushed Stone (Sargodha)', date: 'Oct 15, 2023', site: 'Site Beta', price: 'PKR 110/cu.ft', status: '↓ 1.5%', statusBg: 'bg-secondary-container', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArjjnJxzFuyBbtE1ZcwWzZvv4n9JSreMIAFFZS7EtaqBixc-bkl9RuSuaofoQ6gmGfAl96xc3McsPNdqHEfL2zaCwQC30_5G5KB5NUHZ54GBkEU58K5z7zL8HWDIGGBbHdfCKXZ1W_HiIZVwGxwkkIDMBADX0IUY4GDPi5mwmCrb9Il8S3HKS2axEJkiQB8HsAL-NUD94DNLakv0KmTxKNXNsDVh2qiVWqzoGKGZiIT2TCmW7tQx_94OdP4kSu4_KHZ2j3fVoGfIk' }
            ];

            return (
                <div className="bg-background min-h-screen pb-32">
                    <TopAppBar rightIcons={['filter_list', 'account_circle']} />
                    <main className="pt-20 px-container-margin max-w-2xl mx-auto">
                        <div className="mb-stack-lg">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-outline">search</span>
                                </div>
                                <input className="w-full h-12 bg-white border-2 border-outline-variant rounded-xl pl-12 pr-4 focus:border-primary focus:ring-0 font-body-md transition-all" placeholder="Search scan history..." type="text"/>
                            </div>
                        </div>
                        <div className="mb-stack-md">
                            <h1 className="font-headline-md text-on-surface">Recent Scans</h1>
                            <p className="font-body-md text-on-surface-variant">Review and manage your environmental material audits.</p>
                        </div>
                        <div className="space-y-stack-sm">
                            {historyItems.map((item, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
                                        <img className="w-full h-full object-cover" src={item.img} alt={item.title} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-label-bold text-on-surface truncate">{item.title}</h3>
                                        <p className="font-label-sm text-on-surface-variant">{item.date} • {item.site}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-label-bold text-primary">{item.price}</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${item.statusBg}`}>{item.status}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-stack-lg py-stack-lg text-center border-t border-slate-200">
                            <p className="font-label-sm text-outline">You've reached the end of your recent history.</p>
                            <button className="mt-stack-md text-primary font-label-bold flex items-center justify-center gap-2 mx-auto hover:underline">
                                View All History <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </main>
                </div>
            );
        };

        // --- App Setup ---

        const App = () => {
            return (
                <MemoryRouter>
                    <div className="min-h-screen">
                        <Routes>
                            <Route path="/" element={<ScannerScreen />} />
                            <Route path="/analysis" element={<AnalysisScreen />} />
                            <Route path="/history" element={<HistoryScreen />} />
                            <Route path="/market" element={<MarketScreen />} />
                        </Routes>
                        <BottomNavBar />
                    </div>
                </MemoryRouter>
            );
        };

        const container = document.getElementById('root');
        const root = createRoot(container);
        root.render(<App />);
    </script>

    </div>
  );
}
