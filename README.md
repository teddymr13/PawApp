# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Nama Produk: Paw Cats (AI-Powered Cat Health & Care Assistant)
- **Versi Dokumen:** 1.4  
- **Tanggal:** Mei 2026  
- **Penulis:** Tim Pengembang Paw Cats  
- **Status:** *Production-Ready / Approved*  

---

## 1. Pendahuluan & Gambaran Umum (Introduction & Overview)

### 1.1 Visi Produk
Menjadi asisten digital pertolongan pertama terpercaya bagi para pemilik kucing (*cat owners*), memberikan edukasi perawatan dan analisis awal gejala kesehatan yang berbasis AI secara instan, empatis, dan personal.

### 1.2 Latar Belakang Masalah (Problem Statement)
* **Kepanikan Pemilik Pemula:** Pemilik kucing baru sering kali panik ketika mendapati perubahan fisik atau perilaku minor pada kucingnya (misal: muntah hairball, mata berair, atau mendadak lemas).
* **Informasi Tidak Terstruktur:** Pencarian mandiri melalui mesin pencari konvensional sering menghasilkan artikel yang terlalu umum, kontradiktif, atau justru memicu kecemasan berlebih.
* **Kurangnya Personalisasi & Data Historis:** Artikel di internet tidak memperhitungkan faktor spesifik kucing. Selain itu, chatbot konvensional sering kehilangan riwayat medis kucing terdahulu karena tidak memiliki penyimpanan data yang persisten.
* **UI/UX Kaku & Minim Umpan Balik:** Aplikasi kesehatan sering kali memicu keraguan karena tidak menyediakan indikator status (berhasil/gagal) yang interaktif, informasi singkatan medis yang tidak jelas bagi awam, serta penanda visual tingkat bahaya gejala secara instan.

### 1.3 Solusi Produk (Product Solution)
Paw menyediakan antarmuka chatbot interaktif yang ditenagai oleh Next.js, Gemini API, **Penyimpanan Database (Supabase/PostgreSQL)**, dan **Advanced UX/UI Feedback System**. Paw menyerap metrik kesehatan mendalam dari *Smart Sidebar Form*, memberikan notifikasi instan via *Reactive Toast Alerts*, menyediakan glosarium internal via *Contextual Tooltips*, serta mendiagnosis tingkat keparahan gejala secara visual lewat fitur *AI Health Score Prediction*.

---

## 2. Profil Pengguna & Skenario (User Personas & Use Cases)

### 2.1 User Persona: Pemilik Kucing Pemula
* **Karakteristik:** Memiliki 1-2 ekor kucing, belum terlalu paham mengenai siklus penyakit hewan, sangat protektif terhadap peliharaannya, serta memerlukan umpan balik visual (*visual cues*) yang jelas dan informatif saat mengoperasikan aplikasi.
* **Kebutuhan:** Memerlukan konfirmasi cepat berbasis data klinis riil kucing mereka, notifikasi real-time saat data tersinkronisasi otomatis ke database, serta ringkasan tingkat keparahan penyakit secara visual yang mudah dicerna.

### 2.2 Skenario Penggunaan Utama (User Story & Use Cases)
* **Skenario A (Umpan Balik Sinkronisasi & Tooltip):** Pengguna mengarahkan kursor ke label "Status Steril" di Sidebar. Muncul *Tooltip* yang menjelaskan dampak medis sterilisasi. Saat ia memperbarui berat badan kucing menjadi `4.5 kg`, muncul *Toast Alert* hijau di pojok layar: `✓ Data berat badan Milo berhasil disinkronkan ke database!`. Gemini otomatis menghitung ulang porsi makan ideal berdasarkan data terbaru tersebut.
* **Skenario B (Edukasi Nutrisi & Perilaku):** Pengguna ingin mengetahui takaran makanan yang ideal atau menginterpretasikan perilaku kucingnya yang mendadak suka mencakar furnitur.
* **Skenario C (AI Health Score & Darurat):** Pengguna mengunggah foto mata kucingnya yang bengkak berdarah. Sistem mendeteksi kata kritis, memicu *Toast* peringatan merah, melakukan intersep lokal panduan P3K, dan Gemini menyertakan *Widget Score Card* berkode warna merah: `Tingkat Keparahan: Tinggi (9/10) - SEGERA KE DOKTER HEWAN`. Sesi ditandai sebagai status *Emergency* di database.

---

## 3. Lingkup Fitur & Prioritas (Scope & Feature Requirements)

Fitur dipetakan menggunakan matriks **MoSCoW** untuk memastikan pengerjaan efisien dalam koridor tugas proyek.

| ID Fitur | Nama Fitur | Deskripsi Fungsional | Prioritas |
| :--- | :--- | :--- | :--- |
| **REQ-01** | *Enhanced Smart Sidebar* | Panel input data klinis kucing tingkat lanjut (Nama, Ras, Usia, Berat, Status Steril, Alergi, Riwayat Medis) yang reaktif terhadap memori AI. | **Must-Have** |
| **REQ-02** | *Secure Backend Gateway* | Implementasi Next.js API Routes untuk memproses prompt dan mengamankan API Key Gemini di sisi server. | **Must-Have** |
| **REQ-03** | *Database Persistence Layer* | Integrasi database (Supabase/PostgreSQL) untuk menyimpan profil fisik kucing dan riwayat obrolan secara permanen. | **Must-Have** |
| **REQ-04** | *Personality & Guardrails* | *System Instruction* yang memaksa AI tetap berada di koridor ahli kucing, ramah, menggunakan bahasa kasual Indonesia, dan menyertakan emoji. | **Must-Have** |
| **REQ-05** | *Automated Medical Disclaimer* | AI secara otomatis menyisipkan pesan peringatan di akhir chat bahwa respons bersifat edukatif dan bukan pengganti dokter hewan. | **Must-Have** |
| **REQ-06** | *Markdown Content Renderer* | Antarmuka chat mampu merender respons teks AI yang mengandung cetak tebal, list, dan poin berurutan secara rapi. | **Must-Have** |
| **REQ-07** | *Reactive Toast Alerts* | Notifikasi melayang (*floating toasts*) instan untuk memberikan umpan balik aksi user (sukses simpan autosave, kegagalan server, atau peringatan bahaya kritis). | **Must-Have** |
| **REQ-08** | *Contextual Tooltip & Modals* | Penyediaan informasi mikro glosarium (*Tooltips*) pada label form dan pelindung konfirmasi (*Modal Pop-up*) sebelum aksi pembersihan chat dijalankan. | **Should-Have** |
| **REQ-09** | *Multimodal Photo Analysis* | Pengguna dapat mengunggah foto kondisi fisik luar kucing (kulit, mata, telinga) untuk dianalisis gejalanya oleh Gemini API via Base64 payload. | **Should-Have** |
| **REQ-10** | *Emergency Trigger System* | Sistem intersep lokal yang langsung memotong jalur API dan menampilkan panduan P3K instan jika mendeteksi kata kunci kritis. | **Should-Have** |
| **REQ-11** | *AI Health Score Prediction* | AI mengekstrak data dari keluhan, lalu menghasilkan luaran skor keparahan klinis (1-10) dengan visualisasi komponen kartu indikator warna pada chat. | **Should-Have** |
| **REQ-12** | *PDF Vet Report Exporter* | Fitur enkapsulasi data dari layar dan data rekam medis terdaftar menjadi berkas PDF siap cetak untuk rujukan klinik. | **Could-Have** |
| **REQ-13** | *The Cat API Encyclopedia* | Integrasi API pihak ketiga untuk menampilkan visual dan fakta unik dari ras kucing yang dipilih pengguna di sidebar. | **Could-Have** |
| **REQ-14** | *Care Scheduler & Reminder System* | Fitur penjadwalan perawatan, pengingat obat, dan tugas kesehatan kucing yang membantu pengguna menjaga rutinitas perawatan harian/mingguan. | **Should-Have** |
| **REQ-15** | *Personalized Nutrition Plan* | AI membuat rencana nutrisi dan porsi makan yang disesuaikan dengan berat, usia, dan kondisi kesehatan kucing. | **Should-Have** |
| **REQ-16** | *Veterinary Teleconsultation & Referral* | Fitur koneksi langsung ke dokter hewan, rekomendasi klinik, dan panduan janji temu bila kondisi butuh pemeriksaan lanjutan. | **Could-Have** |
| **REQ-17** | *Health Trend Dashboard* | Dashboard analitik tren kesehatan untuk melacak berat, gejala, dan kepatuhan pengobatan dari waktu ke waktu. | **Should-Have** |
| **REQ-18** | *Community Symptom Library* | Basis pengetahuan gejala dan kasus kucing terkurasi untuk edukasi pemilik dan referensi cepat. | **Could-Have** |

---

## 4. Spesifikasi Fungsional Detil (Detailed Functional Specifications)

### 4.1 Detail Parameter Form pada Sidebar (REQ-01)
Komponen Sidebar ditingkatkan dari form pencatatan nama sederhana menjadi **Dashboard Klinis Kucing** dengan spesifikasi field sebagai berikut:
1. `cat_name` (Text): Nama kucing.
2. `cat_breed` (Text/Dropdown): Ras atau jenis kucing.
3. `cat_age` (Text/Number): Usia kucing (bulan/tahun).
4. `cat_weight` (Number): Berat badan dalam satuan Kilogram (Penting untuk perhitungan dosis & nutrisi AI).
5. `is_neutered` (Boolean/Radio): Status Sudah Steril / Belum Steril.
6. `allergies` (Textarea): Daftar alergi makanan atau obat (jika ada).
7. `medical_history` (Textarea): Riwayat penyakit terdahulu (misal: Pernah kena flu kucing, jamur, dll).

### 4.2 UI/UX Advanced Feedback Layer (REQ-07 & REQ-08)

#### A. Toast Notification System
Sistem notifikasi melayang (*floating toasts*) modern yang diimplementasikan sebagai komponen React dengan arsitektur **Context API + Provider Pattern** melalui hook `useToast()`. Toast ditampilkan pada pojok kanan bawah layar (`fixed bottom-6 right-6 z-[9999]`) dan mendukung penumpukan (*stacking*) untuk beberapa notifikasi secara bersamaan.

**Arsitektur Komponen:**
* `ToastProvider` — Context provider yang membungkus seluruh aplikasi melalui komponen `Providers.tsx` di `layout.tsx`.
* `useToast()` — Custom hook yang menyediakan fungsi `showToast(message, variant?, duration?)` untuk dipanggil dari komponen mana pun.
* `ToastCard` — Komponen kartu individual per notifikasi, dilengkapi ikon kontekstual (Lucide), tombol tutup manual, dan *progress bar* animasi.

**Varian Toast:**
* **Success (Hijau/Emerald):** Dipicu saat aksi database berhasil — profil tersimpan, pengingat dibuat, atau janji temu terkonfirmasi. Contoh: `Profil berhasil diperbarui di database!`
* **Error (Merah/Red):** Dipicu saat operasi gagal — kegagalan Supabase, API timeout, atau validasi server. Contoh: `Gagal menyimpan: [detail error]`. Durasi diperpanjang menjadi 6 detik untuk pesan error kritis.
* **Warning (Kuning/Amber):** Dipicu saat validasi input tidak terpenuhi atau aksi memerlukan prasyarat. Contoh: `Nama kucing wajib diisi untuk menyimpan profil.`
* **Info (Biru/Sky):** Varian default untuk notifikasi informatif dan non-kritis.

**Fitur Animasi & UX:**
* *Slide-in* dari kanan dengan easing `cubic-bezier(0, 0, 0.2, 1)` dan *slide-out* dengan `cubic-bezier(0.4, 0, 1, 1)` saat ditutup.
* *Progress bar* linear di bagian bawah kartu yang menunjukkan waktu tersisa sebelum auto-dismiss.
* Auto-dismiss default setelah 4 detik (dapat dikustomisasi per pemanggilan).
* Tombol close (`X`) untuk dismiss manual.
* Seluruh panggilan `alert()` bawaan browser telah digantikan sepenuhnya oleh sistem toast ini di `page.tsx` dan `SymptomLibrary.tsx`.

#### B. Contextual Tooltips
Setiap elemen label input di sidebar yang membutuhkan edukasi tambahan wajib dilengkapi dengan ikon infotip kecil (`ⓘ`). Ketika diarahkan oleh kursor (*hover*), akan menampilkan penjelas mikro:
* **Tooltip Weight:** *"Berat badan presisi dalam kg digunakan AI untuk mengalkulasi takaran kalori harian dan dosis aman obat darurat."*
* **Tooltip Neutered:** *"Status kebiri/sterilisasi memengaruhi perhitungan metabolisme basal (BMR) dan kecenderungan fluktuasi hormon perilaku."*

#### C. Confirmation Modals
Ketika tombol `Clear Chat` ditekan, sistem wajib memunculkan kotak dialog konfirmasi di tengah layar dengan latar belakang buram (*backdrop blur*):
* **Judul:** `Hapus Riwayat Konsultasi?`
* **Deskripsi:** `Aksi ini akan menghapus seluruh salinan percakapan aktif dari database secara permanen. Rekam medis profil kucing di sidebar akan tetap aman.`
* **Tombol Aksi:** `Batal (Gray - Menutup Modal)` dan `Ya, Hapus (Red - Menjalankan Query DELETE)`.

### 4.3 Skema Database Relasional (REQ-03)
Aplikasi menggunakan database PostgreSQL (via Supabase Client). Kolom `health_score` dan `urgency_level` disiapkan untuk merekam data fitur analitik keparahan.

#### 1. Tabel `cats` (Menyimpan Profil Klinis Kucing)
```sql
CREATE TABLE cats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age VARCHAR(50),
    weight_kg NUMERIC(4,2),
    is_neutered BOOLEAN DEFAULT FALSE,
    allergies TEXT,
    medical_history TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.4 Care Scheduler & Reminder System (REQ-14)
Fitur ini memungkinkan pengguna menambahkan jadwal perawatan rutin, pengingat obat, dan tugas kesehatan lain yang terkait dengan profil kucing.

#### A. Fungsionalitas Pengguna
1. **Tambah Pengingat Baru**: Pengguna dapat membuat pengingat dengan informasi:
   * `reminder_title` (Text): Nama tugas, misal "Pemberian obat antibiotik".
   * `reminder_type` (Dropdown): Pilihan seperti `Obat`, `Vaksin`, `Diet`, `Grooming`, `Check-up`.
   * `scheduled_at` (Datetime): Tanggal dan jam pelaksanaan.
   * `repeat` (Dropdown): `Sekali`, `Harian`, `Mingguan`, `Bulanan`.
   * `notes` (Textarea): Catatan tambahan untuk perawatan atau instruksi dokter hewan.
   * `cat_id` (Relation): Mengaitkan pengingat ke profil kucing yang spesifik.
2. **Lihat Daftar Tugas Mendatang**: Sidebar menampilkan kartu ringkas yang menampilkan pengingat berikutnya, status `Upcoming`, dan label warna.
3. **Edit / Hapus Pengingat**: Setiap pengingat dapat diedit atau dihapus dengan konfirmasi modal.
4. **Notifikasi Lokasi**: Saat waktu pengingat tiba, sistem menampilkan toast hijau/gambaran tugas di sudut layar: `⏰ Waktunya memberi obat Milo!`.

#### B. UX/UI yang Diinginkan
* Panel `Care Schedule` ditambahkan di Sidebar atau tab khusus yang mudah diakses.
* Pengingat aktif diberi indikator warna:
   * Hijau = Tugas normal.
   * Kuning = Jeda/Instruksi penting.
   * Merah = Tugas yang overdue / mendekati batas kritis.
* Tombol `Mark as Done` pada setiap pengingat agar pengguna dapat menandai tugas selesai.
* Pengguna dapat memilih untuk menyinkronkan data pengingat dengan kalender lokal atau notifikasi browser jika tersedia.

#### C. Skema Database Tambahan
1. Tabel `care_reminders` untuk menyimpan jadwal perawatan dan pengingat:
```sql
CREATE TABLE care_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    reminder_type VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    repeat_interval VARCHAR(50) DEFAULT 'Sekali',
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### D. API / Backend
* `POST /api/reminders` untuk membuat pengingat baru.
* `GET /api/reminders?catId=<id>` untuk mengambil daftar pengingat kucing.
* `PATCH /api/reminders/:id` untuk menandai selesai atau memperbarui jadwal.
* `DELETE /api/reminders/:id` untuk menghapus pengingat.

#### E. Integrasi AI
* AI dapat menyarankan jadwal perawatan berdasarkan profil kucing dan riwayat kesehatan, misal menyarankan pengingat vaksinasi ulang, pemberian suplemen, atau pemeriksaan gigi.
* Saat pengguna bertanya, `"Bagaimana cara menjaga jadwal obat harian Milo?"`, AI merespons dengan rekomendasi tugas terjadwal dalam format ringkas yang bisa langsung disimpan sebagai reminder.

### 4.5 Personalized Nutrition Plan (REQ-15)
Fitur nutrisi yang memberi rekomendasi diet harian dan porsi makan berdasarkan profil kucing.

#### A. Fungsionalitas Pengguna
1. **Hitung Porsi Harian**: AI menghasilkan porsi makanan harian yang disesuaikan dengan berat badan, usia, status steril, dan tingkat aktivitas.
2. **Rekomendasi Makanan**: Menampilkan opsi makanan dry food, wet food, dan suplemen yang sesuai dengan riwayat alergi dan kondisi kesehatan kucing.
3. **Pantauan Berat**: Sistem menyarankan target berat badan sehat dan memberi saran perubahan porsi bila berat kucing naik/turun secara signifikan.
4. **Rencana Diet Mingguan**: Mengonversi rekomendasi harian menjadi jadwal makan mingguan yang mudah dibaca.

#### B. UX/UI yang Diinginkan
* Kartu ringkas `Nutrition Summary` pada sidebar yang menampilkan porsi harian dan kalori target.
* Badge `Safe to Feed` / `Hati-hati` untuk bahan makanan yang direkomendasikan atau dihindari.
* Opsi `Adjust Serving` untuk menyesuaikan secara manual dan melihat dampaknya pada estimasi kalori.

#### C. Integrasi AI
* AI memanfaatkan data kucing untuk menjelaskan alasan nutrisi: misal `Milo membutuhkan 55 gram dry food + 20 gram wet food karena beratnya 4.5 kg dan status steril.`
* AI memberikan catatan pencegahan terhadap makanan berbahaya seperti coklat, bawang, dan xylitol.

### 4.6 Veterinary Teleconsultation & Referral (REQ-16)
Fitur ini membantu pengguna mencari bantuan dokter hewan profesional bila kondisi memerlukan tindak lanjut.

#### A. Fungsionalitas Pengguna
1. **Cari Dokter Hewan Lokasi Terdekat**: Menampilkan daftar klinik/vet berdasarkan lokasi pengguna (opsional integrasi API peta sederhana).
2. **Buat Janji Temu**: Pengguna dapat menyimpan informasi tanggal dan jam janji temu, serta detail klinik dan jenis konsultasi.
3. **Referral Summary**: AI menyediakan ringkasan kondisi dan rekomendasi tindakan yang bisa dibawa ke klinik.
4. **Catatan Persiapan**: Menyediakan daftar persiapan kunjungan, seperti rekam medis, foto gejala, dan pertanyaan penting.

#### B. UX/UI yang Diinginkan
* Widget `TelVet` di sidebar dengan opsi `Cari Klinik Terdekat`, `Simpan Janji Temu`, dan `Salin Ringkasan Konsultasi`.
* Card `Referral Alert` saat AI mendeteksi kondisi yang berpotensi memerlukan pemeriksaan langsung.
* Tombol `Simpan ke Kalender` untuk menambahkan jadwal telekonsultasi atau kunjungan klinik.

#### C. Integrasi AI
* Saat pengguna mengajukan pertanyaan seperti `"Apakah saya harus bawa Milo ke dokter sekarang?"`, AI memberi saran yang jelas dan, jika perlu, merekomendasikan referral klinik.
* AI memperkuat disclaimer medis dengan: `Jika gejala berlanjut atau memburuk, segera konsultasikan dengan dokter hewan terdekat.`

### 4.7 Health Trend Dashboard (REQ-17)
Menambahkan visualisasi grafik dan kartu ringkas untuk memantau tren kesehatan kucing secara longitudinal.

#### A. Fungsionalitas Pengguna
1. **Grafik Perubahan Berat:** Menampilkan tren kenaikan/penurunan berat badan dalam rentang waktu pilihannya.
2. **Tren Gejala:** Log gejala harian yang dapat difilter berdasarkan jenis keluhan, seperti `muntah`, `batuk`, `lesu`, atau `nafsu makan turun`.
3. **Kepatuhan Obat:** Panel progres untuk menilai apakah pengingat obat dan perawatan telah ditandai selesai tepat waktu.
4. **Peringatan Anomali:** Otomatis menandai pola tidak biasa, misal penurunan berat lebih dari 10% dalam 30 hari atau kecenderungan gejala baru.

#### B. UX/UI yang Diinginkan
* Dashboard `Health Trends` berupa garis waktu interaktif dengan filter `7 hari`, `30 hari`, `90 hari`.
* Area `Insight Cards` yang menampilkan ringkasan seperti `Berat stabil`, `Gejala menurun`, atau `Perlu perhatian`.
* Opsi `Export CSV` untuk data tren harian jika pengguna ingin menggunakan data offline.

#### C. Skema Database Tambahan
1. Tabel `health_logs` menyimpan metrik dan catatan harian:
```sql
CREATE TABLE health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    weight_kg NUMERIC(4,2),
    symptom_summary TEXT,
    medication_adherence BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### D. API / Backend
* `POST /api/health-logs` untuk mengirim entri kesehatan harian.
* `GET /api/health-logs?catId=<id>&range=<days>` untuk mengambil data tren.
* `GET /api/health-logs/summary?catId=<id>` untuk ringkasan insight.

#### E. Integrasi AI
* AI bisa membuat ringkasan insight tren: `Milo menunjukkan peningkatan berat badan 2% dalam 14 hari dan penurunan frekuensi batuk, ini tanda progres perawatan yang positif.`
* AI memberi saran tindakan bila anomali terdeteksi: `Perhatikan pola penurunan nafsu makan selama 3 hari berturut-turut dan pertimbangkan konsultasi dokter hewan.`

### 4.8 Community Symptom Library (REQ-18)
Fitur basis pengetahuan yang menyediakan referensi gejala, kasus umum, dan tips perawatan dari sumber terpercaya.

#### A. Fungsionalitas Pengguna
1. **Cari Gejala Terstruktur:** Pengguna dapat mencari berdasarkan kata kunci gejala atau kondisi, misal `diare`, `excessive grooming`, atau `mata merah`.
2. **Filter Kategori:** Kategori seperti `Kesehatan Umum`, `Nutrisi`, `Skin & Coat`, `Perilaku`, dan `Darurat`.
3. **Simpan Favorit:** Pengguna dapat menandai artikel sebagai favorit atau menyimpan ke daftar baca nanti.
4. **Rating/Komentar Sederhana:** Pilihan untuk memberikan penilaian keandalan informasi (opsional, paling sederhana berupa like/dislike).

#### B. UX/UI yang Diinginkan
* Panel `Symptom Library` dengan kartu konten yang mencantumkan ringkasan cepat, tingkat keparahan, dan rekomendasi tindakan.
* Mode `Quick Tips` untuk akses cepat ke protokol P3K atau langkah awal perawatan.
* Tombol `Share` untuk menyalin ringkasan singkat ke clipboard ketika pengguna ingin berbagi dengan dokter.

#### C. Skema Database Tambahan
1. Tabel `knowledge_articles` untuk menyimpan materi pustaka:
```sql
CREATE TABLE knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity_level VARCHAR(50),
    summary TEXT,
    content TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### D. API / Backend
* `GET /api/library?query=<term>&category=<cat>` untuk mencari artikel.
* `GET /api/library/:id` untuk membuka detail artikel.
* `POST /api/library/favorite` untuk menyimpan artikel favorit pengguna.

#### E. Integrasi AI
* AI dapat mengajukan ringkasan `Quick Tips` berdasarkan artikel yang dicari pengguna.
* AI dapat memberi peringatan: `Artikel ini bersifat referensi edukatif. Untuk diagnosis akhir, selalu konsultasikan dokter hewan.`

