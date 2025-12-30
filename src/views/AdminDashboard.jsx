import React from 'react';
import { useAuction } from '../context/AuctionContext';

const AdminDashboard = ({ onBack }) => {
    const { state, adminStartAuction, startCoding, endEvent, broadcastTick } = useAuction();
    const { appStatus, auction } = state;

    // Admin drives the timer to ensure sync across tabs
    React.useEffect(() => {
        let interval;
        if ((appStatus === 'AUCTION' && auction.timeLeft > 0) ||
            (appStatus === 'CODING' && auction.codingTimer > 0)) {
            interval = setInterval(() => {
                broadcastTick();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [appStatus, auction.timeLeft, auction.codingTimer, broadcastTick]);

    return (
        <div className="container" style={{ padding: '2rem', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>ADMIN DASHBOARD</h1>
                <button onClick={onBack} style={{ background: 'transparent', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>LOGOUT</button>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', letterSpacing: '0.1em' }}>GAME STATUS: <span style={{ color: 'var(--color-primary)' }}>{appStatus}</span></h2>

                {appStatus === 'AUCTION' && (
                    <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                        <div>Current Problem: <span style={{ fontWeight: 'bold' }}>#{auction.currentProblemIndex + 1}</span></div>
                        <div>Time Left: <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{auction.timeLeft}s</span></div>
                    </div>
                )}
                {appStatus === 'CODING' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div>Coding Timer: {auction?.codingTimer || 0}s</div>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                {appStatus === 'WAITING' && (
                    <button onClick={adminStartAuction} className="hero-btn" style={{ padding: '1.5rem', fontSize: '1.2rem', width: '100%' }}>
                        START EVENT (AUCTION)
                    </button>
                )}

                {appStatus === 'COMPLETED' && (
                    <button onClick={startCoding} className="hero-btn" style={{ padding: '1.5rem', fontSize: '1.2rem', width: '100%' }}>
                        START CODING PHASE
                    </button>
                )}

                {appStatus === 'CODING' && (
                    <button onClick={endEvent} style={{
                        padding: '1.5rem',
                        fontSize: '1.5rem',
                        background: 'rgba(255, 77, 77, 0.2)',
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        width: '100%'
                    }}>
                        END EVENT
                    </button>
                )}

                {appStatus === 'FINISHED' && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem', fontSize: '1.5rem', color: 'var(--color-success)' }}>
                        EVENT FINISHED. LEADERBOARD IS LIVE.
                    </div>
                )}

                {['READY', 'AUCTION'].includes(appStatus) && (
                    <div style={{ padding: '2rem', border: '1px dashed var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                        Auction in progress... Monitor via Student View or Live Feed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
