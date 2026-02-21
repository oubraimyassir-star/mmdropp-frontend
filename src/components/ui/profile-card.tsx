"use client"

import { useState, useEffect } from "react"

interface ProfileCardProps {
    name?: string
    title?: string
    avatarUrl?: string
    backgroundUrl?: string
    likes?: number
    posts?: number
}

export function ProfileCard({
    name = "John Doe",
    title = "SMMADROOP Pro Member | Scaling Digital Growth.",
    avatarUrl = "https://i.ibb.co/Kc3MTRNm/caarton-character.png",
    backgroundUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    likes = 1240,
    posts = 86,
}: ProfileCardProps) {
    const [isFollowing, setIsFollowing] = useState(false)
    const [expProgress, setExpProgress] = useState(0)
    const [animatedLikes, setAnimatedLikes] = useState(0)
    const [animatedPosts, setAnimatedPosts] = useState(0)

    // Animate experience bar
    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setExpProgress((prev) => {
                    if (prev >= 65) {
                        clearInterval(interval)
                        return 65
                    }
                    return prev + 1
                })
            }, 20)
            return () => clearInterval(interval)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    // Animate counters
    useEffect(() => {
        const duration = 2000
        const steps = 60
        const stepDuration = duration / steps

        const likesIncrement = likes / steps
        const postsIncrement = posts / steps

        let currentStep = 0

        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                currentStep++
                setAnimatedLikes(Math.min(Math.floor(likesIncrement * currentStep), likes))
                setAnimatedPosts(Math.min(Math.floor(postsIncrement * currentStep), posts))

                if (currentStep >= steps) {
                    clearInterval(interval)
                }
            }, stepDuration)
            return () => clearInterval(interval)
        }, 500)

        return () => clearTimeout(timer)
    }, [likes, posts])

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
                {/* Header with background */}
                <div className="relative h-48 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] overflow-hidden">
                    <img
                        src={backgroundUrl || "/placeholder.svg"}
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />

                    {/* Follow button */}
                    <button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`absolute top-6 right-6 rounded-full px-6 py-2.5 font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${isFollowing
                            ? "bg-white/10 text-white border border-white/20"
                            : "bg-white text-black hover:scale-105 active:scale-95"
                            }`}
                    >
                        {isFollowing ? "Following" : "Follow"}
                        <span className="ml-2">{isFollowing ? "✓" : "+"}</span>
                    </button>
                </div>

                {/* Profile content */}
                <div className="px-8 pb-8 -mt-14 relative z-10">
                    {/* Avatar */}
                    <div className="relative w-28 h-28 mb-6 group">
                        <div className="w-full h-full rounded-[2rem] border-4 border-[#030014] overflow-hidden bg-[#030014] shadow-2xl transition-transform group-hover:scale-105">
                            <img src={avatarUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Experience bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">experience level</span>
                            <span className="text-xs font-bold text-primary-400">LVL 24</span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 via-yellow-500 via-green-500 to-blue-500 transition-all duration-1000 ease-out"
                                style={{ width: `${expProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Name and title */}
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">{name}</h2>
                    <p className="text-white/40 text-sm leading-relaxed mb-8 font-medium italic">"{title}"</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-t border-b border-white/5">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white mb-1">{animatedPosts}</div>
                            <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Commandes</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-2xl font-black text-primary-400 mb-1">PRO</div>
                            <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Statut</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
