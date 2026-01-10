import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Timer, Volume2, VolumeX, X, Mic, Repeat } from 'lucide-react';
import Button from '../components/Button';
import { mockRecipes } from '../data/mockData';

const LiveCookingScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const recipe = mockRecipes.find(r => r.id === parseInt(id));
    const [currentStep, setCurrentStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(recipe?.steps[0].time || 0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Speak function
    const speak = (text) => {
        if (isMuted || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Background Pulse Effect
    useEffect(() => {
        const pulse = document.getElementById('cooking-pulse');
        if (pulse) pulse.animate([{ opacity: 0.1 }, { opacity: 0.3 }], { duration: 2000, iterations: Infinity, direction: 'alternate' });
    }, []);

    // Timer & Speech Effect
    useEffect(() => {
        if (recipe && recipe.steps[currentStep]) {
            setTimeLeft(recipe.steps[currentStep].time);
            setIsTimerRunning(true);
            speak(`Step ${currentStep + 1}. ${recipe.steps[currentStep].text || recipe.steps[currentStep].instruction}`);
        }
    }, [currentStep, recipe, isMuted]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            speak("Timer finished.");
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    if (!recipe) return null;

    const progress = ((currentStep + 1) / recipe.steps.length) * 100;

    const handleNext = () => {
        if (currentStep < recipe.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            speak("Cooking complete. Enjoy your meal!");
            navigate('/recipes');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col">
            {/* Top Bar */}
            <div className="p-6 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-[var(--glass-bg)] flex items-center justify-center">
                    <X size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Step {currentStep + 1} of {recipe.steps.length}</span>
                    <span className="font-bold">Live Cooking</span>
                </div>
                <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 flex items-center justify-center glass-panel rounded-full hover:bg-white/10 transition">
                    {isMuted ? <VolumeX size={20} className="text-[var(--text-secondary)]" /> : <Volume2 size={20} className="text-[var(--primary)]" />}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full px-6">
                <div className="h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-8 relative">

                {/* Step Image */}
                <div className="w-full h-48 rounded-[var(--radius-md)] overflow-hidden relative shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop" alt="Cooking Step" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute top-2 left-2 bg-[var(--primary)] text-[var(--bg-primary)] text-xs font-black px-2 py-1 rounded">
                        LIVE VIEW
                    </div>
                </div>

                {/* Instruction */}
                <div>
                    <h2 className="text-2xl font-bold leading-tight mb-4">
                        {recipe.steps[currentStep].text || recipe.steps[currentStep].instruction}
                    </h2>
                    <p className="text-[var(--primary)] text-lg animate-pulse font-medium">
                        {timeLeft < 60 && timeLeft > 0 ? "Almost done!" : "Keep it going..."}
                    </p>
                </div>

                {/* Timer */}
                <div className="flex gap-4">
                    <div className="glass-panel p-4 rounded-[var(--radius-md)] min-w-[100px]">
                        <span className="text-4xl font-black text-[var(--primary)] block">{formatTime(timeLeft).split(':')[0]}</span>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Minutes</span>
                    </div>
                    <div className="glass-panel p-4 rounded-[var(--radius-md)] min-w-[100px]">
                        <span className="text-4xl font-black text-[var(--primary)] block">{formatTime(timeLeft).split(':')[1]}</span>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Seconds</span>
                    </div>
                </div>

            </div>

            {/* Bottom Controls */}
            <div className="p-8 pb-12 space-y-6 bg-gradient-to-t from-black to-transparent">

                {/* Voice Wave Visualizer Mock */}
                <div className="flex justify-center items-center gap-1 h-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 bg-[var(--primary)] rounded-full animate-bounce" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                    <span className="text-xs text-[var(--primary)] font-bold ml-2 tracking-widest">LISTENING...</span>
                </div>

                <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1" icon={Repeat} onClick={() => speak(recipe.steps[currentStep].text || recipe.steps[currentStep].instruction)}>
                        Repeat
                    </Button>
                    <Button variant="primary" className="flex-[2]" onClick={handleNext}>
                        {currentStep < recipe.steps.length - 1 ? 'Next Step' : 'Finish'} <ChevronRight className="ml-1 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LiveCookingScreen;
