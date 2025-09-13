import { Youtube, Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Organization Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-academic font-bold mb-2">IPLR</h3>
              <p className="text-sm font-body opacity-80 leading-relaxed">
                Institute of Policy and Law Reforms - Advancing policy research, legal analysis, and institutional reform through innovative research and publications.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-white/10"
                onClick={() => window.open('https://www.instagram.com/iplr.pk?igsh=b2JjaG1wY3JmbHA0', '_blank')}
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-academic font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              {[
                "Latest Articles",
                "Research Publications",
                "Video Library",
                "About IPLR",
                "Contact Us"
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-body opacity-80 hover:opacity-100 transition-opacity duration-200 hover:underline"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Research Areas */}
          <div className="space-y-4">
            <h4 className="font-academic font-semibold mb-4">Research Areas</h4>
            <nav className="flex flex-col space-y-3">
              {[
                "Legal Research",
                "Policy Analysis", 
                "Constitutional Law",
                "Administrative Law",
                "Reform Studies"
              ].map((area) => (
                <a
                  key={area}
                  href="#"
                  className="text-sm font-body opacity-80 hover:opacity-100 transition-opacity duration-200 hover:underline"
                >
                  {area}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <div>
              <h4 className="font-academic font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm font-body opacity-80 mb-4">
                Subscribe to our newsletter for the latest research and publications.
              </p>
              <div className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button 
                  className="w-full bg-white text-accent hover:bg-white/90 transition-colors duration-300"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm font-body opacity-80">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>15-XX Khayaban-e-Iqbal, DHA Lahore Cantt (Second Floor)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-body opacity-80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@iplr.org</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm font-body opacity-60">
            © 2024 Institute of Policy and Law Reforms. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service", "Academic Standards"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-body opacity-60 hover:opacity-80 transition-opacity duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;