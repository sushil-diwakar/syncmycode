'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../../lib/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
    }, []);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            try {
                const res = await fetch(`${getApiUrl()}/v1/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                } else {
                    logout();
                }
            } catch (err) {
                console.error('Error loading user profile:', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token, logout]);

    const signup = async (username, email, password) => {
        setError(null);
        try {
            const res = await fetch(`${getApiUrl()}/v1/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            return true;
        } catch (err) {
            setError(err.message === 'Failed to fetch'
                ? 'Authentication server is offline. Please make sure your backend is running.'
                : err.message);
            return false;
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const res = await fetch(`${getApiUrl()}/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            return true;
        } catch (err) {
            setError(err.message === 'Failed to fetch'
                ? 'Authentication server is offline. Please make sure your backend is running.'
                : err.message);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                signup,
                login,
                logout,
                setError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
