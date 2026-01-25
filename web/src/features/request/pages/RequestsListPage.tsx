import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { requestService } from '@/shared/services/request.service';
import type { Request } from '@/shared/types/request';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/input';
import { useAuth } from '@/shared/hooks/use-auth';

export const RequestsListPage: FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<Request[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const viewType = user?.role === 'CLIENT' ? 'client' : 'provider';

    useEffect(() => {
        loadRequests();
    }, []);

    useEffect(() => {
        filterRequests();
    }, [requests, searchQuery, statusFilter]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await requestService.getRequests();
            setRequests(data);
            setFilteredRequests(data);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to load requests';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const filterRequests = () => {
        let filtered = [...requests];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (req) =>
                    req.title.toLowerCase().includes(query) ||
                    req.description.toLowerCase().includes(query) ||
                    req.category.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((req) => req.status === statusFilter);
        }

        setFilteredRequests(filtered);
    };

    const handleCancelRequest = async (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) {
            return;
        }

        try {
            await requestService.cancelRequest(id);
            toast.success('Request cancelled successfully');
            loadRequests();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to cancel request';
            toast.error(errorMessage);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {viewType === 'client' ? 'My Requests' : 'Available Requests'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {viewType === 'client'
                                ? 'Manage your service requests'
                                : 'Browse and respond to service requests'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7682e8]"
                        >
                            <option value="all">All Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="PENDING">Pending</option>
                            <option value="PUBLIC">Public</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Requests List */}
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                            {requests.length === 0
                                ? viewType === 'client'
                                    ? 'No requests yet'
                                    : 'No available requests'
                                : 'No requests match your filters'}
                        </p>
                        {requests.length === 0 && viewType === 'client' && (
                            <Button
                                onClick={() => navigate('/requests/create')}
                                className="mt-4"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Request
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredRequests.map((request) => (
                            <RequestCard
                                key={request.id}
                                request={request}
                                viewType={viewType}
                                onCancel={viewType === 'client' ? handleCancelRequest : undefined}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
