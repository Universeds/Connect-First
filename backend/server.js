require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const needRoutes = require('./routes/needRoutes');
const basketRoutes = require('./routes/basketRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// MySQL session store configuration
const sessionStoreOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'cfuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'connect_first',
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000 // 24 hours
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  key: 'connect_first_sid',
  secret: process.env.SESSION_SECRET || 'connect-first-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/needs', needRoutes);
app.use('/api/basket', basketRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Connect First API is running', database: 'MariaDB' });
});

// Connect to MariaDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
});
