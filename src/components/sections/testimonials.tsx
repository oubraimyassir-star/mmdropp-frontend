import { TestimonialsSection as TestimonialsBase } from "@/components/ui/testimonials-with-marquee"

interface Testimonial {
    author: {
        name: string;
        handle: string;
        avatar: string;
    };
    text: string;
    href?: string;
}

export function TestimonialsSection({
    title,
    description,
    testimonials
}: {
    title: string;
    description: string;
    testimonials: Testimonial[];
}) {
    return (
        <TestimonialsBase
            title={title}
            description={description}
            testimonials={testimonials}
        />
    )
}
