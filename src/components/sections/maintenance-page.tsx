import { motion } from 'framer-motion';
import { Hammer, Clock, ShieldAlert, Globe } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';

export function MaintenancePage() {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 shadow-2xl shadow-red-500/20"
                >
                    <Hammer className="w-12 h-12 text-red-500" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6"
                >
                    Maintenance <br />
                    <span className="text-red-500">En Cours</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-foreground/60 mb-12 max-w-lg mx-auto font-medium"
                >
                    Nous effectuons actuellement des mises à jour importantes pour améliorer votre expérience sur <span className="text-foreground font-black tracking-tight">SMMADROOP</span>.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {[
                        { icon: Clock, label: "Temps Estimé", value: "~ 2 Heures" },
                        { icon: Globe, label: "Services SMM", value: "En Pause" },
                        { icon: ShieldAlert, label: "Sécurité", value: "Renforcée" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10"
                        >
                            <item.icon className="w-6 h-6 text-red-500 mx-auto mb-3" />
                            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">{item.label}</div>
                            <div className="text-sm font-bold">{item.value}</div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="h-px w-24 bg-foreground/10" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">
                        Revenez très bientôt
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
