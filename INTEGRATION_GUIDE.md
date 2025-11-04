# Frontend-Backend Integration Guide

This guide shows how to integrate the React frontend with the Express backend API.

## Table of Contents
1. [Setup API Client](#1-setup-api-client)
2. [Configure Environment](#2-configure-environment)
3. [Update Authentication](#3-update-authentication)
4. [Update Dashboard](#4-update-dashboard)
5. [Add Dataset Upload](#5-add-dataset-upload)
6. [Connect Analysis Flow](#6-connect-analysis-flow)
7. [Display Results](#7-display-results)
8. [Add Credits Display](#8-add-credits-display)

---

## 1. Setup API Client

Create a new file `frontend/src/lib/api.ts`:

```typescript
// frontend/src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  // Auth endpoints
  auth = {
    register: (name: string, email: string, password: string) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),

    login: (email: string, password: string) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    getMe: () => this.request('/auth/me'),

    updateProfile: (name: string, email: string) =>
      this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
      }),
  };

  // Project endpoints
  projects = {
    create: (name: string, description?: string) =>
      this.request('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      }),

    getAll: () => this.request('/projects'),

    getOne: (id: string) => this.request(`/projects/${id}`),

    update: (id: string, data: any) =>
      this.request(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request(`/projects/${id}`, {
        method: 'DELETE',
      }),

    toggleStar: (id: string) =>
      this.request(`/projects/${id}/star`, {
        method: 'PATCH',
      }),
  };

  // Dataset endpoints
  datasets = {
    upload: async (file: File, projectId: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/datasets/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    },

    getAll: () => this.request('/datasets'),

    getOne: (id: string) => this.request(`/datasets/${id}`),

    getVariables: (id: string) => this.request(`/datasets/${id}/variables`),

    delete: (id: string) =>
      this.request(`/datasets/${id}`, {
        method: 'DELETE',
      }),
  };

  // Analysis endpoints
  analysis = {
    create: (data: any) =>
      this.request('/analysis', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getAll: (projectId?: string) => {
      const params = projectId ? `?projectId=${projectId}` : '';
      return this.request(`/analysis${params}`);
    },

    getOne: (id: string) => this.request(`/analysis/${id}`),

    delete: (id: string) =>
      this.request(`/analysis/${id}`, {
        method: 'DELETE',
      }),

    toggleStar: (id: string) =>
      this.request(`/analysis/${id}/star`, {
        method: 'PATCH',
      }),
  };

  // Report endpoints
  reports = {
    create: (analysisId: string) =>
      this.request('/reports', {
        method: 'POST',
        body: JSON.stringify({ analysisId }),
      }),

    getAll: (projectId?: string) => {
      const params = projectId ? `?projectId=${projectId}` : '';
      return this.request(`/reports${params}`);
    },

    getOne: (id: string) => this.request(`/reports/${id}`),

    delete: (id: string) =>
      this.request(`/reports/${id}`, {
        method: 'DELETE',
      }),

    toggleStar: (id: string) =>
      this.request(`/reports/${id}/star`, {
        method: 'PATCH',
      }),

    export: (id: string) => this.request(`/reports/${id}/export`),
  };

  // User/Credits endpoints
  users = {
    getCredits: () => this.request('/users/credits'),

    addCredits: (amount: number) =>
      this.request('/users/credits/add', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),

    getCreditHistory: () => this.request('/users/credits/history'),
  };
}

export const api = new ApiClient();
```

## 2. Configure Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Update Authentication

Update `frontend/src/pages/Auth.tsx`:

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// ... other imports

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isLogin) {
        // Login
        const response = await api.auth.login(email, password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        navigate("/dashboard");
      } else {
        // Register
        const name = formData.get("name") as string;
        const response = await api.auth.register(name, email, password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast({
          title: "Account created!",
          description: `Welcome ${name}! You have ${response.user.credits} credits.`,
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component
};
```

## 4. Update Dashboard

Update `frontend/src/pages/Dashboard.tsx`:

```typescript
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// ... other imports

interface Project {
  _id: string;
  name: string;
  description?: string;
  creditsUsed: number;
  createdAt: string;
  datasetId?: {
    name: string;
    fileName: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'projects' | 'reports'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCredits, setUserCredits] = useState(0);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const creditsResponse = await api.users.getCredits();
        setUserCredits(creditsResponse.credits);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await api.projects.getAll();
        setProjects(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'projects') {
      fetchProjects();
    }
  }, [activeTab]);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.reports.getAll();
        setReports(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch reports",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectName = formData.get("projectName") as string;
    const projectDescription = formData.get("projectDescription") as string;
    
    try {
      const response = await api.projects.create(projectName, projectDescription);
      setProjects([response.data, ...projects]);
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await api.projects.delete(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/");
  };

  // Update credit display
  const renderCreditInfo = () => (
    <div className="bg-sidebar-accent rounded-lg p-4">
      <p className="text-sm text-sidebar-foreground mb-1">Credit Information</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">{userCredits}</span>
        </div>
        <Button size="sm" className="ml-auto">
          Buy Credit
        </Button>
      </div>
    </div>
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // ... rest of the component with updated rendering
};
```

## 5. Add Dataset Upload

Create `frontend/src/components/DatasetUpload.tsx`:

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DatasetUploadProps {
  projectId: string;
  onUploadSuccess: () => void;
}

export const DatasetUpload = ({ projectId, onUploadSuccess }: DatasetUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await api.datasets.upload(file, projectId);
      
      toast({
        title: "Success",
        description: "Dataset uploaded successfully",
      });
      
      setFile(null);
      onUploadSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload dataset",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="dataset-file" className="cursor-pointer">
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              CSV, Excel (.xls, .xlsx) files up to 10MB
            </p>
            {file && (
              <p className="text-sm font-medium mt-4">
                Selected: {file.name}
              </p>
            )}
          </div>
          <Input
            id="dataset-file"
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {file && (
        <Button 
          onClick={handleUpload} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Upload Dataset"}
        </Button>
      )}
    </div>
  );
};
```

## 6. Connect Analysis Flow

Update `frontend/src/components/VariableSelection.tsx`:

```typescript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// ... other imports

interface Variable {
  name: string;
  label: string;
  type: string;
}

const VariableSelection = ({ analysisType, onBack, projectId, datasetId }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [splitVariable, setSplitVariable] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch variables from backend
  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await api.datasets.getVariables(datasetId);
        setVariables(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch variables",
          variant: "destructive",
        });
      }
    };

    if (datasetId) {
      fetchVariables();
    }
  }, [datasetId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const analysisData = {
        projectId,
        datasetId,
        analysisType,
        selectedVariables: selectedVariables.map(varName => {
          const variable = variables.find(v => v.name === varName);
          return {
            variableName: varName,
            variableType: variable?.type || 'Scale'
          };
        }),
        splitVariable: splitVariable ? {
          variableName: splitVariable,
          variableType: variables.find(v => v.name === splitVariable)?.type || 'Nominal'
        } : undefined,
        settings: {
          decimalSeparator: 'dot',
          decimalPlaces: 3
        }
      };

      const response = await api.analysis.create(analysisData);
      
      toast({
        title: "Success",
        description: "Analysis completed successfully",
      });
      
      navigate(`/results?analysisId=${response.data._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Analysis failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of the component
};
```

## 7. Display Results

Update `frontend/src/pages/Results.tsx`:

```typescript
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// ... other imports

const Results = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const { toast } = useToast();
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;
      
      setIsLoading(true);
      try {
        const response = await api.analysis.getOne(analysisId);
        setAnalysis(response.data);
        setIsStarred(response.data.isStarred);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch analysis results",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  const handleStar = async () => {
    if (!analysisId) return;
    
    try {
      await api.analysis.toggleStar(analysisId);
      setIsStarred(!isStarred);
      
      toast({
        title: isStarred ? "Removed from favorites" : "Added to favorites",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!analysisId) return;
    
    try {
      await api.reports.create(analysisId);
      
      toast({
        title: "Report exported",
        description: "Report has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export report",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  if (!analysis) {
    return <div>Analysis not found</div>;
  }

  // Render analysis results from analysis.results
  const renderResults = () => {
    const { results } = analysis;
    
    if (!results || !results.groups) {
      return <div>No results available</div>;
    }

    return results.groups.map((group: any, groupIndex: number) => (
      <div key={groupIndex} className="space-y-4">
        <h3 className="font-semibold text-lg">{group.groupName}</h3>
        
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Variable</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Mean ± SD</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Median (min: max)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Q1</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Q3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {group.variables.map((variable: any, varIndex: number) => {
                  const stats = variable.statistics;
                  return (
                    <tr key={varIndex} className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">{variable.name}</td>
                      <td className="px-6 py-4">{stats.mean} ± {stats.std}</td>
                      <td className="px-6 py-4">{stats.median} ({stats.min}: {stats.max})</td>
                      <td className="px-6 py-4">{stats.q1}</td>
                      <td className="px-6 py-4">{stats.q3}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {results.interpretation && (
          <p className="text-sm text-muted-foreground bg-muted/30 rounded p-4">
            {results.interpretation}
          </p>
        )}
      </div>
    ));
  };

  // ... rest of the component
};
```

## 8. Add Credits Display

Create a reusable credit display component `frontend/src/components/CreditsDisplay.tsx`:

```typescript
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export const CreditsDisplay = () => {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await api.users.getCredits();
        setCredits(response.credits);
      } catch (error) {
        console.error('Failed to fetch credits:', error);
      }
    };

    fetchCredits();
    
    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-sidebar-accent rounded-lg p-4">
      <p className="text-sm text-sidebar-foreground mb-1">Credit Information</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">{credits}</span>
        </div>
        <Button size="sm" className="ml-auto">
          Buy Credit
        </Button>
      </div>
    </div>
  );
};
```

## Testing the Integration

1. **Start both servers:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   bun run dev
   ```

2. **Test the flow:**
   - Register a new account
   - Create a project
   - Upload a dataset (CSV/Excel)
   - Create an analysis
   - View results
   - Check credits deduction

3. **Verify data persistence:**
   - Logout and login again
   - Check if projects and analyses persist
   - Verify credits balance

## Common Issues & Solutions

### CORS Errors
**Problem:** `Access-Control-Allow-Origin` error

**Solution:** Make sure backend `.env` has:
```env
CORS_ORIGIN=http://localhost:5173
```

### 401 Unauthorized
**Problem:** Token not being sent

**Solution:** Check if token is in localStorage and being added to headers in api.ts

### File Upload Fails
**Problem:** Dataset upload returns 400

**Solution:**
- Check file type (CSV, XLS, XLSX only)
- Check file size (< 10MB)
- Verify file has headers and data

### Analysis Returns Error
**Problem:** "Insufficient credits" or analysis fails

**Solution:**
- Check user has enough credits
- Verify dataset exists and has data
- Check selected variables exist in dataset

## Next Steps

1. Add loading states to all API calls
2. Implement proper error boundaries
3. Add retry logic for failed requests
4. Cache API responses with React Query
5. Add websockets for real-time updates
6. Implement pagination for large lists
7. Add search and filtering
8. Create dashboard analytics

---

**Congratulations!** Your frontend is now fully integrated with the backend! 🎉
