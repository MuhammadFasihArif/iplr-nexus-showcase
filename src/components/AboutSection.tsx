const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-academic font-bold text-foreground mb-6">
            About IPLR
          </h2>
          <div className="w-24 h-px bg-foreground mx-auto mb-8"></div>
          <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The Institute of Policy and Law Reforms is dedicated to advancing education 
            through innovative research, publications, and professional development programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-academic font-semibold text-foreground mb-4">
              Our Mission
            </h3>
            <p className="font-body text-foreground/80 leading-relaxed">
              We strive to bridge the gap between academic research and practical application, 
              fostering innovation in educational methodologies and professional development practices.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              Our interdisciplinary approach brings together experts from various fields to address 
              the evolving challenges in modern education and workplace learning.
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-6 border border-border rounded-sm">
                <div className="text-3xl font-academic font-bold text-foreground mb-2">150+</div>
                <div className="text-sm font-body text-muted-foreground uppercase tracking-wide">Research Papers</div>
              </div>
              <div className="p-6 border border-border rounded-sm">
                <div className="text-3xl font-academic font-bold text-foreground mb-2">50+</div>
                <div className="text-sm font-body text-muted-foreground uppercase tracking-wide">Faculty Members</div>
              </div>
              <div className="p-6 border border-border rounded-sm">
                <div className="text-3xl font-academic font-bold text-foreground mb-2">25</div>
                <div className="text-sm font-body text-muted-foreground uppercase tracking-wide">Research Areas</div>
              </div>
              <div className="p-6 border border-border rounded-sm">
                <div className="text-3xl font-academic font-bold text-foreground mb-2">10+</div>
                <div className="text-sm font-body text-muted-foreground uppercase tracking-wide">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;