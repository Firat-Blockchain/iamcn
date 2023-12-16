const express = require('express');
const firstStepApp = require('./utils/first_step'); // İlk adımdaki Express uygulamasının dosya yolu
const secondStepApp = require('./utils/second_step'); // İkinci adımdaki Express uygulamasının dosya yolu

const PORT1 = 3000; // İlk uygulama için kullanılacak port numarası
const PORT2 = 3001; // İkinci uygulama için kullanılacak port numarası

const app1 = firstStepApp(); // İlk adımdaki Express uygulamasını başlatma
const app2 = secondStepApp(); // İkinci adımdaki Express uygulamasını başlatma

// İlk uygulamayı belirtilen portta dinleme
app1.listen(PORT1, () => {
  console.log(`First step app is running on port ${PORT1}`);
});

// İkinci uygulamayı belirtilen portta dinleme
app2.listen(PORT2, () => {
  console.log(`Second step app is running on port ${PORT2}`);
});
