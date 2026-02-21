'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface SelectorProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function Selector({ options, value, onChange, label, icon, className }: SelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("space-y-4 w-full", className)} ref={containerRef}>
            {label && (
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">{label}</h4>
                </div>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white flex items-center justify-between transition-all text-left",
                        isOpen ? "ring-2 ring-primary-500/30 border-primary-500/50" : "hover:bg-white/10"
                    )}
                >
                    <span className="truncate">{selectedOption.label}</span>
                    <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute z-[110] w-full mt-2 rounded-2xl glass-dark border border-white/10 shadow-2xl overflow-hidden py-2 backdrop-blur-xl"
                        >
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-6 py-3 text-sm font-bold text-left flex items-center justify-between transition-colors",
                                        option.value === value
                                            ? "text-primary-400 bg-primary-500/10"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <span>{option.label}</span>
                                    {option.value === value && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
