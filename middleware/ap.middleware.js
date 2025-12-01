const { check } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'get-AP-List': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page tidak boleh kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit tidak boleh kosong`),
            ]
        }
        case 'get-AP-Detail': {
            return [
                check('id_ap')
                    .not().isEmpty()
                    .withMessage(`ID AP tidak boleh kosong`),
            ]
        }
            
            
        case 'create-AP': {
            return [
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra tidak boleh kosong`),
                // check('no_invoice_mitra')
                //     .not().isEmpty()
                //     .withMessage(`No Invoice Mitra tidak boleh kosong`),
                check('no_faktur')
                    .not().isEmpty()
                    .withMessage(`No Faktur tidak boleh kosong`),
                check('tgl_terima_invoice')
                    .not().isEmpty()
                    .withMessage(`Tanggal Terima Invoice tidak boleh kosong`),
                check('service')
                    .not().isEmpty()
                    .withMessage(`Layanan tidak boleh kosong`),
                check('via')
                    .not().isEmpty()
                    .withMessage(`Pengiriman Via tidak boleh kosong`),
                check('top')
                    .not().isEmpty()
                    .withMessage(`Top tidak boleh kosong`),
                check('ppn')
                    .not().isEmpty()
                    .withMessage(`PPN tidak boleh kosong`),
                check('pph')
                    .not().isEmpty()
                    .withMessage(`PPH tidak boleh kosong`),
                check('jenis_pph')
                    .not().isEmpty()
                    .withMessage(`Jenis PPH tidak boleh kosong`),
                check('biaya_lain')
                    .not().isEmpty()
                    .withMessage(`Biaya Lain tidak boleh kosong`),
                // check('ket_biayalain')
                //     .not().isEmpty()
                //     .withMessage(`Keterangan Biaya Lain tidak boleh kosong`),
                // check('memo')
                //     .not().isEmpty()
                //     .withMessage(`Memo tidak boleh kosong`),
            ]
        }
            
        case 'edit-AP': {
            return [
                check('id_ap')
                    .not().isEmpty()
                    .withMessage(`ID AP tidak boleh kosong`),
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra tidak boleh kosong`),
                // check('no_invoice_mitra')
                //     .not().isEmpty()
                //     .withMessage(`No Invoice Mitra tidak boleh kosong`),
                check('no_faktur')
                    .not().isEmpty()
                    .withMessage(`No Faktur tidak boleh kosong`),
                check('tgl_terima_invoice')
                    .not().isEmpty()
                    .withMessage(`Tanggal Terima Invoice tidak boleh kosong`),
                check('service')
                    .not().isEmpty()
                    .withMessage(`Layanan tidak boleh kosong`),
                check('via')
                    .not().isEmpty()
                    .withMessage(`Pengiriman Via tidak boleh kosong`),
                check('top')
                    .not().isEmpty()
                    .withMessage(`Top tidak boleh kosong`),
                check('ppn')
                    .not().isEmpty()
                    .withMessage(`PPN tidak boleh kosong`),
                check('pph')
                    .not().isEmpty()
                    .withMessage(`PPH tidak boleh kosong`),
                check('jenis_pph')
                    .not().isEmpty()
                    .withMessage(`Jenis PPH tidak boleh kosong`),
                check('biaya_lain')
                    .not().isEmpty()
                    .withMessage(`Biaya Lain tidak boleh kosong`),
                // check('ket_biayalain')
                //     .not().isEmpty()
                //     .withMessage(`Keterangan Biaya Lain tidak boleh kosong`),
                // check('memo')
                //     .not().isEmpty()
                //     .withMessage(`Memo tidak boleh kosong`),
            ]
        }
            
            
        case 'create-AP-Detail': {
            return [
                check('id_ap')
                    .not().isEmpty()
                    .withMessage(`ID AP tidak boleh kosong`),
                check('jenis_angkut')
                    .not().isEmpty()
                    .withMessage(`Jenis Angkut tidak boleh kosong`),
                check('no_surat_jalan')
                    .not().isEmpty()
                    .withMessage(`No Surat Jalan tidak boleh kosong`),
                check('id_msm')
                    .not().isEmpty()
                    .withMessage(`ID SM tidak boleh kosong`),
                check('tgl_kirim')
                    .not().isEmpty()
                    .withMessage(`Tanggal Kirim tidak boleh kosong`),
                check('tgl_terima')
                    .not().isEmpty()
                    .withMessage(`Tanggal Terima tidak boleh kosong`),
                check('harga')
                    .not().isEmpty()
                    .withMessage(`Harga tidak boleh kosong`),
                check('overtonase')
                    .not().isEmpty()
                    .withMessage(`Overtonase tidak boleh kosong`),
                check('biaya_overtonase')
                    .not().isEmpty()
                    .withMessage(`Biaya Overtonase tidak boleh kosong`),
                check('biaya_bongkar')
                    .not().isEmpty()
                    .withMessage(`Biaya Bongkar tidak boleh kosong`),
                check('biaya_bongkar_addon')
                    .not().isEmpty()
                    .withMessage(`Biaya Bongkar Addon tidak boleh kosong`),
                check('biaya_muat')
                    .not().isEmpty()
                    .withMessage(`Biaya Muat tidak boleh kosong`),
                check('biaya_multidrop')
                    .not().isEmpty()
                    .withMessage(`Biaya Multi Drop tidak boleh kosong`),
                check('biaya_inap')
                    .not().isEmpty()
                    .withMessage(`Biaya Inap tidak boleh kosong`),
                check('biaya_mel')
                    .not().isEmpty()
                    .withMessage(`Biaya Mel tidak boleh kosong`),
                check('biaya_putar')
                    .not().isEmpty()
                    .withMessage(`Biaya Putar tidak boleh kosong`),
                check('biaya_insentif')
                    .not().isEmpty()
                    .withMessage(`Biaya Insentif tidak boleh kosong`),
                check('biaya_lain')
                    .not().isEmpty()
                    .withMessage(`Biaya Lain tidak boleh kosong`),
                check('potongan_bongkar')
                    .not().isEmpty()
                    .withMessage(`Potongan Bongkar Addon tidak boleh kosong`),
                check('potongan_overtonase')
                    .not().isEmpty()
                    .withMessage(`Potongan Overtonase tidak boleh kosong`),
                check('potongan_multidrop')
                    .not().isEmpty()
                    .withMessage(`Potongan Multi Drop tidak boleh kosong`),
                check('potongan_inap')
                    .not().isEmpty()
                    .withMessage(`Biaya Inap tidak boleh kosong`),
                check('potongan_rusak')
                    .not().isEmpty()
                    .withMessage(`Potongan Rusak tidak boleh kosong`),
                check('potongan_biaya_sewa')
                    .not().isEmpty()
                    .withMessage(`Potongan Biaya Sewa Addon tidak boleh kosong`),
                check('potongan_lain')
                    .not().isEmpty()
                    .withMessage(`Potongan Lain tidak boleh kosong`),
                check('asuransi')
                    .not().isEmpty()
                    .withMessage(`Asuransi tidak boleh kosong`),
                check('biaya_noppn')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPN tidak boleh kosong`),
                check('biaya_nopph')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPH tidak boleh kosong`),
                check('jumlah_harga')
                    .not().isEmpty()
                    .withMessage(`Jumlah Harga tidak boleh kosong`),
                check('jumlah_biaya')
                    .not().isEmpty()
                    .withMessage(`Jumlah Biaya tidak boleh kosong`),
                check('jumlah_potongan')
                    .not().isEmpty()
                    .withMessage(`Jumlah Potongan tidak boleh kosong`),
                check('subtotal')
                    .not().isEmpty()
                    .withMessage(`Subtotal tidak boleh kosong`),
            ]
        }
            
        case 'get-Detail-AP': {
            return [
                check('id_apd')
                    .not().isEmpty()
                    .withMessage(`ID AP Detail tidak boleh kosong`),
            ]
        }
            
        case 'edit-AP-Detail': {
            return [
                check('id_apd')
                    .not().isEmpty()
                    .withMessage(`ID AP Detail tidak boleh kosong`),
                check('id_ap')
                    .not().isEmpty()
                    .withMessage(`ID AP tidak boleh kosong`),
                check('jenis_angkut')
                    .not().isEmpty()
                    .withMessage(`Jenis Angkut tidak boleh kosong`),
                check('no_surat_jalan')
                    .not().isEmpty()
                    .withMessage(`No Surat Jalan tidak boleh kosong`),
                check('id_msm')
                    .not().isEmpty()
                    .withMessage(`ID SM tidak boleh kosong`),
                check('tgl_kirim')
                    .not().isEmpty()
                    .withMessage(`Tanggal Kirim tidak boleh kosong`),
                check('tgl_terima')
                    .not().isEmpty()
                    .withMessage(`Tanggal Terima tidak boleh kosong`),
                check('harga')
                    .not().isEmpty()
                    .withMessage(`Harga tidak boleh kosong`),
                check('overtonase')
                    .not().isEmpty()
                    .withMessage(`Overtonase tidak boleh kosong`),
                check('biaya_overtonase')
                    .not().isEmpty()
                    .withMessage(`Biaya Overtonase tidak boleh kosong`),
                check('biaya_bongkar')
                    .not().isEmpty()
                    .withMessage(`Biaya Bongkar tidak boleh kosong`),
                check('biaya_bongkar_addon')
                    .not().isEmpty()
                    .withMessage(`Biaya Bongkar Addon tidak boleh kosong`),
                check('biaya_muat')
                    .not().isEmpty()
                    .withMessage(`Biaya Muat tidak boleh kosong`),
                check('biaya_multidrop')
                    .not().isEmpty()
                    .withMessage(`Biaya Multi Drop tidak boleh kosong`),
                check('biaya_inap')
                    .not().isEmpty()
                    .withMessage(`Biaya Inap tidak boleh kosong`),
                check('biaya_mel')
                    .not().isEmpty()
                    .withMessage(`Biaya Mel tidak boleh kosong`),
                check('biaya_putar')
                    .not().isEmpty()
                    .withMessage(`Biaya Putar tidak boleh kosong`),
                check('biaya_insentif')
                    .not().isEmpty()
                    .withMessage(`Biaya Insentif tidak boleh kosong`),
                check('biaya_lain')
                    .not().isEmpty()
                    .withMessage(`Biaya Lain tidak boleh kosong`),
                check('potongan_bongkar')
                    .not().isEmpty()
                    .withMessage(`Potongan Bongkar Addon tidak boleh kosong`),
                check('potongan_overtonase')
                    .not().isEmpty()
                    .withMessage(`Potongan Overtonase tidak boleh kosong`),
                check('potongan_multidrop')
                    .not().isEmpty()
                    .withMessage(`Potongan Multi Drop tidak boleh kosong`),
                check('potongan_inap')
                    .not().isEmpty()
                    .withMessage(`Biaya Inap tidak boleh kosong`),
                check('potongan_rusak')
                    .not().isEmpty()
                    .withMessage(`Potongan Rusak tidak boleh kosong`),
                check('potongan_biaya_sewa')
                    .not().isEmpty()
                    .withMessage(`Potongan Biaya Sewa Addon tidak boleh kosong`),
                check('potongan_lain')
                    .not().isEmpty()
                    .withMessage(`Potongan Lain tidak boleh kosong`),
                check('asuransi')
                    .not().isEmpty()
                    .withMessage(`Asuransi tidak boleh kosong`),
                check('biaya_noppn')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPN tidak boleh kosong`),
                check('biaya_nopph')
                    .not().isEmpty()
                    .withMessage(`Biaya No PPH tidak boleh kosong`),
                check('jumlah_harga')
                    .not().isEmpty()
                    .withMessage(`Jumlah Harga tidak boleh kosong`),
                check('jumlah_biaya')
                    .not().isEmpty()
                    .withMessage(`Jumlah Biaya tidak boleh kosong`),
                check('jumlah_potongan')
                    .not().isEmpty()
                    .withMessage(`Jumlah Potongan tidak boleh kosong`),
                check('subtotal')
                    .not().isEmpty()
                    .withMessage(`Subtotal tidak boleh kosong`),
            ]
        }
    }
}