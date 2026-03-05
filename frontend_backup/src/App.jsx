import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import CropDataSubmission from './pages/CropDataSubmission';
import MarketEquilibriumDashboard from './pages/MarketEquilibriumDashboard';
import DiseasePredictionResults from './pages/DiseasePredictionResults';
import PharmaCompanyDashboard from './pages/PharmaCompanyDashboard';
import InventoryDistribution from './pages/InventoryDistribution';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/crop-data" element={<CropDataSubmission />} />
        <Route path="/market-equilibrium" element={<MarketEquilibriumDashboard />} />
        <Route path="/disease-results" element={<DiseasePredictionResults />} />
        <Route path="/pharma-dashboard" element={<PharmaCompanyDashboard />} />
        <Route path="/inventory" element={<InventoryDistribution />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
