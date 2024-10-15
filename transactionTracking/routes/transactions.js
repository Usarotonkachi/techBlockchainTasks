const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction.js');
const router = express.Router();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;


const fetchTransactions = async (address) => {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  
  const response = await axios.get(url);
  return response.data.result.slice(0, 5);
};


router.get('/:address', async (req, res) => {
  const address = req.params.address;

  try {
    
    const transactions = await fetchTransactions(address);

    const savedTransactions = await Transaction.insertMany(transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timestamp: new Date(tx.timeStamp * 1000), 
    })));

    res.status(200).json(savedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch or save transactions.' });
  }
});


router.get('/:address/range', async (req, res) => {
  const { address } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const transactions = await Transaction.find({
      from: address,
      timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to query transactions.' });
  }
});

module.exports = router;
