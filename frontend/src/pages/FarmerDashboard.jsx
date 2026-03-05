import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('submission');
  const [formData, setFormData] = useState({
    location: '',
    area_size: '',
    wind_intensity: '',
    soil_type: '',
    water_source: '',
    previous_crop: '',
    planned_crop: '',
    labor_availability: '',
    capital_investment: '',
    mechanization_level: '',
    risk_tolerance: '',
    symptoms: '',
    cropType: ''
  });
  const [diseaseResults, setDiseaseResults] = useState(null);

  const locationOptions = [
    { value: 'Pune', label: 'Pune' },
    { value: 'Nashik', label: 'Nashik' },
    { value: 'Nagpur', label: 'Nagpur' },
    { value: 'Kolhapur', label: 'Kolhapur' },
    { value: 'Solapur', label: 'Solapur' },
    { value: 'Ahmednagar', label: 'Ahmednagar' },
    { value: 'Satara', label: 'Satara' },
    { value: 'Sangli', label: 'Sangli' },
    { value: 'Jalgaon', label: 'Jalgaon' },
    { value: 'Dhule', label: 'Dhule' },
    { value: 'Nanded', label: 'Nanded' },
    { value: 'Latur', label: 'Latur' },
    { value: 'Beed', label: 'Beed' },
    { value: 'Parbhani', label: 'Parbhani' },
    { value: 'Hingoli', label: 'Hingoli' },
    { value: 'Osmanabad', label: 'Osmanabad' },
    { value: 'Akola', label: 'Akola' },
    { value: 'Amravati', label: 'Amravati' },
    { value: 'Wardha', label: 'Wardha' },
    { value: 'Bhandara', label: 'Bhandara' },
    { value: 'Gondia', label: 'Gondia' },
    { value: 'Chandrapur', label: 'Chandrapur' },
    { value: 'Gadchiroli', label: 'Gadchiroli' },
    { value: 'Raigad', label: 'Raigad' },
    { value: 'Ratnagiri', label: 'Ratnagiri' },
    { value: 'Sindhudurg', label: 'Sindhudurg' },
    { value: 'Palghar', label: 'Palghar' },
    { value: 'Thane', label: 'Thane' },
    { value: 'Mumbai City', label: 'Mumbai City' },
    { value: 'Mumbai Suburban', label: 'Mumbai Suburban' },
    { value: 'Vasai-Virar', label: 'Vasai-Virar' }
  ];

  const windIntensityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'High', label: 'High' }
  ];

  const soilTypeOptions = [
    { value: 'Black Soil (Regur)', label: 'Black Soil (Regur)' },
    { value: 'Red Soil', label: 'Red Soil' },
    { value: 'Laterite Soil', label: 'Laterite Soil' },
    { value: 'Alluvial Soil', label: 'Alluvial Soil' },
    { value: 'Sandy Soil', label: 'Sandy Soil' },
    { value: 'Loamy Soil', label: 'Loamy Soil' },
    { value: 'Clayey Soil', label: 'Clayey Soil' },
    { value: 'Mixed Soil', label: 'Mixed Soil' }
  ];

  const waterSourceOptions = [
    { value: 'Borewell', label: 'Borewell' },
    { value: 'Canal Irrigation', label: 'Canal Irrigation' },
    { value: 'Open Well', label: 'Open Well' },
    { value: 'Borewell + Canal', label: 'Borewell + Canal' },
    { value: 'Rainfed', label: 'Rainfed' }
  ];

  const cropOptions = [
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Soybean', label: 'Soybean' },
    { value: 'Sugarcane', label: 'Sugarcane' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Rice', label: 'Rice' },
    { value: 'Jowar', label: 'Jowar' },
    { value: 'Bajra', label: 'Bajra' },
    { value: 'Maize', label: 'Maize' },
    { value: 'Tur (Pigeon Pea)', label: 'Tur (Pigeon Pea)' },
    { value: 'Gram (Chickpea)', label: 'Gram (Chickpea)' },
    { value: 'Groundnut', label: 'Groundnut' },
    { value: 'Onion', label: 'Onion' },
    { value: 'Tomato', label: 'Tomato' },
    { value: 'Banana', label: 'Banana' },
    { value: 'Grapes', label: 'Grapes' },
    { value: 'Orange', label: 'Orange' },
    { value: 'Pomegranate', label: 'Pomegranate' },
    { value: 'Sunflower', label: 'Sunflower' },
    { value: 'Mustard', label: 'Mustard' }
  ];

  const laborOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const capitalOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const mechanizationOptions = [
    { value: 'Low-Mechanized', label: 'Low-Mechanized' },
    { value: 'Semi-Mechanized', label: 'Semi-Mechanized' },
    { value: 'High-Mechanized', label: 'High-Mechanized' }
  ];

  const riskOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];
  const [marketData, setMarketData] = useState({ supply: [], demand: [] });
  const [filters, setFilters] = useState({ state: '', district: '', subdistrict: '', crop: '' });
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSubdistricts, setAvailableSubdistricts] = useState([]);

  const indiaData = {
    'Maharashtra': {
      'Mumbai': ['Andheri', 'Bandra'],
      'Pune': ['Kothrud', 'Aundh']
    },
    'Karnataka': {
      'Bangalore': ['Whitefield', 'Koramangala'],
      'Mysore': ['Nazarbad', 'Chamundi']
    },
    'Tamil Nadu': {
      'Chennai': ['T. Nagar', 'Adyar'],
      'Coimbatore': ['Gandhipuram', 'RS Puram']
    }
  };

  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Potato', 'Tomato', 'Onion', 'Banana'];

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFilters({ ...filters, state, district: '', subdistrict: '' });
    setAvailableDistricts(Object.keys(indiaData[state] || {}));
    setAvailableSubdistricts([]);
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFilters({ ...filters, district, subdistrict: '' });
    setAvailableSubdistricts(indiaData[filters.state][district] || []);
  };

  const handleSubdistrictChange = (e) => {
    setFilters({ ...filters, subdistrict: e.target.value });
  };

  const handleCropChange = (e) => {
    setFilters({ ...filters, crop: e.target.value });
  };

  const fetchMarketData = async () => {
    const token = localStorage.getItem('token');
    try {
      const params = new URLSearchParams({
        state: filters.state,
        district: filters.district,
        subdistrict: filters.subdistrict,
        crop: filters.crop
      });
      const response = await fetch(`http://localhost:5000/api/ai/market-equilibrium?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'market') {
      fetchMarketData();
    }
  }, [activeTab, filters]);

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return null;
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/farmer/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Data submitted successfully');
        setFormData({ location: '', area_size: '', wind_intensity: '', soil_type: '', water_source: '', previous_crop: '', planned_crop: '', labor_availability: '', capital_investment: '', mechanization_level: '', risk_tolerance: '', symptoms: '', cropType: '' });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleDiseasePredict = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/ai/disease-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ symptoms: formData.symptoms, cropType: formData.planned_crop })
      });
      const data = await response.json();
      setDiseaseResults(data);
    } catch (error) {
      console.error('Error predicting disease:', error);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Supply',
        data: marketData.supply,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Demand',
        data: marketData.demand,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Market Equilibrium: Supply vs Demand' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <h2 className="text-2xl font-bold p-4">Farmer Dashboard</h2>
        <nav className="p-4">
          <button
            onClick={() => setActiveTab('submission')}
            className={`block w-full text-left p-2 mb-2 rounded ${activeTab === 'submission' ? 'bg-green-200' : 'hover:bg-gray-200'}`}
          >
            Crop Data Submission
          </button>
          <button
            onClick={() => setActiveTab('disease')}
            className={`block w-full text-left p-2 mb-2 rounded ${activeTab === 'disease' ? 'bg-green-200' : 'hover:bg-gray-200'}`}
          >
            Disease Detection
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'market' ? 'bg-green-200' : 'hover:bg-gray-200'}`}
          >
            Market Prices
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === 'submission' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Crop Data Submission</h1>
            <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md max-w-lg">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Location</label>
                <Select
                  options={locationOptions}
                  value={locationOptions.find(option => option.value === formData.location)}
                  onChange={(selected) => setFormData({ ...formData, location: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Location"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Area Size (in Acres)</label>
                <input
                  type="number"
                  name="area_size"
                  value={formData.area_size}
                  onChange={(e) => setFormData({ ...formData, area_size: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Wind Intensity</label>
                <Select
                  options={windIntensityOptions}
                  value={windIntensityOptions.find(option => option.value === formData.wind_intensity)}
                  onChange={(selected) => setFormData({ ...formData, wind_intensity: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Wind Intensity"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Soil Type</label>
                <Select
                  options={soilTypeOptions}
                  value={soilTypeOptions.find(option => option.value === formData.soil_type)}
                  onChange={(selected) => setFormData({ ...formData, soil_type: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Soil Type"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Water Source</label>
                <Select
                  options={waterSourceOptions}
                  value={waterSourceOptions.find(option => option.value === formData.water_source)}
                  onChange={(selected) => setFormData({ ...formData, water_source: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Water Source"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Previous Crop</label>
                <Select
                  options={cropOptions}
                  value={cropOptions.find(option => option.value === formData.previous_crop)}
                  onChange={(selected) => setFormData({ ...formData, previous_crop: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Previous Crop"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Planned Crop</label>
                <Select
                  options={cropOptions}
                  value={cropOptions.find(option => option.value === formData.planned_crop)}
                  onChange={(selected) => setFormData({ ...formData, planned_crop: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Planned Crop"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Labor Availability</label>
                <Select
                  options={laborOptions}
                  value={laborOptions.find(option => option.value === formData.labor_availability)}
                  onChange={(selected) => setFormData({ ...formData, labor_availability: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Labor Availability"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Capital Investment</label>
                <Select
                  options={capitalOptions}
                  value={capitalOptions.find(option => option.value === formData.capital_investment)}
                  onChange={(selected) => setFormData({ ...formData, capital_investment: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Capital Investment"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mechanization Level</label>
                <Select
                  options={mechanizationOptions}
                  value={mechanizationOptions.find(option => option.value === formData.mechanization_level)}
                  onChange={(selected) => setFormData({ ...formData, mechanization_level: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Mechanization Level"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Risk Tolerance</label>
                <Select
                  options={riskOptions}
                  value={riskOptions.find(option => option.value === formData.risk_tolerance)}
                  onChange={(selected) => setFormData({ ...formData, risk_tolerance: selected ? selected.value : '' })}
                  isSearchable
                  placeholder="Select Risk Tolerance"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {activeTab === 'disease' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Disease Detection</h1>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Symptoms</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Describe the symptoms"
              />
            </div>
            <button
              onClick={handleDiseasePredict}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Predict Disease
            </button>
            {diseaseResults && (
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Predicted Disease: {diseaseResults.disease}</h2>
                <p className="mb-2"><strong>Severity:</strong> {diseaseResults.severity}</p>
                <p className="mb-4"><strong>Probability:</strong> {diseaseResults.probability}%</p>
                <h3 className="text-xl font-semibold mb-2">Recommendations:</h3>
                <ul className="list-disc list-inside">
                  {diseaseResults.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'market' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Market Prices</h1>
            <div className="mb-4 flex gap-4 flex-wrap">
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <select value={filters.state} onChange={handleStateChange} className="px-3 py-2 border rounded">
                  <option value="">Select State</option>
                  {Object.keys(indiaData).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">District</label>
                <select value={filters.district} onChange={handleDistrictChange} className="px-3 py-2 border rounded" disabled={!filters.state}>
                  <option value="">Select District</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Subdistrict</label>
                <select value={filters.subdistrict} onChange={handleSubdistrictChange} className="px-3 py-2 border rounded" disabled={!filters.district}>
                  <option value="">Select Subdistrict</option>
                  {availableSubdistricts.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Crop</label>
                <select value={filters.crop} onChange={handleCropChange} className="px-3 py-2 border rounded">
                  <option value="">Select Crop</option>
                  {crops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;