const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactions.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  
app.use('/api/transactions', transactionRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
