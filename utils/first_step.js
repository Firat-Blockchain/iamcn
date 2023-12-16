const QRCode = require('qrcode');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

// Fonksiyon: QR kod oluşturma ve WhatsApp'a gönderme
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
            // whatsappOptions rapidapi üzerinden çekilme yaptığından kaynaklı olarak api bilgileri her 10 requestte bir yeni bir hesap açılarak güncellenmelidir.
            const whatsappOptions = {
                method: 'POST',
                url: 'https://whatsapp-messaging-hub.p.rapidapi.com/WhatsappSendMessage',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': '1440bf2d1emsh7e864222097bf28p1666fbjsn365f056ce1b7',
                    'X-RapidAPI-Host': 'whatsapp-messaging-hub.p.rapidapi.com'
                },
                data: {
                    token: 'ZX0owD5FjrpA5sciTJevggzkv0eoi12luDe98AowisxmFBeyYsF2y4r3YzEKL64k',
                    number: urlParams.telno1,
                    message: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=id=${urlParams.id}secretKey=` // bu localhostun url bilgisidir 

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
                        'X-RapidAPI-Key': '1440bf2d1emsh7e864222097bf28p1666fbjsn365f056ce1b7',
                        'X-RapidAPI-Host': 'whatsapp-messaging-hub.p.rapidapi.com'
                    },
                    data: {
                        token: 'ZX0owD5FjrpA5sciTJevggzkv0eoi12luDe98AowisxmFBeyYsF2y4r3YzEKL64k',
                        number: dynamicParams.telno2,
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

const dynamicParams = {
    id: 1,
    telno1: "905555555555", 
    telno2: "905555555555",

};

// QR kod oluştur ve WhatsApp'a gönder
generateQRAndSendWhatsApp(dynamicParams);
