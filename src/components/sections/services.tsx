'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Search,
    Video,
    Zap,
    ArrowRight,
    X,
    CreditCard,
    Wallet,
    Coins,
    Smartphone,
    Building2,
    Image as ImageIcon,
    CheckCircle2,
    Instagram as InstagramIcon,
    Youtube as YoutubeIcon,
    Facebook as FacebookIcon,
    Send as TelegramIcon,
    Hash as TwitterIcon,
    MessageCircle as SnapchatIcon,
    Disc as DiscordIcon,
    Music as MusicIcon,
    Twitch as TwitchIcon,
    Star as StarIcon
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { cn } from '@/lib/utils';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number | string;
    unit?: string;
    icon?: any;
    icon_name?: string;
    color: string;
    bg: string;
    bg_color?: string;
    category: string;
    platform: string;
    features: string[];
    min?: number;
    max?: number;
    min_quantity?: number;
    max_quantity?: number;
}

const ICON_MAP: Record<string, any> = {
    InstagramIcon,
    Video,
    YoutubeIcon,
    FacebookIcon,
    TelegramIcon,
    TwitterIcon,
    SnapchatIcon,
    DiscordIcon,
    MusicIcon,
    TwitchIcon,
    StarIcon,
    Globe,
    Zap
};

const CATEGORIES = ["Tous", "Instagram", "TikTok", "YouTube", "Facebook", "Twitter", "Snapchat", "Telegram", "Discord", "Spotify", "Twitch", "SEO"];

const allServices: Service[] = [
    // INSTAGRAM (1-15)
    { id: 1, title: "Instagram Followers [Premium]", description: "Abonnés de haute qualité, profil réel, garantie 30 jours.", price: "2.49 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Haute Qualité", "Garantie 30j", "Vitesse Rapide"], min: 100, max: 100000 },
    { id: 2, title: "Instagram Likes [Vrais]", description: "Likes instantanés de profils actifs, sans perte.", price: "0.89 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Instantané", "Profils Réels", "Sans Perte"], min: 50, max: 50000 },
    { id: 3, title: "Instagram Views [Reels]", description: "Vues pour vos Reels avec une excellente rétention.", price: "0.15 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Max Rétention", "Viral Boost", "Pas de Mot de Passe"], min: 100, max: 1000000 },
    { id: 4, title: "Instagram Auto-Likes [Mensuel]", description: "Likes automatiques sur chaque nouvelle publication.", price: "19.99 MAD / mois", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Bot Automatisé", "Engagement Continu", "Support 24/7"], min: 1, max: 1 },
    { id: 5, title: "Instagram Comments [Custom]", description: "Commentaires personnalisés rédigés par vous ou par IA.", price: "5.50 MAD / 50", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Texte Libre", "Ciblage Langue", "Modération"], min: 10, max: 1000 },
    { id: 6, title: "Instagram Story Views", description: "Vues sur vos stories Instagram pour booster la visibilité.", price: "0.50 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Instantané", "Discret", "Pas de Perte"], min: 100, max: 20000 },
    { id: 7, title: "Instagram Profile Visits", description: "Bousculez l'algorithme avec des visites de profil réelles.", price: "1.20 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Algorithme Boost", "Provenance Mondiale", "Légal"], min: 100, max: 50000 },
    { id: 33, title: "Instagram Followers [Élite]", description: "Abonnés ultra-premium, garantie à vie, profils européens.", price: "12.50 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Garantie à vie", "Ciblage UE", "Service Élite"], min: 50, max: 25000 },
    { id: 34, title: "Instagram Likes [Vitesse Éclair]", description: "100k likes délivrés en moins de 10 minutes.", price: "0.50 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Ultra Rapide", "Pas cher", "Stable"], min: 100, max: 100000 },
    { id: 41, title: "Instagram Power Likes", description: "Likes de comptes avec plus de 50k abonnés.", price: "45.00 MAD / 100", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Explorer Boost", "Haut Authority", "Viral"], min: 10, max: 1000 },
    { id: 44, title: "Instagram Live Stream Views", description: "Spectateurs en direct pendant que vous diffusez.", price: "15.00 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Démarrage 0-5min", "Reste 60min", "Stable"], min: 100, max: 5000 },
    { id: 53, title: "Instagram Save [Algorithm]", description: "Enregistrements pour booster le SEO de vos posts.", price: "0.40 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Algorithm Secret", "Growth Hack", "Sûr"], min: 100, max: 100000 },
    { id: 54, title: "Instagram Mentions [Targeted]", description: "Mentionnez des utilisateurs sur vos photos de manière massive.", price: "25.00 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Ciblage Précis", "Viralité", "Pro-User"], min: 100, max: 10000 },
    { id: 55, title: "Instagram TV Views", description: "Boostez vos vidéos IGTV (Legacy support).", price: "0.10 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Instantané", "Discret", "Stable"], min: 100, max: 100000 },
    { id: 56, title: "Instagram DM Mass Sending", description: "Envoi massif de messages direct à votre audience cible.", price: "55.00 MAD / 1000", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10", category: "Instagram", platform: "Instagram", features: ["Lead Gen", "Custom Text", "High Conversion"], min: 500, max: 50000 },

    // TIKTOK
    { id: 8, title: "TikTok Followers [Real]", description: "Abonnés TikTok stables pour augmenter votre autorité.", price: "4.99 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Profils Actifs", "Safe & Secure", "Livraison Rapide"], min: 100, max: 100000 },
    { id: 9, title: "TikTok Likes [Instant]", description: "Boostez l'engagement de vos vidéos TikTok instantanément.", price: "1.20 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Pas de Chute", "Support 24/7", "Premium Apparence"], min: 100, max: 50000 },
    { id: 10, title: "TikTok Views [For You Page]", description: "Vues ciblées pour aider à passer dans les 'Pour Toi'.", price: "0.10 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["FYP Boost", "Rétention Elevée", "Service sûr"], min: 1000, max: 10000000 },
    { id: 11, title: "TikTok Shares [Viral]", description: "Partages réels pour rendre vos vidéos virales.", price: "0.75 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Growth Hack", "Engagement Pro", "Instantané"], min: 100, max: 50000 },
    { id: 12, title: "TikTok Save [Boost]", description: "Enregistrements de vidéos pour tromper l'algorithme.", price: "0.60 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["SEO Video", "Secret Boost", "Stable"], min: 100, max: 50000 },
    { id: 35, title: "TikTok Followers [Arab Fans]", description: "Abonnés TikTok avec profils et noms arabes.", price: "7.99 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Ciblage Arabe", "Vrais Profils", "Garantie 30j"], min: 50, max: 10000 },
    { id: 42, title: "TikTok Shares [France Only]", description: "Partages réels provenant d'utilisateurs en France.", price: "5.50 MAD / 1000", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Ciblage FR", "Rétention Locale", "Viral"], min: 50, max: 5000 },
    { id: 57, title: "TikTok Live Stream [Concurrent]", description: "Spectateurs stables pour vos lives TikTok.", price: "12.00 MAD / 500", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Stable Live", "Instant", "Algorithm Boost"], min: 100, max: 2000 },
    { id: 58, title: "TikTok Comments [AI Custom]", description: "Commentaires intelligents rédigés par IA sur vos vidéos.", price: "8.50 MAD / 100", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10", category: "TikTok", platform: "TikTok", features: ["Natural Text", "Safe", "Fast"], min: 10, max: 500 },

    // YOUTUBE
    { id: 13, title: "YouTube Subscribers [No Drop]", description: "Abonnés YouTube de haute qualité avec garantie à vie.", price: "15.00 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Anti-Drop", "Sécurisé ADS", "Monétisation OK"], min: 100, max: 10000 },
    { id: 14, title: "YouTube High Retention Views", description: "Vues optimisées pour la monétisation et le SEO.", price: "3.50 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Retention 60s+", "SEO Optimized", "ADS Safe"], min: 1000, max: 1000000 },
    { id: 15, title: "YouTube Watch Time [4000H]", description: "Heures de visionnage pour activer la monétisation.", price: "89.00 MAD / pack", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Monetization Ready", "Qualité Max", "Support Dédié"], min: 1, max: 1 },
    { id: 16, title: "YouTube Likes [Non-Drop]", description: "Likes stables pour vos vidéos YouTube.", price: "2.10 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Garantie 60j", "Livraison Naturelle", "Profils Réels"], min: 100, max: 50000 },
    { id: 17, title: "YouTube Comments [AI]", description: "Commentaires intelligents adaptés à votre contenu.", price: "12.00 MAD / 100", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Rédigé par IA", "Mots-clés SEO", "Naturel"], min: 5, max: 500 },
    { id: 36, title: "YouTube Subscribers [USA Targeting]", description: "Subscribers provenant exclusivement des USA.", price: "45.00 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Geo-Targeted", "High Authority", "Safe"], min: 50, max: 5000 },
    { id: 43, title: "YouTube Views [AdWords Method]", description: "Vues réelles via le réseau Google Ads.", price: "8.50 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["100% Légal Google", "SEO Power", "Retention Max"], min: 500, max: 100000 },
    { id: 66, title: "YouTube Shorts Views [Viral]", description: "Boostez vos Shorts pour atteindre des millions de vues.", price: "0.25 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Shorts Feed", "Instantané", "Sûr"], min: 1000, max: 5000000 },
    { id: 67, title: "YouTube Live Stream [1 Hour]", description: "Spectateurs pour vos diffusions en direct.", price: "18.00 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Stable Live", "Fast Start", "Safe"], min: 100, max: 2000 },
    { id: 68, title: "YouTube Dislikes [Targeted]", description: "Envoyez des avis négatifs (usage stratégique).", price: "4.50 MAD / 1000", icon: YoutubeIcon, color: "text-red-500", bg: "bg-red-500/10", category: "YouTube", platform: "YouTube", features: ["Strategic Use", "Stable", "Safe"], min: 50, max: 5000 },

    // FACEBOOK (18-20, 37, 46, 76-85)
    { id: 18, title: "Facebook Page Likes + Followers", description: "Développez la crédibilité de votre page Facebook.", price: "9.50 MAD / 1000", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Likes Pro", "Followers Inclus", "Stable"], min: 100, max: 50000 },
    { id: 19, title: "Facebook Post Likes [EMOJIS]", description: "Réactions (Love, Haha, Wow) sur vos publications.", price: "1.80 MAD / 1000", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Réactions Mixtes", "Instantané", "Discret"], min: 50, max: 20000 },
    { id: 20, title: "Facebook Video Views", description: "Vues pour vos vidéos et Facebook Watch.", price: "0.90 MAD / 1000", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Ads Monetization", "Global Reach", "High Speed"], min: 500, max: 1000000 },
    { id: 37, title: "Facebook Group Members", description: "Augmentez la taille de votre groupe Facebook.", price: "12.00 MAD / 1000", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Public/Privé OK", "Stable", "Safe"], min: 100, max: 20000 },
    { id: 46, title: "Facebook Live Stream Views", description: "Spectateurs pour vos sessions Live Facebook.", price: "12.00 MAD / 500", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Stable Live", "Instant Start", "Global Reach"], min: 50, max: 2000 },
    { id: 76, title: "Facebook Profile Followers", description: "Abonnés pour votre profil personnel Facebook.", price: "5.50 MAD / 1000", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Real Profiles", "High Retention", "Secure"], min: 100, max: 50000 },
    { id: 77, title: "Facebook Review [5 Stars]", description: "Avis positifs pour votre page ou établissement.", price: "1.50 MAD / avis", icon: FacebookIcon, color: "text-blue-500", bg: "bg-blue-500/10", category: "Facebook", platform: "Facebook", features: ["Verified Quality", "Custom Text", "Safe"], min: 1, max: 10 },

    // TWITTER / X (21-23, 38, 45, 86-95)
    { id: 21, title: "Twitter Followers [Premium]", description: "Abonnés pour votre profil X avec garantie.", price: "12.00 MAD / 1000", icon: TwitterIcon, color: "text-sky-400", bg: "bg-sky-500/10", category: "Twitter", platform: "Twitter", features: ["Garantie 30j", "Profils avec Photo", "Sûr"], min: 100, max: 25000 },
    { id: 22, title: "Twitter Retweets [Viral]", description: "Boostez la portée de vos Tweets instantanément.", price: "3.50 MAD / 1000", icon: TwitterIcon, color: "text-sky-400", bg: "bg-sky-500/10", category: "Twitter", platform: "Twitter", features: ["Instant Speed", "Global Users", "Safe"], min: 50, max: 10000 },
    { id: 23, title: "Twitter Likes [X Boost]", description: "Likes de haute qualité pour vos statuts.", price: "1.90 MAD / 1000", icon: TwitterIcon, color: "text-sky-400", bg: "bg-sky-500/10", category: "Twitter", platform: "Twitter", features: ["Fast Delivery", "Stable", "Unlimited"], min: 50, max: 20000 },
    { id: 38, title: "Twitter Views [Impression Boost]", description: "Améliorez vos statistiques X pour la monétisation.", price: "0.05 MAD / 1000", icon: TwitterIcon, color: "text-sky-400", bg: "bg-sky-500/10", category: "Twitter", platform: "Twitter", features: ["Stats Ads", "Ultra Cheap", "Viral Boost"], min: 1000, max: 10000000 },
    { id: 86, title: "Twitter Poll Votes", description: "Votes pour vos sondages Twitter/X.", price: "1.20 MAD / 1000", icon: TwitterIcon, color: "text-sky-400", bg: "bg-sky-500/10", category: "Twitter", platform: "Twitter", features: ["Custom Choice", "Fast", "Safe"], min: 100, max: 50000 },

    // SNAPCHAT (24, 25, 47)
    { id: 24, title: "Snapchat Followers [Public]", description: "Followers pour profils publics Snapchat.", price: "25.00 MAD / 1000", icon: SnapchatIcon, color: "text-yellow-400", bg: "bg-yellow-500/10", category: "Snapchat", platform: "Snapchat", features: ["New Tech", "Profils Réels", "High Quality"], min: 50, max: 5000 },
    { id: 25, title: "Snapchat Spotlight Views", description: "Vues sur vos vidéos Spotlight pour percer.", price: "1.50 MAD / 1000", icon: SnapchatIcon, color: "text-yellow-400", bg: "bg-yellow-500/10", category: "Snapchat", platform: "Snapchat", features: ["Viral Chance", "Fast Delivery", "No Passwort"], min: 1000, max: 1000000 },
    { id: 47, title: "Snapchat Discovery Boost", description: "Mise en avant de votre Story dans Discover.", price: "150.00 MAD / j", icon: SnapchatIcon, color: "text-yellow-400", bg: "bg-yellow-500/10", category: "Snapchat", platform: "Snapchat", features: ["High Exposure", "Mass Reach", "Exclusive"], min: 1, max: 30 },

    // TELEGRAM (26-28, 39, 48, 96-105)
    { id: 26, title: "Telegram Channel Members", description: "Membres stables pour votre canal ou groupe.", price: "1.20 MAD / 1000", icon: TelegramIcon, color: "text-sky-500", bg: "bg-sky-500/10", category: "Telegram", platform: "Telegram", features: ["Non-Drop", "Global Members", "Auto-Refill"], min: 100, max: 100000 },
    { id: 27, title: "Telegram Post Views", description: "Vues sur vos derniers messages Telegram.", price: "0.05 MAD / 1000", icon: TelegramIcon, color: "text-sky-500", bg: "bg-sky-500/10", category: "Telegram", platform: "Telegram", features: ["One-Time Speed", "Cheap", "Reliable"], min: 100, max: 1000000 },
    { id: 28, title: "Telegram Reations [Premium]", description: "Réactions Premium sur vos posts Telegram.", price: "2.50 MAD / 100", icon: TelegramIcon, color: "text-sky-500", bg: "bg-sky-500/10", category: "Telegram", platform: "Telegram", features: ["Premium Users", "Custom Emojis", "Slow/Fast"], min: 10, max: 1000 },
    { id: 39, title: "Telegram Members [Real Active]", description: "Utilisateurs réels pour votre groupe Telegram.", price: "10.00 MAD / 1000", icon: TelegramIcon, color: "text-sky-500", bg: "bg-sky-500/10", category: "Telegram", platform: "Telegram", features: ["Real Users", "Slow Delivery", "No Ban"], min: 50, max: 5000 },
    { id: 48, title: "Telegram Voice Chat Members", description: "Utilisateurs qui rejoignent votre chat vocal.", price: "15.50 MAD / 500", icon: TelegramIcon, color: "text-sky-500", bg: "bg-sky-500/10", category: "Telegram", platform: "Telegram", features: ["Audio Engagement", "Stable", "Fast"], min: 50, max: 1000 },

    // DISCORD (29, 30, 40)
    { id: 29, title: "Discord Server Members", description: "Membres réels ou bots pour votre serveur.", price: "8.00 MAD / 1000", icon: DiscordIcon, color: "text-indigo-400", bg: "bg-indigo-500/10", category: "Discord", platform: "Discord", features: ["Semi-Real", "Offline/Online", "Stable"], min: 50, max: 5000 },
    { id: 30, title: "Discord Post Reactions", description: "Réactions emojis sur vos messages Discord.", price: "3.50 MAD / 100", icon: DiscordIcon, color: "text-indigo-400", bg: "bg-indigo-500/10", category: "Discord", platform: "Discord", features: ["Any Emoji", "Custom Speed", "Secure"], min: 10, max: 1000 },
    { id: 40, title: "Discord Server Boost [Lvl 3]", description: "Boostez votre serveur au niveau maximum.", price: "35.00 MAD / pack", icon: DiscordIcon, color: "text-indigo-400", bg: "bg-indigo-500/10", category: "Discord", platform: "Discord", features: ["Level 3 Boost", "Nitro Features", "Instant"], min: 1, max: 1 },

    // SPOTIFY (NEW)
    { id: 106, title: "Spotify Artist Followers", description: "Augmentez le nombre de followers sur votre profil artiste.", price: "2.50 MAD / 1000", icon: MusicIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "Spotify", platform: "Spotify", features: ["Artist Boost", "Safe", "Stable"], min: 100, max: 50000 },
    { id: 107, title: "Spotify Track Plays [USA]", description: "Écoutes provenant exclusivement d'utilisateurs aux USA.", price: "1.90 MAD / 1000", icon: MusicIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "Spotify", platform: "Spotify", features: ["Royalty Eligible", "Safe", "GEO-Targeted"], min: 1000, max: 1000000 },
    { id: 108, title: "Spotify Playlist Followers", description: "Boostez la popularité de vos playlists Spotify.", price: "0.80 MAD / 1000", icon: MusicIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "Spotify", platform: "Spotify", features: ["Curator Growth", "Fast", "Secure"], min: 100, max: 50000 },
    { id: 109, title: "Spotify Podcast Plays", description: "Augmentez les écoutes pour vos épisodes de podcast.", price: "3.50 MAD / 1000", icon: MusicIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "Spotify", platform: "Spotify", features: ["Podcast Feed", "Algorithm", "Engagement"], min: 500, max: 100000 },

    // TWITCH (NEW)
    { id: 110, title: "Twitch Channel Followers", description: "Abonnés pour votre chaîne Twitch.", price: "2.50 MAD / 1000", icon: TwitchIcon, color: "text-purple-500", bg: "bg-purple-500/10", category: "Twitch", platform: "Twitch", features: ["Fast Delivery", "Stable", "Safe"], min: 100, max: 10000 },
    { id: 111, title: "Twitch Live Viewers [1 Hour]", description: "Spectateurs en direct pour vos streams.", price: "15.00 MAD / 1000", icon: TwitchIcon, color: "text-purple-500", bg: "bg-purple-500/10", category: "Twitch", platform: "Twitch", features: ["Affiliate Ready", "Instant Start", "Stable"], min: 50, max: 2000 },
    { id: 112, title: "Twitch Clip Views", description: "Boostez les vues de vos meilleurs moments.", price: "0.50 MAD / 1000", icon: TwitchIcon, color: "text-purple-500", bg: "bg-purple-500/10", category: "Twitch", platform: "Twitch", features: ["Viral Clips", "Fast", "High Quality"], min: 1000, max: 100000 },

    // SEO & WEB (31, 32, 49, 50, 113-125)
    { id: 31, title: "Traffic Web Premium", description: "Visiteurs réels du pays de votre choix.", price: "0.99 MAD / 1000", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "SEO", platform: "Web", features: ["Ciblage Géo", "Google Analytics OK", "Stable"], min: 1000, max: 1000000 },
    { id: 32, title: "Backlinks SEO Autorité", description: "Liens depuis des sites DR 50+ pour booster Google.", price: "49.00 MAD / pack", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", category: "SEO", platform: "Web", features: ["Montez en Rank", "Dofollow", "Permanent"], min: 1, max: 1 },
    { id: 49, title: "Trustpilot Reviews [5 Stars]", description: "Avis vérifiés pour votre page Trustpilot.", price: "45.00 MAD / 10", icon: StarIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "SEO", platform: "Web", features: ["Vérifié", "Pas de Suppression", "Premium"], min: 1, max: 10 },
    { id: 50, title: "Google Maps Reviews", description: "Boostez la réputation de votre établissement local.", price: "55.00 MAD / 10", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10", category: "SEO", platform: "Web", features: ["Local Guides", "Géo-Ciblé", "Sûr"], min: 1, max: 10 },
    { id: 113, title: "SEO Audit Complete [IA]", description: "Rapport détaillé sur les failles de votre site.", price: "19.00 MAD / audit", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", category: "SEO", platform: "Web", features: ["Deep Scan", "IA Recommendations", "Action Plan"], min: 1, max: 1 },
];

function OrderModal({ service, onClose, onRefresh, onCreateOrder, formatPrice, currency, currencyRate }: {
    service: Service,
    onClose: () => void,
    onRefresh?: () => void,
    onCreateOrder?: (order: { id: number; name: string; amount: string; cost: number; profit?: number; link?: string; proof_url?: string; customer_name?: string; payment_method?: string }) => void,
    formatPrice: (amount: number | string) => string;
    currency: string;
    currencyRate: number;
}) {
    const [quantity, setQuantity] = useState(1000);
    const [sellingPrice, setSellingPrice] = useState("");
    const [link, setLink] = useState('');
    const [customerName, setCustomerName] = useState(() => {
        try {
            const userData = localStorage.getItem('user_data');
            if (userData) {
                const parsed = JSON.parse(userData);
                return parsed.name || (parsed.firstName && parsed.lastName ? `${parsed.firstName} ${parsed.lastName}` : (parsed.firstName || ''));
            }
        } catch (e) { }
        return '';
    });
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto' | 'apple' | 'orange' | 'bank_ma'>('card');
    const [receipt, setReceipt] = useState<File | null>(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const priceRate = useMemo(() => {
        // Handle both "2.49 MAD / 1000" (old) and 2.49 (new)
        if (typeof service.price === 'number') {
            const unitValueString = service.unit || "1000";
            const unitValue = ["mois", "pack", "avis", "j", "audit"].includes(unitValueString.toLowerCase()) ? 1 : (parseInt(unitValueString) || 1);
            return service.price / unitValue;
        }

        const parts = service.price.split('/');
        const price = parseFloat(parts[0].replace(/[^0-9.-]+/g, "").replace(',', '.')) || 0;
        const unit = parts[1]?.trim().toLowerCase() || "1";
        const unitValue = ["mois", "pack", "avis", "j", "audit"].includes(unit) ? 1 : (parseInt(unit) || 1);
        return price / unitValue;
    }, [service.price, service.unit]);

    const formattedRate = useMemo(() => {
        if (typeof service.price === 'number') {
            return `${formatPrice(service.price)} / ${service.unit || '1000'}`;
        }
        const parts = service.price.split('/');
        const pricePart = parseFloat(parts[0].replace(/[^0-9.-]+/g, ""));
        const unitPart = parts[1] ? `/${parts[1]}` : '';
        return `${formatPrice(pricePart)} ${unitPart}`;
    }, [service.price, service.unit, formatPrice]);

    const quantitySafe = isNaN(quantity) ? 0 : quantity;
    const totalPrice = (priceRate * quantitySafe).toFixed(2);

    // Calculate profit safely
    const sellingPriceNum = parseFloat(sellingPrice.replace(',', '.')) || 0;
    const totalPriceNum = parseFloat(totalPrice) || 0;
    const profit = sellingPrice ? ((sellingPriceNum / currencyRate) - totalPriceNum).toFixed(2) : "0.00";

    const handleOrder = async () => {
        if (!link || !customerName) return;
        setIsOrdering(true);

        try {
            let proofUrl = null;
            if (receipt) {
                const formData = new FormData();
                formData.append('file', receipt);

                try {
                    const uploadRes = await fetch(`${API_BASE_URL}/orders/upload-proof`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
                        body: formData
                    });

                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        proofUrl = uploadData.url;
                    } else {
                        throw new Error('Upload failed');
                    }
                } catch (err) {
                    console.error("Upload error:", err);
                    alert("Attention: Erreur lors de l'envoi de la photo. La commande sera créée sans photo.");
                }
            }

            if (onCreateOrder) {
                onCreateOrder({
                    id: service.id,
                    name: service.title,
                    amount: `${quantity} ${typeof service.price === 'number' ? service.unit : service.price.split('/')[1]?.trim() || "Units"}`,
                    cost: parseFloat(totalPrice),
                    profit: parseFloat(profit),
                    link: link,
                    proof_url: proofUrl || undefined,
                    customer_name: customerName,
                    payment_method: paymentMethod
                });
            }

            setIsOrdering(false);
            setOrderSuccess(true);
            if (onRefresh) onRefresh();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Order process failed:", error);
            setIsOrdering(false);
            alert("Une erreur est survenue lors du traitement de la commande.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="w-full max-w-lg glass-dark border border-foreground/10 rounded-[40px] p-8 md:p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={e => e.stopPropagation()}
            >
                {orderSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10 }}
                                className="z-10"
                            >
                                <Zap className="w-10 h-10 text-emerald-500" />
                            </motion.div>
                            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-foreground">Paiement Reçu !</h2>
                        <p className="text-muted font-medium">Votre commande pour {service.title} via <strong>{
                            paymentMethod === 'card' ? 'Carte Bancaire' :
                                paymentMethod === 'paypal' ? 'PayPal' :
                                    paymentMethod === 'crypto' ? 'Crypto' :
                                        paymentMethod === 'orange' ? 'Orange Money' :
                                            paymentMethod === 'bank_ma' ? 'Virement Bancaire' : 'Apple Pay'
                        }</strong> est en cours de traitement.</p>
                        {(receipt) && (
                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 flex items-center gap-2 justify-center">
                                <CheckCircle2 className="w-3 h-3" />
                                Reçu envoyé pour validation
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Decorative Payment Banner Placeholder */}
                        <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-r from-primary-900/20 via-primary-500/10 to-transparent -z-10 blur-3xl opacity-50" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className={cn("p-4 rounded-2xl relative", service.bg, service.color)}>
                                {service.icon && <service.icon className="w-8 h-8 relative z-10" />}
                                <div className="absolute inset-0 bg-current opacity-20 blur-xl rounded-full" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">{service.title}</h2>
                                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{service.platform} Service</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/20 ml-1">Nom Complet du Client</label>
                                <input
                                    type="text"
                                    placeholder="Votre nom..."
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-medium text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/20 ml-1">Lien du Profil / Publication</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-medium text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all backdrop-blur-sm"
                                />
                            </div>

                            {service.min !== service.max && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/20 ml-1">Quantité</label>
                                        <span className="text-[10px] font-bold text-foreground/40 italic">Min: {service.min} - Max: {service.max}</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const min = service.min_quantity ?? service.min ?? 1;
                                            const max = service.max_quantity ?? service.max ?? 1000000;
                                            setQuantity(Math.min(max, Math.max(min, parseInt(e.target.value) || 0)));
                                        }}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-6 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all backdrop-blur-sm"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-primary-500/5 border border-primary-500/10 flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-500/40 mb-1">Prix de Vente ({currency.toUpperCase()})</p>
                                    <input
                                        type="number"
                                        placeholder="Votre prix..."
                                        value={sellingPrice}
                                        onChange={(e) => setSellingPrice(e.target.value)}
                                        className="bg-transparent text-xl font-black text-foreground focus:outline-none w-full"
                                    />
                                </div>
                                <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40 mb-1">Profit Estimé</p>
                                    <p className="text-xl font-black text-emerald-400 tabular-nums">+{formatPrice(profit)}</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 flex items-center justify-between transition-colors duration-300">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-1">Coût SMMADROOP</p>
                                    <p className="text-2xl font-black text-foreground tabular-nums transition-colors">{formatPrice(totalPrice)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-1">Taux</p>
                                    <p className="text-sm font-bold text-foreground/40">{formattedRate}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/20 ml-1">Méthode de Paiement</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'card', name: 'Carte', icon: CreditCard, color: 'text-blue-400' },
                                        { id: 'paypal', name: 'PayPal', icon: Globe, color: 'text-sky-400' },
                                        { id: 'apple', name: 'Apple / Google', icon: Wallet, color: 'text-foreground' },
                                        { id: 'crypto', name: 'Crypto', icon: Coins, color: 'text-orange-400' },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                                                paymentMethod === method.id
                                                    ? "bg-primary-500/10 border-primary-500 text-foreground"
                                                    : "bg-foreground/5 border-foreground/5 text-foreground/40 hover:bg-foreground/10"
                                            )}
                                        >
                                            <method.icon className={cn("w-5 h-5", method.color)} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{method.name}</span>
                                        </button>
                                    ))}

                                    {[
                                        { id: 'orange', name: 'Orange Money', icon: Smartphone, color: 'text-orange-500' },
                                        { id: 'bank_ma', name: 'Banque Maroc', icon: Building2, color: 'text-emerald-400' },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                                                paymentMethod === method.id
                                                    ? "bg-primary-500/10 border-primary-500 text-foreground"
                                                    : "bg-foreground/5 border-foreground/5 text-foreground/40 hover:bg-foreground/10"
                                            )}
                                        >
                                            <method.icon className={cn("w-5 h-5", method.color)} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{method.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/20 ml-1">Preuve de Paiement (Reçu Optionnel)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="receipt-upload"
                                    />
                                    <label
                                        htmlFor="receipt-upload"
                                        className={cn(
                                            "flex items-center justify-center gap-3 p-4 rounded-2xl border border-dashed transition-all cursor-pointer font-sans",
                                            receipt
                                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                : "bg-foreground/5 border-foreground/20 text-foreground/40 hover:bg-foreground/10 hover:border-foreground/40 shadow-inner shadow-black/5"
                                        )}
                                    >
                                        {receipt ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="text-xs font-bold truncate max-w-[200px]">{receipt.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-5 h-5" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Importer le reçu</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleOrder}
                                disabled={!link || !customerName || isOrdering || ((paymentMethod === 'orange' || paymentMethod === 'bank_ma') && !receipt)}
                                className={cn(
                                    "w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all relative overflow-hidden group",
                                    !link || !customerName || isOrdering
                                        ? "bg-foreground/5 text-foreground/20 cursor-not-allowed border border-foreground/5"
                                        : "bg-primary-500 text-white hover:bg-primary-400 border border-primary-400 shadow-2xl shadow-primary-500/20"
                                )}
                            >
                                {isOrdering ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >
                                        <Zap className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <>
                                        Confirmer la commande
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 text-foreground/20 hover:text-foreground transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

export function ServicesCatalog({ searchQuery = '', onRefresh, onCreateOrder, formatPrice, currency, currencyRate }: {
    searchQuery?: string,
    onRefresh?: () => void,
    onCreateOrder?: (order: { id: number; name: string; amount: string; cost: number; profit?: number; link?: string; proof_url?: string; customer_name?: string; payment_method?: string }) => void,
    formatPrice: (amount: number | string) => string;
    currency: string;
    currencyRate: number;
}) {
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const [backendServices, setBackendServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/services`);
                if (res.ok) {
                    const data = await res.json();
                    // Map backend icons to components
                    const mapped = data.map((s: any) => ({
                        ...s,
                        icon: ICON_MAP[s.icon_name] || Globe,
                        bg: s.bg_color || s.bg // Handle both names
                    }));
                    setBackendServices(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
        };
        fetchServices();
    }, []);

    const servicesToDisplay = backendServices.length > 0 ? backendServices : allServices;

    const filteredServices = useMemo(() => {
        return servicesToDisplay.filter(service => {
            const matchesCategory = activeCategory === "Tous" || service.category === activeCategory || service.platform === activeCategory;
            const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, servicesToDisplay]);

    return (
        <div className="space-y-8">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                            activeCategory === category
                                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                                : "bg-foreground/5 text-muted border-foreground/5 hover:bg-foreground/10 hover:text-foreground"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredServices.map((service) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="group p-8 rounded-[40px] glass-dark border border-foreground/5 hover:border-primary-500/30 transition-all flex flex-col h-full bg-foreground/[0.02]"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", service.bg, service.color)}>
                                        {service.icon && <service.icon className="w-8 h-8" />}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Prix</div>
                                        <div className="text-lg font-black text-foreground transition-colors duration-300">
                                            {(() => {
                                                if (typeof service.price === 'number') {
                                                    return `${formatPrice(service.price)} / ${service.unit || '1000'}`;
                                                }
                                                const parts = (service.price || "").toString().split('/');
                                                const pricePart = parseFloat(parts[0].replace(/[^0-9.-]+/g, "").replace(',', '.')) || 0;
                                                const unitPart = parts[1] ? `/${parts[1].trim()}` : '';
                                                return `${formatPrice(pricePart)} ${unitPart}`;
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-tight group-hover:text-primary-400 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={cn("text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded bg-foreground/5", service.color)}>
                                        {service.platform}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded bg-foreground/5 text-muted">
                                        ID: {service.id}
                                    </span>
                                </div>
                                <p className="text-sm text-muted font-medium leading-relaxed mb-8 flex-grow">
                                    {service.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {(service.features || []).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="w-full py-4 bg-foreground/5 hover:bg-primary-500 text-foreground hover:text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group/btn border border-foreground/5 hover:border-primary-400 shadow-xl hover:shadow-primary-500/20"
                                >
                                    Commander Maintenant
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-foreground/10" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Aucun service trouvé</h3>
                    <p className="text-muted max-w-md">Nous n'avons trouvé aucun service correspondant à votre recherche "{searchQuery}" dans cette catégorie.</p>
                    <button
                        onClick={() => { setActiveCategory("Tous"); }}
                        className="mt-8 text-primary-400 font-bold uppercase tracking-widest text-xs hover:text-primary-300 transition-colors"
                    >
                        Voir tous les services
                    </button>
                </div>
            )}

            <AnimatePresence>
                {selectedService && (
                    <OrderModal
                        key={selectedService.id}
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                        onRefresh={onRefresh}
                        onCreateOrder={onCreateOrder}
                        formatPrice={formatPrice}
                        currency={currency}
                        currencyRate={currencyRate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
