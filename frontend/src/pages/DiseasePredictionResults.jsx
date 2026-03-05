import React from 'react';

const DiseasePredictionResults = () => {
  // Mock data
  const results = {
    disease: 'Leaf Blight',
    severity: 'High',
    probability: 85,
    recommendations: ['Use fungicide X', 'Increase watering', 'Prune affected leaves']
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Disease Prediction Results</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Predicted Disease: {results.disease}</h2>
        <p className="mb-2"><strong>Severity:</strong> {results.severity}</p>
        <p className="mb-4"><strong>Probability:</strong> {results.probability}%</p>
        <h3 className="text-xl font-semibold mb-2">Recommendations:</h3>
        <ul className="list-disc list-inside">
          {results.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiseasePredictionResults;