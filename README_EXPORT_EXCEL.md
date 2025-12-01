# Export Excel Monitoring Order - Unlimited Size

## Deskripsi
Endpoint baru untuk download Excel monitoring order tanpa limit ukuran file. Endpoint ini dapat diakses dari project luar dan mendukung file Excel dengan ukuran besar.

## Endpoints

### 1. Export Excel Unlimited
**URL:** `GET /monitoring/order/export-excel-unlimited`

**Parameter Query:**
- `mulai` (required): Tanggal mulai dalam format YYYY-MM-DD
- `selesai` (required): Tanggal selesai dalam format YYYY-MM-DD
- `bu` (optional): ID Business Unit
- `brench` (optional): ID Branch
- `vendor` (optional): ID Vendor/Mitra

**Contoh Request:**
```
GET /monitoring/order/export-excel-unlimited?mulai=2025-06-17&selesai=2025-10-17&bu=11&brench=&vendor=
```

**Response:**
- File Excel (.xlsx) dengan nama format: `YYYYMMDD_monitoring_bysm.xlsx`
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

### 2. Export Excel Streaming (untuk file sangat besar)
**URL:** `GET /monitoring/order/export-excel-streaming`

**Parameter Query:** Sama dengan endpoint unlimited

**Contoh Request:**
```
GET /monitoring/order/export-excel-streaming?mulai=2025-06-17&selesai=2025-10-17&bu=11&brench=&vendor=
```

**Response:**
- File Excel (.xlsx) dengan nama format: `YYYYMMDD_monitoring_bysm_streaming.xlsx`
- Menggunakan streaming untuk menghindari memory overflow

## Fitur

### CORS Support
- Endpoint dapat diakses dari domain manapun
- Headers CORS sudah dikonfigurasi untuk akses cross-origin

### Memory Optimization
- **Endpoint Unlimited**: Menggunakan ExcelJS standard untuk file dengan ukuran normal
- **Endpoint Streaming**: Menggunakan ExcelJS streaming untuk file yang sangat besar (>100MB)

### Data Processing
- Query SQL yang sama dengan PHP CodeIgniter original
- Processing data dengan logika yang sama
- Support untuk semua parameter filter

## Contoh Penggunaan dari JavaScript

```javascript
// Download Excel unlimited
const downloadExcel = async () => {
  const params = new URLSearchParams({
    mulai: '2025-06-17',
    selesai: '2025-10-17',
    bu: '11',
    brench: '',
    vendor: ''
  });
  
  const response = await fetch(`/monitoring/order/export-excel-unlimited?${params}`);
  const blob = await response.blob();
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'monitoring_bysm.xlsx';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
```

## Contoh Penggunaan dari PHP

```php
// Download Excel dari PHP
$url = 'https://api.eurekalogistics.co.id/monitoring/order/export-excel-unlimited';
$params = http_build_query([
    'mulai' => '2025-06-17',
    'selesai' => '2025-10-17',
    'bu' => '11',
    'brench' => '',
    'vendor' => ''
]);

$fullUrl = $url . '?' . $params;

// Download file
$fileContent = file_get_contents($fullUrl);
file_put_contents('monitoring_bysm.xlsx', $fileContent);
```

## Error Handling

### 400 Bad Request
```json
{
  "status": {
    "code": 400,
    "message": "Parameter mulai dan selesai wajib diisi"
  }
}
```

### 500 Internal Server Error
```json
{
  "status": {
    "code": 500,
    "message": "Error message"
  }
}
```

## Perbedaan dengan Endpoint Original

| Aspek | Original (PHP) | New (Node.js) |
|-------|----------------|---------------|
| Format Output | .xls | .xlsx |
| Memory Usage | Limited | Optimized |
| CORS Support | No | Yes |
| Streaming | No | Yes (optional) |
| Cross-Origin Access | No | Yes |
| File Size Limit | Yes | No |

## Testing

### Test dengan cURL
```bash
# Test endpoint unlimited
curl -X GET "http://localhost:3000/monitoring/order/export-excel-unlimited?mulai=2025-06-17&selesai=2025-10-17&bu=11" \
  -H "Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
  --output monitoring_bysm.xlsx

# Test endpoint streaming
curl -X GET "http://localhost:3000/monitoring/order/export-excel-streaming?mulai=2025-06-17&selesai=2025-10-17&bu=11" \
  -H "Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
  --output monitoring_bysm_streaming.xlsx
```

## Notes
- Endpoint ini tidak memerlukan authentication (sesuai permintaan untuk akses dari project luar)
- File Excel menggunakan format .xlsx yang lebih modern dan efisien
- Streaming endpoint direkomendasikan untuk data dengan jumlah record > 10,000
- CORS headers sudah dikonfigurasi untuk akses dari domain manapun
