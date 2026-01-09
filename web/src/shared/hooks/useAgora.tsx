import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID;

interface AgoraToken {
    token: string;
    appId: string;
    channelName: string;
    expiresIn: string;
}

export function useAgora() {
    const [appId, setAppId] = useState<string>(AGORA_APP_ID || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Agora App ID from backend if not in env
    useEffect(() => {
        if (!appId) {
            fetchAgoraConfig();
        }
    }, [appId]);

    const fetchAgoraConfig = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/meetings/config`);
            if (response.data.success) {
                setAppId(response.data.data.appId);
            }
        } catch (err) {
            console.error('Error fetching Agora config:', err);
            setError('Failed to fetch Agora configuration');
        }
    };

    const generateToken = useCallback(async (
        channelName: string,
        userId?: string
    ): Promise<AgoraToken | null> => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({ channelName });
            if (userId) {
                params.append('userId', userId);
            }

            const response = await axios.get(
                `${API_BASE_URL}/meetings/token?${params.toString()}`
            );

            if (response.data.success) {
                return response.data.data as AgoraToken;
            } else {
                throw new Error(response.data.message || 'Failed to generate token');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to generate Agora token';
            setError(errorMessage);
            console.error('Error generating Agora token:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const validateChannelName = useCallback(async (channelName: string): Promise<boolean> => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/meetings/validate-channel`,
                { params: { channelName } }
            );
            return response.data.success && response.data.data?.isValid;
        } catch (err) {
            console.error('Error validating channel name:', err);
            return false;
        }
    }, []);

    return {
        appId,
        loading,
        error,
        generateToken,
        validateChannelName,
    };
}
