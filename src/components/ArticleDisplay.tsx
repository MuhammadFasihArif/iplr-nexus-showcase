import { useState, useEffect } from "react";
import { Calendar, User, Clock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

const ArticleDisplay = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database articles to match the interface
      const transformedArticles: Article[] = (data || []).map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author,
        date: format(new Date(article.created_at), 'MMMM dd, yyyy'),
        readTime: `${Math.ceil(article.content.length / 200)} min read`,
        category: article.category,
        featured: article.featured,
      }));

      setArticles(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to dummy data if there's an error
      setArticles(dummyArticles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const dummyArticles: Article[] = [
    {
      id: "1",
      title: "The Future of Educational Technology in Professional Learning",
      content: `The landscape of professional learning is rapidly evolving, driven by technological innovations that are reshaping how we acquire, process, and apply knowledge. In recent years, we have witnessed a paradigm shift from traditional classroom-based learning to more flexible, technology-enhanced educational experiences.

      Artificial Intelligence and machine learning algorithms are now being integrated into learning management systems, providing personalized learning paths that adapt to individual learning styles and progress rates. This personalization ensures that learners receive content that is most relevant to their current skill level and professional goals.

      Virtual and Augmented Reality technologies are creating immersive learning environments that allow professionals to practice skills in simulated real-world scenarios. Medical professionals can perform virtual surgeries, engineers can design and test structures in virtual environments, and business leaders can navigate complex organizational challenges through realistic simulations.

      The rise of microlearning has made it possible for busy professionals to acquire new skills through bite-sized learning modules that can be consumed during short breaks or commutes. This approach recognizes the time constraints faced by working professionals while maintaining learning effectiveness.

      Furthermore, blockchain technology is beginning to play a role in credential verification, ensuring that professional certifications and achievements are securely recorded and easily verifiable across institutions and organizations.

      As we look toward the future, the integration of these technologies will continue to break down barriers to professional development, making high-quality education more accessible, flexible, and relevant to the rapidly changing demands of the modern workplace.`,
      author: "Dr. Sarah Chen",
      date: "March 15, 2024",
      readTime: "8 min read",
      category: "Educational Technology",
      featured: true
    },
    {
      id: "2",
      title: "Sustainable Learning: Building Eco-Friendly Educational Practices",
      content: `Sustainability in education extends far beyond environmental considerations—it encompasses creating learning systems that can adapt, evolve, and thrive over time while minimizing their ecological footprint and maximizing social impact.

      Green campus initiatives are becoming increasingly important as educational institutions recognize their responsibility to model sustainable practices. Solar-powered classrooms, rainwater harvesting systems, and waste reduction programs are not just environmental measures but also powerful teaching tools that demonstrate sustainability principles in action.

      Digital transformation in education has significantly reduced paper consumption and travel requirements. Online learning platforms, digital libraries, and virtual collaboration tools have made it possible to deliver high-quality education while reducing carbon emissions associated with traditional educational delivery methods.

      The concept of circular learning emphasizes the reuse and adaptation of educational content across different contexts and learner groups. Instead of creating new materials from scratch, educators are learning to modify and repurpose existing resources, reducing waste and development time while maintaining educational quality.

      Community-based learning initiatives are fostering local connections and reducing the need for long-distance travel to access educational opportunities. These programs leverage local expertise and resources, creating more resilient and sustainable educational ecosystems.

      Sustainable learning also involves developing learners' capacity to think critically about environmental and social challenges, preparing them to become responsible citizens and professionals who can contribute to building a more sustainable future for all.`,
      author: "Prof. Michael Rodriguez",
      date: "March 12, 2024",
      readTime: "6 min read",
      category: "Sustainability"
    },
    {
      id: "3",
      title: "Research Methodologies in the Digital Age: New Approaches to Knowledge Discovery",
      content: `The digital revolution has fundamentally transformed research methodologies across all disciplines, introducing new tools, techniques, and philosophical approaches to knowledge discovery and validation.

      Big data analytics has enabled researchers to process and analyze datasets of unprecedented size and complexity. Machine learning algorithms can identify patterns and correlations that would be impossible to detect through traditional statistical methods, opening new avenues for scientific discovery and understanding.

      Digital ethnography and online research methods have expanded the scope of social science research, allowing researchers to study communities, behaviors, and phenomena that exist primarily in digital spaces. These methods require new ethical frameworks and technical skills but offer unique insights into contemporary human experience.

      Collaborative research platforms have made it possible for researchers from around the world to work together on projects, sharing data, resources, and expertise in real-time. This global collaboration is accelerating the pace of discovery and ensuring that research benefits from diverse perspectives and approaches.

      Open science initiatives are promoting transparency and reproducibility in research by making data, methodologies, and findings freely available to the global research community. This openness is fostering innovation and ensuring that research findings can be verified and built upon by other researchers.

      The integration of artificial intelligence in research processes is automating many routine tasks, allowing researchers to focus on higher-level analysis and interpretation. AI tools can assist with literature reviews, data collection, hypothesis generation, and even writing, augmenting human creativity and productivity.

      As research methodologies continue to evolve, researchers must develop new competencies while maintaining the fundamental principles of rigor, ethics, and validity that have always been central to quality research.`,
      author: "Dr. Amanda Williams",
      date: "March 10, 2024",
      readTime: "10 min read",
      category: "Research Methods"
    },
    {
      id: "4",
      title: "The Psychology of Adult Learning: Understanding Motivation and Engagement",
      content: `Adult learning differs significantly from childhood education in terms of motivation, learning preferences, and the barriers that learners face. Understanding these differences is crucial for designing effective professional development programs.

      Self-directed learning is a hallmark of adult education. Adult learners typically come to educational experiences with clear goals and expectations, seeking knowledge and skills that directly apply to their personal or professional contexts. This intrinsic motivation can be a powerful driver of learning success when properly harnessed.

      Experience plays a central role in adult learning. Adults bring rich backgrounds of knowledge, skills, and life experiences that can serve as both resources and potential obstacles to new learning. Effective adult education programs recognize and build upon these existing foundations while helping learners overcome outdated assumptions or practices.

      Time constraints and competing priorities are significant challenges for adult learners. Unlike traditional students, adults must balance learning with work responsibilities, family obligations, and other commitments. Flexible scheduling, modular content delivery, and recognition of prior learning can help address these challenges.

      The fear of failure or appearing incompetent can be a significant barrier for adult learners, particularly when learning involves technology or areas outside their expertise. Creating supportive learning environments that normalize struggle and celebrate progress is essential for maintaining learner engagement and confidence.

      Social learning and peer interaction are particularly valuable for adult learners, who can learn as much from their colleagues' experiences as from formal instruction. Group projects, discussion forums, and mentoring relationships can enhance learning outcomes while building professional networks.

      Understanding these psychological factors enables educators to design learning experiences that respect adult learners' autonomy, leverage their experience, and address their practical needs while fostering deep, meaningful learning.`,
      author: "Dr. James Park",
      date: "March 8, 2024",
      readTime: "7 min read",
      category: "Learning Psychology"
    }
  ];

  return (
    <section id="full-articles" className="py-16 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-academic font-bold text-foreground mb-4">
            Featured Articles
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            In-depth articles exploring the latest trends, research, and insights in professional learning and development
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-8 border border-border/50 animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {articles.map((article) => (
            <Card 
              key={article.id} 
              className="p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card"
            >
              {/* Article Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    variant="secondary" 
                    className="font-body text-xs"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    {article.category}
                  </Badge>
                  {article.featured && (
                    <Badge 
                      variant="default" 
                      className="font-body text-xs bg-accent text-accent-foreground"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-2xl font-academic font-bold text-foreground mb-4 leading-tight">
                  {article.title}
                </h3>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground font-body">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-gray max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="font-body text-foreground/90 leading-relaxed mb-4 text-justify">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Article Footer */}
              <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="font-body">
                    Share Article
                  </Button>
                  <Button variant="ghost" size="sm" className="font-body text-muted-foreground">
                    Save for Later
                  </Button>
                </div>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="font-body bg-foreground text-background hover:bg-foreground/90"
                >
                  Read More
                </Button>
              </div>
            </Card>
            ))}
          </div>
        )}

        {/* Load More Articles */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="rounded-none border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-body font-medium px-8 py-3 uppercase tracking-[0.1em] text-xs transition-all duration-300"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArticleDisplay;