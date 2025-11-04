import { LucideIcon } from "lucide-react";

interface AnalysisTypeCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
}

const AnalysisTypeCard = ({ title, icon: Icon, onClick }: AnalysisTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group bg-card border-2 border-success/20 rounded-2xl p-6 hover:border-success hover:shadow-lg hover:shadow-success/10 transition-all cursor-pointer"
    >
      <div className="w-16 h-16 bg-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-semibold text-lg leading-tight">{title}</h3>
    </div>
  );
};

export default AnalysisTypeCard;
