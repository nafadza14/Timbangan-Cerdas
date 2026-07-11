# Timbangan Cerdas - Solusi Desktop POS + Timbangan Digital

Aplikasi desktop Windows modern menggunakan **C# / .NET 8 (LTS)** dengan arsitektur **WPF (MVVM)**, terintegrasi secara real-time dengan timbangan digital (CAS SW-II / DIGI SM) via protokol komunikasi Serial (RS-232/USB) untuk meminimalkan kecurangan kasir dan mempercepat transaksi barang timbang (buah, sayur, daging).

## 🚀 Arsitektur & Teknologi
- **UI Framework**: WPF (.NET 8.0-windows) menggunakan pola desain **MVVM**.
- **Database**: SQLite lokal diakses menggunakan **EF Core 8** dengan PRAGMA Foreign Keys diaktifkan secara eksplisit.
- **Serial Communication**: Menggunakan pustaka standar `System.IO.Ports.SerialPort` dengan polling thread-safe yang memproses stream data continuous lalu mengirimkan event data stabil ke UI.
- **Receipt Printing**: Protokol standar **ESC/POS** untuk mengendalikan printer termal kasir dan memicu pembukaan cash drawer secara elektrik.
- **Dependency Injection**: `Microsoft.Extensions.DependencyInjection` sebagai bootsrapper container tunggal di `App.xaml.cs`.
- **Testing**: **xUnit** untuk memverifikasi akurasi rumus hitung, validasi berat (BR-02), dan regex serial parser.

---

## 📂 Struktur Solusi C# (.NET 8)
Solusi `TimbanganCerdas.sln` terbagi menjadi 5 proyek modular secara ketat:

1. **TimbanganCerdas.Core** (Class Library - `net8.0`)
   - Berisi domain models, entitas DTO, interface layanan, dan tipe monad `Result<T>`.
   - Tidak memiliki dependensi ke WPF, database, atau hardware fisik.

2. **TimbanganCerdas.Data** (Class Library - `net8.0`)
   - Implementasi data access layer dengan **EF Core 8** dan SQLite.
   - Mengatur konfigurasi entitas (Fluent API), migrasi otomatis, dan seeder admin default.

3. **TimbanganCerdas.Hardware** (Class Library - `net8.0`)
   - Implementasi driver modular di bawah interface `IScaleDriver` (contoh: `CasSwDriver`).
   - Penanganan printer termal kasir dengan format struk **ESC/POS**.

4. **TimbanganCerdas.App** (WPF Application - `net8.0-windows`)
   - Layer presentasi: Views (WPF XAML) dan ViewModels.
   - Bootstrap DI untuk mengaitkan semua service dan driver.

5. **TimbanganCerdas.Tests** (xUnit Test Project - `net8.0`)
   - Pengujian parsing stream timbangan, validasi berat (0-30 kg), dan perhitungan subtotal pembulatan Rupiah.

---

## 🛠️ Keputusan Desain (ADR)
* **ADR-01 (Snapshot Harga)**: `UnitPrice` dan `ProductName` pada tabel `TransactionItems` disalin langsung (snapshot) dari tabel `Products` saat checkout untuk menjaga laporan historis tetap akurat meskipun ada perubahan harga di kemudian hari.
* **ADR-02 (Live Connection)**: Berat barang dari timbangan dibaca terus-menerus dan disinkronkan ke UI kasir secara real-time. Tombol "Tambah ke Keranjang" hanya aktif jika timbangan melaporkan status **Stabil (ST)**.
* **ADR-03 (Modular Drivers)**: Desain driver berbasis interface `IScaleDriver` di balik `ScaleDriverFactory` memudahkan penambahan merk baru tanpa mengganggu kode bisnis inti.
* **ADR-04 (SQLite Lokal)**: Menggunakan SQLite untuk menjamin keandalan offline-first 100%. Data transaksi ditulis langsung ke database saat tombol Bayar ditekan untuk mencegah hilangnya data akibat pemadaman listrik (ADR-05).

---

## 🔌 Protokol Komunikasi Serial CAS SW-II
Protokol timbangan CAS SW-II memancarkan stream text ASCII kontinu di baud rate `9600` dengan format:
`ST,GS,+   1.250kg\r\n`

Dimana:
- **ST / US**: Status (ST = Stable, US = Unstable).
- **GS / NT**: Tipe Berat (GS = Gross, NT = Net).
- **+ / -**: Tanda Positif/Negatif.
- **1.250**: Nilai Berat (3 desimal kg).
- **kg**: Satuan berat.

Sistem menggunakan regex terkonfigurasi untuk memparsing stream ini. Jika data korup, baris akan dibuang dan dicatat ke log harian Serilog di `%LOCALAPPDATA%\TimbanganCerdas\logs\`.

---

## 💻 Cara Kompilasi & Publish (Self-Contained win-x64)
Untuk mempublikasikan aplikasi POS agar langsung dapat dijalankan di PC Windows kasir tanpa perlu mengunduh .NET Runtime secara terpisah, gunakan perintah CLI berikut:

```bash
# Kembalikan dependensi NuGet
dotnet restore TimbanganCerdas.sln

# Bangun solusi dalam mode Release
dotnet build TimbanganCerdas.sln -c Release

# Publikasikan aplikasi secara Self-Contained untuk Windows 64-bit
dotnet publish TimbanganCerdas.App/TimbanganCerdas.App.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:PublishReadyToRun=true -o ./publish/
```

Hasil build berupa file executable tunggal (.exe) yang dapat langsung dibuatkan installernya menggunakan skrip **Inno Setup** (`InnoSetup/installer.iss`) untuk didistribusikan ke klien minimarket.
