import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoreTeamMemberCardProps {
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export function CoreTeamMemberCard({ name, title, description, imageUrl }: CoreTeamMemberCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          {imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-primary" 
              />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-xl font-academic font-bold text-foreground mb-1">
              {name}
            </CardTitle>
            <p className="text-sm font-body text-primary font-medium">
              {title}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground font-body leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

