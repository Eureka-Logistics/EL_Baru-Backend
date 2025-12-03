const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const CryptoJS = core.CryptoJS

const nodemailer = require('nodemailer');

exports.getInformationoOps = async (req, res) => {
    try {

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getDate = core.moment(Date.now()).format('YYYY-MM-DD')


        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )
        if (getUser) {


            //-------------------------------------driver----------------------//
            const getDriverEureka = await models.m_driver.findAndCountAll(
                {
                    // limit:limit,
                    // offset:offset,
                    where: {
                        status: "1",
                        nama: { [Op.ne]: "" },
                        jenis_kepemilikan: "eureka"
                    }
                }
            )
            const getDriverSewa = await models.m_driver.findAndCountAll(
                {
                    // limit:limit,
                    // offset:offset,
                    where: {
                        status: "1",
                        nama: { [Op.ne]: "" },
                        jenis_kepemilikan: { [Op.ne]: "eureka" }
                    }
                }
            )
            const getDriverActiveDriver = await models.m_driver.findAndCountAll(
                {
                    // limit:limit,
                    // offset:offset,
                    where: {
                        status: "1",
                        nama: { [Op.ne]: "" }
                    }
                }
            )

            const getDriverOff = await models.m_driver.findAndCountAll(
                {
                    where: {
                        status: "0",
                        nama: { [Op.ne]: "" }

                    }
                }
            )
            const getDriverAll = await models.m_driver.findAndCountAll(
                {
                    where: { nama: { [Op.ne]: "" } }
                }
            )
            const getSimExpired = await models.m_driver.findAndCountAll(
                {
                    where: {
                        status: "1",
                        tgl_sim: { [Op.lt]: getDate }
                    }
                }
            )

            //-----------------------------------unit---------------------------------//

            const getUnitEureka = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        status: "1",
                        jenis_kepemilikan: "eureka"
                    }
                }
            )
            const getUnitSewa = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        status: "1",
                        jenis_kepemilikan: { [Op.ne]: "eureka" }
                    }
                }
            )
            const getKendaraanActive = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        status: "1",
                        // vendor: 'Eureka Logistics',

                    },

                }
            )
            const getKendaraanOff = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        status: "0",
                        // vendor: 'Eureka Logistics', 
                    }
                }
            )
            const getTotalKendaraan = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        // status: "0",
                        // vendor: 'Eureka Logistics', 
                    }
                }
            )
            const getExpireStnk = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        status: "1",
                        tgl_stnk: { [Op.lt]: getDate },
                    }
                }
            )
            const mostUnitUsed = await models.m_sm.findAndCountAll(
                {
                    where: {
                        kendaraan: 1
                    },
                    group: ['id_unit']
                }
            )

            //----------------------------pesanan-----------------------------------//

            const getPesanan = await models.m_sm.findAndCountAll(
                {
                    where: {
                        tgl_update: {
                            // [Op.like]: `%${req.query.keyword}%`
                            [Op.startsWith]: core.moment(Date.now()).format('YYYY')
                        },

                        [Op.or]: [
                            {
                                tgl_bongkar: { [Op.ne]: "0000-00-00" }
                            },
                            {
                                tgl_bongkar: "NULL"
                            }
                        ]




                    }
                }
            )





            if (getDriverActiveDriver && getDriverAll) {
                //     const result = {
                //         activeDriver: getDriverActiveDriver.count,
                //         totalDriver:getDriverAll.count
                //     }
                // }

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    operasional: [
                        {
                            driver: "==================================",
                            EurekaDriver: getDriverEureka.count,
                            SewaDriver: getDriverSewa.count,
                            activeDriver: getDriverActiveDriver.count,
                            offDriver: getDriverOff.count,
                            totalDriver: getDriverAll.count,
                            pesnaanSukses: getPesanan.count,
                            sim: {
                                SimExpired: getSimExpired.count,
                                driver: getSimExpired.rows.map((i) => {
                                    return {
                                        driverName: i.nama,
                                        simDate: i.tgl_sim
                                    }

                                })
                            },
                            kendaraan: "==================================",
                            eurekaUnit: getUnitEureka.count,
                            sewaUnit: getUnitSewa.count,
                            activeUnit: getKendaraanActive.count,
                            offUnit: getKendaraanOff.count,
                            totalUnit: getTotalKendaraan.count,
                            stnk: {
                                ExpireStnk: getExpireStnk.count,
                                noplat: getExpireStnk.rows.map((i) => {
                                    return {
                                        tglStnk: i.tgl_stnk,
                                        nopol: i.no_polisi,
                                        kendaraanKode: i.kode_kendaraan,

                                    }
                                })
                            },
                            kendaraanTerbanyakDigunakan: mostUnitUsed.rows.count


                        },

                    ]

                }
            }
        }




    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

exports.getInformationSales = async (req, res) => {
    try {
        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getPenjualan = await models.m_sm.findAndCountAll(

            )
        }
    } catch (error) {

    }
}

exports.getInformationMitra = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getMitra = await models.mitra.findAndCountAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getMitraUnit = await models.kendaraan.findAndCountAll(
                {
                    where: {
                        status: "1",
                        jenis_kepemilikan: { [Op.ne]: "eureka" }
                    }
                }
            )
            const getMitraDriver = await models.m_driver.findAndCountAll(
                {
                    where: {
                        status: "1",
                        jenis_kepemilikan: { [Op.ne]: "eureka" },
                        nama: { [Op.ne]: "" }
                    }
                }
            )
            if (getMitra && getMitraUnit) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    mitra: [
                        {

                            jumlahMitra: getMitra.count,
                            unitMitra: getMitraUnit.count,
                            driverMitra: getMitraDriver.count,
                            // activeDriver: getDriverActiveDriver.count,
                            // offDriver: getDriverOff.count,
                            // totalDriver: getDriverAll.count,
                            // pesnaanSukses: getPesanan.count,
                            // sim: {
                            //     SimExpired: getSimExpired.count,
                            //     driver: getSimExpired.rows.map((i) => {
                            //         return {
                            //             driverName: i.nama,
                            //             simDate: i.tgl_sim
                            //         }

                            //     })
                            // },


                        },

                    ]

                }
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        }
    }

    const errorsFromMiddleware = await customErrorMiddleware(req)

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

exports.getInformationAcounting = async (req, res) => {
    try {
        const tahunIni = new Date().getFullYear();
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_pengadaan.findAll(
                {
                    where: {
                        [Op.between]: [`${tahunIni}-01-01`, `${tahunIni}-12-31`],
                        status: 1

                    }
                }
            )
        }
    } catch (error) {

    }
}

exports.sendMail = async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: 'itdeveurekalogistics@gmail.com',
            pass: 'eureka123QaZ'
        },
        port: 587, // Port SMTP untuk Gmail dengan TLS
        // secure: false, // Atur ke false jika menggunakan TLS
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        }
    });

    const mailOptions = {
        from: 'itdeveurekalogistics@gmail.com',
        to: 'farhanyusuf19@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Email sent: ' + info.response);
    });

}

