-- Query untuk mengecek kenapa data MSM "11-SJ-25-033892" tidak muncul di monitoring-sj
-- Jalankan query ini satu per satu untuk melihat kondisi mana yang tidak terpenuhi

-- ============================================
-- 1. CEK DATA DI TABLE m_sm (TABLE UTAMA)
-- ============================================
SELECT 
    id_msm,
    msm,
    id_mpd,
    id_bu,
    id_bu_brench,
    id_mitra_pickup,
    status_pembatalan,
    is_deleted,
    tgl_muat,
    CASE 
        WHEN status_pembatalan != 0 THEN '❌ FAIL: status_pembatalan != 0'
        WHEN is_deleted != 0 THEN '❌ FAIL: is_deleted != 0'
        WHEN tgl_muat NOT BETWEEN '2025-11-13' AND '2026-01-13' THEN '❌ FAIL: tgl_muat tidak dalam range'
        WHEN id_bu != 11 THEN '❌ FAIL: id_bu != 11'
        ELSE '✅ PASS: Kondisi m_sm OK'
    END AS status_check
FROM m_sm 
WHERE msm = '11-SJ-25-033892';

-- ============================================
-- 2. CEK DATA DI m_pengadaan_detail (INNER JOIN)
-- ============================================
SELECT 
    a.id_msm,
    a.msm,
    a.id_mpd,
    b.id_mpd AS detail_id_mpd,
    b.id_mp,
    b.id_almuat,
    b.id_albongkar,
    CASE 
        WHEN b.id_mpd IS NULL THEN '❌ FAIL: Tidak ada data di m_pengadaan_detail'
        ELSE '✅ PASS: Data m_pengadaan_detail ada'
    END AS status_check
FROM m_sm a
LEFT JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
WHERE a.msm = '11-SJ-25-033892';

-- ============================================
-- 3. CEK DATA DI m_pengadaan (INNER JOIN + STATUS)
-- ============================================
SELECT 
    a.id_msm,
    a.msm,
    b.id_mp,
    c.id_mp AS pengadaan_id_mp,
    c.status AS pengadaan_status,
    c.id_customer,
    CASE 
        WHEN c.id_mp IS NULL THEN '❌ FAIL: Tidak ada data di m_pengadaan'
        WHEN c.status NOT IN (1,2) THEN CONCAT('❌ FAIL: Status pengadaan = ', c.status, ' (harus 1 atau 2)')
        ELSE '✅ PASS: Data m_pengadaan OK dengan status 1 atau 2'
    END AS status_check
FROM m_sm a
INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
LEFT JOIN m_pengadaan c ON c.id_mp = b.id_mp
WHERE a.msm = '11-SJ-25-033892';

-- ============================================
-- 4. CEK DATA CUSTOMER (INNER JOIN)
-- ============================================
SELECT 
    a.id_msm,
    a.msm,
    c.id_customer,
    u.id_customer AS customer_id,
    u.nama_perusahaan,
    CASE 
        WHEN u.id_customer IS NULL THEN '❌ FAIL: Tidak ada data customer'
        ELSE '✅ PASS: Data customer ada'
    END AS status_check
FROM m_sm a
INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
LEFT JOIN customer u ON u.id_customer = c.id_customer
WHERE a.msm = '11-SJ-25-033892';

-- ============================================
-- 5. CEK ALAMAT MUAT (INNER JOIN)
-- ============================================
SELECT 
    a.id_msm,
    a.msm,
    b.id_almuat,
    d.id AS alamat_muat_id,
    d.kota AS kota_muat,
    CASE 
        WHEN d.id IS NULL THEN '❌ FAIL: Tidak ada alamat muat'
        ELSE '✅ PASS: Alamat muat ada'
    END AS status_check
FROM m_sm a
INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
LEFT JOIN alamat d ON d.id = b.id_almuat
WHERE a.msm = '11-SJ-25-033892';

-- ============================================
-- 6. CEK ALAMAT BONGKAR (INNER JOIN)
-- ============================================
SELECT 
    a.id_msm,
    a.msm,
    b.id_albongkar,
    e.id AS alamat_bongkar_id,
    e.kota AS kota_bongkar,
    CASE 
        WHEN e.id IS NULL THEN '❌ FAIL: Tidak ada alamat bongkar'
        ELSE '✅ PASS: Alamat bongkar ada'
    END AS status_check
FROM m_sm a
INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
LEFT JOIN alamat e ON e.id = b.id_albongkar
WHERE a.msm = '11-SJ-25-033892';

-- ============================================
-- 7. CEK MITRA PICKUP (INNER JOIN)
-- ============================================
SELECT 
    a.id_msm,
    a.msm,
    a.id_mitra_pickup,
    f.id_mitra AS mitra_id,
    f.nama_mitra,
    CASE 
        WHEN a.id_mitra_pickup = 0 OR a.id_mitra_pickup IS NULL THEN '❌ FAIL: id_mitra_pickup = 0 atau NULL'
        WHEN f.id_mitra IS NULL THEN '❌ FAIL: Tidak ada data mitra dengan id tersebut'
        ELSE '✅ PASS: Data mitra ada'
    END AS status_check
FROM m_sm a
INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
LEFT JOIN mitra f ON f.id_mitra = a.id_mitra_pickup
WHERE a.msm = '11-SJ-25-033892';

-- ============================================
-- 8. QUERY LENGKAP (SAMA DENGAN DI CONTROLLER)
-- ============================================
-- Query ini adalah replika dari query di controller
-- Jika query ini tidak return data, berarti ada kondisi yang tidak terpenuhi
SELECT 
    a.id_msm, 
    a.msm, 
    DATE(a.tgl_muat) AS tgl_muat, 
    b.id_unit, 
    b.id_mpd, 
    b.id_mp, 
    c.msp, 
    d.kota AS muat, 
    e.kota AS bongkar, 
    f.id_mitra, 
    a.id_bu, 
    a.tgl_terima_inv, 
    f.nama_mitra AS pickup, 
    a.pickup_nopol, 
    a.pickup_supir, 
    a.berat, 
    a.qty, 
    a.koli, 
    a.ikat, 
    l.no_invoice_ar, 
    l.tgl_create AS inv_create_date, 
    p.no_invoice_ap, 
    p.tgl_invoice_ap AS ap_create_date, 
    p.no_invoice_mitra, 
    u.nama_perusahaan, 
    v.nama_lengkap AS penginput_ar, 
    MAX(IF(r.divisi = 'operasional', r.date_added, 0)) AS date_ops, 
    MAX(IF(r.divisi = 'ap',          r.date_added, 0)) AS date_ap, 
    MAX(IF(r.divisi = 'ar',          r.date_added, 0)) AS date_ar, 
    MAX(IF(r.divisi = 'operasional', r.diserahkan, 0)) AS sjsendops, 
    MAX(IF(w.action = 9, w.tgl_update, 0)) AS tgl_9 
FROM m_sm a 
INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
INNER JOIN m_pengadaan c        ON c.id_mp = b.id_mp AND c.status IN (1,2) 
INNER JOIN customer u           ON u.id_customer = c.id_customer 
LEFT JOIN m_status_order mso    ON mso.id_mp = c.id_mp AND mso.kendaraan_purchasing = 'Y' 
INNER JOIN alamat d             ON d.id = b.id_almuat 
INNER JOIN alamat e             ON e.id = b.id_albongkar 
INNER JOIN mitra f              ON f.id_mitra = a.id_mitra_pickup 
LEFT JOIN m_ar_detail k         ON k.id_msm = a.id_msm 
LEFT JOIN m_ar l                ON l.id_ar = k.id_ar 
LEFT JOIN m_ap_detail o         ON o.id_msm = a.id_msm 
LEFT JOIN m_ap p                ON p.id_ap = o.id_ap 
LEFT JOIN users t               ON t.id = c.id_sales 
LEFT JOIN m_sm_receive r        ON r.id_msm = a.id_msm 
LEFT JOIN users v               ON v.id = l.id_admin 
LEFT JOIN kendaraanstatus w     ON w.id_msm = a.id_msm AND w.action = 9 
WHERE a.msm = '11-SJ-25-033892'
  AND a.status_pembatalan = 0 
  AND a.is_deleted = 0 
  AND (a.tgl_muat BETWEEN '2025-11-13' AND '2026-01-13')
  AND a.id_bu = 11
GROUP BY a.id_msm;

-- ============================================
-- 9. QUERY SUMMARY - CEK SEMUA KONDISI SEKALIGUS
-- ============================================
SELECT 
    'm_sm' AS table_name,
    CASE 
        WHEN EXISTS(SELECT 1 FROM m_sm WHERE msm = '11-SJ-25-033892' AND status_pembatalan = 0 AND is_deleted = 0) 
        THEN '✅ Ada' ELSE '❌ Tidak ada atau status tidak sesuai' 
    END AS status,
    (SELECT COUNT(*) FROM m_sm WHERE msm = '11-SJ-25-033892') AS total_rows
UNION ALL
SELECT 
    'm_pengadaan_detail',
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM m_sm a 
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
            WHERE a.msm = '11-SJ-25-033892'
        ) 
        THEN '✅ Ada' ELSE '❌ Tidak ada' 
    END,
    (SELECT COUNT(*) FROM m_sm a INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd WHERE a.msm = '11-SJ-25-033892')
UNION ALL
SELECT 
    'm_pengadaan (status 1,2)',
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM m_sm a 
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
            WHERE a.msm = '11-SJ-25-033892'
        ) 
        THEN '✅ Ada' ELSE '❌ Tidak ada atau status bukan 1/2' 
    END,
    (SELECT COUNT(*) FROM m_sm a INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) WHERE a.msm = '11-SJ-25-033892')
UNION ALL
SELECT 
    'customer',
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM m_sm a 
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
            INNER JOIN customer u ON u.id_customer = c.id_customer
            WHERE a.msm = '11-SJ-25-033892'
        ) 
        THEN '✅ Ada' ELSE '❌ Tidak ada' 
    END,
    (SELECT COUNT(*) FROM m_sm a INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) INNER JOIN customer u ON u.id_customer = c.id_customer WHERE a.msm = '11-SJ-25-033892')
UNION ALL
SELECT 
    'alamat muat',
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM m_sm a 
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
            INNER JOIN alamat d ON d.id = b.id_almuat
            WHERE a.msm = '11-SJ-25-033892'
        ) 
        THEN '✅ Ada' ELSE '❌ Tidak ada' 
    END,
    (SELECT COUNT(*) FROM m_sm a INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) INNER JOIN alamat d ON d.id = b.id_almuat WHERE a.msm = '11-SJ-25-033892')
UNION ALL
SELECT 
    'alamat bongkar',
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM m_sm a 
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
            INNER JOIN alamat e ON e.id = b.id_albongkar
            WHERE a.msm = '11-SJ-25-033892'
        ) 
        THEN '✅ Ada' ELSE '❌ Tidak ada' 
    END,
    (SELECT COUNT(*) FROM m_sm a INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) INNER JOIN alamat e ON e.id = b.id_albongkar WHERE a.msm = '11-SJ-25-033892')
UNION ALL
SELECT 
    'mitra pickup',
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM m_sm a 
            INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd 
            INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2)
            INNER JOIN mitra f ON f.id_mitra = a.id_mitra_pickup
            WHERE a.msm = '11-SJ-25-033892'
        ) 
        THEN '✅ Ada' ELSE '❌ Tidak ada' 
    END,
    (SELECT COUNT(*) FROM m_sm a INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp AND c.status IN (1,2) INNER JOIN mitra f ON f.id_mitra = a.id_mitra_pickup WHERE a.msm = '11-SJ-25-033892');
