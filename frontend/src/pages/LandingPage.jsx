import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Agriculture Intelligence Platform</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Revolutionizing agriculture with Market Equilibrium, Disease Prediction, and Pharma Targeting using Agentic AI.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Market Equilibrium</h2>
          <p>Analyze supply and demand for optimal pricing.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Disease Prediction</h2>
          <p>Predict crop diseases early with AI.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pharma Targeting</h2>
          <p>Target regions for pharmaceutical products.</p>
        </div>
      </div>
      <Link to="/login">
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;