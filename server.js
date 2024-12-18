const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static('public'));

// Middleware to set Content-Type for JavaScript files
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public', 'browser')));

// Routes
app.get('/api/env-config', async (req, res) => {
  try {
    const configPath = path.join(__dirname, 'envConfig.json');
    const configData = await fs.readFile(configPath, 'utf8');
    res.json(JSON.parse(configData));
  } catch (error) {
    res.status(500).json({ message: 'Error reading config file', error: error.message });
  }
});

app.post('/api/env-config', async (req, res) => {
  try {
    const configPath = path.join(__dirname, 'envConfig.json');
    await fs.writeFile(configPath, JSON.stringify(req.body, null, 2));
    res.json({ message: 'Config updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error writing config file', error: error.message });
  }
});

// All other GET requests not handled before will return the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'browser', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});