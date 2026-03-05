const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const { authenticate, authorize } = require('./middleware/auth');
const pool = require('./db');

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'yes' : 'no');
console.log('JWT_SECRET value:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ message: 'DB connected', rows: result.rows });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ message: 'DB connection failed', error: error.message });
  }
});

// Auth API
app.post('/api/register', async (req, res) => {
  const { email, password, role } = req.body;
  console.log('Register attempt:', { email, role });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', [email, hashedPassword, role]);
    console.log('User registered:', email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      res.status(400).json({ message: 'User already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Demo credentials
  const demoUsers = {
    'farmer@example.com': { id: 1, password: '23431515Sm', role: 'farmer' },
    'pharma@example.com': { id: 2, password: '23431515Sm', role: 'pharma' },
    'admin@example.com': { id: 3, password: '23431515Sm', role: 'admin' }
  };

  if (demoUsers[email] && password === demoUsers[email].password) {
    const user = demoUsers[email];
    // Insert demo user if not exists
    try {
      await pool.query(
        'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [user.id, email, 'demo', user.role]
      );
    } catch (insertError) {
      console.log('Insert demo user error:', insertError.message);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    console.log('Generated token:', token);
    return res.json({ token });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    console.log('Generated token:', token);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Farmer APIs
app.post('/api/farmer/data', authenticate, authorize(['farmer']), async (req, res) => {
  const userId = req.user.id;

  const {
    location,
    area_size,
    wind_intensity,
    soil_type,
    water_source,
    previous_crop,
    planned_crop,
    labor_availability,
    capital_investment,
    mechanization_level,
    risk_tolerance
  } = req.body;

  // Validation
  if (!location || !area_size) {
    return res.status(400).json({
      message: 'location and area_size are required'
    });
  }

  console.log('Inserting data:', { userId, location, area_size, wind_intensity, soil_type, water_source, previous_crop, planned_crop, labor_availability, capital_investment, mechanization_level, risk_tolerance });
  try {
    const result = await pool.query(
      `
      INSERT INTO crop_data (
        user_id, location, area_size, wind_intensity, soil_type,
        water_source, previous_crop, planned_crop,
        labor_availability, capital_investment,
        mechanization_level, risk_tolerance
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
      `,
      [
        userId,
        location,
        area_size,
        wind_intensity,
        soil_type,
        water_source,
        previous_crop,
        planned_crop,
        labor_availability,
        capital_investment,
        mechanization_level,
        risk_tolerance
      ]
    );

    res.status(201).json({
      message: 'Data submitted successfully',
      data: result.rows[0]
    });

    // Trigger n8n workflow
    try {
      const response = await axios.post('https://n8n-l420.onrender.com/webhook/crop-data', req.body);
      console.log('n8n response:', response.data);
      // Save the report to a file for download
      if (response.data) {
        fs.writeFileSync('price_trend_report.json', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error('Error triggering n8n:', error);
    }
  } catch (error) {
    console.error('Postgres insert error:', error.message, error.code, error.detail);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

app.get('/api/farmer/alerts', authenticate, authorize(['farmer']), (req, res) => {
  res.json({ alerts: ['Disease alert in your area'] });
});

app.get('/api/farmer/market-price', authenticate, authorize(['farmer']), (req, res) => {
  res.json({ price: 100 });
});

// Pharma APIs
app.get('/api/pharma/area-risk', authenticate, authorize(['pharma']), (req, res) => {
  res.json({ risks: [{ area: 'Area1', risk: 'High' }] });
});

app.get('/api/pharma/demand-forecast', authenticate, authorize(['pharma']), (req, res) => {
  res.json({ forecast: 'High demand for fungicide' });
});

app.post('/api/pharma/dispatch', authenticate, authorize(['pharma']), (req, res) => {
  console.log('Dispatch:', req.body);
  res.json({ message: 'Dispatched successfully' });
});

app.get('/api/pharma/crop-data', authenticate, authorize(['pharma']), async (req, res) => {
  console.log('Pharma crop-data API called');
  try {
    const result = await pool.query(`
      SELECT
        id,
        user_id as farmer_id,
        location as location_name,
        planned_crop,
        soil_type,
        water_source,
        lat,
        lng
      FROM crop_data
    `);
    console.log('Rows fetched:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching crop data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/pharma/crop-area', authenticate, authorize(['pharma']), async (req, res) => {
  const { district } = req.query;
  if (!district) {
    return res.status(400).json({ message: 'District parameter is required' });
  }
  console.log('Pharma crop-area API called for district:', district);
  try {
    const result = await pool.query(`
      SELECT
        planned_crop,
        SUM(area_size) AS total_acres
      FROM crop_data
      WHERE location = $1
      GROUP BY planned_crop
      ORDER BY total_acres DESC
    `, [district]);
    console.log('Crop area rows fetched:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching crop area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin APIs
app.get('/api/admin/users', authenticate, authorize(['admin']), (req, res) => {
  res.json({ users: [{ id: 1, name: 'User1', role: 'farmer' }] });
});

// AI APIs
app.post('/api/ai/disease-predict', authenticate, authorize(['farmer']), (req, res) => {
  // Mock prediction
  res.json({ disease: 'Leaf Blight', severity: 'High', probability: 85, recommendations: ['Use fungicide X'] });
});

app.get('/api/ai/market-equilibrium', authenticate, authorize(['farmer', 'admin']), async (req, res) => {
  const { state, district, subdistrict, crop } = req.query;
  try {
    // Assuming agamarket API
    const response = await axios.get('https://api.agamarket.com/v1/prices', {
      params: { state, district, subdistrict, crop },
      headers: { 'api-key': process.env.AGAMARKET_API_KEY }
    });
    // Assume response.data has supply and demand
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Fallback to mock
    res.json({ supply: [10,20,15], demand: [15,25,20] });
  }
});

// Download report
app.get('/api/download-report', authenticate, authorize(['farmer', 'admin']), (req, res) => {
  const filePath = 'price_trend_report.json';
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'price_trend_report.json');
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});