Kalkulator Keuntungan Kripto (Crypto Profit Gazer)
Crypto Profit Gazer adalah aplikasi web modern dan interaktif yang dirancang untuk membantu investor mata uang kripto menghitung dan memvisualisasikan potensi keuntungan atau kerugian dari portofolio investasi mereka. Cukup masukkan modal awal, alokasikan ke berbagai aset kripto, dan prediksikan perubahan harga untuk melihat hasilnya secara instan.

Aplikasi ini dibangun dengan tech stack modern untuk memberikan pengalaman pengguna yang cepat, responsif, dan intuitif.

✨ Fitur Utama
Input Investasi Dinamis: Masukkan modal awal investasi Anda dalam Rupiah (IDR).

Alokasi Aset Fleksibel: Tambah, hapus, dan alokasikan persentase investasi Anda ke berbagai aset kripto (misalnya, BTC, ETH, SOL).

Simulasi Perubahan Harga: Masukkan prediksi kenaikan atau penurunan harga untuk setiap aset dalam persentase.

Perhitungan Real-time: Dapatkan perhitungan otomatis untuk total keuntungan/kerugian, perubahan persentase, dan nilai akhir portofolio.

Visualisasi Data Interaktif:

Diagram Lingkaran (Pie Chart): Lihat komposisi portofolio akhir Anda berdasarkan nilai setiap aset.

Diagram Batang (Bar Chart): Analisis keuntungan atau kerugian untuk masing-masing aset secara visual.

Tabel Rincian: Dapatkan rincian terperinci untuk setiap aset, termasuk alokasi awal dan hasil keuntungannya.

Penyimpanan Lokal: Form input Anda akan otomatis tersimpan di browser, sehingga Anda tidak akan kehilangan data saat memuat ulang halaman.

Desain Responsif: Tampilan yang dioptimalkan untuk perangkat desktop maupun seluler.

🚀 Tumpukan Teknologi (Tech Stack)
Proyek ini dibangun menggunakan serangkaian teknologi modern untuk pengembangan web:

Framework: Next.js (dengan App Router)

Bahasa: TypeScript

Styling: Tailwind CSS

Komponen UI: Shadcn/ui & Radix UI

Manajemen Form: React Hook Form

Validasi Skema: Zod

Visualisasi Data: Recharts

Deployment: Firebase App Hosting

🛠️ Instalasi dan Menjalankan Proyek
Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

Clone Repositori

git clone [https://github.com/suzuy/kalkulasi-kripto.git](https://github.com/suzuy/kalkulasi-kripto.git)
cd kalkulasi-kripto

Instal Dependensi
Pastikan Anda memiliki Node.js (versi 18.18 atau lebih tinggi) dan npm terinstal.

npm install

Jalankan Server Pengembangan
Perintah ini akan menjalankan aplikasi dalam mode pengembangan dengan Turbopack.

npm run dev

Buka di Browser
Buka http://localhost:9002 di browser Anda untuk melihat aplikasi berjalan.

📁 Struktur Proyek
Berikut adalah gambaran singkat tentang struktur direktori utama:

kalkulasi-kripto/
├── src/
│   ├── app/
│   │   ├── globals.css     # File CSS global
│   │   ├── layout.tsx      # Layout utama aplikasi
│   │   └── page.tsx        # Halaman utama
│   ├── components/
│   │   ├── ui/             # Komponen UI dari Shadcn/ui
│   │   └── crypto-profit-gazer.tsx # Komponen inti kalkulator
│   ├── hooks/
│   │   └── use-toast.ts    # Hook untuk notifikasi
│   └── lib/
│       └── utils.ts        # Fungsi utilitas (cth: cn untuk classname)
├── public/                 # Aset statis
├── tailwind.config.ts      # Konfigurasi Tailwind CSS
└── next.config.ts          # Konfigurasi Next.js

🤝 Kontribusi
Kontribusi selalu diterima! Jika Anda memiliki ide untuk perbaikan atau menemukan bug, silakan buka issue atau kirimkan pull request.

Fork repositori ini.

Buat branch baru (git checkout -b fitur/nama-fitur).

Lakukan perubahan dan commit (git commit -m 'Menambahkan fitur baru').

Push ke branch Anda (git push origin fitur/nama-fitur).

Buka Pull Request.

Terima kasih telah memeriksa proyek ini!
