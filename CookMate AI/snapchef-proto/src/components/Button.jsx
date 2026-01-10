import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-[var(--primary)] to-[#00db8b] text-[var(--bg-deep)] shadow-[0_0_20px_-5px_var(--primary-glow)] hover:shadow-[0_0_30px_0px_var(--primary-glow)] hover:scale-105 border border-transparent",
        secondary: "bg-[var(--glass-surface)] border border-[var(--primary-glow)] text-[var(--primary)] hover:bg-[rgba(10,255,157,0.1)] hover:shadow-[0_0_15px_var(--primary-dim)]",
        ghost: "text-[var(--text-secondary)] hover:text-white hover:bg-white/5",
        danger: "bg-gradient-to-r from-[var(--accent-hot)] to-[#cc0044] text-white shadow-[0_0_20px_var(--accent-hot)]"
    };

    const sizes = {
        sm: "h-8 px-4 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12 p-0"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
