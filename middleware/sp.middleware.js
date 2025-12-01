const core = require('../config/core.config')
const models = core.models()
const { check } = require('express-validator')
const db = require('../config/db.config')

const CryptoJS = core.CryptoJS


exports.validate = (method) => {

    switch (method) {


        case 'approveSp': {
            return [
                check('id_unit')
                    .not().isEmpty()
                    .withMessage(`armada harus diisi`),
                check('id_supir')
                    .not().isEmpty()
                    .withMessage(`Supir harus diisi`),
                check('id_mp')
                    .not().isEmpty()
                    .withMessage(`id mp kosong`),
            ]
        }
        case 'createSp': {
            return [

                check('id_customer')
                    .not().isEmpty()
                    .withMessage(`customer harus diisi`),
                check('jenis_barang')
                    .not().isEmpty()
                    .withMessage(`jenis barang harus diisi`),
                check('packing')
                    .not().isEmpty()
                    .withMessage(`packing harus diisi`),
                check('packing')
                    .not().isEmpty()
                    .withMessage(`packing harus diisi`),
                check('packing')
                    .not().isEmpty()
                    .withMessage(`packing harus diisi`),
                check('tgl_pickup')
                    .not().isEmpty()
                    .withMessage(`tanggal pickup harus diisi`),
                check('tgl_bongkar')
                    .not().isEmpty()
                    .withMessage(`tanggal bongkar harus diisi`),
                check('asuransi')
                    .not().isEmpty()
                    .withMessage(`asuransi harus diisi`),
            ]
        }






    }
}