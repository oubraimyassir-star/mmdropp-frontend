import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, LogOut, CheckCircle2, XCircle, MoreHorizontal, X, Users, Wallet, TrendingUp, TrendingDown, BarChart3, Activity, PackageCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';

export function ManagerDashboard({ onLogout, user }: { onLogout: () => void, user: any }) {
    const [activeTab, setActiveTab] = useState('Orders');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Orders state
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [orderFilter, setOrderFilter] = useState<string>('all');

    // Clients state
    const [clientsList, setClientsList] = useState<any[]>([]);
    const [walletClient, setWalletClient] = useState<any>(null);
    const [walletAmount, setWalletAmount] = useState('');
    const [walletOperation, setWalletOperation] = useState<'credit' | 'debit'>('credit');
    const [walletNote, setWalletNote] = useState('');
    const [isWalletLoading, setIsWalletLoading] = useState(false);

    // Services state
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [isServicesLoading, setIsServicesLoading] = useState(false);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<any>(null);
    const [serviceToDelete, setServiceToDelete] = useState<any>(null);
    const [managementStats, setManagementStats] = useState<any>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        title: '',
        description: '',
        price: '',
        cost: '',
        category: '',
        platform: '',
        unit: '1000',
        min_quantity: 100,
        max_quantity: 10000,
        is_active: true
    });

    useEffect(() => {
        // Always load orders and clients on mount
        fetchOrders();
        fetchClients();
    }, []);

    useEffect(() => {
        if (activeTab === 'Orders') fetchOrders();
        if (activeTab === 'Clients') fetchClients();
        if (activeTab === 'Services') fetchServices();
        if (activeTab === 'Stats') fetchManagementStats();
    }, [activeTab]);


    const getHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
    });

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            if (res.ok) setOrdersList(await res.json());
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    const fetchManagementStats = async () => {
        setIsStatsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/management/stats`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            if (res.ok) setManagementStats(await res.json());
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setIsStatsLoading(false);
        }
    };

    const [isClientsLoading, setIsClientsLoading] = useState(false);

    const fetchClients = async () => {
        setIsClientsLoading(true);
        const token = localStorage.getItem('auth_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            // Try management endpoint first (requires backend restart)
            let res = await fetch(`${API_BASE_URL}/management/clients`, { headers });
            if (!res.ok) {
                // Fallback: try admin/users (works if user is admin)
                res = await fetch(`${API_BASE_URL}/admin/users`, { headers });
            }
            if (res.ok) {
                const data = await res.json();
                // Filter out admins and managers — keep only regular clients
                setClientsList(data.filter((u: any) => u.role === 'user' || !u.role));
            }
        } catch (error) {
            console.error("Failed to fetch clients", error);
        } finally {
            setIsClientsLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleToggleActive = async (clientId: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users/${clientId}/toggle-active`, {
                method: 'POST',
                headers: getHeaders()
            });
            if (res.ok) {
                const updated = await res.json();
                setClientsList(prev => prev.map(c => c.id === clientId ? { ...c, is_active: updated.is_active } : c));
            }
        } catch (error) {
            console.error("Failed to toggle activation", error);
        }
    };

    const fetchServices = async () => {
        setIsServicesLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/management/services`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            if (res.ok) setServicesList(await res.json());
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setIsServicesLoading(false);
        }
    };

    const handleSaveService = async () => {
        const payload = {
            ...serviceForm,
            price: parseFloat(serviceForm.price.toString()),
            cost: parseFloat(serviceForm.cost.toString()),
            min_quantity: parseInt(serviceForm.min_quantity.toString()),
            max_quantity: parseInt(serviceForm.max_quantity.toString())
        };

        try {
            const url = serviceToEdit
                ? `${API_BASE_URL}/management/services/${serviceToEdit.id}`
                : `${API_BASE_URL}/management/services`;
            const method = serviceToEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchServices();
                setServiceModalOpen(false);
                setServiceToEdit(null);
            } else {
                const err = await res.json();
                alert(`Erreur: ${err.detail}`);
            }
        } catch (error) {
            console.error("Failed to save service", error);
        }
    };

    const handleDeleteService = async () => {
        if (!serviceToDelete) return;
        try {
            const res = await fetch(`${API_BASE_URL}/management/services/${serviceToDelete.id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) {
                fetchServices();
                setServiceToDelete(null);
            } else {
                const err = await res.json();
                alert(`Erreur: ${err.detail}`);
            }
        } catch (error) {
            console.error("Failed to delete service", error);
        }
    };

    const handleWalletOperation = async () => {
        if (!walletClient || !walletAmount || parseFloat(walletAmount) <= 0) return;
        setIsWalletLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/management/clients/${walletClient.id}/wallet`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    amount: parseFloat(walletAmount),
                    operation: walletOperation,
                    note: walletNote || undefined
                })
            });
            if (res.ok) {
                const data = await res.json();
                setClientsList(prev => prev.map(c => c.id === walletClient.id ? { ...c, balance: data.new_balance } : c));
                setWalletClient(null);
                setWalletAmount('');
                setWalletNote('');
            } else {
                const err = await res.json();
                alert(`Erreur: ${err.detail}`);
            }
        } catch (error) {
            console.error("Wallet operation failed", error);
        } finally {
            setIsWalletLoading(false);
        }
    };

    const menuItems = [
        { label: "Orders", icon: ShoppingBag },
        { label: "Clients", icon: Users },
        { label: "Services", icon: PackageCheck },
        { label: "Stats", icon: BarChart3 },
    ];

    const statusLabel = (status: string) => {
        if (status === 'completed') return 'Confirmée';
        if (status === 'cancelled') return 'Annulée';
        if (status === 'processing') return 'En cours';
        return 'En attente';
    };

    const statusClass = (status: string) => {
        if (status === 'completed') return 'bg-emerald-500/10 text-emerald-400';
        if (status === 'cancelled') return 'bg-red-500/10 text-red-500';
        if (status === 'processing') return 'bg-blue-500/10 text-blue-400';
        return 'bg-amber-500/10 text-amber-400';
    };

    function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
        return (
            <div className={cn("flex flex-col h-full", isMobile ? "pt-8 px-6" : "p-6")}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <ShoppingBag className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-lg font-black uppercase tracking-tight text-foreground/80">MANAGEMENT</span>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="space-y-2 flex-grow">
                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => { setActiveTab(item.label); if (isMobile) setIsMenuOpen(false); }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase tracking-wider text-xs text-left",
                                activeTab === item.label
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "hover:bg-foreground/5 text-muted hover:text-foreground border border-transparent"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.label ? "text-blue-400" : "text-foreground/40")} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="border-t border-foreground/5 pt-4">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Déconnexion</span>
                    </button>
                </div>
            </div>
        );
    }

    const filteredOrders = orderFilter === 'all' ? ordersList : ordersList.filter(o => o.status === orderFilter);
    const filterTabs = [
        { key: 'all', label: 'Tous', count: ordersList.length },
        { key: 'pending', label: 'En attente', count: ordersList.filter(o => o.status === 'pending').length },
        { key: 'processing', label: 'En cours', count: ordersList.filter(o => o.status === 'processing').length },
        { key: 'completed', label: 'Confirmées', count: ordersList.filter(o => o.status === 'completed').length },
        { key: 'cancelled', label: 'Annulées', count: ordersList.filter(o => o.status === 'cancelled').length },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-72 bg-background border-r border-foreground/5 flex-col sticky top-0 h-screen">
                    <SidebarContent />
                </aside>

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] lg:hidden">
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-foreground/5">
                                <SidebarContent isMobile />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex-grow flex flex-col">
                    {/* Top Header */}
                    <nav className="h-20 border-b border-foreground/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
                        <div className="h-full px-6 lg:px-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="lg:hidden">
                                    <button onClick={() => setIsMenuOpen(true)} className="p-2 text-foreground/60 hover:text-foreground">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold uppercase tracking-widest text-blue-400/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    Manager Access
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-foreground/5 border border-foreground/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                        {user?.name?.charAt(0) || 'M'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <div className="text-xs font-bold text-foreground uppercase tracking-tight">{user?.name || 'Manager'}</div>
                                        <div className="text-[10px] text-emerald-400 font-black tabular-nums">{user?.balance?.toFixed(2)} MAD</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full">
                        <header className="mb-10">
                            <motion.h1
                                key={activeTab}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2"
                            >
                                {activeTab === 'Orders' ? 'Commandes' : activeTab === 'Clients' ? 'Clients' : activeTab === 'Services' ? 'Services' : 'Statistiques'}
                            </motion.h1>
                            <p className="text-muted font-medium italic">
                                {activeTab === 'Orders' ? 'Confirmez ou annulez les commandes clients.' :
                                    activeTab === 'Clients' ? 'Gérez les comptes clients et leurs wallets.' :
                                        activeTab === 'Services' ? 'Consultez les services et modifiez les prix.' :
                                            'Vue d\'ensemble de votre activité.'}
                            </p>
                        </header>

                        {/* ─── ORDERS TAB ─── */}
                        {activeTab === 'Orders' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                {/* Filter bar */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {filterTabs.map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setOrderFilter(tab.key)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                                                orderFilter === tab.key
                                                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                                                    : "bg-foreground/5 border-foreground/10 text-muted hover:text-foreground hover:bg-foreground/10"
                                            )}
                                        >
                                            {tab.label}
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded-full text-[9px] font-black",
                                                orderFilter === tab.key ? "bg-blue-500/30 text-blue-300" : "bg-foreground/10 text-muted"
                                            )}>{tab.count}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={fetchOrders}
                                        className="ml-auto p-2 rounded-xl bg-foreground/5 border border-foreground/10 text-muted hover:text-foreground hover:bg-foreground/10 transition-all"
                                        title="Actualiser"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="p-6 rounded-[32px] glass-dark border border-foreground/5 overflow-x-auto bg-foreground/[0.02]">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-foreground/5">
                                                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Client</th>
                                                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Service</th>
                                                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Qté</th>
                                                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Date</th>
                                                <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-foreground/5">
                                            {filteredOrders.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-12 text-center text-foreground/20 text-sm font-bold uppercase tracking-widest">
                                                        Aucune commande
                                                    </td>
                                                </tr>
                                            )}
                                            {filteredOrders.map((order) => (
                                                <tr key={order.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="text-foreground font-bold text-xs">{order.customer_name || order.owner?.name}</div>
                                                    </td>
                                                    <td className="py-4 px-4 text-muted text-xs">{order.service?.title || `Service #${order.service_id}`}</td>
                                                    <td className="py-4 px-4 font-bold text-xs">{order.quantity}</td>
                                                    <td className="py-4 px-4 text-[10px] text-muted font-medium">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 flex-wrap">
                                                            {/* Pending: Confirm + Cancel */}
                                                            {order.status === 'pending' && (<>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1"
                                                                >
                                                                    <CheckCircle2 className="w-3 h-3" /> Confirmer
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-red-500/20 flex items-center gap-1"
                                                                >
                                                                    <XCircle className="w-3 h-3" /> Annuler
                                                                </button>
                                                            </>)}
                                                            {/* Processing: Confirm + Cancel */}
                                                            {order.status === 'processing' && (<>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1"
                                                                >
                                                                    <CheckCircle2 className="w-3 h-3" /> Confirmer
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-red-500/20 flex items-center gap-1"
                                                                >
                                                                    <XCircle className="w-3 h-3" /> Annuler
                                                                </button>
                                                            </>)}
                                                            {/* Completed/Cancelled: Réouvrir */}
                                                            {(order.status === 'completed' || order.status === 'cancelled') && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order.id, 'pending')}
                                                                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 flex items-center gap-1"
                                                                >
                                                                    ↩ Réouvrir
                                                                </button>
                                                            )}
                                                            <span className={cn("ml-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", statusClass(order.status))}>
                                                                {statusLabel(order.status)}
                                                            </span>
                                                            <button
                                                                onClick={() => setViewingOrder(order)}
                                                                className="p-1.5 rounded-lg hover:bg-foreground/10 text-muted hover:text-foreground transition-all"
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── CLIENTS TAB ─── */}
                        {activeTab === 'Clients' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                            <Users className="w-7 h-7 text-blue-400" /> Clients
                                        </h2>
                                        <p className="text-white/30 text-sm mt-1">
                                            {clientsList.length} client{clientsList.length > 1 ? 's' : ''} · Gérez les comptes clients et leurs wallets.
                                        </p>
                                    </div>
                                    <button
                                        onClick={fetchClients}
                                        disabled={isClientsLoading}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-muted hover:text-foreground font-black rounded-xl uppercase tracking-widest text-[10px] transition-all disabled:opacity-50"
                                    >
                                        <RefreshCw className={cn("w-4 h-4", isClientsLoading && "animate-spin")} />
                                        {isClientsLoading ? 'Chargement...' : 'Actualiser'}
                                    </button>
                                </div>

                                <div className="p-0 rounded-[32px] glass-dark border border-foreground/5 overflow-x-auto bg-foreground/[0.02]">
                                    {isClientsLoading && clientsList.length === 0 ? (
                                        <div className="py-20 text-center text-muted">
                                            <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-3 opacity-40" />
                                            <p className="text-sm italic">Chargement des clients...</p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-foreground/5">
                                                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Client</th>
                                                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Email</th>
                                                    <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Solde Wallet</th>
                                                    <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Statut</th>
                                                    <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {clientsList.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="py-12 text-center text-foreground/20 text-sm font-bold uppercase tracking-widest">Aucun client</td>
                                                    </tr>
                                                )}
                                                {clientsList.map((client) => (
                                                    <tr key={client.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                                    {client.name?.charAt(0) || '?'}
                                                                </div>
                                                                <span className="font-bold text-sm text-foreground">{client.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-muted text-xs">{client.email}</td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className="font-black text-sm text-emerald-400 tabular-nums">{(client.balance || 0).toFixed(2)} MAD</span>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", client.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                                                                {client.is_active ? 'Actif' : 'Inactif'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => { setWalletClient(client); setWalletOperation('credit'); }}
                                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1"
                                                                >
                                                                    <Wallet className="w-3 h-3" /> Wallet
                                                                </button>
                                                                <button
                                                                    onClick={() => handleToggleActive(client.id)}
                                                                    className={cn(
                                                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                                        client.is_active
                                                                            ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                                                                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                                                                    )}
                                                                >
                                                                    {client.is_active ? 'Désactiver' : 'Activer'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── SERVICES TAB ─── */}
                        {activeTab === 'Services' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                            <PackageCheck className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Gestion des Services</h2>
                                            <p className="text-[11px] text-muted font-bold">Consultez, ajoutez ou modifiez les services du catalogue.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setServiceToEdit(null);
                                            setServiceForm({
                                                title: '', description: '', price: '', cost: '', category: '', platform: '',
                                                unit: '1000', min_quantity: 100, max_quantity: 10000, is_active: true
                                            });
                                            setServiceModalOpen(true);
                                        }}
                                        className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        Ajouter un Service
                                    </button>
                                </div>

                                <div className="p-0 rounded-[32px] glass-dark border border-foreground/5 overflow-x-auto bg-foreground/[0.02]">
                                    {isServicesLoading && servicesList.length === 0 ? (
                                        <div className="py-20 text-center text-muted">
                                            <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-3 opacity-40" />
                                            <p className="text-sm italic">Chargement des services...</p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-foreground/5">
                                                    <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/20">Service</th>
                                                    <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Catégorie</th>
                                                    <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Coût</th>
                                                    <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Prix Vente</th>
                                                    <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/20">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {servicesList.length === 0 && !isServicesLoading && (
                                                    <tr>
                                                        <td colSpan={5} className="py-20 text-center text-foreground/20 italic text-sm">Aucun service trouvé.</td>
                                                    </tr>
                                                )}
                                                {servicesList.map(service => (
                                                    <tr key={service.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                                        <td className="py-4 px-6">
                                                            <div className="text-sm font-bold text-foreground mb-0.5">{service.title}</div>
                                                            <div className="text-[10px] text-muted font-medium truncate max-w-[200px]">{service.description}</div>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className="px-2 py-1 rounded-lg bg-foreground/5 border border-foreground/10 text-[9px] font-black uppercase tracking-widest text-muted">
                                                                {service.category}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-center text-xs font-bold text-blue-400/80">{service.cost?.toFixed(2)} MAD</td>
                                                        <td className="py-4 px-4 text-center text-sm font-black text-emerald-400">{service.price?.toFixed(2)} MAD</td>
                                                        <td className="py-4 px-6 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setServiceToEdit(service);
                                                                        setServiceForm({ ...service });
                                                                        setServiceModalOpen(true);
                                                                    }}
                                                                    className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Activity className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setServiceToDelete(service)}
                                                                    className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── STATS TAB ─── */}
                        {activeTab === 'Stats' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                {/* Financial KPIs */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <BarChart3 className="w-5 h-5 text-blue-400" />
                                        <h2 className="text-sm font-black uppercase tracking-widest text-muted">Performance Financière</h2>
                                    </div>

                                    {isStatsLoading && !managementStats ? (
                                        <div className="py-20 text-center text-muted italic text-sm">Chargement des rapports financiers...</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Revenue Card */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-8 rounded-[32px] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 relative group overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-all">
                                                    <TrendingUp className="w-20 h-20 text-blue-400" />
                                                </div>
                                                <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Chiffre d'Affaire (CA)</div>
                                                <div className="text-4xl font-black text-foreground tabular-nums">
                                                    {managementStats?.revenue?.toFixed(2) || '0.00'} <span className="text-xl">MAD</span>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                                    <Activity className="w-3 h-3" /> Revenu Total Brut
                                                </div>
                                            </motion.div>

                                            {/* Cost Card */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-8 rounded-[32px] bg-gradient-to-br from-red-600/10 to-transparent border border-red-500/20 relative group overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-all">
                                                    <TrendingDown className="w-20 h-20 text-red-500" />
                                                </div>
                                                <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Coûts Totaux</div>
                                                <div className="text-4xl font-black text-red-400 tabular-nums">
                                                    {managementStats?.cost?.toFixed(2) || '0.00'} <span className="text-xl">MAD</span>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-red-400/60 uppercase tracking-wider">
                                                    <ShoppingBag className="w-3 h-3" /> Dépenses Fournisseurs
                                                </div>
                                            </motion.div>

                                            {/* Profit Card */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-8 rounded-[32px] bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20 relative group overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-all">
                                                    <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                                                </div>
                                                <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Profit Net</div>
                                                <div className="text-4xl font-black text-emerald-400 tabular-nums">
                                                    {managementStats?.profit?.toFixed(2) || '0.00'} <span className="text-xl">MAD</span>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                                    <TrendingUp className="w-3 h-3" /> Bénéfice Réalisé
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>

                                {/* Platform Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Stats Grid */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-foreground/20" />
                                            <h2 className="text-xs font-black uppercase tracking-widest text-muted">Vue d'ensemble</h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Commandes', value: managementStats?.order_count || 0, icon: PackageCheck, color: 'text-blue-400' },
                                                { label: 'Clients', value: managementStats?.client_count || 0, icon: Users, color: 'text-pink-400' },
                                                { label: 'Services Actifs', value: managementStats?.active_services || 0, icon: Activity, color: 'text-amber-400' },
                                                { label: 'Taux Succès', value: managementStats?.order_count > 0 ? '94%' : '0%', icon: CheckCircle2, color: 'text-emerald-400' },
                                            ].map((item, i) => (
                                                <div key={i} className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 flex items-center justify-between group hover:bg-foreground/[0.07] transition-all">
                                                    <div>
                                                        <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">{item.label}</div>
                                                        <div className={cn("text-2xl font-black tabular-nums", item.color)}>{item.value}</div>
                                                    </div>
                                                    <item.icon className={cn("w-6 h-6 opacity-20 group-hover:opacity-40 transition-all", item.color)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity Mini-chart placeholder */}
                                    <div className="p-8 rounded-[32px] bg-foreground/5 border border-foreground/10 flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-muted">Santé du Système</h3>
                                                <p className="text-[10px] text-muted font-bold mt-1 uppercase">Opérationnel · API Latency: 24ms</p>
                                            </div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/20" />
                                        </div>
                                        <div className="flex items-end justify-between gap-1 h-32">
                                            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 60, 95, 80].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="flex-1 bg-blue-500/20 rounded-t-lg group relative"
                                                >
                                                    <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-all rounded-t-lg" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {viewingOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setViewingOrder(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-background border border-foreground/10 p-8 rounded-[32px] w-full max-w-lg relative"
                        >
                            <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Détails Commande #{viewingOrder.id}</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                                    <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-2">Lien Cible</div>
                                    <a href={viewingOrder.link} target="_blank" className="text-blue-400 text-sm break-all font-bold hover:underline">{viewingOrder.link}</a>
                                </div>
                                <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">Service</div>
                                        <div className="text-sm font-bold text-foreground">{viewingOrder.service?.title}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">Quantité</div>
                                        <div className="text-sm font-bold text-foreground tabular-nums">{viewingOrder.quantity}</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                                    <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-2">Statut</div>
                                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", statusClass(viewingOrder.status))}>
                                        {statusLabel(viewingOrder.status)}
                                    </span>
                                </div>
                                {/* Quick actions in modal */}
                                {(viewingOrder.status === 'pending' || viewingOrder.status === 'processing') && (
                                    <div className="flex gap-3">
                                        <button onClick={() => { handleUpdateStatus(viewingOrder.id, 'completed'); setViewingOrder(null); }} className="flex-1 py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Confirmer
                                        </button>
                                        <button onClick={() => { handleUpdateStatus(viewingOrder.id, 'cancelled'); setViewingOrder(null); }} className="flex-1 py-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <XCircle className="w-4 h-4" /> Annuler
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setViewingOrder(null)} className="mt-6 w-full py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 transition-all text-muted hover:text-foreground">Fermer</button>
                            <button onClick={() => setViewingOrder(null)} className="absolute top-6 right-6 text-foreground/20 hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Wallet Modal */}
            <AnimatePresence>
                {walletClient && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setWalletClient(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-background border border-foreground/10 p-8 rounded-[32px] w-full max-w-md relative"
                        >
                            <button onClick={() => setWalletClient(null)} className="absolute top-6 right-6 text-foreground/20 hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Gestion Wallet</h3>
                                    <p className="text-[11px] text-muted font-bold">{walletClient.name} — Solde : <span className="text-emerald-400">{(walletClient.balance || 0).toFixed(2)} MAD</span></p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button onClick={() => setWalletOperation('credit')} className={cn("flex items-center justify-center gap-2 py-3 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all", walletOperation === 'credit' ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-foreground/5 border-foreground/10 text-muted hover:text-foreground")} >
                                    <TrendingUp className="w-4 h-4" /> Créditer
                                </button>
                                <button onClick={() => setWalletOperation('debit')} className={cn("flex items-center justify-center gap-2 py-3 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all", walletOperation === 'debit' ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-foreground/5 border-foreground/10 text-muted hover:text-foreground")} >
                                    <TrendingDown className="w-4 h-4" /> Débiter
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Montant (MAD)</label>
                                <input type="number" value={walletAmount} onChange={e => setWalletAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground font-bold text-lg tabular-nums focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-foreground/20" />
                            </div>
                            <div className="mb-6">
                                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Note (optionnel)</label>
                                <input type="text" value={walletNote} onChange={e => setWalletNote(e.target.value)} placeholder="Raison de l'opération..." className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-foreground/20" />
                            </div>
                            <button onClick={handleWalletOperation} disabled={isWalletLoading || !walletAmount || parseFloat(walletAmount) <= 0} className={cn("w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all", walletOperation === 'credit' ? "bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-40" : "bg-red-500 hover:bg-red-400 text-white disabled:opacity-40")}>
                                {isWalletLoading ? 'Traitement...' : walletOperation === 'credit' ? `Créditer ${walletAmount || '0'} MAD` : `Débiter ${walletAmount || '0'} MAD`}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Service Modal (Add/Edit) */}
            <AnimatePresence>
                {serviceModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto" onClick={() => setServiceModalOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-background border border-foreground/10 p-8 rounded-[32px] w-full max-w-2xl relative my-8"
                        >
                            <button onClick={() => setServiceModalOpen(false)} className="absolute top-6 right-6 text-foreground/20 hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-6">
                                {serviceToEdit ? 'Modifier le Service' : 'Nouveau Service'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Titre du Service</label>
                                        <input type="text" value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="Ex: Followers Instagram" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-foreground/20" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Description</label>
                                        <textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Détails du service..." className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground text-sm h-32 focus:outline-none focus:border-blue-500/50 transition-all resize-none placeholder:text-foreground/20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Catégorie</label>
                                            <input type="text" value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })} placeholder="Instagram" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-foreground/20" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Plateforme</label>
                                            <input type="text" value={serviceForm.platform} onChange={e => setServiceForm({ ...serviceForm, platform: e.target.value })} placeholder="social" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-foreground/20" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-emerald-400/50 uppercase tracking-widest block mb-2">Prix de Vente</label>
                                            <input type="number" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} placeholder="0.00" className="w-full bg-foreground/5 border border-emerald-500/10 rounded-2xl px-4 py-3 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-emerald-400/20" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest block mb-2">Coût</label>
                                            <input type="number" value={serviceForm.cost} onChange={e => setServiceForm({ ...serviceForm, cost: e.target.value })} placeholder="0.00" className="w-full bg-foreground/5 border border-blue-500/10 rounded-2xl px-4 py-3 text-blue-400 font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-blue-400/20" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Unité</label>
                                            <select value={serviceForm.unit} onChange={e => setServiceForm({ ...serviceForm, unit: e.target.value })} className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                                                <option value="1000">1000</option>
                                                <option value="1">1</option>
                                                <option value="pack">Pack</option>
                                                <option value="mois">Mois</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Actif</label>
                                            <div className="flex items-center h-[50px]">
                                                <button onClick={() => setServiceForm({ ...serviceForm, is_active: !serviceForm.is_active })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", serviceForm.is_active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-red-500/20 text-red-500 border border-red-500/40")}>
                                                    {serviceForm.is_active ? 'Oui' : 'Non'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Min Quantité</label>
                                            <input type="number" value={serviceForm.min_quantity} onChange={e => setServiceForm({ ...serviceForm, min_quantity: parseInt(e.target.value) })} className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Max Quantité</label>
                                            <input type="number" value={serviceForm.max_quantity} onChange={e => setServiceForm({ ...serviceForm, max_quantity: parseInt(e.target.value) })} className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setServiceModalOpen(false)} className="flex-1 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 transition-all text-muted hover:text-foreground">Annuler</button>
                                <button onClick={handleSaveService} className="flex-1 py-4 bg-blue-500 hover:bg-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-lg shadow-blue-500/20">
                                    Enregistrer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Service Confirmation */}
            <AnimatePresence>
                {serviceToDelete && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setServiceToDelete(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-background border border-red-500/20 p-8 rounded-[32px] w-full max-w-sm relative"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-foreground text-center mb-2">Supprimer Service ?</h3>
                            <p className="text-sm text-muted text-center mb-8 italic">Voulez-vous vraiment supprimer "{serviceToDelete.title}" ? Cette action est irréversible.</p>

                            <div className="flex gap-3">
                                <button onClick={() => setServiceToDelete(null)} className="flex-1 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 transition-all text-muted hover:text-foreground">Annuler</button>
                                <button onClick={handleDeleteService} className="flex-1 py-3 bg-red-500 hover:bg-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-lg shadow-red-500/20">Supprimer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

