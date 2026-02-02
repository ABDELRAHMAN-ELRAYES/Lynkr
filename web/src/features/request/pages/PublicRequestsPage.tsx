import { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { requestService } from '@/shared/services/request.service';
import type { Request } from '@/shared/types/request';
import { toast } from 'sonner';
import { Input } from '@/shared/components/ui/input';
import { useAuth } from '@/shared/hooks/use-auth';
import Navbar from '@/shared/components/common/Navbar';
import Footer from '@/shared/components/common/Footer';
import { Pagination } from '@/shared/components/common/pagination';

export const PublicRequestsPage: FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<Request[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Load requests with pagination
    const loadRequests = useCallback(async () => {
        try {
            setLoading(true);
            const result = await requestService.getPublicRequests({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
            });
            setRequests(result.data);
            setTotalPages(result.pagination.totalPages);
            setTotalItems(result.pagination.total);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to load requests';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    // Redirect clients away from this page
    if (user?.role === 'CLIENT') {
        navigate('/profile/requests');
        return null;
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && requests.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 mt-[5rem]">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-[90rem] mt-[5rem]">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">

                        <div className="mb-4">
                            <h1 className="max-w-[90rem] bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tighter text-transparent text-[4rem]">
                                Browse Requests
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Find projects matching your expertise and submit proposals
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 border-0 ring-0 outline-0 shadow-none"
                        />
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mb-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                            {totalItems} {totalItems === 1 ? 'request' : 'requests'} available
                        </span>
                        {searchQuery && (
                            <span>
                                Searching for "{searchQuery}"
                            </span>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <span className="text-gray-500">
                            Page {currentPage} of {totalPages}
                        </span>
                    )}
                </div>

                {/* Loading overlay for page changes */}
                {loading && requests.length > 0 && (
                    <div className="mb-4 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7682e8]"></div>
                    </div>
                )}

                {/* Requests List */}
                {requests.length === 0 && !loading ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {searchQuery ? 'No requests match your search' : 'No public requests available'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            {searchQuery
                                ? 'Try adjusting your search terms to see more results.'
                                : 'Check back later for new opportunities in your service category.'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchQuery('');
                                }}
                                className="mt-4 text-[#7682e8] hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            {requests.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    request={request}
                                    viewType="provider"
                                />
                            ))}
                        </div>

                        {/* Pagination - Using existing component */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="mt-8"
                        />
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PublicRequestsPage;
