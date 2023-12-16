const express = require('express');
const fs = require('fs');
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { Omchain } = require("@thirdweb-dev/chains");

require('dotenv').config();
const axios = require('axios');
const app = express();
const port = 3000; // Uygun bir port numarası seçebilirsiniz



// Middleware: Gelen isteği JSON formatına dönüştür
app.use(express.json());

// Fonksiyon: Web3 kontratına istek gönderme
async function sendContractRequest() {
    const sdk = new ThirdwebSDK(Omchain, {
        clientId: "YOUR_CLIENT_ID",
      });
      const contract = await sdk.getContract("YOUR_CONTRACT_ADDRESS");


      
}

// Endpoint: /validate
app.post('/validate', (req, res) => {
  const { id, secret } = req.query;

  // id ve secret'in varlığını kontrol etme
  if (!id || !secret) {
    return res.status(400).json({ success: false, message: 'ID ve secret parametreleri gereklidir.' });
  }

  // id_secret.json dosyasını okuma
  fs.readFile('./id_secret.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Dosya okuma hatası.' });
    }

    let idSecretData;
    try {
      idSecretData = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: 'JSON parse hatası.' });
    }

    // Gelen id'ye karşılık gelen secret'i kontrol etme
    
    if (idSecretData.id == id && idSecretData.secretKey == secret) {
      // Web3 kontratına istek gönderme
      sendContractRequest(id);

      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  });
});

module.exports = () => {
  return app;
};