
import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPodcastManager } from '@/components/admin/AdminPodcastManager';
import { AdminBlogManager } from '@/components/admin/AdminBlogManager';
import { AdminAgentManager } from '@/components/admin/AdminAgentManager';
import { MigrationManager } from '@/components/admin/migration/MigrationManager';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('podcasts');

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <PageContainer>
      <Section>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your content and settings.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="podcasts" className="flex-1">Podcasts</TabsTrigger>
              <TabsTrigger value="blogs" className="flex-1">Blog Posts</TabsTrigger>
              <TabsTrigger value="agents" className="flex-1">Agents</TabsTrigger>
              <TabsTrigger value="migration" className="flex-1">Data Migration</TabsTrigger>
            </TabsList>
            <TabsContent value="podcasts">
              <AdminPodcastManager />
            </TabsContent>
            <TabsContent value="blogs">
              <AdminBlogManager />
            </TabsContent>
            <TabsContent value="agents">
              <AdminAgentManager />
            </TabsContent>
            <TabsContent value="migration">
              <MigrationManager />
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Admin;
