# 🌐 Aplikasi Tagihan Internet

Sistem manajemen billing internet multi-pengguna yang komprehensif dengan integrasi Google Sheets untuk penyimpanan data.

## 🚀 Fitur

- **Autentikasi Multi-pengguna**: Kontrol akses berbasis peran (Super Admin, Admin, Operator, Customer)
- **Manajemen Pelanggan**: Tambah, edit, dan kelola informasi pelanggan
- **Manajemen Paket**: Buat dan kelola paket internet dengan kecepatan dan harga yang berbeda
- **Sistem Billing**: Generate tagihan bulanan untuk pelanggan secara otomatis
- **Pelacakan Pembayaran**: Catat dan lacak transaksi pembayaran
- **Analitik Dashboard**: Statistik dan ringkasan real-time
- **Integrasi Google Sheets**: Gunakan Google Sheets sebagai database
- **RESTful API**: API backend lengkap untuk integrasi frontend
- **Frontend Responsif**: Antarmuka web modern untuk manajemen yang mudah

## 📋 Prasyarat

- Node.js (v16 atau lebih tinggi)
- Akun Google Cloud Platform
- Google Sheets API diaktifkan
- Kredensial akun layanan

## 🛠️ Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/gentjkt/Aplikasi-Billing-Internet.git
   cd Aplikasi-Billing-Internet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Atur variabel environment**
   ```bash
   cp env.example .env
   ```
   
   Edit file `.env` dengan konfigurasi Anda:
   ```env
   # Konfigurasi Server
   PORT=5000
   NODE_ENV=development

   # Konfigurasi JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=24h

   # Konfigurasi Google Sheets API
   GOOGLE_SHEETS_SPREADSHEET_ID=your-google-spreadsheet-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"

   # Konfigurasi Email (untuk notifikasi)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Konfigurasi Upload File
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Atur Google Sheets**
   - Buat Google Sheet baru
   - Bagikan dengan email akun layanan Anda
   - Update `GOOGLE_SHEETS_SPREADSHEET_ID` di file `.env` Anda

5. **Jalankan aplikasi**
   ```bash
   npm start
   ```

   Untuk development dengan auto-restart:
   ```bash
   npm run dev
   ```

## 📁 Struktur Proyek

```
internet-billing-app/
├── middleware/          # Middleware autentikasi dan validasi
│   ├── auth.js         # Autentikasi JWT
│   └── validation.js   # Aturan validasi request
├── routes/             # Handler rute API
│   ├── auth.js         # Rute autentikasi
│   ├── customers.js    # Manajemen pelanggan
│   ├── users.js        # Manajemen pengguna
│   ├── packages.js     # Manajemen paket
│   ├── bills.js        # Manajemen billing
│   ├── payments.js     # Pelacakan pembayaran
│   └── dashboard.js    # Analitik dan statistik
├── services/           # Layanan logika bisnis
│   └── googleSheets.js # Integrasi Google Sheets
├── uploads/            # Direktori upload file
├── utils/              # Fungsi utilitas
├── server.js           # File server utama
├── package.json        # Dependencies dan scripts
├── env.example         # Template variabel environment
├── index.html          # Antarmuka frontend
└── README.md           # File ini
```

## 🔧 Endpoint API

### Autentikasi
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/logout` - Logout pengguna

### Pelanggan
- `GET /api/customers` - Ambil semua pelanggan
- `GET /api/customers/:id` - Ambil pelanggan berdasarkan ID
- `POST /api/customers` - Buat pelanggan baru
- `PUT /api/customers/:id` - Update pelanggan
- `DELETE /api/customers/:id` - Hapus pelanggan

### Paket
- `GET /api/packages` - Ambil semua paket
- `GET /api/packages/:id` - Ambil paket berdasarkan ID
- `POST /api/packages` - Buat paket baru
- `PUT /api/packages/:id` - Update paket
- `DELETE /api/packages/:id` - Hapus paket

### Tagihan
- `GET /api/bills` - Ambil semua tagihan
- `GET /api/bills/:id` - Ambil tagihan berdasarkan ID
- `POST /api/bills` - Buat tagihan baru
- `POST /api/bills/generate` - Generate tagihan bulanan
- `PUT /api/bills/:id` - Update tagihan
- `PATCH /api/bills/:id/status` - Update status tagihan
- `DELETE /api/bills/:id` - Hapus tagihan

### Pembayaran
- `GET /api/payments` - Ambil semua pembayaran
- `GET /api/payments/:id` - Ambil pembayaran berdasarkan ID
- `POST /api/payments` - Buat pembayaran baru
- `PUT /api/payments/:id` - Update pembayaran
- `PATCH /api/payments/:id/status` - Update status pembayaran
- `DELETE /api/payments/:id` - Hapus pembayaran

### Dashboard
- `GET /api/dashboard/overview` - Ambil ringkasan dashboard
- `GET /api/dashboard/revenue` - Ambil statistik pendapatan
- `GET /api/dashboard/customers` - Ambil statistik pelanggan
- `GET /api/dashboard/bills` - Ambil statistik tagihan
- `GET /api/dashboard/payments` - Ambil statistik pembayaran

## 👥 Peran Pengguna

- **Super Admin**: Akses penuh ke semua fitur
- **Admin**: Kelola pelanggan, paket, tagihan, dan pembayaran
- **Operator**: Lihat dan update informasi pelanggan, proses pembayaran
- **Customer**: Lihat tagihan sendiri dan riwayat pembayaran

## 🔐 Fitur Keamanan

- Autentikasi berbasis JWT
- Kontrol akses berbasis peran
- Validasi dan sanitasi input
- Rate limiting
- Proteksi CORS
- Header keamanan Helmet

## 📊 Integrasi Google Sheets

Aplikasi menggunakan Google Sheets sebagai database dengan sheet berikut:
- `users` - Akun pengguna dan autentikasi
- `customers` - Informasi pelanggan
- `packages` - Detail paket internet
- `bills` - Catatan billing bulanan
- `payments` - Transaksi pembayaran
- `activities` - Log aktivitas sistem

## 🎨 Fitur Frontend

- Desain responsif
- Update data real-time
- Form interaktif
- Tabel data dengan pengurutan
- Dashboard dengan statistik
- Antarmuka yang user-friendly

## 🚀 Deployment

### Development Lokal
```bash
npm run dev
```

### Production
```bash
npm start
```

### Variabel Environment untuk Production
Pastikan untuk mengupdate yang berikut di production:
- `JWT_SECRET` - Gunakan secret yang kuat dan unik
- `NODE_ENV=production`
- `GOOGLE_SHEETS_SPREADSHEET_ID` - Spreadsheet production Anda
- Konfigurasi email untuk notifikasi

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur
3. Lakukan perubahan Anda
4. Tambahkan test jika diperlukan
5. Submit pull request

## 📝 Lisensi

Proyek ini dilisensikan di bawah MIT License.

## 🆘 Dukungan

Untuk dukungan dan pertanyaan:
- Buat issue di repository
- Hubungi tim development
- Periksa dokumentasi

## 🔄 Changelog

### v1.0.0
- Rilis awal
- Operasi CRUD dasar untuk semua entitas
- Integrasi Google Sheets
- Autentikasi multi-pengguna
- Analitik dashboard
- Frontend responsif

---


**Catatan**: Pastikan untuk mengkonfigurasi kredensial Google Sheets API dan mengupdate variabel environment sebelum menjalankan aplikasi. 


