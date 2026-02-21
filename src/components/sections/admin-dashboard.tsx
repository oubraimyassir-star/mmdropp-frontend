import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from '@/components/ui/banner';
import { LayoutDashboard, Users, ShoppingBag, Package, Settings, LogOut, ShieldCheck, Edit2, CheckCircle2, XCircle, AlertCircle, MoreHorizontal, User as UserIcon, Globe, ExternalLink, Calendar, Coins, Hash, Save, X, Image as ImageIcon, TrendingUp, Shield, Zap, Palette, DollarSign, FileText, TrendingDown, Database, Cpu, RefreshCw } from 'lucide-react';
import { AdminSettings } from './admin-settings';
import { BlacklistManager, AutomationRules, WhiteLabelConfig, MultiCurrencies, AuditTrail, DynamicPricing, BackupRestore, PerformanceMonitor, RefundFlowVisualizer } from './admin-advanced-modules';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';
import { AnimatedMenuButton } from '@/components/ui/animated-menu-button';
// import { RevenueBarChart, UserActivityAreaChart } from '@/components/ui/analytics-charts';
// import { NotificationCenter } from '@/components/ui/notification-center';

interface AdminDashboardProps {
    onLogout: () => void;
    user?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

// Mock Data for Admin (Fallback)
const ADMIN_STATS = [
    { label: "Revenu Total", value: "0.00 MAD", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Comptes Créés", value: "0", icon: Users, color: "text-blue-400" },
    { label: "Utilisateurs En Ligne", value: "0", icon: Globe, color: "text-emerald-500" },
    { label: "Commandes", value: "0", icon: ShoppingBag, color: "text-purple-400" },
];

export function AdminDashboard({ onLogout, user }: AdminDashboardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    // const [searchQuery, setSearchQuery] = useState('');
    // const [showNotifications, setShowNotifications] = useState(false);

    // Data State
    const [stats, setStats] = useState<any>(null);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [managersList, setManagersList] = useState<any[]>([]);

    // Manager Create State
    const [showAddManager, setShowAddManager] = useState(false);
    const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '' });
    const [isCreatingManager, setIsCreatingManager] = useState(false);

    // Transfer State
    const [showTransferFunds, setShowTransferFunds] = useState<any>(null); // manager object
    const [transferAmount, setTransferAmount] = useState('');

    // Team Tab State
    const [teamSearch, setTeamSearch] = useState('');
    const [teamFilter, setTeamFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [editingManager, setEditingManager] = useState<any>(null);
    const [inlineVirement, setInlineVirement] = useState<Record<number, string>>({});
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [managerPermissions, setManagerPermissions] = useState<string[]>([]);
    const ALL_PERMISSIONS = ['Voir commandes', 'Gérer commandes', 'Voir clients', 'Gérer clients', 'Voir stats', 'Gérer wallet'];

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Editing State
    const [editingService, setEditingService] = useState<any>(null);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [viewingCustomer, setViewingCustomer] = useState<any>(null);
    const [customerOrders, setCustomerOrders] = useState<any[]>([]);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        price: "",
        unit: "",
        is_active: true
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Stats
            const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
            if (statsRes.ok) {
                const data = await statsRes.json();
                console.log("Admin Stats Data:", data);
                setStats(data);
            } else {
                console.warn("Failed to fetch stats:", statsRes.status, await statsRes.text());
            }

            // Fetch Users
            if (activeTab === 'Users' || activeTab === 'Overview') {
                const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
                if (usersRes.ok) setUsersList(await usersRes.json());
            }

            // Fetch Orders
            if (activeTab === 'Orders' || activeTab === 'Overview') {
                const ordersRes = await fetch(`${API_BASE_URL}/admin/orders`, { headers });
                if (ordersRes.ok) setOrdersList(await ordersRes.json());
            }

            // Fetch Services
            if (activeTab === 'Services' || activeTab === 'Overview') {
                console.log("Fetching services from backend...");
                const servicesRes = await fetch(`${API_BASE_URL}/admin/services`, { headers });
                if (servicesRes.ok) {
                    const data = await servicesRes.json();
                    setServicesList(data);
                }
            }

            // Fetch Managers
            if (activeTab === 'Team' || activeTab === 'Overview') {
                const managersRes = await fetch(`${API_BASE_URL}/admin/managers`, { headers });
                if (managersRes.ok) setManagersList(await managersRes.json());
            }

        } catch (error) {
            console.error("Failed to fetch admin data", error);
            // Don't setStats(ADMIN_STATS) here because ADMIN_STATS is an array
            // and the component expects an object if stats is not null.
        } finally {
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh orders locally or fetch again
                setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleToggleUserActive = async (userId: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-active`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const updated = await res.json();
                setUsersList(prev => prev.map(u => u.id === userId ? { ...u, is_active: updated.is_active } : u));
            }
        } catch (error) {
            console.error("Error toggling user activation:", error);
        }
    };

    const handleSetRole = async (userId: number, role: string) => {
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/set-role`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Failed to set user role", error);
        }
    };


    const handleSaveService = async () => {
        // ... (existing)
    };

    const handleCreateManager = async () => {
        if (!managerForm.name || !managerForm.email || !managerForm.password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        setIsCreatingManager(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/admin/managers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(managerForm)
            });

            if (res.ok) {
                alert("Compte Management créé avec succès !");
                setShowAddManager(false);
                setManagerForm({ name: '', email: '', password: '' });
                fetchData();
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.detail || "Échec de la création"}`);
            }
        } catch (error) {
            console.error("Error creating manager:", error);
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsCreatingManager(false);
        }
    };

    const handleTransferFunds = async () => {
        if (!showTransferFunds) return;
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/admin/managers/${showTransferFunds.id}/transfer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: parseFloat(transferAmount) })
            });
            if (res.ok) {
                setShowTransferFunds(null);
                setTransferAmount('');
                fetchData();
            }
        } catch (error) {
            console.error("Error transferring funds:", error);
        }
    };

    // Derived Stats for UI
    const displayedStats = (stats && stats.revenue && stats.users && stats.orders) ? [
        { label: "Revenu Total", value: `${(stats.revenue.total || 0).toFixed(2)} MAD`, icon: TrendingUp, color: "text-emerald-400" },
        { label: "Profit Total", value: `${(stats.revenue.profit || 0).toFixed(2)} MAD`, icon: ShieldCheck, color: "text-gold-400" },
        { label: "Comptes Créés", value: (stats.users.total || 0).toString(), icon: Users, color: "text-blue-400" },
        { label: "Utilisateurs En Ligne", value: (stats.users.online || 0).toString(), icon: Globe, color: "text-emerald-500" },
        { label: "Commandes", value: (stats.orders.total || 0).toString(), icon: ShoppingBag, color: "text-purple-400" },
    ] : ADMIN_STATS;

    const displayedUsers = usersList;
    const displayedOrders = ordersList;
    const displayedServices = servicesList;

    const menuItems = [
        { label: "Overview", icon: LayoutDashboard },
        { label: "Team", icon: ShieldCheck },
        { label: "Users", icon: Users },
        { label: "Orders", icon: ShoppingBag },
        { label: "Services", icon: Package },
        { label: "Blacklist", icon: Shield },
        { label: "Automation", icon: Zap },
        { label: "White-Label", icon: Palette },
        { label: "Devises", icon: DollarSign },
        { label: "Audit", icon: FileText },
        { label: "Pricing", icon: TrendingDown },
        { label: "Backup", icon: Database },
        { label: "Performance", icon: Cpu },
        { label: "Flux", icon: RefreshCw },
        { label: "Settings", icon: Settings },
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className={cn("flex flex-col h-full", isMobile ? "pt-8 px-6" : "p-6")}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <ShieldCheck className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-tight text-red-100">
                        ADMIN PANEL
                    </span>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="space-y-2 flex-grow">
                {menuItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setActiveTab(item.label);
                            if (isMobile) setIsMenuOpen(false);
                        }}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase tracking-wider text-xs text-left",
                            activeTab === item.label
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "hover:bg-white/5 text-white/60 hover:text-white border border-transparent"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.label ? "text-red-400" : "text-white/40")} />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                {user?.email === 'oubraimyassir@gmail.com' && (
                    <button
                        onClick={() => (window as any).toggleManagerView?.()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all font-bold uppercase tracking-wider text-xs border border-blue-500/20 group"
                    >
                        <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Vue Manager
                    </button>
                )}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 text-red-500/60 hover:text-red-400 transition-all font-bold uppercase tracking-wider text-xs"
                >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                </button>
            </div>
        </div>
    );

    return (
        <div className="dark min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
            <Banner
                id="admin-welcome"
                variant="rainbow"
                message="🔒 Mode Administrateur Actif. Vous avez un accès complet au système."
                height="2.5rem"
            />

            <div className="flex flex-grow relative">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 border-r border-foreground/5 bg-foreground/[0.04] backdrop-blur-xl sticky h-[calc(100vh-var(--banner-height,0px))] top-[var(--banner-height,0px)] overflow-y-auto">
                    <SidebarContent />
                </aside>

                <div className="flex-grow flex flex-col min-w-0">
                    {/* Header */}
                    <nav
                        className="border-b border-foreground/5 bg-foreground/[0.02] backdrop-blur-xl sticky top-0 z-30 transition-all duration-300 h-20 flex items-center"
                        style={{ top: 'var(--banner-height, 0)' }}
                    >
                        <div className="w-full px-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="lg:hidden">
                                    <AnimatedMenuButton
                                        isOpen={isMenuOpen}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    />
                                </div>
                                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-[10px] font-bold uppercase tracking-widest text-red-400/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Root Access
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-foreground/5 border border-foreground/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                                        {user?.firstName?.charAt(0) || 'A'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <div className="text-xs font-bold text-foreground uppercase tracking-tight">{user?.firstName || 'Admin'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content Area */}
                    <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full">
                        <header className="mb-12">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2"
                            >
                                {activeTab}
                            </motion.h1>
                            <p className="text-white/40 font-medium italic">
                                Gérer et surveiller l'ensemble de la plateforme.
                            </p>
                        </header>

                        {/* CONDITIONAL CONTENT based on Tabs */}
                        {activeTab === 'Overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {displayedStats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 rounded-3xl glass-dark border border-white/5 hover:border-red-500/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={cn("p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform", stat.color)}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-white/40 text-sm font-bold uppercase tracking-widest">{stat.label}</span>
                                            </div>
                                            <div className="text-3xl font-black tabular-nums">{stat.value}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Order Status Breakdown */}
                                {ordersList.length > 0 && (() => {
                                    const total = ordersList.length;
                                    const confirmed = ordersList.filter((o: any) => o.status === 'completed').length;
                                    const cancelled = ordersList.filter((o: any) => o.status === 'cancelled').length;
                                    const pending = ordersList.filter((o: any) => o.status === 'pending').length;
                                    const processing = ordersList.filter((o: any) => o.status === 'processing').length;
                                    const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

                                    const statusCards = [
                                        { label: 'Confirmées', count: confirmed, pct: pct(confirmed), color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', bar: 'bg-emerald-500', dot: 'bg-emerald-400' },
                                        { label: 'Annulées', count: cancelled, pct: pct(cancelled), color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/10', bar: 'bg-red-500', dot: 'bg-red-400' },
                                        { label: 'En Attente', count: pending, pct: pct(pending), color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10', bar: 'bg-amber-500', dot: 'bg-amber-400' },
                                        { label: 'En Cours', count: processing, pct: pct(processing), color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10', bar: 'bg-blue-500', dot: 'bg-blue-400' },
                                    ];

                                    return (
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Répartition des Commandes</span>
                                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40">{total} total</span>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {statusCards.map((s, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.3 + i * 0.05 }}
                                                        className={cn("p-5 rounded-3xl border flex flex-col gap-3", s.bg, s.border)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("w-2 h-2 rounded-full", s.dot)} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</span>
                                                            </div>
                                                            <span className={cn("text-[10px] font-black tabular-nums", s.color)}>{s.pct}%</span>
                                                        </div>
                                                        <div className={cn("text-3xl font-black tabular-nums", s.color)}>{s.count}</div>
                                                        <div className="w-full bg-white/5 rounded-full h-1.5">
                                                            <div className={cn("h-1.5 rounded-full transition-all", s.bar)} style={{ width: `${s.pct}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-white/20 font-bold">{s.count} sur {total} commandes</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'Team' && (() => {
                            const filteredManagers = (managersList || [])
                                .filter((m: any) => {
                                    if (!m) return false;
                                    const name = m.name || "";
                                    const email = m.email || "";
                                    const matchSearch = name.toLowerCase().includes(teamSearch.toLowerCase()) || email.toLowerCase().includes(teamSearch.toLowerCase());
                                    const matchFilter = teamFilter === 'all' || (teamFilter === 'active' && m.is_active) || (teamFilter === 'inactive' && !m.is_active);
                                    return matchSearch && matchFilter;
                                });
                            const totalBalance = (managersList || []).reduce((s: number, m: any) => s + (m?.balance || 0), 0);
                            const totalHandled = (managersList || []).reduce((s: number, m: any) => s + (m?.handled_count || 0), 0);
                            const activeCount = (managersList || []).filter((m: any) => m?.is_active).length;

                            const kpis = [
                                { label: 'Total Managers', value: managersList.length, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10', icon: '👥' },
                                { label: 'Bénéfices Cumulés', value: `${totalBalance.toFixed(2)} MAD`, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', icon: '💰' },
                                { label: 'Commandes Traitées', value: totalHandled, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10', icon: '📦' },
                                { label: 'Comptes Actifs', value: activeCount, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10', icon: '✅' },
                            ];

                            return (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {kpis.map((k, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                                                className={cn("p-5 rounded-3xl border flex flex-col gap-2", k.bg, k.border)}>
                                                <div className="text-2xl">{k.icon}</div>
                                                <div className={cn("text-2xl font-black tabular-nums", k.color)}>{k.value}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{k.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Header: Search + Filter + Add */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={teamSearch}
                                                onChange={e => setTeamSearch(e.target.value)}
                                                placeholder="Rechercher un manager..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 pr-10"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">🔍</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {(['all', 'active', 'inactive'] as const).map(f => (
                                                <button key={f} onClick={() => setTeamFilter(f)}
                                                    className={cn("px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                        teamFilter === f ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                                                    )}>
                                                    {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Inactifs'}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => setShowAddManager(true)}
                                            className="px-5 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shrink-0">
                                            <Users className="w-4 h-4" /> Ajouter
                                        </button>
                                    </div>

                                    {/* Table */}
                                    <div className="rounded-[32px] glass-dark border border-white/5 overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="text-left py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Manager</th>
                                                    <th className="text-left py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Email</th>
                                                    <th className="text-center py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Bénéfice</th>
                                                    <th className="text-center py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Commandes</th>
                                                    <th className="text-center py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Rôle</th>
                                                    <th className="text-center py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Statut</th>
                                                    <th className="text-right py-4 px-5 text-[10px] font-black uppercase tracking-widest text-white/20">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredManagers.map((m: any) => (
                                                    <tr key={m.id} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                                                    {(m.name || "M").charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="font-bold text-sm">{m.name || "Sans Nom"}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-5 text-white/50 text-xs">{m.email}</td>
                                                        <td className="py-4 px-5 text-center font-black text-sm text-emerald-400 tabular-nums">{(m.balance || 0).toFixed(2)} MAD</td>
                                                        <td className="py-4 px-5 text-center">
                                                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase border border-blue-500/20">
                                                                {m.handled_count || 0} OK
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-5 text-center">
                                                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase border border-purple-500/20">
                                                                {m.role === 'management' ? 'MANAGER' : (m.role?.toUpperCase() || 'USER')}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-5 text-center">
                                                            <div className="flex flex-col gap-1 items-center">
                                                                <span className={cn("px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                                    m.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-500")}>
                                                                    {m.is_active ? 'ACTIF' : 'INACTIF'}
                                                                </span>
                                                                {m.is_blocked && (
                                                                    <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter bg-red-500/5 px-1 rounded border border-red-500/10">
                                                                        Accès Bloqué
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {/* ÉDITER */}
                                                                <button
                                                                    onClick={() => { setEditingManager(m); setManagerPermissions(m.permissions || []); }}
                                                                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                >
                                                                    Éditer
                                                                </button>
                                                                {/* VIREMENT inline */}
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={inlineVirement[m.id] || ''}
                                                                        onChange={e => setInlineVirement(prev => ({ ...prev, [m.id]: e.target.value }))}
                                                                        placeholder="MAD"
                                                                        className="w-20 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-2 py-1.5 text-white text-[10px] font-bold focus:outline-none focus:border-emerald-500 placeholder-white/20"
                                                                    />
                                                                    <button
                                                                        onClick={async () => {
                                                                            const amt = parseFloat(inlineVirement[m.id] || '0');
                                                                            if (!amt || amt <= 0) { showToast('Montant invalide', 'error'); return; }
                                                                            try {
                                                                                const token = localStorage.getItem('auth_token');
                                                                                const res = await fetch(`${API_BASE_URL}/admin/managers/${m.id}/transfer`, {
                                                                                    method: 'POST',
                                                                                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                                                                    body: JSON.stringify({ amount: amt })
                                                                                });
                                                                                if (res.ok) {
                                                                                    showToast(`✅ ${amt} MAD viré à ${m.name}`);
                                                                                    setInlineVirement(prev => ({ ...prev, [m.id]: '' }));
                                                                                    fetchData();
                                                                                } else { showToast('Erreur lors du virement', 'error'); }
                                                                            } catch { showToast('Erreur réseau', 'error'); }
                                                                        }}
                                                                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                    >
                                                                        Virer
                                                                    </button>
                                                                </div>
                                                                {/* RETIRER */}
                                                                <button
                                                                    onClick={async () => {
                                                                        if (!window.confirm(`Retirer le rôle manager de ${m.name} ?`)) return;
                                                                        await handleSetRole(m.id, 'user');
                                                                        showToast(`🔴 ${m.name} rétrogradé en utilisateur`);
                                                                    }}
                                                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                >
                                                                    Retirer
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredManagers.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="py-12 text-center text-white/20 italic text-sm">
                                                            {teamSearch ? 'Aucun résultat pour cette recherche.' : 'Aucun manager créé pour le moment.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {activeTab === 'Users' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 rounded-[40px] glass-dark border border-white/5 overflow-x-auto"
                            >
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Utilisateur</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Email</th>
                                            <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Commandes</th>
                                            <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Benefice Reel</th>
                                            <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Statut</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-foreground/5">
                                        {displayedUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                                <td className="py-4 px-4 font-bold">{user.name}</td>
                                                <td className="py-4 px-4 text-foreground/60">{user.email}</td>
                                                <td className="py-4 px-4 text-center font-bold text-xs">{user.order_count || 0}</td>
                                                <td className="py-4 px-4 text-center font-black text-xs text-emerald-400">{(user.total_profit || 0).toFixed(2)} MAD</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        user.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-500"
                                                    )}>
                                                        {user.is_active ? "ACTIF" : "INACTIF"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                setViewingCustomer(user);
                                                                try {
                                                                    const token = localStorage.getItem('auth_token');
                                                                    const res = await fetch(`${API_BASE_URL}/admin/orders?user_id=${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                                                                    if (res.ok) {
                                                                        const all = await res.json();
                                                                        setCustomerOrders(all.filter((o: any) => o.user_id === user.id || o.owner?.id === user.id));
                                                                    }
                                                                } catch { }
                                                            }}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                        >
                                                            Voir
                                                        </button>
                                                        <button
                                                            onClick={() => handleSetRole(user.id, user.role === 'management' ? 'user' : 'management')}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                                user.role === 'management'
                                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white"
                                                                    : "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white"
                                                            )}
                                                            title={user.role === 'management' ? "Rétrograder en simple utilisateur" : "Promouvoir en Manager"}
                                                        >
                                                            {user.role === 'management' ? "Manager" : "Promouvoir"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleUserActive(user.id)}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                                user.is_active
                                                                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                                                            )}
                                                        >
                                                            {user.is_active ? "Désactiver" : "Activer"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'Orders' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 rounded-[40px] glass-dark border border-white/5 overflow-x-auto"
                            >
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Compte</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Nom Client</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Méthode</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Service</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Qté</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Prix Total</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Bénéfice</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Preuve</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Date</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayedOrders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="text-white font-bold text-xs truncate max-w-[120px]" title={order.owner?.email}>
                                                        {order.owner?.name || order.owner?.email || "N/A"}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-primary-400 font-bold text-xs truncate max-w-[120px]">
                                                        {(!order.customer_name || order.customer_name === "Client Direct") ? (order.owner?.name || "Client") : order.customer_name}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/60">
                                                        {order.payment_method || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-white/60 text-xs text-nowrap">
                                                    {order.service?.title || `Service #${order.service_id}`}
                                                </td>
                                                <td className="py-4 px-4 font-bold text-xs">{order.quantity}</td>
                                                <td className="py-4 px-4 font-black text-xs text-white tabular-nums">
                                                    {order.price?.toFixed(2)} MAD
                                                </td>
                                                <td className="py-4 px-4 font-black text-xs text-emerald-400 tabular-nums">
                                                    {order.profit?.toFixed(2)} MAD
                                                </td>
                                                <td className="py-4 px-4">
                                                    {order.proof_url ? (
                                                        <a
                                                            href={order.proof_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white transition-all inline-flex items-center gap-1.5"
                                                            title="Voir la preuve"
                                                        >
                                                            <ImageIcon className="w-3.5 h-3.5" />
                                                            <span className="text-[9px] font-bold uppercase tracking-wider">Photo</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/10 italic">Aucune</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-[10px] text-white/40 font-medium">
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : "N/A"}
                                                </td>
                                                <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                                                    {order.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, 'processing')}
                                                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all" title="Traiter">
                                                                <AlertCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all" title="Annuler">
                                                                <XCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status === 'processing' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all" title="Terminer">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <span className={cn(
                                                        "ml-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                        order.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                                                            order.status === 'processing' ? "bg-blue-500/10 text-blue-400" :
                                                                order.status === 'cancelled' ? "bg-red-500/10 text-red-500" :
                                                                    "bg-amber-500/10 text-amber-400"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                    <button
                                                        onClick={() => setViewingOrder(order)}
                                                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all ml-1"
                                                        title="Plus de détails"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'Services' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 rounded-[40px] glass-dark border border-white/5 overflow-x-auto"
                            >
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">ID</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Titre</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Prix</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Platforme</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Modifier</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayedServices.map((service) => (
                                            <tr key={service.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-4 font-mono text-xs text-white/40">{service.id}</td>
                                                <td className="py-4 px-4 font-bold max-w-[200px] truncate">{service.title}</td>
                                                <td className="py-4 px-4 font-medium text-emerald-400">{service.price.toFixed(2)} MAD / {service.unit}</td>
                                                <td className="py-4 px-4 text-white/60">{service.platform}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setEditingService(service);
                                                            setEditForm({
                                                                title: service.title,
                                                                description: service.description,
                                                                price: service.price.toString(),
                                                                unit: service.unit,
                                                                is_active: service.is_active
                                                            });
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'Blacklist' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <BlacklistManager />
                            </div>
                        )}

                        {activeTab === 'Automation' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <AutomationRules />
                            </div>
                        )}

                        {activeTab === 'White-Label' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <WhiteLabelConfig />
                            </div>
                        )}

                        {activeTab === 'Devises' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <MultiCurrencies />
                            </div>
                        )}

                        {activeTab === 'Audit' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <AuditTrail />
                            </div>
                        )}

                        {activeTab === 'Pricing' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <DynamicPricing />
                            </div>
                        )}

                        {activeTab === 'Backup' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <BackupRestore />
                            </div>
                        )}

                        {activeTab === 'Performance' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <PerformanceMonitor />
                            </div>
                        )}

                        {activeTab === 'Flux' && (
                            <div className="p-8 rounded-[40px] glass-dark border border-white/5">
                                <RefundFlowVisualizer />
                            </div>
                        )}

                        {activeTab === 'Settings' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 rounded-[40px] glass-dark border border-white/5"
                            >
                                <AdminSettings />
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>

            {/* Edit Service Modal */}
            <AnimatePresence>
                {editingService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setEditingService(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl w-full max-w-md relative"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Modifier le Service</h3>
                            <p className="text-white/60 mb-6 text-sm">{editingService.title}</p>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Titre du Service</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 min-h-[100px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Prix (MAD)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editForm.price}
                                            onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Unité</label>
                                        <input
                                            type="text"
                                            value={editForm.unit}
                                            onChange={e => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                            placeholder="1000, 1, pack..."
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-sm font-bold uppercase tracking-tight">Service Actif</span>
                                    <button
                                        onClick={() => setEditForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={cn(
                                            "w-12 h-6 rounded-full transition-all relative",
                                            editForm.is_active ? "bg-emerald-500" : "bg-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                            editForm.is_active ? "left-7" : "left-1"
                                        )} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleSaveService}
                                    className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    <Save className="w-4 h-4" />
                                    Sauvegarder les Modifications
                                </button>
                            </div>

                            <button
                                onClick={() => setEditingService(null)}
                                className="absolute top-4 right-4 p-2 text-white/20 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {viewingOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setViewingOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0D0D12] border border-white/10 p-8 rounded-[32px] w-full max-w-2xl relative shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                                    <ShoppingBag className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Détails de la Commande</h3>
                                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                                        <Hash className="w-3 h-3" />
                                        ID: {viewingOrder.id}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Section Gauche: Infos Client & Service */}
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Utilisateur & Contact</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-white/40" />
                                                <span className="text-sm font-bold text-white">{viewingOrder.owner?.name || viewingOrder.owner?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-white/40" />
                                                <span className="text-sm text-white/60">{viewingOrder.customer_name || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Service Commandé</div>
                                        <div className="space-y-2">
                                            <div className="text-sm font-black text-primary-400 uppercase tracking-tight">
                                                {viewingOrder.service?.title || "Service Inconnu"}
                                            </div>
                                            <div className="text-xs text-white/60 font-medium italic">
                                                {viewingOrder.quantity} unités
                                            </div>
                                            <div className="pt-2 flex items-center gap-2">
                                                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                                                <a href={viewingOrder.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs font-bold hover:underline transition-all truncate">
                                                    {viewingOrder.link}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Droite: Finances & Dates */}
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Analyse Financière</div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Prix de Vente</span>
                                                <span className="text-sm font-black text-white">{viewingOrder.price?.toFixed(2)} MAD</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Coût Fournisseur</span>
                                                <span className="text-sm font-black text-red-400/80">{viewingOrder.cost?.toFixed(2)} MAD</span>
                                            </div>
                                            <div className="h-px bg-white/5 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-emerald-400/60 font-black uppercase tracking-[0.15em]">Bénéfice Net</span>
                                                <span className="text-lg font-black text-emerald-400 tabular-nums">+{viewingOrder.profit?.toFixed(2)} MAD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Informations Temporelles</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>Créé le :</span>
                                                </div>
                                                <span className="text-white font-medium">{new Date(viewingOrder.created_at).toLocaleDateString()} {new Date(viewingOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            {viewingOrder.transaction_id && (
                                                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                                                    <div className="flex items-center gap-2 text-white/40">
                                                        <Coins className="w-3.5 h-3.5" />
                                                        <span>ID Transaction :</span>
                                                    </div>
                                                    <span className="font-mono text-white/60">{viewingOrder.transaction_id}</span>
                                                </div>
                                            )}
                                            {viewingOrder.processed_by && (
                                                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                                                    <div className="flex items-center gap-2 text-emerald-400/60">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        <span>Traité par :</span>
                                                    </div>
                                                    <span className="font-bold text-emerald-400">ID #{viewingOrder.processed_by}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setViewingOrder(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all border border-transparent hover:border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-end gap-3">
                                <button
                                    onClick={() => setViewingOrder(null)}
                                    className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all border border-white/5"
                                >
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Manager Modal */}
            <AnimatePresence>
                {showAddManager && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAddManager(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl w-full max-w-md relative"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Ajouter un Manager</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Nom Complet</label>
                                    <input
                                        type="text"
                                        value={managerForm.name}
                                        onChange={e => setManagerForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 text-sm"
                                        placeholder="Ex: Ahmed Ben"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Email Professionnel</label>
                                    <input
                                        type="email"
                                        value={managerForm.email}
                                        onChange={e => setManagerForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 text-sm"
                                        placeholder="manager@smmadroop.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Mot de Passe</label>
                                    <input
                                        type="password"
                                        value={managerForm.password}
                                        onChange={e => setManagerForm(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    onClick={handleCreateManager}
                                    disabled={isCreatingManager}
                                    className={cn(
                                        "w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 mt-4",
                                        isCreatingManager && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isCreatingManager ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Création en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Créer le Compte Management
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={() => setShowAddManager(false)}
                                className="absolute top-4 right-4 p-2 text-white/20 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Manager Modal */}
            <AnimatePresence>
                {editingManager && (
                    <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setEditingManager(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0A0A0F] border border-white/10 rounded-[32px] w-full max-w-md relative p-8"
                        >
                            <button onClick={() => setEditingManager(null)} className="absolute top-4 right-4 p-2 text-white/20 hover:text-white"><X className="w-5 h-5" /></button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-white font-black text-lg">
                                    {editingManager.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-white">{editingManager.name}</h3>
                                    <p className="text-xs text-white/40">{editingManager.email}</p>
                                </div>
                            </div>

                            {/* Status & Block Toggles */}
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Statut du compte</label>
                                    <div className="flex gap-2">
                                        {[{ val: true, label: '✅ Actif' }, { val: false, label: '🔴 Inactif' }].map(opt => (
                                            <button key={String(opt.val)}
                                                onClick={() => setEditingManager((prev: any) => ({ ...prev, is_active: opt.val }))}
                                                className={cn("flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    editingManager.is_active === opt.val
                                                        ? "bg-white text-black border-white"
                                                        : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                                                )}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Accès au Dashboard</label>
                                    <button
                                        onClick={() => setEditingManager((prev: any) => ({ ...prev, is_blocked: !prev.is_blocked }))}
                                        className={cn("w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                                            editingManager.is_blocked
                                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                        )}
                                    >
                                        {editingManager.is_blocked ? '🔒 DASHBOARD BLOQUÉ' : '🔓 ACCÈS AUTORISÉ'}
                                    </button>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="mb-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Permissions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ALL_PERMISSIONS.map(perm => (
                                        <button key={perm}
                                            onClick={() => setManagerPermissions(prev =>
                                                prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
                                            )}
                                            className={cn("px-3 py-2 rounded-xl text-[10px] font-bold text-left border transition-all",
                                                managerPermissions.includes(perm)
                                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                    : "bg-white/5 text-white/30 border-white/10 hover:border-white/20"
                                            )}>
                                            {managerPermissions.includes(perm) ? '✓ ' : ''}{perm}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Save */}
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('auth_token');

                                        // Update active status if changed
                                        const original = managersList.find((m: any) => m.id === editingManager.id);
                                        if (original && original.is_active !== editingManager.is_active) {
                                            await fetch(`${API_BASE_URL}/admin/users/${editingManager.id}/toggle-active`, {
                                                method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                        }

                                        // Update block status if changed
                                        if (original && original.is_blocked !== editingManager.is_blocked) {
                                            await fetch(`${API_BASE_URL}/admin/managers/${editingManager.id}/toggle-block`, {
                                                method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                        }

                                        showToast(`✅ ${editingManager.name} mis à jour`);
                                        setEditingManager(null);
                                        fetchData();
                                    } catch { showToast('Erreur lors de la mise à jour', 'error'); }
                                }}
                                className="w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-xl uppercase tracking-widest text-[10px] transition-all"
                            >
                                Sauvegarder les modifications
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "fixed bottom-6 right-6 z-[200] px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl border",
                            toast.type === 'success'
                                ? "bg-emerald-900/90 text-emerald-300 border-emerald-500/30"
                                : "bg-red-900/90 text-red-300 border-red-500/30"
                        )}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Customer Detail Modal */}
            <AnimatePresence>
                {viewingCustomer && (
                    <div
                        className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setViewingCustomer(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0A0A0F] border border-white/10 rounded-[32px] w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-white/5 flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shrink-0">
                                        {viewingCustomer.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight text-white">{viewingCustomer.name}</h3>
                                        <p className="text-sm text-white/40 font-medium">{viewingCustomer.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                viewingCustomer.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                            )}>
                                                {viewingCustomer.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400">
                                                {viewingCustomer.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setViewingCustomer(null)} className="p-2 text-white/20 hover:text-white transition-colors shrink-0">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
                                <div className="p-5 text-center">
                                    <div className="text-2xl font-black text-emerald-400 tabular-nums">{(viewingCustomer.total_profit || 0).toFixed(2)}</div>
                                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Bénéfice Réel (MAD)</div>
                                </div>
                                <div className="p-5 text-center">
                                    <div className="text-2xl font-black text-white tabular-nums">{viewingCustomer.order_count || customerOrders.length}</div>
                                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Commandes</div>
                                </div>
                                <div className="p-5 text-center">
                                    <div className="text-2xl font-black text-blue-400 tabular-nums">{(viewingCustomer.total_profit || 0).toFixed(2)}</div>
                                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Total Dépensé (MAD)</div>
                                </div>
                            </div>

                            {/* Orders History */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Historique des Commandes</h4>
                                {customerOrders.length === 0 ? (
                                    <div className="text-center py-10 text-white/20 text-sm font-bold uppercase tracking-widest">Aucune commande</div>
                                ) : (
                                    <div className="space-y-2">
                                        {customerOrders.slice(0, 10).map((order: any) => (
                                            <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm text-white truncate">{order.service?.title || `Service #${order.service_id}`}</div>
                                                    <div className="text-[10px] text-white/30 font-medium mt-0.5">
                                                        {new Date(order.created_at).toLocaleDateString('fr-FR')} · Qté: {order.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4 shrink-0">
                                                    <span className="font-black text-sm text-emerald-400 tabular-nums">{(order.price || 0).toFixed(2)} MAD</span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                        order.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                                                            order.status === 'cancelled' ? "bg-red-500/10 text-red-400" :
                                                                order.status === 'processing' ? "bg-blue-500/10 text-blue-400" :
                                                                    "bg-amber-500/10 text-amber-400"
                                                    )}>
                                                        {order.status === 'completed' ? 'Confirmée' :
                                                            order.status === 'cancelled' ? 'Annulée' :
                                                                order.status === 'processing' ? 'En cours' : 'En attente'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions Footer */}
                            <div className="p-6 border-t border-white/5 flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={() => {
                                        handleToggleUserActive(viewingCustomer.id);
                                        setViewingCustomer((prev: any) => ({ ...prev, is_active: !prev.is_active }));
                                    }}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                        viewingCustomer.is_active
                                            ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                                    )}
                                >
                                    {viewingCustomer.is_active ? '🔒 Désactiver' : '✅ Activer'}
                                </button>
                                <button
                                    onClick={() => {
                                        handleSetRole(viewingCustomer.id, viewingCustomer.role === 'management' ? 'user' : 'management');
                                        setViewingCustomer(null);
                                    }}
                                    className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all"
                                >
                                    {viewingCustomer.role === 'management' ? '👤 Rétrograder' : '⭐ Promouvoir Manager'}
                                </button>
                                <button
                                    onClick={() => setViewingCustomer(null)}
                                    className="ml-auto px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Transfer Funds Modal */}
            <AnimatePresence>
                {showTransferFunds && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowTransferFunds(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl w-full max-w-sm relative"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Virement de Fonds</h3>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-tight mb-8">Envoyer de l'argent vers le wallet de {showTransferFunds.name}</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Montant à transférer (MAD)</label>
                                    <div className="relative">
                                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                        <input
                                            type="number"
                                            value={transferAmount}
                                            onChange={e => setTransferAmount(e.target.value)}
                                            className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl pl-12 pr-4 py-4 text-white text-2xl font-black focus:outline-none focus:border-emerald-500"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase font-bold tracking-widest leading-relaxed">
                                    ℹ️ Ce montant sera immédiatement ajouté au solde du manager. Cette action est irréversible.
                                </div>

                                <button
                                    onClick={handleTransferFunds}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Confirmer le Virement
                                </button>
                            </div>

                            <button
                                onClick={() => setShowTransferFunds(null)}
                                className="absolute top-4 right-4 p-2 text-white/20 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-black border-r border-white/10 z-[70] lg:hidden"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div >
    );
}


