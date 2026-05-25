import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import '../src/components/css/NavBar.css';
import '../src/components/css/Footer.css';
import '../src/components/css/Home.css';
import '../src/components/css/Dashboard.css';

import { AuthProvider } from '../src/context/AuthContext';
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';

export const metadata = {
    title: {
        default: 'SyncMyCode — Real-Time Collaborative Code Editor',
        template: '%s | SyncMyCode',
    },
    description:
        'A high-fidelity online collaborative code editor built for technical interviews, remote tutoring, real-time troubleshooting, and peer programming.',
    openGraph: {
        title: 'SyncMyCode — Real-Time Collaborative Code Editor',
        description:
            'Share code instantly with developers. Real-time collaborative coding for interviews, tutoring, and pair programming.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <AuthProvider>
                    <NavBar />
                    <div className="app-container">
                        <main className="main-content">{children}</main>
                        <Footer />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
