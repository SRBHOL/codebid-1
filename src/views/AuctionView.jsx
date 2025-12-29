import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';

const AuctionView = () => {
    const { state, placeBid, startCoding } = useAuction();
    const { auction, user, messages } = state;
    const { currentProblem } = auction;
    const [bidAmount, setBidAmount] = useState('');

    const handleBid = (e) => {
        e.preventDefault();
        if (!bidAmount) return;
        placeBid(parseInt(bidAmount));
        setBidAmount('');
    };

    // Scroll to bottom of messages
    useEffect(() => {
        const msgContainer = document.getElementById('message-log');
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [messages]);

    // If all problems are done (COMPLETED), show Admin control to start coding
    if (state.appStatus === 'COMPLETED') {
        return (
            <div className="container flex-center" style={{ flexDirection: 'column', height: '100vh', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>AUCTION COMPLETED</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                    All problems have been auctioned.<br />
                    Prepare for the Coding Phase.
                </p>
            </div>
        );
    }

    if (!currentProblem) return <div className="flex-center" style={{ height: '100vh' }}>Loading Problem...</div>;

    const isWinning = auction.highestBidder === user.name;

    return (
        <div className="container" style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', gap: '2rem' }}>
            {/* Header */}
            <header className="flex-center" style={{ justifyContent: 'space-between' }}>
                <div className="text-gradient" style={{ fontSize: '1.5rem' }}>CODEBID</div>
                <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', gap: '1rem' }}>
                    <span>Wallet: <strong style={{ color: 'var(--color-success)' }}>{user.wallet}</strong></span>
                    <span>Problem: {auction.currentProblemIndex + 1}/{state.problems.length}</span>
                </div>
            </header>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>

                {/* Left: Problem Card */}
                <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>

                    {/* Timer Badge */}
                    <div style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: auction.timeLeft < 10 ? 'var(--color-accent)' : 'var(--color-primary)',
                        color: '#000', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 'bold'
                    }} className={auction.timeLeft < 10 ? 'animate-pulse-glow' : ''}>
                        {auction.timeLeft}s REMAINING
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem',
                            color: currentProblem.difficulty === 'Hard' ? 'var(--color-accent)' : 'var(--color-success)'
                        }}>
                            {currentProblem.difficulty}
                        </span>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{currentProblem.title}</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
                        Base Points: {currentProblem.basePoints}
                    </p>

                    <hr style={{ borderColor: 'var(--color-border)', margin: '2rem 0' }} />

                    {/* Current Bid Display */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>CURRENT HIGHEST BID</div>
                        <div style={{ fontSize: '4rem', fontWeight: '800', color: auction.highestBid > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            {auction.highestBid}
                        </div>
                        {auction.highestBidder && (
                            <div style={{
                                color: isWinning ? 'var(--color-success)' : 'var(--color-secondary)'
                            }}>
                                {isWinning ? 'YOU ARE WINNING' : `HELD BY ${auction.highestBidder}`}
                            </div>
                        )}
                    </div>

                    {/* Bidding Controls */}
                    <form onSubmit={handleBid} style={{ display: 'flex', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                        <input
                            type="number"
                            placeholder="Enter amount..."
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            min={auction.highestBid + 1}
                            style={{ flex: 1, fontSize: '1.2rem', textAlign: 'center' }}
                            autoFocus
                        />
                        <button type="submit" style={{
                            background: 'var(--color-success)', color: '#000', fontWeight: 'bold', padding: '0 2rem', borderRadius: 'var(--radius-sm)'
                        }}>
                            BID
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Min Bid: {auction.highestBid + 1}
                    </div>

                </div>

                {/* Right: Live Feed */}
                <div className="glass-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 'bold' }}>
                        LIVE ACTIVITY
                    </div>
                    <div id="message-log" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                fontSize: '0.9rem',
                                color: msg.type === 'alert' ? 'var(--color-accent)' : msg.type === 'success' ? 'var(--color-success)' : msg.type === 'action' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                            }}>
                                <span style={{ opacity: 0.5, marginRight: '8px' }}>
                                    [{new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                                </span>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuctionView;
