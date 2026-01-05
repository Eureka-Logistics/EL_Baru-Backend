const { off } = require('process');
const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');
const CryptoJS = core.CryptoJS

const sanitizeInput = (input) => {
    // Hanya izinkan huruf, angka, titik, underscore, dan strip
    const regex = /^[a-zA-Z0-9@._-]+$/;
    return regex.test(input);
};

exports.login = async (req, res) => {
    const errorsFromMiddleware = await customErrorMiddleware(req);
    try {
        const { username, password } = req.body;

        if (!sanitizeInput(username) || !sanitizeInput(password)) {
            return res.status(400).send({
                status: {
                    code: 400,
                    message: "Invalid characters in username or password.",
                },
            });
        }

        if (!errorsFromMiddleware) {
            const user = await models.users.findOne({
                where: {
                    username: username,
                    // perusahaan: 'LOG'
                }
            });

            if (user) {
                const payload = {
                    id: user.id,
                    username: user.username,
                    fullname: user.nama_lengkap,
                    level: user.level,
                    divisi: user.divisi,
                    id_bu: user.id_bu,
                    id_bu_branch: user.id_bu_brench
                };

                const token = core.jwt.sign(payload, core.env.TOKEN_KEY, { expiresIn: "1d" });

                output = {
                    status: {
                        code: 200,
                        message: 'Login success'
                    },
                    data: {
                        token: 'Bearer ' + token,
                        username: user.username,
                        fullname: user.nama_lengkap,
                        jobdesk: user.divisi,
                        cabang: user.kode_cabang,
                        level: user.level,
                        divisi: user.divisi
                    }
                };
            } else {
                output = {
                    status: {
                        code: 401,
                        message: 'Invalid username or password'
                    }
                };
            }
        }

    } catch (error) {
        console.error("Login Error:", error);
        output = {
            status: {
                code: 500,
                message: error.message
            }
        };
    }

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
};

exports.loginDriver = async (req, res) => {

    const errorsFromMiddleware = await customErrorMiddleware(req)
    try {
        // const errorsFromMiddleware = await customErrorMiddleware(req)
        const { username, password } = req.body;

        if (!sanitizeInput(username) || !sanitizeInput(password)) {
            return res.status(400).send({
                status: 400,
                success: 0,
                message: "Invalid characters in username or password.",
            });
        }

        if (!errorsFromMiddleware) {
            const user = await models.m_driver.findOne(
                {
                    where: {
                        no_telp: req.body.username,
                        password: CryptoJS.MD5(req.body.password).toString()
                    }
                }
            )

            if (user) {
                let payload = {
                    id: user.id,
                    username: user.no_telp,
                    fullname: user.nama,
                    jobdesk: user.nik
                };
                const getKendaraan = await models.kendaraan.findOne(
                    {
                        where: {
                            id_driver: user.id
                        }
                    }
                )
                const token = core.jwt.sign(payload, core.env.TOKEN_KEY, { expiresIn: "1d", })
                if (token) {
                    output = {
                        status: 200,
                        message: 'success login',
                        success: 1,

                        token: 'Bearer ' + token,
                        id_kurir: user.id,
                        id_admin: user.id,
                        jenisKepemilikan: user.jenis_kepemilikan,
                        // divisi: user.divisi,
                        nopol: getKendaraan == null ? "-" : getKendaraan.no_polisi,
                        kodeKendaraan: getKendaraan == null ? "-" : getKendaraan.kode_kendaraan,
                        kendaraanId: getKendaraan == null ? "-" : getKendaraan.id,
                        username: user.nama,
                        nama: user.nama,
                        kode_kurir: user.nik,
                        foto: user.foto,
                        telepon: user.no_telp,
                        // divisi: 'OPERASIONAL',
                        id_origin: "1",
                        ktp_id: user.no_ktp,
                        sim_id: user.no_sim,
                        sim_type: user.jenis_sim,
                        vehicle_type: user.vehicle_type,
                        address: user.alamat,
                        tgl_lahir: user.tgl_lahir,
                        agama: user.agama,
                        ritase: "'" + user.ritase + "'",
                        point: "'" + user.point + "'",
                        deposit: "'" + user.deposit + "'",
                        wilayah: user.wilayah


                        // result:result


                    }
                }
                else {
                    output = {
                        status: 400,
                        message: "Driver belom ada kendaraan"

                    }
                }
            }
            else {
                output = {
                    status: 400,
                    success: 0,
                    message: "no telp Atau Password tidak valid"

                }
            }
        }



    } catch (error) {
        output = {
            status: 500,
            success: 0,
            message: error.message

        }
    }


    if (!errorsFromMiddleware) {
        res.status(output.status).send(output)
    } else {
        res.status(errorsFromMiddleware.status).send(errorsFromMiddleware)
    }
}
exports.getProfile = async (req, res) => {
    try {


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id,

                }
            }
        )
        if (getUser) {
            output = {
                status: {
                    code: 200,
                    message: 'success get data'
                },
                data: getUser
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

exports.creteUser = async (req, res) => {
    try {


        const getDataUser = await models.users.findOne(
            {
                where: {
                    email: req.body.email
                }
            }
        )
        let CUST_ID;
        if (!getDataUser) {
            const creeteData = await models.users.create(

                {
                    id_karyawan: req.body.id_karyawan,
                    proposal: 0,
                    username: req.body.username,
                    nama_lengkap: req.body.nama_lengkap,
                    als: "",
                    email: req.body.email,
                    foto: "",
                    no_telp: req.body.no_telp,
                    password: core.encryptPasswordWithMD5(req.body.password),
                    id_cabang: 1,
                    perusahaan: req.body.perusahaan,
                    kode_cabang: req.body.kode_cabang,
                    id_bu: req.body.id_bu,
                    id_bu_brench: req.body.id_bu_brench,
                    level: req.body.level,
                    divisi: req.body.divisi,
                    user_level: req.body.user_level,
                    user_group: 1,
                    aktif: "Y",
                    id_session: "90enu9u52k8i7tjmpc9qcucdp5",
                    tgl_login: Date.now(),
                    status: 1,
                    lat: -6.3120817,
                    lon: 106.8690028,
                    koordinator: 0

                }
            )
            if (creeteData) {

                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil mendaftarkan User'
                    },
                }

            }
        }
        else {
            output = {
                status: {
                    code: 402,
                    message: 'email sudah terdaftar'
                },
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

exports.getUser = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.users.findAndCountAll(
                {
                    where: {
                        status: 1,

                    },
                    limit: limit,
                    offset: offset,
                    order: [['id', 'desc']]
                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        username: item.username,
                        nama_lengkap: item.nama_lengkap,
                        email: item.email,
                        no_telp: item.no_telp,
                        id_cabang: item.id_cabang,
                        perusahaan: item.perusahaan,
                        kode_cabang: item.kode_cabang,
                        id_bu: item.id_bu,
                        id_bu_brench: item.id_bu_brench,
                        level: item.level,
                        divisi: item.divisi,
                        user_level: item.user_level,
                        user_group: item.user_group,

                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getData.count,
                        totalPage: Math.ceil(getData.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: result


                    }

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
            const getBu = await models.m_bu.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getBuBrench = await models.m_bu_brench.findAll(
                {
                    ...req.query.id_bu ? {
                        where: {
                            id_bu: req.query.id_bu,
                            status: 1
                        }
                    } : {}
                }
            )
            const getDivisi = await models.users.findAll(
                {
                    order: [['id', 'desc']],
                    group: [['divisi']]
                }
            )
            const getUserLevel = await models.userslevel.findAll({})
            const getUserGroup = await models.users_group.findAll({})
            const getKaryawan = await models.m_bu_employee.findAll(
                {
                    ...req.query.id_bu && req.query.id_bu_brench ? {
                        where: {
                            id_bu: req.query.id_bu,
                            id_bu_brench: req.query.id_bu_brench,
                            status: 1,
                            ...req.query.keyword ? {
                                [Op.or]: [
                                    {
                                        fullname: {
                                            [Op.like]: `%${req.query.keyword}%`
                                        },
                                    },

                                ]
                            } : {}
                        }
                    } : {}

                }
            )
            if (getBu && getBuBrench) {
                output = {
                    status: {
                        code: 200,
                        message: "succes get data"
                    },

                    BU: getBu,
                    bubrench: req.query.id_bu ? getBuBrench : {},
                    karyawan: req.query.id_bu && req.query.id_bu_brench ? getKaryawan.map((i) => {
                        return {
                            idKaryawan: i.id_employee,
                            nik: i.code_employee,
                            nama: i.fullname,

                        }
                    }) : {},
                    divisi: getDivisi.map((i) => {
                        return {
                            divisi: i.divisi
                        }
                    }).filter(i => i.divisi != "2" && i.divisi != "haerde"),
                    userLevel: getUserLevel,
                    userGroup: getUserGroup,


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

exports.configDb = async (req, res) => {
    try {
        const getSession = await models.config.findOne(
            {
                order: [['id_config', 'desc']]
            }
        )
        if (getSession) {
            output = {
                status: {
                    code: 200,
                    message: 'succes getData'
                },
                env: getSession.name,
                value: getSession.value
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

