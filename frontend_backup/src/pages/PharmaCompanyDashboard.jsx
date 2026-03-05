import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const PharmaCompanyDashboard = () => {
  const [locationFilter, setLocationFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [chartDistrict, setChartDistrict] = useState('');
  const [cropAreaData, setCropAreaData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      if (decoded.role !== 'pharma') {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5000/api/pharma/crop-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Check response type FIRST
        const contentType = res.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Non-JSON response:', text);
          throw new Error('Backend did not return JSON');
        }

        const data = await res.json();
        setCropData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCropArea = async () => {
      if (!chartDistrict) {
        setCropAreaData([]);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/pharma/crop-area?district=${encodeURIComponent(chartDistrict)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Non-JSON response for crop area:', text);
          throw new Error('Backend did not return JSON');
        }
        const data = await res.json();
        setCropAreaData(data);
      } catch (err) {
        console.error('Error fetching crop area:', err);
        setCropAreaData([]);
      }
    };
    fetchCropArea();
  }, [chartDistrict]);

  const geocodeLocations = async () => {
    const updatedData = [...cropData];
    for (let i = 0; i < updatedData.length; i++) {
      const item = updatedData[i];
      if (!item.lat || !item.lng) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.location_name)}, India`);
          const results = await response.json();
          if (results.length > 0) {
            updatedData[i] = { ...item, lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
          }
        } catch (error) {
          console.error('Geocoding error for', item.location_name, error);
        }
      }
    }
    setCropData(updatedData);
  };

  const exportToCSV = () => {
    const headers = ['Farmer ID', 'Planned Crop', 'Location', 'Lat', 'Lng'];
    const rows = filteredData.map(item => [
      item.farmer_id,
      item.planned_crop,
      item.location_name,
      item.lat || '',
      item.lng || ''
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharma_crop_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredData = cropData.filter(item =>
    (locationFilter === '' || item.location_name === locationFilter) &&
    (cropFilter === '' || item.planned_crop === cropFilter)
  );

  const mapData = filteredData.filter(
    item =>
      item.lat != null &&
      item.lng != null &&
      !isNaN(parseFloat(item.lat)) &&
      !isNaN(parseFloat(item.lng))
  );

  const uniqueLocations = [
    ...new Set(
      cropData
        .map(item => item.location_name)
        .filter(Boolean)
    )
  ];
  const uniqueCrops = [
    ...new Set(
      cropData
        .map(item => item.planned_crop)
        .filter(Boolean)
    )
  ];
  const uniqueWaterSources = [
    ...new Set(
      cropData
        .map(item => item.water_source)
        .filter(Boolean)
    )
  ];

  const cropCounts = uniqueCrops.reduce((acc, crop) => {
    acc[crop] = filteredData.filter(item => item.planned_crop === crop).length;
    return acc;
  }, {});

  const waterCounts = uniqueWaterSources.reduce((acc, water) => {
    acc[water] = filteredData.filter(item => item.water_source === water).length;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(cropCounts),
    datasets: [{
      label: 'Crop Distribution',
      data: Object.values(cropCounts),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  const pieData = {
    labels: Object.keys(waterCounts),
    datasets: [{
      data: Object.values(waterCounts),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const areaChartData = {
    labels: cropAreaData.map(item => item.planned_crop),
    datasets: [{
      label: 'Total Acres',
      data: cropAreaData.map(item => item.total_acres),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Pharma Company Dashboard</h1>
      {loading && <p className="text-gray-600 mb-4">Loading crop data...</p>}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Crop Data Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (District)</label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">All</option>
              {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned Crop</label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={cropFilter} onChange={(e) => setCropFilter(e.target.value)}>
              <option value="">All</option>
              {uniqueCrops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            {mapData.map((item, index) => (
              <Marker key={index} position={[parseFloat(item.lat), parseFloat(item.lng)]}>
                <Popup>
                  <div>
                    <p><strong>Farmer ID:</strong> {item.farmer_id}</p>
                    <p><strong>Planned Crop:</strong> {item.planned_crop}</p>
                    <p><strong>Location:</strong> {item.location_name}</p>
                    <p><strong>Lat:</strong> {item.lat}</p>
                    <p><strong>Lng:</strong> {item.lng}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={geocodeLocations} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Geocode Missing Locations</button>
          <button onClick={exportToCSV} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Export to CSV</button>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Data Visualizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow-md">
            <Bar data={barData} />
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Crop Area Distribution by District</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select District</label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={chartDistrict} onChange={(e) => setChartDistrict(e.target.value)}>
              <option value="">Select a district</option>
              {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {cropAreaData.length > 0 ? (
            <div className="bg-white p-4 rounded shadow-md">
              <Bar data={areaChartData} />
            </div>
          ) : (
            <p className="text-gray-600">No data available for the selected district.</p>
          )}
        </div>
  
      </div>
    </div>
  );
};

export default PharmaCompanyDashboard;