const { check } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'get-AR-List': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page tidak boleh kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit tidak boleh kosong`),
            ]
        }
            
        case 'create-AR': {
            return [
                check('id_customer')
                    .not().isEmpty()
                    .withMessage(`ID CUstomer tidak boleh kosong`),
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra tidak boleh kosong`),
                check('pic')
                    .not().isEmpty()
                    .withMessage(`PIC tidak boleh kosong`),
                check('alamat_invoice')
                    .not().isEmpty()
                    .withMessage(`Alamat Invoice tidak boleh kosong`),
                // check('no_invoice_ar')
                //     .not().isEmpty()
                //     .withMessage(`No Invoice AR tidak boleh kosong`),
                // check('no_faktur_ar')
                //     .not().isEmpty()
                //     .withMessage(`No Faktur AR tidak boleh kosong`),
                // check('no_faktur_pajak')
                //     .not().isEmpty()
                //     .withMessage(`No Faktur Pajak tidak boleh kosong`),
                check('id_faktur')
                    .not().isEmpty()
                    .withMessage(`ID Faktur tidak boleh kosong`),
                check('service')
                    .not().isEmpty()
                    .withMessage(`Service tidak boleh kosong`),
                check('via')
                    .not().isEmpty()
                    .withMessage(`VIA Pengiriman tidak boleh kosong`),
                check('ppn')
                    .not().isEmpty()
                    .withMessage(`PPN tidak boleh kosong`),
                check('pph')
                    .not().isEmpty()
                    .withMessage(`PPH tidak boleh kosong`),
                check('pic')
                    .not().isEmpty()
                    .withMessage(`PIC tidak boleh kosong`),
                check('top')
                    .not().isEmpty()
                    .withMessage(`TOP tidak boleh kosong`),
                check('memo')
                    .not().isEmpty()
                    .withMessage(`Memo tidak boleh kosong`),
                check('total_ppn')
                    .not().isEmpty()
                    .withMessage(`Total PPN tidak boleh kosong`),
                check('total_pph')
                    .not().isEmpty()
                    .withMessage(`Total PPH tidak boleh kosong`),
                check('total_penjualan')
                    .not().isEmpty()
                    .withMessage(`Total Penjualan tidak boleh kosong`),
                // check('sales_invoice_id')
                //     .not().isEmpty()
                //     .withMessage(`ID Sales Invoice tidak boleh kosong`),
            ]
        }
        case 'edit-AR': {
            return [
                check('id_ar')
                    .not().isEmpty()
                    .withMessage(`ID AR tidak boleh kosong`),
                check('id_customer')
                    .not().isEmpty()
                    .withMessage(`ID CUstomer tidak boleh kosong`),
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra tidak boleh kosong`),
                check('pic')
                    .not().isEmpty()
                    .withMessage(`PIC tidak boleh kosong`),
                check('alamat_invoice')
                    .not().isEmpty()
                    .withMessage(`Alamat Invoice tidak boleh kosong`),
                // check('tgl_kirim_invoice')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal Kirim Invoice tidak boleh kosong`),
                // check('no_faktur_ar')
                //     .not().isEmpty()
                //     .withMessage(`No Faktur AR tidak boleh kosong`),
                // check('no_faktur_pajak')
                //     .not().isEmpty()
                //     .withMessage(`No Faktur Pajak tidak boleh kosong`),
                check('id_faktur')
                    .not().isEmpty()
                    .withMessage(`ID Faktur tidak boleh kosong`),
                check('service')
                    .not().isEmpty()
                    .withMessage(`Service tidak boleh kosong`),
                check('via')
                    .not().isEmpty()
                    .withMessage(`VIA Pengiriman tidak boleh kosong`),
                check('ppn')
                    .not().isEmpty()
                    .withMessage(`PPN tidak boleh kosong`),
                check('pph')
                    .not().isEmpty()
                    .withMessage(`PPH tidak boleh kosong`),
                check('pic')
                    .not().isEmpty()
                    .withMessage(`PIC tidak boleh kosong`),
                check('top')
                    .not().isEmpty()
                    .withMessage(`TOP tidak boleh kosong`),
                check('memo')
                    .not().isEmpty()
                    .withMessage(`Memo tidak boleh kosong`),
                check('total_ppn')
                    .not().isEmpty()
                    .withMessage(`Total PPN tidak boleh kosong`),
                check('total_pph')
                    .not().isEmpty()
                    .withMessage(`Total PPH tidak boleh kosong`),
                check('total_penjualan')
                    .not().isEmpty()
                    .withMessage(`Total Penjualan tidak boleh kosong`),
                // check('sales_invoice_id')
                //     .not().isEmpty()
                //     .withMessage(`ID Sales Invoice tidak boleh kosong`),
            ]
        }
        case 'get-AR-detail': {
            return [
                check('id_ar')
                    .not().isEmpty()
                    .withMessage(`ID AR tidak boleh kosong`),
            ]
        }
            
        case 'create-AR-Detail': {
            return [
                check('id_msm')
                    .not().isEmpty()
                    .withMessage(`ID SM tidak boleh kosong`),
                check('items')
                    .not().isEmpty()
                    .withMessage(`Item tidak boleh kosong`),
                check('service')
                    .not().isEmpty()
                    .withMessage(`Service tidak boleh kosong`),
                check('via')
                    .not().isEmpty()
                    .withMessage(`Via Pengiriman tidak boleh kosong`),
                check('tgl_berangkat')
                    .not().isEmpty()
                    .withMessage(`Tanggal Berangkat tidak boleh kosong`),
                check('volume')
                    .not().isEmpty()
                    .withMessage(`Volume tidak boleh kosong`),
                check('harga')
                    .not().isEmpty()
                    .withMessage(`Harga tidak boleh kosong`),
                check('overtonase')
                    .not().isEmpty()
                    .withMessage(`Overtonase tidak boleh kosong`),
                check('biaya_overtonase')
                    .not().isEmpty()
                    .withMessage(`Biaya Overtonase tidak boleh kosong`),
                check('biaya_muat')
                    .not().isEmpty()
                    .withMessage(`Biaya Muat tidak boleh kosong`),
                check('biaya_bongkar')
                    .not().isEmpty()
                    .withMessage(`Biaya Bongkar tidak boleh kosong`),
                check('biaya_kg_laut')
                    .not().isEmpty()
                    .withMessage(`Biaga Per KG Laut tidak boleh kosong`),
                check('biaya_volume')
                    .not().isEmpty()
                    .withMessage(`Biaya Volume tidak boleh kosong`),
                check('biaya_inap')
                    .not().isEmpty()
                    .withMessage(`Biaya Inap tidak boleh kosong`),
                check('biaya_multidrop')
                    .not().isEmpty()
                    .withMessage(`Biaya Multidrop tidak boleh kosong`),
                check('biaya_multimuat')
                    .not().isEmpty()
                    .withMessage(`Biaya Mutimuat tidak boleh kosong`),
                check('biaya_lain')
                    .not().isEmpty()
                    .withMessage(`Biaya Lain-nya tidak boleh kosong`),
                check('biaya_mel')
                    .not().isEmpty()
                    .withMessage(`Biaya MEL tidak boleh kosong`),
                check('biaya_tol')
                    .not().isEmpty()
                    .withMessage(`Biaya Tol tidak boleh kosong`),
                check('biaya_putar')
                    .not().isEmpty()
                    .withMessage(`Biaya Putar tidak boleh kosong`),
                check('biaya_insentif')
                    .not().isEmpty()
                    .withMessage(`Biaya Intensif tidak boleh kosong`),
                check('biaya_portal')
                    .not().isEmpty()
                    .withMessage(`Biaya Portal tidak boleh kosong`),
                check('biaya_packing')
                    .not().isEmpty()
                    .withMessage(`Biaya packing tidak boleh kosong`),
                check('biaya_noppn')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPN tidak boleh kosong`),
                check('biaya_nopph')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPH tidak boleh kosong`),
                check('bongkar_noppn')
                    .not().isEmpty()
                    .withMessage(`Bongkar No PPN tidak boleh kosong`),
                check('bongkar_lain')
                    .not().isEmpty()
                    .withMessage(`Bongkar Lain tidak boleh kosong`),
                check('potongan_bongkar')
                    .not().isEmpty()
                    .withMessage(`Potongan Bongkar tidak boleh kosong`),
                check('potongan_overtonase')
                    .not().isEmpty()
                    .withMessage(`Potongan Overtonase tidak boleh kosong`),
                check('potongan_multidrop')
                    .not().isEmpty()
                    .withMessage(`Potongan Multidrop tidak boleh kosong`),
                check('potongan_rusak')
                    .not().isEmpty()
                    .withMessage(`Potongan Rusak tidak boleh kosong`),
                check('potongan_biaya_sewa')
                    .not().isEmpty()
                    .withMessage(`Potongan Biaya Rusak tidak boleh kosong`),
                check('potongan_diskon')
                    .not().isEmpty()
                    .withMessage(`Potongan Diskon tidak boleh kosong`),
                check('potongan_lain')
                    .not().isEmpty()
                    .withMessage(`Potongan Lain tidak boleh kosong`),
                check('potongan_inap')
                    .not().isEmpty()
                    .withMessage(`Potongan Inap tidak boleh kosong`),
                check('asuransi')
                    .not().isEmpty()
                    .withMessage(`Asurasni tidak boleh kosong`),
                check('inap_ppn')
                    .not().isEmpty()
                    .withMessage(`Inap PPN tidak boleh kosong`),
                check('pas_bandara')
                    .not().isEmpty()
                    .withMessage(`Pas Bandara tidak boleh kosong`),
                check('no_kwitansi')
                    .not().isEmpty()
                    .withMessage(`No Kwitansi tidak boleh kosong`),
                check('total_pengganti')
                    .not().isEmpty()
                    .withMessage(`Total Pengganti tidak boleh kosong`),
                check('total_harga')
                    .not().isEmpty()
                    .withMessage(`Total Harga tidak boleh kosong`),
                check('total_tagihan')
                    .not().isEmpty()
                    .withMessage(`Total Tagihan tidak boleh kosong`),
            ]
        }
        case 'get-Detail-AR': {
            return [
                check('id_ard')
                    .not().isEmpty()
                    .withMessage(`ID ARD tidak boleh kosong`),
            ]
        }
        case 'edit-AR-Detail': {
            return [
                check('id_ard')
                    .not().isEmpty()
                    .withMessage(`ID AR Detail tidak boleh kosong`),
                check('id_msm')
                    .not().isEmpty()
                    .withMessage(`ID SM tidak boleh kosong`),
                check('items')
                    .not().isEmpty()
                    .withMessage(`Item tidak boleh kosong`),
                check('service')
                    .not().isEmpty()
                    .withMessage(`Service tidak boleh kosong`),
                check('via')
                    .not().isEmpty()
                    .withMessage(`Via Pengiriman tidak boleh kosong`),
                check('tgl_tiba')
                    .not().isEmpty()
                    .withMessage(`Tanggal Tiba tidak boleh kosong`),
                check('volume')
                    .not().isEmpty()
                    .withMessage(`Volume tidak boleh kosong`),
                check('harga')
                    .not().isEmpty()
                    .withMessage(`Harga tidak boleh kosong`),
                check('overtonase')
                    .not().isEmpty()
                    .withMessage(`Overtonase tidak boleh kosong`),
                check('biaya_overtonase')
                    .not().isEmpty()
                    .withMessage(`Biaya Overtonase tidak boleh kosong`),
                check('biaya_muat')
                    .not().isEmpty()
                    .withMessage(`Biaya Muat tidak boleh kosong`),
                check('biaya_bongkar')
                    .not().isEmpty()
                    .withMessage(`Biaya Bongkar tidak boleh kosong`),
                check('biaya_kg_laut')
                    .not().isEmpty()
                    .withMessage(`Biaga Per KG Laut tidak boleh kosong`),
                check('biaya_volume')
                    .not().isEmpty()
                    .withMessage(`Biaya Volume tidak boleh kosong`),
                check('biaya_inap')
                    .not().isEmpty()
                    .withMessage(`Biaya Inap tidak boleh kosong`),
                check('biaya_multidrop')
                    .not().isEmpty()
                    .withMessage(`Biaya Multidrop tidak boleh kosong`),
                check('biaya_multimuat')
                    .not().isEmpty()
                    .withMessage(`Biaya Mutimuat tidak boleh kosong`),
                check('biaya_lain')
                    .not().isEmpty()
                    .withMessage(`Biaya Lain-nya tidak boleh kosong`),
                check('biaya_mel')
                    .not().isEmpty()
                    .withMessage(`Biaya MEL tidak boleh kosong`),
                check('biaya_tol')
                    .not().isEmpty()
                    .withMessage(`Biaya Tol tidak boleh kosong`),
                check('biaya_putar')
                    .not().isEmpty()
                    .withMessage(`Biaya Putar tidak boleh kosong`),
                check('biaya_insentif')
                    .not().isEmpty()
                    .withMessage(`Biaya Intensif tidak boleh kosong`),
                check('biaya_portal')
                    .not().isEmpty()
                    .withMessage(`Biaya Portal tidak boleh kosong`),
                check('biaya_packing')
                    .not().isEmpty()
                    .withMessage(`Biaya packing tidak boleh kosong`),
                check('biaya_noppn')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPN tidak boleh kosong`),
                check('biaya_nopph')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPH tidak boleh kosong`),
                check('bongkar_noppn')
                    .not().isEmpty()
                    .withMessage(`Bongkar No PPN tidak boleh kosong`),
                check('bongkar_lain')
                    .not().isEmpty()
                    .withMessage(`Bongkar Lain tidak boleh kosong`),
                check('potongan_bongkar')
                    .not().isEmpty()
                    .withMessage(`Potongan Bongkar tidak boleh kosong`),
                check('potongan_overtonase')
                    .not().isEmpty()
                    .withMessage(`Potongan Overtonase tidak boleh kosong`),
                check('potongan_multidrop')
                    .not().isEmpty()
                    .withMessage(`Potongan Multidrop tidak boleh kosong`),
                check('potongan_rusak')
                    .not().isEmpty()
                    .withMessage(`Potongan Rusak tidak boleh kosong`),
                check('potongan_biaya_sewa')
                    .not().isEmpty()
                    .withMessage(`Potongan Biaya Rusak tidak boleh kosong`),
                check('potongan_diskon')
                    .not().isEmpty()
                    .withMessage(`Potongan Diskon tidak boleh kosong`),
                check('potongan_lain')
                    .not().isEmpty()
                    .withMessage(`Potongan Lain tidak boleh kosong`),
                check('potongan_inap')
                    .not().isEmpty()
                    .withMessage(`Potongan Inap tidak boleh kosong`),
                check('asuransi')
                    .not().isEmpty()
                    .withMessage(`Asurasni tidak boleh kosong`),
                check('inap_ppn')
                    .not().isEmpty()
                    .withMessage(`Inap PPN tidak boleh kosong`),
                check('pas_bandara')
                    .not().isEmpty()
                    .withMessage(`Pas Bandara tidak boleh kosong`),
                check('no_kwitansi')
                    .not().isEmpty()
                    .withMessage(`No Kwitansi tidak boleh kosong`),
                check('total_pengganti')
                    .not().isEmpty()
                    .withMessage(`Total Pengganti tidak boleh kosong`),
                check('total_harga')
                    .not().isEmpty()
                    .withMessage(`Total Harga tidak boleh kosong`),
                check('total_tagihan')
                    .not().isEmpty()
                    .withMessage(`Total Tagihan tidak boleh kosong`),
            ]
        }
    }
}