import { SignInCard } from "@/components/ui/sign-in-card-2";
import { motion } from "framer-motion";

export function LoginSection({ onBack, onSuccess, t, initialMode = 'login' }: { onBack: () => void, onSuccess?: (mode: 'login' | 'signup', email: string) => void, t: (key: any) => string, initialMode?: 'login' | 'signup' }) {
    return (
        <div className="fixed inset-0 z-[100] bg-[#030014] flex items-center justify-center overflow-hidden">
            {/* Background elements matched to the theme */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-700/10 blur-[120px] rounded-full animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative z-10 w-full flex justify-center"
            >
                <SignInCard onBack={onBack} onSuccess={onSuccess} t={t} initialMode={initialMode} />
            </motion.div>
        </div>
    );
}
