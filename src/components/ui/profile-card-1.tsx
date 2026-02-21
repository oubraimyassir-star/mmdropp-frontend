import { useState } from 'react';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

/**
 * @typedef {object} SocialLink
 */
interface SocialLink {
    id: string;
    icon: LucideIcon;
    label: string;
    href: string;
}

/**
 * @typedef {object} ActionButtonProps
 */
interface ActionButtonProps {
    text: string;
    href: string;
}

interface GlassmorphismProfileCardProps {
    avatarUrl: string;
    name: string;
    title: string;
    bio: string;
    socialLinks?: SocialLink[];
    actionButton: ActionButtonProps;
}

/**
 * --- Glassmorphism Profile Card Component ---
 */
export const GlassmorphismProfileCard = ({
    avatarUrl,
    name,
    title,
    bio,
    socialLinks = [],
    actionButton,
}: GlassmorphismProfileCardProps) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div className="relative w-full max-w-sm mx-auto">
            <div
                className="relative flex flex-col items-center p-8 rounded-3xl border transition-all duration-500 ease-out backdrop-blur-xl bg-foreground/[0.04] border-foreground/10"
                style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div className="w-24 h-24 mb-4 rounded-full p-1 border-2 border-foreground/10 overflow-hidden">
                    <img
                        src={avatarUrl}
                        alt={`${name}'s Avatar`}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e: any) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/6366f1/white?text=${name.charAt(0)}`; }}
                    />
                </div>

                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                <p className="mt-1 text-sm font-medium text-primary-400">{title}</p>
                <p className="mt-4 text-center text-sm leading-relaxed text-muted">{bio}</p>

                <div className="w-1/2 h-px my-6 rounded-full bg-foreground/10" />

                <div className="flex items-center justify-center gap-3">
                    {socialLinks.map((item) => (
                        <SocialButton key={item.id} item={item} setHoveredItem={setHoveredItem} hoveredItem={hoveredItem} />
                    ))}
                </div>

                <ActionButton action={actionButton} />
            </div>

            <div className="absolute inset-0 rounded-3xl -z-10 transition-all duration-500 ease-out blur-2xl opacity-30 bg-gradient-to-r from-teal-500/50 to-blue-500/50" />
        </div>
    );
};

// --- Sub-components ---

const SocialButton = ({ item, setHoveredItem, hoveredItem }: { item: SocialLink, setHoveredItem: (id: string | null) => void, hoveredItem: string | null }) => (
    <div className="relative">
        <a
            href={item.href}
            className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-out group overflow-hidden bg-foreground/5 hover:bg-foreground/10 border border-foreground/10"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label={item.label}
        >
            <div className="relative z-10 flex items-center justify-center">
                <item.icon size={20} className="transition-all duration-200 ease-out text-foreground/60 group-hover:text-foreground" />
            </div>
        </a>
        <Tooltip item={item} hoveredItem={hoveredItem} />
    </div>
);

const ActionButton = ({ action }: { action: ActionButtonProps }) => (
    <a
        href={action.href}
        className="flex items-center gap-2 px-6 py-3 mt-8 rounded-full font-semibold text-base backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.03] active:scale-95 group bg-primary-500 text-white"
        style={{ boxShadow: '0 4px 20px rgba(17, 98, 90, 0.3)' }}
    >
        <span>{action.text}</span>
        <ArrowUpRight size={16} className="transition-transform duration-300 ease-out group-hover:rotate-45" />
    </a>
);

const Tooltip = ({ item, hoveredItem }: { item: SocialLink, hoveredItem: string | null }) => (
    <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-medium whitespace-nowrap transition-all duration-300 ease-out pointer-events-none bg-foreground text-background border-foreground/10 ${hoveredItem === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
        {item.label}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-foreground border-b border-r border-foreground/10" />
    </div>
);
