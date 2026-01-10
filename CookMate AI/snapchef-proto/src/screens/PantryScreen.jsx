import React, { useState } from 'react';
import { Camera, Plus, Minus, Search, X, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { mockPantry } from '../data/mockData';

const PantryScreen = () => {
    const [inventory, setInventory] = useState(mockPantry);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const updateQuantity = (id, delta) => {
        setInventory(inventory.map(item =>
            item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ));
    };

    const handleSnap = () => {
        setIsScanning(true);
        // Simulate AI Delays
        setTimeout(() => {
            const newIngredients = ['Red Pepper', 'Garlic', 'Mushrooms', 'Olive Oil', 'Spinach'];
            const randomIng = newIngredients[Math.floor(Math.random() * newIngredients.length)];

            const newItem = {
                id: Date.now(),
                name: randomIng,
                category: 'Vegetable',
                quantity: 1,
                expiry: 'Just Added',
                status: 'Fresh',
                icon: '🥬',
                isExpiring: false
            };

            setInventory(prev => [newItem, ...prev]);
            setIsScanning(false);
            setIsCameraOpen(false);
        }, 2000);
    };

    return (
        <div className="pb-24 px-4 pt-2 space-y-6">
            {/* Camera Overlay */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
                    <div className="relative flex-1 bg-gray-900 overflow-hidden">
                        {/* Fake Camera Feed */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

                        {/* Scanning Animation */}
                        {isScanning && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-[var(--primary)] rounded-lg animate-pulse relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] shadow-[0_0_20px_var(--primary)] animate-[scan_1.5s_ease-in-out_infinite]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-[var(--primary)] flex items-center gap-3">
                                            <Loader2 className="animate-spin text-[var(--primary)]" />
                                            <span className="text-[var(--primary)] font-bold tracking-widest uppercase">Analyzing...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setIsCameraOpen(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="h-40 bg-black flex items-center justify-center pb-8 border-t border-[var(--glass-border)]">
                        <button
                            onClick={handleSnap}
                            disabled={isScanning}
                            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/10 active:scale-95 transition-all hover:bg-white/20"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                        </button>
                    </div>
                </div>
            )}

            {/* Camera Action Card */}
            <div
                onClick={() => setIsCameraOpen(true)}
                className="relative overflow-hidden rounded-[var(--radius-lg)] p-1 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-[0_10px_40px_-10px_var(--primary-glow)] group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            >
                <div className="relative z-10 bg-[var(--bg-deep)]/90 backdrop-blur-xl rounded-[calc(var(--radius-lg)-2px)] p-6 h-full flex flex-col items-center justify-center text-center space-y-4">

                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] p-0.5 animate-[pulse-glow_3s_infinite]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                            <Camera size={36} className="text-[var(--primary)] drop-shadow-[0_0_10px_var(--primary)]" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white mb-1">Snap Analysis</h2>
                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">AI Vision Active</p>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-dim)]/20 to-transparent pointer-events-none" />
                </div>
            </div>
            {/* Quick Add */}
            <div className="space-y-2">
                <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider ml-1">Quick Add</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="E.g. 2 Tomatoes, Oat Milk..."
                        className="w-full h-14 pl-5 pr-14 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] focus:outline-none transition-all placeholder-[var(--text-muted)]"
                    />
                    <button className="absolute right-2 top-2 w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] flex items-center justify-center text-[var(--primary)] hover:bg-[rgba(0,255,163,0.1)] transition-colors">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Inventory List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold">My Pantry</h3>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[rgba(255,255,255,0.1)] text-[var(--primary)]">
                        {inventory.length} ITEMS
                    </span>
                </div>

                <div className="space-y-3">
                    {inventory.map((item) => (
                        <Card key={item.id} className="flex items-center justify-between p-3" highlight={item.isExpiring}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] flex items-center justify-center text-2xl border border-[var(--glass-border)]">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{item.name}</h4>
                                    <p className={`text-xs font-bold ${item.isExpiring ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'}`}>
                                        {item.isExpiring ? 'EXPIRES SOON' : `${item.category} • ${item.expiry}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-8 h-8 rounded-full bg-[var(--glass-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-8 h-8 rounded-full bg-[rgba(0,255,163,0.1)] flex items-center justify-center text-[var(--primary)] hover:bg-[rgba(0,255,163,0.2)]"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PantryScreen;
