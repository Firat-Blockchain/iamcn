const express = require('express');
const fs = require('fs');
const axios = require('axios'); // Axios kütüphanesi, HTTP istekleri yapmak için kullanılır

const app = express();
const PORT = 3000;

app.use(express.json());
 
// Rastgele bir validate numarası döndüren örnek bir API URL'i
const exampleAPI = 'https://api.example-afad-api.com/validate'; // burada bu adresin afad api olduğunu düşünerek hareket ettik 

app.post('/register', async (req, res) => {
  const { username, email, password, volunteer_number, city } = req.query;

  if (!username || !email || !password || !volunteer_number || !city) {
    return res.status(400).send('Lütfen tüm alanları doldurun.');
  }

  let validate = ''; // Başlangıçta boş bir değer atıyoruz

  try {
    // Örnek API'den sorgu yapma
    const response = await axios.get(exampleAPI);

    // API'den dönen rastgele validate numarasını al
    validate = response.data.validate_number || ''; // Eğer API'den gelen cevap içinde validate_number isimli bir alan varsa onu al, yoksa boş bir string ata
  } catch (error) {
    // API'den veri alınırken bir hata oluşursa
    console.error('API isteği sırasında hata oluştu:', error);
    return res.status(500).send('API\'den veri alınırken bir hata oluştu.');
  }

  // Yeni kullanıcı verisi oluştur
  const newUser = {
    username,
    email,
    password,
    validate,
    volunteer_number,
    city
  };

  // user.json dosyasını oku ve yeni kullanıcıyı ekleme işlemi devam eder...
  // (Kodun geri kalanı aynı şekilde devam eder...)
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});
