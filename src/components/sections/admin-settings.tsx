import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from '@/config';
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Save, Eye, EyeOff, Copy, RotateCw, CreditCard, Globe, Key, Mail, ShieldCheck, Bell, Users, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GeneralSettings {
    site_name: string;
    site_url: string;
    currency: string;
    maintenance_mode: boolean;
    registration_open: boolean;
    auto_activate: boolean;
}

interface ApiSettings {
    smm_api_key: string;
    smm_api_url: string;
    google_client_id: string;
    google_secret: string;
}

interface PaymentSettings {
    stripe_key: string;
    stripe_secret: string;
    paypal_enabled: boolean;
    paypal_client_id: string;
    min_deposit: number | string;
    max_deposit: number | string;
}

interface EmailSettings {
    smtp_host: string;
    smtp_port: number | string;
    smtp_user: string;
    smtp_pass: string;
    email_from: string;
    email_order_confirm: boolean;
    email_low_balance: boolean;
}

interface SecuritySettings {
    two_factor_admin: boolean;
    rate_limiting: boolean;
    login_attempts: number | string;
    session_timeout: number | string;
    ip_whitelist: string;
}

interface NotificationSettings {
    notif_new_order: boolean;
    notif_new_user: boolean;
    notif_low_balance: boolean;
    notif_order_fail: boolean;
    telegram_token: string;
    telegram_chat_id: string;
}

interface AllSettings {
    general: GeneralSettings;
    api: ApiSettings;
    payment: PaymentSettings;
    email: EmailSettings;
    security: SecuritySettings;
    notifications: NotificationSettings;
}

// ─── Toggle Component ──────────────────────────────────────────────────────────
function Toggle({ value, onChange, disabled }: { value: boolean, onChange: (v: boolean) => void, disabled?: boolean }) {
    return (
        <div
            onClick={() => !disabled && onChange(!value)}
            className={cn(
                "relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer",
                value ? "bg-red-500/80 border border-red-500/50" : "bg-white/5 border border-white/10",
                disabled && "opacity-40 cursor-not-allowed"
            )}
        >
            <div
                className={cn(
                    "absolute top-1 w-4 h-4 rounded-full transition-all duration-300",
                    value ? "left-6 bg-white shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "left-1 bg-white/40"
                )}
            />
        </div>
    );
}

// ─── Input Component ───────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder, hint, secret }: { label?: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, hint?: string, secret?: boolean }) {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <div className="mb-6">
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                <input
                    type={secret && !show ? "password" : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/10 outline-none focus:border-red-500/50 transition-all font-medium"
                />
                {secret && (
                    <div className="absolute right-3 flex gap-1">
                        <button onClick={() => setShow(!show)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white/60 transition-all">
                            {show ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={copy} className={cn("p-1.5 rounded-lg hover:bg-white/5 transition-all", copied ? "text-emerald-400" : "text-white/20 hover:text-white/60")}>
                            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                )}
            </div>
            {hint && <div className="text-[10px] text-white/20 mt-2 italic">{hint}</div>}
        </div>
    );
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ icon: IconComponent, title, subtitle, children, badge }: { icon: any, title: string, subtitle?: string, children: React.ReactNode, badge?: string }) {
    return (
        <div className="group rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden mb-6 hover:bg-white/[0.03] transition-all duration-500">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
                    <IconComponent size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/90">{title}</h4>
                        {badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && <p className="text-[10px] text-white/30 font-medium mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="p-8">
                {children}
            </div>
        </div>
    );
}

// ─── Toggle Row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, desc, value, onChange }: { label: string, desc?: string, value: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
            <div>
                <div className="text-sm font-bold text-white/80">{label}</div>
                {desc && <div className="text-[11px] text-white/30 font-medium">{desc}</div>}
            </div>
            <Toggle value={value} onChange={onChange} />
        </div>
    );
}

// ─── Save Button ───────────────────────────────────────────────────────────────
function SaveBtn({ onClick, saved, loading }: { onClick: () => void, saved: boolean, loading?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={cn(
                "mt-8 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500",
                saved
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white",
                loading && "opacity-50 cursor-not-allowed"
            )}
        >
            {loading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
                <CheckCircle2 className="w-4 h-4 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            ) : (
                <Save className="w-4 h-4" />
            )}
            {loading ? "ENREGISTREMENT..." : saved ? "SAUVEGARDÉ" : "SAUVEGARDER LES MODIFICATIONS"}
        </button>
    );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
    { id: "general", label: "Général", icon: Globe },
    { id: "api", label: "Clés API", icon: Key },
    { id: "payment", label: "Paiement", icon: CreditCard },
    { id: "email", label: "Email / SMTP", icon: Mail },
    { id: "security", label: "Sécurité", icon: ShieldCheck },
    { id: "notifs", label: "Notifications", icon: Bell },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export function AdminSettings() {
    const [tab, setTab] = useState("general");
    const [saved, setSaved] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [isFetching, setIsFetching] = useState(true);
    const [testResults, setTestResults] = useState<Record<string, { success: boolean, message: string } | null>>({});
    const [testing, setTesting] = useState<Record<string, boolean>>({});

    // Initial state matching backend structure
    const [settings, setSettings] = useState<AllSettings>({
        general: {
            site_name: "SMMADROOP",
            site_url: "https://smmadroop.com",
            currency: "USD",
            maintenance_mode: false,
            registration_open: true,
            auto_activate: false
        },
        api: {
            smm_api_key: "",
            smm_api_url: "",
            google_client_id: "",
            google_secret: ""
        },
        payment: {
            stripe_key: "",
            stripe_secret: "",
            paypal_enabled: false,
            paypal_client_id: "",
            min_deposit: 5.0,
            max_deposit: 1000.0
        },
        email: {
            smtp_host: "smtp.gmail.com",
            smtp_port: 587,
            smtp_user: "",
            smtp_pass: "",
            email_from: "noreply@smmadroop.com",
            email_order_confirm: true,
            email_low_balance: true
        },
        security: {
            two_factor_admin: true,
            rate_limiting: true,
            login_attempts: 5,
            session_timeout: 60,
            ip_whitelist: ""
        },
        notifications: {
            notif_new_order: true,
            notif_new_user: true,
            notif_low_balance: false,
            notif_order_fail: true,
            telegram_token: "",
            telegram_chat_id: ""
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchSettings();
    }, []);

    const updateNestedState = (category: keyof AllSettings, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSave = async (section: keyof AllSettings) => {
        setLoading(prev => ({ ...prev, [section]: true }));
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [section]: settings[section] })
            });

            if (res.ok) {
                setSaved(prev => ({ ...prev, [section]: true }));
                setTimeout(() => setSaved(prev => ({ ...prev, [section]: false })), 2000);
            }
        } catch (error) {
            console.error(`Failed to save ${section}`, error);
        } finally {
            setLoading(prev => ({ ...prev, [section]: false }));
        }
    };

    const handleTest = async (type: 'api' | 'email' | 'telegram') => {
        const endpoint = type === 'api' ? 'test-api' : type === 'email' ? 'test-email' : 'test-telegram';
        setTesting(prev => ({ ...prev, [type]: true }));
        setTestResults(prev => ({ ...prev, [type]: null }));

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/admin/settings/${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTestResults(prev => ({ ...prev, [type]: data }));
        } catch (error) {
            setTestResults(prev => ({ ...prev, [type]: { success: false, message: "Erreur de connexion au serveur." } }));
        } finally {
            setTesting(prev => ({ ...prev, [type]: false }));
        }
    };

    const renderContent = () => {
        if (isFetching) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RotateCw className="w-8 h-8 text-red-500 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest text-white/20">Chargement des paramètres...</p>
                </div>
            );
        }

        switch (tab) {
            case "general":
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <SectionCard icon={Globe} title="Configuration Générale" subtitle="Paramètres de base de la plateforme">
                            <Input
                                label="Nom du site"
                                value={settings.general.site_name}
                                onChange={(v) => updateNestedState('general', 'site_name', v)}
                                placeholder="SMMADROOP"
                            />
                            <Input
                                label="URL du site"
                                value={settings.general.site_url}
                                onChange={(v) => updateNestedState('general', 'site_url', v)}
                                placeholder="https://"
                            />
                            <div className="mb-6">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Devise</label>
                                <select
                                    value={settings.general.currency}
                                    onChange={(e) => updateNestedState('general', 'currency', e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/80 outline-none focus:border-red-500/50 transition-all font-medium appearance-none cursor-pointer"
                                >
                                    {["USD", "EUR", "MAD", "GBP", "CAD"].map((c) => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                                </select>
                            </div>
                            <ToggleRow
                                label="Mode maintenance"
                                desc="Bloque l'accès aux utilisateurs non-admin"
                                value={settings.general.maintenance_mode}
                                onChange={(v) => updateNestedState('general', 'maintenance_mode', v)}
                            />
                            <ToggleRow
                                label="Inscriptions ouvertes"
                                desc="Autoriser les nouveaux enregistrements"
                                value={settings.general.registration_open}
                                onChange={(v) => updateNestedState('general', 'registration_open', v)}
                            />
                            <ToggleRow
                                label="Activation automatique"
                                desc="Activer les comptes sans validation manuelle"
                                value={settings.general.auto_activate}
                                onChange={(v) => updateNestedState('general', 'auto_activate', v)}
                            />
                            <SaveBtn onClick={() => handleSave('general')} saved={saved.general} loading={loading.general} />
                        </SectionCard>

                        {settings.general.maintenance_mode && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex gap-4 items-start animate-pulse">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <div className="text-[11px] text-red-400 font-medium">
                                    <strong className="block uppercase tracking-widest mb-1 underline">Mode maintenance actif</strong>
                                    Seuls les administrateurs peuvent accéder à la plateforme.
                                </div>
                            </div>
                        )}
                    </motion.div>
                );

            case "api":
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <SectionCard icon={Key} title="API Fournisseur SMM" subtitle="Connexion à votre panel fournisseur" badge="CRITIQUE">
                            <Input
                                label="API Key"
                                value={settings.api.smm_api_key}
                                onChange={(v) => updateNestedState('api', 'smm_api_key', v)}
                                secret
                                placeholder="sk-live-..."
                                hint="Clé secrète — ne jamais partager"
                            />
                            <Input
                                label="API Endpoint"
                                value={settings.api.smm_api_url}
                                onChange={(v) => updateNestedState('api', 'smm_api_url', v)}
                                placeholder="https://"
                                hint="URL de base de l'API fournisseur"
                            />
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleTest('api')}
                                    disabled={testing.api}
                                    className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 disabled:opacity-50"
                                >
                                    {testing.api ? <RotateCw className="w-3 h-3 animate-spin" /> : <RotateCw className="w-3 h-3" />}
                                    TESTER LA CONNEXION
                                </button>
                                {testResults.api && (
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold",
                                        testResults.api.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    )}>
                                        {testResults.api.success ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                        {testResults.api.message}
                                    </div>
                                )}
                            </div>
                            <SaveBtn onClick={() => handleSave('api')} saved={saved.api} loading={loading.api} />
                        </SectionCard>

                        <SectionCard icon={Users} title="Google OAuth" subtitle="Connexion via compte Google">
                            <Input
                                label="Client ID"
                                value={settings.api.google_client_id}
                                onChange={(v) => updateNestedState('api', 'google_client_id', v)}
                                placeholder="xxxx.apps.googleusercontent.com"
                            />
                            <Input
                                label="Client Secret"
                                value={settings.api.google_secret}
                                onChange={(v) => updateNestedState('api', 'google_secret', v)}
                                secret
                                placeholder="GOCSPX-..."
                            />
                            <SaveBtn onClick={() => handleSave('api')} saved={saved.api} loading={loading.api} />
                        </SectionCard>
                    </motion.div>
                );

            case "payment":
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <SectionCard icon={CreditCard} title="Stripe" subtitle="Paiement par carte bancaire" badge="LIVE">
                            <Input
                                label="Publishable Key"
                                value={settings.payment.stripe_key}
                                onChange={(v) => updateNestedState('payment', 'stripe_key', v)}
                                secret
                            />
                            <Input
                                label="Secret Key"
                                value={settings.payment.stripe_secret}
                                onChange={(v) => updateNestedState('payment', 'stripe_secret', v)}
                                secret
                                hint="Utilisée côté backend uniquement"
                            />
                            <SaveBtn onClick={() => handleSave('payment')} saved={saved.payment} loading={loading.payment} />
                        </SectionCard>

                        <SectionCard icon={CreditCard} title="PayPal">
                            <ToggleRow
                                label="Activer PayPal"
                                desc="Activer le paiement via PayPal"
                                value={settings.payment.paypal_enabled}
                                onChange={(v) => updateNestedState('payment', 'paypal_enabled', v)}
                            />
                            {settings.payment.paypal_enabled && (
                                <div className="mt-6">
                                    <Input
                                        label="Client ID"
                                        value={settings.payment.paypal_client_id}
                                        onChange={(v) => updateNestedState('payment', 'paypal_client_id', v)}
                                        secret
                                    />
                                </div>
                            )}
                            <SaveBtn onClick={() => handleSave('payment')} saved={saved.payment} loading={loading.payment} />
                        </SectionCard>

                        <SectionCard icon={CreditCard} title="Limites de Dépôt" subtitle="Montants min/max par transaction">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Dépôt minimum ($)"
                                    value={settings.payment.min_deposit.toString()}
                                    onChange={(v) => updateNestedState('payment', 'min_deposit', v)}
                                    type="number"
                                />
                                <Input
                                    label="Dépôt maximum ($)"
                                    value={settings.payment.max_deposit.toString()}
                                    onChange={(v) => updateNestedState('payment', 'max_deposit', v)}
                                    type="number"
                                />
                            </div>
                            <SaveBtn onClick={() => handleSave('payment')} saved={saved.payment} loading={loading.payment} />
                        </SectionCard>
                    </motion.div>
                );

            case "email":
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <SectionCard icon={Mail} title="Configuration SMTP" subtitle="Serveur d'envoi d'emails">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Hôte SMTP"
                                    value={settings.email.smtp_host}
                                    onChange={(v) => updateNestedState('email', 'smtp_host', v)}
                                />
                                <Input
                                    label="Port"
                                    value={settings.email.smtp_port.toString()}
                                    onChange={(v) => updateNestedState('email', 'smtp_port', v)}
                                    type="number"
                                />
                            </div>
                            <Input
                                label="Utilisateur"
                                value={settings.email.smtp_user}
                                onChange={(v) => updateNestedState('email', 'smtp_user', v)}
                                placeholder="user@gmail.com"
                            />
                            <Input
                                label="Mot de passe"
                                value={settings.email.smtp_pass}
                                onChange={(v) => updateNestedState('email', 'smtp_pass', v)}
                                secret
                            />
                            <Input
                                label="Email expéditeur"
                                value={settings.email.email_from}
                                onChange={(v) => updateNestedState('email', 'email_from', v)}
                            />
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleTest('email')}
                                    disabled={testing.email}
                                    className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 disabled:opacity-50"
                                >
                                    {testing.email ? <RotateCw className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                                    ENVOYER UN EMAIL TEST
                                </button>
                                {testResults.email && (
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold",
                                        testResults.email.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    )}>
                                        {testResults.email.success ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                        {testResults.email.message}
                                    </div>
                                )}
                            </div>
                            <SaveBtn onClick={() => handleSave('email')} saved={saved.email} loading={loading.email} />
                        </SectionCard>

                        <SectionCard icon={Bell} title="Triggers Email" subtitle="Quand envoyer des emails automatiques">
                            <ToggleRow
                                label="Confirmation de commande"
                                desc="Email envoyé à chaque nouvelle commande"
                                value={settings.email.email_order_confirm}
                                onChange={(v) => updateNestedState('email', 'email_order_confirm', v)}
                            />
                            <ToggleRow
                                label="Solde insuffisant"
                                desc="Alerter l'utilisateur quand le solde est bas"
                                value={settings.email.email_low_balance}
                                onChange={(v) => updateNestedState('email', 'email_low_balance', v)}
                            />
                            <SaveBtn onClick={() => handleSave('email')} saved={saved.email} loading={loading.email} />
                        </SectionCard>
                    </motion.div>
                );

            case "security":
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <SectionCard icon={ShieldCheck} title="Sécurité & Accès" subtitle="Protections de la plateforme" badge="IMPORTANT">
                            <ToggleRow
                                label="2FA Admin obligatoire"
                                desc="Exiger un code 2FA pour les connexions admin"
                                value={settings.security.two_factor_admin}
                                onChange={(v) => updateNestedState('security', 'two_factor_admin', v)}
                            />
                            <ToggleRow
                                label="Rate limiting API"
                                desc="Bloquer les requêtes excessives (slowapi)"
                                value={settings.security.rate_limiting}
                                onChange={(v) => updateNestedState('security', 'rate_limiting', v)}
                            />
                            <Input
                                label="Tentatives de connexion max"
                                value={settings.security.login_attempts.toString()}
                                onChange={(v) => updateNestedState('security', 'login_attempts', v)}
                                type="number"
                                hint="Compte bloqué après N échecs"
                            />
                            <Input
                                label="Timeout de session (minutes)"
                                value={settings.security.session_timeout.toString()}
                                onChange={(v) => updateNestedState('security', 'session_timeout', v)}
                                type="number"
                                hint="Déconnexion automatique après inactivité"
                            />
                            <SaveBtn onClick={() => handleSave('security')} saved={saved.security} loading={loading.security} />
                        </SectionCard>

                        <SectionCard icon={Users} title="Whitelist IP Admin" subtitle="Restreindre l'accès admin par IP">
                            <Input
                                label="IPs autorisées"
                                value={settings.security.ip_whitelist}
                                onChange={(v) => updateNestedState('security', 'ip_whitelist', v)}
                                placeholder="192.168.1.1, 10.0.0.1"
                                hint="Laisser vide pour tout autoriser. Séparer par des virgules."
                            />
                            <SaveBtn onClick={() => handleSave('security')} saved={saved.security} loading={loading.security} />
                        </SectionCard>
                    </motion.div>
                );

            case "notifs":
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <SectionCard icon={Bell} title="Alertes Plateforme" subtitle="Notifications en temps réel pour l'admin">
                            <ToggleRow
                                label="Nouvelle commande"
                                desc="Notifier à chaque commande passée"
                                value={settings.notifications.notif_new_order}
                                onChange={(v) => updateNestedState('notifications', 'notif_new_order', v)}
                            />
                            <ToggleRow
                                label="Nouvel utilisateur"
                                desc="Notifier lors d'une nouvelle inscription"
                                value={settings.notifications.notif_new_user}
                                onChange={(v) => updateNestedState('notifications', 'notif_new_user', v)}
                            />
                            <ToggleRow
                                label="Solde utilisateur bas"
                                desc="Alerte quand un compte tombe sous $2"
                                value={settings.notifications.notif_low_balance}
                                onChange={(v) => updateNestedState('notifications', 'notif_low_balance', v)}
                            />
                            <ToggleRow
                                label="Échec de commande"
                                desc="Alerter si une commande échoue côté fournisseur"
                                value={settings.notifications.notif_order_fail}
                                onChange={(v) => updateNestedState('notifications', 'notif_order_fail', v)}
                            />
                            <SaveBtn onClick={() => handleSave('notifications')} saved={saved.notifications} loading={loading.notifications} />
                        </SectionCard>

                        <SectionCard icon={Bell} title="Telegram Bot" subtitle="Recevoir les alertes sur Telegram">
                            <Input
                                label="Bot Token"
                                value={settings.notifications.telegram_token}
                                onChange={(v) => updateNestedState('notifications', 'telegram_token', v)}
                                secret
                                placeholder="1234567890:AAF..."
                                hint="Créer un bot via @BotFather"
                            />
                            <Input
                                label="Chat ID"
                                value={settings.notifications.telegram_chat_id}
                                onChange={(v) => updateNestedState('notifications', 'telegram_chat_id', v)}
                                placeholder="-1001234567890"
                                hint="ID du canal ou groupe de réception"
                            />
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleTest('telegram')}
                                    disabled={testing.telegram}
                                    className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 disabled:opacity-50"
                                >
                                    {testing.telegram ? <RotateCw className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
                                    TESTER LE BOT
                                </button>
                                {testResults.telegram && (
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold",
                                        testResults.telegram.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    )}>
                                        {testResults.telegram.success ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                        {testResults.telegram.message}
                                    </div>
                                )}
                            </div>
                            <SaveBtn onClick={() => handleSave('notifications')} saved={saved.notifications} loading={loading.notifications} />
                        </SectionCard>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex gap-12 text-white/80">
            {/* Tabs sidebar */}
            <div className="w-64 shrink-0">
                <div className="sticky top-8 space-y-1 bg-white/[0.02] border border-white/5 rounded-3xl p-3">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                "w-full flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300",
                                tab === t.id
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "hover:bg-white/5 text-white/30 hover:text-white/60"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <t.icon className={cn("w-4 h-4 transition-transform", tab === t.id ? "scale-110" : "group-hover:scale-110")} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{t.label}</span>
                            </div>
                            {tab === t.id && (
                                <ChevronRight className="w-3 h-3 opacity-50" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-2xl">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
}
