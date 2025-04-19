
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { AdminBlogManager } from '@/components/admin/AdminBlogManager';
import { AdminPodcastManager } from '@/components/admin/AdminPodcastManager';

const ADMIN_PASSWORD = "adapty2025"; // A simple authentication mechanism for now

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuthentication = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <PageContainer>
        <Section className="max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-adapty-aqua" />
            </div>
            <h1 className="text-2xl font-bold mb-6">Admin Access</h1>
            <div className="w-full space-y-4">
              <Input 
                type="password" 
                placeholder="Enter admin password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuthentication()}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button 
                className="w-full bg-adapty-aqua hover:bg-adapty-aqua/80"
                onClick={handleAuthentication}
              >
                Access Admin Area
              </Button>
            </div>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section>
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button 
              variant="outline" 
              className="text-gray-400 hover:text-gray-100"
              onClick={() => navigate('/blog')}
            >
              Back to Blog
            </Button>
          </div>
          
          <Tabs defaultValue="blog" className="w-full">
            <TabsList className="w-full max-w-md mb-8">
              <TabsTrigger value="blog" className="flex-1">Blog Manager</TabsTrigger>
              <TabsTrigger value="podcast" className="flex-1">Podcast Manager</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blog">
              <AdminBlogManager />
            </TabsContent>
            
            <TabsContent value="podcast">
              <AdminPodcastManager />
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Admin;
