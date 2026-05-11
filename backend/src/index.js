require('dotenv').config();
const express = require('express');
const cors = require('cors');
const catalogRoutes = require('./routes/catalog.routes');
const { startPolling } = require('./services/sync.service');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/catalog', catalogRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  startPolling();
});