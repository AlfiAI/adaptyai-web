
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Database, UploadCloud, Settings, Loader2, CheckCircle } from 'lucide-react';
import { DataProvider, RepositoryFactory } from '@/lib/dataAccess/factory';
import dataConfig from '@/lib/dataAccess/config';
import { DataMigrationUtility } from '@/lib/dataAccess/migrations/migrateToSupabase';

interface MigrationStepProps {
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  count?: number;
  onMigrate: () => Promise<void>;
}

const MigrationStep: React.FC<MigrationStepProps> = ({
  title,
  description,
  status,
  error,
  count,
  onMigrate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMigrate = async () => {
    setIsLoading(true);
    try {
      await onMigrate();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {status === 'pending' && <Badge variant="outline">Pending</Badge>}
        {status === 'processing' && <Badge className="bg-amber-500">Processing</Badge>}
        {status === 'completed' && <Badge className="bg-green-500">Completed</Badge>}
        {status === 'error' && <Badge variant="destructive">Error</Badge>}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      {status === 'completed' && count !== undefined && (
        <p className="text-sm text-green-400 mb-4">Successfully migrated {count} items</p>
      )}
      
      {status === 'error' && error && (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      )}
      
      <Button 
        onClick={handleMigrate}
        disabled={isLoading || status === 'completed'}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Migrating...
          </>
        ) : status === 'completed' ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Migration Complete
          </>
        ) : (
          <>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Start Migration
          </>
        )}
      </Button>
    </div>
  );
};

export const MigrationManager = () => {
  const { toast } = useToast();
  const [activeProvider, setActiveProvider] = useState<DataProvider>(RepositoryFactory.getProvider());
  
  // Migration states
  const [blogMigration, setBlogMigration] = useState<{
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
    count?: number;
  }>({ status: 'pending' });
  
  const [podcastMigration, setPodcastMigration] = useState<{
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
    count?: number;
  }>({ status: 'pending' });
  
  const [conversationMigration, setConversationMigration] = useState<{
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
    count?: number;
  }>({ status: 'pending' });
  
  // Provider change handler
  const handleProviderChange = (provider: DataProvider) => {
    try {
      RepositoryFactory.setProvider(provider);
      setActiveProvider(provider);
      toast({
        title: 'Provider Changed',
        description: `Data provider set to ${provider}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change data provider',
        variant: 'destructive',
      });
    }
  };
  
  // Migration handlers
  const handleBlogMigration = async () => {
    setBlogMigration({ status: 'processing' });
    try {
      const result = await DataMigrationUtility.migrateBlogPosts();
      if (result.success) {
        setBlogMigration({ status: 'completed', count: result.count });
        toast({
          title: 'Blog Migration Complete',
          description: `Successfully migrated ${result.count} blog posts`,
        });
      } else {
        setBlogMigration({ status: 'error', error: result.error });
        toast({
          title: 'Blog Migration Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setBlogMigration({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: 'Blog Migration Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handlePodcastMigration = async () => {
    setPodcastMigration({ status: 'processing' });
    try {
      const result = await DataMigrationUtility.migratePodcasts();
      if (result.success) {
        setPodcastMigration({ status: 'completed', count: result.count });
        toast({
          title: 'Podcast Migration Complete',
          description: `Successfully migrated ${result.count} podcasts`,
        });
      } else {
        setPodcastMigration({ status: 'error', error: result.error });
        toast({
          title: 'Podcast Migration Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setPodcastMigration({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: 'Podcast Migration Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handleConversationMigration = async () => {
    setConversationMigration({ status: 'processing' });
    try {
      const result = await DataMigrationUtility.migrateConversations();
      if (result.success) {
        setConversationMigration({ status: 'completed', count: result.count });
        toast({
          title: 'Conversation Migration Complete',
          description: `Successfully migrated ${result.count} conversations`,
        });
      } else {
        setConversationMigration({ status: 'error', error: result.error });
        toast({
          title: 'Conversation Migration Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setConversationMigration({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: 'Conversation Migration Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Data Management</h2>
        <p className="text-gray-400">
          Manage data sources and migrations between Firebase and Supabase.
        </p>
      </div>
      
      <Tabs defaultValue="provider">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="provider" className="flex-1">
            <Database className="mr-2 h-4 w-4" />
            Data Provider
          </TabsTrigger>
          <TabsTrigger value="migration" className="flex-1">
            <UploadCloud className="mr-2 h-4 w-4" />
            Data Migration
          </TabsTrigger>
          <TabsTrigger value="config" className="flex-1">
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="provider">
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Current Provider</h3>
              <p className="text-sm text-gray-400 mb-4">
                Select which data provider to use for the application.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant={activeProvider === DataProvider.FIREBASE ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleProviderChange(DataProvider.FIREBASE)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-600/20 mr-3">
                      <span className="text-orange-500">🔥</span>
                    </div>
                    Firebase
                  </div>
                </Button>
                
                <Button 
                  variant={activeProvider === DataProvider.SUPABASE ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleProviderChange(DataProvider.SUPABASE)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600/20 mr-3">
                      <span className="text-green-500">⚡</span>
                    </div>
                    Supabase
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Provider Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Current Provider:</span>
                  <Badge>{activeProvider}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Blogs Provider:</span>
                  <Badge variant="outline">{dataConfig.features.blogs}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Podcasts Provider:</span>
                  <Badge variant="outline">{dataConfig.features.podcasts}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Conversations Provider:</span>
                  <Badge variant="outline">{dataConfig.features.conversations}</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="migration">
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Firebase to Supabase Migration</h3>
              <p className="text-sm text-gray-400">
                Migrate your data from Firebase to Supabase. This process will copy all data
                from Firebase to your Supabase instance while preserving relationships.
              </p>
            </div>
            
            <MigrationStep
              title="Blog Posts Migration"
              description="Migrate blog posts from Firebase to Supabase"
              status={blogMigration.status}
              error={blogMigration.error}
              count={blogMigration.count}
              onMigrate={handleBlogMigration}
            />
            
            <MigrationStep
              title="Podcast Episodes Migration"
              description="Migrate podcast episodes from Firebase to Supabase"
              status={podcastMigration.status}
              error={podcastMigration.error}
              count={podcastMigration.count}
              onMigrate={handlePodcastMigration}
            />
            
            <MigrationStep
              title="Conversations Migration"
              description="Migrate L.E.X. conversations from Firebase to Supabase"
              status={conversationMigration.status}
              error={conversationMigration.error}
              count={conversationMigration.count}
              onMigrate={handleConversationMigration}
            />
            
            <div className="mt-6 border-t pt-4">
              <h4 className="text-md font-medium mb-2">Migration Progress</h4>
              <Progress 
                value={
                  (
                    (blogMigration.status === 'completed' ? 1 : 0) +
                    (podcastMigration.status === 'completed' ? 1 : 0) +
                    (conversationMigration.status === 'completed' ? 1 : 0)
                  ) * 33.33
                } 
                className="mb-2"
              />
              <p className="text-xs text-gray-400 text-right">
                {
                  (
                    (blogMigration.status === 'completed' ? 1 : 0) +
                    (podcastMigration.status === 'completed' ? 1 : 0) +
                    (conversationMigration.status === 'completed' ? 1 : 0)
                  )
                } of 3 migrations completed
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="config">
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Feature Configuration</h3>
              <p className="text-sm text-gray-400">
                Configure which data provider to use for specific features.
                This allows for gradual migration from Firebase to Supabase.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="text-md font-medium mb-4">Feature-Specific Providers</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Blogs Provider</label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={dataConfig.features.blogs === DataProvider.FIREBASE ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.features.blogs = DataProvider.FIREBASE;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Firebase
                    </Button>
                    <Button 
                      variant={dataConfig.features.blogs === DataProvider.SUPABASE ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.features.blogs = DataProvider.SUPABASE;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Supabase
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Podcasts Provider</label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={dataConfig.features.podcasts === DataProvider.FIREBASE ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.features.podcasts = DataProvider.FIREBASE;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Firebase
                    </Button>
                    <Button 
                      variant={dataConfig.features.podcasts === DataProvider.SUPABASE ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.features.podcasts = DataProvider.SUPABASE;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Supabase
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Conversations Provider</label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={dataConfig.features.conversations === DataProvider.FIREBASE ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.features.conversations = DataProvider.FIREBASE;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Firebase
                    </Button>
                    <Button 
                      variant={dataConfig.features.conversations === DataProvider.SUPABASE ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.features.conversations = DataProvider.SUPABASE;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Supabase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="text-md font-medium mb-4">Global Configuration</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Debug Mode</label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={dataConfig.debug ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.debug = true;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Enabled
                    </Button>
                    <Button 
                      variant={!dataConfig.debug ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        dataConfig.debug = false;
                        setActiveProvider(prevState => prevState); // Force re-render
                      }}
                    >
                      Disabled
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
