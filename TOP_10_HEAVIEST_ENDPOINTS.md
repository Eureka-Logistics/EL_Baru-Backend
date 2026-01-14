# Top 10 Endpoint Paling Berat

Dokumen ini berisi daftar 10 endpoint yang paling berat berdasarkan analisis kompleksitas query, volume data processing, dan operasi yang dilakukan.

---

## 1. **GET `/monitoring/order/export-excel-unlimited`**
**Controller:** `orderController.exportExcelUnlimited`  
**Tingkat Berat:** ⭐⭐⭐⭐⭐ (Sangat Berat)

**Alasan:**
- Query SQL dengan **20+ JOIN** ke berbagai tabel (m_sm, m_pengadaan, m_pengadaan_detail, customer, mitra, kendaraan, m_ar, m_ap, dll)
- **Tidak ada limit** pada jumlah data yang diekspor
- Menggunakan ExcelJS untuk generate file Excel tanpa batasan ukuran
- Query kompleks dengan MAX(IF()) untuk agregasi conditional
- Filter berdasarkan range tanggal yang bisa mencakup ribuan record

**Dampak:**
- Bisa menghasilkan file Excel sangat besar (ratusan MB)
- Memory intensive saat generate Excel
- Query database bisa memakan waktu lama untuk range tanggal besar

---

## 2. **GET `/monitoring/order/export-excel-streaming`**
**Controller:** `orderController.exportExcelStreaming`  
**Tingkat Berat:** ⭐⭐⭐⭐⭐ (Sangat Berat)

**Alasan:**
- Query SQL yang sama dengan `export-excel-unlimited` (20+ JOIN)
- Menggunakan **streaming approach** dengan batch processing (LIMIT/OFFSET)
- Loop while untuk memproses data dalam batch
- Generate Excel secara streaming untuk menghindari memory overflow
- Tetap berat karena query kompleks diulang berkali-kali

**Dampak:**
- Lebih baik dari unlimited version (tidak crash memory)
- Tetap memakan waktu lama karena multiple queries
- Network intensive saat streaming response

---

## 3. **GET `/gps/combined/history`**
**Controller:** `gpsController.getCombinedHistory`  
**Tingkat Berat:** ⭐⭐⭐⭐⭐ (Sangat Berat)

**Alasan:**
- **Multiple external API calls** (GPS Kit API + Margono GPS API)
- Fetch GPS history data dalam range waktu tertentu
- **Processing large datasets** - bisa ribuan GPS points
- **Event detection** - detect overhour (kendaraan berhenti > 3 jam) dan overspeed
- **Batch processing** untuk insert GPS events ke database
- Sorting dan filtering data GPS dalam memory
- Asynchronous event processing

**Dampak:**
- Network latency dari external APIs
- CPU intensive untuk processing GPS data
- Memory intensive untuk large date ranges
- Multiple database operations untuk event logging

---

## 4. **POST `/gps/manual-sync`**
**Controller:** `cronGpsController.manualSyncRange`  
**Tingkat Berat:** ⭐⭐⭐⭐⭐ (Sangat Berat)

**Alasan:**
- **Batch processing** untuk semua kendaraan dalam sistem
- Fetch GPS data untuk setiap kendaraan dalam range tanggal
- Process GPS events (overhour, overspeed) untuk setiap kendaraan
- Multiple external API calls (GPS Kit + Margono)
- Bisa memproses ratusan kendaraan sekaligus
- Long-running operation (bisa berjam-jam)

**Dampak:**
- Sangat berat untuk range tanggal besar
- Bisa memakan waktu berjam-jam
- High CPU dan memory usage
- Multiple concurrent API calls

---

## 5. **GET `/report/export-excel-belum-ap`**
**Controller:** `reportController.exportExcelBelumAp`  
**Tingkat Berat:** ⭐⭐⭐⭐ (Berat)

**Alasan:**
- Query SQL dengan **multiple JOINs** (m_sm, m_pengadaan, m_ap, customer, mitra, dll)
- Filter berdasarkan tahun dan id_bu
- Generate Excel file dengan ExcelJS
- Query bisa return ribuan records
- Formatting Excel dengan styling

**Dampak:**
- Query database bisa lama untuk data tahunan
- Memory usage untuk generate Excel
- Response time tinggi untuk data besar

---

## 6. **GET `/report/export-excel-lose-sales-detail`**
**Controller:** `reportController.exportExcelLoseSalesDetail`  
**Tingkat Berat:** ⭐⭐⭐⭐ (Berat)

**Alasan:**
- Query SQL kompleks dengan multiple JOINs
- Filter berdasarkan tahun dan id_bu
- Generate Excel dengan multiple columns
- Query untuk data "lose sales" dengan kondisi kompleks
- Formatting dan styling Excel

**Dampak:**
- Query bisa return banyak data
- Excel generation memakan waktu
- Memory intensive

---

## 7. **GET `/customer/export-report-customer-excel`**
**Controller:** `customerController.exportReportCustomerExcel`  
**Tingkat Berat:** ⭐⭐⭐⭐ (Berat)

**Alasan:**
- **Complex report generation** dengan multiple data sources
- Query multiple tables dengan JOINs
- **Excel manipulation** - merge cells, formatting, styling
- Grouping dan aggregasi data
- Bisa generate report untuk banyak customer sekaligus

**Dampak:**
- Complex Excel formatting memakan waktu
- Query multiple tables
- Memory untuk Excel generation

---

## 8. **GET `/sp/get-SP-all`**
**Controller:** `spController.getSpListAll2`  
**Tingkat Berat:** ⭐⭐⭐⭐ (Berat)

**Alasan:**
- Query menggunakan **Sequelize ORM** dengan **multiple includes** (nested associations)
- Include: users, m_bu_brench, m_sales, customer, m_pengadaan_detail, m_status_order
- **Complex filtering** dengan Op.or, Op.and, Op.like
- Group by dan pagination
- Query untuk count total data terpisah

**Dampak:**
- Sequelize ORM overhead
- Multiple nested includes = multiple JOINs
- Query count terpisah menambah beban
- Response time tinggi untuk data besar

---

## 9. **GET `/update-status/get-update-status-el`**
**Controller:** `updateStatusController.getDataStatusEl`  
**Tingkat Berat:** ⭐⭐⭐⭐ (Berat)

**Alasan:**
- Query SQL dengan **multiple LEFT JOINs** (10+ tables)
- Join ke kendaraanstatus multiple kali untuk action berbeda (1, 2, 3, 5, 9)
- Complex WHERE clause dengan multiple conditions
- Search functionality dengan LIKE queries
- Pagination dengan LIMIT/OFFSET

**Dampak:**
- Multiple JOINs ke tabel yang sama dengan kondisi berbeda
- Search dengan LIKE bisa lambat tanpa index
- Query bisa return banyak data

---

## 10. **GET `/gps/detect-stationary`**
**Controller:** `gpsController.detectStationaryVehicles`  
**Tingkat Berat:** ⭐⭐⭐ (Sedang-Berat)

**Alasan:**
- Fetch GPS history data dari external API
- **Process GPS data** untuk detect long stops (>= 3 jam)
- Flatten nested GPS data structure
- Filter dan process data dalam memory
- Insert detected events ke database

**Dampak:**
- External API call latency
- CPU intensive untuk detect stops
- Memory untuk processing GPS data
- Database operations untuk event logging

---

## Catatan Tambahan

### Endpoint Lain yang Juga Berat (Honorable Mentions):

- **GET `/report/export-excel-belum-kembali`** - Excel export dengan query kompleks
- **GET `/report/export-excel-belum-inv`** - Excel export dengan query kompleks
- **GET `/report/export-excel-belum-kirim`** - Excel export dengan query kompleks
- **GET `/gps/combined/last-position`** - Fetch GPS data dari multiple sources
- **GET `/sp/export-sp-list-excel`** - Excel export untuk SP list
- **GET `/retur/get-all-retur`** - Query dengan multiple JOINs dan subquery
- **GET `/fcm-cc/kirim-notifikasi`** - Batch notification dengan 500+ tokens

---

## Rekomendasi Optimasi

1. **Untuk Excel Export:**
   - Implementasi caching untuk data yang tidak sering berubah
   - Background job untuk generate Excel, return download link
   - Limit maksimal range tanggal yang bisa diekspor
   - Pagination atau chunking untuk data besar

2. **Untuk GPS Endpoints:**
   - Implementasi caching untuk GPS data
   - Background processing untuk event detection
   - Rate limiting untuk manual sync
   - Queue system untuk batch processing

3. **Untuk Complex Queries:**
   - Database indexing pada kolom yang sering di-filter
   - Query optimization dengan EXPLAIN
   - Consider materialized views untuk report yang sering diakses
   - Pagination yang lebih efisien

4. **Monitoring:**
   - Add logging untuk response time setiap endpoint
   - Monitor database query performance
   - Set up alerts untuk slow queries
   - Track memory usage untuk Excel generation

---

**Dibuat:** $(date)  
**Berdasarkan analisis:** Codebase API Eureka Logistics
