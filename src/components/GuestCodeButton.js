'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../lib/api';

const GuestCodeButton = () => {
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    const generateUniqueId = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleStartGuestCode = async () => {
        setActionLoading(true);
        const uniqueId = generateUniqueId();

        try {
            const res = await fetch(`${getApiUrl()}/v1/code/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: uniqueId,
                    content: '/* Happy coding! Share this URL to collaborate in real-time. */\n\nfunction helloWorld() {\n    console.log("Hello, Collaborative World!");\n}',
                    language: 'javascript',
                    title: 'Guest Sandbox',
                    isPublic: true,
                }),
            });

            if (res.ok) {
                router.push(`/${uniqueId}`);
            } else {
                router.push(`/${uniqueId}`);
            }
        } catch (error) {
            console.error('Error starting guest session:', error);
            router.push(`/${uniqueId}`);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <button onClick={handleStartGuestCode} className="btn btn-primary-custom px-4 py-3 fs-6 d-flex align-items-center justify-content-center gap-2" disabled={actionLoading}>
            {actionLoading ? (
                <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Spinning up sandbox...
                </>
            ) : (
                <>
                    <span>Start Coding Free</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                </>
            )}
        </button>
    );
};

export default GuestCodeButton;
