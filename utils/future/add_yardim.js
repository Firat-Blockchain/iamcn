const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/addAid', (req, res) => {
  const { aid_addr, name, surname, aid_type, help_content } = req.query;

  if (!aid_addr || !name || !surname || !aid_type || !help_content) {
    return res.status(400).send('Lütfen tüm alanları doldurun.');
  }

  const newAidData = {
    aid_addr,
    name,
    surname,
    aid_type,
    help_content,
  };

  fs.readFile('aid.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Bir hata oluştu.');
    }

    let aidList = [];

    if (data) {
      aidList = JSON.parse(data);
    }

    aidList.push(newAidData);

    fs.writeFile('aid.json', JSON.stringify(aidList, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Yardım kaydedilemedi.');
      }

      res.status(200).send('Yardım başarıyla kaydedildi.');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});
