# API Tarif dengan Konfirmasi Duplikasi

Dokumentasi untuk endpoint-endpoint tarif yang mendukung pengecekan duplikasi dan konfirmasi penggantian tarif.

## Overview

Sistem ini memungkinkan user untuk:
1. Mengecek apakah tarif sudah ada dengan inputan yang sama (kecuali harga dan nomor surat)
2. Mendapatkan notifikasi jika ada duplikasi
3. Mengkonfirmasi untuk mengganti tarif yang sudah ada
4. Nonaktifkan tarif lama dan insert yang baru

## Endpoint yang Tersedia

### 1. Tarif Customer

#### Create Tarif Customer dengan Konfirmasi
```
POST /tarif/create-tarifCustomer-confirmation
```

**Request Body:**
```json
{
  "id_muat_kota": 1,
  "id_tujuan_kota": 2,
  "id_customer": 3,
  "id_kendaraan_jenis": 1,
  "service_type": "retailer",
  "via": "darat",
  "jenis_kiriman": "barang",
  "biaya_jalan": 50000,
  "kode_surat": "SURAT001",
  "diskon_percent": 0,
  "diskon_rupiah": 0,
  "total_biaya": 50000,
  "biaya_muat": 10000,
  "biaya_bongkar": 10000,
  "biaya_overtonase": 0,
  "biaya_multimuat": 0,
  "biaya_multidrop": 0,
  "biaya_mel": 0,
  "biaya_tambahan": 0,
  "biaya_lain": 0,
  "min_tonas_1": 1,
  "min_tonase_2": 5,
  "min_tonase_3": 10,
  "min_tonase_4": 15,
  "min_tonase_5": 20,
  "tarif_2": 45000,
  "tarif_3": 40000,
  "tarif_4": 35000,
  "tarif_5": 30000,
  "id_bu_branch": 1
}
```

**Response jika tidak ada duplikasi:**
```json
{
  "status": {
    "code": 200,
    "message": "Sukses menambah tarif customer"
  }
}
```

**Response jika ada duplikasi:**
```json
{
  "status": {
    "code": 409,
    "message": "Tarif sudah ada, yakin ganti?"
  },
  "data": {
    "existingTarifId": 123,
    "existingTarifCode": "TC00000123",
    "existingTarif": {
      "id_muat_kota": 1,
      "id_tujuan_kota": 2,
      "id_customer": 3,
      "id_kendaraan_jenis": 1,
      "service_type": "retailer",
      "via": "darat",
      "jenis_kiriman": "barang",
      "biaya_jalan": 45000,
      "kode_surat": "SURAT002"
    }
  }
}
```

#### Replace Tarif Customer
```
POST /tarif/replace-tarifCustomer
```

**Request Body:**
```json
{
  "existingTarifId": 123,
  "confirmReplace": "yes",
  "id_muat_kota": 1,
  "id_tujuan_kota": 2,
  "id_customer": 3,
  "id_kendaraan_jenis": 1,
  "service_type": "retailer",
  "via": "darat",
  "jenis_kiriman": "barang",
  "biaya_jalan": 55000,
  "kode_surat": "SURAT003",
  "diskon_percent": 0,
  "diskon_rupiah": 0,
  "total_biaya": 55000,
  "biaya_muat": 10000,
  "biaya_bongkar": 10000,
  "biaya_overtonase": 0,
  "biaya_multimuat": 0,
  "biaya_multidrop": 0,
  "biaya_mel": 0,
  "biaya_tambahan": 0,
  "biaya_lain": 0,
  "min_tonas_1": 1,
  "min_tonase_2": 5,
  "min_tonase_3": 10,
  "min_tonase_4": 15,
  "min_tonase_5": 20,
  "tarif_2": 50000,
  "tarif_3": 45000,
  "tarif_4": 40000,
  "tarif_5": 35000,
  "id_bu_branch": 1
}
```

**Response:**
```json
{
  "status": {
    "code": 200,
    "message": "Sukses menambah tarif customer"
  }
}
```

### 2. Tarif Eureka

#### Create Tarif Eureka dengan Konfirmasi
```
POST /tarif/create-tarifEureka-confirmation
```

**Request Body:**
```json
{
  "id_muat_kota": 1,
  "id_tujuan_kota": 2,
  "id_kendaraan_jenis": 1,
  "service_type": "retailer",
  "via": "darat",
  "jenis_kiriman": "barang",
  "tarif": 50000,
  "maintenance_cost": 5000,
  "variable_cost": 3000,
  "fixed_cost": 2000,
  "amount": 0,
  "percent": 0,
  "ritase": 1,
  "max_tonase": 10,
  "satuan": "kg",
  "harga_selanjutnya": 45000,
  "uang_jalan": 10000
}
```

**Response jika tidak ada duplikasi:**
```json
{
  "status": {
    "code": 200,
    "message": "Sukses menambah tarif eureka"
  }
}
```

**Response jika ada duplikasi:**
```json
{
  "status": {
    "code": 409,
    "message": "Tarif sudah ada, yakin ganti?"
  },
  "data": {
    "existingTarifId": 456,
    "existingTarifCode": "TE00000456",
    "existingTarif": {
      "id_muat_kota": 1,
      "id_tujuan_kota": 2,
      "id_kendaraan_jenis": 1,
      "service_type": "retailer",
      "via": "darat",
      "jenis_kiriman": "barang",
      "tarif": 45000
    }
  }
}
```

#### Replace Tarif Eureka
```
POST /tarif/replace-tarifEureka
```

**Request Body:**
```json
{
  "existingTarifId": 456,
  "confirmReplace": "yes",
  "id_muat_kota": 1,
  "id_tujuan_kota": 2,
  "id_kendaraan_jenis": 1,
  "service_type": "retailer",
  "via": "darat",
  "jenis_kiriman": "barang",
  "tarif": 55000,
  "maintenance_cost": 5000,
  "variable_cost": 3000,
  "fixed_cost": 2000,
  "amount": 0,
  "percent": 0,
  "ritase": 1,
  "max_tonase": 10,
  "satuan": "kg",
  "harga_selanjutnya": 50000,
  "uang_jalan": 10000
}
```

### 3. Tarif Mitra

#### Create Tarif Mitra dengan Konfirmasi
```
POST /tarif/create-tarifMitra-confirmation
```

**Request Body:**
```json
{
  "id_muat_kota": 1,
  "id_tujuan_kota": 2,
  "id_kendaraan_jenis": 1,
  "id_mitra": 5,
  "service_type": "retailer",
  "via": "darat",
  "jenis_kiriman": "barang",
  "max_tonase": 10,
  "tarif": 45000,
  "ritase": 1,
  "uang_jalan": 10000,
  "kode_surat": "SURAT004"
}
```

**Response jika tidak ada duplikasi:**
```json
{
  "status": {
    "code": 200,
    "message": "Sukses menambah tarif mitra"
  }
}
```

**Response jika ada duplikasi:**
```json
{
  "status": {
    "code": 409,
    "message": "Tarif sudah ada, yakin ganti?"
  },
  "data": {
    "existingTarifId": 789,
    "existingTarifCode": "TM00000789",
    "existingTarif": {
      "id_muat_kota": 1,
      "id_tujuan_kota": 2,
      "id_kendaraan_jenis": 1,
      "id_mitra": 5,
      "service_type": "retailer",
      "via": "darat",
      "jenis_kiriman": "barang",
      "tarif": 40000,
      "kode_surat": "SURAT005"
    }
  }
}
```

#### Replace Tarif Mitra
```
POST /tarif/replace-tarifMitra
```

**Request Body:**
```json
{
  "existingTarifId": 789,
  "confirmReplace": "yes",
  "id_muat_kota": 1,
  "id_tujuan_kota": 2,
  "id_kendaraan_jenis": 1,
  "id_mitra": 5,
  "service_type": "retailer",
  "via": "darat",
  "jenis_kiriman": "barang",
  "max_tonase": 10,
  "tarif": 50000,
  "ritase": 1,
  "uang_jalan": 10000,
  "kode_surat": "SURAT006"
}
```

## Flow Penggunaan

### 1. Create dengan Konfirmasi
1. User submit data tarif baru
2. Sistem cek apakah ada duplikasi (kecuali harga dan nomor surat)
3. Jika tidak ada duplikasi: langsung create dan return success
4. Jika ada duplikasi: return response dengan status 409 dan data tarif yang sudah ada

### 2. Replace Tarif
1. User konfirmasi untuk mengganti tarif
2. User submit request dengan `confirmReplace: "yes"` dan `existingTarifId`
3. Sistem nonaktifkan tarif lama (set status = 'N')
4. Sistem create tarif baru dengan status = 'Y'
5. Return success message

## Status Code

- `200`: Success
- `400`: Bad Request (konfirmasi tidak valid)
- `409`: Conflict (ada duplikasi, perlu konfirmasi)
- `500`: Internal Server Error

## Catatan

- Field yang dicek untuk duplikasi: `id_muat_kota`, `id_tujuan_kota`, `id_customer` (untuk customer), `id_mitra` (untuk mitra), `id_kendaraan_jenis`, `service_type`, `via`, `jenis_kiriman`
- Field yang tidak dicek untuk duplikasi: `tarif`/`biaya_jalan`, `kode_surat`
- Tarif lama akan di-nonaktifkan (status = 'N') saat diganti
- Tarif baru akan dibuat dengan status = 'Y'
