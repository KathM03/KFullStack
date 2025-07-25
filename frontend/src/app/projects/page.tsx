'use client';

import { ClientAuthGuard } from '@/components/ClientAuthGuard';
import { Layout } from '@/components/Layout';
import { ProjectList } from '@/components/projects/ProjectList';

export default function ProjectsPage() {
    return (
        <ClientAuthGuard>
            <Layout>
                <ProjectList />
            </Layout>
        </ClientAuthGuard>
    );
}
