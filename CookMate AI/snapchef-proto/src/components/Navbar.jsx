import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, BookOpen, Mic, User } from 'lucide-react';

const Navbar = () => {
    const navItems = [
        { icon: Package, label: 'Inventory', path: '/' },
        { icon: BookOpen, label: 'Recipes', path: '/recipes' },
        { icon: Mic, label: 'AI Chef', path: '/ai-chef' }, // Middle button? Maybe special styling
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 pb-safe">
            <div className="max-w-md mx-auto glass-panel border-b-0 rounded-t-[24px]">
                <div className="flex items-center justify-between px-6 py-4">
                    {navItems.map((item, index) => {
                        const isCenter = item.label === 'AI Chef'; // Example special styling

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                  flex flex-col items-center gap-1 transition-all duration-300
                  ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}
                  ${isCenter ? '-mt-8' : ''}
                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`
                      flex items-center justify-center rounded-full transition-all
                      ${isCenter
                                                ? 'w-16 h-16 -mt-10 bg-[var(--primary)] text-[var(--bg-deep)] shadow-[0_0_30px_var(--primary-glow)] border-4 border-[var(--bg-deep)] hover:scale-110'
                                                : 'w-10 h-10 hover:text-white'
                                            }
                      ${isActive && !isCenter ? 'text-[var(--primary)]' : ''}
                    `}
                                        >
                                            <item.icon size={isCenter ? 28 : 22} strokeWidth={isActive || isCenter ? 2.5 : 2} className={isActive && !isCenter ? 'drop-shadow-[0_0_8px_var(--primary)]' : ''} />
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-[var(--primary)] text-shadow-neon' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'} ${isCenter ? 'mt-2 opacity-0' : ''}`}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
