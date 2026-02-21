import { GlassmorphismProfileCard } from "@/components/ui/profile-card-1";
import { Github, Linkedin, Twitter } from "lucide-react";

export const Component = () => {
    const cardProps = {
        avatarUrl: '/logo.png',
        name: 'SMMADROOP Founder', // Standardizing for the project
        title: 'Lead Digital Strategist',
        bio: 'Pioneering next-gen digital growth. Passionate about helping brands unlock their full social potential.',
        socialLinks: [
            { id: 'github', icon: Github, label: 'GitHub', href: '#' },
            { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', href: '#' },
            { id: 'twitter', icon: Twitter, label: 'Twitter', href: '#' },
        ],
        actionButton: {
            text: 'Contact Me',
            href: '#',
        },
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-[#030014]">
            <GlassmorphismProfileCard {...cardProps} />
        </div>
    );
};

export default function DemoProfile() {
    return <Component />;
}
