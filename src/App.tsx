import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  Twitter,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Menu,
  X,
  DollarSign,
  ArrowRight,
  MessageCircle,
  TrendingUp,
  Youtube,
  Facebook,
  Send,
  Globe,
  Video,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from './lib/utils';
import { useTheme } from './lib/theme-context';
import { Component as InfiniteGrid } from './components/ui/the-infinite-grid';
import { GlassmorphismProfileCard } from './components/ui/profile-card-1';
import { TestimonialsSection } from './components/sections/testimonials';
import { LanguageSelector } from './components/sections/language-selector';
import { Dashboard } from './components/sections/dashboard';
import { AdminDashboard } from './components/sections/admin-dashboard';
import { ManagerDashboard } from './components/sections/manager-dashboard';
import { OnboardingFlow } from './components/sections/onboarding';
import { SignInCard } from './components/ui/sign-in-card-2';
import { MaintenancePage } from './components/sections/maintenance-page';
import { DeactivatedPage } from './components/sections/deactivated-page';
import { API_BASE_URL } from './config';

// --- Components ---

const Navbar = ({ onSignIn, onSignUp, lang, onLangChange }: {
  onSignIn: () => void,
  onSignUp: () => void,
  lang: string,
  onLangChange: (val: string) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Simple translation helper for Navbar
  const labels: any = {
    fr: { services: "Services", affiliate: "Affiliation", features: "Fonctionnalités", signin: "Connexion", signup: "Commencer", mobile_signup: "Commencer Maintenant", lang_label: "Langue" },
    en: { services: "Services", affiliate: "Affiliate", features: "Features", signin: "Sign In", signup: "Get Started", mobile_signup: "Get Started Now", lang_label: "Language" },
    es: { services: "Servicios", affiliate: "Afiliación", features: "Funcionalidades", signin: "Iniciar Sesión", signup: "Comenzar", mobile_signup: "Comenzar Ahora", lang_label: "Idioma" },
    ar: { services: "الخدمات", affiliate: "التسويق بالعمولة", features: "المميزات", signin: "تسجيل الدخول", signup: "ابدأ الآن", mobile_signup: "ابدأ الآن", lang_label: "اللغة" }
  };
  const nl = (key: string) => labels[lang as keyof typeof labels][key] || labels['fr'][key];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "glass-dark py-3 border-foreground/5 shadow-lg shadow-black/5" : "bg-transparent py-5 border-transparent"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="SMMADROOP Logo" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-bold tracking-tight">SMMADROOP</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-sm font-medium text-muted hover:text-foreground transition-colors">{nl('services')}</a>
          <a href="#affiliate" className="text-sm font-medium text-muted hover:text-foreground transition-colors">{nl('affiliate')}</a>
          <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">{nl('features')}</a>
          <div className="h-4 w-px bg-foreground/10 mx-2" />
          <LanguageSelector value={lang} onChange={onLangChange} placeholder={nl('lang_label')} />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-foreground/10 transition-all active:scale-90 text-foreground/80 hover:text-foreground"
            title={theme === 'dark' ? "Mode Clair" : "Mode Sombre"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button onClick={onSignIn} className="text-sm font-medium text-muted hover:text-foreground transition-colors">{nl('signin')}</button>
          <button onClick={onSignUp} className="px-6 py-2.5 bg-foreground text-background font-black uppercase tracking-widest rounded-full text-[10px] hover:scale-105 transition-all active:scale-95 shadow-xl shadow-foreground/10">
            {nl('signup')}
          </button>
        </div>

        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-foreground/5 text-foreground/80"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-sm font-medium text-white/40 uppercase tracking-wider">{nl('lang_label')}</span>
                <LanguageSelector value={lang} onChange={onLangChange} placeholder={nl('lang_label')} />
              </div>
              <a href="#services" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>{nl('services')}</a>
              <a href="#affiliate" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>{nl('affiliate')}</a>
              <a href="#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>{nl('features')}</a>
              <button
                onClick={() => { onSignIn(); setMobileMenuOpen(false); }}
                className="text-lg font-medium text-left"
              >
                {nl('signin')}
              </button>
              <button onClick={() => { onSignUp(); setMobileMenuOpen(false); }} className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl text-center">
                {nl('mobile_signup')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Sub Components ---

const CountUp = ({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const handle = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(handle);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(handle);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const FadeIn = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "down" | "left" | "right" | "none" }) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

const FeatureItem = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex gap-4 items-start group"
  >
    <div className="mt-1 w-10 h-10 shrink-0 bg-gold-500/10 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
      <Icon className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
    </div>
    <div>
      <h4 className="font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">{title}</h4>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  </motion.div>
);

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  agencyName: string;
  preferences?: {
    language: string;
    currency: string;
  };
  role?: 'user' | 'admin' | 'management';
  is_active?: boolean;
  onboarding_completed?: boolean;
}

interface UserDashboardData {
  balance: string;
  orderCount: string;
  completedCount: string;
  cancelledCount: string;
  affiliateEarnings: string;
  openSupportTickets: string;
  orders: {
    name: string;
    date: string;
    amount: string;
    status: string;
    color: string;
    bg: string;
    cost: number;
    profit: number;
  }[];
  billing: {
    balance: string;
    transactions: {
      id: string;
      date: string;
      desc: string;
      amount: string;
      status: string;
      type: 'deposit' | 'purchase';
    }[];
  };
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

const DEFAULT_DASHBOARD_DATA: UserDashboardData = {
  balance: "0.00 MAD",
  orderCount: "0",
  completedCount: "0",
  cancelledCount: "0",
  affiliateEarnings: "0.00 MAD",
  openSupportTickets: "0",
  orders: [],
  billing: {
    balance: "0.00 MAD",
    transactions: []
  },
  revenueData: [
    { month: 'Jan', revenue: 0, profit: 0 },
    { month: 'Feb', revenue: 0, profit: 0 },
    { month: 'Mar', revenue: 0, profit: 0 },
    { month: 'Apr', revenue: 0, profit: 0 },
    { month: 'May', revenue: 0, profit: 0 },
    { month: 'Jun', revenue: 0, profit: 0 },
    { month: 'Jul', revenue: 0, profit: 0 },
    { month: 'Aoû', revenue: 0, profit: 0 },
    { month: 'Sep', revenue: 0, profit: 0 },
    { month: 'Oct', revenue: 0, profit: 0 },
    { month: 'Nov', revenue: 0, profit: 0 },
    { month: 'Déc', revenue: 0, profit: 0 },
  ],
  activityData: [
    { time: '00:00', users: 0 },
    { time: '02:00', users: 0 },
    { time: '04:00', users: 0 },
    { time: '06:00', users: 0 },
    { time: '08:00', users: 0 },
    { time: '10:00', users: 0 },
    { time: '12:00', users: 0 },
    { time: '14:00', users: 0 },
    { time: '16:00', users: 0 },
    { time: '18:00', users: 0 },
    { time: '20:00', users: 0 },
    { time: '22:00', users: 0 },
    { time: '23:59', users: 0 },
  ],
  notifications: []
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [lang, setLang] = useState('fr');
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem('user_data');
      return saved ? JSON.parse(saved) : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        agencyName: '',
        preferences: {
          language: 'fr',
          currency: 'eur'
        },
        role: 'user'
      };
    } catch (e) {
      console.error("Error parsing user_data from localStorage", e);
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        agencyName: '',
        preferences: {
          language: 'fr',
          currency: 'eur'
        },
        role: 'user'
      };
    }
  });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showManagerView, setShowManagerView] = useState(false);
  const [dashboardData, setDashboardData] = useState<UserDashboardData>(DEFAULT_DASHBOARD_DATA);

  const CURRENCY_CONFIG: Record<string, { symbol: string, rate: number }> = {
    eur: { symbol: 'MAD', rate: 1 },
    usd: { symbol: '$', rate: 1.08 },
    mad: { symbol: 'MAD', rate: 10.9 }
  };

  const formatPrice = useCallback((amount: number | string) => {
    const currency = userData?.preferences?.currency || 'eur';
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.eur;

    let numericAmount = 0;
    if (typeof amount === 'string') {
      numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    } else if (typeof amount === 'number') {
      numericAmount = amount;
    }

    if (isNaN(numericAmount)) return "0.00 " + config.symbol;

    const converted = (numericAmount * config.rate).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return currency === 'mad' ? `${converted} ${config.symbol}` : `${config.symbol} ${converted}`;
  }, [userData?.preferences?.currency]);

  useEffect(() => {
    (window as any).toggleManagerView = () => setShowManagerView(prev => !prev);
    return () => { delete (window as any).toggleManagerView; };
  }, []);

  useEffect(() => {
    // Restore Session
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoggedIn(true);
      const savedEmail = userData?.email;
      if (savedEmail) setCurrentUserEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      try {
        const saved = localStorage.getItem(`dashboard_data_v2_${currentUserEmail}`);
        let parsed = saved ? JSON.parse(saved) : null;

        if (!parsed || (parsed.revenueData && parsed.revenueData.every((d: any) => d.revenue === 0))) {
          parsed = {
            ...DEFAULT_DASHBOARD_DATA,
            balance: parsed?.balance || "0.00 MAD",
            orderCount: parsed?.orderCount || "0",
            billing: parsed?.billing || {
              balance: "0.00 MAD",
              transactions: []
            }
          };
        }

        setDashboardData(parsed);
      } catch (e) {
        console.error("Error loading dashboard data", e);
        setDashboardData(DEFAULT_DASHBOARD_DATA);
      }
    }
  }, [isLoggedIn, currentUserEmail]);

  useEffect(() => {
    localStorage.setItem('user_data', JSON.stringify(userData));
    if (userData.preferences?.language && userData.preferences.language !== lang) {
      setLang(userData.preferences.language);
    }
  }, [userData, lang]);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences || { currency: 'eur', language: 'fr' },
        language: newLang
      }
    }));
  };

  const handleCreateOrder = async (orderData: { id?: number; name: string; amount: string; cost: number; profit?: number; link?: string; proof_url?: string; customer_name?: string; payment_method?: string }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token && orderData.id) {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service_id: orderData.id,
            quantity: parseInt(orderData.amount.split(' ')[0]) || 0,
            link: orderData.link || 'Internal Order',
            total_price: orderData.cost,
            proof_url: orderData.proof_url,
            customer_name: orderData.customer_name,
            payment_method: orderData.payment_method
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          alert(`Erreur: ${errData.detail || "Échec de la commande"}`);
          return; // Stop here if failed
        }
      }
    } catch (error) {
      console.error("Failed to persist order to backend", error);
      alert("Erreur de connexion au serveur");
      return;
    }

    setDashboardData(prev => {
      // No local balance deduction

      const newOrder = {
        name: orderData.name,
        date: new Date().toLocaleDateString('fr-FR'),
        amount: orderData.amount,
        status: "En attente",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        cost: orderData.cost,
        profit: orderData.profit || 0
      };

      const newTransaction = {
        id: `TX - ${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString('fr-FR'),
        desc: `ACHAT ${orderData.name.toUpperCase()}`,
        amount: `- ${formatPrice(orderData.cost)
          } `,
        status: "COMPLÉTÉ",
        type: 'purchase' as const
      };

      const newNotification = {
        id: `NOTIF - ${Math.floor(Math.random() * 10000)} `,
        title: 'Commande en cours',
        message: `Votre commande pour ${orderData.name} est en attente de traitement.`,
        time: 'À l\'instant',
        type: 'order' as const,
        unread: true
      };

      const newData = {
        ...prev,
        balance: prev.balance,
        orderCount: (parseInt(prev.orderCount) + 1).toString(),
        orders: [newOrder, ...prev.orders].slice(0, 10),
        billing: {
          balance: prev.billing.balance,
          transactions: [newTransaction, ...prev.billing.transactions].slice(0, 20)
        },
        notifications: [newNotification, ...(prev.notifications || [])].slice(0, 20),
        revenueData: prev.revenueData.map((data, index) => {
          const currentMonthIndex = new Date().getMonth(); // 0 = Jan, 11 = Dec
          if (index === currentMonthIndex) {
            return {
              ...data,
              profit: data.profit + (orderData.profit || 0),
              revenue: data.revenue + orderData.cost // revenue here tracks cost for SMMADROOP (or maybe total revenue? User wants Profit = Sale - Cost. Let's just track Profit accurately).
            };
          }
          return data;
        })
      };

      if (currentUserEmail) {
        localStorage.setItem(`dashboard_data_v2_${currentUserEmail} `, JSON.stringify(newData));
      }
      return newData;
    });
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/billing/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const billingInfo = await response.json();

      setDashboardData(prev => ({
        ...prev,
        balance: formatPrice(billingInfo.balance || 0),
        billing: {
          ...billingInfo,
          balance: formatPrice(billingInfo.balance || 0)
        }
      }));

      // Fetch Orders
      const ordersRes = await fetch(`${API_BASE_URL}/orders/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const mappedOrders = ordersData.map((order: any) => ({
          name: order.service?.title || `Service #${order.service_id}`,
          date: new Date(order.created_at).toLocaleDateString('fr-FR'),
          amount: `${order.quantity} Units`,
          status: order.status === 'pending' ? 'En attente' :
            order.status === 'processing' ? 'En cours' :
              order.status === 'completed' ? 'Complétée' : 'Annulée',
          color: order.status === 'completed' ? 'text-emerald-400' :
            order.status === 'processing' ? 'text-blue-400' :
              order.status === 'cancelled' ? 'text-red-400' : 'text-amber-400',
          bg: order.status === 'completed' ? 'bg-emerald-500/10' :
            order.status === 'processing' ? 'bg-blue-500/10' :
              order.status === 'cancelled' ? 'bg-red-500/10' : 'bg-amber-500/10',
          cost: order.price,
          profit: order.profit || 0
        }));

        setDashboardData(prev => ({
          ...prev,
          orders: mappedOrders,
          orderCount: ordersData.length.toString(),
          completedCount: ordersData.filter((o: any) => o.status === 'completed').length.toString(),
          cancelledCount: ordersData.filter((o: any) => o.status === 'cancelled').length.toString()
        }));
      }

      // SYNC USER Profile (is_active, role, etc)
      const profileRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.user) {
          setUserData(prev => {
            const updated = { ...prev, ...profileData.user };
            localStorage.setItem('user_data', JSON.stringify(updated));
            return updated;
          });

          // CRITICAL: Sync onboarding status from backend
          if (profileData.user.onboarding_completed) {
            localStorage.setItem(`onboarding_completed_${profileData.user.email}`, 'true');
            setShowOnboarding(false);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
      if (error instanceof Error && error.message.includes('503')) {
        setIsMaintenance(true);
      }
    }
  }, [userData]); // Added userData dependency for role check inside maintenance check if needed

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services`);
        if (res.status === 503) {
          // If 503, only show maintenance if user is NOT admin
          if (userData?.role !== 'admin') {
            setIsMaintenance(true);
          }
        } else {
          setIsMaintenance(false);
        }
      } catch (e) {
        console.error("Maintenance check failed", e);
      }
    };
    checkMaintenance();
    const inv = setInterval(checkMaintenance, 30000);
    return () => clearInterval(inv);
  }, [userData?.role]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, fetchDashboardData]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`dashboard_data_v2_${currentUserEmail}`, JSON.stringify(dashboardData));
    }
  }, [dashboardData, currentUserEmail]);

  const handleLoginSuccess = async (mode?: 'login' | 'signup', email?: string, extraData?: any) => {
    setIsLoggedIn(true);
    setShowLogin(false);
    if (email) {
      setCurrentUserEmail(email);
      setUserData(prev => {
        const newData: UserData = {
          ...prev,
          email,
          firstName: extraData?.firstName || prev.firstName,
          lastName: extraData?.lastName || prev.lastName,
          role: (email === 'oubraimyassir@gmail.com' ? 'admin' : (extraData?.role || 'user')) as 'admin' | 'user' | 'management'
        };
        localStorage.setItem('user_data', JSON.stringify(newData));
        return newData;
      });

      if (extraData?.access_token) {
        localStorage.setItem('auth_token', extraData.access_token);
        setUserData(prev => {
          const newData: UserData = {
            ...prev,
            ...extraData,
            role: (extraData.role || (email === 'admin@smmadroop.com' ? 'admin' : 'user')) as 'admin' | 'user' | 'management',
            is_active: extraData.is_active ?? true,
            onboarding_completed: extraData.onboarding_completed ?? false
          };
          delete (newData as any).access_token;
          localStorage.setItem('user_data', JSON.stringify(newData));
          return newData;
        });
        await fetchDashboardData();
      } else if (extraData?.googleToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: extraData.googleToken })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
              localStorage.setItem('auth_token', data.access_token);
              if (data.user) {
                setUserData(prev => {
                  const newData: UserData = {
                    ...prev,
                    ...data.user,
                    role: (data.user.role || 'user') as 'admin' | 'user' | 'management',
                    is_active: data.user.is_active ?? true,
                    onboarding_completed: data.user.onboarding_completed ?? false
                  };
                  localStorage.setItem('user_data', JSON.stringify(newData));
                  return newData;
                });
              }
              await fetchDashboardData();
            }
          }
        } catch (error) {
          console.error("Google Auth fallback error", error);
        }
      } else {
        await fetchDashboardData();
      }

      const isCompleted = localStorage.getItem(`onboarding_completed_${email}`) === 'true' || extraData?.onboarding_completed === true;
      const userRole = extraData?.role || (email === 'oubraimyassir@gmail.com' ? 'admin' : 'user');
      if (!isCompleted && userRole !== 'admin') {
        setShowOnboarding(true);
      }
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    if (currentUserEmail) {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_BASE_URL}/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          localStorage.setItem(`onboarding_completed_${currentUserEmail}`, 'true');

          // Split full name if possible
          const names = data.fullName.split(' ');
          const firstName = names[0] || '';
          const lastName = names.slice(1).join(' ') || '';

          setUserData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: currentUserEmail,
            phone: data.phone,
            country: data.country,
            agencyName: data.agencyName,
            onboarding_completed: true
          }));

          setShowOnboarding(false);
        } else {
          console.error("Failed to save onboarding data to backend");
          // Fallback to local only if backend fails (not ideal but keeps user moving)
          localStorage.setItem(`onboarding_completed_${currentUserEmail}`, 'true');
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error("Error saving onboarding:", error);
        setShowOnboarding(false);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAdminDashboard(false);
    setCurrentUserEmail(null);
  };

  const dictionaries = {
    fr: {
      hero_badge: "Croissance Numérique Nouvelle Génération",
      hero_title_1: "SMMA",
      hero_title_2: "DROOP",
      hero_subtitle: "Service Digital.",
      hero_desc: "Le panel SMM le plus avancé au monde. Élevez votre marque avec un engagement social premium, une livraison instantanée et des tarifs imbattables.",
      cta_join: "REJOINDRE SMMADROOP",
      cta_support: "Contacter le Support",
      navbar_services: "Services",
      navbar_affiliate: "Affiliation",
      navbar_features: "Fonctionnalités",
      navbar_signin: "Connexion",
      navbar_signup: "Commencer",
      stat_active: "Clients Satisfaits",
      stat_orders: "Commandes Traitées",
      stat_services: "Services Actifs",
      stat_support: "Support Expert 24/7",
      cat_badge: "Découvrez nos offres",
      cat_title_1: "Catégories",
      cat_title_2: "Populaires",
      cat_desc: "Trouvez exactement ce dont vous avez besoin",
      cat_item_1_title: "Instagram", cat_item_1_desc: "Abonnés, Likes, Vues & Engagement",
      cat_item_2_title: "TikTok", cat_item_2_desc: "Vues FYP, Followers & Partages",
      cat_item_3_title: "YouTube", cat_item_3_desc: "Heures de Visionnage & Abonnés",
      cat_item_4_title: "Facebook", cat_item_4_desc: "Likes de Page & Vues Vidéo",
      cat_item_5_title: "Telegram", cat_item_5_desc: "Membres de Canal & Réactions",
      cat_item_6_title: "SEO & Web", cat_item_6_desc: "Trafic Réel & Backlinks",
      aff_badge: "Programme d'Affiliation",
      aff_title_1: "Gagnez",
      aff_title_2: "20% de Commission",
      aff_title_3: "à Vie",
      aff_desc: "Rejoignez notre réseau de partenaires et commencez à générer des revenus passifs. Parrainez des clients vers SMMADROOP et recevez une commission à vie sur chaque commande qu'ils passent.",
      aff_f1_title: "Paiements Instantanés", aff_f1_desc: "Demandez vos gains à tout moment avec un délai minimal.",
      aff_f2_title: "Niveaux Multiples", aff_f2_desc: "Gagnez plus en parrainant plus de clients chez nous.",
      aff_f3_title: "Suivi en Temps Réel", aff_f3_desc: "Suivez vos parrainages et vos gains en temps réel.",
      aff_f4_title: "Aucune Limite", aff_f4_desc: "Il n'y a pas de plafond sur ce que vous pouvez gagner.",
      aff_join: "Rejoindre le Programme d'Affiliation",
      aff_calc_potential: "Gains Potentiels", aff_calc_live: "Calculateur en Direct",
      aff_calc_referrals: "50 Parrainages/mois", aff_calc_per_month: "/ mois",
      aff_top_badge: "Top Affilié a Gagné",
      vis_badge: "Rencontrez le Visionnaire",
      vis_title_1: "Conçu par des Experts pour la",
      vis_title_2: "Croissance",
      vis_desc: "SMMADROOP n'est pas seulement une plateforme ; c'est le point culminant de plusieurs années d'expertise en réseaux sociaux. Notre équipe consacre des milliers d'heures à garantir que votre empreinte numérique reste inégalée.",
      vis_expert: "Expert Vérifié",
      vis_exp_years: "Plus de 10 ans d'Expérience",
      vis_profile_title: "Stratège Numérique Principal",
      vis_profile_bio: "Création d'expériences numériques belles et intuitives. Passionné par l'aide aux marques pour libérer leur plein potentiel social.",
      test_title: "Approuvé par des milliers de marques",
      test_desc: "Rejoignez les créateurs et entreprises qui propulsent leur croissance avec SMMADROOP.",
      test_1_text: "SMMADROOP est devenu notre partenaire numéro 1. La qualité des abonnés Instagram est bluffante, aucun drop constaté en 6 mois.",
      test_2_text: "Grâce à leurs vues YouTube Haute Rétention, j'ai pu monétiser ma chaîne en moins de 3 semaines. Service client exceptionnel.",
      test_3_text: "Enfin un panel sérieux pour le SEO. Le trafic web qu'ils envoient est réel et mesuré avec précision sur Google Analytics.",
      test_4_text: "Le programme d'affiliation est incroyable. Je génère plus de 2000MAD par mois de revenus passifs simplement en parrainant.",
      footer_company: "Entreprise", footer_about: "À Propos", footer_contact: "Contact", footer_terms: "Conditions", footer_privacy: "Confidentialité",
      footer_support: "Support", footer_signup: "S'inscrire", footer_signin: "Connexion", footer_chat: "Chat en Direct", footer_faq: "FAQ",
      footer_desc: "Solutions de marketing sur les réseaux sociaux premium pour les créateurs numériques, les marques et les agences du monde entier.",
      footer_rights: "Tous droits réservés.",
      footer_ssl: "Cryptage SSL Sécurisé",
      footer_online: "Nœuds en Temps Réel en Ligne",
      auth_welcome_back: "Bon retour parmi nous",
      auth_create_account: "Créer votre compte",
      auth_login_desc: "Connectez-vous pour accéder à votre espace",
      auth_signup_desc: "Rejoignez la révolution du marketing digital",
      auth_placeholder_name: "Nom complet",
      auth_placeholder_email: "Votre compte Gmail",
      auth_placeholder_password: "Mot de passe",
      auth_remember: "Se souvenir de moi",
      auth_forgot: "Mot de passe oublié ?",
      auth_btn_login: "Se connecter",
      auth_btn_signup: "S'inscrire",
      auth_google: "Utiliser mon compte Google",
      auth_no_account: "Pas encore de compte ?",
      auth_have_account: "Déjà un compte ?",
      auth_back_home: "Retour à l'accueil",
      auth_success_title: "Succès !",
      auth_success_desc: "Redirection vers votre espace SMMADROOP..."
    },
    en: {
      hero_badge: "Next Generation Digital Growth",
      hero_title_1: "SMMA",
      hero_title_2: "DROOP",
      hero_subtitle: "Digital Service.",
      hero_desc: "The world's most advanced SMM panel. Elevate your brand with premium social engagement, instant delivery, and unbeatable rates.",
      cta_join: "JOIN SMMADROOP",
      cta_support: "Contact Support",
      navbar_services: "Services",
      navbar_affiliate: "Affiliate",
      navbar_features: "Features",
      navbar_signin: "Sign In",
      navbar_signup: "Get Started",
      stat_active: "Satisfied Clients",
      stat_orders: "Orders Processed",
      stat_services: "Active Services",
      stat_support: "24/7 Expert Support",
      cat_badge: "Discover our offers",
      cat_title_1: "Popular",
      cat_title_2: "Categories",
      cat_desc: "Find exactly what you need",
      cat_item_1_title: "Instagram", cat_item_1_desc: "Followers, Likes, Views & Engagement",
      cat_item_2_title: "TikTok", cat_item_2_desc: "FYP Views, Followers & Shares",
      cat_item_3_title: "YouTube", cat_item_3_desc: "Watch Hours & Subscribers",
      cat_item_4_title: "Facebook", cat_item_4_desc: "Page Likes & Video Views",
      cat_item_5_title: "Telegram", cat_item_5_desc: "Channel Members & Reactions",
      cat_item_6_title: "SEO & Web", cat_item_6_desc: "Real Traffic & Backlinks",
      aff_badge: "Affiliate Program",
      aff_title_1: "Earn",
      aff_title_2: "20% Commission",
      aff_title_3: "for Life",
      aff_desc: "Join our partner network and start generating passive income. Refer customers to SMMADROOP and receive a lifetime commission on every order they place.",
      aff_f1_title: "Instant Payments", aff_f1_desc: "Request your earnings at any time with minimal delay.",
      aff_f2_title: "Multiple Levels", aff_f2_desc: "Earn more by referring more customers to us.",
      aff_f3_title: "Real-Time Tracking", aff_f3_desc: "Track your referrals and earnings in real time.",
      aff_f4_title: "No Limits", aff_f4_desc: "There is no ceiling on what you can earn.",
      aff_join: "Join the Affiliate Program",
      aff_calc_potential: "Potential Earnings", aff_calc_live: "Live Calculator",
      aff_calc_referrals: "50 Referrals/month", aff_calc_per_month: "/ month",
      aff_top_badge: "Top Affiliate Earned",
      vis_badge: "Meet the Visionary",
      vis_title_1: "Designed by Experts for",
      vis_title_2: "Growth",
      vis_desc: "SMMADROOP is not just a platform; it's the culmination of years of social media expertise. Our team spends thousands of hours ensuring your digital footprint remains unmatched.",
      vis_expert: "Verified Expert",
      vis_exp_years: "Over 10 years of Experience",
      vis_profile_title: "Lead Digital Strategist",
      vis_profile_bio: "Creating beautiful and intuitive digital experiences. Passionate about helping brands unlock their full social potential.",
      test_title: "Trusted by thousands of brands",
      test_desc: "Join the creators and businesses powering their growth with SMMADROOP.",
      test_1_text: "SMMADROOP has become our #1 partner. The quality of Instagram followers is amazing, no drop seen in 6 months.",
      test_2_text: "Thanks to their High Retention YouTube views, I was able to monetize my channel in less than 3 weeks. Exceptional customer service.",
      test_3_text: "Finally a serious panel for SEO. The web traffic they send is real and accurately measured on Google Analytics.",
      test_4_text: "The affiliate program is incredible. I generate over MAD2000 per month in passive income simply by referring clients.",
      footer_company: "Company", footer_about: "About Us", footer_contact: "Contact", footer_terms: "Terms", footer_privacy: "Privacy",
      footer_support: "Support", footer_signup: "Sign Up", footer_signin: "Sign In", footer_chat: "Live Chat", footer_faq: "FAQ",
      footer_desc: "Premium social media marketing solutions for digital creators, brands, and agencies worldwide.",
      footer_rights: "All rights reserved.",
      footer_ssl: "Secure SSL Encryption",
      footer_online: "Real-Time Nodes Online",
      auth_welcome_back: "Welcome back",
      auth_create_account: "Create your account",
      auth_login_desc: "Login to access your space",
      auth_signup_desc: "Join the digital marketing revolution",
      auth_placeholder_name: "Full Name",
      auth_placeholder_email: "Your Gmail account",
      auth_placeholder_password: "Password",
      auth_remember: "Remember me",
      auth_forgot: "Forgot password?",
      auth_btn_login: "Login",
      auth_btn_signup: "Sign up",
      auth_google: "Continue with Google account",
      auth_no_account: "No account yet?",
      auth_have_account: "Already have an account?",
      auth_back_home: "Back to home",
      auth_success_title: "Success!",
      auth_success_desc: "Redirecting to your SMMADROOP space..."
    },
    es: {
      hero_badge: "Crecimiento Digital de Nueva Generación",
      hero_title_1: "SMMA",
      hero_title_2: "DROOP",
      hero_subtitle: "Servicio Digital.",
      hero_desc: "El panel SMM más avanzado del mundo. Eleve su marca con un compromiso social premium, entrega instantánea y tarifas imbatibles.",
      cta_join: "UNIRSE A SMMADROOP",
      cta_support: "Contactar Soporte",
      navbar_services: "Servicios",
      navbar_affiliate: "Afiliación",
      navbar_features: "Funcionalidades",
      navbar_signin: "Iniciar Sesión",
      navbar_signup: "Comenzar",
      stat_active: "Clientes Satisfechos",
      stat_orders: "Pedidos Procesados",
      stat_services: "Servicios Activos",
      stat_support: "Soporte Experto 24/7",
      cat_badge: "Descubra nuestras ofertas",
      cat_title_1: "Categorías",
      cat_title_2: "Populares",
      cat_desc: "Encuentre exactamente lo que necesita",
      cat_item_1_title: "Instagram", cat_item_1_desc: "Seguidores, Likes, Vistas e Interacción",
      cat_item_2_title: "TikTok", cat_item_2_desc: "Vistas FYP, Seguidores y Compartidos",
      cat_item_3_title: "YouTube", cat_item_3_desc: "Horas de Visualización y Suscriptores",
      cat_item_4_title: "Facebook", cat_item_4_desc: "Likes de Página y Vistas de Video",
      cat_item_5_title: "Telegram", cat_item_5_desc: "Miembros de Canal y Reacciones",
      cat_item_6_title: "SEO y Web", cat_item_6_desc: "Tráfico Real y Enlaces de Retroceso",
      aff_badge: "Programa de Afiliados",
      aff_title_1: "Gane",
      aff_title_2: "20% de Comisión",
      aff_title_3: "de por Vida",
      aff_desc: "Únase a nuestra red de socios y comience a generar ingresos pasivos. Recomiende clientes a SMMADROOP y reciba una comisión de por vida por cada pedido que realicen.",
      aff_f1_title: "Pagos Instantáneos", aff_f1_desc: "Solicite sus ganancias en cualquier momento con un retraso mínimo.",
      aff_f2_title: "Múltiples Niveles", aff_f2_desc: "Gane más recomendando más clientes con nosotros.",
      aff_f3_title: "Seguimiento en Tiempo Real", aff_f3_desc: "Siga sus recomendaciones y ganancias en tiempo real.",
      aff_f4_title: "Sin Límites", aff_f4_desc: "No hay techo para lo que puede ganar.",
      aff_join: "Unirse al Programa de Afiliados",
      aff_calc_potential: "Ganancias Potenciales", aff_calc_live: "Calculadora en Vivo",
      aff_calc_referrals: "50 Recomendaciones/mes", aff_calc_per_month: "/ mes",
      aff_top_badge: "Mejor Afiliado Ganó",
      vis_badge: "Conozca al Visionario",
      vis_title_1: "Diseñado por Expertos para la",
      vis_title_2: "Crecimiento",
      vis_desc: "SMMADROOP no es solo una plataforma; es la culminación de años de experiencia en redes sociales. Nuestro equipo dedica miles de horas a garantizar que su huella digital sea inigualable.",
      vis_expert: "Experto Verificado",
      vis_exp_years: "Más de 10 años de Experiencia",
      vis_profile_title: "Estratega Digital Principal",
      vis_profile_bio: "Creando experiencias digitales hermosas e intuitivas. Apasionado por ayudar a las marcas a desbloquear todo su potencial social.",
      test_title: "Con la confianza de miles de marcas",
      test_desc: "Únase a los creadores y empresas que impulsan su crecimiento con SMMADROOP.",
      test_1_text: "SMMADROOP se ha convertido en nuestro socio número 1. La calidad de los seguidores de Instagram es increíble, no hemos visto caídas en 6 meses.",
      test_2_text: "Gracias a sus vistas de YouTube de Alta Retención, pude monetizar mi canal en menos de 3 semanas. Servicio al cliente excepcional.",
      test_3_text: "Finalmente, un panel serio para SEO. El tráfico web que envían es real y se mide con precisión en Google Analytics.",
      test_4_text: "El programa de afiliados es increíble. Genero más de 2000MAD al mes en ingresos pasivos simplemente recomendando clientes.",
      footer_company: "Empresa", footer_about: "Sobre Nosotros", footer_contact: "Contacto", footer_terms: "Condiciones", footer_privacy: "Privacidad",
      footer_support: "Soporte", footer_signup: "Registrarse", footer_signin: "Iniciar Sesión", footer_chat: "Chat en Vivo", footer_faq: "FAQ",
      footer_desc: "Soluciones de marketing en redes sociales premium para creadores digitales, marcas y agencias de todo el mundo.",
      footer_rights: "Todos los derechos reservados.",
      footer_ssl: "Cifrado SSL Seguro",
      footer_online: "Nodos en Tiempo Real en Línea",
      auth_welcome_back: "Bienvenido de nuevo",
      auth_create_account: "Crear su cuenta",
      auth_login_desc: "Inicie sesión para acceder a su espacio",
      auth_signup_desc: "Únase a la revolución del marketing digital",
      auth_placeholder_name: "Nombre completo",
      auth_placeholder_email: "Tu cuenta de Gmail",
      auth_placeholder_password: "Contraseña",
      auth_remember: "Recordarme",
      auth_forgot: "¿Olvidó su contraseña?",
      auth_btn_login: "Iniciar Sesión",
      auth_btn_signup: "Registrarse",
      auth_google: "Continuar con Google account",
      auth_no_account: "¿Aún no tiene cuenta?",
      auth_have_account: "¿Ya tiene una cuenta?",
      auth_back_home: "Volver al inicio",
      auth_success_title: "¡Éxito!",
      auth_success_desc: "Redirigiendo a su espacio SMMADROOP..."
    },
    ar: {
      hero_badge: "جيل جديد من النمو الرقمي",
      hero_title_1: "SMMA",
      hero_title_2: "DROOP",
      hero_subtitle: "خدمة رقمية.",
      hero_desc: "لوحة SMM الأكثر تقدمًا في العالم. ارتقِ بعلامتك التجارية من خلال تفاعل اجتماعي متميزة وتسليم فوري وأسعار لا تقبل المنافسة.",
      cta_join: "انضم إلى SMMADROOP",
      cta_support: "الاتصال بالدعم",
      navbar_services: "الخدمات",
      navbar_affiliate: "التسويق بالعمولة",
      navbar_features: "المميزات",
      navbar_signin: "تسجيل الدخول",
      navbar_signup: "ابدأ الآن",
      stat_active: "عملاء راضون",
      stat_orders: "طلبات مكتملة",
      stat_services: "خدمات نشطة",
      stat_support: "دعم خبراء 24/7",
      cat_badge: "اكتشف عروضنا",
      cat_title_1: "الفئات",
      cat_title_2: "الشائعة",
      cat_desc: "جد بالضبط ما تحتاجه",
      cat_item_1_title: "إنستغرام", cat_item_1_desc: "متابعين، إعجابات، مشاهدات وتفاعل",
      cat_item_2_title: "تيك توك", cat_item_2_desc: "مشاهدات FYP، متابعين ومشاركات",
      cat_item_3_title: "يوتيوب", cat_item_3_desc: "ساعات مشاهدة ومتابعين",
      cat_item_4_title: "فيسبوك", cat_item_4_desc: "إعجابات صفحة ومشاهدات فيديو",
      cat_item_5_title: "تيليجرام", cat_item_5_desc: "أعضاء قناة وتفاعلات",
      cat_item_6_title: "SEO والويب", cat_item_6_desc: "زيارات حقيقية وروابط خلفية",
      aff_badge: "برنامج التسويق بالعمولة",
      aff_title_1: "اربح",
      aff_title_2: "20% عمولة",
      aff_title_3: "مدى الحياة",
      aff_desc: "انضم إلى شبكة شركائنا وابدأ في تحقيق دخل سلبي. قم بإحالة العملاء إلى SMMADROOP واحصل على عمولة مدى الحياة على كل طلب يقدمونه.",
      aff_f1_title: "مدفوعات فورية", aff_f1_desc: "اطلب أرباحك في أي وقت وبأقل تأخير.",
      aff_f2_title: "مستويات متعددة", aff_f2_desc: "اربح أكثر من خلال إحالة المزيد من العملاء إلينا.",
      aff_f3_title: "تتبع في الوقت الحقيقي", aff_f3_desc: "تتبع إحالاتك وأرباحك في الوقت الحقيقي.",
      aff_f4_title: "لا قيود", aff_f4_desc: "لا يوجد سقف لما يمكنك ربحه.",
      aff_join: "انضم إلى برنامج التسويق بالعمولة",
      aff_calc_potential: "الأرباح المحتملة", aff_calc_live: "حاسبة مباشرة",
      aff_calc_referrals: "50 إحالة/شهر", aff_calc_per_month: "/ شهر",
      aff_top_badge: "أكثر مسوق بالعمولة ربحاً",
      vis_badge: "تعرف على صاحب الرؤية",
      vis_title_1: "مصمم من قبل خبراء لأجل",
      vis_title_2: "النمو",
      vis_desc: "SMMADROOP ليست مجرد منصة؛ إنها تتويج لسنوات من الخبرة في وسائل التواصل الاجتماعي. يخصص فريقنا آلاف الساعات لضمان بقاء بصمتك الرقمية لا مثيل لها.",
      vis_expert: "خبير معتمد",
      vis_exp_years: "أكثر من 10 سنوات من الخبرة",
      vis_profile_title: "كبير استراتيجيي الأرقام",
      vis_profile_bio: "خلق تجارب رقمية جميلة وبسيطة. شغوف بمساعدة العلامات التجارية على إطلاق كامل إمكاناتها الاجتماعية.",
      test_title: "موثوق به من قبل آلاف العلامات التجارية",
      test_desc: "انضم إلى المبدعين والشركات الذين يعززون نموهم مع SMMADROOP.",
      test_1_text: "أصبح SMMADROOP شريكنا الأول. جودة متابعي إنستغرام مذهلة، لم نلاحظ أي نقص طوال 6 أشهر.",
      test_2_text: "بفضل مشاهدات يوتيوب عالية الاحتفاظ، تمكنت من تفعيل الربح في قناتي في أقل من 3 أسابيع. خدمة عملاء استثنائية.",
      test_3_text: "أخيراً لوحة جدية للـ SEO. الزيارات التي يرسلونها حقيقية وتقاس بدقة على Google Analytics.",
      test_4_text: "برنامج التسويق بالعمولة رائع حقاً. أحقق أكثر من 2000 يورو شهرياً كدخل سلبي ببساطة عن طريق دعوة العملاء.",
      footer_company: "الشركة", footer_about: "حولنا", footer_contact: "اتصل بنا", footer_terms: "الشروط", footer_privacy: "الخصوصية",
      footer_support: "الدعم", footer_signup: "سجل الآن", footer_signin: "تسجيل الدخول", footer_chat: "دردشة مباشرة", footer_faq: "الأسئلة الشائعة",
      footer_desc: "حلول تسويق متميزة عبر وسائل التواصل الاجتماعي للمبدعين الرقميين والعلامات التجارية والوكالات في جميع أنحاء العالم.",
      footer_rights: "جميع الحقوق محفوظة.",
      footer_ssl: "تشفير SSL آمن",
      footer_online: "عقد في الوقت الحقيقي عبر الإنترنت",
      auth_welcome_back: "مرحباً بك مجدداً",
      auth_create_account: "إنشاء حسابك",
      auth_login_desc: "سجل الدخول للوصول إلى مساحتك",
      auth_signup_desc: "انضم إلى ثورة التسويق الرقمي",
      auth_placeholder_name: "الاسم الكامل",
      auth_placeholder_email: "حساب جيميل الخاص بك",
      auth_placeholder_password: "كلمة المرور",
      auth_remember: "تذكرني",
      auth_forgot: "هل نسيت كلمة المرور؟",
      auth_btn_login: "تسجيل الدخول",
      auth_btn_signup: "تسجيل الآن",
      auth_google: "المتابعة باستخدام حساب جوجل",
      auth_no_account: "ليس لديك حساب بعد؟",
      auth_have_account: "لديك حساب بالفعل؟",
      auth_back_home: "العودة إلى الصفحة الرئيسية",
      auth_success_title: "تم بنجاح!",
      auth_success_desc: "جاري توجيهك إلى مساحة SMMADROOP الخاصة بك..."
    }
  };

  const t = (key: keyof typeof dictionaries['fr']) => dictionaries[lang as keyof typeof dictionaries][key] || dictionaries['fr'][key];

  const stats = [
    { label: t('stat_active'), value: 100, suffix: '+', color: 'text-blue-400' },
    { label: t('stat_orders'), value: 2000, suffix: '+', color: 'text-purple-400' },
    { label: t('stat_services'), value: 3500, suffix: '+', color: 'text-teal-400' },
    { label: t('stat_support'), value: '24/7', isString: true, color: 'text-emerald-400' },
  ];

  const categories = [
    { icon: Instagram, title: t('cat_item_1_title'), desc: t('cat_item_1_desc'), color: 'from-pink-500/20', iconColor: 'text-pink-400' },
    { icon: Video, title: t('cat_item_2_title'), desc: t('cat_item_2_desc'), color: 'from-cyan-500/20', iconColor: 'text-cyan-400' },
    { icon: Youtube, title: t('cat_item_3_title'), desc: t('cat_item_3_desc'), color: 'from-red-500/20', iconColor: 'text-red-400' },
    { icon: Facebook, title: t('cat_item_4_title'), desc: t('cat_item_4_desc'), color: 'from-blue-600/20', iconColor: 'text-blue-500' },
    { icon: Send, title: t('cat_item_5_title'), desc: t('cat_item_5_desc'), color: 'from-sky-500/20', iconColor: 'text-sky-400' },
    { icon: Globe, title: t('cat_item_6_title'), desc: t('cat_item_6_desc'), color: 'from-emerald-500/20', iconColor: 'text-emerald-400' },
  ];

  const testimonials = [
    {
      author: { name: "Sarah Alami", handle: "@sarah_digital", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
      text: t('test_1_text'),
      href: "#"
    },
    {
      author: { name: "Jean-Baptiste Leroy", handle: "@jbleroy", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
      text: t('test_2_text'),
      href: "#"
    },
    {
      author: { name: "Carlos Sanchez", handle: "@carlos_seo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      text: t('test_3_text'),
      href: "#"
    },
    {
      author: { name: "Laila Mansouri", handle: "@lailam_affiliate", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
      text: t('test_4_text'),
      href: "#"
    },
  ];

  return (
    <div className="min-h-screen">
      {showOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : isLoggedIn ? (
        !userData.is_active && userData.role !== 'admin' ? (
          <DeactivatedPage onLogout={handleLogout} />
        ) : userData.role === 'admin' && showAdminDashboard ? (
          showManagerView ? (
            <ManagerDashboard onLogout={handleLogout} user={userData} />
          ) : (
            <AdminDashboard onLogout={handleLogout} user={userData} />
          )
        ) : userData.role === 'management' ? (
          <ManagerDashboard onLogout={handleLogout} user={userData} />
        ) : (
          <Dashboard
            onLogout={handleLogout}
            t={t}
            user={userData}
            onUpdateUser={setUserData}
            dashboardData={dashboardData}
            refreshData={fetchDashboardData}
            onCreateOrder={handleCreateOrder}
            formatPrice={formatPrice}
            lang={lang}
            // @ts-ignore
            onOpenAdmin={userData.role === 'admin' ? () => setShowAdminDashboard(true) : undefined}
            currency={userData.preferences?.currency || 'eur'}
            currencyRate={(CURRENCY_CONFIG[userData.preferences?.currency || 'eur'] || CURRENCY_CONFIG.eur).rate}
          />
        )
      ) : (
        <>
          <Navbar
            lang={lang}
            onLangChange={handleLangChange}
            onSignIn={() => { setAuthMode('login'); setShowLogin(true); }}
            onSignUp={() => { setAuthMode('signup'); setShowLogin(true); }}
          />

          <main>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
              {/* Background Layer */}
              <div className="absolute inset-0 z-0">
                <InfiniteGrid />
              </div>

              {/* Overlay Gradients */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

              <div className="container mx-auto px-6 relative z-20 text-center">
                <FadeIn>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border-white/10 mb-8"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase text-gold-400">{t('hero_badge')}</span>
                  </motion.div>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-6 tracking-tighter">
                    SMMADROOP <br />
                    <span className="text-gradient">{t('hero_subtitle')}</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {t('hero_desc')}
                  </p>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <button
                      onClick={() => { setAuthMode('signup'); setShowLogin(true); }}
                      className="group relative px-12 py-5 bg-brand-primary rounded-full font-black text-white overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-2xl shadow-primary-500/20 text-lg uppercase tracking-wider"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                      <span className="relative flex items-center gap-3 text-center">
                        {t('cta_join')} <ChevronRight className="w-6 h-6" />
                      </span>
                    </button>

                    {/* Stats */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4 sm:gap-8 max-w-5xl mx-auto pt-12 border-t border-white/5 px-4"
                    >
                      {stats.map((stat, i) => (
                        <div key={i} className="px-2">
                          <div className={cn("text-3xl sm:text-4xl lg:text-6xl font-black mb-2 tabular-nums tracking-tight", stat.color)}>
                            {stat.isString ? stat.value : <CountUp end={stat.value as number} suffix={stat.suffix} />}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mt-1 whitespace-nowrap">{stat.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </FadeIn>
              </div>
            </section>

            {/* Categories Section */}
            <section id="services" className="py-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary-500/5 -z-10 blur-3xl opacity-50" />
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <FadeIn>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
                      {t('cat_badge')}
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className="text-4xl md:text-6xl font-black mb-4">
                      {t('cat_title_1')} <span className="text-gradient">{t('cat_title_2')}</span>
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-gray-400 max-w-xl mx-auto italic">{t('cat_desc')}</p>
                  </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={cn(
                        "group relative p-8 rounded-[32px] glass-dark border border-white/5 transition-all duration-500 overflow-hidden cursor-pointer",
                        "hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10"
                      )}
                      onClick={() => { setAuthMode('signup'); setShowLogin(true); }}
                    >
                      {/* Background Glow */}
                      <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", cat.color)} />

                      <div className="relative z-10">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 group-hover:scale-110 transition-transform duration-500", cat.iconColor)}>
                          <cat.icon size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-white group-hover:text-primary-300 transition-colors uppercase tracking-tight">
                          {cat.title}
                        </h3>
                        <p className="text-gray-400 font-medium tracking-wide">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                        <ArrowRight className="w-6 h-6 text-primary-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Affiliate Section */}
            <section id="affiliate" className="py-24 relative overflow-hidden bg-background">
              <div className="container mx-auto px-6">
                <div className="glass-dark rounded-[48px] border border-white/10 p-8 md:p-16 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500/10 blur-[120px] -z-10" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                      <FadeIn direction="right">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6">
                          {t('aff_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                          {t('aff_title_1')} <span className="text-gradient">{t('aff_title_2')}</span> {t('aff_title_3')}
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                          {t('aff_desc')}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                          <FeatureItem icon={DollarSign} title={t('aff_f1_title')} desc={t('aff_f1_desc')} />
                          <FeatureItem icon={Layers} title={t('aff_f2_title')} desc={t('aff_f2_desc')} />
                          <FeatureItem icon={TrendingUp} title={t('aff_f3_title')} desc={t('aff_f3_desc')} />
                          <FeatureItem icon={ShieldCheck} title={t('aff_f4_title')} desc={t('aff_f4_desc')} />
                        </div>

                        <button
                          onClick={() => { setAuthMode('signup'); setShowLogin(true); }}
                          className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                        >
                          {t('aff_join')}
                        </button>
                      </FadeIn>
                    </div>

                    <div className="relative">
                      <FadeIn direction="left">
                        <div className="glass rounded-3xl border border-white/10 p-8 shadow-2xl">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <div className="text-gray-400 text-sm font-medium mb-1">{t('aff_calc_potential')}</div>
                              <div className="text-3xl font-black text-white">{t('aff_calc_live')}</div>
                            </div>
                            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                              <TrendingUp className="text-primary-400" />
                            </div>
                          </div>

                          <div className="space-y-6 mb-8">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">{t('aff_calc_referrals')}</span>
                                <span className="text-white font-bold">50</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-brand-primary" />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-4xl font-black text-brand-primary mb-1">
                              $2,500<span className="text-lg text-gray-500 ml-2">{t('aff_calc_per_month')}</span>
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                              {t('aff_top_badge')}
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Founder Section */}
            <section id="features" className="py-24 relative overflow-hidden">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                    <FadeIn direction="right">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
                        {t('vis_badge')}
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        {t('vis_title_1')} <span className="text-gradient">{t('vis_title_2')}</span>
                      </h2>
                      <p className="text-gray-400 text-lg mb-10 leading-relaxed italic">
                        {t('vis_desc')}
                      </p>

                      <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                            <ShieldCheck className="text-gold-400" />
                          </div>
                          <div>
                            <div className="text-white font-bold">{t('vis_expert')}</div>
                            <div className="text-gray-500 text-xs">{t('vis_exp_years')}</div>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>

                  <div className="order-1 lg:order-2">
                    <FadeIn direction="left">
                      <GlassmorphismProfileCard
                        avatarUrl="https://images.unsplash.com/photo-1519085184947-6ad863cffc7d?w=400&h=400&fit=crop"
                        name="Yassir Elidrissi"
                        title={t('vis_profile_title')}
                        bio={t('vis_profile_bio')}
                        socialLinks={[
                          { id: '1', icon: Instagram, label: 'Instagram', href: "https://www.instagram.com/smmadrop?igsh=MWJnd2p0ZmJyMHgycA==" },
                          { id: '2', icon: Twitter, label: 'Twitter', href: "#" },
                          { id: '3', icon: MessageCircle, label: 'WhatsApp', href: "https://wa.me/212722080441" }
                        ]}
                        actionButton={{
                          text: t('cta_support'),
                          href: "https://wa.me/212722080441"
                        }}
                      />
                    </FadeIn>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white/5">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-black mb-4">{t('test_title')}</h2>
                  <p className="text-gray-400">{t('test_desc')}</p>
                </div>
                <TestimonialsSection
                  title={t('test_title')}
                  description={t('test_desc')}
                  testimonials={testimonials}
                />
              </div>
            </section>
          </main>

          <footer className="py-16 border-t border-foreground/5 relative bg-background">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 lg:col-span-1">
                  <div className="flex items-center space-x-2 mb-6">
                    <img src="/logo.svg" alt="SMMADROOP Logo" className="w-8 h-8 object-contain" />
                    <span className="text-2xl font-bold tracking-tight">SMMADROOP</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                    {t('footer_desc')}
                  </p>
                  <div className="flex space-x-4">
                    {[
                      { Icon: Instagram, href: 'https://www.instagram.com/smmadrop?igsh=MWJnd2p0ZmJyMHgycA==' },
                      { Icon: MessageCircle, href: 'https://wa.me/212722080441' },
                      { Icon: Twitter, href: '#' }
                    ].map((social, i) => (
                      <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                        <social.Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">{t('footer_company')}</h4>
                  <ul className="space-y-4">
                    {['about', 'contact', 'terms', 'privacy'].map((item) => (
                      <li key={item}>
                        <a href={`#${item}`} className="text-gray-500 hover:text-white transition-colors text-sm">{t(`footer_${item}` as any)}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">{t('footer_support')}</h4>
                  <ul className="space-y-4">
                    <li>
                      <button
                        onClick={() => { setAuthMode('signup'); setShowLogin(true); }}
                        className="text-gray-500 hover:text-white transition-colors text-sm text-left"
                      >{t('footer_signup' as any)}</button>
                    </li>
                    <li>
                      <button
                        onClick={() => { setAuthMode('login'); setShowLogin(true); }}
                        className="text-gray-500 hover:text-white transition-colors text-sm text-left"
                      >{t('footer_signin' as any)}</button>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/212722080441"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                      >{t('footer_chat' as any)}</a>
                    </li>
                    <li>
                      <a
                        href="#faq"
                        onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                      >{t('footer_faq' as any)}</a>
                    </li>
                  </ul>
                </div>

                <div className="col-span-1">
                  <div className="p-8 rounded-3xl glass border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -z-10 group-hover:bg-primary-500/20 transition-colors" />
                    <h4 className="font-black text-xl mb-4 text-white">Prêt à dominer ?</h4>
                    <p className="text-gray-400 text-sm mb-6">Rejoignez l'élite du marketing digital aujourd'hui.</p>
                    <button
                      onClick={() => { setAuthMode('signup'); setShowLogin(true); }}
                      className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                    >
                      {t('navbar_signup')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-xs">© 2026 SMMADROOP SERVICE DIGITAL. {t('footer_rights')}</p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4" /> {t('footer_ssl')}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-gray-600">
                    <Zap className="w-4 h-4" /> {t('footer_online')}
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowLogin(false)} />
            <SignInCard
              onBack={() => setShowLogin(false)}
              onSuccess={(mode: 'login' | 'signup', email: string, data?: any) => handleLoginSuccess(mode, email, data)}
              t={t}
              initialMode={authMode}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
