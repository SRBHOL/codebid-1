import React from 'react';
import { useAuction } from '../context/AuctionContext';

const LoginView = () => {
    const { state, login } = useAuction(); // Removed adminStartAuction
    const [teamName, setTeamName] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!teamName.trim()) {
            setError('Please enter a team name');
            return;
        }
        login(teamName);
    };

    // If user is NOT logged in, show Login Form
    if (!state.user) {
        return (
            <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
                <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h1 className="text-hero" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>CODEBID</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', letterSpacing: '0.1em' }}>ENTER THE ARENA</p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="TEAM NAME"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: error ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                fontSize: '1.1rem',
                                textAlign: 'center',
                                color: 'white',
                                letterSpacing: '0.1em',
                                borderRadius: 'var(--radius-sm)'
                            }}
                            autoFocus
                        />
                        {error && <div style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>{error}</div>}

                        <button
                            type="submit"
                            className="hero-btn"
                            style={{ width: '100%' }}
                        >
                            JOIN AUCTION
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // If logged in, show Waiting Dashboard
    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>CODEBID</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    Competitive Coding Auction Platform
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>STATUS</div>
                    <div className="animate-pulse-glow" style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--color-primary)',
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(0, 240, 255, 0.1)',
                        marginTop: '0.5rem'
                    }}>
                        {state.appStatus === 'WAITING' ? 'WAITING FOR HOST' : state.appStatus}
                    </div>
                </div>

                <div className="user-info" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Logged in as</p>
                    <h2 style={{ color: 'var(--color-text-main)', fontSize: '2rem', marginBottom: '1rem' }}>{state.user.name}</h2>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(0, 255, 157, 0.1)',
                        color: 'var(--color-success)',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 'bold'
                    }}>
                        Wallet: {state.user.wallet} Coins
                    </div>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Waiting for the admin to start the event...
                </p>
            </div>
        </div>
    );
};

export default LoginView;
