import { Mail, MapPin, Send, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-academic font-bold text-foreground mb-6">
            Contact Us
          </h2>
          <div className="w-24 h-px bg-foreground mx-auto mb-8"></div>
          <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Get in touch with our research team or inquire about collaboration opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-academic font-semibold text-foreground mb-6">
              Get in Touch
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 border border-border rounded-sm">
                  <Mail className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h4 className="font-body font-semibold text-foreground mb-1">Email</h4>
                  <p className="font-body text-muted-foreground">research@iplr.org</p>
                  <p className="font-body text-muted-foreground">info@iplr.org</p>
                </div>
              </div>


              <div className="flex items-start space-x-4">
                <div className="p-3 border border-border rounded-sm">
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h4 className="font-body font-semibold text-foreground mb-1">Address</h4>
                  <p className="font-body text-muted-foreground">15-XX Khayaban-e-Iqbal<br />DHA Lahore Cantt<br />(Second Floor)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 border border-border rounded-sm">
                  <Instagram className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h4 className="font-body font-semibold text-foreground mb-1">Instagram</h4>
                  <a 
                    href="https://www.instagram.com/iplr.pk?igsh=b2JjaG1wY3JmbHA0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-body text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    @iplr.pk
                  </a>
                  <p className="font-body text-xs text-muted-foreground mt-1">Follow us for updates and insights</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h4 className="font-academic font-semibold text-foreground mb-4">Office Hours</h4>
              <div className="space-y-2 font-body text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-border p-8 rounded-sm">
            <h3 className="text-2xl font-academic font-semibold text-foreground mb-6">
              Send a Message
            </h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input 
                    className="rounded-none border-border focus:ring-1 focus:ring-foreground"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input 
                    className="rounded-none border-border focus:ring-1 focus:ring-foreground"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Email
                </label>
                <Input 
                  type="email"
                  className="rounded-none border-border focus:ring-1 focus:ring-foreground"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input 
                  className="rounded-none border-border focus:ring-1 focus:ring-foreground"
                  placeholder="Research inquiry, collaboration, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea 
                  rows={5}
                  className="rounded-none border-border focus:ring-1 focus:ring-foreground resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <Button 
                type="submit"
                className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 font-body font-medium py-3 transition-all duration-300"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;