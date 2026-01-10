import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Users, Play, Share2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { mockRecipes } from '../data/mockData';

const RecipeDetailScreen = () => {
    const { id } = useParams();
    const recipe = mockRecipes.find(r => r.id === parseInt(id));

    // Scaling Logic
    const originalServings = recipe?.servings || 2;
    const [servings, setServings] = useState(originalServings);

    const getScaledAmount = (amountStr) => {
        const num = parseFloat(amountStr);
        if (isNaN(num)) return amountStr;
        const unit = amountStr.replace(/[0-9.]/g, '').trim();
        const scaled = (num / originalServings) * servings;
        // Format to remove trailing zeros if integer
        return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)} ${unit}`;
    };

    if (!recipe) return <div className="p-10 text-center">Recipe not found</div>;

    return (
        <div className="pb-24 relative animate-fade-in">
            {/* Hero Image - Optimized Height */}
            <div className="relative h-64 w-full group">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--bg-deep)]" />
                <div className="absolute inset-0 bg-[var(--primary)] mix-blend-overlay opacity-10" />

                {/* Top Nav */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                    <Link to="/recipes">
                        <button className="w-12 h-12 rounded-full glass-panel border-none flex items-center justify-center text-white hover:bg-white/20 transition backdrop-blur-xl">
                            <ArrowLeft size={24} />
                        </button>
                    </Link>
                    <button className="w-12 h-12 rounded-full glass-panel border-none flex items-center justify-center text-white hover:bg-white/20 transition backdrop-blur-xl">
                        <Share2 size={24} />
                    </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <span className="bg-[var(--primary)] text-[var(--bg-deep)] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block shadow-[0_0_15px_var(--primary-glow)]">
                        {recipe.tags[0]}
                    </span>
                    <h1 className="text-3xl font-black leading-none tracking-tighter text-shadow-lg">{recipe.title}</h1>
                </div>
            </div>

            <div className="px-6 space-y-8 mt-4 relative z-10">

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="glass-panel rounded-[var(--radius-sm)] p-4 flex flex-col items-center justify-center gap-1 backdrop-blur-md">
                        <Clock size={20} className="text-[var(--secondary)] mb-1" />
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">Time</span>
                        <span className="text-lg font-bold">{recipe.time}</span>
                    </div>
                    <div className="glass-panel rounded-[var(--radius-sm)] p-4 flex flex-col items-center justify-center gap-1 backdrop-blur-md">
                        <Flame size={20} className="text-[var(--accent-hot)] mb-1" />
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">Calories</span>
                        <span className="text-lg font-bold">{recipe.calories}</span>
                    </div>
                    <div className="glass-panel rounded-[var(--radius-sm)] p-4 flex flex-col items-center justify-center gap-1 backdrop-blur-md">
                        <Users size={20} className="text-[var(--primary)] mb-1" />
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">Servings</span>
                        <span className="text-lg font-bold">{servings} ppl</span>
                    </div>
                </div>
            </div>

            {/* Portions Slider */}
            <div className="glass-panel rounded-[var(--radius-md)] p-5 space-y-4 mx-6 mt-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <Users size={18} className="text-[var(--primary)]" />
                        Adjust Portions
                    </h3>
                    <span className="text-[var(--primary)] font-bold text-lg">{servings}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="8"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                />
            </div>

            {/* Ingredients */}
            <div className="space-y-4 px-6 mt-6">
                <div className="flex justify-between items-end">
                    <h3 className="text-lg font-bold">Ingredients</h3>
                    <span className="text-xs text-[var(--primary)] font-bold cursor-pointer">Add missing to cart</span>
                </div>

                <div className="space-y-2">
                    {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                            {recipe.missingIngredients.includes(ing.name) ? (
                                <div className="w-5 h-5 rounded-full border-2 border-[var(--text-muted)]" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            )}
                            <div className="flex-1 flex justify-between items-center">
                                <span className={`font-medium ${recipe.missingIngredients.includes(ing.name) ? 'opacity-50' : ''}`}>{ing.name}</span>
                                <span className="font-bold text-[var(--text-secondary)]">{getScaledAmount(ing.amount)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <div className="sticky bottom-24 z-20 px-6 mt-8">
                <Link to={`/recipe/${id}/cooking`}>
                    <Button className="w-full shadow-2xl shadow-[var(--primary-glow)]" size="lg" icon={Play}>
                        Start Cooking
                    </Button>
                </Link>
            </div>

        </div>
    );
};

export default RecipeDetailScreen;
