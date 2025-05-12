
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AdminBlogManager } from '@/components/admin/AdminBlogManager';
import { AdminPodcastManager } from '@/components/admin/AdminPodcastManager';
import { MigrationManager } from '@/components/admin/migration/MigrationManager'; 
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogOut, User, ShieldCheck, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;
      
      try {
        // Check if user has admin role
        const { data: isAdmin, error: adminError } = await supabase.rpc('has_role', { 
          _role: 'admin' 
        });
        
        if (adminError) throw adminError;
        
        if (isAdmin) {
          setUserRole('admin');
          setIsCheckingRole(false);
          return;
        }
        
        // Check if user has editor role
        const { data: isEditor, error: editorError } = await supabase.rpc('has_role', { 
          _role: 'editor' 
        });
        
        if (editorError) throw editorError;
        
        if (isEditor) {
          setUserRole('editor');
        } else {
          setUserRole('viewer');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        toast({
          title: "Error",
          description: "Could not verify your permissions.",
          variant: "destructive"
        });
      } finally {
        setIsCheckingRole(false);
      }
    };
    
    checkAdminRole();
  }, [user, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You've been signed out successfully.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  if (isCheckingRole) {
    return (
      <PageContainer>
        <Section>
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse-glow h-16 w-16 rounded-full border-2 border-adapty-aqua flex items-center justify-center">
              <div className="animate-spin h-12 w-12 border-t-2 border-adapty-aqua border-opacity-50 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-400">Verifying permissions...</p>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              {userRole && (
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="capitalize">{userRole}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="text-gray-400 hover:text-gray-100 flex items-center gap-2"
                onClick={() => navigate('/blog')}
              >
                <Info className="h-4 w-4" /> View Site
              </Button>
              
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          
          {userRole === 'viewer' && (
            <Alert variant="destructive" className="mb-4">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Insufficient permissions</AlertTitle>
              <AlertDescription>
                You need editor or admin permissions to manage content.
                Please contact an administrator to upgrade your role.
              </AlertDescription>
            </Alert>
          )}
          
          {(userRole === 'admin' || userRole === 'editor') && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Welcome, {user?.email}
                </CardTitle>
                <CardDescription>
                  You have {userRole} privileges. You can manage all content from this dashboard.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="blog" className="w-full">
                  <TabsList className="w-full max-w-md mb-8">
                    <TabsTrigger value="blog" className="flex-1">Blog Manager</TabsTrigger>
                    <TabsTrigger value="podcast" className="flex-1">Podcast Manager</TabsTrigger>
                    {userRole === 'admin' && (
                      <TabsTrigger value="data" className="flex-1">Data Migration</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="blog">
                    <AdminBlogManager />
                  </TabsContent>
                  
                  <TabsContent value="podcast">
                    <AdminPodcastManager />
                  </TabsContent>
                  
                  {userRole === 'admin' && (
                    <TabsContent value="data">
                      <MigrationManager />
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </PageContainer>
  );
};

export default Admin;
