import React from 'react';
import { useAuction } from '../context/AuctionContext';

const LoginView = () => {
    const { state, adminStartAuction } = useAuction();

    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>CODEBID</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    Competitive Coding Auction Platform
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>STATUS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {state.appStatus} FOR ADMIN
                    </div>
                </div>

                <div className="user-info" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <p>Logged in as: <span style={{ color: 'var(--color-primary)' }}>{state.user.name}</span></p>
                    <p>Wallet: <span style={{ color: 'var(--color-success)' }}>{state.user.wallet} Coins</span></p>
                </div>

                <button
                    onClick={adminStartAuction}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        background: 'var(--color-primary)',
                        color: '#000',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
                    }}
                >
                    ADMIN: START EVENT
                </button>
            </div>

            <footer style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                Waiting for host to begin auction...
            </footer>
        </div>
    );
};

export default LoginView;
