const core = require('../config/core.config')
const models = core.models()
const { check } = require('express-validator')
const db = require('../config/db.config')

const CryptoJS = core.CryptoJS


exports.validate = (method) => {
    switch (method) {
        case 'get-driver': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page Tidak Boleh Kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit Tidak Boleh Kosong`),
            ]
        }
        case 'get-driver-detail': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Driver Tidak Boleh Kosong`)
            ]
        }

        case 'create': {
            return [
                // ('nama')
                //     .not().isEmpty()
                //     .withMessage(`Nama Tidak Boleh Kosong`),
                // check('nik')
                //     .not().isEmpty()
                //     .withMessage(`NIK Tidak Boleh Kosong`),
                // check('divisi')
                //     .not().isEmpty()
                //     .withMessage(`Divisi Tidak Boleh Kosong`),
                // check('id_mitra')
                //     .not().isEmpty()
                //     .withMessage(`ID Mitra Tidak Boleh Kosong`),
                // check('no_ktp')
                //     .not().isEmpty()
                //     .withMessage(`No KTP Tidak Boleh Kosong`),
                // check('no_sim')
                //     .not().isEmpty()
                //     .withMessage(`No SIM Tidak Boleh Kosong`),
                // check('vehicle_type')
                //     .not().isEmpty()
                //     .withMessage(`Tipe Kendaraan Tidak Boleh Kosong`),
                // check('jenis_sim')
                //     .not().isEmpty()
                //     .withMessage(`Jenis SIM Tidak Boleh Kosong`),
                // check('agama')
                //     .not().isEmpty()
                //     .withMessage(`Agama Tidak Boleh Kosong`),
                // check('tgl_lahir')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal Lahir Tidak Boleh Kosong`),
                // check('tgl_masuk')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal Masuk Tidak Boleh Kosong`),
                // check('tgl_sim')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal SIM Tidak Boleh Kosong`),
                // check('uk_seragam')
                //     .not().isEmpty()
                //     .withMessage(`Ukuran Seragam Tidak Boleh Kosong`),
                // check('jenis_kepemilikan')
                //     .not().isEmpty()
                //     .withMessage(`Jenis Kepemilikan Tidak Boleh Kosong`),
                // check('alamat')
                //     .not().isEmpty()
                //     .withMessage(`Alamat Tidak Boleh Kosong`),
                // check('notelp')
                //     .isLength({
                //         min: 8,
                //         // max: 15
                //     }).withMessage('Nomor Telephone Minimal 8 Karakter'),
                // check('email', 'Email Tidak Valid')
                //     .normalizeEmail()
                //     .isEmail()
                //     .custom(async email => {
                //         const value = await models.m_driver.findOne({
                //             where: {
                //                 email: email,
                //             }
                //         })
                //         if (value) {
                //             throw new SyntaxError('Email Yang Anda Masukkan Telah Di Gunakan');
                //         }
                //     }),
                // check('rekening_bank')
                //     .not().isEmpty()
                //     .withMessage(`Rekening Bank Tidak Boleh Kosong`),
                // check('rekening_norek')
                //     .not().isEmpty()
                //     .withMessage(`No Rekening Tidak Boleh Kosong`),
            ]
        }
        case 'update': {
            return [
                // check('nama')
                //     .not().isEmpty()
                //     .withMessage(`Nama Tidak Boleh Kosong`),
                // check('nik')
                //     .not().isEmpty()
                //     .withMessage(`NIK Tidak Boleh Kosong`),
                // check('divisi')
                //     .not().isEmpty()
                //     .withMessage(`Divisi Tidak Boleh Kosong`),
                // check('id_mitra')
                //     .not().isEmpty()
                //     .withMessage(`ID Mitra Tidak Boleh Kosong`),
                // check('no_ktp')
                //     .not().isEmpty()
                //     .withMessage(`No KTP Tidak Boleh Kosong`),
                // check('no_sim')
                //     .not().isEmpty()
                //     .withMessage(`No SIM Tidak Boleh Kosong`),
                // check('vehicle_type')
                //     .not().isEmpty()
                //     .withMessage(`Tipe Kendaraan Tidak Boleh Kosong`),
                // check('jenis_sim')
                //     .not().isEmpty()
                //     .withMessage(`Jenis SIM Tidak Boleh Kosong`),
                // check('agama')
                //     .not().isEmpty()
                //     .withMessage(`Agama Tidak Boleh Kosong`),
                // check('tgl_lahir')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal Lahir Tidak Boleh Kosong`),
                // check('tgl_masuk')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal Masuk Tidak Boleh Kosong`),
                // check('tgl_sim')
                //     .not().isEmpty()
                //     .withMessage(`Tanggal SIM Tidak Boleh Kosong`),
                // check('uk_seragam')
                //     .not().isEmpty()
                //     .withMessage(`Ukuran Seragam Tidak Boleh Kosong`),
                // check('jenis_kepemilikan')
                //     .not().isEmpty()
                //     .withMessage(`Jenis Kepemilikan Tidak Boleh Kosong`),
                // check('alamat')
                //     .not().isEmpty()
                //     .withMessage(`Alamat Tidak Boleh Kosong`),
                // check('notelp')
                //     .isLength({
                //         min: 8,
                //         // max: 15
                //     }).withMessage('Nomor Telephone Minimal 8 Karakter'),
                // check('email')
                //     .not().isEmpty()
                //     .withMessage(`Email Tidak Boleh Kosong`),
                // check('rekening_bank')
                //     .not().isEmpty()
                //     .withMessage(`Rekening Bank Tidak Boleh Kosong`),
                // check('rekening_norek')
                //     .not().isEmpty()
                //     .withMessage(`No Rekening Tidak Boleh Kosong`),
            ]
        }
        case 'upload-driver-photo': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Driver Tidak Boleh Kosong`),
            ]
        }

        case 'ready-driver': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Driver Tidak Boleh Kosong`),
            ]
        }
        case 'off-driver': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Driver Tidak Boleh Kosong`),
            ]
        }

        // ====================


    }
}