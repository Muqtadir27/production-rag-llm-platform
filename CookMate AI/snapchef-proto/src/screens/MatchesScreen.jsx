import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, Dumbbell } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { mockRecipes } from '../data/mockData';

const MatchesScreen = () => {
    return (
        <div className="pb-24 px-4 pt-2 space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight">Your Best Matches</h2>
                <p className="text-[var(--text-secondary)] text-sm">Based on your current pantry</p>
            </div>

            <div className="space-y-4">
                {mockRecipes.map((recipe) => (
                    <Card key={recipe.id} className="p-0 overflow-hidden relative group">
                        {/* Image Banner */}
                        <div className="h-48 relative">
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent opacity-90" />

                            {/* Match Badge */}
                            <div className="absolute top-4 right-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[var(--primary)] blur-md opacity-50" />
                                    <div className="relative bg-[var(--bg-deep)] border border-[var(--primary)] text-[var(--primary)] text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                                        {recipe.matchPercentage}% MATCH
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                {recipe.tags.map(tag => (
                                    <span key={tag} className="glass-panel border-none bg-black/40 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4 bg-gradient-to-b from-transparent to-[var(--bg-deep)]">
                            <div>
                                <h3 className="text-xl font-bold leading-none tracking-tight mb-3 group-hover:text-[var(--primary)] transition-colors">{recipe.title}</h3>
                                <div className="flex items-center gap-5 text-xs font-bold text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-[var(--secondary)]" /> {recipe.time}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Flame size={16} className="text-[var(--accent-hot)]" /> {recipe.calories}
                                    </div>
                                </div>
                            </div>

                            {/* Missing Items */}
                            {recipe.missingIngredients.length > 0 ? (
                                <div className="text-xs flex flex-wrap gap-1 text-[var(--text-muted)]">
                                    <span>Missing:</span>
                                    {recipe.missingIngredients.map((ing, i) => (
                                        <span key={i} className="text-[var(--error)]">{ing}{i < recipe.missingIngredients.length - 1 ? ',' : ''}</span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-[var(--primary)] flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                                    All ingredients found!
                                </div>
                            )}

                            <div className="pt-1">
                                <Link to={`/recipe/${recipe.id}`}>
                                    <Button variant={recipe.matchPercentage > 90 ? 'primary' : 'secondary'} size="sm" className="w-full">
                                        {recipe.matchPercentage > 90 ? 'Cook Now' : 'View Details'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MatchesScreen;
