import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, BarChart, Users, GitCompare, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnalysisTypeCard from "@/components/AnalysisTypeCard";
import VariableSelection from "@/components/VariableSelection";

const Analysis = () => {
  const navigate = useNavigate();
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const analysisTypes = [
    {
      id: "descriptive",
      title: "Descriptive Statistics",
      icon: BarChart,
      description: "Analyze distribution patterns and central tendencies in your variables",
    },
    {
      id: "single-group",
      title: "Single Group Analysis",
      icon: Users,
      description: "Analyze a single group of data with statistical tests",
    },
    {
      id: "multiple-group",
      title: "Multiple Group Analysis",
      icon: GitCompare,
      description: "Compare multiple groups and their statistical differences",
    },
    {
      id: "dependent",
      title: "Dependent Data Analysis",
      icon: Database,
      description: "Analyze related or paired data measurements",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">StatFlow</span>
          </div>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground px-3">PROJECT</h3>
            <div className="bg-sidebar-accent rounded-lg p-3">
              <p className="font-medium text-sidebar-foreground">Demo</p>
              <p className="text-xs text-muted-foreground mt-1">#2256</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-4">
            <p className="text-sm text-sidebar-foreground mb-1">Credit Information</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <Button size="sm" className="ml-auto">
                Buy Credit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!selectedAnalysis ? (
          <>
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Select Analysis Type</h1>
                  <p className="text-muted-foreground mt-1">Choose the statistical analysis method for your data</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
                {analysisTypes.map((type) => (
                  <AnalysisTypeCard
                    key={type.id}
                    title={type.title}
                    icon={type.icon}
                    onClick={() => setSelectedAnalysis(type.id)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <VariableSelection
            analysisType={selectedAnalysis}
            onBack={() => setSelectedAnalysis(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Analysis;
