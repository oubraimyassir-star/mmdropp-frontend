import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2 } from "lucide-react"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar: string
}

export interface TestimonialCardProps {
    author: TestimonialAuthor
    text: string
    href?: string
    className?: string
}

export function TestimonialCard({
    author,
    text,
    href,
    className
}: TestimonialCardProps) {
    const Card = href ? 'a' : 'div'

    return (
        <Card
            {...(href ? { href } : {})}
            className={cn(
                "flex flex-col rounded-3xl border",
                "bg-foreground/[0.02] backdrop-blur-md",
                "border-foreground/10",
                "p-6 text-start",
                "hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10",
                "max-w-[320px] shrink-0",
                "transition-all duration-500",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={author.avatar} alt={author.name} />
                </Avatar>
                <div className="flex flex-col items-start">
                    <h3 className="text-md font-semibold leading-none text-foreground flex items-center gap-1.5">
                        {author.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 fill-primary-400/10" />
                    </h3>
                    <p className="text-sm text-muted">
                        {author.handle}
                    </p>
                </div>
            </div>
            <p className="sm:text-md mt-4 text-sm text-foreground/80">
                {text}
            </p>
        </Card>
    )
}
