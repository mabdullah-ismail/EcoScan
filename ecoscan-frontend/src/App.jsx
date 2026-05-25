import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://ecoscan-backend-rxmp.onrender.com";


const getSessionId = () => {
    let sid = localStorage.getItem('ecoscan_session_id');
    if (!sid) {
        sid = 'PX-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        localStorage.setItem('ecoscan_session_id', sid);
    }
    return sid;
};

// --- Common Components ---

const BackendStatus = () => {
    const [isWaking, setIsWaking] = useState(false);
    
    useEffect(() => {
        const wakeBackend = async () => {
            const lastPing = localStorage.getItem('ecoscan_last_ping');
            const now = Date.now();
            
            // Only ping if last ping was more than 10 mins ago
            if (!lastPing || (now - parseInt(lastPing)) > 10 * 60 * 1000) {
                console.log("Waking up backend...");
                setIsWaking(true);
                try {
                    await fetch(`${BACKEND_URL}/health`);
                    localStorage.setItem('ecoscan_last_ping', now.toString());
                } catch (e) {
                    console.error("Wake-up ping failed", e);
                } finally {
                    setIsWaking(false);
                }
            }
        };
        wakeBackend();
    }, []);

    if (!isWaking) return null;
    return (
        <div className="fixed top-14 left-0 w-full z-[100] bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold py-1 px-4 flex items-center justify-center gap-2 animate-pulse">
            <span className="material-symbols-outlined text-xs animate-spin">sync</span>
            INITIALIZING AI ENGINE... PLEASE WAIT A MOMENT
        </div>
    );
};


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
            const res = await fetch(`${BACKEND_URL}/scan`, {
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
            console.error(err);
            alert("Scan failed. The AI engine might be starting up—please try again in 10 seconds.");
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
            <BackendStatus />
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
            const res = await fetch(`${BACKEND_URL}/speak`, {
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

    const downloadCertificate = () => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const W = 210, carbon = result.carbon || 0.5, altCarbon = result.alt_carbon || 0.2;
        const carbonSaving = result.carbon_saving_pct ?? Math.round((carbon - altCarbon) / carbon * 100);
        const costSaving = result.cost_saving_pct ?? result.saving ?? 35;
        const trees = Math.max(1, Math.round(carbon * 10));
        const date = new Date().toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' });
        // Header
        doc.setFillColor(94, 125, 107); doc.rect(0, 0, W, 45, 'F');
        doc.setTextColor(255,255,255); doc.setFontSize(26); doc.setFont('helvetica','bold');
        doc.text('EcoScan', 15, 18);
        doc.setFontSize(11); doc.setFont('helvetica','normal');
        doc.text('Pakistan\'s Eco-Construction Intelligence Platform', 15, 26);
        doc.setFontSize(16); doc.setFont('helvetica','bold');
        doc.text('CARBON IMPACT CERTIFICATE', W/2, 38, { align:'center' });
        // Body
        doc.setTextColor(30,30,30); doc.setFontSize(11); doc.setFont('helvetica','normal');
        doc.text(`Date: ${date}`, 15, 58);
        doc.text(`Session: ${getSessionId()}`, 15, 65);
        doc.text(`Location: Lahore, Pakistan`, 15, 72);
        doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.setTextColor(94,125,107);
        doc.text('MATERIAL IDENTIFIED', 15, 86);
        doc.setFontSize(20); doc.setTextColor(30,30,30);
        doc.text(result.material || 'Unknown', 15, 96);
        doc.setFontSize(11); doc.setFont('helvetica','normal');
        doc.text(`Confidence: ${Math.round((result.confidence||0)*100)}%   |   Lahore Market Price: PKR ${result.cost || 'N/A'}`, 15, 104);
        // Divider
        doc.setDrawColor(94,125,107); doc.setLineWidth(0.5); doc.line(15, 110, W-15, 110);
        // Impact boxes
        doc.setFillColor(240,247,243); doc.roundedRect(15, 116, 55, 38, 3, 3, 'F');
        doc.setFillColor(240,247,243); doc.roundedRect(78, 116, 55, 38, 3, 3, 'F');
        doc.setFillColor(240,247,243); doc.roundedRect(141, 116, 54, 38, 3, 3, 'F');
        doc.setFontSize(9); doc.setTextColor(94,125,107); doc.setFont('helvetica','bold');
        doc.text('CARBON SAVINGS', 42, 124, {align:'center'});
        doc.text('COST BENEFIT', 105, 124, {align:'center'});
        doc.text('TREES EQUIVALENT', 168, 124, {align:'center'});
        doc.setFontSize(22); doc.setTextColor(30,30,30);
        doc.text(`${carbonSaving}%`, 42, 138, {align:'center'});
        doc.text(`${costSaving >= 0 ? costSaving+'%' : '+'+Math.abs(costSaving)+'%'}`, 105, 138, {align:'center'});
        doc.text(`${trees}`, 168, 138, {align:'center'});
        doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(100,100,100);
        doc.text('reduction vs standard', 42, 148, {align:'center'});
        doc.text(costSaving >= 0 ? 'cheaper' : 'higher upfront', 105, 148, {align:'center'});
        doc.text('planted equivalent', 168, 148, {align:'center'});
        // Recommendation
        doc.line(15, 162, W-15, 162);
        doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.setTextColor(94,125,107);
        doc.text('ECO-FRIENDLY RECOMMENDATION', 15, 172);
        doc.setFontSize(16); doc.setTextColor(30,30,30);
        doc.text(result.alt || 'N/A', 15, 182);
        doc.setFontSize(10); doc.setFont('helvetica','normal');
        doc.text(`Standard footprint: ${carbon} kg CO\u2082/kg   |   Eco footprint: ${altCarbon} kg CO\u2082/kg`, 15, 191);
        const desc = doc.splitTextToSize(`Switching from ${result.material} to ${result.alt} reduces the carbon footprint by ${carbonSaving}% and is ${costSaving >= 0 ? costSaving+'% more cost-effective' : 'a premium eco investment'}. This recommendation is generated by EcoScan AI.`, W-30);
        doc.text(desc, 15, 200);
        // Footer
        doc.setFillColor(94,125,107); doc.rect(0, 272, W, 25, 'F');
        doc.setTextColor(255,255,255); doc.setFontSize(9);
        doc.text('Generated by EcoScan AI  |  ecoscan-pk.web.app  |  Pakistan\'s first eco-construction intelligence platform', W/2, 282, {align:'center'});
        doc.text('This certificate is AI-generated for informational purposes. Verify prices with local suppliers.', W/2, 289, {align:'center'});
        doc.save(`EcoScan_Certificate_${(result.material||'material').replace(/ /g,'_')}_${Date.now()}.pdf`);
        // Track in localStorage
        const count = parseInt(localStorage.getItem('ecoscan_certs') || '0') + 1;
        localStorage.setItem('ecoscan_certs', count);
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
                            {result.engine && (
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">memory</span>
                                    AI Engine: {result.engine}
                                </p>
                            )}
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
                                    <p className="font-display-xl text-on-primary-fixed">
                                        {(result.cost_saving_pct ?? result.saving) >= 0
                                            ? `${result.cost_saving_pct ?? result.saving}%`
                                            : `${Math.abs(result.cost_saving_pct ?? result.saving)}%`}
                                    </p>
                                    <p className="font-label-sm text-on-primary-fixed-variant">
                                        {(result.cost_saving_pct ?? result.saving) >= 0 ? 'Cheaper' : 'Higher Upfront Cost'}
                                    </p>
                                </div>
                                <div className="bg-tertiary-container/10 p-stack-md rounded-xl border border-tertiary-container/20 text-center">
                                    <p className="font-label-bold text-tertiary">Impact</p>
                                    <p className="font-display-xl text-on-tertiary-fixed">{result.carbon_saving_pct ?? Math.round((result.carbon - result.alt_carbon) / result.carbon * 100)}%</p>
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
            {/* Carbon Certificate CTA */}
            <section className="mx-4 mb-4 bg-gradient-to-r from-[#5E7D6B] to-emerald-600 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-white font-bold text-sm">🏆 Carbon Impact Certificate</p>
                    <p className="text-white/75 text-xs mt-0.5">Download your official eco report PDF</p>
                </div>
                <button onClick={downloadCertificate}
                    className="bg-white text-[#5E7D6B] font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">download</span>Get PDF
                </button>
            </section>
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
    const [suppliers, setSuppliers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [showNotif, setShowNotif] = useState(false);
    const [estType, setEstType] = useState('house');
    const [estSize, setEstSize] = useState('');
    const [estFloors, setEstFloors] = useState('1');
    const [estimate, setEstimate] = useState(null);
    const [estimating, setEstimating] = useState(false);

    const fmt = (n) => '₨' + Number(n).toLocaleString('en-PK');

    useEffect(() => {
        fetch(`${BACKEND_URL}/market-data`)
            .then(r => r.json()).then(setMarketData).catch(console.error);
        fetch(`${BACKEND_URL}/suppliers`)
            .then(r => r.json()).then(d => setSuppliers(d.suppliers || [])).catch(console.error);
        fetch(`${BACKEND_URL}/analytics`)
            .then(r => r.json()).then(setAnalytics).catch(console.error);
    }, []);

    const runEstimate = async () => {
        if (!estSize) return;
        setEstimating(true); setEstimate(null);
        try {
            const r = await fetch(`${BACKEND_URL}/estimate`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: estType, size: parseInt(estSize), floors: parseInt(estFloors) })
            });
            const data = await r.json();
            if (!r.ok || !data.items) {
                alert("Estimate failed: " + (data.detail || "Backend error. Try again."));
                return;
            }
            setEstimate(data);
        } catch(e) { alert("Could not reach backend. Is it awake? Try again in 30s."); }
        finally { setEstimating(false); }
    };

    const downloadPDF = () => {
        if (!marketData) return;
        const doc = new jsPDF();
        doc.setFontSize(20); doc.text("EcoScan Planning Report", 20, 20);
        doc.setFontSize(12); doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);
        doc.text("Market Prediction:", 20, 45);
        const split = doc.splitTextToSize(marketData.prediction.text, 170);
        doc.text(split, 20, 52);
        doc.text("Current Rates:", 20, 75); let y = 82;
        marketData.items.forEach(item => { doc.text(`- ${item.name}: ${item.price} (${item.trend})`, 20, y); y += 10; });
        if (estimate) {
            doc.text(`Project Estimate (${estSize} sqft):`, 20, y + 5);
            doc.text(`Standard: ${fmt(estimate.total_cost)} | Eco: ${fmt(estimate.eco_total)} | Save: ${estimate.savings_pct}%`, 20, y + 15);
        }
        doc.save("ecoscan_planning_report.pdf");
    };

    if (!marketData) return (
        <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-primary animate-pulse">trending_up</span>
            <p className="font-label-bold text-secondary animate-pulse">Loading Live Market Data...</p>
            <BottomNavBar />
        </div>
    );

    return (
        <div className="bg-surface min-h-screen pb-24">
            <TopAppBar rightIcons={[{ icon:'notifications', onClick:() => setShowNotif(!showNotif) }]} />

            {showNotif && (
                <div className="fixed top-16 right-4 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                    <div className="bg-primary/10 px-4 py-3 border-b flex justify-between items-center">
                        <span className="font-label-bold text-primary">Price Alerts</span>
                        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">2 New</span>
                    </div>
                    <div className="p-4 space-y-3">
                        <div><p className="font-label-sm font-bold text-slate-800">Cement Price Drop</p><p className="text-xs text-slate-500">Expected 2.5% decrease next week.</p></div>
                        <div><p className="font-label-sm font-bold text-slate-800">Bulk Steel Supply</p><p className="text-xs text-slate-500">Raiwind kilns opened today.</p></div>
                    </div>
                </div>
            )}

            <main className="max-w-2xl mx-auto px-4 pt-20 pb-4 space-y-5">

                {/* Header */}
                <section className="flex items-center justify-between">
                    <div>
                        <h1 className="font-headline-lg text-on-surface">Lahore Material Trends</h1>
                        <p className="text-xs text-on-surface-variant">Live construction cost index · Punjab</p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-primary"></span></span>
                        <span className="font-label-bold text-primary text-xs">{marketData.status}</span>
                    </div>
                </section>

                {/* Price Cards */}
                <section className="grid grid-cols-3 gap-2">
                    {marketData.items.map((item, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.name.split(' ')[0]}</p>
                            <p className="font-headline-md text-on-surface text-base">{item.price}</p>
                            <div className={`mt-1 flex items-center gap-0.5 text-[10px] font-bold ${item.neutral ? 'text-slate-400' : item.up ? 'text-red-500' : 'text-emerald-600'}`}>
                                <span className="material-symbols-outlined text-sm">{item.icon}</span>{item.trend}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Weekly Prediction */}
                <section className="bg-tertiary-container rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 opacity-10"><span className="material-symbols-outlined text-[120px]">analytics</span></div>
                    <p className="font-label-bold text-on-tertiary-container mb-1">📈 Weekly Prediction</p>
                    <p className="text-sm text-on-tertiary-container opacity-90 mb-3">{marketData.prediction.text}</p>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full" style={{width:`${marketData.prediction.confidence}%`}}></div></div>
                        <span className="text-xs font-bold text-on-tertiary-container">{marketData.prediction.confidence}%</span>
                        <button onClick={downloadPDF} className="bg-white/20 text-on-tertiary-container text-xs font-bold px-3 py-1.5 rounded-lg border border-white/30 active:scale-95 transition-transform">PDF ↓</button>
                    </div>
                </section>

                {/* ── PROJECT COST ESTIMATOR ── */}
                <section className="bg-white border-2 border-primary/30 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-primary px-4 py-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-white text-xl">calculate</span>
                        <h2 className="font-headline-md text-white flex-1">Project Cost Estimator</h2>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            {[['house','🏠 House'],['villa','🏡 Villa'],['commercial','🏢 Shop']].map(([t,l]) => (
                                <button key={t} onClick={() => setEstType(t)} className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${estType===t ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>{l}</button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Area (sqft)</label>
                                <input type="number" value={estSize} onChange={e => setEstSize(e.target.value)} placeholder="e.g. 1500"
                                    className="w-full mt-1 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Floors</label>
                                <select value={estFloors} onChange={e => setEstFloors(e.target.value)} className="w-full mt-1 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary outline-none bg-white">
                                    {[1,2,3,4,5].map(f => <option key={f} value={f}>{f} Floor{f>1?'s':''}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={runEstimate} disabled={estimating || !estSize}
                            className="w-full py-3 bg-primary text-white rounded-xl font-label-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
                            {estimating
                                ? <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>Calculating...</>
                                : <><span className="material-symbols-outlined text-sm">calculate</span>Calculate Material Cost</>}
                        </button>

                        {estimate?.items && (
                            <div className="space-y-3 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                                        <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Standard Cost</p>
                                        <p className="text-lg font-black text-red-600">{fmt(estimate.total_cost)}</p>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">With Eco Materials</p>
                                        <p className="text-lg font-black text-emerald-600">{fmt(estimate.eco_total)}</p>
                                    </div>
                                </div>
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                                    <div><p className="text-xs font-bold text-primary">💰 Total Savings</p><p className="text-xl font-black text-primary">{fmt(estimate.savings)}</p></div>
                                    <div className="text-right"><p className="text-3xl font-black text-primary">{estimate.savings_pct}%</p><p className="text-[10px] text-slate-400">cheaper with eco</p></div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material Breakdown</p>
                                    {estimate.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                                            <div><p className="text-sm font-bold text-on-surface">{item.name}</p><p className="text-[10px] text-slate-400">{item.qty.toLocaleString()} {item.unit} → {item.alt}</p></div>
                                            <div className="text-right"><p className="text-xs line-through text-slate-400">{fmt(item.total)}</p><p className="text-sm font-bold text-emerald-600">{fmt(item.eco_total)}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                {/* ── ADBMS REGIONAL ANALYTICS ── */}
                {analytics && (
                <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                    <div>
                        <h2 className="font-headline-md text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">database</span>
                            Regional Sustainability Insights
                        </h2>
                        <p className="text-xs text-slate-400">Aggregate statistics from MongoDB scans</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Scans Logged</p>
                            <p className="text-xl font-black text-slate-800">{analytics.total_scans}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">CO₂ Saved</p>
                            <p className="text-xl font-black text-emerald-600">{analytics.total_carbon_saved_kg} kg</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">AI Match Avg</p>
                            <p className="text-xl font-black text-primary">{analytics.average_confidence}%</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-label-bold">Top Green Districts (MongoDB Aggregation)</p>
                        <div className="space-y-1">
                            {analytics.savings_by_region?.map((reg, i) => (
                                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                                    <span className="text-slate-600 font-bold">{reg.region}</span>
                                    <span className="text-emerald-600 font-bold">{reg.scans} scans ({reg.carbon_saved} kg CO₂ saved)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                )}

                {/* ── ECO SUPPLIER MARKETPLACE ── */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div><h2 className="font-headline-md text-on-surface">Eco Supplier Network</h2><p className="text-xs text-slate-400">Verified sustainable suppliers · Lahore</p></div>
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">{suppliers.length} Verified</span>
                    </div>
                    <div className="space-y-2">
                        {suppliers.map((s, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-primary/30 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-lg">factory</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5"><p className="font-label-bold text-on-surface text-sm truncate">{s.name}</p><span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">✓ ECO</span></div>
                                    <p className="text-[10px] text-slate-400">{s.area}</p>
                                    <p className="text-[10px] text-primary font-bold truncate">{s.specialty}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                    <div className="flex items-center gap-0.5"><span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings:"'FILL' 1"}}>star</span><span className="text-xs font-bold">{s.rating}</span></div>
                                    <button onClick={() => window.open(`https://wa.me/${s.phone}?text=${encodeURIComponent(`Hi, I found you on EcoScan. I need ${s.specialty}.`)}`, '_blank')}
                                        className="flex items-center gap-1 bg-[#25D366] text-white px-2 py-1 rounded-lg text-[10px] font-bold active:scale-95 transition-transform">
                                        <span className="material-symbols-outlined text-sm">chat</span>Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── BECOME A SUPPLIER CTA ── */}
                <section className="bg-gradient-to-br from-[#5E7D6B] to-emerald-800 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10"><span className="material-symbols-outlined text-[100px]">storefront</span></div>
                    <div className="relative z-10">
                        <h3 className="font-headline-md mb-1">Sell on EcoScan Marketplace</h3>
                        <p className="text-sm opacity-80 mb-4">Join verified suppliers reaching thousands of contractors across Punjab. Zero commission during launch.</p>
                        <button onClick={() => window.open('https://wa.me/923101766224?text=' + encodeURIComponent('Hi EcoScan, I want to list my eco-material business on your marketplace.'), '_blank')}
                            className="flex items-center gap-2 bg-white text-[#5E7D6B] font-label-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform shadow-lg text-sm">
                            <span className="material-symbols-outlined text-sm">add_business</span>Register as Supplier
                        </button>
                    </div>
                </section>

            </main>
            <BottomNavBar />
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
