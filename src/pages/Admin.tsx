
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminBlogManager } from '@/components/admin/AdminBlogManager';
import { AdminPodcastManager } from '@/components/admin/AdminPodcastManager';
import { AdminAgentManager } from '@/components/admin/AdminAgentManager';
import { MigrationManager } from '@/components/admin/migration/MigrationManager';
import PageContainer from '@/components/layout/PageContainer';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('blog');
  
  return (
    <PageContainer>
      <div className="py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your content, agents, and settings</p>
        </div>
        
        <Tabs 
          defaultValue="blog" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 max-w-md">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="podcast">Podcast</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
          </TabsList>
          <TabsContent value="blog" className="mt-6">
            <AdminBlogManager />
          </TabsContent>
          <TabsContent value="podcast" className="mt-6">
            <AdminPodcastManager />
          </TabsContent>
          <TabsContent value="agents" className="mt-6">
            <AdminAgentManager />
          </TabsContent>
          <TabsContent value="migration" className="mt-6">
            <MigrationManager />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Admin;
