import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FolderOpen, FileText, BarChart3, Search, LogOut, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  name: string;
  date: string;
  credits: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'reports'>('projects');
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "Demo", date: "03/11/2025 09:43", credits: 6 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    setReports(savedReports);
  }, []);

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectName = formData.get("projectName") as string;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      date: new Date().toLocaleString(),
      credits: 0,
    };
    
    setProjects([...projects, newProject]);
    setIsDialogOpen(false);
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    navigate("/");
  };

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

        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === 'projects' ? 'text-sidebar-foreground bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderOpen className="mr-3 h-5 w-5" />
              Projects
              <span className="ml-auto bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {projects.length}
              </span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === 'reports' ? 'text-sidebar-foreground bg-sidebar-accent' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}
              onClick={() => setActiveTab('reports')}
            >
              <FileText className="mr-3 h-5 w-5" />
              Reports
              <span className="ml-auto bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {reports.length}
              </span>
            </Button>
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border space-y-4">
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

          <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">AU</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">User Name</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" side="top" align="start">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{activeTab === 'projects' ? 'Projects' : 'Reports'}</h1>
              <p className="text-muted-foreground mt-1">
                {activeTab === 'projects' ? 'Manage and analyze your datasets' : 'View your saved analysis reports'}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-5 w-5" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Enter a name for your project and upload your dataset
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      placeholder="My Analysis Project"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataset">Upload Dataset</Label>
                    <Input
                      id="dataset"
                      name="dataset"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Project
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'projects' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate("/analysis")}
                    className="group bg-card border border-border rounded-xl p-6 hover:border-primary transition-all cursor-pointer hover:shadow-lg relative"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FolderOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          {project.credits} credits used
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">Last Update: {project.date}</p>
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first project to get started</p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                          Enter a name for your project and upload your dataset
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProject} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectName">Project Name</Label>
                          <Input
                            id="projectName"
                            name="projectName"
                            placeholder="My Analysis Project"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataset">Upload Dataset</Label>
                          <Input
                            id="dataset"
                            name="dataset"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Create Project
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center h-96 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved reports yet</h3>
                  <p className="text-muted-foreground">Export reports from the Results page to save them here</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => navigate("/results")}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-success" />
                      </div>
                      {report.starred && (
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{report.projectName}</h3>
                    <p className="text-sm text-primary mb-2">{report.analysisType}</p>
                    <p className="text-sm text-muted-foreground mb-3">{report.date}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      {report.credits} credits used
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
