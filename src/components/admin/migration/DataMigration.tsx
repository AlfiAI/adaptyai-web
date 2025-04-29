
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Database, ArrowRight, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataMigrationUtility } from '@/lib/dataAccess/migrations/migrateToSupabase';
import { updateDataProvider, updateFeatureFlag, DataProvider } from '@/lib/dataAccess/config';
import { RepositoryFactory } from '@/lib/dataAccess/factory';
import { useToast } from '@/hooks/use-toast';

export const DataMigration: React.FC = () => {
  const { toast } = useToast();
  const [migrationState, setMigrationState] = useState<{
    blogs: 'idle' | 'running' | 'success' | 'error';
    podcasts: 'idle' | 'running' | 'success' | 'error';
    conversations: 'idle' | 'running' | 'success' | 'error';
  }>({
    blogs: 'idle',
    podcasts: 'idle',
    conversations: 'idle',
  });
  const [progress, setProgress] = useState<{ blogs: number; podcasts: number; conversations: number }>({
    blogs: 0,
    podcasts: 0,
    conversations: 0,
  });
  const [results, setResults] = useState<{
    blogs?: { success: boolean; count: number; error?: string };
    podcasts?: { success: boolean; count: number; error?: string };
    conversations?: { success: boolean; count: number; error?: string };
  }>({});

  const migrateBlogs = async () => {
    try {
      setMigrationState(prev => ({ ...prev, blogs: 'running' }));
      setProgress(prev => ({ ...prev, blogs: 10 }));
      
      const result = await DataMigrationUtility.migrateBlogPosts();
      setProgress(prev => ({ ...prev, blogs: 100 }));
      setResults(prev => ({ ...prev, blogs: result }));
      
      if (result.success) {
        setMigrationState(prev => ({ ...prev, blogs: 'success' }));
        toast({
          title: "Blog Migration Complete",
          description: `Successfully migrated ${result.count} blog posts to Supabase`,
        });
      } else {
        setMigrationState(prev => ({ ...prev, blogs: 'error' }));
        toast({
          title: "Blog Migration Failed",
          description: result.error || "An error occurred during migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      setMigrationState(prev => ({ ...prev, blogs: 'error' }));
      setResults(prev => ({ ...prev, blogs: { success: false, count: 0, error: String(error) } }));
      toast({
        title: "Blog Migration Failed",
        description: error instanceof Error ? error.message : "An error occurred during migration",
        variant: "destructive",
      });
    }
  };

  const migratePodcasts = async () => {
    try {
      setMigrationState(prev => ({ ...prev, podcasts: 'running' }));
      setProgress(prev => ({ ...prev, podcasts: 10 }));
      
      const result = await DataMigrationUtility.migratePodcasts();
      setProgress(prev => ({ ...prev, podcasts: 100 }));
      setResults(prev => ({ ...prev, podcasts: result }));
      
      if (result.success) {
        setMigrationState(prev => ({ ...prev, podcasts: 'success' }));
        toast({
          title: "Podcast Migration Complete",
          description: `Successfully migrated ${result.count} podcasts to Supabase`,
        });
      } else {
        setMigrationState(prev => ({ ...prev, podcasts: 'error' }));
        toast({
          title: "Podcast Migration Failed",
          description: result.error || "An error occurred during migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      setMigrationState(prev => ({ ...prev, podcasts: 'error' }));
      setResults(prev => ({ ...prev, podcasts: { success: false, count: 0, error: String(error) } }));
      toast({
        title: "Podcast Migration Failed",
        description: error instanceof Error ? error.message : "An error occurred during migration",
        variant: "destructive",
      });
    }
  };

  const migrateConversations = async () => {
    try {
      setMigrationState(prev => ({ ...prev, conversations: 'running' }));
      setProgress(prev => ({ ...prev, conversations: 10 }));
      
      const result = await DataMigrationUtility.migrateConversations();
      setProgress(prev => ({ ...prev, conversations: 100 }));
      setResults(prev => ({ ...prev, conversations: result }));
      
      if (result.success) {
        setMigrationState(prev => ({ ...prev, conversations: 'success' }));
        toast({
          title: "Conversation Migration Complete",
          description: `Successfully migrated ${result.count} conversations to Supabase`,
        });
      } else {
        setMigrationState(prev => ({ ...prev, conversations: 'error' }));
        toast({
          title: "Conversation Migration Failed",
          description: result.error || "An error occurred during migration",
          variant: "destructive",
        });
      }
    } catch (error) {
      setMigrationState(prev => ({ ...prev, conversations: 'error' }));
      setResults(prev => ({ ...prev, conversations: { success: false, count: 0, error: String(error) } }));
      toast({
        title: "Conversation Migration Failed",
        description: error instanceof Error ? error.message : "An error occurred during migration",
        variant: "destructive",
      });
    }
  };

  const updateFeature = (feature: 'blogs' | 'podcasts' | 'conversations', provider: DataProvider) => {
    updateFeatureFlag(feature, provider);
    toast({
      title: "Feature Flag Updated",
      description: `${feature} provider set to ${provider}`,
    });
  };

  const getStatusIcon = (status: 'idle' | 'running' | 'success' | 'error') => {
    switch (status) {
      case 'running':
        return <Loader className="h-5 w-5 animate-spin text-adapty-purple" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Database className="h-5 w-5 text-adapty-aqua" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Data Migration</h2>
      <p className="text-gray-400">
        Migrate your data from Firebase to Supabase. Each section below allows you to migrate a specific
        type of data and switch between database providers.
      </p>
      
      <Tabs defaultValue="blogs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogs">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts Migration</CardTitle>
              <CardDescription>
                Transfer all blog posts from Firebase to Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.blogs?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{results.blogs.error}</AlertDescription>
                  </Alert>
                )}
                {results.blogs?.success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Successfully migrated {results.blogs.count} blog posts to Supabase.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(migrationState.blogs)}
                  <div className="w-full">
                    <Progress value={progress.blogs} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateFeature('blogs', DataProvider.FIREBASE)}
                  variant="outline"
                >
                  Use Firebase
                </Button>
                <Button
                  onClick={() => updateFeature('blogs', DataProvider.SUPABASE)}
                  variant="outline"
                  className="bg-adapty-purple/20 text-adapty-purple hover:bg-adapty-purple/30"
                >
                  Use Supabase
                </Button>
              </div>
              <Button 
                onClick={migrateBlogs}
                disabled={migrationState.blogs === 'running'}
                className="bg-adapty-aqua hover:bg-adapty-aqua/80"
              >
                <Database className="mr-2 h-4 w-4" />
                Migrate Blogs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="podcasts">
          <Card>
            <CardHeader>
              <CardTitle>Podcasts Migration</CardTitle>
              <CardDescription>
                Transfer all podcast episodes from Firebase to Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.podcasts?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{results.podcasts.error}</AlertDescription>
                  </Alert>
                )}
                {results.podcasts?.success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Successfully migrated {results.podcasts.count} podcasts to Supabase.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(migrationState.podcasts)}
                  <div className="w-full">
                    <Progress value={progress.podcasts} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateFeature('podcasts', DataProvider.FIREBASE)}
                  variant="outline"
                >
                  Use Firebase
                </Button>
                <Button
                  onClick={() => updateFeature('podcasts', DataProvider.SUPABASE)}
                  variant="outline"
                  className="bg-adapty-purple/20 text-adapty-purple hover:bg-adapty-purple/30"
                >
                  Use Supabase
                </Button>
              </div>
              <Button 
                onClick={migratePodcasts}
                disabled={migrationState.podcasts === 'running'}
                className="bg-adapty-aqua hover:bg-adapty-aqua/80"
              >
                <Database className="mr-2 h-4 w-4" />
                Migrate Podcasts
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>Conversations Migration</CardTitle>
              <CardDescription>
                Transfer all L.E.X. Assistant conversations from Firebase to Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.conversations?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{results.conversations.error}</AlertDescription>
                  </Alert>
                )}
                {results.conversations?.success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Successfully migrated {results.conversations.count} conversations to Supabase.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(migrationState.conversations)}
                  <div className="w-full">
                    <Progress value={progress.conversations} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateFeature('conversations', DataProvider.FIREBASE)}
                  variant="outline"
                >
                  Use Firebase
                </Button>
                <Button
                  onClick={() => updateFeature('conversations', DataProvider.SUPABASE)}
                  variant="outline"
                  className="bg-adapty-purple/20 text-adapty-purple hover:bg-adapty-purple/30"
                >
                  Use Supabase
                </Button>
              </div>
              <Button 
                onClick={migrateConversations}
                disabled={migrationState.conversations === 'running'}
                className="bg-adapty-aqua hover:bg-adapty-aqua/80"
              >
                <Database className="mr-2 h-4 w-4" />
                Migrate Conversations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Global Database Provider</CardTitle>
          <CardDescription>
            Set the default database provider for all features
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              onClick={() => updateDataProvider(DataProvider.FIREBASE)}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700"
            >
              Use Firebase Everywhere
            </Button>
            <Button
              onClick={() => updateDataProvider(DataProvider.SUPABASE)}
              variant="outline"
              className="bg-adapty-purple/20 text-adapty-purple hover:bg-adapty-purple/30"
            >
              Use Supabase Everywhere
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
