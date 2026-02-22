import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from '@/components/ui/banner';
import {
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    TrendingUp,
    X,
    CreditCard as BillingIcon,
    ShoppingBag,
    Bell,
    UserCircle,
    Search,
    ShieldCheck,
    ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedMenuButton } from '@/components/ui/animated-menu-button';
import { ProfileCard } from '@/components/ui/profile-card';
import { RevenueBarChart, UserActivityAreaChart } from '@/components/ui/analytics-charts';
import { ServicesCatalog } from '@/components/sections/services';
import { BillingView, type BillingData } from '@/components/sections/billing';
import { OrdersView } from '@/components/sections/orders';
import { SettingsView } from '@/components/sections/settings';
import { DashboardCalendar } from '@/components/ui/dashboard-calendar';
import { NotificationCenter } from '@/components/ui/notification-center';

interface Order {
    name: string;
    date: string;
    amount: string;
    status: string;
    color: string;
    bg: string;
    cost: number;
    profit: number;
}

interface DashboardData {
    balance: string;
    orderCount: string;
    completedCount: string;
    cancelledCount: string;
    affiliateEarnings: string;
    openSupportTickets: string;
    orders: Order[];
    billing: BillingData;
    revenueData: { month: string; revenue: number; profit: number }[];
    activityData: { time: string; users: number }[];
    notifications: {
        id: string;
        title: string;
        message: string;
        time: string;
        type: 'order' | 'payment' | 'system' | 'info';
        unread: boolean;
    }[];
}

interface DashboardProps {
    onLogout: () => void;
    t: (key: any) => string;
    user?: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        country: string;
        agencyName: string;
        role?: 'admin' | 'user' | 'management';
        is_active?: boolean;
    };
    onUpdateUser: (data: any) => void;
    dashboardData: DashboardData;
    refreshData?: () => void;
    onOpenAdmin?: () => void;
    onCreateOrder?: (order: { name: string; amount: string; cost: number; profit?: number }) => void;
    formatPrice: (amount: number | string) => string;
    currency: string;
    currencyRate: number;
}

export function Dashboard({ onLogout, t, user, onUpdateUser, dashboardData, refreshData, onCreateOrder, formatPrice, onOpenAdmin, currency, currencyRate }: DashboardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    const totalProfit = useMemo(() => {
        if (!dashboardData?.revenueData || !Array.isArray(dashboardData.revenueData)) return 0;
        return dashboardData.revenueData.reduce((acc, curr) => acc + (curr?.profit || 0), 0);
    }, [dashboardData]);

    const stats = [
        { label: "Bénéfice Net", value: formatPrice(totalProfit), icon: TrendingUp, color: "text-gold-400" },
        { label: "Support", value: dashboardData.openSupportTickets, icon: Users, color: "text-purple-400" },
    ];

    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "#" },
        { label: "Orders", icon: ClipboardList, href: "#" },
        { label: "Services", icon: ShoppingBag, href: "#" },
        { label: "Billing", icon: BillingIcon, href: "#" },
        { label: "Settings", icon: Settings, href: "#" },
        { label: "Profile", icon: UserCircle, href: "#" },
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className={cn("flex flex-col h-full", isMobile ? "pt-8 px-6" : "p-6")}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                        <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-tight">
                        SMMADROOP
                    </span>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40"
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
                                ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                : "hover:bg-foreground/5 text-muted hover:text-foreground border border-transparent"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.label ? "text-primary-400" : "text-foreground/40")} />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="pt-4 mt-4 border-t border-foreground/5 space-y-2">
                {(user?.role === 'admin' || user?.role === 'management') && (
                    <button
                        onClick={() => {
                            if (user?.role === 'admin') {
                                (window as any).toggleManagerView?.();
                                onOpenAdmin?.();
                            } else {
                                // For management role, it should already be showing ManagerDashboard
                                // but this adds consistency.
                            }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all font-bold uppercase tracking-wider text-xs mb-2 group"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Management
                    </button>
                )}
                {onOpenAdmin && (
                    <button
                        onClick={onOpenAdmin}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold uppercase tracking-wider text-xs mb-2"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Admin Panel
                    </button>
                )}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 text-red-500/60 hover:text-red-400 transition-all font-bold uppercase tracking-wider text-xs"
                >
                    <LogOut className="w-5 h-5" />
                    {t('logout') || 'Déconnexion'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <Banner
                id="dashboard-welcome"
                variant="rainbow"
                message={`🎉 Bienvenue ${user?.agencyName ? `chez ${user.agencyName}` : 'sur SMMADROOP'} ! Profitez de -20% sur votre prochaine commande avec le code SMMA20.`}
                height="2.5rem"
            />

            <div className="flex flex-grow relative">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 border-r border-foreground/5 bg-foreground/[0.02] backdrop-blur-xl sticky h-[calc(100vh-var(--banner-height,0px))] top-[var(--banner-height,0px)] overflow-y-auto">
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
                                {/* Mobile Menu Button */}
                                <div className="lg:hidden">
                                    <AnimatedMenuButton
                                        isOpen={isMenuOpen}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    />
                                </div>
                                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] font-bold uppercase tracking-widest text-foreground/40 group hover:border-primary-500/30 transition-all cursor-pointer">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    System Online
                                </div>

                                {/* Search Bar */}
                                <div className="hidden md:flex items-center relative group ml-4">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-foreground/20 group-focus-within:text-primary-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Rechercher un service, une commande..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full md:w-80 bg-foreground/5 border border-foreground/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all backdrop-blur-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-foreground/20 bg-foreground/5 px-1.5 py-0.5 rounded border border-foreground/10 uppercase">ESC</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4 relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={cn(
                                        "p-2 rounded-full transition-all relative group",
                                        showNotifications ? "bg-primary-500/10 text-primary-400" : "hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
                                    )}
                                >
                                    <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border border-background group-hover:scale-110 transition-transform" />
                                </button>

                                <NotificationCenter
                                    isOpen={showNotifications}
                                    onClose={() => setShowNotifications(false)}
                                    notifications={dashboardData.notifications || []}
                                />

                                <div className="h-8 w-px bg-foreground/5 mx-2 hidden sm:block" />

                                {/* User Profile Trigger */}
                                <button
                                    onClick={() => setActiveTab('Profile')}
                                    className={cn(
                                        "flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl transition-all",
                                        activeTab === 'Profile' ? "bg-primary-500/10 border border-primary-500/20" : "hover:bg-foreground/5 border border-transparent"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm overflow-hidden">
                                        <img src="https://i.ibb.co/Kc3MTRNm/caarton-character.png" alt="JD" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <div className="text-xs font-bold text-foreground uppercase tracking-tight">
                                            {user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                                        </div>
                                        <div className="text-[10px] text-foreground/40 font-medium">Pro Member</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full">

                        {activeTab === 'Profile' ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-8"
                            >
                                <ProfileCard
                                    name={user?.firstName ? `${user.firstName} ${user.lastName}` : undefined}
                                    title={user?.agencyName || undefined}
                                />
                            </motion.div>
                        ) : activeTab === 'Services' ? (
                            <motion.div
                                key="services"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-8"
                            >
                                <ServicesCatalog
                                    searchQuery={searchQuery}
                                    onRefresh={refreshData}
                                    onCreateOrder={onCreateOrder}
                                    formatPrice={formatPrice}
                                    currency={currency}
                                    currencyRate={currencyRate}
                                />
                            </motion.div>
                        ) : activeTab === 'Billing' ? (
                            <motion.div
                                key="billing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-8"
                            >
                                <BillingView billingData={dashboardData.billing} onRefresh={refreshData} formatPrice={formatPrice} netProfit={totalProfit} />
                            </motion.div>
                        ) : activeTab === 'Orders' ? (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-8"
                            >
                                <OrdersView orders={dashboardData.orders} formatPrice={formatPrice} />
                            </motion.div>
                        ) : activeTab === 'Settings' ? (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-8"
                            >
                                <SettingsView initialData={user} onUpdate={onUpdateUser} />
                            </motion.div>
                        ) : (
                            <>
                                <header className="mb-12">
                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2"
                                    >
                                        {activeTab}
                                    </motion.h1>
                                    <p className="text-muted font-medium italic">
                                        {activeTab === 'Dashboard'
                                            ? "Analysez vos performances et optimisez votre croissance SMMA."
                                            : `Gérez vos ${activeTab.toLowerCase()} en toute simplicité.`}
                                    </p>
                                </header>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    {/* Custom Commandes Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0 }}
                                        className="p-6 rounded-3xl glass-dark border border-foreground/5 hover:border-blue-500/30 transition-all group bg-foreground/[0.02]"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-2xl bg-foreground/5 group-hover:scale-110 transition-transform text-blue-400">
                                                <LayoutDashboard className="w-6 h-6" />
                                            </div>
                                            <span className="text-muted text-sm font-bold uppercase tracking-widest">Commandes</span>
                                        </div>
                                        <div className="text-3xl font-black tabular-nums mb-4">{dashboardData.orderCount}</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Confirmées</span>
                                                </div>
                                                <span className="text-emerald-400 font-black text-sm tabular-nums">{dashboardData.completedCount ?? '0'}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Annulées</span>
                                                </div>
                                                <span className="text-red-400 font-black text-sm tabular-nums">{dashboardData.cancelledCount ?? '0'}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Remaining Generic Stats */}
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (i + 1) * 0.1 }}
                                            className="p-6 rounded-3xl glass-dark border border-foreground/5 hover:border-primary-500/30 transition-all group bg-foreground/[0.02]"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={cn("p-3 rounded-2xl bg-foreground/5 group-hover:scale-110 transition-transform", stat.color)}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-muted text-sm font-bold uppercase tracking-widest">{stat.label}</span>
                                            </div>
                                            <div className="text-3xl font-black tabular-nums">{stat.value}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Main Analytics Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-8 rounded-[40px] glass-dark border border-foreground/5 bg-foreground/[0.02]"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">Croissance des Revenus</h2>
                                                <p className="text-xs text-muted font-medium">Flux mensuel du chiffre d'affaires</p>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-purple-500/10">
                                                <TrendingUp className="w-6 h-6 text-purple-400" />
                                            </div>
                                        </div>
                                        <RevenueBarChart data={dashboardData.revenueData} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="p-8 rounded-[40px] glass-dark border border-foreground/5 bg-foreground/[0.02]"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">Activité en Temps Réel</h2>
                                                <p className="text-xs text-muted font-medium">Session utilisateurs (dernières 24h)</p>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-emerald-500/10">
                                                <Users className="w-6 h-6 text-emerald-400" />
                                            </div>
                                        </div>
                                        <UserActivityAreaChart data={dashboardData.activityData} />
                                    </motion.div>
                                </div>

                                {/* Order History Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2">
                                        <div className="p-8 rounded-[40px] glass-dark border border-foreground/5 min-h-[300px] bg-foreground/[0.02]">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Historique des Commandes</h3>
                                                    <p className="text-xs text-muted font-medium">Vos 5 activités les plus récentes</p>
                                                </div>
                                                <button className="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors">
                                                    Tout voir
                                                </button>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-foreground/10">
                                                            <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Service</th>
                                                            <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Date</th>
                                                            <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Montant</th>
                                                            <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-foreground/20">Statut</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-foreground/5">
                                                        {dashboardData.orders.map((order, i) => (
                                                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                                                <td className="py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                                                                            <ShoppingBag className="w-4 h-4 text-foreground/40 group-hover:text-primary-400 transition-colors" />
                                                                        </div>
                                                                        <span className="text-sm font-bold text-foreground/80">{order.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 text-xs font-medium text-muted">{order.date}</td>
                                                                <td className="py-4 text-sm font-black text-foreground">{formatPrice(order.cost)}</td>
                                                                <td className="py-4 text-right">
                                                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", order.bg, order.color)}>
                                                                        {order.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[40px] glass-dark border border-foreground/5 flex flex-col h-full min-h-[350px] bg-foreground/[0.02]">
                                        <DashboardCalendar />
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar Navigation */}
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
                            className="fixed left-0 top-0 bottom-0 w-72 bg-background border-r border-foreground/10 z-[70] lg:hidden"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
