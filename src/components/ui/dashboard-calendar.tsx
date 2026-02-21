'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardCalendar({ className }: { className?: string }) {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const days = Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }, (_, i) => i);

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white/90 tracking-tight">
                    {monthNames[currentDate.getMonth()]} <span className="text-white/40">{currentDate.getFullYear()}</span>
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors border border-white/5"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors border border-white/5"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 flex-grow">
                {padding.map(i => (
                    <div key={`pad-${i}`} className="aspect-square" />
                ))}
                {days.map(day => (
                    <div
                        key={day}
                        className={cn(
                            "aspect-square flex items-center justify-center text-sm font-bold rounded-xl transition-all relative group cursor-default",
                            isToday(day)
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        {day}
                        {isToday(day) && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Aujourd'hui: {today.getDate()} {monthNames[today.getMonth()]}</p>
                </div>
            </div>
        </div>
    );
}
