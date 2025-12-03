const { check } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'data-UangJalan-Periode': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page tidak boleh kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit tidak boleh kosong`)
            ]
        }
        case 'data-UangJalan-Periode-Detail': {
            return [
                check('id_uang_jalan_periode')
                    .not().isEmpty()
                    .withMessage(`ID Uang Jalan Periode tidak boleh kosong`),
            ]
        }
        case 'create-UangJalan-Periode': {
            return [
                check('tgl_mulai')
                    .not().isEmpty()
                    .withMessage(`Tanggal Mulai tidak boleh kosong`),
                check('tgl_akhir')
                    .not().isEmpty()
                    .withMessage(`Tanggal Akhir tidak boleh kosong`),
                check('total_nominal')
                    .not().isEmpty()
                    .withMessage(`Total Nominal tidak boleh kosong`),
            ]
        }
        case 'edit-UangJalan-Periode': {
            return [
                check('id_uang_jalan_periode')
                    .not().isEmpty()
                    .withMessage(`ID Uang Jalan Periode tidak boleh kosong`),
                check('tgl_mulai')
                    .not().isEmpty()
                    .withMessage(`Tanggal Mulai tidak boleh kosong`),
                check('tgl_akhir')
                    .not().isEmpty()
                    .withMessage(`Tanggal Akhir tidak boleh kosong`),
                check('total_nominal')
                    .not().isEmpty()
                    .withMessage(`Total Nominal tidak boleh kosong`),
            ]
        }
        case 'create-UangJalan-Transfer': {
            return [
                check('id_uang_jalan_periode')
                    .not().isEmpty()
                    .withMessage(`ID Uang Jalan Periode tidak boleh kosong`),
                check('id_mp')
                    .not().isEmpty()
                    .withMessage(`ID MP tidak boleh kosong`),
                check('id_driver')
                    .not().isEmpty()
                    .withMessage(`ID Driver tidak boleh kosong`),
                check('norek_penerima')
                    .not().isEmpty()
                    .withMessage(`No Rekening tidak boleh kosong`),
                check('tgl_transaksi')
                    .not().isEmpty()
                    .withMessage(`Tanggal Transaksi tidak boleh kosong`),
                check('total_nominal')
                    .not().isEmpty()
                    .withMessage(`Total Nominal tidak boleh kosong`),
                check('bbm_muatan')
                    .not().isEmpty()
                    .withMessage(`BBM Muatan tidak boleh kosong`),
                check('timbangan')
                    .not().isEmpty()
                    .withMessage(`Timbangan tidak boleh kosong`),
                check('tol')
                    .not().isEmpty()
                    .withMessage(`Tol tidak boleh kosong`),
                check('parkir')
                    .not().isEmpty()
                    .withMessage(`Parkir tidak boleh kosong`),
                check('bongkar_muat')
                    .not().isEmpty()
                    .withMessage(`Bongkar Muat tidak boleh kosong`),
                check('makan')
                    .not().isEmpty()
                    .withMessage(`Makan tidak boleh kosong`),
                check('operasional')
                    .not().isEmpty()
                    .withMessage(`Operasional tidak boleh kosong`),
                check('memo')
                    .not().isEmpty()
                    .withMessage(`Memo tidak boleh kosong`),
                check('ptj')
                    .not().isEmpty()
                    .withMessage(`PTJ tidak boleh kosong`),
                check('nominal_ptj')
                    .not().isEmpty()
                    .withMessage(`Nominal PTJ tidak boleh kosong`),
                check('tgl_ptj')
                    .not().isEmpty()
                    .withMessage(`Tanggal PTJ tidak boleh kosong`),
                check('ket_ptj')
                    .not().isEmpty()
                    .withMessage(`Keterangan PTJ tidak boleh kosong`),
            ]
        }
    }
}