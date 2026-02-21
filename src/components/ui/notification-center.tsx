"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Bell, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'order' | 'payment' | 'system' | 'info';
    unread: boolean;
}

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
}

export function NotificationCenter({ isOpen, onClose, notifications }: NotificationCenterProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-[380px] z-50 overflow-hidden rounded-[32px] glass-dark border border-white/10 shadow-2xl origin-top-right"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Notifications</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Alertes & Activités</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors mr-2">
                                    Tout marquer lu
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-4 hover:bg-white/[0.03] transition-all cursor-pointer group flex gap-4",
                                                notif.unread && "bg-primary-500/[0.02]"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5",
                                                notif.type === 'order' ? "bg-blue-500/10 text-blue-400" :
                                                    notif.type === 'payment' ? "bg-emerald-500/10 text-emerald-400" :
                                                        notif.type === 'system' ? "bg-orange-500/10 text-orange-400" :
                                                            "bg-purple-500/10 text-purple-400"
                                            )}>
                                                {notif.type === 'order' && <ShoppingBag className="w-5 h-5" />}
                                                {notif.type === 'payment' && <CheckCircle2 className="w-5 h-5" />}
                                                {notif.type === 'system' && <AlertCircle className="w-5 h-5" />}
                                                {notif.type === 'info' && <Info className="w-5 h-5" />}
                                            </div>

                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-black text-white/90 truncate uppercase tracking-tight">{notif.title}</h4>
                                                    {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                                                </div>
                                                <p className="text-xs text-white/40 font-medium leading-relaxed mb-1 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">{notif.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Bell className="w-8 h-8 text-white/10" />
                                    </div>
                                    <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Aucune notification</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/5">
                            <button className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all border border-white/10">
                                Voir toutes les alertes
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
