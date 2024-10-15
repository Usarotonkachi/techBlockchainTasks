require('dotenv').config(); 

const ERC20ABI = require('./abi.json');

const express = require('express');
const { Web3 } = require('web3');
const app = express();

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
const node = process.env.NODE;

const web3 = new Web3(node);

const ERC20_ABI = ERC20ABI.abi;

app.get('/tokenBalance', async (req, res) => {
  const { tokenContractAddress, walletAddress } = req.query;

  const isValidAddress = (address) => {
    try {
      return web3.utils.toChecksumAddress(address); 
    } catch (e) {
      return false; 
    }
  };
  
  if (!isValidAddress(tokenContractAddress) || !isValidAddress(walletAddress)) {
    return res.status(400).send('Invalid token contract address or wallet address.');
  }

  try {
  
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenContractAddress);

    const balance = await tokenContract.methods.balanceOf(walletAddress).call();
    const decimals = await tokenContract.methods.decimals().call();

    const adjustedBalance = balance / Math.pow(10, decimals);

    res.json({
      walletAddress,
      tokenContractAddress,
      balance: adjustedBalance.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error while fetching the token balance.');
  }
});

app.listen(port, () => {
  console.log(`Token balance API listening at ${baseUrl}`);
});
