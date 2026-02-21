'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreHorizontal, Filter, X, Calendar, DollarSign, Package, Activity } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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

interface OrdersViewProps {
    orders: Order[];
    formatPrice: (amount: number | string) => string;
}

export function OrdersView({ orders, formatPrice }: OrdersViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Historique des Commandes</h2>
                    <p className="text-white/60">Suivez l'état et l'historique de toutes vos commandes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher une commande..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="rounded-[40px] glass-dark border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-widest text-white/40">Service</th>
                                <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Date</th>
                                <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Prix</th>
                                <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Quantité</th>
                                <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Statut</th>
                                <th className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-widest text-white/40">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <td className="py-5 px-8">
                                            <div className="font-bold text-white text-sm">{order.name}</div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className="text-xs font-medium text-white/60 tabular-nums">{order.date}</span>
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className="text-xs font-bold text-white tabular-nums">{formatPrice(order.cost + (order.profit || 0))}</span>
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className="text-xs font-bold text-white tabular-nums">{order.amount}</span>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                order.bg, order.color
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full mr-2", order.color.replace('text-', 'bg-'))} />
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 rounded-xl hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-white/40 font-medium">
                                        Aucune commande trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[32px] p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-white mb-2">Détails de la Commande</h3>
                                <p className="text-white/40 text-sm">ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Service</div>
                                        <div className="font-bold text-white max-w-[250px] truncate" title={selectedOrder.name}>{selectedOrder.name}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Coût</div>
                                        </div>
                                        <div className="font-black text-xl text-white">
                                            {selectedOrder.cost ? formatPrice(selectedOrder.cost) : '0.00 MAD'}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Vente</div>
                                        </div>
                                        <div className="font-black text-xl text-white">
                                            {formatPrice((selectedOrder.cost || 0) + (selectedOrder.profit || 0))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 col-span-2">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Quantité</div>
                                        </div>
                                        <div className="font-black text-xl text-white">
                                            {selectedOrder.amount}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Date</div>
                                            <div className="font-bold text-white">{selectedOrder.date}</div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        selectedOrder.bg, selectedOrder.color
                                    )}>
                                        {selectedOrder.status}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
