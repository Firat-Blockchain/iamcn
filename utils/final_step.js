const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function generateQRAndSendWhatsApp(urlParams) {
    const urlString = `http://localhost:${port}/validate?id=${urlParams.id}&secret=`;

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
                    'X-RapidAPI-Key': '5d8de5044cmsh25f8ec12e0cf9b6p1b400bjsn7e94144195c9',
                    'X-RapidAPI-Host': 'whatsapp-messaging-hub.p.rapidapi.com'
                },
                data: {
                    token: "F6DVNxcNlGdYb68PQmX0B2ygO0XiGGd0GN8up8aY6gY=",
                    number: '905512623505',
                    message: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173/validate?id=${urlParams.id}`
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
                        'X-RapidAPI-Key': '5d8de5044cmsh25f8ec12e0cf9b6p1b400bjsn7e94144195c9',
                        'X-RapidAPI-Host': 'whatsapp-messaging-hub.p.rapidapi.com'
                    },
                    data: {
                        token: "F6DVNxcNlGdYb68PQmX0B2ygO0XiGGd0GN8up8aY6gY=",
                        number: '905372553088',
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

app.post('/validate', (req, res) => {
    const { id, secret } = req.query;

    if (!id || !secret) {
        return res.status(400).json({ success: false, message: 'ID ve secret parametreleri gereklidir.' });
    }

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

        if (idSecretData.id == id && idSecretData.secretKey == secret) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    });
});

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

app.listen(port, () => {
    console.log(`Express sunucusu çalışıyor. Port: ${port}`);
});



