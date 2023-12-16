const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();
const app = express();

// QR kod oluşturma ve WhatsApp'a gönderme fonksiyonu
async function generateQRAndSendWhatsApp(urlParams) {
    const urlString = `http://localhost:3000/yuppi?id=${urlParams.id}&secretKey=`;

    QRCode.toFile('./qrcode.png', urlString, async (err) => {
        if (err) throw err;
        console.log('QR kod başarıyla oluşturuldu!');
        const secretKey = crypto.randomBytes(20).toString('hex');

        const data = { ...urlParams, secretKey };
        const jsonData = JSON.stringify(data, null, 2);

        fs.writeFile('./id_secret.json', jsonData, async (err) => {
            if (err) throw err;
            console.log('ID ve Secret Key başarıyla id_secret.json dosyasına yazıldı!');

            const whatsappOptions = {
                method: 'POST',
                url: 'https://whatsapp-messaging-hub.p.rapidapi.com/WhatsappSendMessage',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': process.env.XRapidAPIKey, // RapidAPI anahtarınızı buraya ekleyin
                    'X-RapidAPI-Host': 'whatsapp-messaging-hub.p.rapidapi.com'
                },
                data: {
                    token: process.env.RapidAPI_TOKEN, // WhatsApp token'ınızı buraya ekleyin
                    number: urlParams.telno1,
                    message: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=id=${urlParams.id}&secretKey=${secretKey}` // bu localhostun url bilgisidir
                }
            };

            try {
                const whatsappResponse = await axios.request(whatsappOptions);
                console.log(whatsappResponse.data);

                const secondPhoneOptions = {
                    method: 'POST',
                    url: 'https://whatsapp-messaging-hub.p.rapidapi.com/WhatsappSendMessage',
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': process.env.XRapidAPIKey, // RapidAPI anahtarınızı buraya ekleyin
                        'X-RapidAPI-Host': 'whatsapp-messaging-hub.p.rapidapi.com'
                    },
                    data: {
                        token: process.env.RapidAPI_TOKEN, // WhatsApp token'ınızı buraya ekleyin
                        number: urlParams.telno2,
                        message: secretKey
                    }
                };

                const secondPhoneResponse = await axios.request(secondPhoneOptions);
                console.log(secondPhoneResponse.data);
            } catch (error) {
                console.error(error);
            }
        });
    });
}

// Express ile QR kodu oluşturma ve WhatsApp'a gönderme işlemini başlatma
app.get('/generateQRAndSendWhatsApp', async (req, res) => {
    const { id, telno1, telno2 } = req.query;

    if (!id || !telno1 || !telno2) {
        return res.status(400).send('Lütfen geçerli parametreleri sağlayın: id, telno1, telno2');
    }

    const dynamicParams = {
        id,
        telno1,
        telno2
    };

    try {
        await generateQRAndSendWhatsApp(dynamicParams);
        res.send('QR kod oluşturuldu ve WhatsApp\'a gönderildi.');
    } catch (error) {
        res.status(500).send('Bir hata oluştu: ' + error.message);
    }
});

// Express sunucusunu başlatma
module.exports = () => {
    return app;
  };