import React from 'react';

const LandingView = ({ onSelectRole }) => {
    const [showAuth, setShowAuth] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleAdminClick = () => {
        setShowAuth(true);
        setError('');
        setPassword('');
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (password === 'code@bid123') {
            onSelectRole('ADMIN');
        } else {
            setError('Incorrect Password');
        }
    };

    return (
        <div className="container flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem' }}>CODEBID</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>Competitive Coding Auction Platform</p>
            </div>

            {!showAuth ? (
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button
                        onClick={() => onSelectRole('STUDENT')}
                        className="glass-panel"
                        style={{
                            padding: '3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '3rem' }}>👨‍💻</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Student</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Join a team & Compete</div>
                    </button>

                    <button
                        onClick={handleAdminClick}
                        className="glass-panel"
                        style={{
                            padding: '3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            border: '1px solid var(--color-primary)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '3rem' }}>⚡</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Admin</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Manage the Event</div>
                    </button>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Admin Access</h2>
                    <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            style={{ textAlign: 'center', letterSpacing: '0.2rem' }}
                            autoFocus
                        />
                        {error && <div style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowAuth(false)}
                                className="btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LandingView;
