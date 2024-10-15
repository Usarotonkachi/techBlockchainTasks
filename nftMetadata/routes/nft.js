const express = require('express');
const { Web3 } = require('web3');
const axios = require('axios');
const NFTMetadata = require('../models/NFTMetadata');
const router = express.Router();
const web3 = new Web3(process.env.NODE);


const ERC721_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];


const fetchNFTMetadata = async (contractAddress, tokenId) => {
  const contract = new web3.eth.Contract(ERC721_ABI, contractAddress);
  const tokenURI = await contract.methods.tokenURI(tokenId).call();

  
  const metadataResponse = await axios.get(tokenURI);
  return metadataResponse.data;
};


router.get('/:contractAddress/:tokenId', async (req, res) => {
  const { contractAddress, tokenId } = req.params;

  try {

    let nftMetadata = await NFTMetadata.findOne({ contractAddress, tokenId });

    if (!nftMetadata) {

      const metadata = await fetchNFTMetadata(contractAddress, tokenId);

      nftMetadata = new NFTMetadata({
        contractAddress,
        tokenId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
      });

      await nftMetadata.save();
    }

    res.status(200).json(nftMetadata);
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    res.status(500).json({ error: 'Failed to retrieve NFT metadata.' });
  }
});

module.exports = router;
