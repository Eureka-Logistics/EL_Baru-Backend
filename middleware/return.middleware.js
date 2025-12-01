const { check } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'get-Return-List': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page tidak boleh kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit tidak boleh kosong`),
            ]
        }
            
        case 'get-Return-List-Detail': {
            return [
                check('id_msm_retur')
                    .not().isEmpty()
                    .withMessage(`ID SM Return tidak boleh kosong`),
            ]
        }
            
        case 'create-Return': {
            return [
                check('id_msm')
                    .not().isEmpty()
                    .withMessage(`ID SM tidak boleh kosong`),
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra tidak boleh kosong`),
                check('id_unit')
                    .not().isEmpty()
                    .withMessage(`ID Kendaraan tidak boleh kosong`),
                check('id_driver')
                    .not().isEmpty()
                    .withMessage(`ID Driver tidak boleh kosong`),
                check('nama_barang')
                    .not().isEmpty()
                    .withMessage(`Nama Barang tidak boleh kosong`),
                check('berat')
                    .not().isEmpty()
                    .withMessage(`Berat tidak boleh kosong`),
                check('qty')
                    .not().isEmpty()
                    .withMessage(`Qty tidak boleh kosong`),
                check('koli')
                    .not().isEmpty()
                    .withMessage(`Koli tidak boleh kosong`),
                check('nilai_barang')
                    .not().isEmpty()
                    .withMessage(`Nilai Barang tidak boleh kosong`),
                check('kategori')
                    .not().isEmpty()
                    .withMessage(`Kategori tidak boleh kosong`),
                check('keterangan')
                    .not().isEmpty()
                    .withMessage(`Keterangan tidak boleh kosong`),
                check('penerima')
                    .not().isEmpty()
                    .withMessage(`Penerima tidak boleh kosong`),
            ]
        }
            
        case 'edit-Return': {
            return [
                check('id_msm_retur')
                    .not().isEmpty()
                    .withMessage(`ID SM Return tidak boleh kosong`),
                check('id_msm')
                    .not().isEmpty()
                    .withMessage(`ID SM tidak boleh kosong`),
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra tidak boleh kosong`),
                check('id_unit')
                    .not().isEmpty()
                    .withMessage(`ID Kendaraan tidak boleh kosong`),
                check('id_driver')
                    .not().isEmpty()
                    .withMessage(`ID Driver tidak boleh kosong`),
                check('nama_barang')
                    .not().isEmpty()
                    .withMessage(`Nama Barang tidak boleh kosong`),
                check('berat')
                    .not().isEmpty()
                    .withMessage(`Berat tidak boleh kosong`),
                check('qty')
                    .not().isEmpty()
                    .withMessage(`Qty tidak boleh kosong`),
                check('koli')
                    .not().isEmpty()
                    .withMessage(`Koli tidak boleh kosong`),
                check('nilai_barang')
                    .not().isEmpty()
                    .withMessage(`Nilai Barang tidak boleh kosong`),
                check('kategori')
                    .not().isEmpty()
                    .withMessage(`Kategori tidak boleh kosong`),
                check('keterangan')
                    .not().isEmpty()
                    .withMessage(`Keterangan tidak boleh kosong`),
                check('penerima')
                    .not().isEmpty()
                    .withMessage(`Penerima tidak boleh kosong`),
            ]
        }
    }
}