const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const CryptoJS = core.CryptoJS


exports.getDriver = async (req, res) => {
    try {


        models.m_driver.hasMany(models.m_pengadaan_detail, { targetKey: 'id', foreignKey: 'id_supir' });
        // models.m_driver.hasMany(models.m_sm, { targetKey: 'nama', foreignKey: 'supir' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));



        const getDriv = await models.m_driver.findAndCountAll(
            {

                order: [['id', 'desc']],
                where: {
                    // status: 1,
                    nama: { [Op.ne]: "" },

                    ...req.query.keyword ? {
                        [Op.or]: [
                            {
                                nama: {
                                    [Op.like]: `%${req.query.keyword}%`
                                },

                            },
                            // {
                            //     authornama_author: {
                            //     [Op.like]: `%${req.query.keyword}%`
                            // }
                            // },

                        ]
                    } : {}
                },
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: models.m_pengadaan_detail,
                        require: false
                    },
                    // {
                    //     model: models.m_sm,
                    //     require: false
                    // },
                ]
            }
        )
        if (getDriv.rows) {
            let no = (getDriv.length > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
            const result = getDriv.rows.map((item) => {
                return {
                    no: no++,
                    driverId: item.id,
                    nik: item.nik == "" || null ? "-" : item.nik,
                    division: item.divisi == "" || null ? "-" : item.divisi,
                    driverReligion: item.agama == "" || null ? "-" : item.agama,
                    driverName: item.nama,
                    vehicle: item.vehicle_type == "" || item.vehicle_type == null ? "-" : item.vehicle_type,
                    driverEmail: item.email == "" || item.email == null ? "-" : item.email,
                    driverKtp: item.no_ktp == "" || item.no_ktp == null ? "-" : item.no_ktp,
                    simType: item.jenis_sim == "" || item.jenis_sim == null ? "-" : item.jenis_sim,
                    numberSim: item.no_sim == "" || item.no_sim == null ? "-" : item.no_sim,
                    noTelp1: item.no_telp == "" || item.no_telp == null ? "-" : item.no_telp,
                    noTelp2: item.no_telp2 == "" || item.no_telp2 == null ? "-" : item.no_telp2,
                    dateIn: item.tgl_masuk == "" || item.tgl_masuk == null ? "-" : item.tgl_masuk,
                    dateBirth: item.tgl_lahir == "" || item.tgl_lahir == null ? "-" : item.tgl_lahir,
                    driverAddress: item.alamat == "" || item.alamat == null ? "-" : item.alamat,
                    driverImage: item.foto == null || item.foto == "" ? "https://sandbox.eurekalogistics.co.id/public/assets/no-pictures.png" : item.foto,
                    driverStatus: item.status,
                    totalPenjualan: core.rupiah(core.sumArray(item.m_pengadaan_details.map((i) => i.harga))),
                    // kiriman: item.m_sm
                    // Kiriman: item


                }
            })
            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: {
                    totalData: getDriv.count,
                    totalPage: Math.ceil(getDriv.count / req.query.limit),
                    limit: Number(req.query.limit),
                    currentPage: Number(req.query.page),
                    order: result

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
exports.getDetailDriver = async (req, res) => {
    try {
        const getDriv = await models.m_driver.findOne(
            {
                where: {
                    id: req.query.id,

                },

            }
        )
        if (getDriv) {

            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: getDriv
                // data: getDriv.map((item) => {
                //     return {
                //         // no: no++,
                //         driverId: item.id,
                //         nik: item.nik == "" || null ? "-" : item.nik,
                //         division: item.divisi == "" || null ? "-" : item.divisi,
                //         driverReligion: item.agama == "" || null ? "-" : item.agama,
                //         driverName: item.nama,
                //         vehicle: item.vehicle_type == "" || item.vehicle_type == null ? "-" : item.vehicle_type,
                //         driverEmail: item.email == "" || item.email == null ? "-" : item.email,
                //         driverKtp: item.no_ktp == "" || item.no_ktp == null ? "-" : item.no_ktp,
                //         simType: item.jenis_sim == "" || item.jenis_sim == null ? "-" : item.jenis_sim,
                //         numberSim: item.no_sim == "" || item.no_sim == null ? "-" : item.no_sim,
                //         noTelp1: item.no_telp == "" || item.no_telp == null ? "-" : item.no_telp,
                //         noTelp2: item.no_telp2 == "" || item.no_telp2 == null ? "-" : item.no_telp2,
                //         dateIn: item.tgl_masuk == "" || item.tgl_masuk == null ? "-" : item.tgl_masuk,
                //         dateBirth: item.tgl_lahir == "" || item.tgl_lahir == null ? "-" : item.tgl_lahir,
                //         driverAddress: item.alamat == "" || item.alamat == null ? "-" : item.alamat,
                //         driverImage: item.foto,



                //     }
                // })

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

exports.getSelect = async (req, res) => {
    try {

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_vehicle.findAll(
                {
                    order: [['id_vehicle', 'desc']],
                    where: {
                        status: "1"
                    },
                    group: ['jenis_kendaraan']

                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getData.map((i) => {
                        return {
                            tipe: i.jenis_kendaraan
                        }
                    })
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

exports.createDriver = async (req, res) => {
    try {
        const errorsFromMiddleware = await customErrorMiddleware(req)
        if (!errorsFromMiddleware) {
            const getUser = await models.users.findOne(
                {
                    where: {
                        id: req.user.id,

                    }
                }
            )
            if (getUser) {
                const getdriver = await models.m_driver.findOne(
                    {
                        where: {
                            nama: req.body.nama,
                            divisi: req.body.divisi,
                            nik: req.body.nik,
                            status: 1

                        }
                    }
                )
                if (!getdriver) {
                    const addDriver = await models.m_driver.create(
                        {
                            // 'id_karyawan': req.body.id_karyawan,
                            'nik': req.body.nik,
                            'divisi': req.body.divisi,
                            'nama': req.body.nama,
                            'no_ktp': req.body.no_ktp,
                            'no_sim': req.body.no_sim,
                            'vehicle_type': req.body.vehicle_type,
                            'jenis_sim': req.body.jenis_sim,
                            'alamat': req.body.alamat,
                            'tgl_lahir': core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                            'agama': req.body.agama,
                            'no_telp': req.body.notelp,
                            'no_telp2': req.body.notelp2,
                            'email': req.body.email,
                            'password': CryptoJS.MD5(123456).toString(),
                            // 'foto': req.file.cover,
                            'foto': "",
                            'tgl_masuk': core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                            'status': 1,
                            'ritase': 0,
                            'point': 0,
                            'deposit': 0,
                            'wilayah': "",
                            'tgl_update': "",
                            'foto_ktp': "",
                            'foto_stnk': "",
                            'foto_ijasah': "",
                            'foto_kk': "",
                            'jaminan': "",
                            'foto_jaminan': ""

                        }
                    )
                    if (addDriver) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Berhasil Menambahkan Driver Baru'
                            },
                        }

                    }
                    else {
                        output = {
                            status: {
                                code: 402,
                                message: 'Gagal menambahkan Driver'
                            },
                        }

                    }
                }
                else {
                    output = {
                        status: {
                            code: 502,
                            message: 'Driver sudah ada, pastikan Nik, Nama, dan divisi sudah benar'
                        },
                    }

                }


            }

        }

    }
    catch (error) {
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

exports.updateDriver = async (req, res) => {
    try {

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const change = models.m_driver.update(
                {
                    nik: req.body.nik,
                    divisi: req.body.divisi,
                    nama: req.body.nama,
                    no_ktp: req.body.no_ktp,
                    no_sim: req.body.no_sim,
                    vehicle_type: req.body.vehicle_type,
                    jenis_sim: req.body.jenis_sim,
                    alamat: req.body.alamat,
                    tgl_lahir: core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                    agama: req.body.agama,
                    no_telp: req.body.notelp,
                    no_telp2: req.body.notelp2,
                    email: req.body.email,
                    // 'password': CryptoJS.MD5(123456).toString(),
                    // 'foto':req.body.foto,
                    tgl_masuk: core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),

                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (change) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Mengubah Data Driver'
                    },
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'Gagal Mengubah Data Driver'
                    },
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

exports.statusOff = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.m_driver.update(
                {
                    status: 0
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Menhapus Driver'
                    },
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'Gagal Menghapus Driver'
                    },
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
exports.statusReady = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.m_driver.update(
                {
                    status: 1
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Driver Ready'
                    },
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'Gagal Menghapus Driver'
                    },
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

