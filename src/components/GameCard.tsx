import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function GameCard({ title, description, icon, onClick }: GameCardProps) {
  return (
    <Card className="w-[300px] h-[400px] p-6 flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 bg-accent/50 backdrop-blur-sm">
      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-float">
        {icon}
      </div>
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onClick} className="w-full">
        Играть
      </Button>
    </Card>
  );
}