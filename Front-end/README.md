# Aplikasi Pendaftaran Pasien

Frontend aplikasi pendaftaran pasien yang dibangun menggunakan React dan React Router v6.

## Fitur Utama

- **Login**: Halaman login untuk admin/klinik dan pasien
- **Registrasi**: Form pendaftaran pasien dengan validasi lengkap
- **Dashboard Admin**: Tampilan data pasien terdaftar dan statistik
- **Dashboard Pasien**: Profil pasien dan riwayat pendaftaran

## Struktur Folder

```
src/
├── assets/
│   └── css/
│       └── pasien.css          # Stylesheet utama
├── config/
│   └── firebase.js             # Konfigurasi Firebase (opsional)
├── pages/
│   ├── login.js                # Halaman login
│   ├── register.js             # Halaman registrasi pasien
│   └── dashboard.js            # Halaman dashboard
├── App.js                      # Komponen utama dengan routing
├── index.js                    # Entry point aplikasi
└── index.css                   # Global styles

public/
└── index.html                  # HTML template

package.json                    # Dependency manager
README.md                       # File dokumentasi ini
```

## Persyaratan Sistem

- Node.js versi 14 atau lebih tinggi
- npm atau yarn

## Instalasi

1. Clone atau download repository:

   ```bash
   git clone <repository-url>
   cd elang-devops-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode development:

```bash
npm start
```

Aplikasi akan membuka di browser secara otomatis di `http://localhost:3000`

## Routes

- `/login` - Halaman login
- `/register` - Halaman registrasi pasien
- `/dashboard` - Halaman dashboard (memerlukan login)
- `/` - Redirect ke login atau dashboard

## Form Pendaftaran Pasien

Form registrasi memiliki field berikut:

1. **Nama Lengkap** - Text input (required)
2. **NIK** - Text input 16 digit (required)
3. **Alamat** - Textarea (required)
4. **Tanggal Lahir** - Date input (required)
5. **Nomor HP** - Tel input dengan validasi (required)
6. **Keluhan Pasien** - Textarea (required)

Setiap field memiliki validasi input yang sesuai.

## Styling

Aplikasi menggunakan CSS yang responsive dan modern dengan:

- Gradient backgrounds
- Smooth transitions
- Mobile-friendly design
- Color-coded status badges
- Clean and minimal UI

## Catatan Pengembangan

### Firebase Integration (Opsional)

File `src/config/firebase.js` sudah disiapkan untuk integrasi Firebase. Untuk mengaktifkannya:

1. Install Firebase:

   ```bash
   npm install firebase
   ```

2. Buat project di [Firebase Console](https://console.firebase.google.com)

3. Copy konfigurasi dari Firebase Console ke `firebase.js`

4. Uncomment kode di `firebase.js` untuk mengaktifkan

### State Management

Saat ini aplikasi menggunakan React local state. Untuk production, pertimbangkan:

- React Context API
- Redux
- Zustand

### API Integration

Untuk connect ke backend API, update fungsi `handleSubmit` di:

- `src/pages/login.js`
- `src/pages/register.js`

Ganti simulasi dengan actual API calls menggunakan `fetch` atau `axios`.

## Build untuk Production

```bash
npm run build
```

Hasil build akan tersimpan di folder `/build`

## Testing

Untuk menjalankan test:

```bash
npm test
```

## Kontribusi

Silakan fork dan buat pull request untuk kontribusi.

## Lisensi

MIT License

## Support

Untuk pertanyaan atau bantuan, silakan buat issue di repository.

---

**Created:** November 2025
**Version:** 1.0.0
