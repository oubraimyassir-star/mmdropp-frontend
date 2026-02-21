'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Filter,
    MoreHorizontal,
    TrendingUp,
    Clock,
    Shield,
    X,
    CreditCard,
    Globe,
    Coins,
    Smartphone,
    Building2,
    Image as ImageIcon,
    CheckCircle2,
    Zap,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';
import { useState } from 'react';


function DepositModal({ onClose, onRefresh }: { onClose: () => void, onRefresh?: () => void }) {
    const [amount, setAmount] = useState("50");
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple' | 'crypto' | 'orange' | 'bank_ma'>('card');
    const [receipt, setReceipt] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDeposit = async () => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error("Non authentifié");

            // 1. If we have a receipt, upload it first
            let receiptUrl = "";
            if (receipt && (paymentMethod === 'orange' || paymentMethod === 'bank_ma')) {
                const formData = new FormData();
                formData.append('file', receipt);
                const uploadRes = await fetch(`${API_BASE_URL}/billing/upload-receipt`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const uploadData = await uploadRes.json();
                receiptUrl = uploadData.receipt_url;
            }

            // 2. Initiate deposit
            const response = await fetch(`${API_BASE_URL}/billing/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    payment_method: paymentMethod,
                    currency: "EUR",
                    receipt_url: receiptUrl
                })
            });

            if (!response.ok) throw new Error("Erreur lors du dépôt");

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                if (onRefresh) {
                    onRefresh();
                } else {
                    window.location.reload();
                }
            }, 2000);
        } catch (error) {
            console.error(error);
            alert("Erreur lors du traitement du dépôt.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="w-full max-w-lg glass-dark border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {isSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                            <Zap className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Dépôt Initié !</h2>
                        <p className="text-white/60 font-medium">Votre demande de recharge de {amount} MAD est en cours de validation.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-primary-500/20 text-primary-400">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Recharger le Solde</h2>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">SMMADROOP Wallet</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Montant à ajouter (MAD)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Méthode de Paiement</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'card', name: 'Carte', icon: CreditCard, color: 'text-blue-400' },
                                        { id: 'paypal', name: 'PayPal', icon: Globe, color: 'text-sky-400' },
                                        { id: 'crypto', name: 'Crypto', icon: Coins, color: 'text-orange-400' },
                                        { id: 'orange', name: 'Orange Money', icon: Smartphone, color: 'text-orange-500' },
                                        { id: 'bank_ma', name: 'Virement', icon: Building2, color: 'text-emerald-400' },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                                                paymentMethod === method.id
                                                    ? "bg-primary-500/10 border-primary-500 text-white"
                                                    : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                            )}
                                        >
                                            <method.icon className={cn("w-5 h-5", method.color)} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{method.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Preuve de Paiement (Reçu Optionnel)</label>
                                <input
                                    type="file"
                                    id="deposit-receipt"
                                    className="hidden"
                                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                                />
                                <label
                                    htmlFor="deposit-receipt"
                                    className={cn(
                                        "flex items-center justify-center gap-3 p-4 rounded-2xl border border-dashed transition-all cursor-pointer",
                                        receipt ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/20 text-white/40 hover:bg-white/10 hover:border-white/40 shadow-inner shadow-black/20"
                                    )}
                                >
                                    {receipt ? <CheckCircle2 className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                    <span className="text-xs font-bold uppercase tracking-widest truncate max-w-full px-2">{receipt ? receipt.name : "Importer le reçu"}</span>
                                </label>
                            </div>

                            <button
                                onClick={handleDeposit}
                                disabled={isProcessing || !amount || ((paymentMethod === 'orange' || paymentMethod === 'bank_ma') && !receipt)}
                                className={cn(
                                    "w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all",
                                    isProcessing ? "bg-white/5 text-white/20" : "bg-primary-500 text-white hover:bg-primary-400"
                                )}
                            >
                                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirmer le Dépôt"}
                            </button>
                        </div>
                    </>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </motion.div>
        </motion.div>
    );
}

function ManageMethodsModal({ onClose }: { onClose: () => void }) {
    const methods = [
        { id: 1, type: 'Visa', last4: '4242', exp: '12/26', icon: CreditCard },
        { id: 2, type: 'MasterCard', last4: '8812', exp: '08/25', icon: CreditCard }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="w-full max-w-lg glass-dark border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-primary-500/20 text-primary-400">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white">Méthodes de Paiement</h2>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Gérez vos cartes et comptes</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {methods.map((method) => (
                        <div key={method.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white/5 text-white/60">
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm tracking-wide uppercase">{method.type} •••• {method.last4}</p>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Expire le {method.exp}</p>
                                </div>
                            </div>
                            <button className="text-white/20 hover:text-red-400 p-2 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <button className="w-full p-6 rounded-3xl border border-dashed border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-3 group">
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Ajouter une nouvelle carte</span>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-5 rounded-[24px] bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all"
                >
                    Fermer
                </button>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </motion.div>
        </motion.div>
    );
}

function TransactionDetailsModal({ transaction, onClose, formatPrice }: { transaction: Transaction, onClose: () => void, formatPrice: (amount: number | string) => string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="w-full max-w-md glass-dark border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className={cn(
                        "p-4 rounded-2xl",
                        transaction.type === 'deposit' ? "bg-emerald-500/20 text-emerald-400" : "bg-primary-500/20 text-primary-400"
                    )}>
                        {transaction.type === 'deposit' ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white">Détails de Transaction</h2>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">ID: {transaction.id}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Description</div>
                        <p className="text-white font-bold">{transaction.desc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Montant</div>
                            <p className={cn(
                                "text-xl font-black tabular-nums",
                                transaction.type === 'deposit' ? "text-emerald-400" : "text-white"
                            )}>
                                {formatPrice(transaction.amount)}
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Statut</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-black uppercase tracking-widest text-emerald-500">{transaction.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Date & Heure</div>
                            <p className="text-white/60 font-bold text-sm">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Type</div>
                            <p className="text-white/60 font-bold text-sm uppercase">{transaction.type}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 rounded-[24px] bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all"
                    >
                        Fermer
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </motion.div>
        </motion.div>
    );
}

export interface Transaction {
    id: string;
    date: string;
    desc: string;
    amount: string;
    status: string;
    type: 'deposit' | 'purchase';
}

export interface BillingData {
    balance: string;
    transactions: Transaction[];
}

interface BillingViewProps {
    billingData: BillingData;
    onRefresh?: () => void;
    formatPrice: (amount: number | string) => string;
    netProfit: number;
}

export function BillingView({ billingData, onRefresh, formatPrice, netProfit }: BillingViewProps) {
    const [showDeposit, setShowDeposit] = useState(false);
    const [showMethods, setShowMethods] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    return (
        <div className="space-y-8">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wallet Balance Card */}
                <div className="lg:col-span-3 p-8 rounded-[40px] bg-gradient-to-br from-primary-500/20 via-primary-500/5 to-transparent border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <MessageCircle className="w-32 h-32 text-primary-400" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <span className="text-white/40 text-sm font-black uppercase tracking-[0.2em]">Support Client</span>
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-white mb-6 tabular-nums tracking-tighter">
                                Besoin d'aide ?
                            </div>
                            <p className="text-white/60 mb-8 max-w-md">
                                Notre équipe est disponible 24/7 pour vous accompagner dans la croissance de vos réseaux sociaux.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://wa.me/212722080441"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-[#25D366]/20 group"
                            >
                                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Discuter avec le support
                            </a>
                        </div>
                    </div>
                </div>

                {/* Side Stats / Security */}
                <div className="space-y-4">
                    {/* Net Profit Card */}
                    <div className="p-8 rounded-[40px] bg-gradient-to-br from-gold-500/20 via-gold-500/5 to-transparent border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <TrendingUp className="w-24 h-24 text-gold-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-2xl bg-gold-500/20 text-gold-400">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Bénéfice Net</span>
                            </div>
                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                {formatPrice(netProfit)}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] glass-dark border border-white/5 bg-white/[0.02] flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Sécurité & KYC</span>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Compte Vérifié</h3>
                            <p className="text-white/30 text-xs font-medium leading-relaxed">
                                Votre compte est entièrement sécurisé et vérifié. Les paiements sont protégés par cryptage AES-256.
                            </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Dernière Connexion</span>
                                <span className="text-white/60 text-[10px] font-black">Il y a 2m</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Activité IP</span>
                                <span className="text-white/60 text-[10px] font-black">192.168.1.1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History Section */}
            <div className="p-8 rounded-[40px] glass-dark border border-white/5 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white/90">Historique des Transactions</h2>
                        <p className="text-xs text-white/40 font-medium">Suivez vos dépenses et rechargements récents</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all w-full md:w-64"
                            />
                        </div>
                        <button className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/20">ID Transaction</th>
                                <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/20">Date</th>
                                <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/20">Description</th>
                                <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/20">Montant</th>
                                <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/20">Statut</th>
                                <th className="text-right py-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/20">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {billingData.transactions.map((tr, i) => (
                                <motion.tr
                                    key={tr.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="py-5 px-2">
                                        <span className="text-[11px] font-black text-white/40 uppercase tracking-tighter group-hover:text-primary-400 transition-colors">{tr.id}</span>
                                    </td>
                                    <td className="py-5 px-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-white/20" />
                                            <span className="text-xs font-bold text-white/60">{tr.date}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center",
                                                tr.type === 'deposit' ? "bg-emerald-500/10 text-emerald-400" : "bg-primary-500/10 text-primary-400"
                                            )}>
                                                {tr.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-tight text-white/80">{tr.desc}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-2">
                                        <span className={cn(
                                            "text-sm font-black tabular-nums",
                                            tr.type === 'deposit' ? "text-emerald-400" : "text-white"
                                        )}>
                                            {formatPrice(tr.amount)}
                                        </span>
                                    </td>
                                    <td className="py-5 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">{tr.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-2 text-right">
                                        <button
                                            onClick={() => setSelectedTransaction(tr)}
                                            className="p-2 rounded-xl hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Affichage de {billingData.transactions.length} sur {billingData.transactions.length} transactions</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Précédent</button>
                        <button className="px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-400">Suivant</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDeposit && (
                    <DepositModal onClose={() => setShowDeposit(false)} onRefresh={onRefresh} />
                )}
                {showMethods && (
                    <ManageMethodsModal onClose={() => setShowMethods(false)} />
                )}
                {selectedTransaction && (
                    <TransactionDetailsModal
                        transaction={selectedTransaction}
                        onClose={() => setSelectedTransaction(null)}
                        formatPrice={formatPrice}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
