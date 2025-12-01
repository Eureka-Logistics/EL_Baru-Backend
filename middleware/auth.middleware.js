const core = require('../config/core.config')
const models = core.models()
const { check } = require('express-validator')
const db = require('../config/db.config')

const CryptoJS = core.CryptoJS


exports.validate = (method) => {

    switch (method) {
        case 'login': {
            return [
                check('username', 'Email Tidak Valid')
                    .not().isEmpty()
                    .withMessage(`username tidak boleh kosong`),

                check('password')
                    .not().isEmpty()
                    .withMessage(`Password Tidak Boleh Kosong`)
                    .custom(async (pass, { req }) => {
                        const { username, password } = req.body
                        let query = await db.query(`SELECT * FROM users WHERE LOWER(username) = '${username}'  AND password = MD5('${password}') AND perusahaan = 'LOG'`)
                        const validate = Boolean(query.length)
                        if (!validate) {
                            throw new SyntaxError('Email Atau Password Salah atau Akun Tidak Terdaftar di Perusahaan EUREKA LOGISTICS')
                        }
                        return true;
                    }),
            ]
        }
        case 'loginDriver': {
            return [
                check('username', 'Email Tidak Valid').not().isEmpty().withMessage(`username tidak boleh kosong`),
                check('password').not().isEmpty().withMessage(`Password Tidak Boleh Kosong`)
                .custom(async (pass, { req }) => {
                        const { username, password } = req.body

                        let query = await db.query(`SELECT * FROM m_driver WHERE  no_telp = '${username}'  AND password = MD5('${password}')`)


                        const validate = Boolean(query.length) 

                        if (!validate) {
                            throw new SyntaxError(`Email Atau Password Salah ${username} - ${password}`)
                        } 
                    }),
            ]
        }

        case 'forgotPassword': {
            return [
                check('email')
                    .not().isEmpty()
                    .withMessage(`Email Tidak Boleh Kosong`),
            ]
        }

        case 'register': {
            return [
                check('name')
                    .not().isEmpty()
                    .withMessage(`Name can't be empty`),
                check('email', 'Email Tidak Valid')
                    .normalizeEmail()
                    .isEmail()
                    .custom(async email => {
                        const value = await models.tbl_customer.findOne({
                            where: {
                                email: email,
                            }
                        })
                        if (value) {
                            throw new SyntaxError('Email Yang Anda Masukkan Telah Di Gunakan');
                        }
                    }),
                check('phone_number')
                    .not().isEmpty()
                    .withMessage(`No Telepon Tidak Boleh Kosong`),
                check('password')
                    .not().isEmpty()
                    .withMessage(`Password Tidak Boleh Kosong`),
                //  check('firstAddress')
                // .not().isEmpty()
                //     .withMessage(`firstAddress can't be empty`),
                //  check('lastAddress')
                // .not().isEmpty()
                //     .withMessage(`lastAddress can't be empty`),
                // check('city')
                // .not().isEmpty()
                //     .withMessage(`city can't be empty`),
                // check('postCode')
                // .not().isEmpty()
                //     .withMessage(`postCode can't be empty`),
                // check('countryId')
                // .not().isEmpty()
                //     .withMessage(`countryId can't be empty`),
                //  check('province')
                // .not().isEmpty()
                //     .withMessage(`province can't be empty`),
                //  check('zone1')
                // .not().isEmpty()
                //     .withMessage(`zone1 can't be empty`),
                //  check('zone2')
                // .not().isEmpty()
                //     .withMessage(`zone2 can't be empty`),
                //  check('lat')
                // .not().isEmpty()
                //     .withMessage(`lat can't be empty`),
                //  check('long')
                // .not().isEmpty()
                //     .withMessage(`long can't be empty`),
                // check('groupId').if((value, { req }) => req.body.referralCode).not().isEmpty()
                //     .withMessage(`Group Tidak Boleh Kosong`),

                // check('npwp')
                // .not().isEmpty()
                //     .withMessage(`npwp can't be empty`),
                // check('instanceName')
                // .not().isEmpty()
                //     .withMessage(`instanceName can't be empty`),
                // check('level')
                // .not().isEmpty()
                //     .withMessage(`level can't be empty`),

            ]
        }

        case 'registerPerpustakaan': {
            return [
                check('name')
                    .not().isEmpty()
                    .withMessage(`Nama Perpustakaan Tidak Boleh Kosong`),
                check('picName')
                    .not().isEmpty()
                    .withMessage(`Nama PIC Tidak Boleh Kosong`),
                check('nip')
                    .not().isEmpty()
                    .withMessage(`NIP PIC Tidak Boleh Kosong`),
                check('level')
                    .not().isEmpty()
                    .withMessage(`Jenjang Perpustakaan Tidak Boleh Kosong`),
                check('phone')
                    .not().isEmpty()
                    .withMessage(`No Telepon PIC Tidak Boleh Kosong`),
            ]
        }
        case 'RegisterPenertbit': {
            return [
                check('username')
                    .isLength({
                        min: 7,
                        max: 20,
                    }).withMessage('username Minimal 7 Karakter'),
                check('password')
                    .isLength({
                        min: 8,
                    }).withMessage('password Minimal 8 Karakter'),
                check('email', 'Email Tidak Valid')
                    .normalizeEmail()
                    .isEmail()
                    .custom(async email => {
                        const value = await models.elib_penerbit.findOne({
                            where: {
                                email: email,
                            }
                        })
                        if (value) {
                            throw new SyntaxError('Email Yang Anda Masukkan Telah Di Gunakan');
                        }
                    }),
                check('phone')
                    .isLength({
                        min: 8,
                        max: 15
                    }).withMessage('Nomor Telephone Minimal 8 Karakter'),
            ]
        }

        case 'checkReferralCode': {
            return [
                check('referralCode')
                    .not().isEmpty()
                    .withMessage(`Kode Refferal Tidak Boleh Kosong`),
            ]
        }

        case 'goLibrary': {
            return [

                check('referralCode')
                    .not().isEmpty()
                    .withMessage(`referralCode can't be empty`),
                check('email', 'Invalid email')
                    .normalizeEmail()
                    .isEmail()
                    .custom(async email => {
                        const value = await models.elib_user.findOne({
                            where: {
                                email: email,
                            }
                        })
                        if (value) {
                            throw new SyntaxError('Email has already been taken.');
                        }
                    }),
                check('groupId')
                    .not().isEmpty()
                    .withMessage(`groupId can't be empty`),

            ]
        }

        // case 'registerUser': {
        //     return [
        //         check('nis')
        //         .not().isEmpty()
        //             .withMessage(`nis can't be empty`),
        //         check('customerId')
        //         .not().isEmpty()
        //             .withMessage(`customerId can't be empty`),
        //         check('username')
        //         .isLength({
        //             min: 5,
        //             max: 100
        //         }).withMessage('Username must be at least 5 chars long'),
        //         check('password')
        //         .not().isEmpty()
        //             .withMessage(`password can't be empty`),
        //         check('email', 'Invalid email')
        //         .normalizeEmail()
        //         .isEmail()
        //         .custom(async email => {
        //             const value = await models.elib_user.findOne({
        //                 where: {
        //                     email: email,
        //                 }   
        //             })
        //             if (value) {
        //                 throw new SyntaxError('Email has already been taken.');
        //             }
        //         }),
        //         check('phone')
        //         .not().isEmpty()
        //             .withMessage(`phone can't be empty`),
        //         check('groupId')
        //         .not().isEmpty()
        //             .withMessage(`groupId can't be empty`),
        //         check('role')
        //         .not().isEmpty()
        //             .withMessage(`role can't be empty`),

        //     ]
        // }

    }
}