
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const upDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(upDir)) fs.mkdirSync(upDir, { recursive: true });

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(upDir));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/public', require('./routes/public.routes'));
app.use('/api', require('./routes/api.routes'));

app.get('/', (_, res) => res.json({ message: 'HRMS Pro API v3', tables: 59 }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n✅  HRMS Pro Backend v3 → http://localhost:' + PORT);
  console.log('    admin@hrms.com / admin123\n');
});
