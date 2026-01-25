import { FC, useEffect, useState } from 'react';
import { User, Mail, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/shared/hooks/use-auth';
import { userService } from '@/shared/services/user.service';
import type { UserResponse } from '@/shared/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const ClientProfile: FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserResponse | null>(null);

    useEffect(() => {
        if (user?.id) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const data = await userService.getUserById(user.id);
            setUserData(data);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#768de8]" />
            </div>
        );
    }

    if (!userData && !user) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <User className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No User Data</h3>
                <p className="text-gray-500">Unable to load user information.</p>
            </div>
        );
    }

    const displayUser = userData || {
        id: user?.id || '',
        first_name: user?.firstName || '',
        last_name: user?.lastName || '',
        email: user?.email || '',
        country: user?.country || '',
        role: user?.role || 'CLIENT',
        is_active: user?.isActive ?? true,
    };

    const fullName = `${displayUser.first_name} ${displayUser.last_name}`;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                                {displayUser.avatar ? (
                                    <img
                                        src={displayUser.avatar}
                                        alt={fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                    {fullName}
                                </CardTitle>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                                    {displayUser.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{displayUser.email}</span>
                                        </div>
                                    )}
                                    {displayUser.country && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{displayUser.country}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

      
            {/* Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <p className="text-gray-900">{displayUser.first_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <p className="text-gray-900">{displayUser.last_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900">{displayUser.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <p className="text-gray-900">{displayUser.country || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Status
                            </label>
                            <p className={`font-medium ${displayUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                {displayUser.is_active ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Member Since
                            </label>
                            <p className="text-gray-900">
                                {displayUser.created_at
                                    ? new Date(displayUser.created_at).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
