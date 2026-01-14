# API Uang Jalan New - Contoh Payload untuk Postman

## Base URL
```
Development: http://localhost:2023/uang_jalan
Production: https://api.elogs.id/uang_jalan
```

**Catatan:** 
- Jika menggunakan reverse proxy dengan base path `/api`, maka URL menjadi `/api/uang_jalan/new/get-list`
- Jika langsung ke server tanpa base path, maka URL menjadi `/uang_jalan/new/get-list`
- Sesuaikan dengan konfigurasi server Anda

## Authentication
Semua endpoint memerlukan authentication token di header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 1. GET LIST UANG JALAN NEW

### 1.1. Get List (Dengan Pagination)
**Method:** `GET`  
**URL:** `/uang_jalan/new/get-list`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Description | Contoh |
|-----------|------|----------|-------------|--------|
| `page` | Integer | Yes | Nomor halaman | `1` |
| `limit` | Integer | Yes | Jumlah data per halaman | `10` |
| `id_bu` | Integer | No | Filter berdasarkan Business Unit | `11` atau `21` |
| `id_customer` | Integer | No | Filter berdasarkan Customer | `123` |
| `id_msm` | Integer | No | Filter berdasarkan MSM | `456` |
| `keyword` | String | No | Pencarian (kode_uang_jalan, driver_name, nopol_unit, nama_perusahaan) | `"21-UJ"` |

**Contoh Request:**

**1. Get List - Basic (Hanya pagination)**
```
GET http://localhost:2023/uang_jalan/new/get-list?page=1&limit=10
```

**2. Get List - Dengan Filter id_bu**
```
GET http://localhost:2023/uang_jalan/new/get-list?page=1&limit=10&id_bu=21
```

**3. Get List - Dengan Filter id_customer**
```
GET http://localhost:2023/uang_jalan/new/get-list?page=1&limit=10&id_customer=123
```

**4. Get List - Dengan Filter id_msm**
```
GET http://localhost:2023/uang_jalan/new/get-list?page=1&limit=10&id_msm=456
```

**5. Get List - Dengan Keyword Search**
```
GET http://localhost:2023/uang_jalan/new/get-list?page=1&limit=10&keyword=21-UJ
```

**6. Get List - Kombinasi Filter**
```
GET http://localhost:2023/uang_jalan/new/get-list?page=1&limit=10&id_bu=21&id_customer=123&keyword=driver
```

**Response Success (200):**
```json
{
  "status": {
    "code": 200,
    "message": "Success get Data Uang Jalan New"
  },
  "data": {
    "totalData": 50,
    "totalPage": 5,
    "limit": 10,
    "currentPage": 1,
    "list": [
      {
        "no": 1,
        "id_uang_jalan_race": 1,
        "kode_uang_jalan": "21-UJ-26-000001",
        "id_driver": 10,
        "driver_name": "John Doe",
        "id_unit": 5,
        "nopol_unit": "B1234XYZ",
        "jenis_kendaraan": "Truck",
        "id_helper": 2,
        "helper_name": "Jane Smith",
        "bank_rek": "BCA",
        "rek_driver": "1234567890",
        "bbm": 500000,
        "makan": 100000,
        "parkir": 50000,
        "tol": 75000,
        "tkbm": 0,
        "penyeberangan": 0,
        "overtonase": 0,
        "timbangan": 0,
        "pass_bandara": 0,
        "karantina": 0,
        "kawalan": 0,
        "jenis_bbm": "Solar",
        "bbm_liter": 50,
        "kota_muat": "Jakarta",
        "kota_bongkar": "Bandung",
        "distance": 150,
        "jenis_uj": "Uang jalan Pokok",
        "amount": 2000000,
        "total_semua": 2925000,
        "id_customer": 123,
        "nama_perusahaan": "PT Contoh Perusahaan",
        "id_msm": 456,
        "msm": "MSM-001",
        "tgl_muat": "2026-01-15",
        "id_bu": 21,
        "id_bu_brench": 1,
        "id_admin": 1,
        "is_sending": 0,
        "notes": "Catatan tambahan",
        "remark": "Remark",
        "created_at": "2026-01-15T10:30:00.000Z",
        "transfer_at": null,
        "updated_at": "2026-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Response Error (400/401/404/500):**
```json
{
  "status": {
    "code": 400,
    "message": "Parameter tidak valid"
  }
}
```

---

## 2. GET DETAIL UANG JALAN NEW

### 2.1. Get Detail
**Method:** `GET`  
**URL:** `/uang_jalan/new/get-detail`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Description | Contoh |
|-----------|------|----------|-------------|--------|
| `id_uang_jalan_race` | Integer | Yes | ID Uang Jalan (Primary Key) | `1` |

**Contoh Request:**

**1. Get Detail - Basic**
```
GET http://localhost:2023/uang_jalan/new/get-detail?id_uang_jalan_race=1
```

**Response Success (200):**
```json
{
  "status": {
    "code": 200,
    "message": "Success get Data Uang Jalan New Detail"
  },
  "data": {
    "id_uang_jalan_race": 1,
    "kode_uang_jalan": "21-UJ-26-000001",
    "id_driver": 10,
    "driver_name": "John Doe",
    "id_unit": 5,
    "nopol_unit": "B1234XYZ",
    "jenis_kendaraan": "Truck",
    "id_helper": 2,
    "helper_name": "Jane Smith",
    "bank_rek": "BCA",
    "rek_driver": "1234567890",
    "bbm": 500000,
    "makan": 100000,
    "parkir": 50000,
    "tol": 75000,
    "tkbm": 0,
    "penyeberangan": 0,
    "overtonase": 0,
    "timbangan": 0,
    "pass_bandara": 0,
    "karantina": 0,
    "kawalan": 0,
    "jenis_bbm": "Solar",
    "bbm_liter": 50,
    "kota_muat": "Jakarta",
    "kota_bongkar": "Bandung",
    "distance": 150,
    "jenis_uj": "Uang jalan Pokok",
    "amount": 2000000,
    "total_semua": 2925000,
    "id_customer": 123,
    "nama_perusahaan": "PT Contoh Perusahaan",
    "id_msm": 456,
    "msm": "MSM-001",
    "tgl_muat": "2026-01-15",
    "id_bu": 21,
    "id_bu_brench": 1,
    "id_admin": 1,
    "is_sending": 0,
    "notes": "Catatan tambahan",
    "remark": "Remark",
    "created_at": "2026-01-15T10:30:00.000Z",
    "transfer_at": null,
    "updated_at": "2026-01-15T10:30:00.000Z"
  }
}
```

**Response Error (400):**
```json
{
  "status": {
    "code": 400,
    "message": "Parameter id_uang_jalan_race wajib diisi"
  }
}
```

**Response Error (404):**
```json
{
  "status": {
    "code": 404,
    "message": "Data Uang Jalan New tidak ditemukan"
  }
}
```

---

## 3. CREATE UANG JALAN NEW

### 3.1. Create
**Method:** `POST`  
**URL:** `/uang_jalan/new/create`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON) - Contoh Lengkap:**
```json
{
  "id_driver": 10,
  "driver_name": "John Doe",
  "id_unit": 5,
  "nopol_unit": "B1234XYZ",
  "jenis_kendaraan": "Truck",
  "id_helper": 2,
  "helper_name": "Jane Smith",
  "bank_rek": "BCA",
  "rek_driver": "1234567890",
  "bbm": 500000,
  "makan": 100000,
  "parkir": 50000,
  "tol": 75000,
  "tkbm": 0,
  "penyeberangan": 0,
  "overtonase": 0,
  "timbangan": 0,
  "pass_bandara": 0,
  "karantina": 0,
  "kawalan": 0,
  "jenis_bbm": "Solar",
  "bbm_liter": 50,
  "kota_muat": "Jakarta",
  "kota_bongkar": "Bandung",
  "distance": 150,
  "jenis_uj": "Uang jalan Pokok",
  "amount": 2000000,
  "total_semua": 2925000,
  "id_customer": 123,
  "nama_perusahaan": "PT Contoh Perusahaan",
  "id_msm": 456,
  "msm": "MSM-001",
  "tgl_muat": "2026-01-15",
  "id_bu": 21,
  "id_bu_brench": 1,
  "id_admin": 1,
  "is_sending": 0,
  "notes": "Catatan tambahan",
  "remark": "Remark"
}
```

**Body (JSON) - Minimal (kode_uang_jalan akan auto-generate, total_semua dan is_sending default 0):**
```json
{
  "bbm": 500000,
  "makan": 100000,
  "parkir": 50000,
  "tol": 75000,
  "tkbm": 0,
  "penyeberangan": 0,
  "overtonase": 0,
  "timbangan": 0,
  "pass_bandara": 0,
  "karantina": 0,
  "kawalan": 0,
  "amount": 2000000,
  "id_customer": 123,
  "id_msm": 456,
  "id_bu": 21,
  "id_bu_brench": 1,
  "id_admin": 1
}
```

**Catatan:** `total_semua` dan `is_sending` tidak perlu dikirim, akan otomatis menjadi `0`

**CATATAN PENTING:**
- **JANGAN** kirim field `kode_uang_jalan` - akan otomatis di-generate!
- Jika `id_bu` tidak dikirim, default ke 11
- Format auto-generate: `{id_bu}-UJ-{YY}-{000001}`
  - Contoh: `21-UJ-26-000001` (untuk id_bu=21, tahun 2026)
  - Contoh: `11-UJ-26-000001` (untuk id_bu=11, tahun 2026)

**Field Wajib:**
- `bbm` (BIGINT) - Biaya BBM
- `makan` (BIGINT) - Biaya makan
- `parkir` (BIGINT) - Biaya parkir
- `tol` (BIGINT) - Biaya tol
- `tkbm` (INTEGER) - Biaya TKBM
- `penyeberangan` (INTEGER) - Biaya penyeberangan
- `overtonase` (INTEGER) - Biaya overtonase
- `timbangan` (INTEGER) - Biaya timbangan
- `pass_bandara` (INTEGER) - Biaya pass bandara
- `karantina` (INTEGER) - Biaya karantina
- `kawalan` (INTEGER) - Biaya kawalan
- `amount` (BIGINT) - Jumlah uang jalan
- `id_customer` (INTEGER) - ID Customer
- `id_msm` (INTEGER) - ID MSM
- `id_bu_brench` (INTEGER) - ID Business Unit Branch
- `id_admin` (INTEGER) - ID Admin

**Field Optional (Default):**
- `total_semua` (BIGINT) - Default: `0` jika tidak diisi
- `is_sending` (INTEGER) - Default: `0` jika tidak diisi

**Field Optional:**
- `kode_uang_jalan` (String) - **JANGAN DIISI!** Akan otomatis di-generate dengan format `{id_bu}-UJ-{YY}-{000001}`
  - Contoh: `21-UJ-26-000001` (untuk id_bu=21, tahun 2026)
  - Contoh: `11-UJ-26-000001` (untuk id_bu=11, tahun 2026)
  - Sequence akan melanjutkan dari data terakhir di database untuk id_bu dan tahun yang sama
  - Jika tahun berubah, sequence reset ke 000001
- `id_bu` (INTEGER) - Default: 11, jika tidak diisi. **WAJIB** untuk auto-generate kode
- Semua field lainnya optional

**PENTING - Auto-Generate kode_uang_jalan:**
- **JANGAN** kirim field `kode_uang_jalan` saat CREATE
- Sistem akan otomatis generate dengan format: `{id_bu}-UJ-{YY}-{000001}`
- `YY` = 2 digit tahun berjalan (26 untuk tahun 2026)
- Sequence (000001) akan melanjutkan dari data terakhir di database untuk id_bu dan tahun yang sama
- Jika tahun berubah, sequence otomatis reset ke 000001
- Contoh:
  - Data terakhir: `21-UJ-26-000005` → Create baru → `21-UJ-26-000006`
  - Tahun baru: `21-UJ-27-000001` (reset karena tahun berubah)

**Response Success (200):**
```json
{
  "status": {
    "code": 200,
    "message": "Success create Uang Jalan New"
  },
  "data": {
    "id_uang_jalan_race": 1,
    "kode_uang_jalan": "21-UJ-26-000001",
    // ^^^ Kode ini OTOMATIS di-generate jika tidak dikirim di request
    "id_driver": 10,
    "driver_name": "John Doe",
    "id_unit": 5,
    "nopol_unit": "B1234XYZ",
    "jenis_kendaraan": "Truck",
    "id_helper": 2,
    "helper_name": "Jane Smith",
    "bank_rek": "BCA",
    "rek_driver": "1234567890",
    "bbm": 500000,
    "makan": 100000,
    "parkir": 50000,
    "tol": 75000,
    "tkbm": 0,
    "penyeberangan": 0,
    "overtonase": 0,
    "timbangan": 0,
    "pass_bandara": 0,
    "karantina": 0,
    "kawalan": 0,
    "jenis_bbm": "Solar",
    "bbm_liter": 50,
    "kota_muat": "Jakarta",
    "kota_bongkar": "Bandung",
    "distance": 150,
    "jenis_uj": "Uang jalan Pokok",
    "amount": 2000000,
    "total_semua": 2925000,
    "id_customer": 123,
    "nama_perusahaan": "PT Contoh Perusahaan",
    "id_msm": 456,
    "msm": "MSM-001",
    "tgl_muat": "2026-01-15",
    "id_bu": 21,
    "id_bu_brench": 1,
    "id_admin": 1,
    "is_sending": 0,
    "notes": "Catatan tambahan",
    "remark": "Remark",
    "created_at": "2026-01-15T10:30:00.000Z",
    "transfer_at": null,
    "updated_at": "2026-01-15T10:30:00.000Z",
    "is_deleted": 0
  }
}
```

**Response Error (400):**
```json
{
  "status": {
    "code": 400,
    "message": "Field bbm, makan, parkir, tol, tkbm, penyeberangan, overtonase, timbangan, pass_bandara, karantina, kawalan, amount, id_customer, id_msm, id_bu_brench, dan id_admin wajib diisi"
  }
}
```

---

## 4. EDIT/UPDATE UANG JALAN NEW

### 4.1. Edit
**Method:** `PUT`  
**URL:** `/uang_jalan/new/edit`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id_uang_jalan_race": 1,
  "driver_name": "John Doe Updated",
  "nopol_unit": "B9999XYZ",
  "bbm": 600000,
  "makan": 120000,
  "parkir": 60000,
  "tol": 80000,
  "amount": 2500000,
  "total_semua": 3120000,
  "notes": "Catatan yang diupdate",
  "remark": "Remark updated"
}
```

**Field Wajib:**
- `id_uang_jalan_race` (INTEGER) - ID Uang Jalan yang akan diupdate

**Field Optional:**
- Semua field lainnya optional (hanya field yang dikirim yang akan diupdate)
- Jika field tidak dikirim, nilai lama akan tetap digunakan

**Contoh Payload Minimal (Hanya Update Beberapa Field):**
```json
{
  "id_uang_jalan_race": 1,
  "bbm": 600000,
  "total_semua": 3120000
}
```

**Response Success (200):**
```json
{
  "status": {
    "code": 200,
    "message": "Success update Uang Jalan New"
  },
  "data": {
    "id_uang_jalan_race": 1,
    "kode_uang_jalan": "21-UJ-26-000001",
    "id_driver": 10,
    "driver_name": "John Doe Updated",
    "id_unit": 5,
    "nopol_unit": "B9999XYZ",
    "jenis_kendaraan": "Truck",
    "id_helper": 2,
    "helper_name": "Jane Smith",
    "bank_rek": "BCA",
    "rek_driver": "1234567890",
    "bbm": 600000,
    "makan": 120000,
    "parkir": 60000,
    "tol": 80000,
    "tkbm": 0,
    "penyeberangan": 0,
    "overtonase": 0,
    "timbangan": 0,
    "pass_bandara": 0,
    "karantina": 0,
    "kawalan": 0,
    "jenis_bbm": "Solar",
    "bbm_liter": 50,
    "kota_muat": "Jakarta",
    "kota_bongkar": "Bandung",
    "distance": 150,
    "jenis_uj": "Uang jalan Pokok",
    "amount": 2500000,
    "total_semua": 3120000,
    "id_customer": 123,
    "nama_perusahaan": "PT Contoh Perusahaan",
    "id_msm": 456,
    "msm": "MSM-001",
    "tgl_muat": "2026-01-15",
    "id_bu": 21,
    "id_bu_brench": 1,
    "id_admin": 1,
    "is_sending": 0,
    "notes": "Catatan yang diupdate",
    "remark": "Remark updated",
    "created_at": "2026-01-15T10:30:00.000Z",
    "transfer_at": null,
    "updated_at": "2026-01-15T11:45:00.000Z",
    "is_deleted": 0
  }
}
```

**Response Error (400):**
```json
{
  "status": {
    "code": 400,
    "message": "Field id_uang_jalan_race wajib diisi"
  }
}
```

**Response Error (404):**
```json
{
  "status": {
    "code": 404,
    "message": "Data Uang Jalan New tidak ditemukan"
  }
}
```

---

## 5. POSTMAN COLLECTION SETUP

### 3.1. Environment Variables
Buat environment variables di Postman:
- `base_url`: `http://localhost:2023` (development) atau `https://api.elogs.id` (production)
- `token`: `YOUR_TOKEN_HERE`

### 3.2. Pre-request Script (Optional)
Untuk auto-set token di semua request:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('token')
});
```

### 3.3. Contoh Collection Structure
```
📁 Uang Jalan New API
  ├── 📁 GET
  │   ├── 📄 Get List - Basic
  │   ├── 📄 Get List - Filter by id_bu
  │   ├── 📄 Get List - Filter by id_customer
  │   ├── 📄 Get List - Filter by id_msm
  │   ├── 📄 Get List - Search by keyword
  │   ├── 📄 Get List - Combined filters
  │   └── 📄 Get Detail
  ├── 📁 POST
  │   └── 📄 Create Uang Jalan New
  └── 📁 PUT
      └── 📄 Edit Uang Jalan New
```

---

## 6. CATATAN PENTING

### 6.1. Auto-Generate kode_uang_jalan
- Format: `{id_bu}-UJ-{YY}-{000001}`
- Contoh:
  - `21-UJ-26-000001` (untuk id_bu = 21)
  - `11-UJ-26-000001` (untuk id_bu = 11)
- `YY` = 2 digit tahun berjalan (26 untuk tahun 2026)
- `000001` = sequence 6 digit yang reset setiap tahun baru
- Sequence melanjutkan dari data terakhir di database untuk id_bu yang sama
- Jika tahun berubah, sequence reset ke 000001

### 6.2. Filter & Search
- Filter `id_bu`, `id_customer`, `id_msm` menggunakan exact match
- Filter `keyword` menggunakan LIKE search pada:
  - `kode_uang_jalan`
  - `driver_name`
  - `nopol_unit`
  - `nama_perusahaan`

### 6.3. Pagination
- Default: `page=1`, `limit=10`
- Response selalu include:
  - `totalData`: Total semua data yang sesuai filter
  - `totalPage`: Total halaman
  - `limit`: Jumlah data per halaman
  - `currentPage`: Halaman saat ini
  - `list`: Array data

### 6.4. Data yang Ditampilkan
- Hanya data dengan `is_deleted = 0`
- Data diurutkan berdasarkan `id_uang_jalan_race DESC` (terbaru dulu)

### 6.5. Create & Edit Notes
- **Create**: Field `kode_uang_jalan` akan auto-generate jika tidak dikirim
- **Create**: Field `id_bu` default ke 11 jika tidak dikirim
- **Edit**: Hanya field yang dikirim dalam body yang akan diupdate
- **Edit**: Field `updated_at` akan otomatis diupdate ke waktu saat ini
- **Edit**: Field `kode_uang_jalan` bisa diubah manual jika diperlukan

---

## 7. TESTING CHECKLIST

- [ ] Get List tanpa filter (basic pagination)
- [ ] Get List dengan filter id_bu
- [ ] Get List dengan filter id_customer
- [ ] Get List dengan filter id_msm
- [ ] Get List dengan keyword search
- [ ] Get List dengan kombinasi filter
- [ ] Get Detail dengan id_uang_jalan_race yang valid
- [ ] Get Detail dengan id_uang_jalan_race yang tidak ada (404)
- [ ] Get Detail tanpa parameter (400)
- [ ] Create dengan semua field wajib (200)
- [ ] Create tanpa kode_uang_jalan (auto-generate) (200)
- [ ] Create tanpa field wajib (400)
- [ ] Edit dengan semua field (200)
- [ ] Edit dengan beberapa field saja (200)
- [ ] Edit tanpa id_uang_jalan_race (400)
- [ ] Edit dengan id_uang_jalan_race yang tidak ada (404)
- [ ] Test dengan token yang tidak valid (401)
- [ ] Test tanpa token (401)
