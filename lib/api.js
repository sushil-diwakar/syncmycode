'use client';

export function getApiUrl() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        return url.replace(/^http:/, 'https:');
    }
    return url;
}
