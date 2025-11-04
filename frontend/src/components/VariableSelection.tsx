import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, ChevronRight, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VariableSelectionProps {
  analysisType: string;
  onBack: () => void;
}

const VariableSelection = ({ analysisType, onBack }: VariableSelectionProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

  const mockVariables = [
    { id: "1", name: "d2 - d2", type: "Scale" },
    { id: "2", name: "d5 - d5", type: "Scale" },
    { id: "3", name: "v1 - v1", type: "Scale" },
    { id: "4", name: "Group - Group_R7269", type: "Nominal" },
  ];

  const handleSubmit = () => {
    navigate("/results");
  };

  return (
    <>
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <BarChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Descriptive Statistics</h1>
              <p className="text-sm text-muted-foreground">Analyze distribution patterns and central tendencies</p>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center gap-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`text-sm font-medium ${step === 1 ? 'text-success' : step > 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Variable Selection
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span className={`text-sm font-medium ${step === 2 ? 'text-success' : step > 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Split Variable
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
            <span className={`text-sm font-medium ${step === 3 ? 'text-success' : 'text-muted-foreground'}`}>
              Review
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Steps */}
        <div className="w-80 border-r border-border p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{step === 1 ? 'Variable Selection' : step === 2 ? 'Split Variable' : 'Review'}</h3>
            <p className="text-sm text-muted-foreground">
              {step === 1 
                ? 'Select variables for analysis' 
                : step === 2 
                ? 'Optional grouping variable' 
                : 'Review your selections'}
            </p>
          </div>

          {step === 1 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Requirements</p>
              <p className="text-xs text-muted-foreground">1 variables nominal or ordinal or scale</p>
            </div>
          )}

          <div className="space-y-2">
            <div className={`p-3 rounded-lg ${step === 1 ? 'bg-success/10 border-2 border-success' : 'bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Variable Selection</span>
                {step > 1 && <span className="text-xs text-success">{selectedVariables.length}</span>}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${step === 2 ? 'bg-success/10 border-2 border-success' : 'bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Split Variable</span>
                {step > 2 && <span className="text-xs text-success">1</span>}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${step === 3 ? 'bg-success/10 border-2 border-success' : 'bg-muted/50'}`}>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            View Dataset
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search variables..." className="pl-10" />
              </div>

              <div className="space-y-2">
                {mockVariables.map((variable) => (
                  <div
                    key={variable.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedVariables.includes(variable.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedVariables([...selectedVariables, variable.id]);
                          } else {
                            setSelectedVariables(selectedVariables.filter(id => id !== variable.id));
                          }
                        }}
                      />
                      <span className="font-medium">{variable.name}</span>
                    </div>
                    <span className="text-sm bg-muted px-3 py-1 rounded-full">{variable.type}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={selectedVariables.length === 0}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                You can select a maximum of 1 variable in this step. The selected variable will be used to group the results.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Checkbox defaultChecked />
                    <span className="font-medium">d1 - d1_R7269</span>
                  </div>
                  <span className="text-sm bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-3 py-1 rounded-full">Nominal</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Analysis Information</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Credit Information</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                        <span className="text-sm">2 credits will be used</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Report Settings</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Decimal Separator:</span>
                          <span className="text-sm font-medium">Dot (.)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Decimal Places:</span>
                          <span className="text-sm font-medium">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview</p>
                  <p className="text-sm font-medium">Preview Number: 1234.568</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  Submit Analysis
                  ✓
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Help */}
        <div className="w-80 border-l border-border p-6 bg-muted/20">
          <h3 className="font-semibold mb-4">Analysis Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Help</p>
              <p className="text-sm text-muted-foreground">
                Descriptive statistics summarize the central tendency, dispersion, and shape of a dataset's distribution.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Examples</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success mt-0.5">✓</span>
                  <span>Examining age distribution in a sample</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success mt-0.5">✓</span>
                  <span>Calculating mean and median of income data</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success mt-0.5">✓</span>
                  <span>Finding minimum, maximum, and range values of variables</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariableSelection;
