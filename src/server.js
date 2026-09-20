/* Bhu-Netra backend — Express + SQLite + Gemini Vision OCR.
 * API endpoints have been moved to src/routes/api.js
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const store = require('./db');
const { warmWorkers } = require('./ocr');
const apiRoutes = require('./routes/api');

const app = express();

// Security and standard middlewares
app.use(helmet({
  contentSecurityPolicy: false, // In case the frontend needs inline scripts/styles
}));
app.use(cors());
app.use(morgan('dev')); // Request logging

// Rate limiting removed for hackathon tests

app.use(express.json({ limit: '2mb' }));

// Mount the API router
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[server error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Static files (frontend)
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  store.initDb().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('Bhu-Netra backend listening on :' + PORT);
      // pre-boot the OCR workers so the first scan skips the 2-4s engine boot
      warmWorkers()
        .then(() => console.log('OCR workers warm (primary + digit-repair)'))
        .catch(e => console.error('worker warmup deferred to first scan:', e.message));
    });
  }).catch(e => {
    console.error('boot failed', e);
    process.exit(1);
  });
}

module.exports = { app };
