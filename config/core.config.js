require('dotenv').config()
const core = {};

const nodemailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport')
const ejs = require('ejs');

core.uuid = require('uuid');

if (process.env.NODE_ENV === "development") {

    core.baseUrl = 'http://localhost:2023'
}

if (process.env.NODE_ENV === "production") {
    core.baseUrl = 'https://api.elogs.id'
}

core.env = process.env
const CryptoJS = require("crypto-js")
core.CryptoJS = CryptoJS

core.jwt = require('jsonwebtoken')

core.getPagination = (limit, querypage) => {
    // Set default limit jika tidak ada atau 0
    const defaultLimit = 10;
    const actualLimit = limit || defaultLimit;
    
    let offset = actualLimit * (querypage == 0 || !querypage ? 0 : querypage - 1)
    limit = !querypage ? null : actualLimit
    offset = !querypage ? null : offset

    return { limit, offset };
}

const crypto = require('crypto');


core.encryptPasswordWithMD5 = (password) => {
    const md5Hash = crypto.createHash('md5').update(password).digest('hex');
    return md5Hash;
}

core.mailingElogs = (params) => {
    if (params) {

        let senderMail = "itdeveurekalogistics@gmail.com";
        let senderPass = "eureka123QaZ";

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            // port: 587,
            auth: {
                user: senderMail,
                pass: senderPass,
            }
        });

        return new Promise((resolve, reject) => {
            ejs.renderFile(`${process.cwd()}${params.urlView}`, params.dataView, function (err, data) {
                if (err) {
                    // Tangani kesalahan dengan mengembalikan pesan kesalahan
                    reject(err);
                } else {
                    const mailOptions = {
                        from: senderMail,
                        to: params.to,
                        subject: params.subject,
                        html: data
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            // Tangani kesalahan pengiriman email
                            reject(error);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
};




core.encryptPasswordV1 = (password = null, salt = null) => {
    return CryptoJS.SHA1(salt + CryptoJS.SHA1(salt + CryptoJS.SHA1(password))).toString()
}

core.dbConnect = () => {
    const dbConfig = require("./db.config");
    const Sequelize = require("sequelize");

    return new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,
        quoteIdentifiers: false,
        define: {
            timestamps: false,
            underscored: true,
            paranoid: false,
        },
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
        timezone: '+07:00',
        logging: true
    });
}

core.userAgent = require('express-useragent')

core.models = () => {
    const initModels = require("../models/init-models");
    const models = initModels(core.dbConnect());

    return models;
}

core.sumArray = (input) => {
    if (toString.call(input) !== "[object Array]") {
        return false;
    }

    var total = 0;
    for (var i = 0; i < input.length; i++) {
        if (isNaN(input[i])) {
            continue;
        }
        total += Number(input[i]);
    }
    return total;
}

core.rupiah = (number) => {
    var reverse = number.toString().split("").reverse().join(""),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join(".").split("").reverse().join("");
    return "Rp " + ribuan;
}

core.multer = require('multer')
core.moment = require('moment')

module.exports = core;