import React, { createContext, useReducer, useContext, useEffect } from 'react';

// --- INITIAL STATE ---
const initialState = {
  appStatus: 'WAITING', // WAITING, READY, AUCTION, COMPLETED, CODING, FINISHED
  user: {
    id: 'team_alpha',
    name: 'Team Alpha',
    wallet: 100,
    purchasedProblems: []
  },
  auction: {
    currentProblemIndex: -1,
    currentProblem: null,
    highestBid: 0,
    highestBidder: null,
    timeLeft: 0,
    isPaused: false
  },
  problems: [
    {
      id: 101,
      title: 'Binary Tree Inversion',
      difficulty: 'Medium',
      basePoints: 50,
      description: "Given the root of a binary tree, invert the tree, and return its root. The inversion swaps every left node with its corresponding right node.",
      starterCode: "def invertTree(root):\n  # Write your code here\n  pass"
    },
    {
      id: 102,
      title: 'Find the Duplicate',
      difficulty: 'Easy',
      basePoints: 30,
      description: "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number.",
      starterCode: "def findDuplicate(nums):\n  # Write your code here\n  pass"
    },
    {
      id: 103,
      title: 'Graph Shortest Path',
      difficulty: 'Hard',
      basePoints: 80,
      description: "Given a weighted DAG, find the shortest path from node 0 to node N-1.",
      starterCode: "def shortestPath(n, edges):\n  # Write your code here\n  pass"
    },
    {
      id: 104,
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      basePoints: 80,
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      starterCode: "def mergeKLists(lists):\n  # Write your code here\n  pass"
    }
  ],
  messages: [] // For live console logs
};

// --- ACTIONS ---
const ACTIONS = {
  SET_STATUS: 'SET_STATUS',
  START_AUCTION: 'START_AUCTION',
  NEXT_PROBLEM: 'NEXT_PROBLEM',
  PLACE_BID: 'PLACE_BID',
  TICK: 'TICK',
  END_PROBLEM: 'END_PROBLEM',
  START_CODING: 'START_CODING',
  SOLVE_PROBLEM: 'SOLVE_PROBLEM',
  ADD_MESSAGE: 'ADD_MESSAGE'
};

// --- REDUCER ---
function auctionReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STATUS:
      return { ...state, appStatus: action.payload };

    case ACTIONS.START_AUCTION:
      return {
        ...state,
        appStatus: 'READY',
        messages: [...state.messages, { id: Date.now(), text: 'Auction is about to begin!', type: 'info' }]
      };

    case ACTIONS.NEXT_PROBLEM:
      const nextIndex = state.auction.currentProblemIndex + 1;
      if (nextIndex >= state.problems.length) {
        return {
          ...state,
          appStatus: 'COMPLETED',
          messages: [...state.messages, { id: Date.now(), text: 'Auction Completed! Get ready for coding.', type: 'success' }]
        };
      }
      return {
        ...state,
        appStatus: 'AUCTION',
        auction: {
          ...state.auction,
          currentProblemIndex: nextIndex,
          currentProblem: state.problems[nextIndex],
          highestBid: 0,
          highestBidder: null,
          timeLeft: 30, // 30 seconds per problem
        },
        messages: [...state.messages, { id: Date.now(), text: `Problem #${nextIndex + 1} is now LIVE!`, type: 'info' }]
      };

    case ACTIONS.PLACE_BID:
      const { amount, bidder } = action.payload;
      // Validation logic (should be double checked even if UI prevents it)
      if (amount <= state.auction.highestBid) return state;

      const newMessages = [...state.messages];
      if (bidder === state.user.name) {
        newMessages.push({ id: Date.now(), text: `You bid ${amount} coins`, type: 'action' });
      } else {
        newMessages.push({ id: Date.now(), text: `${bidder} bid ${amount} coins`, type: 'alert' });
      }

      return {
        ...state,
        auction: {
          ...state.auction,
          highestBid: amount,
          highestBidder: bidder
        },
        messages: newMessages
      };

    case ACTIONS.TICK:
      return {
        ...state,
        auction: {
          ...state.auction,
          timeLeft: state.auction.timeLeft - 1
        }
      };

    case ACTIONS.END_PROBLEM:
      const { highestBidder, highestBid, currentProblem } = state.auction;
      const soldMessage = highestBidder
        ? `Problem sold to ${highestBidder} for ${highestBid} coins.`
        : `Problem unsold.`;

      // Update logic if current user won
      let updatedUser = { ...state.user };
      if (highestBidder === state.user.name) {
        updatedUser.wallet -= highestBid;
        updatedUser.purchasedProblems = [...updatedUser.purchasedProblems, currentProblem];
      }

      return {
        ...state,
        user: updatedUser,
        messages: [...state.messages, { id: Date.now(), text: soldMessage, type: 'success' }]
      };

    case ACTIONS.SOLVE_PROBLEM:
      const { problemId } = action.payload;
      const updatedPurchases = state.user.purchasedProblems.map(p =>
        p.id === problemId ? { ...p, status: 'SOLVED' } : p
      );
      return {
        ...state,
        user: { ...state.user, purchasedProblems: updatedPurchases },
        messages: [...state.messages, { id: Date.now(), text: `Problem #${problemId} Solved!`, type: 'success' }]
      };

    case ACTIONS.START_CODING:
      return { ...state, appStatus: 'CODING' };

    case 'SKIP_TO_CODING':
      return {
        ...state,
        appStatus: 'CODING',
        user: {
          ...state.user,
          purchasedProblems: [state.problems[0], state.problems[2]] // Give them 2 problems to test
        }
      };

    default:
      return state;
  }
}

// --- CONTEXT ---
const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auctionReducer, initialState);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (state.appStatus === 'AUCTION' && state.auction.timeLeft > 0) {
      timer = setInterval(() => {
        dispatch({ type: ACTIONS.TICK });
      }, 1000);
    } else if (state.appStatus === 'AUCTION' && state.auction.timeLeft === 0) {
      // Problem Ended
      dispatch({ type: ACTIONS.END_PROBLEM });

      // Automatic transition to next problem after delay
      setTimeout(() => {
        dispatch({ type: ACTIONS.NEXT_PROBLEM });
      }, 5000); // 5s gap
    }
    return () => clearInterval(timer);
  }, [state.appStatus, state.auction.timeLeft]);

  // Admin Actions (Simulated)
  const adminStartAuction = () => {
    dispatch({ type: ACTIONS.START_AUCTION });
    setTimeout(() => {
      dispatch({ type: ACTIONS.NEXT_PROBLEM });
    }, 3000); // Start first problem after 3s ready state
  };

  const placeBid = (amount) => {
    if (state.appStatus !== 'AUCTION') return;
    if (amount > state.user.wallet) return; // Client side check
    if (amount <= state.auction.highestBid) return;

    dispatch({ type: ACTIONS.PLACE_BID, payload: { amount, bidder: state.user.name } });
  };

  // Simulate Opponent Bids
  useEffect(() => {
    if (state.appStatus === 'AUCTION' && state.auction.timeLeft > 5) {
      // Random chance for opponent to bid
      const randomBid = Math.random();
      if (randomBid > 0.7) {
        const opponentBid = state.auction.highestBid + Math.floor(Math.random() * 5) + 1;
        // Make sure opponent doesn't bid if it's too high? Na strictly increasing.
        // Just a basic simulation
        setTimeout(() => {
          dispatch({
            type: ACTIONS.PLACE_BID,
            payload: { amount: opponentBid, bidder: 'Team Beta' }
          });
        }, Math.random() * 2000);
      }
    }
  }, [state.auction.highestBid, state.appStatus]);

  const value = {
    state,
    adminStartAuction,
    placeBid,
    solveProblem: (problemId) => dispatch({ type: ACTIONS.SOLVE_PROBLEM, payload: { problemId } }),
    startCoding: () => dispatch({ type: ACTIONS.START_CODING }),
    skipToCoding: () => dispatch({ type: 'SKIP_TO_CODING' })
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => useContext(AuctionContext);
