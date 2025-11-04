import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">{language === 'en' ? 'English' : 'Türkçe'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer ${language === 'en' ? 'bg-gray-100' : ''}`}
        >
          <span className="mr-2">🇬🇧</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('tr')}
          className={`cursor-pointer ${language === 'tr' ? 'bg-gray-100' : ''}`}
        >
          <span className="mr-2">🇹🇷</span>
          Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
