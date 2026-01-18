import { useState, useEffect, useRef } from 'react';
import { storage } from '../utils/storage';
import { playKeySound, getHotmartUrl } from '../utils/animations';
import { ga4Tracking } from '../utils/ga4Tracking';

import { 
    getTitle, 
    getLoadingMessage, 
    getCopy, 
    getVentana72Copy,
    getOfferTitle,
    getFeatures, 
    getFaseText
} from '../utils/contentByGender';
import { getEmotionalValidation } from '../utils/emotionalValidation';

interface ResultProps {
    onNavigate: (page: string) => void;
}

export default function Result({ onNavigate }: ResultProps) {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [isVideoButtonEnabled] = useState(true); // Task 1: Botão sempre ativo
    const [buttonCheckmarks, setButtonCheckmarks] = useState<{[key: number]: boolean}>({
        0: false, 1: false, 2: false
    });

    const getInitialTime = () => {
        const savedTimestamp = localStorage.getItem('quiz_timer_start');
        if (savedTimestamp) {
            const startTime = parseInt(savedTimestamp);
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = (47 * 60) - elapsed;
            return remaining > 0 ? remaining : 0;
        }
        localStorage.setItem('quiz_timer_start', Date.now().toString());
        return 47 * 60;
    };

    const [timeLeft, setTimeLeft] = useState(getInitialTime());
    const [spotsLeft] = useState(storage.getSpotsLeft());
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingStep, setLoadingStep] = useState(0);

    const quizData = storage.getQuizData(); // ✅ Dados do Chat
    const diagnosticoSectionRef = useRef<HTMLDivElement>(null);
    const videoSectionRef = useRef<HTMLDivElement>(null);
    const consolidatedSectionRef = useRef<HTMLDivElement>(null);
    const offerSectionRef = useRef<HTMLDivElement>(null);

    const gender = quizData.gender || 'HOMBRE';

    useEffect(() => {
        ga4Tracking.resultPageView();
        window.scrollTo(0, 0);

        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => (prev >= 100 ? 100 : prev + 10));
        }, 80);

        const timerPhase1 = setTimeout(() => {
            setCurrentPhase(1);
            playKeySound();
        }, 1000); // Task 6: 1s de loading apenas

        const countdownInterval = setInterval(() => setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1)), 1000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timerPhase1);
            clearInterval(countdownInterval);
        };
    }, []);

    useEffect(() => {
        if (currentPhase === 2 && videoSectionRef.current) {
            const vslPlaceholder = videoSectionRef.current.querySelector('.vsl-placeholder');
            if (vslPlaceholder && !vslPlaceholder.querySelector('vturb-smartplayer')) {
                vslPlaceholder.innerHTML = `
                    <div style="position: relative; width: 100%; max-width: 400px; margin: 0 auto; aspect-ratio: 9 / 16; background: #000; border-radius: 8px; overflow: hidden;">
                        <vturb-smartplayer id="vid-695d3caeda723d6f8681bb69" style="display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></vturb-smartplayer>
                    </div>
                `;
                const s = document.createElement("script");
                s.src = "https://scripts.converteai.net/3a065640-eb45-46c2-91c4-76240dafeb82/players/695d3caeda723d6f8681bb69/v4/player.js";
                s.async = true;
                document.head.appendChild(s);
            }
        }
        if (currentPhase === 3 && consolidatedSectionRef.current) {
            if (!document.querySelector('script[src*="695d3c6093850164e9f7b6e0"]')) {
                const s = document.createElement("script");
                s.src = "https://scripts.converteai.net/3a065640-eb45-46c2-91c4-76240dafeb82/players/695d3c6093850164e9f7b6e0/v4/player.js";
                s.async = true;
                document.head.appendChild(s);
            }
        }
    }, [currentPhase]);

    useEffect(() => {
        const refs = [null, diagnosticoSectionRef, videoSectionRef, consolidatedSectionRef, offerSectionRef];
        refs[currentPhase]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [currentPhase]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handlers Instantâneos
    const handlePhase1ButtonClick = () => { setCurrentPhase(2); ga4Tracking.phaseProgressionClicked({ phase_from: 1, phase_to: 2, button_name: 'Desbloquear Vídeo' }); };
    const handlePhase2ButtonClick = () => { setCurrentPhase(3); ga4Tracking.phaseProgressionClicked({ phase_from: 2, phase_to: 3, button_name: 'Revelar Ventana' }); };
    const handlePhase3ButtonClick = () => { setCurrentPhase(4); ga4Tracking.offerRevealed(); };

    return (
        <div className="result-container">
            <div className="result-header">
                <h1 className="result-title">Tu Plan Personalizado Está Listo</h1>
                <div className="urgency-bar">
                    <span className="urgency-icon">⚠️</span>
                    <span className="urgency-text">Tu análisis expira en: {formatTime(timeLeft)}</span>
                </div>
            </div>

            {currentPhase > 0 && (
                <div className="progress-bar-container fade-in">
                    {['Diagnóstico', 'Vídeo', 'Ventana 72h', 'Solución'].map((label, index) => (
                        <div key={index} className={`progress-step ${currentPhase > index + 1 ? 'completed' : ''} ${currentPhase === index + 1 ? 'active' : ''}`}>
                            <div className="step-circle">{currentPhase > index + 1 ? '✅' : index + 1}</div>
                            <span className="step-label">{label}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="revelations-container">
                {currentPhase === 0 && (
                    <div className="revelation loading-box-custom">
                        <div className="spin-brain">🧠</div>
                        <h2>ANALIZANDO TU CASO</h2>
                        <p>{getLoadingMessage(gender)}</p>
                        <div className="progress-outer"><div className="progress-inner" style={{ width: `${loadingProgress}%` }}></div></div>
                    </div>
                )}

                {currentPhase === 1 && (
                    <div ref={diagnosticoSectionRef} className="revelation fade-in">
                        <div className="revelation-header">
                            <div className="revelation-icon">💔</div>
                            <h2>{getTitle(gender)}</h2>
                        </div>
                        
                        {/* ✅ Personalização do Chat Restaurada */}
                        <div className="quiz-summary-box">
                            <p className="summary-title">📋 TU SITUACIÓN ESPECÍFICA</p>
                            <div className="summary-grid">
                                <div><span>✓</span> <strong>Tiempo:</strong> {quizData.timeSeparation || 'No especificado'}</div>
                                <div><span>✓</span> <strong>Quién terminó:</strong> {quizData.whoEnded || 'No especificado'}</div>
                                <div><span>✓</span> <strong>Contacto:</strong> {quizData.currentSituation || 'No especificado'}</div>
                                <div><span>✓</span> <strong>Compromiso:</strong> {quizData.commitmentLevel || 'No especificado'}</div>
                            </div>
                        </div>

                        <p className="revelation-text" style={{ whiteSpace: 'pre-line' }}>{getCopy(quizData)}</p>
                        <div className="emotional-validation">
                            <p><strong>Tu situación específica:</strong><br />{getEmotionalValidation(quizData)}</p>
                        </div>

                        <button className="cta-button btn-green btn-animation-fadein" onClick={handlePhase1ButtonClick}>
                            🔓 Desbloquear El Vídeo Secreto
                        </button>
                    </div>
                )}

                {currentPhase === 2 && (
                    <div ref={videoSectionRef} className="revelation fade-in vsl-revelation">
                        <div className="revelation-header">
                            <h2>Ahora solo falta un paso más para recuperar a la persona que amas.</h2>
                        </div>
                        <div className="vsl-container">
                            <div className="vsl-placeholder"></div> 
                        </div>

                        {/* Task 3: Price Anchor */}
                        <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px dashed #10b981' }}>
                            <p style={{ color: '#10b981', fontWeight: '900', fontSize: '1.2rem', margin: 0 }}>HOY: $17 (86% OFF)</p>
                        </div>

                        <button className="cta-button btn-yellow btn-animation-bounce" onClick={handlePhase2ButtonClick}>
                            Revelar VENTANA DE 72 HORAS
                        </button>

                        {/* ✅ Depoimentos Restaurados */}
                        <div className="testimonials-section">
                            <div className="testimonial-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(74, 222, 128, 0.1))', border: '2px solid rgba(16, 185, 129, 0.4)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '15px' }}>
                                <img src="https://comprarplanseguro.shop/wp-content/uploads/2025/08/Captura-de-Tela-2025-08-08-as-19.24.05.png" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                <div>
                                    <strong style={{ color: '#10b981' }}>Carlos M.</strong>
                                    <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>"Ella estaba con otro tipo. Yo estaba destruido. El Módulo 4 me salvó de cometer errores fatales."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentPhase === 3 && (
                    <div ref={consolidatedSectionRef} className="revelation fade-in ventana-box-custom">
                        <div className="ventana-header-custom">
                            <span>⚡</span>
                            <h2>LA VENTANA DE 72 HORAS</h2>
                        </div>
                        <p className="ventana-intro" style={{ whiteSpace: 'pre-line' }}>{getVentana72Copy(gender)}</p>
                        
                        <div className="fases-list">
                            {[1, 2, 3].map(f => (
                                <div key={f} className="fase-item-custom">
                                    <strong>FASE {f} ({f === 1 ? '0-24h' : f === 2 ? '24-48h' : '48-72h'})</strong>
                                    <p style={{ whiteSpace: 'pre-line' }}>{getFaseText(gender, f)}</p>
                                </div>
                            ))}
                        </div>

                        {/* ✅ Imagem da Ventana Restaurada */}
                        <img src="https://comprarplanseguro.shop/wp-content/uploads/2025/10/imagem3-nova.webp" className="ventana-img" style={{ width: '100%', borderRadius: '16px', margin: '20px 0' }} />

                        <div className="pre-offer-video-section" style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '2px solid #10b981' }}>
                            <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '15px' }}>🎥 MENSAJE FINAL ANTES DE REVELAR TU PLAN</h3>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto', aspectRatio: '9 / 16', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                                <vturb-smartplayer id="vid-695d3c6093850164e9f7b6e0" style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></vturb-smartplayer>
                            </div>
                        </div>

                        <button className="cta-button btn-orange btn-animation-pulse" onClick={handlePhase3ButtonClick}>
                            ⚡ Revelar Mi Plan Personalizado
                        </button>
                    </div>
                )}

                {currentPhase === 4 && (
                    <div ref={offerSectionRef} className="revelation fade-in offer-section-custom">
                        <div className="offer-badge">OFERTA EXCLUSIVA</div>
                        <h2 className="offer-title-main">{getOfferTitle(gender)}</h2>

                        <div className="price-box">
                            <p className="price-old">Precio regular: $123</p>
                            <p className="price-new">$17.00</p>
                            <p className="price-discount">💰 86% de descuento HOY</p>
                        </div>

                        <div className="offer-features">
                            {getFeatures(gender).map((feature, index) => (
                                <div key={index} className="feature" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ color: '#4ade80' }}>✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className="cta-button btn-green btn-animation-glowshake" onClick={() => window.open(getHotmartUrl(), '_blank')}>
                            🚀 SÍ, QUIERO ACCESO POR $17
                        </button>

                        <div className="guarantee-section" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '2px solid #4ade80', borderRadius: '16px', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
                            <h3 style={{ color: '#4ade80' }}>🛡️ GARANTÍA DE 30 DÍAS</h3>
                            <p>Si no ves resultados, te devolvemos el 100% de tu dinero.</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .result-container { padding-bottom: 100px; color: white; max-width: 800px; margin: 0 auto; }
                .result-header { text-align: center; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 12px; margin-bottom: 20px; }
                .result-title { font-size: clamp(1.5rem, 6vw, 2.5rem); font-weight: 900; }
                .urgency-bar { display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(234, 179, 8, 0.2); padding: 12px; border-radius: 8px; border: 2px solid #eab308; color: #facc15; }
                .progress-bar-container { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: rgba(0,0,0,0.4); border-radius: 12px; position: sticky; top: 0; z-index: 999; backdrop-filter: blur(5px); }
                .progress-step { flex: 1; display: flex; flex-direction: column; align-items: center; font-size: 0.7rem; opacity: 0.5; }
                .progress-step.active, .progress-step.completed { opacity: 1; }
                .step-circle { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; justify-content: center; align-items: center; margin-bottom: 5px; }
                .progress-step.active .step-circle { background: #eab308; color: black; }
                .progress-step.completed .step-circle { background: #4ade80; }
                .revelation { background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); border-radius: 16px; padding: clamp(20px, 5vw, 40px); margin-bottom: 30px; }
                .quiz-summary-box { background: rgba(234, 179, 8, 0.1); border: 2px solid #eab308; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
                .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem; }
                .cta-button { width: 100%; padding: 20px; border-radius: 12px; font-weight: 900; border: none; cursor: pointer; transition: transform 0.2s; font-size: 1.2rem; }
                .btn-green { background: #10b981; color: white; }
                .btn-yellow { background: #eab308; color: black; }
                .btn-orange { background: #f97316; color: white; }
                .price-new { font-size: 3rem; color: #facc15; font-weight: 900; text-align: center; }
                .price-old { text-decoration: line-through; text-align: center; opacity: 0.5; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin-brain { font-size: 3rem; animation: spin 2s linear infinite; text-align: center; }
                .progress-outer { width: 100%; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; margin-top: 20px; }
                .progress-inner { height: 100%; background: #eab308; transition: width 0.1s; }
                .fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .btn-animation-bounce { animation: bounce 1s infinite; }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            `}</style>
        </div>
    );
}