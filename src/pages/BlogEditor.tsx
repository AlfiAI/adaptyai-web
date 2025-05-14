
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { BlogEditorForm } from '@/components/blog-editor/BlogEditorForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck } from 'lucide-react';

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) {
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data: isAdmin, error: adminError } = await supabase.rpc('has_role', { 
          _role: 'admin' 
        });
        
        if (adminError) throw adminError;
        
        if (isAdmin) {
          setIsAllowed(true);
          setIsChecking(false);
          return;
        }
        
        // Check if user has editor role
        const { data: isEditor, error: editorError } = await supabase.rpc('has_role', { 
          _role: 'editor' 
        });
        
        if (editorError) throw editorError;
        
        setIsAllowed(isEditor ? true : false);
      } catch (error) {
        console.error('Error checking permissions:', error);
        toast({
          title: "Error",
          description: "Could not verify your permissions.",
          variant: "destructive"
        });
        setIsAllowed(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkPermissions();
  }, [user, toast]);

  if (isChecking) {
    return (
      <PageContainer>
        <Section>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-adapty-aqua mb-4" />
            <p className="text-lg text-muted-foreground">Checking your permissions...</p>
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (!isAllowed) {
    return (
      <PageContainer>
        <Section>
          <div className="max-w-3xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <ShieldCheck className="h-5 w-5" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You need admin or editor permissions to access the blog editor.
                {!user && " Please login first."}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <button 
                className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black px-4 py-2 rounded"
                onClick={() => navigate(user ? '/admin' : '/auth')}
              >
                {user ? 'Return to Admin Dashboard' : 'Go to Login'}
              </button>
            </div>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section className="py-8">
        <BlogEditorForm />
      </Section>
    </PageContainer>
  );
};

export default BlogEditor;
