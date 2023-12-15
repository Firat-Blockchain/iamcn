const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 3000; // Uygun bir port numarası seçebilirsiniz

// Middleware: Gelen isteği JSON formatına dönüştür
app.use(express.json());

// Fonksiyon: Web3 kontratına istek gönderme
async function sendContractRequest(id) {
  const contractEndpoint = `https://localhost:3000/contract?id=${id}`; // SC'nin varsayılan endpointi
  const requestData = { status: 'inactivate', id };

  try {
    const response = await axios.post(contractEndpoint, requestData);
    console.log('Kontrat isteği başarıyla gönderildi:', response.data);
  } catch (error) {
    console.error('Kontrat isteği gönderilirken hata oluştu:', error);
  }
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

// Sunucuyu dinleme
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
