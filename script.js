// Smart Math Web App - Vanilla JS
// Semua fungsi terjemahan dari kode Python Gradio asli.
// Pastikan index.html memuat script.js

// =========================
// Utility functions (konversi Python -> JS)
// =========================
function isNumber(n){
  return typeof n === 'number' && !isNaN(n);
}

// Luas
function luasPersegi(sisi){ return sisi * sisi; }
function luasPersegiPanjang(panjang, lebar){ return panjang * lebar; }
function luasSegitiga(alas, tinggi){ return 0.5 * alas * tinggi; }

// Keliling
function kelilingPersegi(sisi){ return 4 * sisi; }
function kelilingPersegiPanjang(panjang, lebar){ return 2 * (panjang + lebar); }
function kelilingSegitiga(s1,s2,s3){ return s1 + s2 + s3; }

// Kategori nilai
function kategoriNilai(nilai){
  if (nilai === null || nilai === undefined || !isNumber(nilai)) return "Masukkan nilai terlebih dahulu.";
  if (nilai >= 90) return "Sangat Baik";
  if (nilai >= 75) return "Baik";
  if (nilai >= 60) return "Cukup";
  return "Perlu Latihan";
}

// ubah_data (parse CSV ke array angka)
function ubahData(teks){
  if (!teks || typeof teks !== 'string') return [];
  try {
    const items = teks.split(',').map(x=>x.trim()).filter(x=>x !== "");
    const nums = items.map(x=>parseFloat(x)).filter(x=>!isNaN(x));
    return nums;
  } catch(err){
    return [];
  }
}

// analisis_data
function analisisData(teks){
  const data = ubahData(teks);
  if (!data || data.length === 0) return "Data tidak valid atau masih kosong.";
  const dataUrut = [...data].sort((a,b)=>a-b);
  const nilaiMaksimum = Math.max(...data);
  const nilaiMinimum = Math.min(...data);
  const jumlahData = data.length;
  const rataRata = data.reduce((s,v)=>s+v,0)/jumlahData;
  let hasil = "";
  hasil += "Data asli:\n";
  hasil += JSON.stringify(data) + "\n\n";
  hasil += "Data setelah diurutkan:\n";
  hasil += JSON.stringify(dataUrut) + "\n\n";
  hasil += "Nilai maksimum:\n";
  hasil += String(nilaiMaksimum) + "\n\n";
  hasil += "Nilai minimum:\n";
  hasil += String(nilaiMinimum) + "\n\n";
  hasil += "Jumlah data:\n";
  hasil += String(jumlahData) + "\n\n";
  hasil += "Rata-rata:\n";
  hasil += rataRata.toFixed(2) + "\n";
  return hasil;
}

// cari_data
function cariData(teks, target){
  const data = ubahData(teks);
  if (!data || data.length === 0) return "Data tidak valid atau masih kosong.";
  if (target === null || target === undefined || target === "") return "Masukkan nilai yang ingin dicari.";
  const t = Number(target);
  if (isNaN(t)) return "Masukkan nilai yang ingin dicari.";
  const posisi = [];
  data.forEach((val, idx) => { if (val === t) posisi.push(idx+1); });
  if (posisi.length === 0) return `Nilai ${t} tidak ditemukan dalam data.`;
  if (posisi.length === 1) return `Nilai ${t} ditemukan.\nNilai tersebut terdapat pada data ke-${posisi[0]}.`;
  const daftar = posisi.map(p=>`data ke-${p}`).join(', ');
  return `Nilai ${t} ditemukan sebanyak ${posisi.length} kali.\nNilai tersebut terdapat pada ${daftar}.`;
}

// faktorial (rekursif)
function faktorial(n){
  if (n === 0 || n === 1) return 1;
  return n * faktorial(n - 1);
}
function hitungFaktorial(n){
  if (n === null || n === undefined || n === "") return "Masukkan bilangan.";
  if (n < 0) return "Bilangan harus 0 atau lebih.";
  if (n !== Math.floor(n)) return "Masukkan bilangan bulat.";
  const hasil = faktorial(Math.floor(n));
  return `${Math.floor(n)}! = ${hasil}`;
}

// =========================
// UI & wiring
// =========================

// Tab switching
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>{ p.classList.remove('active'); p.hidden = true; });
    btn.classList.add('active');
    const id = btn.dataset.tab;
    const panel = document.getElementById(id);
    if (panel){ panel.classList.add('active'); panel.hidden = false; window.scrollTo({top:0,behavior:'smooth'}); }
  });
});

// ---------- Kalkulator Luas & Keliling ----------
const jenisRadios = document.getElementsByName('jenis');
const pilihanBangun = document.getElementById('pilihan-bangun');
const angka1El = document.getElementById('angka1');
const angka2El = document.getElementById('angka2');
const angka3El = document.getElementById('angka3');
const rowAngka2 = document.getElementById('row-angka2');
const rowAngka3 = document.getElementById('row-angka3');
const labelAngka1 = document.getElementById('label-angka1');
const labelAngka2 = document.getElementById('label-angka2');
const labelAngka3 = document.getElementById('label-angka3');
const btnHitung = document.getElementById('btn-hitung');
const hasilPerhitungan = document.getElementById('hasil-perhitungan');
const btnResetCalc = document.getElementById('btn-reset-calc');

function getJenisPerhitungan(){
  for(const r of jenisRadios) if(r.checked) return r.value;
  return null;
}

function updateUIForJenisPerhitungan(){
  // Both options use same bangun choices in original; keep consistent.
  // Set default bangun to Persegi and update inputs
  pilihanBangun.value = "Persegi";
  updateUIForBangun();
}
function updateUIForBangun(){
  const jenis = getJenisPerhitungan();
  const bangun = pilihanBangun.value;
  // Reset hide
  rowAngka2.style.display = 'none';
  rowAngka3.style.display = 'none';
  labelAngka1.textContent = 'Sisi';
  labelAngka2.textContent = 'Input 2';
  labelAngka3.textContent = 'Input 3';
  // Adjust for jenis + bangun
  if (jenis === "Hitung Luas"){
    if (bangun === "Persegi"){
      labelAngka1.textContent = 'Sisi';
      rowAngka2.style.display = 'none';
      rowAngka3.style.display = 'none';
    } else if (bangun === "Persegi Panjang"){
      labelAngka1.textContent = 'Panjang';
      labelAngka2.textContent = 'Lebar';
      rowAngka2.style.display = 'block';
      rowAngka3.style.display = 'none';
    } else if (bangun === "Segitiga"){
      labelAngka1.textContent = 'Alas';
      labelAngka2.textContent = 'Tinggi';
      rowAngka2.style.display = 'block';
      rowAngka3.style.display = 'none';
    }
  } else if (jenis === "Hitung Keliling"){
    if (bangun === "Persegi"){
      labelAngka1.textContent = 'Sisi';
      rowAngka2.style.display = 'none';
      rowAngka3.style.display = 'none';
    } else if (bangun === "Persegi Panjang"){
      labelAngka1.textContent = 'Panjang';
      labelAngka2.textContent = 'Lebar';
      rowAngka2.style.display = 'block';
      rowAngka3.style.display = 'none';
    } else if (bangun === "Segitiga"){
      labelAngka1.textContent = 'Sisi 1';
      labelAngka2.textContent = 'Sisi 2';
      labelAngka3.textContent = 'Sisi 3';
      rowAngka2.style.display = 'block';
      rowAngka3.style.display = 'block';
    }
  } else {
    // none
    rowAngka2.style.display = 'none';
    rowAngka3.style.display = 'none';
  }
}

// attach radio changes
for(const r of jenisRadios){
  r.addEventListener('change', ()=> {
    updateUIForJenisPerhitungan();
    hasilPerhitungan.value = "";
  });
}
pilihanBangun.addEventListener('change', ()=> { updateUIForBangun(); hasilPerhitungan.value = ""; });

// proses perhitungan
function prosesPerhitungan(){
  const jenis = getJenisPerhitungan();
  const bangun = pilihanBangun.value;
  const a1 = parseFloat(angka1El.value);
  const a2 = parseFloat(angka2El.value);
  const a3 = parseFloat(angka3El.value);

  function hitungLuas(bangun, angka1, angka2, angka3){
    if (!bangun) return "Silakan pilih bangun terlebih dahulu.";
    if (bangun === "Persegi"){
      if (!isNumber(angka1)) return "Masukkan panjang sisi.";
      const hasil = luasPersegi(angka1);
      return `Luas persegi = ${hasil}`;
    } else if (bangun === "Persegi Panjang"){
      if (!isNumber(angka1) || !isNumber(angka2)) return "Masukkan panjang dan lebar.";
      const hasil = luasPersegiPanjang(angka1, angka2);
      return `Luas persegi panjang = ${hasil}`;
    } else if (bangun === "Segitiga"){
      if (!isNumber(angka1) || !isNumber(angka2)) return "Masukkan alas dan tinggi.";
      const hasil = luasSegitiga(angka1, angka2);
      return `Luas segitiga = ${hasil}`;
    }
    return "Pilihan tidak dikenali.";
  }

  function hitungKeliling(bangun, angka1, angka2, angka3){
    if (!bangun) return "Silakan pilih bangun terlebih dahulu.";
    if (bangun === "Persegi"){
      if (!isNumber(angka1)) return "Masukkan panjang sisi.";
      const hasil = kelilingPersegi(angka1);
      return `Keliling persegi = ${hasil}`;
    } else if (bangun === "Persegi Panjang"){
      if (!isNumber(angka1) || !isNumber(angka2)) return "Masukkan panjang dan lebar.";
      const hasil = kelilingPersegiPanjang(angka1, angka2);
      return `Keliling persegi panjang = ${hasil}`;
    } else if (bangun === "Segitiga"){
      if (!isNumber(angka1) || !isNumber(angka2) || !isNumber(angka3)) return "Masukkan sisi 1, sisi 2, dan sisi 3.";
      const hasil = kelilingSegitiga(angka1, angka2, angka3);
      return `Keliling segitiga = ${hasil}`;
    }
    return "Pilihan tidak dikenali.";
  }

  if (jenis === "Hitung Luas"){
    hasilPerhitungan.value = hitungLuas(bangun, a1, a2, a3);
  } else if (jenis === "Hitung Keliling"){
    hasilPerhitungan.value = hitungKeliling(bangun, a1, a2, a3);
  } else {
    hasilPerhitungan.value = "Pilih jenis perhitungan.";
  }
}

btnHitung.addEventListener('click', prosesPerhitungan);
btnResetCalc.addEventListener('click', ()=>{
  angka1El.value = ""; angka2El.value=""; angka3El.value="";
  hasilPerhitungan.value = "";
  // reset UI
  pilihanBangun.value = "Persegi";
  document.querySelector('input[name="jenis"][value="Hitung Luas"]').checked = true;
  updateUIForJenisPerhitungan();
});

// inisialisasi
updateUIForJenisPerhitungan();

// ---------- Kategori Nilai ----------
const inputNilai = document.getElementById('input-nilai');
const btnKategori = document.getElementById('btn-kategori');
const hasilKategori = document.getElementById('hasil-kategori');
const btnResetKategori = document.getElementById('btn-reset-kategori');

btnKategori.addEventListener('click', ()=>{
  const n = parseFloat(inputNilai.value);
  hasilKategori.value = kategoriNilai(isNaN(n)?null:n);
});
btnResetKategori.addEventListener('click', ()=>{ inputNilai.value=""; hasilKategori.value=""; });

// ---------- Analisis Nilai & Pencarian ----------
const dataNilaiEl = document.getElementById('data-nilai');
const btnAnalisis = document.getElementById('btn-analisis');
const hasilAnalisisEl = document.getElementById('hasil-analisis');
const btnResetAnalisis = document.getElementById('btn-reset-analisis');

btnAnalisis.addEventListener('click', ()=>{
  hasilAnalisisEl.value = analisisData(dataNilaiEl.value);
});
btnResetAnalisis.addEventListener('click', ()=>{ dataNilaiEl.value=""; hasilAnalisisEl.value=""; });

const targetNilaiEl = document.getElementById('target-nilai');
const btnCari = document.getElementById('btn-cari');
const hasilPencarianEl = document.getElementById('hasil-pencarian');

btnCari.addEventListener('click', ()=>{
  const t = parseFloat(targetNilaiEl.value);
  hasilPencarianEl.value = cariData(dataNilaiEl.value, isNaN(t)?null:t);
});

// ---------- Faktorial ----------
const inputFaktorial = document.getElementById('input-faktorial');
const btnFaktorial = document.getElementById('btn-faktorial');
const hasilFaktorial = document.getElementById('hasil-faktorial');
const btnResetFaktorial = document.getElementById('btn-reset-faktorial');

btnFaktorial.addEventListener('click', ()=>{
  const n = parseFloat(inputFaktorial.value);
  if (inputFaktorial.value === "") {
    hasilFaktorial.value = "Masukkan bilangan.";
    return;
  }
  hasilFaktorial.value = hitungFaktorial(n);
});
btnResetFaktorial.addEventListener('click', ()=>{ inputFaktorial.value=""; hasilFaktorial.value=""; });

// ---------- Quiz ----------
const quizQuestions = [
  {question:"Berapakah luas persegi dengan panjang sisi 5 cm?", options:["20 cm²","25 cm²","30 cm²","35 cm²"], answer:"25 cm²"},
  {question:"Berapakah keliling persegi dengan panjang sisi 6 cm?", options:["12 cm","18 cm","24 cm","36 cm"], answer:"24 cm"},
  {question:"Berapakah luas persegi panjang dengan panjang 10 cm dan lebar 5 cm?", options:["15 cm²","30 cm²","50 cm²","100 cm²"], answer:"50 cm²"},
  {question:"Berapakah luas segitiga dengan alas 10 cm dan tinggi 8 cm?", options:["20 cm²","40 cm²","80 cm²","100 cm²"], answer:"40 cm²"},
  {question:"Berapakah hasil dari 5! (5 faktorial)?", options:["25","60","100","120"], answer:"120"},
];

let quizIndex = 0;
let quizScore = 0;
let sudahDiperiksa = false;

const nomorSoalEl = document.getElementById('nomor-soal');
const pertanyaanEl = document.getElementById('pertanyaan');
const pilihanJawabanEl = document.getElementById('pilihan-jawaban');
const btnPeriksa = document.getElementById('btn-periksa');
const btnBerikutnya = document.getElementById('btn-berikutnya');
const btnMulaiUlang = document.getElementById('btn-mulai-ulang');
const hasilQuizEl = document.getElementById('hasil-quiz');

function renderQuiz(){
  const soal = quizQuestions[quizIndex];
  nomorSoalEl.textContent = `### Soal ${quizIndex+1} dari ${quizQuestions.length}`;
  pertanyaanEl.textContent = soal.question;
  // render options as radio
  pilihanJawabanEl.innerHTML = "";
  soal.options.forEach((opt, idx) => {
    const id = `opt-${idx}`;
    const div = document.createElement('label');
    div.className = 'choice';
    div.innerHTML = `<input type="radio" name="quiz-option" value="${opt}" id="${id}"> <span>${opt}</span>`;
    div.addEventListener('click', ()=>{ // ensure radio selects when clicking the label
      const radio = div.querySelector('input');
      radio.checked = true;
    });
    pilihanJawabanEl.appendChild(div);
  });
  // reset controls
  sudahDiperiksa = false;
  btnBerikutnya.disabled = true;
  btnMulaiUlang.style.display = 'none';
  hasilQuizEl.value = "Belum diperiksa.";
}

function mulaiQuiz(){
  quizIndex = 0; quizScore = 0; sudahDiperiksa = false;
  renderQuiz();
}
function periksaJawaban(){
  if (sudahDiperiksa){
    hasilQuizEl.value = "Jawaban sudah diperiksa. Silakan lanjut ke soal berikutnya.";
    return;
  }
  const selected = document.querySelector('input[name="quiz-option"]:checked');
  if (!selected){
    hasilQuizEl.value = "Silakan pilih jawaban terlebih dahulu.";
    return;
  }
  const jawaban = selected.value;
  const soal = quizQuestions[quizIndex];
  let hasil = "";
  if (jawaban === soal.answer){
    quizScore += 20;
    hasil = "✅ Benar!\nKamu mendapatkan 20 poin.";
  } else {
    hasil = `❌ Jawaban belum tepat.\nJawaban yang benar adalah ${soal.answer}.`;
  }
  sudahDiperiksa = true;
  // if last soal
  const soalTerakhir = (quizIndex === quizQuestions.length - 1);
  if (soalTerakhir){
    hasil += `\n\n🎉 Quiz selesai!\nTotal skor kamu: ${quizScore} dari 100.`;
    btnBerikutnya.disabled = true;
    btnMulaiUlang.style.display = 'inline-block';
  } else {
    btnBerikutnya.disabled = false;
    btnMulaiUlang.style.display = 'none';
  }
  hasilQuizEl.value = hasil;
}

function soalBerikutnya(){
  if (!sudahDiperiksa){
    hasilQuizEl.value = "Silakan periksa jawaban dahulu sebelum melanjutkan.";
    return;
  }
  if (quizIndex < quizQuestions.length - 1){
    quizIndex++;
    sudahDiperiksa = false;
    renderQuiz();
  }
}

btnPeriksa.addEventListener('click', periksaJawaban);
btnBerikutnya.addEventListener('click', soalBerikutnya);
btnMulaiUlang.addEventListener('click', mulaiQuiz);

// initialize quiz
mulaiQuiz();

// Optional: allow Enter key on some inputs to trigger actions (usability)
document.getElementById('angka1').addEventListener('keydown', (e)=>{ if (e.key==='Enter') btnHitung.click(); });
document.getElementById('input-nilai').addEventListener('keydown', (e)=>{ if (e.key==='Enter') btnKategori.click(); });

/* End of script.js */