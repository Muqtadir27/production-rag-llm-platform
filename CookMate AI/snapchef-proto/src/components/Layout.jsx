import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import foodOrb from '../assets/scifi_food_orb.png';
import utensils from '../assets/floating_utensils.png';

const Layout = () => {
    const location = useLocation();
    const isCookingMode = location.pathname.includes('/cooking');

    return (
        <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] flex justify-center relative overflow-hidden">

            {/* Sci-Fi Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

            {/* 3D Floating Assets */}
            <img src={foodOrb} alt="" className="absolute top-10 left-[-100px] w-[500px] opacity-20 blur-[2px] animate-[float_20s_ease-in-out_infinite] pointer-events-none mix-blend-screen" />
            <img src={utensils} alt="" className="absolute bottom-10 right-[-150px] w-[600px] opacity-10 blur-[1px] animate-[float_25s_ease-in-out_infinite_reverse] pointer-events-none mix-blend-screen" />

            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] blur-[150px] opacity-10 rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] blur-[150px] opacity-10 rounded-full" />

            {/* Mobile Frame - Floating Effect */}
            <div className="relative z-10 w-full max-w-md bg-[rgba(2,4,3,0.85)] min-h-screen shadow-2xl overflow-hidden flex flex-col border-x border-[var(--glass-border)] backdrop-blur-md">
                {!isCookingMode && <Header />}

                <main className={`flex-1 overflow-y-auto pb-24 ${isCookingMode ? 'pb-0' : ''}`}>
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>

                {!isCookingMode && <Navbar />}
            </div>
        </div>
    );
};

export default Layout;
