import Link from 'next/link';
import './css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer py-5 mt-auto">
            <div className="container animate-fade-in-up">
                <div className="row justify-content-between align-items-center g-4">
                    <div className="col-md-5 text-start">
                        <Link className="d-inline-flex align-items-center mb-3 text-decoration-none" href="/" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                            <span className="logo-icon-wrap me-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-10deg)' }}>
                                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                                </svg>
                            </span>
                            <span className="logo-text">Sync<span style={{ color: 'var(--accent-secondary)' }}>My</span>Code</span>
                        </Link>
                        <p className="text-secondary small mb-0" style={{ maxWidth: '360px', lineHeight: '1.6' }}>
                            A high-fidelity real-time collaborative coding sandbox built for technical hiring, mentoring, peer reviews, and tutoring.
                        </p>
                    </div>

                    <div className="col-md-5 text-md-end text-start">
                        <div className="d-flex flex-wrap gap-3 justify-content-md-end mb-3">
                            <Link href="/" className="text-secondary small text-hover-white">Home</Link>
                            <Link href="/about" className="text-secondary small text-hover-white">About</Link>
                            <Link href="/contact" className="text-secondary small text-hover-white">Contact</Link>
                            <a href="https://in.linkedin.com/in/sushil-diwakar" target="_blank" rel="noreferrer" className="text-secondary small text-hover-white">Developer</a>
                        </div>
                        <p className="text-secondary small mb-0">
                            Created with 💻 and ☕ by{' '}
                            <a href="https://in.linkedin.com/in/sushil-diwakar" target="_blank" rel="noreferrer" className="fw-semibold text-decoration-underline" style={{ color: 'var(--accent-primary)' }}>
                                Sushil Diwakar
                            </a>
                        </p>
                    </div>
                </div>

                <hr className="my-4 border-secondary border-opacity-25" />

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                    <p className="text-muted small mb-0">
                        &copy; {new Date().getFullYear()} SyncMyCode. All rights reserved.
                    </p>
                    <div className="d-flex gap-4">
                        <span className="text-muted small">Status: <span style={{ color: 'var(--success)', fontWeight: 600 }}>● All systems operational</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
