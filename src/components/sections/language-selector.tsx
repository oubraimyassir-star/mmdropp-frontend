import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSelector({ value, onChange, placeholder = "Langue" }: { value: string, onChange: (val: string) => void, placeholder?: string }) {
    return (
        <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/40" />
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[140px] bg-transparent border-white/5 hover:border-white/10 transition-colors">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
