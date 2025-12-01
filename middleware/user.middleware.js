const core = require('../config/core.config')
const models = core.models()
const { check } = require('express-validator')
const db = require('../config/db.config')

const CryptoJS = core.CryptoJS


exports.validate = (method) => {

    switch (method) {

        case 'create': {
            return [
                check('username')
                    .not().isEmpty()
                    .withMessage(`username Tidak Boleh Kosong`),
                check('nama_lengkap')
                    .not().isEmpty()
                    .withMessage(`Nama Lengkap Tidak Boleh Kosong`),
                check('divisi')
                    .not().isEmpty()
                    .withMessage(`Divisi Tidak Boleh Kosong`),
                check('id_cabang')
                    .not().isEmpty()
                    .withMessage(`id cabang Tidak Boleh Kosong`),
                check('perusahaan')
                    .not().isEmpty()
                    .withMessage(`Perusahaan Tidak Boleh Kosong`),
                check('kode_cabang')
                    .not().isEmpty()
                    .withMessage(`Kode Cabang lahir Tidak Boleh Kosong`),
                check('level')
                    .not().isEmpty()
                    .withMessage(`level User Tidak Boleh Kosong`),
                check('divisi')
                    .not().isEmpty()
                    .withMessage(`divisi masuk Tidak Boleh Kosong`),
                check('user_level')
                    .not().isEmpty()
                    .withMessage(`id user level Tidak Boleh Kosong`),
                check('user_group')
                    .not().isEmpty()
                    .withMessage(`id user group masuk Tidak Boleh Kosong`),
                check('no_telp')
                    .isLength({
                        min: 8,
                        // max: 15
                    }).withMessage('Nomor Telephone Minimal 8 Karakter'),

                check('email', 'Email Tidak Valid')
                    .normalizeEmail()
                    .isEmail()
                    .custom(async email => {
                        const value = await models.users.findOne({
                            where: {
                                email: email,
                            }
                        })
                        if (value) {
                            throw new SyntaxError('Email Yang Anda Masukkan Telah Di Gunakan');
                        }
                    }),

            ]
        }
    }
}

