const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
