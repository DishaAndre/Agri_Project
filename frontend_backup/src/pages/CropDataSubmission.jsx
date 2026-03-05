import React, { useState } from 'react';
import Select from 'react-select';

const CropDataSubmission = () => {
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
  risk_tolerance: ''
});

  const [suggestedCrops, setSuggestedCrops] = useState([]);
  const [loading, setLoading] = useState(false);

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
    { value: 'Mumbai Suburban', label: 'Mumbai Suburban' }
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', formData);
    const token = localStorage.getItem('token');
    console.log('Token sent:', token);
    if (!token) {
      alert('Please login first');
      return;
    }
    setLoading(true);
    try {
      // Prepare data for n8n
      const n8nData = {
        location: formData.location,
        area_size: `${formData.area_size} acres`,
        wind_intensity: formData.wind_intensity,
        soil_type: formData.soil_type,
        water_source: formData.water_source,
        previous_crop: formData.previous_crop,
        planed_crop: formData.planned_crop,
        labor_availability: formData.labor_availability,
        capital_investment: formData.capital_investment,
        mechanization_level: formData.mechanization_level,
        risk_tolerance: formData.risk_tolerance
      };

      console.log(n8nData);

      // Call n8n webhook
      const n8nResponse = await fetch('https://n8n-l420.onrender.com/webhook/crop-data', {
        method: 'POST',
        body: JSON.stringify(n8nData)
      });
      const suggestions = await n8nResponse.json();
      setSuggestedCrops(suggestions);

      // Submit to backend
      const response = await fetch('http://localhost:5000/api/farmer/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFormData({
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
          risk_tolerance: ''
        });
        setSuggestedCrops([]);
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Crop Data Submission</h1>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Getting crop recommendations...</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-lg">
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
          <label className="block text-gray-700 mb-2">Area Size (in Hectares)</label>
          <input
            type="number"
            name="area_size"
            value={formData.area_size}
            onChange={(e) => setFormData({ ...formData, area_size: Number(e.target.value) })}
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
          <label className="block text-gray-700 mb-2">Suggested Crops</label>
          {suggestedCrops.length > 0 ? (
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Recommended Crops Based on Your Data:</h3>
              <ul className="list-disc list-inside">
                {suggestedCrops.map((crop, index) => (
                  <li key={index} className="text-green-800">{crop}</li>
                ))}
              </ul>
            </div>
          ) : (
            <Select
              options={cropOptions}
              value={cropOptions.find(option => option.value === formData.planned_crop)}
              onChange={(selected) => setFormData({ ...formData, planned_crop: selected ? selected.value : '' })}
              isSearchable
              placeholder="Select Planned Crop"
              required
            />
          )}
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
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CropDataSubmission;