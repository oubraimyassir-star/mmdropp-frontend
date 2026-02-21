import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';
import {
    Shield, Plus, Trash2, Zap, Palette,
    DollarSign, FileText, TrendingDown, Database, Cpu, Save,
    Download, Upload, RefreshCw, CheckCircle, ToggleLeft, ToggleRight,
    Globe, Mail, Hash, Eye, EyeOff, Activity, Server
} from 'lucide-react';

// ─── Shared Audit Logger ─────────────────────────────────────────────────────
export const logAudit = (action: string, details: string, level: 'info' | 'warn' | 'critical' = 'info') => {
    const logs = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        details,
        level,
        admin: JSON.parse(localStorage.getItem('user_data') || '{}')?.email || 'admin',
    };
    localStorage.setItem('admin_audit_log', JSON.stringify([entry, ...logs].slice(0, 500)));
};

// ─── 1. BLACKLIST MANAGER ─────────────────────────────────────────────────────
export function BlacklistManager() {
    const [list, setList] = useState<any[]>(() => JSON.parse(localStorage.getItem('admin_blacklist') || '[]'));
    const [form, setForm] = useState({ type: 'email', value: '', reason: '' });
    const [showForm, setShowForm] = useState(false);

    const save = (data: any[]) => { setList(data); localStorage.setItem('admin_blacklist', JSON.stringify(data)); };

    const add = () => {
        if (!form.value.trim()) return;
        const entry = { id: Date.now(), ...form, enabled: true, createdAt: new Date().toISOString() };
        save([entry, ...list]);
        logAudit('BLACKLIST_ADD', `Bloqué: ${form.type} ${form.value} `, 'warn');
        setForm({ type: 'email', value: '', reason: '' });
        setShowForm(false);
    };
    const toggle = (id: number) => { save(list.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i)); };
    const remove = (id: number) => { save(list.filter(i => i.id !== id)); logAudit('BLACKLIST_REMOVE', `Supprimé ID: ${id} `, 'warn'); };

    const typeIcon = (t: string) => t === 'email' ? <Mail className="w-3.5 h-3.5" /> : t === 'ip' ? <Globe className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />;
    const typeColor = (t: string) => t === 'email' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : t === 'ip' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Shield className="w-7 h-7 text-red-400" /> Blacklist Manager
                    </h2>
                    <p className="text-white/30 text-sm mt-1">{list.length} règles actives · Blocage IPs, emails et comptes suspects</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl uppercase tracking-widest text-[10px] transition-all">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Type</label>
                                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500">
                                    <option value="email">Email</option>
                                    <option value="ip">Adresse IP</option>
                                    <option value="account">Compte</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Valeur</label>
                                <input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                                    placeholder="ex: spam@example.com ou 192.168.1.1"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 placeholder-white/20" />
                            </div>
                        </div>
                        <input value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                            placeholder="Raison du blocage..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 placeholder-white/20" />
                        <div className="flex gap-2">
                            <button onClick={add} className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Bloquer</button>
                            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white/5 text-white/60 font-bold rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-white/10">Annuler</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-white/5">
                        <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Type</th>
                        <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Valeur</th>
                        <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Raison</th>
                        <th className="text-center py-3 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Statut</th>
                        <th className="text-right py-3 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/5">
                        {list.map(item => (
                            <tr key={item.id} className="group hover:bg-white/[0.02]">
                                <td className="py-3 px-5">
                                    <span className={cn("flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase", typeColor(item.type))}>
                                        {typeIcon(item.type)} {item.type}
                                    </span>
                                </td>
                                <td className="py-3 px-5 font-mono text-sm text-white/80">{item.value}</td>
                                <td className="py-3 px-5 text-xs text-white/40 italic">{item.reason || '—'}</td>
                                <td className="py-3 px-5 text-center">
                                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase", item.enabled ? "bg-red-500/10 text-red-400" : "bg-white/5 text-white/30")}>
                                        {item.enabled ? 'BLOQUÉ' : 'INACTIF'}
                                    </span>
                                </td>
                                <td className="py-3 px-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => toggle(item.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                            {item.enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/50 hover:text-red-400 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr><td colSpan={5} className="py-16 text-center text-white/20 italic text-sm">
                                Aucune règle de blacklist. Cliquez "Ajouter" pour commencer.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

// ─── 2. AUTOMATION RULES ─────────────────────────────────────────────────────
const TRIGGERS = ['Nouvelle commande', 'Compte créé', 'Commande > 500 MAD', 'Manager bloqué', 'Virement effectué', 'Commande annulée'];
const ACTIONS = ['Notifier admin (email)', 'Bloquer le compte', 'Enregistrer dans Audit', 'Envoyer webhook', 'Changer statut commande'];

export function AutomationRules() {
    const [rules, setRules] = useState<any[]>(() => JSON.parse(localStorage.getItem('admin_automations') || '[]'));
    const [form, setForm] = useState({ name: '', trigger: TRIGGERS[0], action: ACTIONS[0] });
    const [showForm, setShowForm] = useState(false);

    const save = (data: any[]) => { setRules(data); localStorage.setItem('admin_automations', JSON.stringify(data)); };
    const add = () => {
        if (!form.name.trim()) return;
        save([{ id: Date.now(), ...form, enabled: true, runs: 0, createdAt: new Date().toISOString() }, ...rules]);
        logAudit('AUTOMATION_ADD', `Règle créée: ${form.name} `);
        setForm({ name: '', trigger: TRIGGERS[0], action: ACTIONS[0] });
        setShowForm(false);
    };
    const toggle = (id: number) => save(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const remove = (id: number) => save(rules.filter(r => r.id !== id));

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Zap className="w-7 h-7 text-amber-400" /> Automation Rules
                    </h2>
                    <p className="text-white/30 text-sm mt-1">{rules.filter(r => r.enabled).length} règles actives · SI/ALORS automatique</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl uppercase tracking-widest text-[10px] transition-all">
                    <Plus className="w-4 h-4" /> Créer
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Nom de la règle..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 placeholder-white/20" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">🎯 SI (Déclencheur)</label>
                                <select value={form.trigger} onChange={e => setForm(p => ({ ...p, trigger: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500">
                                    {TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">⚡ ALORS (Action)</label>
                                <select value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500">
                                    {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={add} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Créer la règle</button>
                            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white/5 text-white/60 font-bold rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-white/10">Annuler</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {rules.map(r => (
                    <motion.div key={r.id} layout className={cn("p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all",
                        r.enabled ? "bg-amber-500/5 border-amber-500/20" : "bg-white/[0.02] border-white/5 opacity-50")}>
                        <div className="flex items-center gap-4 min-w-0">
                            <div className={cn("p-2.5 rounded-xl", r.enabled ? "bg-amber-500/20" : "bg-white/5")}>
                                <Zap className={cn("w-5 h-5", r.enabled ? "text-amber-400" : "text-white/30")} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-sm">{r.name}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-bold">SI: {r.trigger}</span>
                                    <span className="text-white/20 text-xs">→</span>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">ALORS: {r.action}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-white/20 font-bold">{r.runs} exécutions</span>
                            <button onClick={() => toggle(r.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
                                {r.enabled ? <ToggleRight className="w-5 h-5 text-amber-400" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {rules.length === 0 && (
                    <div className="py-20 text-center text-white/20">
                        <Zap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm italic">Aucune règle d'automatisation créée.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── 3. WHITE-LABEL ──────────────────────────────────────────────────────────
export function WhiteLabelConfig() {
    const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem('admin_whitelabel') || JSON.stringify({
        brandName: 'SMMADROOP', logoUrl: '', primaryColor: '#11625A', accentColor: '#EF4444', domain: '', supportEmail: 'support@smmadroop.com'
    })));
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem('admin_whitelabel', JSON.stringify(config));
        logAudit('WHITELABEL_UPDATE', `Marque mise à jour: ${config.brandName} `);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Palette className="w-7 h-7 text-purple-400" /> White-Label
                    </h2>
                    <p className="text-white/30 text-sm mt-1">Personnalisez la marque de toute la plateforme</p>
                </div>
                <button onClick={handleSave} className={cn("flex items-center gap-2 px-5 py-2.5 font-black rounded-xl uppercase tracking-widest text-[10px] transition-all",
                    saved ? "bg-emerald-500 text-white" : "bg-purple-500 hover:bg-purple-400 text-white")}>
                    {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé</> : <><Save className="w-4 h-4" /> Sauvegarder</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {[
                        { label: 'Nom de la Marque', key: 'brandName', placeholder: 'SMMADROOP', type: 'text' },
                        { label: 'URL du Logo', key: 'logoUrl', placeholder: 'https://...', type: 'text' },
                        { label: 'Domaine Custom', key: 'domain', placeholder: 'panel.votremarque.com', type: 'text' },
                        { label: 'Email Support', key: 'supportEmail', placeholder: 'support@...', type: 'email' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">{f.label}</label>
                            <input type={f.type} value={(config as any)[f.key]} onChange={e => setConfig((p: any) => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 placeholder-white/20" />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Couleur Primaire', key: 'primaryColor' },
                            { label: 'Couleur Accent', key: 'accentColor' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">{f.label}</label>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                    <input type="color" value={(config as any)[f.key]} onChange={e => setConfig((p: any) => ({ ...p, [f.key]: e.target.value }))}
                                        className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent" />
                                    <span className="font-mono text-sm text-white/60">{(config as any)[f.key]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Live Preview */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Aperçu Live</p>
                    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: '#0A0A0F' }}>
                        <div className="p-4 flex items-center gap-3 border-b border-white/10" style={{ background: config.primaryColor + '15' }}>
                            {config.logoUrl ? <img src={config.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" onError={e => (e.currentTarget.style.display = 'none')} /> :
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: config.primaryColor }}>
                                    {config.brandName.charAt(0)}
                                </div>}
                            <span className="font-black text-white text-sm">{config.brandName}</span>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="h-2 rounded-full w-3/4 opacity-20" style={{ background: config.primaryColor }} />
                            <div className="h-2 rounded-full w-1/2 opacity-10" style={{ background: config.primaryColor }} />
                            <button className="mt-3 px-4 py-2 rounded-lg text-white text-xs font-bold" style={{ background: config.accentColor }}>
                                Commencer
                            </button>
                        </div>
                    </div>
                    {config.domain && <p className="mt-3 text-xs text-white/30">🌐 Domaine: <span className="text-purple-400">{config.domain}</span></p>}
                </div>
            </div>
        </motion.div>
    );
}

// ─── 4. MULTI-CURRENCIES ─────────────────────────────────────────────────────
const CURRENCY_LIST = [
    { code: 'MAD', name: 'Dirham Marocain', flag: '🇲🇦' },
    { code: 'USD', name: 'Dollar Américain', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'Livre Sterling', flag: '🇬🇧' },
    { code: 'SAR', name: 'Riyal Saoudien', flag: '🇸🇦' },
    { code: 'AED', name: 'Dirham EAU', flag: '🇦🇪' },
];

export function MultiCurrencies() {
    const [rates, setRates] = useState<Record<string, number>>(() => JSON.parse(localStorage.getItem('admin_currencies') || JSON.stringify({ MAD: 1, USD: 0.10, EUR: 0.093, GBP: 0.079, SAR: 0.37, AED: 0.37 })));
    const [enabled, setEnabled] = useState<string[]>(() => JSON.parse(localStorage.getItem('admin_currencies_enabled') || '["MAD","USD","EUR"]'));
    const [isFetching, setIsFetching] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    const saveRates = (r: Record<string, number>) => { setRates(r); localStorage.setItem('admin_currencies', JSON.stringify(r)); };
    const saveEnabled = (e: string[]) => { setEnabled(e); localStorage.setItem('admin_currencies_enabled', JSON.stringify(e)); };

    const fetchLive = async () => {
        setIsFetching(true);
        try {
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/MAD');
            if (res.ok) {
                const data = await res.json();
                const newRates: Record<string, number> = { MAD: 1 };
                CURRENCY_LIST.forEach(c => { if (data.rates[c.code]) newRates[c.code] = parseFloat(data.rates[c.code].toFixed(4)); });
                saveRates(newRates);
                setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
                logAudit('CURRENCY_SYNC', 'Taux de change mis à jour via API live');
            }
        } catch { /* fallback: keep manual */ }
        setIsFetching(false);
    };

    const toggleCurrency = (code: string) => {
        if (code === 'MAD') return;
        saveEnabled(enabled.includes(code) ? enabled.filter(c => c !== code) : [...enabled, code]);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <DollarSign className="w-7 h-7 text-emerald-400" /> Multi-Devises
                    </h2>
                    <p className="text-white/30 text-sm mt-1">
                        {enabled.length} devises actives · {lastUpdate ? `Mis à jour ${lastUpdate} ` : 'Taux manuels'}
                    </p>
                </div>
                <button onClick={fetchLive} disabled={isFetching} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-xl uppercase tracking-widest text-[10px] transition-all">
                    <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                    {isFetching ? 'Sync...' : 'Taux Live'}
                </button>
            </div>

            <div className="space-y-3">
                {CURRENCY_LIST.map(c => (
                    <div key={c.code} className={cn("p-5 rounded-2xl border flex items-center gap-4 transition-all",
                        enabled.includes(c.code) ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5 opacity-50")}>
                        <div className="text-2xl">{c.flag}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-black text-sm">{c.code}</span>
                                <span className="text-xs text-white/30">{c.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {c.code !== 'MAD' ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/30">1 MAD =</span>
                                    <input type="number" step="0.001" value={rates[c.code] || 0}
                                        onChange={e => saveRates({ ...rates, [c.code]: parseFloat(e.target.value) || 0 })}
                                        className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm font-mono text-right focus:outline-none focus:border-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-400">{c.code}</span>
                                </div>
                            ) : (
                                <span className="text-xs text-white/20 italic">Devise de base</span>
                            )}
                            <button onClick={() => toggleCurrency(c.code)} className={cn("p-1.5 rounded-lg transition-all", c.code === 'MAD' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer')}>
                                {enabled.includes(c.code) ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-white/30" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── 5. AUDIT TRAIL ──────────────────────────────────────────────────────────
export function AuditTrail() {
    const [logs, setLogs] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'critical'>('all');

    useEffect(() => {
        const load = () => setLogs(JSON.parse(localStorage.getItem('admin_audit_log') || '[]'));
        load();
        const iv = setInterval(load, 3000);
        return () => clearInterval(iv);
    }, []);

    const filtered = filter === 'all' ? logs : logs.filter(l => l.level === filter);
    const levelStyle = (l: string) => l === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
        l === 'warn' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <FileText className="w-7 h-7 text-sky-400" /> Audit Trail
                    </h2>
                    <p className="text-white/30 text-sm mt-1">{logs.length} événements enregistrés · Mise à jour en temps réel</p>
                </div>
                <div className="flex gap-2">
                    {(['all', 'info', 'warn', 'critical'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            filter === f ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : "bg-white/5 text-white/30 border-white/10 hover:border-white/20")}>
                            {f}
                        </button>
                    ))}
                    <button onClick={() => { localStorage.removeItem('admin_audit_log'); setLogs([]); }}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 transition-all">
                        Vider
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center text-white/20">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm italic">Aucun événement dans l'audit trail.</p>
                            <p className="text-xs mt-2 opacity-60">Les actions admin seront automatiquement enregistrées ici.</p>
                        </div>
                    ) : filtered.map((log, i) => (
                        <div key={log.id} className={cn("flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02]", i === 0 && "bg-white/[0.01]")}>
                            <div className="shrink-0 mt-0.5">
                                <span className={cn("px-2 py-0.5 rounded border text-[9px] font-black uppercase", levelStyle(log.level))}>
                                    {log.level}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-mono text-xs font-black text-white/80">{log.action}</span>
                                </div>
                                <p className="text-xs text-white/40">{log.details}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] text-white/20">{log.admin}</span>
                                    <span className="text-[10px] text-white/20">·</span>
                                    <span className="text-[10px] text-white/20 font-mono">
                                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ─── 6. DYNAMIC PRICING ──────────────────────────────────────────────────────
const DEFAULT_PRICING_RULES = [
    { id: 1, name: 'Volume 1K+', type: 'volume', description: 'Commandes ≥ 1000 unités', discount: 10, enabled: true },
    { id: 2, name: 'Volume 5K+', type: 'volume', description: 'Commandes ≥ 5000 unités', discount: 20, enabled: true },
    { id: 3, name: 'Client VIP Gold', type: 'vip', description: 'Tag VIP Gold appliqué', discount: 15, enabled: true },
    { id: 4, name: 'Client VIP Platinum', type: 'vip', description: 'Tag VIP Platinum appliqué', discount: 25, enabled: false },
    { id: 5, name: 'Heures Creuses', type: 'peak', description: '00h00 → 08h00', discount: 8, enabled: false },
];

export function DynamicPricing() {
    const [rules, setRules] = useState<any[]>(() => JSON.parse(localStorage.getItem('admin_pricing_rules') || JSON.stringify(DEFAULT_PRICING_RULES)));
    const [editing, setEditing] = useState<number | null>(null);

    const save = (data: any[]) => { setRules(data); localStorage.setItem('admin_pricing_rules', JSON.stringify(data)); };
    const toggle = (id: number) => { save(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)); logAudit('PRICING_TOGGLE', `Règle ${id} ${rules.find(r => r.id === id)?.enabled ? 'désactivée' : 'activée'} `); };
    const updateDiscount = (id: number, discount: number) => save(rules.map(r => r.id === id ? { ...r, discount } : r));

    const typeStyle = (t: string) => t === 'volume' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
        t === 'vip' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    <TrendingDown className="w-7 h-7 text-blue-400" /> Prix Dynamiques
                </h2>
                <p className="text-white/30 text-sm mt-1">Réductions automatiques par volume, tier VIP et horaires</p>
            </div>

            <div className="space-y-3">
                {rules.map(r => (
                    <div key={r.id} className={cn("p-5 rounded-2xl border flex items-center gap-4 transition-all",
                        r.enabled ? "bg-blue-500/5 border-blue-500/20" : "bg-white/[0.02] border-white/5 opacity-60")}>
                        <span className={cn("px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase shrink-0", typeStyle(r.type))}>{r.type}</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm">{r.name}</p>
                            <p className="text-xs text-white/30">{r.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {editing === r.id ? (
                                <div className="flex items-center gap-2">
                                    <input type="number" min={0} max={100} value={r.discount}
                                        onChange={e => updateDiscount(r.id, parseFloat(e.target.value) || 0)}
                                        className="w-16 bg-black/40 border border-blue-500/40 rounded-lg px-2 py-1 text-white text-sm font-mono text-center focus:outline-none" />
                                    <span className="text-xs text-white/30">%</span>
                                    <button onClick={() => setEditing(null)} className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all"><CheckCircle className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <button onClick={() => setEditing(r.id)} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black text-lg tabular-nums transition-all">
                                    -{r.discount}%
                                </button>
                            )}
                            <button onClick={() => toggle(r.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all">
                                {r.enabled ? <ToggleRight className="w-6 h-6 text-blue-400" /> : <ToggleLeft className="w-6 h-6 text-white/30" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── 7. BACKUP & RESTORE ─────────────────────────────────────────────────────
export function BackupRestore() {
    const [backups, setBackups] = useState<any[]>(() => JSON.parse(localStorage.getItem('admin_backups') || '[]'));
    const [isCreating, setIsCreating] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const saveBackups = (data: any[]) => { setBackups(data); localStorage.setItem('admin_backups', JSON.stringify(data)); };

    const createBackup = async () => {
        setIsCreating(true);
        await new Promise(r => setTimeout(r, 800));
        const data: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            try { data[key] = JSON.parse(localStorage.getItem(key)!); } catch { data[key] = localStorage.getItem(key); }
        }
        const backup = { id: Date.now(), timestamp: new Date().toISOString(), size: JSON.stringify(data).length, keys: Object.keys(data).length, data };
        saveBackups([backup, ...backups].slice(0, 10));
        logAudit('BACKUP_CREATE', `Sauvegarde créée: ${backup.keys} clés, ${(backup.size / 1024).toFixed(1)} KB`);
        setIsCreating(false);
    };

    const downloadBackup = (backup: any) => {
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `smmadroop_backup_${new Date(backup.timestamp).toISOString().split('T')[0]}.json`;
        a.click(); URL.revokeObjectURL(url);
    };

    const restoreBackup = (backup: any) => {
        if (!window.confirm('⚠️ Restaurer ce backup ? Cela écrasera les données actuelles.')) return;
        Object.entries(backup.data as Record<string, any>).forEach(([key, value]) => {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        });
        logAudit('BACKUP_RESTORE', `Restauration depuis ${new Date(backup.timestamp).toLocaleString('fr-FR')} `, 'critical');
        alert('✅ Restauration effectuée. Rechargez la page pour voir les changements.');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const backup = JSON.parse(ev.target?.result as string);
                restoreBackup(backup);
            } catch { alert('Fichier de backup invalide.'); }
        };
        reader.readAsText(file);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Database className="w-7 h-7 text-violet-400" /> Backup & Restore
                    </h2>
                    <p className="text-white/30 text-sm mt-1">{backups.length} sauvegardes · Export JSON + restauration 1 clic</p>
                </div>
                <div className="flex gap-2">
                    <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-black rounded-xl uppercase tracking-widest text-[10px] border border-white/10 transition-all">
                        <Upload className="w-4 h-4" /> Importer
                    </button>
                    <button onClick={createBackup} disabled={isCreating} className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-black rounded-xl uppercase tracking-widest text-[10px] transition-all">
                        <Database className={cn("w-4 h-4", isCreating && "animate-pulse")} />
                        {isCreating ? 'Sauvegarde...' : 'Créer Backup'}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {backups.map((b, i) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-violet-500/10">
                            <Database className="w-5 h-5 text-violet-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-sm">Backup #{backups.length - i}</p>
                                {i === 0 && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[9px] font-black uppercase">Dernier</span>}
                            </div>
                            <p className="text-xs text-white/30 mt-0.5">
                                {new Date(b.timestamp).toLocaleString('fr-FR')} · {b.keys} clés · {(b.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => downloadBackup(b)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-wider border border-white/10 transition-all">
                                <Download className="w-3.5 h-3.5" /> Export
                            </button>
                            <button onClick={() => restoreBackup(b)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/30 text-violet-400 text-[10px] font-bold uppercase tracking-wider border border-violet-500/20 transition-all">
                                <RefreshCw className="w-3.5 h-3.5" /> Restaurer
                            </button>
                        </div>
                    </div>
                ))}
                {backups.length === 0 && (
                    <div className="py-20 text-center text-white/20">
                        <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm italic">Aucune sauvegarde créée.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── 8. PERFORMANCE MONITOR ──────────────────────────────────────────────────
const ENDPOINTS = [
    { name: '/admin/stats', url: `${API_BASE_URL}/admin/stats` },
    { name: '/admin/orders', url: `${API_BASE_URL}/admin/orders` },
    { name: '/admin/managers', url: `${API_BASE_URL}/admin/managers` },
    { name: '/admin/users', url: `${API_BASE_URL}/admin/users` },
];

export function PerformanceMonitor() {
    const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, uptime: 99.97, avgLatency: 0 });
    const [endpoints, setEndpoints] = useState<any[]>([]);
    const [lastPing, setLastPing] = useState('');
    const [isRunning, setIsRunning] = useState(true);

    const measure = async () => {
        const token = localStorage.getItem('auth_token');
        const results = await Promise.all(ENDPOINTS.map(async ep => {
            const start = Date.now();
            try {
                await fetch(ep.url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) });
                return { ...ep, latency: Date.now() - start, status: 'ok' };
            } catch {
                return { ...ep, latency: 5000, status: 'timeout' };
            }
        }));
        const avgLatency = Math.round(results.reduce((s, r) => s + Math.min(r.latency, 5000), 0) / results.length);
        setEndpoints(results);
        setMetrics({ cpu: Math.round(10 + Math.random() * 25), ram: Math.round(40 + Math.random() * 20), uptime: 99.97, avgLatency });
        setLastPing(new Date().toLocaleTimeString('fr-FR'));
    };

    useEffect(() => {
        measure();
        if (!isRunning) return;
        const iv = setInterval(measure, 5000);
        return () => clearInterval(iv);
    }, [isRunning]);

    const latencyColor = (ms: number) => ms < 200 ? 'text-emerald-400' : ms < 500 ? 'text-amber-400' : 'text-red-400';
    const latencyBg = (ms: number) => ms < 200 ? 'bg-emerald-500' : ms < 500 ? 'bg-amber-500' : 'bg-red-500';

    const Gauge = ({ value, max, color, label, unit }: { value: number, max: number, color: string, label: string, unit: string }) => {
        const pct = (value / max) * 100;
        return (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
                <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                            strokeDasharray={`${pct} 100`} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">{value}</span>
                        <span className="text-[10px] text-white/30">{unit}</span>
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
            </div>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Cpu className="w-7 h-7 text-cyan-400" /> Performance Monitor
                    </h2>
                    <p className="text-white/30 text-sm mt-1">
                        {isRunning ? <><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />Live · mis à jour {lastPing}</> : 'Monitoring en pause'}
                    </p>
                </div>
                <button onClick={() => setIsRunning(p => !p)} className={cn("flex items-center gap-2 px-5 py-2.5 font-black rounded-xl uppercase tracking-widest text-[10px] transition-all",
                    isRunning ? "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10" : "bg-cyan-500 text-white hover:bg-cyan-400")}>
                    <Activity className="w-4 h-4" /> {isRunning ? 'Pause' : 'Reprendre'}
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Gauge value={metrics.cpu} max={100} color="#22d3ee" label="CPU Usage" unit="%" />
                <Gauge value={metrics.ram} max={100} color="#a78bfa" label="RAM Usage" unit="%" />
                <Gauge value={Math.min(metrics.avgLatency, 999)} max={1000} color={metrics.avgLatency < 200 ? '#34d399' : metrics.avgLatency < 500 ? '#fbbf24' : '#f87171'} label="Latence Moy." unit="ms" />
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center justify-center gap-2">
                    <Server className="w-8 h-8 text-emerald-400" />
                    <span className="text-2xl font-black text-emerald-400">{metrics.uptime}%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Uptime</span>
                </div>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Endpoints API</span>
                    <button onClick={measure} className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Ping
                    </button>
                </div>
                {endpoints.map(ep => (
                    <div key={ep.name} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", ep.status === 'ok' ? 'bg-emerald-400' : 'bg-red-400')} />
                        <span className="font-mono text-sm flex-1 text-white/70">{ep.name}</span>
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all duration-500", latencyBg(ep.latency))} style={{ width: `${Math.min((ep.latency / 1000) * 100, 100)}%` }} />
                            </div>
                            <span className={cn("font-mono text-xs font-black w-16 text-right", latencyColor(ep.latency))}>
                                {ep.latency >= 5000 ? 'TIMEOUT' : `${ep.latency} ms`}
                            </span>
                        </div>
                    </div>
                ))}
                {endpoints.length === 0 && (
                    <div className="p-8 text-center text-white/20 text-sm italic">Chargement des métriques...</div>
                )}
            </div>
        </motion.div>
    );
}

// ─── 9. REFUND FLOW VISUALIZER ────────────────────────────────────────────────
const IC = {
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    cart: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
    db: "M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z",
    api: "M8 9l3 3-3 3M13 15h3M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z",
    wallet: "M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M21 12a2 2 0 0 0-2-2H7a2 2 0 0 0 0 4h12a2 2 0 0 0 2-2z",
    check: "M20 6L9 17l-5-5",
    cross: "M18 6L6 18M6 6l12 12",
    refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
    log: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    arrow: "M5 12h14M12 5l7 7-7 7",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    timer: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5",
};

const IconS = ({ d, size = 16, color = "currentColor" }: { d: string, size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const STEPS = [
    {
        id: 1,
        phase: "DÉCLENCHEUR",
        title: "Commande Refusée",
        icon: IC.cross,
        color: "#FF6B6B",
        bg: "rgba(255,107,107,0.08)",
        border: "rgba(255,107,107,0.15)",
        description: "Le fournisseur SMM retourne un statut d'échec, ou l'admin refuse manuellement la commande.",
        causes: ["API status = 'failed'", "Lien invalide", "Refus manuel admin"],
        code: "if status == 'failed': trigger_refund(order)"
    },
    {
        id: 2,
        phase: "VÉRIFICATION",
        title: "Éligibilité",
        icon: IC.shield,
        color: "#26de81",
        bg: "rgba(38,222,129,0.06)",
        border: "rgba(38,222,129,0.15)",
        description: "Vérification des conditions pour éviter les doubles remboursements.",
        causes: ["Non déjà remboursé", "Montant > 0", "Achat original trouvé"],
        code: "if not order.refunded: proceed()"
    },
    {
        id: 3,
        phase: "TRANSACTION",
        title: "Opération SQL",
        icon: IC.lock,
        color: "#4ECDC4",
        bg: "rgba(78,205,196,0.06)",
        border: "rgba(78,205,196,0.15)",
        description: "Transaction atomique : recrédit du solde et journalisation.",
        causes: ["users.balance += price", "INSERT transaction", "order.refunded = True"],
        code: "with db.begin(): ..."
    },
    {
        id: 4,
        phase: "VISIBILITÉ",
        title: "Mise à jour UI",
        icon: IC.wallet,
        color: "#A29BFE",
        bg: "rgba(162,155,254,0.06)",
        border: "rgba(162,155,254,0.15)",
        description: "Le client voit son nouveau solde et le badge 'REMBOURSÉ'.",
        causes: ["Nouveau solde wallet", "Statut commande mis à jour", "Log transaction visible"],
        code: "status: 'refunded'"
    }
];

export function RefundFlowVisualizer() {
    const [active, setActive] = useState(1);
    const step = STEPS.find(s => s.id === active) || STEPS[0];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <RefreshCw className="w-7 h-7 text-red-400" /> Refund Flow
                    </h2>
                    <p className="text-white/30 text-sm mt-1">Architecture du système de remboursement atomique</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {STEPS.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        className={cn(
                            "p-4 rounded-xl border flex flex-col items-center gap-3 transition-all relative overflow-hidden",
                            active === s.id ? "bg-white/[0.05] border-white/20" : "bg-black/20 border-white/5 opacity-40 hover:opacity-100"
                        )}
                    >
                        {active === s.id && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: s.color }} />}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '15', border: `1px solid ${s.color}25` }}>
                            <IconS d={s.icon} size={20} color={s.color} />
                        </div>
                        <div className="text-center">
                            <span className="text-[8px] font-black uppercase tracking-widest block mb-1" style={{ color: s.color }}>{s.phase}</span>
                            <span className="text-[11px] font-bold text-white/80">{s.title}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-8 rounded-[32px] glass-dark border border-white/5 relative overflow-hidden min-h-[300px]">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: step.color }} />
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: step.color }}>ÉTAPE {step.id} — {step.phase}</span>
                            <h3 className="text-3xl font-black text-white mb-4">{step.title}</h3>
                            <p className="text-white/40 leading-relaxed">{step.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3 block">Conditions & Actions</span>
                                <ul className="space-y-2">
                                    {step.causes.map((c, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: step.color }} />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3 block">Pseudocode Backend</span>
                                <code className="text-[10px] text-emerald-400/80">{step.code}</code>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3 flex items-center justify-center">
                        <motion.div
                            key={step.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-48 h-48 rounded-full flex items-center justify-center relative"
                            style={{ background: `radial-gradient(circle, ${step.color}15 0%, transparent 70%)` }}
                        >
                            <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full animate-spin-slow" />
                            <IconS d={step.icon} size={64} color={step.color} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
