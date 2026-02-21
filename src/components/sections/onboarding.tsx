'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Rocket,
    Target,
    Globe,
    Users,
    User,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
    onComplete: (data: any) => void;
}

const steps = [
    {
        id: 'welcome',
        title: "Bienvenue sur SMMADROOP",
        subtitle: "Commençons par personnaliser votre expérience.",
        icon: Rocket,
    },
    {
        id: 'personal',
        title: "Informations Personnelles",
        subtitle: "Dites-en nous un peu plus sur vous.",
        icon: User,
    },
    {
        id: 'niche',
        title: "Votre Domaine d'Expertise",
        subtitle: "Quel est le secteur principal de votre agence ?",
        icon: Globe,
    },
    {
        id: 'goals',
        title: "Vos Objectifs",
        subtitle: "Quel est votre objectif de revenus mensuels ?",
        icon: Target,
    },
    {
        id: 'discovery',
        title: "Dernière étape",
        subtitle: "Comment avez-vous entendu parler de nous ?",
        icon: Users,
    }
];

const niches = [
    { id: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
    { id: 'realestate', label: 'Immobilier', icon: '🏠' },
    { id: 'health', label: 'Santé & Bien-être', icon: '✨' },
    { id: 'local', label: 'Commerces Locaux', icon: '📍' },
    { id: 'saas', label: 'SaaS / Tech', icon: '💻' },
    { id: 'other', label: 'Autre', icon: '🚀' },
];

const goals = [
    { id: 'start', label: '0MAD - 2,000MAD', sub: 'Débutant' },
    { id: 'growth', label: '2,000MAD - 10,000MAD', sub: 'En croissance' },
    { id: 'scale', label: '10,000MAD - 50,000MAD', sub: 'Scale-up' },
    { id: 'expert', label: '50,000MAD+', sub: 'Elite' },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        agencyName: '',
        fullName: '',
        phone: '',
        country: '',
        niche: '',
        goal: '',
        discovery: ''
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(formData);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return formData.agencyName.length > 2;
            case 1: return formData.fullName.length > 2 && formData.phone.length > 5 && formData.country !== '';
            case 2: return formData.niche !== '';
            case 3: return formData.goal !== '';
            case 4: return formData.discovery !== '';
            default: return true;
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon as any;

    return (
        <div className="fixed inset-0 z-[110] bg-background flex items-center justify-center p-6 transition-colors duration-500">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold-400/5 blur-[150px] rounded-full animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="glass-dark border border-foreground/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-foreground/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <div className="inline-flex p-4 rounded-3xl bg-primary-500/10 text-primary-400 mb-6 border border-primary-500/20">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 uppercase tracking-tight italic">
                                    {step.title}
                                </h2>
                                <p className="text-muted font-medium tracking-wide">
                                    {step.subtitle}
                                </p>
                            </div>

                            <div className="min-h-[280px] flex items-center justify-center py-4">
                                {currentStep === 0 && (
                                    <div className="w-full space-y-4">
                                        <label className="text-xs font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Nom de votre agence</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Ex: Visionary Marketing"
                                            value={formData.agencyName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-6 px-8 text-xl font-bold text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all text-center"
                                        />
                                        <div className="flex items-center justify-center gap-2 text-foreground/20 text-xs italic">
                                            <Sparkles className="w-4 h-4" />
                                            Cela nous aidera à personnaliser votre tableau de bord.
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="w-full space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Nom Complet</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all font-sans"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Numéro WhatsApp</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+212 6..."
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all font-sans"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Pays de Résidence</label>
                                            <input
                                                type="text"
                                                placeholder="Maroc, France, etc."
                                                value={formData.country}
                                                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all text-center font-sans"
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                        {niches.map((niche) => (
                                            <button
                                                key={niche.id}
                                                onClick={() => setFormData(prev => ({ ...prev, niche: niche.id }))}
                                                className={cn(
                                                    "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                                                    formData.niche === niche.id
                                                        ? "bg-primary-500 text-white border-primary-400"
                                                        : "bg-foreground/5 border-foreground/5 hover:border-foreground/20 text-muted hover:text-foreground"
                                                )}
                                            >
                                                <span className="text-3xl group-hover:scale-110 transition-transform">{niche.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center">{niche.label}</span>
                                                {formData.niche === niche.id && (
                                                    <motion.div layoutId="niche-check" className="absolute top-2 right-2">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        {goals.map((goal) => (
                                            <button
                                                key={goal.id}
                                                onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                                                className={cn(
                                                    "p-6 rounded-3xl border transition-all flex flex-col items-start gap-1 group relative overflow-hidden text-left",
                                                    formData.goal === goal.id
                                                        ? "bg-primary-500 text-white border-primary-400 shadow-2xl shadow-primary-500/40"
                                                        : "bg-foreground/5 border-foreground/5 hover:border-foreground/20 text-muted hover:text-foreground"
                                                )}
                                            >
                                                <span className="text-xl font-black tabular-nums">{goal.label}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 italic">{goal.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="w-full space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['Instagram', 'WhatsApp', 'Google', 'Publicité', 'Recommandation', 'Autre'].map((source) => (
                                                <button
                                                    key={source}
                                                    onClick={() => setFormData(prev => ({ ...prev, discovery: source }))}
                                                    className={cn(
                                                        "p-4 rounded-2xl border transition-all text-xs font-bold tracking-widest uppercase",
                                                        formData.discovery === source
                                                            ? "bg-primary-500 text-white border-primary-400"
                                                            : "bg-foreground/5 border-foreground/5 hover:border-foreground/20 text-foreground/40 hover:text-foreground"
                                                    )}
                                                >
                                                    {source}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-foreground/5">
                                <div className="flex items-center gap-1">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                                i === currentStep ? "w-8 bg-primary-500" : "bg-foreground/10"
                                            )}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                    className={cn(
                                        "px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 transition-all active:scale-95 shadow-2xl",
                                        isStepValid()
                                            ? "bg-foreground text-background hover:opacity-90 shadow-foreground/10 font-bold"
                                            : "bg-foreground/5 text-foreground/20 cursor-not-allowed border border-foreground/5"
                                    )}
                                >
                                    {currentStep === steps.length - 1 ? "Commencer" : "Continuer"}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/10 italic">
                    Étape {currentStep + 1} de {steps.length} • Powered by SMMADROOP V4
                </p>
            </motion.div>
        </div>
    );
}
