import React from 'react';
import { useAuction } from '../context/AuctionContext';

const AdminDashboard = ({ onBack }) => {
    const { state, adminStartAuction, startCoding, endEvent } = useAuction();
    const { appStatus, auction } = state;

    return (
        <div className="container" style={{ padding: '2rem', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="text-gradient">ADMIN DASHBOARD</h1>
                <button onClick={onBack} style={{ background: 'transparent', color: 'var(--color-text-muted)' }}>Logout</button>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Game Status: <span style={{ color: 'var(--color-primary)' }}>{appStatus}</span></h2>

                {appStatus === 'AUCTION' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div>Current Problem: #{auction.currentProblemIndex + 1}</div>
                        <div>Time Left: {auction.timeLeft}s</div>
                    </div>
                )}
                {appStatus === 'CODING' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div>Coding Timer: {auction?.codingTimer || 0}s</div>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {appStatus === 'WAITING' && (
                    <button onClick={adminStartAuction} className="btn-primary" style={{ padding: '1.5rem', fontSize: '1.5rem' }}>
                        START EVENT (AUCTION)
                    </button>
                )}

                {appStatus === 'COMPLETED' && (
                    <button onClick={startCoding} className="btn-primary" style={{ padding: '1.5rem', fontSize: '1.5rem' }}>
                        START CODING PHASE
                    </button>
                )}

                {appStatus === 'CODING' && (
                    <button onClick={endEvent} style={{ padding: '1.5rem', fontSize: '1.5rem', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        END EVENT
                    </button>
                )}

                {appStatus === 'FINISHED' && (
                    <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--color-success)' }}>
                        EVENT FINISHED. LEADERBOARD IS LIVE.
                    </div>
                )}

                {['READY', 'AUCTION'].includes(appStatus) && (
                    <div style={{ padding: '2rem', border: '1px dashed var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Auction in progress... Monitor via Student View or Live Feed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
