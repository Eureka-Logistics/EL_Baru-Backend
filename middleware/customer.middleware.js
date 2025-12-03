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
    }
}