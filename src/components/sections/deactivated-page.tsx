import { motion } from 'framer-motion';
import { ShieldX, MessageCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';

export function DeactivatedPage({ onLogout }: { onLogout: () => void }) {
    const { theme } = useTheme();

    const socialLinks = [
        { id: '1', icon: MessageCircle, label: 'WhatsApp', href: "https://wa.me/212722080441" }
    ];

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 shadow-2xl shadow-red-500/20"
                >
                    <ShieldX className="w-12 h-12 text-red-500" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6"
                >
                    Compte <br />
                    <span className="text-red-500">Désactivé</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-foreground/60 mb-12 max-w-lg mx-auto font-medium"
                >
                    Désolé, votre compte <span className="text-foreground font-black tracking-tight">SMMADROOP</span> a été suspendu ou désactivé par l'administrateur.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10"
                    >
                        <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-3" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Raison</div>
                        <div className="text-sm font-bold">Violation des Conditions</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10"
                    >
                        <ShieldAlert className="w-6 h-6 text-red-500 mx-auto mb-3" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Statut</div>
                        <div className="text-sm font-bold">Suspension Permanente</div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="https://wa.me/212722080441"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-4 bg-red-500 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contacter le Support
                    </a>

                    <button
                        onClick={onLogout}
                        className="w-full sm:w-auto px-8 py-4 bg-foreground/5 text-foreground font-black uppercase tracking-wider rounded-2xl border border-foreground/10 hover:bg-foreground/10 transition-all active:scale-95"
                    >
                        Déconnexion
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex flex-col items-center gap-6"
                >
                    <div className="h-px w-24 bg-foreground/10" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">
                        SMMADROOP SERVICE DIGITAL
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
