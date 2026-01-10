import React from 'react';
import { Bell, ChefHat } from 'lucide-react';

const Header = () => {
    return (
        <header className="relative z-20 flex items-center justify-between p-6 blur-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-[var(--bg-deep)] shadow-[0_0_20px_var(--primary-glow)]">
                    <ChefHat size={22} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-black tracking-tighter neon-text">SnapChef</h1>
            </div>
            <button className="relative w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors hover:shadow-[0_0_15px_var(--primary-dim)]">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-hot)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-hot)]" />
            </button>
        </header>
    );
};

export default Header;
