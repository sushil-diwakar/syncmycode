import Link from 'next/link';
import GuestCodeButton from './GuestCodeButton';

const HomeContent = () => {
    return (
        <div className="landing-wrapper animate-fade-in-up">
            <div className="container py-5">
                <div className="row align-items-center g-5 min-vh-75 mt-2">
                    <div className="col-lg-6 text-start">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-3" style={{ border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.9rem' }}>
                            ⚡ Real-Time Collaborative Workspace
                        </span>
                        <h1 className="display-4 fw-extrabold text-white mb-3 lh-sm" style={{ fontSize: '3rem', letterSpacing: '-0.03em' }}>
                            Share Code Instantly With <span style={{ background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Developers</span>
                        </h1>
                        <p className="text-secondary mb-4 fs-5" style={{ lineHeight: '1.6' }}>
                            A high-fidelity online collaborative code editor built for technical interviews, remote tutoring, real-time troubleshooting, and peer programming. No registration required to start.
                        </p>
                        
                        <div className="d-flex flex-column flex-sm-row gap-3 pt-2">
                            <GuestCodeButton />
                            <Link href="/signup" className="btn btn-secondary-custom px-4 py-3 fs-6 d-flex align-items-center justify-content-center">
                                Create Account
                            </Link>
                        </div>

                        <div className="row mt-5 pt-3 g-3 border-top border-secondary border-opacity-10 text-start">
                            <div className="col-4">
                                <h4 className="fw-bold text-white mb-0 fs-3">0s</h4>
                                <p className="text-secondary small mb-0">Setup Time</p>
                            </div>
                            <div className="col-4 border-start border-secondary border-opacity-10 ps-4">
                                <h4 className="fw-bold text-white mb-0 fs-3">100%</h4>
                                <p className="text-secondary small mb-0">Web-based</p>
                            </div>
                            <div className="col-4 border-start border-secondary border-opacity-10 ps-4">
                                <h4 className="fw-bold text-white mb-0 fs-3">Real-time</h4>
                                <p className="text-secondary small mb-0">Syncing</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 d-flex justify-content-center">
                        <div className="position-relative w-100" style={{ maxWidth: '520px' }}>
                            <div className="position-absolute bg-primary rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', top: '-50px', left: '-50px', zIndex: 0 }}></div>
                            <div className="position-absolute bg-purple rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', bottom: '-50px', right: '-50px', zIndex: 0 }}></div>

                            <div className="card glass-panel p-2 shadow-2xl position-relative z-1 animate-pulse-glow" style={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
                                <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-secondary border-opacity-25 mb-2">
                                    <div className="d-flex gap-1.5 align-items-center">
                                        <span className="dot bg-danger"></span>
                                        <span className="dot bg-warning"></span>
                                        <span className="dot bg-success"></span>
                                        <span className="small ms-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8b949e' }}>guest-sandbox.js</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 small px-2 py-0.5" style={{ fontSize: '0.7rem' }}>Javascript</span>
                                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 small px-2 py-0.5" style={{ fontSize: '0.7rem' }}>Live Connected</span>
                                    </div>
                                </div>

                                <div className="p-3 text-start rounded" style={{ background: '#090d16', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', minHeight: '260px', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div><span style={{ color: '#ff7b72' }}>import</span> React, &#123; useState &#125; <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'react'</span>;</div>
                                    <div style={{ color: '#8b949e' }}>{'// Real-time collaborative synchronization enabled'}</div>
                                    <div><span style={{ color: '#ff7b72' }}>function</span> <span style={{ color: '#d2a8ff' }}>CollaborativeApp</span>() &#123;</div>
                                    <div className="ps-3"><span style={{ color: '#ff7b72' }}>const</span> [peers, setPeers] = <span style={{ color: '#d2a8ff' }}>useState</span>([<span style={{ color: '#a5d6ff' }}>'Sushil'</span>, <span style={{ color: '#a5d6ff' }}>'Alex'</span>]);</div>
                                    <div className="ps-3" style={{ color: '#8b949e' }}>{'// Editing code concurrently ...'}</div>
                                    <div className="ps-3"><span style={{ color: '#ff7b72' }}>return</span> (</div>
                                    <div className="ps-4" style={{ color: '#79c0ff' }}>&lt;<span style={{ color: '#7ee787' }}>div</span> className=<span style={{ color: '#a5d6ff' }}>"live-editor"</span>&gt;</div>
                                    <div className="ps-5" style={{ color: '#79c0ff' }}>&lt;<span style={{ color: '#7ee787' }}>h1</span>&gt;SyncMyCode Platform&lt;/<span style={{ color: '#7ee787' }}>h1</span>&gt;</div>
                                    <div className="ps-5 bg-warning bg-opacity-10 position-relative" style={{ borderLeft: '2px solid var(--accent-secondary)' }}>
                                        &lt;<span style={{ color: '#7ee787' }}>p</span>&gt;Active Developers Chatting...&lt;/<span style={{ color: '#7ee787' }}>p</span>&gt;
                                        <span className="position-absolute translate-middle-y small px-1.5 py-0.5 rounded text-white bg-purple" style={{ fontSize: '0.65rem', right: '10px', top: '50%', background: 'var(--accent-secondary)', fontWeight: 600 }}>
                                            Alex typing
                                        </span>
                                    </div>
                                    <div className="ps-4" style={{ color: '#79c0ff' }}>&lt;/<span style={{ color: '#7ee787' }}>div</span>&gt;</div>
                                    <div className="ps-3">);</div>
                                    <div>&#125;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 border-top border-secondary border-opacity-10 mt-5">
                <div className="text-center mb-5">
                    <h2 className="fw-extrabold display-6 text-white mb-2">Designed For Modern Collaborative Development</h2>
                    <p className="text-secondary small max-width-md mx-auto" style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
                        All the features you need to collaborate, share code blocks, manage workspaces, and host coding sessions without unnecessary complexity.
                    </p>
                </div>

                <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                        <div className="card glass-panel p-4 h-100 text-start border-hover" style={{ background: 'rgba(17, 24, 37, 0.4)' }}>
                            <div className="feature-icon mb-3 d-inline-flex align-items-center justify-content-center text-primary" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <h4 className="fw-bold mb-2 text-white">Live Group Chat</h4>
                            <p className="text-secondary small mb-0">Chat natively with collaborators in the session room with built-in system alerts.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card glass-panel p-4 h-100 text-start border-hover" style={{ background: 'rgba(17, 24, 37, 0.4)' }}>
                            <div className="feature-icon mb-3 d-inline-flex align-items-center justify-content-center text-purple" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168,85,247,0.1)', color: 'var(--accent-secondary)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <h4 className="fw-bold mb-2 text-white">Collaborator List</h4>
                            <p className="text-secondary small mb-0">Track active participants in the code room dynamically with user avatars and state syncing.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card glass-panel p-4 h-100 text-start border-hover" style={{ background: 'rgba(17, 24, 37, 0.4)' }}>
                            <div className="feature-icon mb-3 d-inline-flex align-items-center justify-content-center text-warning" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                </svg>
                            </div>
                            <h4 className="fw-bold mb-2 text-white">User Dashboard</h4>
                            <p className="text-secondary small mb-0">Sign up to organize code rooms, rename snippet titles, copy share links, or delete snippets.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card glass-panel p-4 h-100 text-start border-hover" style={{ background: 'rgba(17, 24, 37, 0.4)' }}>
                            <div className="feature-icon mb-3 d-inline-flex align-items-center justify-content-center text-success" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
                                </svg>
                            </div>
                            <h4 className="fw-bold mb-2 text-white">Language Support</h4>
                            <p className="text-secondary small mb-0">Seamlessly edit code with rich CodeMirror syntax highlighting for HTML, CSS, JavaScript, Python, C++, Java, and SQL.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;
