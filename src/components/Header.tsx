import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: "HOME", href: "#" },
    { name: "ARTICLES", href: "#articles" },
    { name: "RESEARCH", href: "#research" },
    { name: "VIDEOS", href: "#videos" },
    { name: "ABOUT", href: "#about" },
    { name: "CONTACT", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar with Logo and Search */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Newspaper Style */}
          <div className="text-center flex-1">
            <h1 className="text-5xl md:text-6xl font-academic font-bold text-foreground tracking-wide mb-2">
              IPLR
            </h1>
            <p className="text-xs font-body text-muted-foreground uppercase tracking-[0.2em] border-t border-b border-border py-1">
              INSTITUTE FOR PROFESSIONAL LEARNING & RESEARCH
            </p>
          </div>

          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 absolute right-6 top-6"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-6 animate-fade-in">
            <Input
              type="text"
              placeholder="Search articles, research, and videos..."
              className="w-full max-w-md mx-auto border-t-0 border-l-0 border-r-0 rounded-none focus:ring-0 bg-transparent"
            />
          </div>
        )}
      </div>

      {/* Navigation Tabs - Paper Magazine Style */}
      <div className="border-t border-border bg-background">
        <div className="container mx-auto px-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <nav className="flex items-center space-x-0">
              {navItems.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <a
                    href={item.href}
                    className="px-8 py-4 text-xs font-body font-medium text-foreground uppercase tracking-[0.1em] hover:bg-muted/30 transition-all duration-200 border-b-2 border-transparent hover:border-foreground"
                  >
                    {item.name}
                  </a>
                  {index < navItems.length - 1 && (
                    <Separator orientation="vertical" className="h-6 bg-border" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center justify-between py-4">
            <span className="text-xs font-body uppercase tracking-[0.1em]">Menu</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-xs font-body font-medium text-foreground uppercase tracking-[0.1em] py-3 px-4 text-center hover:bg-muted/30 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;