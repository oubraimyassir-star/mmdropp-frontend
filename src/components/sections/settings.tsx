'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Globe,
    Shield,
    ChevronRight,
    Smartphone,
    Languages,
    CircleDollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Selector } from '@/components/ui/selector';

const sections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
];

interface SettingsViewProps {
    initialData?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        country?: string;
        agencyName?: string;
        preferences?: {
            language: string;
            currency: string;
        };
    };
    onUpdate?: (data: any) => void;
}

export function SettingsView({ initialData, onUpdate }: SettingsViewProps) {
    const [activeSection, setActiveSection] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // State management
    const [profileData, setProfileData] = useState({
        agencyName: initialData?.agencyName || 'Visionary Marketing',
        email: initialData?.email || 'contact@visionary.com',
        phone: initialData?.phone || '+212 600 000 000',
        country: initialData?.country || 'Maroc, Casablanca'
    });

    const [preferences, setPreferences] = useState({
        language: initialData?.preferences?.language || 'fr',
        currency: initialData?.preferences?.currency || 'eur'
    });

    const handleSave = () => {
        setIsSaving(true);
        setIsSaved(false);

        const updatedData = {
            ...initialData,
            ...profileData,
            preferences
        };

        // Sync with parent state
        if (onUpdate) {
            onUpdate(updatedData);
        }

        // Simulate API call delay for UX
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }, 1200);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
            {/* Sidebar Navigation */}
            <div className="space-y-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                                activeSection === section.id
                                    ? "glass-dark border border-primary-500/30 text-primary-500"
                                    : "text-muted hover:text-foreground hover:bg-foreground/5"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                activeSection === section.id ? "bg-primary-500/20" : "bg-foreground/5 group-hover:bg-foreground/10"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm tracking-wide uppercase">{section.label}</span>
                            {activeSection === section.id && (
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="glass-dark border border-foreground/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-500/5 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                >
                    {activeSection === 'profile' && (
                        <div className="space-y-10">
                            <header>
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Profil de l'Agence</h3>
                                <p className="text-muted text-sm mt-1">Gérez les informations publiques de votre business.</p>
                            </header>

                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-[30px] bg-primary-500/20 border border-primary-500/30 flex items-center justify-center overflow-hidden">
                                            <User className="w-10 h-10 text-primary-400" />
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-foreground text-background hover:scale-110 transition-transform shadow-xl">
                                            <Smartphone className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <h4 className="text-lg font-bold text-foreground uppercase tracking-wider">{initialData?.agencyName || 'Visionary Marketing'}</h4>
                                        <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">Agence Premium • Niveau 2</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Nom de l'agence</label>
                                        <input
                                            type="text"
                                            value={profileData.agencyName}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, agencyName: e.target.value }))}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-sans transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Email Professionnel</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-sans transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-sans transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2">Localisation</label>
                                        <input
                                            type="text"
                                            value={profileData.country}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-sans transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-10">
                            <header>
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Sécurité du Compte</h3>
                                <p className="text-muted text-sm mt-1">Protégez votre accès et vos revenus.</p>
                            </header>

                            <div className="space-y-6">
                                <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 flex items-center justify-between group-hover:border-primary-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground uppercase tracking-wider text-sm">Auth à Deux Facteurs (2FA)</h4>
                                            <p className="text-muted text-[10px] font-black uppercase tracking-widest">Ajoutez une couche de sécurité supplémentaire.</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-xs font-black uppercase tracking-widest hover:bg-foreground/10 transition-colors">Activer</button>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] ml-2 hover:text-foreground/40 transition-colors">Changer le mot de passe</h4>
                                    <div className="space-y-4 shadow-sm">
                                        <input type="password" placeholder="Ancien mot de passe" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-sans" />
                                        <input type="password" placeholder="Nouveau mot de passe" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-sans" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'preferences' && (
                        <div className="space-y-10">
                            <header>
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Préférences Globales</h3>
                                <p className="text-muted text-sm mt-1">Personnalisez votre interface SMMADROOP.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Selector
                                    label="Langue"
                                    icon={<Languages className="w-5 h-5 text-primary-400" />}
                                    options={[
                                        { value: 'fr', label: 'Français' },
                                        { value: 'en', label: 'English' },
                                        { value: 'es', label: 'Español' },
                                        { value: 'ar', label: 'العربية' },
                                    ]}
                                    value={preferences.language}
                                    onChange={(val) => setPreferences(prev => ({ ...prev, language: val }))}
                                />

                                <Selector
                                    label="Monnaie"
                                    icon={<CircleDollarSign className="w-5 h-5 text-primary-400" />}
                                    options={[
                                        { value: 'eur', label: 'Euro (MAD)' },
                                        { value: 'usd', label: 'US Dollar ($)' },
                                        { value: 'mad', label: 'Dirham Marocain (MAD)' },
                                    ]}
                                    value={preferences.currency}
                                    onChange={(val) => setPreferences(prev => ({ ...prev, currency: val }))}
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="space-y-10">
                            <header>
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Notifications</h3>
                                <p className="text-muted text-sm mt-1">Restez informé de vos commandes et alertes.</p>
                            </header>

                            <div className="space-y-4">
                                {[
                                    { label: 'Alertes par email', desc: 'Recevez un récapitulatif quotidien' },
                                    { label: 'Notifications Push', desc: 'Alertes en temps réel sur navigateur' },
                                    { label: 'Alertes WhatsApp', desc: 'Directement sur votre mobile' },
                                ].map((notif, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-foreground/5 border border-foreground/10 hover:border-primary-500/20 transition-all">
                                        <div>
                                            <h4 className="font-bold text-foreground uppercase tracking-wider text-sm">{notif.label}</h4>
                                            <p className="text-muted text-[10px] font-black uppercase tracking-widest">{notif.desc}</p>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-primary-500/20 border border-primary-500/30 relative cursor-pointer group">
                                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary-500 shadow-lg group-hover:scale-110 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-10 flex justify-end gap-4 border-t border-foreground/5">
                        <button className="px-8 py-4 rounded-2xl text-muted text-xs font-black uppercase tracking-widest hover:text-foreground transition-all">Annuler</button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl relative min-w-[160px]",
                                isSaved
                                    ? "bg-emerald-500 text-white"
                                    : "bg-foreground text-background hover:scale-105 active:scale-95 shadow-foreground/10",
                                isSaving && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                                    <span>...</span>
                                </div>
                            ) : isSaved ? (
                                "Enregistré !"
                            ) : (
                                "Sauvegarder"
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
