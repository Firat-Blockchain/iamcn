const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // JWT kütüphanesi

const app = express();
const PORT = 3000;
const secretKey = 'your_secret_key'; // JWT için gizli anahtar (gerçek projede çok güçlü bir şifre kullanılmalıdır)
const tokenStorage = {}; // Sunucu tarafında token'ları saklamak için obje

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.query;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Bir hata oluştu.');
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username && user.password === password);

    if (!user) {
      return res.status(401).send('Geçersiz kullanıcı adı veya şifre.');
    }

    // Kullanıcı doğrulandıysa JWT oluştur
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    // Token'i sunucu tarafında saklamak için
    tokenStorage[token] = user.username;

    res.status(200).send({ message: 'Giriş başarılı. Hoş geldiniz!', token });
  });
});

app.get('/profile', (req, res) => {
  const token = req.headers.authorization;

  if (!token || !tokenStorage[token]) {
    return res.status(401).send('Token bulunamadı.');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Geçersiz token.');
    }

    // Token doğrulandıysa, kullanıcı profili gönder
    const username = tokenStorage[token];
    const userProfile = {
      username,
      
    };

    res.status(200).send(userProfile);
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});
