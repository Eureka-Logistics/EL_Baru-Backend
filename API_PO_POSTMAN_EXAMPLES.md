# API PO - Contoh Payload untuk Postman

## Base URL
```
http://your-api-domain/api/po
http://your-api-domain/api/po-detail
```

## Authentication
Semua endpoint memerlukan authentication token di header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 1. PO ENDPOINTS

### 1.1. CREATE PO
**Method:** `POST`  
**URL:** `/api/po/create-po`

**Payload:**
```json
{
  "note": "Catatan PO",
  "id_mitra": 1,
  "service": "charter",
  "top": "30",
  "overtonase": 0,
  "biaya_kg": 5000,
  "biaya_overtonase": 0,
  "biaya_multidrop": 0,
  "biaya_muat": 100000,
  "biaya_bongkar_muat": 150000,
  "biaya_inap": 0,
  "biaya_lain": 0,
  "total_keseluruhan": 5000000,
  "tgl_kirim": "2026-01-15 08:00:00",
  "via": "Darat",
  "kendaraan": "Truck",
  "kontainer": "CONT-001",
  "seal": "SEAL-001",
  "nopol": "B1234XYZ",
  "supir": "John Doe",
  "telp": "081234567890",
  "memo": "Memo PO",
  "tgl_po": "2026-01-10 10:00:00",
  "status": "Y",
  "id_bu": 11,
  "po_details": [
    {
      "id_msm": 1,
      "no_sm": "SM-001",
      "al_bongkar": 1,
      "po_berdasarkan": "koli",
      "hitung_berdasarkan": "koli",
      "berat": 100,
      "volume": 2.500,
      "qty": 10,
      "exp": 0,
      "harga": 100000,
      "harga_muat": 50000,
      "harga_bongkar_muat": 75000,
      "harga_inap": 0,
      "harga_jumlah": 1000000,
      "kendaraan": "Truck",
      "kontainer": "CONT-001",
      "seal": "SEAL-001",
      "nopol": "B1234XYZ",
      "supir": "John Doe",
      "telp": "081234567890"
    }
  ]
}
```

**Catatan:**
- Field `mpo` tidak perlu diisi, akan auto-generate dengan format: `{id_bu}-PO-{YY}-{000001}`
- Contoh hasil: `11-PO-26-000001`
- Field wajib: `note`, `id_mitra`, `total_keseluruhan`, `tgl_kirim`, `kendaraan`, `kontainer`, `seal`, `nopol`, `supir`, `telp`, `memo`, `tgl_po`, `id_bu`
- `po_details` adalah array opsional

---

### 1.2. EDIT PO
**Method:** `POST`  
**URL:** `/api/po/edit-po`

**Payload (Sama seperti CREATE, bisa langsung edit PO dan PO Detail sekaligus):**
```json
{
  "id_mpo": 1,
  "note": "Catatan PO Updated",
  "id_mitra": 1,
  "service": "charter",
  "top": "30",
  "overtonase": 0,
  "biaya_kg": 6000,
  "biaya_overtonase": 0,
  "biaya_multidrop": 0,
  "biaya_muat": 120000,
  "biaya_bongkar_muat": 180000,
  "biaya_inap": 0,
  "biaya_lain": 0,
  "total_keseluruhan": 6000000,
  "tgl_kirim": "2026-01-16 08:00:00",
  "via": "Darat",
  "kendaraan": "Truck",
  "kontainer": "CONT-001",
  "seal": "SEAL-001",
  "nopol": "B1234XYZ",
  "supir": "John Doe",
  "telp": "081234567890",
  "memo": "Memo PO Updated",
  "tgl_po": "2026-01-10 10:00:00",
  "status": "Y",
  "po_details": [
    {
      "id_mpod": 1,
      "id_msm": 1,
      "no_sm": "SM-001",
      "al_bongkar": 1,
      "po_berdasarkan": "koli",
      "hitung_berdasarkan": "koli",
      "berat": 120,
      "volume": 3.000,
      "qty": 12,
      "exp": 0,
      "harga": 120000,
      "harga_muat": 60000,
      "harga_bongkar_muat": 90000,
      "harga_inap": 0,
      "harga_jumlah": 1200000,
      "kendaraan": "Truck",
      "kontainer": "CONT-001",
      "seal": "SEAL-001",
      "nopol": "B1234XYZ",
      "supir": "John Doe",
      "telp": "081234567890"
    },
    {
      "id_msm": 2,
      "no_sm": "SM-002",
      "al_bongkar": 2,
      "po_berdasarkan": "koli",
      "hitung_berdasarkan": "koli",
      "berat": 80,
      "volume": 2.000,
      "qty": 8,
      "exp": 0,
      "harga": 80000,
      "harga_muat": 40000,
      "harga_bongkar_muat": 60000,
      "harga_inap": 0,
      "harga_jumlah": 800000,
      "kendaraan": "Truck",
      "kontainer": "CONT-001",
      "seal": "SEAL-001",
      "nopol": "B1234XYZ",
      "supir": "John Doe",
      "telp": "081234567890"
    }
  ]
}
```

**Catatan:**
- `id_mpo` wajib diisi
- Field PO lain opsional (hanya yang diisi yang akan diupdate)
- **Untuk `po_details` (sama seperti CREATE):**
  - Bisa langsung kirim array `po_details` seperti saat create
  - Jika ada `id_mpod`, akan diupdate detail yang sudah ada
  - Jika tidak ada `id_mpod`, akan dibuat detail baru
  - Detail yang tidak ada di array akan dihapus otomatis
  - Bisa edit PO dan semua detail sekaligus dalam 1 request

---

### 1.3. DELETE PO
**Method:** `POST`  
**URL:** `/api/po/delete-po`

**Payload:**
```json
{
  "id_mpo": 1
}
```

---

### 1.4. GET PO LIST
**Method:** `GET`  
**URL:** `/api/po/get-po-list?limit=10&page=1&id_mitra=1&status=Y&keyword=PO`

**Query Parameters:**
- `limit` (required): Jumlah data per halaman, contoh: `10`
- `page` (required): Halaman, contoh: `1`
- `id_mitra` (optional): Filter by id_mitra
- `status` (optional): Filter by status (Y/N)
- `keyword` (optional): Search di mpo atau note

**Contoh URL:**
```
GET /api/po/get-po-list?limit=10&page=1
GET /api/po/get-po-list?limit=10&page=1&id_mitra=1&status=Y
GET /api/po/get-po-list?limit=10&page=1&keyword=11-PO
```

---

### 1.5. GET PO DETAIL
**Method:** `GET`  
**URL:** `/api/po/get-po-detail?id_mpo=1`

**Query Parameters:**
- `id_mpo` (required): ID PO

**Contoh URL:**
```
GET /api/po/get-po-detail?id_mpo=1
```

**Response:**
- Langsung return semua data PO beserta semua `po_details` (detail) dalam 1 response
- Tidak perlu request terpisah untuk get detail

---

## 2. PO DETAIL ENDPOINTS

### 2.1. CREATE PO DETAIL
**Method:** `POST`  
**URL:** `/api/po-detail/create-po-detail`

**Payload:**
```json
{
  "id_mpo": 1,
  "id_msm": 1,
  "no_sm": "SM-001",
  "al_bongkar": 1,
  "po_berdasarkan": "koli",
  "hitung_berdasarkan": "koli",
  "berat": 100,
  "volume": 2.500,
  "qty": 10,
  "exp": 0,
  "harga": 100000,
  "harga_muat": 50000,
  "harga_bongkar_muat": 75000,
  "harga_inap": 0,
  "harga_jumlah": 1000000,
  "kendaraan": "Truck",
  "kontainer": "CONT-001",
  "seal": "SEAL-001",
  "nopol": "B1234XYZ",
  "supir": "John Doe",
  "telp": "081234567890"
}
```

**Field Wajib:**
- `id_mpo`, `harga`, `harga_jumlah`, `kendaraan`, `kontainer`, `seal`, `nopol`, `supir`, `telp`

---

### 2.2. EDIT PO DETAIL
**Method:** `POST`  
**URL:** `/api/po-detail/edit-po-detail`

**Payload:**
```json
{
  "id_mpod": 1,
  "id_mpo": 1,
  "id_msm": 1,
  "no_sm": "SM-001-UPDATED",
  "al_bongkar": 1,
  "po_berdasarkan": "koli",
  "hitung_berdasarkan": "koli",
  "berat": 120,
  "volume": 3.000,
  "qty": 12,
  "exp": 0,
  "harga": 120000,
  "harga_muat": 60000,
  "harga_bongkar_muat": 90000,
  "harga_inap": 0,
  "harga_jumlah": 1200000,
  "kendaraan": "Truck",
  "kontainer": "CONT-001",
  "seal": "SEAL-001",
  "nopol": "B1234XYZ",
  "supir": "John Doe",
  "telp": "081234567890"
}
```

**Catatan:**
- `id_mpod` wajib diisi
- Field lain opsional (hanya yang diisi yang akan diupdate)

---

### 2.3. DELETE PO DETAIL
**Method:** `POST`  
**URL:** `/api/po-detail/delete-po-detail`

**Payload:**
```json
{
  "id_mpod": 1
}
```

---

### 2.4. GET PO DETAIL LIST
**Method:** `GET`  
**URL:** `/api/po-detail/get-po-detail-list?limit=10&page=1&id_mpo=1&id_msm=1&no_sm=SM-001`

**Query Parameters:**
- `limit` (required): Jumlah data per halaman
- `page` (required): Halaman
- `id_mpo` (optional): Filter by id_mpo
- `id_msm` (optional): Filter by id_msm
- `no_sm` (optional): Search di no_sm

**Contoh URL:**
```
GET /api/po-detail/get-po-detail-list?limit=10&page=1
GET /api/po-detail/get-po-detail-list?limit=10&page=1&id_mpo=1
GET /api/po-detail/get-po-detail-list?limit=10&page=1&id_mpo=1&id_msm=1
```

---

### 2.5. GET PO DETAIL BY ID
**Method:** `GET`  
**URL:** `/api/po-detail/get-po-detail-by-id?id_mpod=1`

**Query Parameters:**
- `id_mpod` (required): ID PO Detail

**Contoh URL:**
```
GET /api/po-detail/get-po-detail-by-id?id_mpod=1
```

---

## 3. CONTOH RESPONSE

### Success Response (Create):
```json
{
  "status": {
    "code": 200,
    "message": "Success create PO"
  },
  "data": {
    "po": {
      "id_mpo": 1,
      "mpo": "11-PO-26-000001",
      "note": "Catatan PO",
      ...
    },
    "po_details": [...]
  }
}
```

### Success Response (Edit):
```json
{
  "status": {
    "code": 200,
    "message": "Success update PO"
  },
  "data": {
    "id_mpo": 1,
    "mpo": "11-PO-26-000001",
    "note": "Catatan PO Updated",
    "id_mitra": 1,
    "service": "charter",
    ... (semua field PO),
    "po_details": [
      {
        "id_mpod": 1,
        "id_mpo": 1,
        "id_msm": 1,
        ... (semua field detail)
      }
    ]
  }
}
```

### Success Response (Get Detail):
```json
{
  "status": {
    "code": 200,
    "message": "Success get Data PO"
  },
  "data": {
    "id_mpo": 1,
    "mpo": "11-PO-26-000001",
    "note": "Catatan PO",
    "id_mitra": 1,
    ... (semua field PO),
    "po_details": [
      {
        "id_mpod": 1,
        "id_mpo": 1,
        "id_msm": 1,
        "no_sm": "SM-001",
        ... (semua field detail)
      }
    ]
  }
}
```

### Error Response:
```json
{
  "status": {
    "code": 400,
    "message": "Field note, id_mitra, total_keseluruhan, tgl_kirim, kendaraan, kontainer, seal, nopol, supir, telp, memo, tgl_po, dan id_bu wajib diisi"
  }
}
```

### List Response:
```json
{
  "status": {
    "code": 200,
    "message": "Success get Data PO"
  },
  "data": {
    "totalData": 100,
    "totalPage": 10,
    "limit": 10,
    "currentPage": 1,
    "list": [...]
  }
}
```

---

## 4. TIPS TESTING

1. **Auto-generate MPO Code:**
   - Saat create PO, tidak perlu kirim field `mpo`
   - Sistem akan auto-generate dengan format: `{id_bu}-PO-{YY}-{000001}`
   - Contoh: `11-PO-26-000001` (id_bu=11, tahun=26, sequence=000001)

2. **Sequence Reset:**
   - Sequence akan reset ke 000001 setiap tahun baru
   - Sequence increment per id_bu

3. **Date Format:**
   - Gunakan format: `YYYY-MM-DD HH:mm:ss`
   - Contoh: `2026-01-15 08:00:00`

4. **Edit PO dengan Details (Sama seperti CREATE):**
   - Bisa langsung kirim `po_details` sebagai array seperti saat create
   - Edit PO dan semua detail sekaligus dalam 1 request
   - Detail dengan `id_mpod` akan diupdate
   - Detail tanpa `id_mpod` akan dibuat baru
   - Detail yang tidak dikirim akan dihapus otomatis

5. **Get Detail PO:**
   - Langsung return semua data PO beserta semua `po_details` dalam 1 response
   - Tidak perlu request terpisah untuk get detail
   - Semua field PO dan detail langsung muncul
