# Kalkulator Keuntungan Kripto (Crypto Profit Gazer)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/suzuy1/kalkulasi-kripto/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Crypto Profit Gazer adalah aplikasi web modern dan interaktif yang dirancang untuk membantu investor mata uang kripto menghitung dan memvisualisasikan potensi keuntungan atau kerugian dari portofolio mereka secara mudah dan akurat.

Aplikasi ini dibangun dengan tech stack modern untuk memberikan pengalaman pengguna yang cepat, responsif, dan intuitif.

---

## ✨ Fitur Utama

- **Input Investasi Dinamis**: Masukkan modal awal investasi Anda dalam Rupiah (IDR).
- **Alokasi Aset Fleksibel**: Tambah, hapus, dan alokasikan persentase investasi ke berbagai aset kripto (misal: BTC, ETH, SOL).
- **Simulasi Perubahan Harga**: Masukkan prediksi kenaikan/penurunan harga tiap aset dalam persentase.
- **Perhitungan Real-time**: Otomatis menghitung total keuntungan/kerugian, perubahan persentase, dan nilai akhir portofolio.
- **Visualisasi Data Interaktif**:
  - Diagram Lingkaran (Pie Chart): Komposisi portofolio akhir.
  - Diagram Batang (Bar Chart): Analisis keuntungan/kerugian tiap aset.
  - Tabel Rincian: Alokasi awal & hasil keuntungan tiap aset.
- **Penyimpanan Lokal**: Form input otomatis tersimpan di browser.
- **Desain Responsif**: Tampilan optimal untuk desktop & seluler.

---

## 🚀 Tumpukan Teknologi (Tech Stack)

- **Framework**: Next.js (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Komponen UI**: Shadcn/ui & Radix UI
- **Manajemen Form**: React Hook Form
- **Validasi Skema**: Zod
- **Visualisasi Data**: Recharts
- **Deployment**: Firebase App Hosting

---

## 🖼️ Demo & Screenshot

<!-- Ganti URL gambar di bawah dengan screenshot aplikasi jika sudah tersedia -->
![Tampilan Aplikasi](docs/demo-screenshot.png)

<!-- Jika ada demo online, tambahkan: -->
Demo online: [https://kalkulasi-kripto.web.app](https://kalkulasi-kripto.web.app)

---

## 🛠️ Instalasi dan Menjalankan Proyek

1. **Clone Repositori**
   ```bash
   git clone https://github.com/suzuy1/kalkulasi-kripto.git
   cd kalkulasi-kripto
   ```

2. **Instal Dependensi**
   Pastikan Anda memiliki Node.js (versi 18.18 atau lebih tinggi) dan npm.
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di [http://localhost:9002](http://localhost:9002)

---

## 📁 Struktur Proyek

```
kalkulasi-kripto/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── crypto-profit-gazer.tsx
│   ├── hooks/
│   │   └── use-toast.ts
│   └── lib/
│       └── utils.ts
├── public/
├── tailwind.config.ts
└── next.config.ts
```

---

## 🤝 Kontribusi

Kontribusi sangat terbuka! Jika ada ide perbaikan atau menemukan bug, silakan buka *issue* atau kirimkan *pull request*.

1. Fork repositori ini.
2. Buat branch baru (`git checkout -b fitur/nama-fitur`).
3. Lakukan perubahan & commit (`git commit -m 'Menambahkan fitur baru'`).
4. Push ke branch Anda (`git push origin fitur/nama-fitur`).
5. Buka Pull Request.

---

## 📜 Lisensi

Proyek ini dilisensikan dengan [MIT License](LICENSE).

---

## 📬 Kontak

Untuk pertanyaan atau kerja sama, hubungi:  
**GitHub:** [@suzuy1](https://github.com/suzuy1)  
**Email:** (isi email Anda di sini, opsional)

---

Terima kasih telah memeriksa proyek ini! ⭐️
