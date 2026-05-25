import Dashboard from '../../src/components/Dashboard';

export const metadata = {
    title: 'Dashboard',
    description: 'Manage your SyncMyCode snippets, create new collaborative rooms, and view your coding activity.',
    robots: { index: false, follow: false },
};

export default function DashboardPage() {
    return <Dashboard />;
}
