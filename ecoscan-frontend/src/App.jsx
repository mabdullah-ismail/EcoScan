import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

const getSessionId = () => {
    let sid = localStorage.getItem('ecoscan_session_id');
    if (!sid) {
        sid = 'PX-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        localStorage.setItem('ecoscan_session_id', sid);
    }
    return sid;
};

// --- Common Components ---

const TopAppBar = ({ title = "EcoScan", showBack = false, rightIcons = [] }) => {
    const navigate = useNavigate();
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[#F8FAF9] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 py-3">
            <div className="text-xl font-black text-[#5E7D6B] dark:text-emerald-400 flex items-center gap-2 font-['Public_Sans'] font-semibold tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                <span className="material-symbols-outlined">eco</span>
                <span>{title}</span>
            </div>
            <div className="flex items-center gap-4">
                {rightIcons.map((item, idx) => (
                    <button key={idx} onClick={item.onClick} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">
                        <span className="material-symbols-outlined">{item.icon}</span>
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
    const [isScanning, setIsScanning] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const [recentImg, setRecentImg] = useState(null);

    React.useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        startCamera();
        
        const history = JSON.parse(localStorage.getItem('ecoscan_history') || '[]');
        if (history.length > 0) setRecentImg(history[0].img);

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleFlash = async () => {
        if (!videoRef.current || !videoRef.current.srcObject) return;
        const track = videoRef.current.srcObject.getVideoTracks()[0];
        if (!track) return;
        try {
            const capabilities = track.getCapabilities();
            // Check if torch is supported
            if (capabilities.torch) {
                await track.applyConstraints({
                    advanced: [{ torch: !flashOn }]
                });
                setFlashOn(!flashOn);
            } else {
                alert("Flashlight is not supported by your camera browser.");
            }
        } catch (err) {
            console.error(err);
            alert("Could not enable flashlight.");
        }
    };

    const processScan = async (blob) => {
        setIsScanning(true);
        const formData = new FormData();
        formData.append("file", blob, "capture.jpg");
        
        try {
            const res = await fetch("https://ecoscan-backend-rxmp.onrender.com/scan", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            
            // Save history
            const history = JSON.parse(localStorage.getItem('ecoscan_history') || '[]');
            const newEntry = {
                title: data.material,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                site: 'Session ' + getSessionId(),
                price: 'PKR ' + data.cost,
                status: data.confidence > 0.8 ? 'HIGH CONF' : 'LOW CONF',
                statusBg: data.confidence > 0.8 ? 'bg-tertiary-fixed' : 'bg-error-container',
                resultData: data,
            };
            
            const reader = new FileReader();
            reader.onloadend = () => {
                newEntry.img = reader.result;
                history.unshift(newEntry);
                localStorage.setItem('ecoscan_history', JSON.stringify(history));
                navigate("/analysis", { state: { result: data, image: newEntry.img } });
            };
            reader.readAsDataURL(blob);

        } catch (err) {
            alert("Scan failed. Is backend running?");
            setIsScanning(false);
        }
    };

    const handleCapture = async () => {
        if (!videoRef.current || isScanning) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            if (blob) processScan(blob);
        }, 'image/jpeg', 0.9);
    };

    const handleGalleryUpload = async (e) => {
        const file = e.target.files[0];
        if (file) processScan(file);
    };
    
    return (
        <div className="bg-background overflow-hidden h-screen">
            <TopAppBar rightIcons={[
                { icon: flashOn ? 'flash_off' : 'flash_on', onClick: toggleFlash }
            ]} />
            <main className="relative h-full w-full flex flex-col justify-center items-center pt-16 pb-24">
                <div className="absolute inset-0 z-0">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover bg-black"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
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
                                {getSessionId()}
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-[90%] max-w-xs z-20">
                        <p className="text-white font-label-bold">Detecting Surface...</p>
                        <p className="text-white/70 font-label-sm mt-1">Keep the material within the green corners for optimal analysis.</p>
                    </div>
                </div>

                {/* Recent Scan Thumbnail */}
                {recentImg && (
                <div className="absolute bottom-28 left-6 z-20 group cursor-pointer" onClick={() => navigate('/history')}>
                    <div className="relative w-16 h-16 rounded-xl border-2 border-white overflow-hidden shadow-lg hover:scale-105 transition-transform">
                        <img className="w-full h-full object-cover" src={recentImg} alt="recent" />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <p className="text-white font-label-sm mt-2 text-center drop-shadow-md">Recent</p>
                </div>
                )}

                {/* Shutter Button */}
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
                    <button onClick={handleCapture} disabled={isScanning} className="group flex items-center justify-center p-1 rounded-full border-4 border-white/30 hover:border-white transition-colors duration-200">
                        <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-90 transition-transform duration-100 ${isScanning ? 'animate-pulse' : ''}`}>
                            <div className="w-16 h-16 rounded-full border-2 border-[#5E7D6B] flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#5E7D6B] text-4xl">
                                    {isScanning ? 'hourglass_empty' : 'photo_camera'}
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Gallery */}
                <div className="absolute bottom-28 right-6 z-20">
                    <label className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                        <span className="material-symbols-outlined">photo_library</span>
                    </label>
                    <p className="text-white font-label-sm mt-2 text-center drop-shadow-md">Gallery</p>
                </div>
            </main>
        </div>
    );
};

const AnalysisScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state?.result || {
        material: "No Material Scanned", confidence: 0, cost: 0, alt: "N/A", saving: 0, urdu_response: ""
    };
    const imageUrl = location.state?.image || "";
    const [isPlaying, setIsPlaying] = useState(false);

    const playUrdu = async () => {
        if (isPlaying || !result.urdu_response) return;
        setIsPlaying(true);
        try {
            const res = await fetch("https://ecoscan-backend-rxmp.onrender.com/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: result.urdu_response })
            });
            const data = await res.json();
            const audio = new Audio("data:audio/mp3;base64," + data.audio);
            audio.onended = () => setIsPlaying(false);
            audio.play();
        } catch (e) {
            alert("Failed to play audio");
            setIsPlaying(false);
        }
    };

    const contactWhatsApp = () => {
        const text = encodeURIComponent(`Hello, I am interested in procuring ${result.alt} for my construction project as recommended by EcoScan.`);
        window.open(`https://wa.me/923101766224?text=${text}`, '_blank');
    };

    return (
        <div className="bg-background min-h-screen pb-48">
            <TopAppBar rightIcons={[
                { icon: 'history', onClick: () => navigate('/history') }
            ]} />
            <main className="px-container-margin py-stack-md max-w-2xl mx-auto space-y-stack-lg pt-20">
                <section className="space-y-stack-md">
                    <div className="flex items-center gap-stack-md">
                        {imageUrl && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant shadow-sm">
                            <img className="w-full h-full object-cover" src={imageUrl} alt="material" />
                        </div>
                        )}
                        <div className="flex-1">
                            <p className="font-label-sm text-secondary uppercase tracking-wider mb-1">Detected Object</p>
                            <h1 className="font-headline-md text-on-background">{result.material}</h1>
                            <div className="flex items-center gap-1 mt-1 text-primary">
                                <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                <span className="font-label-bold">{Math.round(result.confidence * 100)}% Match Confidence</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-stack-md flex justify-between items-center border border-outline-variant/30">
                        <div>
                            <p className="font-label-sm text-secondary">Current Price (Lahore)</p>
                            <p className="font-headline-md text-on-surface">{result.cost} PKR</p>
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
                            <h3 className="font-headline-md text-on-primary">{result.alt}</h3>
                            <span className="material-symbols-outlined text-on-primary">auto_awesome</span>
                        </div>
                        <div className="p-stack-md space-y-stack-md">
                            <div className="grid grid-cols-2 gap-stack-md">
                                <div className="bg-primary-container/10 p-stack-md rounded-xl border border-primary-container/20 text-center">
                                    <p className="font-label-bold text-primary">Cost Benefit</p>
                                    <p className="font-display-xl text-on-primary-fixed">{result.saving}%</p>
                                    <p className="font-label-sm text-on-primary-fixed-variant">Cheaper</p>
                                </div>
                                <div className="bg-tertiary-container/10 p-stack-md rounded-xl border border-tertiary-container/20 text-center">
                                    <p className="font-label-bold text-tertiary">Impact</p>
                                    <p className="font-display-xl text-on-tertiary-fixed">45%</p>
                                    <p className="font-label-sm text-on-tertiary-fixed-variant">Carbon Savings</p>
                                </div>
                            </div>
                            <p className="font-body-md text-on-surface-variant">Switching to {result.alt} reduces environmental impact and significantly decreases overall construction costs.</p>
                            <button onClick={playUrdu} className="w-full flex items-center justify-center gap-stack-sm bg-surface-container-high py-4 rounded-xl text-on-secondary-container hover:bg-surface-variant transition-colors group">
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{isPlaying ? 'graphic_eq' : 'volume_up'}</span>
                                <span className="font-label-bold">{isPlaying ? 'Playing...' : 'Play Urdu Description'}</span>
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
                <button onClick={contactWhatsApp} className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                    <span className="material-symbols-outlined">chat</span>
                    Contact Supplier via WhatsApp
                </button>
            </div>
        </div>
    );
};

const MarketScreen = () => {
    const [marketData, setMarketData] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetch("https://ecoscan-backend-rxmp.onrender.com/market-data")
            .then(res => res.json())
            .then(data => setMarketData(data))
            .catch(err => console.error(err));
    }, []);

    const downloadPDF = () => {
        if (!marketData) return;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("EcoScan Planning Report", 20, 20);
        doc.setFontSize(12);
        doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);
        
        doc.text("Market Prediction:", 20, 45);
        const splitText = doc.splitTextToSize(marketData.prediction.text, 170);
        doc.text(splitText, 20, 52);
        
        doc.text("Current Rates:", 20, 75);
        let y = 82;
        marketData.items.forEach(item => {
            doc.text(`- ${item.name}: ${item.price} (${item.trend})`, 20, y);
            y += 10;
        });
        
        doc.save("ecoscan_planning_report.pdf");
    };

    if (!marketData) {
        return (
            <div className="bg-surface min-h-screen flex items-center justify-center">
                <p className="font-label-bold text-secondary animate-pulse">Loading Live Market Data...</p>
                <BottomNavBar />
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen pb-24">
            <TopAppBar rightIcons={[
                { icon: 'notifications', onClick: () => setShowNotifications(!showNotifications) }
            ]} />
            
            {showNotifications && (
                <div className="fixed top-16 right-4 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="bg-primary/10 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-label-bold text-primary">Alerts</span>
                        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">2 New</span>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <p className="font-label-sm font-bold text-slate-800">Cement Price Drop</p>
                            <p className="text-xs text-slate-500 mt-1">Expected 2.5% decrease next week.</p>
                        </div>
                        <div>
                            <p className="font-label-sm font-bold text-slate-800">Bulk Steel Supply</p>
                            <p className="text-xs text-slate-500 mt-1">Raiwind kilns opened today.</p>
                        </div>
                    </div>
                </div>
            )}

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
                        <span className="font-label-bold text-primary ml-2">Market Status: {marketData.status}</span>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {marketData.items.map((item, idx) => (
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
                            <p className="font-body-md opacity-90 max-w-md">{marketData.prediction.text}</p>
                        </div>
                        <div className="relative z-10 space-y-stack-md mt-stack-lg">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-stack-md border border-white/20">
                                <div className="flex justify-between items-center mb-unit">
                                    <span className="font-label-bold">Confidence Score</span>
                                    <span className="font-label-bold">{marketData.prediction.confidence}%</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white" style={{width: `${marketData.prediction.confidence}%`}}></div>
                                </div>
                            </div>
                            <button onClick={downloadPDF} className="w-full bg-white text-tertiary font-label-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
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
                                <h4 className="font-label-bold text-on-surface">{marketData.hotspot.title}</h4>
                                <p className="font-body-md text-label-sm text-on-surface-variant">{marketData.hotspot.desc}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-gutter">
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md text-center">
                                <p className="font-label-sm text-on-surface-variant mb-unit">Sand (Truckload)</p>
                                <p className="font-headline-md text-on-surface">{marketData.hotspot.sand.price}</p>
                                <span className={`text-[10px] font-bold ${marketData.hotspot.sand.up ? 'text-error' : 'text-primary'}`}>{marketData.hotspot.sand.trend}</span>
                            </div>
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md text-center">
                                <p className="font-label-sm text-on-surface-variant mb-unit">Crush (Cubic Ft)</p>
                                <p className="font-headline-md text-on-surface">{marketData.hotspot.crush.price}</p>
                                <span className={`text-[10px] font-bold ${marketData.hotspot.crush.up ? 'text-error' : 'text-primary'}`}>{marketData.hotspot.crush.trend}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

const HistoryScreen = () => {
    const navigate = useNavigate();
    const [historyItems, setHistoryItems] = useState([]);
    const [viewAll, setViewAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterType, setFilterType] = useState('ALL'); // ALL, HIGH, LOW

    const handleItemClick = (item) => {
        const result = item.resultData || {
            material: item.title,
            confidence: item.status === 'HIGH CONF' ? 0.9 : 0.5,
            cost: parseInt(item.price.replace(/\D/g, '') || '0', 10),
            carbon: 0,
            alt: "Eco-Friendly Alternative",
            saving: 0,
            urdu_response: ""
        };
        navigate("/analysis", { state: { result: result, image: item.img } });
    };

    useEffect(() => {
        setHistoryItems(JSON.parse(localStorage.getItem('ecoscan_history') || '[]'));
    }, []);

    const handleDelete = (e, itemToDelete) => {
        e.stopPropagation();
        const newItems = historyItems.filter(item => item !== itemToDelete);
        setHistoryItems(newItems);
        localStorage.setItem('ecoscan_history', JSON.stringify(newItems));
    };

    let filteredItems = historyItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterType === 'HIGH') {
        filteredItems = filteredItems.filter(item => item.status === 'HIGH CONF');
    } else if (filterType === 'LOW') {
        filteredItems = filteredItems.filter(item => item.status === 'LOW CONF');
    }

    const displayedItems = viewAll ? filteredItems : filteredItems.slice(0, 4);

    return (
        <div className="bg-background min-h-screen pb-32">
            <TopAppBar rightIcons={[
                { icon: 'filter_list', onClick: () => setShowFilter(!showFilter) }
            ]} />
            
            {showFilter && (
                <div className="fixed top-16 right-4 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col">
                    <button onClick={() => { setFilterType('ALL'); setShowFilter(false); }} className={`px-4 py-3 text-left font-label-sm ${filterType === 'ALL' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50'}`}>All Scans</button>
                    <button onClick={() => { setFilterType('HIGH'); setShowFilter(false); }} className={`px-4 py-3 text-left font-label-sm ${filterType === 'HIGH' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50'}`}>High Confidence</button>
                    <button onClick={() => { setFilterType('LOW'); setShowFilter(false); }} className={`px-4 py-3 text-left font-label-sm ${filterType === 'LOW' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50'}`}>Low Confidence</button>
                </div>
            )}

            <main className="pt-20 px-container-margin max-w-2xl mx-auto">
                <div className="mb-stack-lg">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-outline">search</span>
                        </div>
                        <input 
                            className="w-full h-12 bg-white border-2 border-outline-variant rounded-xl pl-12 pr-4 focus:border-primary focus:ring-0 font-body-md transition-all" 
                            placeholder="Search scan history..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-stack-md">
                    <h1 className="font-headline-md text-on-surface">Recent Scans</h1>
                    <p className="font-body-md text-on-surface-variant">Review and manage your environmental material audits.</p>
                </div>
                
                {historyItems.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">history</span>
                        <p className="font-label-bold text-slate-500">No scans yet</p>
                        <p className="font-label-sm text-slate-400 mt-1">Your recent material scans will appear here.</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="font-label-sm text-slate-400">No matching scans found.</p>
                    </div>
                ) : (
                    <div className="space-y-stack-sm">
                        {displayedItems.map((item, idx) => (
                            <div key={idx} onClick={() => handleItemClick(item)} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-gutter hover:bg-surface-container transition-colors group cursor-pointer">
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
                                    <img className="w-full h-full object-cover" src={item.img} alt={item.title} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-label-bold text-on-surface truncate">{item.title}</h3>
                                    <p className="font-label-sm text-on-surface-variant">{item.date} • {item.site}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-label-bold text-primary">{item.price}</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${item.statusBg} text-white`}>{item.status}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center ml-2">
                                    <button 
                                        onClick={(e) => handleDelete(e, item)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete scan"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {filteredItems.length > 4 && (
                    <div className="mt-stack-lg py-stack-lg text-center border-t border-slate-200">
                        <p className="font-label-sm text-outline">Showing {viewAll ? 'all' : 'recent'} matches.</p>
                        <button onClick={() => setViewAll(!viewAll)} className="mt-stack-md text-primary font-label-bold flex items-center justify-center gap-2 mx-auto hover:underline">
                            {viewAll ? 'View Less' : 'View All History'} <span className="material-symbols-outlined text-[18px]">{viewAll ? 'arrow_upward' : 'arrow_forward'}</span>
                        </button>
                    </div>
                )}
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

export default App;
