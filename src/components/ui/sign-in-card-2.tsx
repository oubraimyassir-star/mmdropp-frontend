'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from "@/lib/utils"

export function SignInCard({ onBack, onSuccess, t, initialMode = 'login' }: { onBack?: () => void, onSuccess?: (mode: 'login' | 'signup', email: string, data?: any) => void, t: (key: any) => string, initialMode?: 'login' | 'signup' }) {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[0-9]/.test(pwd)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(password);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token })
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsSuccess(true);
                    setTimeout(() => {
                        if (onSuccess) {
                            onSuccess('login', data.user.email, {
                                googleToken: tokenResponse.access_token,
                                ...data.user
                            });
                        }
                    }, 1000);
                } else if (response.status === 401) {
                    setError("Compte introuvable. Veuillez d'abord vous inscrire.");
                    setIsLoading(false);
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || "Échec de la connexion Google.");
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Google Auth Error:", err);
                setError("Erreur de connexion au serveur.");
                setIsLoading(false);
            }
        },
        onError: (err) => {
            setIsLoading(false);
            console.error('Google Login Error:', err);
            setError("Connexion Google échouée.");
        }
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (mode === 'signup') {
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                return;
            }
            if (calculatePasswordStrength(password) < 3) {
                setError("Le mot de passe est trop faible.");
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: fullName, email, password })
                });

                if (response.ok) {
                    setIsSuccess(true);
                    setTimeout(() => {
                        setMode('login');
                        setIsSuccess(false);
                        setError("Compte créé ! Veuillez attendre l'activation par l'admin.");
                    }, 2000);
                } else {
                    const data = await response.json();
                    setError(data.detail || "Échec de l'inscription.");
                }
            } catch (err) {
                setError("Erreur de connexion au serveur.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsSuccess(true);
                    setTimeout(() => {
                        if (onSuccess) {
                            onSuccess('login', data.user.email, {
                                ...data.user,
                                access_token: data.access_token
                            });
                        }
                    }, 1000);
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || "Identifiants invalides.");
                }
            } catch (err) {
                console.error("Login Error:", err);
                setError("Erreur de connexion au serveur.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="relative z-10 w-full max-w-lg px-4 mx-auto">
            <div className="relative bg-white dark:bg-zinc-950 rounded-3xl p-6 md:p-10 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50 shadow-2xl shadow-emerald-500/20">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <ArrowRight className="w-10 h-10 text-emerald-400" />
                                </motion.div>
                            </div>
                            <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter mb-2">{t('auth_success_title')}</h1>
                            <p className="text-zinc-500 font-medium tracking-wide italic">{t('auth_success_desc')}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
                                    {mode === 'login' ? t('auth_welcome_back') : 'Create a Tailark Account'}
                                </h1>
                                <p className="text-zinc-500 text-sm">
                                    {mode === 'login' ? t('auth_login_desc') : 'Welcome! Create an account to get started'}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (isLoading) return;
                                        setIsLoading(true);
                                        setError(null);
                                        try {
                                            loginWithGoogle();
                                        } catch (err) {
                                            console.error("Google login initiation failed:", err);
                                            setError("Impossible d'ouvrir la fenêtre de connexion Google.");
                                            setIsLoading(false);
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-medium rounded-xl transition-all"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 262">
                                                <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                                <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                                <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                                <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                            </svg>
                                            <span>Google</span>
                                        </>
                                    )}
                                </Button>

                                <div className="relative py-4 flex items-center">
                                    <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800 border-dashed"></div>
                                    <span className="mx-3 text-xs text-zinc-400 font-medium whitespace-nowrap">Or continue With</span>
                                    <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800 border-dashed"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <AnimatePresence mode="wait">
                                        {mode === 'signup' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor="fullName" className="text-zinc-700 dark:text-zinc-300 font-medium">{t('auth_placeholder_name')}</Label>
                                                <Input
                                                    id="fullName"
                                                    placeholder="John Doe"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required
                                                    className="bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 rounded-xl py-3 h-auto"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-medium">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 rounded-xl py-3 h-auto"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-medium">{t('auth_placeholder_password')}</Label>
                                            {mode === 'login' && (
                                                <button type="button" className="text-xs text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                                                    {t('auth_forgot')}
                                                </button>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 rounded-xl py-3 h-auto"
                                        />

                                        <AnimatePresence>
                                            {mode === 'signup' && password.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="pt-2 space-y-1"
                                                >
                                                    <div className="flex gap-1 h-1.5">
                                                        {[1, 2, 3, 4].map((level) => (
                                                            <div
                                                                key={level}
                                                                className={cn(
                                                                    "h-full flex-1 rounded-full transition-all duration-300",
                                                                    passwordStrength >= level
                                                                        ? (passwordStrength <= 2 ? "bg-red-500" : passwordStrength === 3 ? "bg-yellow-500" : "bg-emerald-500")
                                                                        : "bg-zinc-200 dark:bg-zinc-800"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-zinc-500 text-right font-medium">
                                                        {passwordStrength <= 2 ? 'Faible' : passwordStrength === 3 ? 'Moyen' : 'Fort'}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {mode === 'signup' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor="confirmPassword" className="text-zinc-700 dark:text-zinc-300 font-medium">Confirmer le mot de passe</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 rounded-xl py-3 h-auto"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl mt-4 hover:opacity-90 transition-opacity"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-zinc-500 border-t-white dark:border-t-black rounded-full animate-spin" />
                                        ) : (
                                            mode === 'login' ? 'Continue' : 'Create Account'
                                        )}
                                    </Button>

                                    {error && (
                                        <p className="text-xs text-red-500 font-medium text-center mt-2">{error}</p>
                                    )}
                                </form>

                                <div className="text-center mt-8">
                                    <p className="text-sm text-zinc-500">
                                        {mode === 'login' ? 'Have an account ?' : 'Already have an account ?'}
                                        <button
                                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                            className="ml-2 font-bold text-black dark:text-white hover:underline uppercase tracking-wider text-xs"
                                        >
                                            {mode === 'login' ? 'Sign In' : t('auth_btn_login')}
                                        </button>
                                    </p>
                                </div>
                            </div>

                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="w-full text-center text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mt-8 transition-all uppercase font-bold tracking-[0.2em]"
                                >
                                    {t('auth_back_home')}
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
