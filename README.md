# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Nama Produk: PawDoc (AI-Powered Cat Health & Care Assistant)
- **Versi Dokumen:** 1.2  
- **Tanggal:** Mei 2026  
- **Penulis:** Tim Pengembang PawDoc  
- **Status:** *Production-Ready / Approved*  

---

## 1. Pendahuluan & Gambaran Umum (Introduction & Overview)

### 1.1 Visi Produk
Menjadi asisten digital pertolongan pertama terpercaya bagi para pemilik kucing (*cat owners*), memberikan edukasi perawatan dan analisis awal gejala kesehatan yang berbasis AI secara instan, empatis, dan personal.

### 1.2 Latar Belakang Masalah (Problem Statement)
* **Kepanikan Pemilik Pemula:** Pemilik kucing baru sering kali panik ketika mendapati perubahan fisik atau perilaku minor pada kucingnya (misal: muntah hairball, mata berair, atau mendadak lemas).
* **Informasi Tidak Terstruktur:** Pencarian mandiri melalui mesin pencari konvensional sering menghasilkan artikel yang terlalu umum, kontradiktif, atau justru memicu kecemasan berlebih.
* **Kurangnya Personalisasi & Data Historis:** Artikel di internet tidak memperhitungkan faktor spesifik kucing. Selain itu, chatbot konvensional sering kehilangan riwayat medis kucing terdahulu karena tidak memiliki penyimpanan data yang persisten.

### 1.3 Solusi Produk (Product Solution)
PawDoc menyediakan antarmuka chatbot interaktif yang ditenagai oleh Next.js, Gemini API, dan **Penyimpanan Database (Supabase/PostgreSQL)**. PawDoc menyerap metrik kesehatan mendalam dari *Smart Sidebar Form* (termasuk berat badan, status steril, riwayat medis, dan alergi) untuk menyajikan jawaban yang sangat personal, sekaligus menyimpan riwayat rekam medis tersebut secara permanen ke dalam database.

---

## 2. Profil Pengguna & Skenario (User Personas & Use Cases)

### 2.1 User Persona: Pemilik Kucing Pemula
* **Karakteristik:** Memiliki 1-2 ekor kucing, belum terlalu paham mengenai siklus penyakit hewan, sangat protektif terhadap peliharaannya.
* **Kebutuhan:** Memerlukan konfirmasi cepat berbasis data klinis riil kucing mereka (misal: mempertimbangkan berat badan untuk dosis makanan/gejala) serta akses ke riwayat obrolan masa lalu tanpa kehilangan data saat halaman dimuat ulang.

### 2.2 Skenario Penggunaan Utama (User Story & Use Cases)
* **Skenario A (Konsultasi & Sinkronisasi Database):** Pengguna memperbarui berat badan kucingnya di Sidebar menjadi `4.5 kg` dan mencentang opsi `Belum Steril`. Data ini langsung tersimpan ke database. Saat user bertanya tentang porsi makan, Gemini menghitung perkiraan kalori yang tepat berdasarkan data klinis terbaru tersebut.
* **Skenario B (Edukasi Nutrisi & Perilaku):** Pengguna ingin mengetahui takaran makanan yang ideal atau menginterpretasikan perilaku kucingnya yang mendadak suka mencakar furnitur.
* **Skenario C (Kondisi Kritis / Darurat):** Pengguna mendapati kucingnya mendadak kejang. Sistem langsung mendeteksi kondisi darurat melalui intersep lokal, memberikan panduan P3K instan tanpa jeda latensi API, dan menandai sesi obrolan di database sebagai status *Emergency*.

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
| **REQ-07** | *Typing Indicator* | Animasi transisi visual (seperti cakar berkedip atau teks *loading*) saat menunggu respons dari API. | **Should-Have** |
| **REQ-08** | *Session Reset (Clear Chat)* | Tombol untuk menghapus riwayat obrolan di layar agar pengguna dapat memulai sesi konsultasi baru dari awal. | **Should-Have** |
| **REQ-09** | *Multimodal Photo Analysis* | Pengguna dapat mengunggah foto kondisi fisik luar kucing (kulit, mata, telinga) untuk dianalisis gejalanya oleh Gemini API via Base64 payload. | **Should-Have** |
| **REQ-10** | *Emergency Trigger System* | Sistem intersep lokal yang langsung memotong jalur API dan menampilkan panduan P3K instan jika mendeteksi kata kunci kritis. | **Should-Have** |
| **REQ-11** | *PDF Vet Report Exporter* | Fitur enkapsulasi data dari layar dan data rekam medis terdaftar menjadi berkas PDF siap cetak untuk rujukan klinik. | **Could-Have** |
| **REQ-12** | *The Cat API Encyclopedia* | Integrasi API pihak ketiga untuk menampilkan visual dan fakta unik dari ras kucing yang dipilih pengguna di sidebar. | **Could-Have** |

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

### 4.2 Skema Database Relasional (REQ-03)
Aplikasi menggunakan database PostgreSQL (via Supabase Client). Berikut adalah cetak biru skema tabel yang wajib diimplementasikan:

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