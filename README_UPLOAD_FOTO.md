# Dokumentasi Upload Foto SIM dan STNK

## Overview
Fitur upload foto SIM untuk driver dan foto STNK untuk kendaraan telah ditambahkan ke endpoint yang sudah ada.

## Endpoint yang Dimodifikasi

### Driver
1. **Create Driver** - `POST {BASE_URL}/driver/create-driver`
   - Menambahkan field `foto_sim` untuk upload foto SIM
   - Field `cover` untuk foto driver tetap ada
   - Menggunakan middleware `plugins.addPhotoDriverMultiple`

2. **Update Driver** - `POST {BASE_URL}/driver/update-driver`
   - Menambahkan field `foto_sim` untuk update foto SIM
   - Field `cover` untuk update foto driver tetap ada
   - Menggunakan middleware `plugins.addPhotoDriverMultiple`

3. **Upload Driver Photo** - `POST {BASE_URL}/driver/upload-driver-photo`
   - Menambahkan field `foto_sim` untuk upload foto SIM
   - Field `cover` untuk upload foto driver tetap ada
   - Menggunakan middleware `plugins.addPhotoDriverMultiple`

### Vehicle
1. **Create Vehicle** - `POST {BASE_URL}/vehicle/create-vehicle`
   - Menambahkan field `foto_stnk` untuk upload foto STNK
   - Field `cover` untuk foto kendaraan tetap ada
   - Menggunakan middleware `plugins.addPhotoVehicleMultiple`

2. **Edit Vehicle** - `POST {BASE_URL}/vehicle/edit-vehicle`
   - Menambahkan field `foto_stnk` untuk update foto STNK
   - Field `cover` untuk update foto kendaraan tetap ada
   - Menggunakan middleware `plugins.addPhotoVehicleMultiple`

3. **Upload Vehicle Photo** - `POST {BASE_URL}/vehicle/upload-vehicle-photo`
   - Menambahkan field `foto_stnk` untuk upload foto STNK
   - Field `cover` untuk upload foto kendaraan tetap ada
   - Menggunakan middleware `plugins.addPhotoVehicleMultiple`

## Response yang Dimodifikasi

### Driver Endpoints
- `get-driver` - Menambahkan field `driverSimImage`
- `get-driver-detail` - Menambahkan field `driverSimImage`
- `get-driver-all` - Menambahkan field `driverSimImage`

### Vehicle Endpoints
- `get-vehicle` - Menambahkan field `vehicleStnkImage`
- `get-vehicle-detail` - Menambahkan field `vehicleStnkImage`
- `get-vehicle-mitra` - Menambahkan field `vehicleStnkImage`

## Path Penyimpanan File
- **Driver dan foto SIM**: `./public/assets/Driver/`
- **Vehicle dan foto STNK**: `./public/assets/vehicle/`

## Format Nama File
- **Foto SIM**: `2024~DriverSim-{timestamp}.{extension}`
- **Foto STNK**: `2024~VehicleStnk-{timestamp}.{extension}`

## Contoh Request

### Create Driver dengan Foto SIM
```bash
curl -X POST "https://api.eurekalogistics.co.id/driver/create-driver" \
  -H "Content-Type: multipart/form-data" \
  -F "cover=@driver_photo.jpg" \
  -F "foto_sim=@sim_photo.jpg" \
  -F "nik=P2131" \
  -F "nama=tess" \
  -F "no_ktp=123" \
  -F "no_sim=123" \
  -F "vehicle_type=CDEL" \
  -F "jenis_sim=SIM A" \
  -F "alamat=123" \
  -F "tgl_lahir=2025-08-26" \
  -F "agama=1" \
  -F "notelp=62123" \
  -F "notelp2=123" \
  -F "email=123@mail.com" \
  -F "tgl_masuk=2025-08-26" \
  -F "tgl_sim=2025-08-26" \
  -F "uk_seragam=S" \
  -F "jenis_kepemilikan=eur_oncall" \
  -F "rekening_bank=Bank Mandiri" \
  -F "rekening_norek=123" \
  -F "id_mitra=986"
```

### Create Vehicle dengan Foto STNK
```bash
curl -X POST "https://api.eurekalogistics.co.id/vehicle/create-vehicle" \
  -H "Content-Type: multipart/form-data" \
  -F "cover=@vehicle_photo.jpg" \
  -F "foto_stnk=@stnk_photo.jpg" \
  -F "no_polisi=B1234ABC" \
  -F "merk_mobil=Toyota" \
  -F "tahun_mobil=2020" \
  -F "jenis_kendaraan=Truck" \
  -F "jenis_kepemilikan=eureka"
```

## Debug Logging
Debug logging telah ditambahkan untuk memantau data yang diterima:
- `createDriver` - Log struktur `req.files`, `req.body`, dan `req.file`
- `uploadPhotoDriver` - Log struktur `req.files`, `req.body`, dan `req.file`
- `createVehicle` - Log struktur `req.files`, `req.body`, dan `req.file`
- `uploadPhoto` - Log struktur `req.files`, `req.body`, dan `req.file`

## Troubleshooting

### Field foto_sim/foto_stnk terisi null atau string kosong
**Penyebab:** 
1. Middleware menggunakan `addPhotoDriver`/`addPhotoVehicle` bukan `addPhotoDriverMultiple`/`addPhotoVehicleMultiple`
2. Controller menggunakan `req.file.filename` bukan `req.files.cover[0].filename`

**Solusi:** 
1. Pastikan route menggunakan middleware yang benar
2. Pastikan controller menggunakan `req.files` untuk multiple file upload

### CORS Error setelah upload foto
**Penyebab:** Header CORS tidak lengkap untuk static files
**Solusi:** Sudah ditambahkan header CORS yang lengkap di app.js

### File tidak tersimpan di direktori yang benar
**Penyebab:** Direktori tidak ada
**Solusi:** Buat direktori `./public/assets/Driver/` dan `./public/assets/vehicle/`

## Perubahan Teknis

### Middleware yang Digunakan
- **Sebelum:** `plugins.addPhotoDriver` dan `plugins.addPhotoVehicle` (single file)
- **Sesudah:** `plugins.addPhotoDriverMultiple` dan `plugins.addPhotoVehicleMultiple` (multiple files)

### Controller Changes
- Menggunakan `req.files.cover[0].filename` dan `req.files.foto_sim[0].filename` untuk driver
- Menggunakan `req.files.cover[0].filename` dan `req.files.foto_stnk[0].filename` untuk vehicle
- Menambahkan field `foto_sim` dan `foto_stnk` di semua operasi create dan update

### Database Fields
- **m_driver:** Field `foto_sim` sudah ada di model
- **kendaraan:** Field `foto_stnk` sudah ada di model
