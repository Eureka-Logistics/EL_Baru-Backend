const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE, fn, literal } = require('sequelize');
const CryptoJS = core.CryptoJS
const axios = require('axios');




exports.filterDriv = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getMitra = await models.mitra.findAll(
                {
                    order: [['id_mitra', 'desc']]
                }
            )
            output = {
                status: {
                    code: 200,
                    message: 'Success Get Data'
                },
                mitra: getMitra.map((i) => {
                    return {
                        id: i.id_mitra,
                        namaMitra: i.nama_mitra
                    }
                }),
                filterStatus: [
                    {
                        "value": 0,
                        "status": "Aktif"
                    },
                    {
                        "value": 1,
                        "status": "Tidak Aktif"
                    },
                ],
                filterKepemilikan: [
                    {
                        jenis: "eureka"
                    },
                    {
                        jenis: "eur_sewa"
                    },
                    {
                        jenis: "eur_oncall"
                    },
                    {
                        jenis: "race"
                    },
                    {
                        jenis: "rcn_sewa"
                    },
                    {
                        jenis: "rcn_oncall"
                    },
                ]
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
        const getUser = await models.users.findOne({
            where: {
                id: req.user.id
            }
        });

        if (getUser) {
            const getJenisKepemilikan = getUser.id_bu === '11' ? '1' : getUser.id_bu === '21' ? '1' : '2';

            const getMitra = await models.mitra.findAll({
                where: {
                    status: 1
                }
            });

            const getTipe = await models.kendaraan_jenis.findAll({
                order: [['id_kendaraan_jenis', 'desc']],
                where: {
                    status: "1"
                }
            });

            const getCodeDriver = await models.m_driver.findAll({
                order: [['id', 'desc']],
                limit: 1,
                where: {
                    kode_driver: {
                        [Op.like]: `%D${getJenisKepemilikan}%`
                    },
                }
            });

            // Jika getCodeDriver ada, kita lanjutkan. Jika kosong atau kode_driver null, pakai nilai default
            let DriverCode = 'D' + getJenisKepemilikan + '00000'; // Default jika kode_driver tidak ditemukan atau null

            if (getCodeDriver.length > 0 && getCodeDriver[0].kode_driver) {
                const getCode = Number(getCodeDriver[0].kode_driver.substring(6, 8));
                const codeUrut = getCode + 1;

                const getcharacterNumber = codeUrut.toString();

                let zeroCode;
                if (getcharacterNumber.length == 1) {
                    zeroCode = "0000";
                } else if (getcharacterNumber.length == 2) {
                    zeroCode = "000";
                } else if (getcharacterNumber.length == 3) {
                    zeroCode = "00";
                } else if (getcharacterNumber.length == 4) {
                    zeroCode = "0";
                } else if (getcharacterNumber.length == 5) {
                    zeroCode = "";
                }

                DriverCode = "D" + getJenisKepemilikan + zeroCode + codeUrut;
            }

            if (getTipe) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success Get Data'
                    },
                    DriverCode: DriverCode,  // DriverCode yang sudah diperbaiki
                    tipe: getTipe.map((i) => {
                        return {
                            tipe: i.nama_kendaraan_jenis
                        };
                    }),
                    mitra: getMitra.map((i) => {
                        return {
                            idMitra: i.id_mitra,
                            namaMitra: i.nama_mitra
                        };
                    }),
                    jenisKepemilikan: [
                        { "jenis": "eureka" },
                        { "jenis": "eur_sewa" },
                        { "jenis": "eur_oncall" },
                        { "jenis": "race" },
                        { "jenis": "rcn_sewa" },
                        { "jenis": "rcn_oncall" },
                    ],
                    ukuranSeragam: [
                        { "ukuran": "S" },
                        { "ukuran": "M" },
                        { "ukuran": "L" },
                        { "ukuran": "XL" },
                        { "ukuran": "XXL" },
                        { "ukuran": "XXXL" },
                        { "ukuran": "4XL" },
                    ],
                };
            }
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message
            }
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
};



exports.getDriver = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getDriv = await models.m_driver.findAndCountAll(
            {

                order: [['id', 'desc']],
                where: {
                    nama: { [Op.ne]: "" },
                    ...req.query.jenis_kepemilikan ? {
                        jenis_kepemilikan: req.query.jenis_kepemilikan
                    } : {},
                    ...req.query.status ? {
                        status: req.query.status
                    } : {},
                    ...req.query.id_mitra ? {
                        id_mitra: req.query.id_mitra
                    } : {},

                    ...req.query.keyword ? {
                        [Op.or]: [
                            {
                                nama: {
                                    [Op.like]: `%${req.query.keyword}%`
                                },
                            },
                        ]
                    } : {}
                },
                limit: limit,
                offset: offset,
                include: [
                ]
            }
        )


        if (getDriv.rows) {
            let no = (getDriv.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0

            const result = getDriv.rows.map((item) => {
                return {
                    no: no++,
                    driverId: item.id,
                    driverCode: item.kode_driver,
                    nik: item.nik == "" || null ? "-" : item.nik,
                    division: item.divisi == "" || null ? "-" : item.divisi,
                    driverReligion: item.agama == "" || null ? "-" : item.agama,
                    driverName: item.nama,
                    jenisKepemilikan: item.jenis_kepemilikan,
                    vehicle: item.vehicle_type == "" || item.vehicle_type == null ? "-" : item.vehicle_type,
                    driverEmail: item.email == "" || item.email == null ? "-" : item.email,
                    driverKtp: item.no_ktp == "" || item.no_ktp == null ? "-" : item.no_ktp,
                    simType: item.jenis_sim == "" || item.jenis_sim == null ? "-" : item.jenis_sim,
                    tglSim: item.tgl_sim == "" || item.tgl_sim == null ? "-" : item.tgl_sim,
                    numberSim: item.no_sim == "" || item.no_sim == null ? "-" : item.no_sim,
                    sim: item.no_sim == "" || item.no_sim == null ? "-" : item.no_sim,
                    noTelp1: item.no_telp == "" || item.no_telp == null ? "-" : item.no_telp,
                    noTelp2: item.no_telp2 == "" || item.no_telp2 == null ? "-" : item.no_telp2,
                    dateIn: item.tgl_masuk == "" || item.tgl_masuk == null ? "-" : item.tgl_masuk,
                    dateBirth: item.tgl_lahir == "" || item.tgl_lahir == null ? "-" : item.tgl_lahir,
                    driverAddress: item.alamat == "" || item.alamat == null ? "-" : item.alamat,
                    driverImage: item.foto == null || item.foto == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/Driver/" + item.foto,
                    simImage: item.foto_sim == null || item.foto_sim == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/Driver/" + item.foto_sim,
                    driverStatus: item.status,
                    bankRekening: item.rekening_bank,
                    norek: item.rekening_norek,
                    ukuran_seragam: item.uk_seragam,
                    point: item.total_point == null ? 0 : item.total_point

                }
            })
            output = {
                status: {
                    code: 200,
                    message: 'Success Get Data'
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
        models.m_driver.hasMany(models.m_pengadaan_detail, { targetKey: 'id', foreignKey: 'id_supir' });
        models.m_driver.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });

        const getDriv = await models.m_driver.findAll(
            {
                where: {
                    id: req.query.id,
                },
                include: [
                    {
                        model: models.m_pengadaan_detail,
                        require: false
                    },
                    {
                        model: models.mitra,
                        require: false
                    },
                ]
            }
        )
        if (getDriv) {
            output = {
                status: {
                    code: 200,
                    message: 'Success Get Data'
                },
                data: getDriv.map((item) => {
                    return {
                        driverId: item.id,
                        driverCode: item.kode_driver,
                        driverCode: item.kode_driver,
                        nik: item.nik == "" || null ? "-" : item.nik,
                        division: item.divisi == "" || null ? "-" : item.divisi,
                        driverReligion: item.agama == "" || null ? "-" : item.agama,
                        driverName: item.nama,
                        mitraId: item.id_mitra,
                        mitra: item.mitra == null ? "" : item.mitra.nama_mitra,
                        jenisKepemilikan: item.jenis_kepemilikan,
                        vehicle: item.vehicle_type == "" || item.vehicle_type == null ? "-" : item.vehicle_type,
                        driverEmail: item.email == "" || item.email == null ? "-" : item.email,
                        driverKtp: item.no_ktp == "" || item.no_ktp == null ? "-" : item.no_ktp,
                        simType: item.jenis_sim == "" || item.jenis_sim == null ? "-" : item.jenis_sim,
                        simDate: item.tgl_sim == "" || item.tgl_sim == null ? "-" : item.tgl_sim,
                        numberSim: item.no_sim == "" || item.no_sim == null ? "-" : item.no_sim,
                        noTelp1: item.no_telp == "" || item.no_telp == null ? "-" : item.no_telp,
                        noTelp2: item.no_telp2 == "" || item.no_telp2 == null ? "-" : item.no_telp2,
                        dateIn: item.tgl_masuk == "" || item.tgl_masuk == null ? "-" : item.tgl_masuk,
                        dateBirth: item.tgl_lahir == "" || item.tgl_lahir == null ? "-" : item.tgl_lahir,
                        driverAddress: item.alamat == "" || item.alamat == null ? "-" : item.alamat,
                        BankRekening: item.rekening_bank == "" || item.rekening_bank == null ? "-" : item.rekening_bank,
                        Norek: item.rekening_norek == "" || item.rekening_norek == null ? "-" : item.rekening_norek,
                        ukuranSeragam: item.uk_seragam == "" || item.uk_seragam == null ? "-" : item.uk_seragam,
                        driverImage: item.foto == null || item.foto == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/Driver/" + item.foto,
                        simImage: item.foto_sim == null || item.foto_sim == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/Driver/" + item.foto_sim,
                        driverStatus: item.status,
                        totalPenjualan: core.rupiah(core.sumArray(item.m_pengadaan_details.map((i) => i.harga))),
                        point: item.total_point == null ? 0 : item.total_point
                    }
                })
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
                    if (!req.files || !req.files.cover) {
                        const getIDBu = getUser.id_bu === 11 ? 1 : getUser.id_bu === 21 ? 1 : 2;

                        const getCodeDriver = await models.m_driver.findAll(
                            {
                                order: [['id', 'desc']],
                                limit: 1,
                                where: {
                                    kode_driver: {
                                        [Op.like]: `%D${getIDBu}%`
                                    },
                                }
                            }
                        )

                        if (getCodeDriver.length === 0) {
                            const addDriver = await models.m_driver.create(
                                {
                                    'kode_driver': "D" + getIDBu + "00001",
                                    'nik': req.body.nik,
                                    'divisi': req.body.divisi,
                                    'nama': req.body.nama,
                                    'id_mitra': req.body.id_mitra,
                                    'no_ktp': req.body.no_ktp,
                                    'no_sim': req.body.no_sim,
                                    'vehicle_type': req.body.vehicle_type,
                                    'jenis_sim': req.body.jenis_sim,
                                    'alamat': req.body.alamat,
                                    'tgl_lahir': !req.body.tgl_lahir === true ? 0 : core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                                    'agama': req.body.agama,
                                    'no_telp': req.body.notelp,
                                    'no_telp2': req.body.notelp2,
                                    'email': req.body.email,
                                    'password': CryptoJS.MD5(123456).toString(),
                                    'foto': null,
                                    'tgl_masuk': !req.body.tgl_masuk === true ? 0 : core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                                    'tgl_sim': !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_sim).format('YYYY-MM-DD'),
                                    'uk_seragam': req.body.uk_seragam,
                                    'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                    'rekening_bank': req.body.rekening_bank,
                                    'rekening_norek': req.body.rekening_norek,
                                    'status': 1,
                                    'ritase': 0,
                                    'point': 0,
                                    'deposit': 0,
                                    'wilayah': "",
                                    'tgl_update': 0,
                                    'foto_ktp': "",
                                    'foto_stnk': "",
                                    'foto_ijasah': "",
                                    'foto_kk': "",
                                    'jaminan': "",
                                    'foto_jaminan': "",
                                    'available': 1,
                                    'tgl_update': Date.now(),
                                    'id_bu_brench': 0

                                }
                            )

                            if (addDriver) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Berhasil Menambahkan Driver Baru'
                                    },
                                }
                            } else {
                                output = {
                                    status: {
                                        code: 402,
                                        message: 'Gagal menambahkan Driver'
                                    },
                                }
                            }
                        } else {
                            const getCode = Number(getCodeDriver[0].kode_driver.substring(2, 8))
                            const codeUrut = getCode + 1

                            const getcharacterNumber = codeUrut.toString()

                            if (codeUrut > 99999) {
                                output = {
                                    status: {
                                        code: 400,
                                        message: 'Gagal menginput data kode sudah maks di 99999'
                                    }
                                }
                            } else {
                                var zeroCode

                                if (getcharacterNumber.length == 1) {
                                    var zeroCode = "0000"
                                } else if (getcharacterNumber.length == 2) {
                                    var zeroCode = "000"
                                } else if (getcharacterNumber.length == 3) {
                                    var zeroCode = "00"
                                } else if (getcharacterNumber.length == 4) {
                                    var zeroCode = "0"
                                } else if (getcharacterNumber.length == 5) {
                                    var zeroCode = ""
                                }

                                const addDriver = await models.m_driver.create(
                                    {
                                        'kode_driver': "D" + getIDBu + zeroCode + codeUrut,
                                        'nik': req.body.nik,
                                        'divisi': "",
                                        'nama': req.body.nama,
                                        'id_mitra': req.body.id_mitra,
                                        'no_ktp': req.body.no_ktp,
                                        'no_sim': req.body.no_sim,
                                        'vehicle_type': req.body.vehicle_type,
                                        'jenis_sim': req.body.jenis_sim,
                                        'alamat': req.body.alamat,
                                        'tgl_lahir': !req.body.tgl_lahir === true ? 0 : core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                                        'agama': req.body.agama,
                                        'no_telp': req.body.notelp,
                                        'no_telp2': req.body.notelp2,
                                        'email': req.body.email,
                                        'password': CryptoJS.MD5(123456).toString(),
                                        'foto': "",
                                        'tgl_masuk': core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                                        'tgl_sim': !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_sim).format('YYYY-MM-DD'),
                                        'uk_seragam': req.body.uk_seragam,
                                        'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                        'rekening_bank': req.body.rekening_bank,
                                        'rekening_norek': req.body.rekening_norek,
                                        'status': 1,
                                        'ritase': 0,
                                        'point': 0,
                                        'deposit': 0,
                                        'wilayah': "",
                                        'tgl_update': 0,
                                        'foto_ktp': "",
                                        'foto_stnk': "",
                                        'foto_ijasah': "",
                                        'foto_kk': "",
                                        'jaminan': "",
                                        'foto_jaminan': "",
                                        'available': 1,
                                        'id_bu_brench': 0


                                    }
                                )
                                if (addDriver) {
                                    output = {
                                        status: {
                                            code: 200,
                                            message: 'Berhasil Menambahkan Driver Baru'
                                        },
                                    }
                                } else {
                                    output = {
                                        status: {
                                            code: 402,
                                            message: 'Gagal menambahkan Driver'
                                        },
                                    }
                                }
                            }
                        }
                    } else {
                        const getIDBu = getUser.id_bu === 11 ? 1 : getUser.id_bu === 21 ? 1 : 2;

                        const getCodeDriver = await models.m_driver.findAll(
                            {
                                order: [['id', 'desc']],
                                limit: 1,
                                where: {
                                    kode_driver: {
                                        [Op.like]: `%D${getIDBu}%`
                                    },
                                }
                            }
                        )

                        if (getCodeDriver.length === 0) {
                            const addDriver = await models.m_driver.create(
                                {
                                    'kode_driver': "D" + getIDBu + "00001",
                                    'nik': req.body.nik,
                                    'divisi': "",
                                    'nama': req.body.nama,
                                    'id_mitra': req.body.id_mitra,
                                    'no_ktp': req.body.no_ktp,
                                    'no_sim': req.body.no_sim,
                                    'vehicle_type': req.body.vehicle_type,
                                    'jenis_sim': req.body.jenis_sim,
                                    'alamat': req.body.alamat,
                                    'tgl_lahir': !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                                    'agama': req.body.agama,
                                    'no_telp': req.body.notelp,
                                    'no_telp2': req.body.notelp2,
                                    'email': req.body.email,
                                    'password': CryptoJS.MD5(123456).toString(),
                                    'foto': req.files.cover[0].filename,
                                    'foto_sim': req.files.foto_sim ? req.files.foto_sim[0].filename : null,
                                    'tgl_masuk': !req.body.tgl_masuk === true ? 0 : core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                                    'tgl_sim': !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                                    'uk_seragam': req.body.uk_seragam,
                                    'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                    'rekening_bank': req.body.rekening_bank,
                                    'rekening_norek': req.body.rekening_norek,
                                    'status': 1,
                                    'ritase': 0,
                                    'point': 0,
                                    'deposit': 0,
                                    'wilayah': "",
                                    'tgl_update': 0,
                                    'foto_ktp': "",
                                    'foto_stnk': "",
                                    'foto_ijasah': "",
                                    'foto_kk': "",
                                    'jaminan': "",
                                    'foto_jaminan': "",
                                    'available': 1,
                                    'id_bu_brench': 0


                                }
                            )
                            if (addDriver) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Berhasil Menambahkan Driver Baru'
                                    },
                                }
                            } else {
                                output = {
                                    status: {
                                        code: 402,
                                        message: 'Gagal menambahkan Driver'
                                    },
                                }
                            }
                        } else {
                            const getCode = Number(getCodeDriver[0].kode_driver.substring(6, 8))
                            const codeUrut = getCode + 1

                            const getcharacterNumber = codeUrut.toString()

                            if (codeUrut > 99999) {
                                output = {
                                    status: {
                                        code: 400,
                                        message: 'Gagal menginput data kode sudah maks di 99999'
                                    }
                                }
                            } else {
                                var zeroCode

                                if (getcharacterNumber.length == 1) {
                                    var zeroCode = "0000"
                                } else if (getcharacterNumber.length == 2) {
                                    var zeroCode = "000"
                                } else if (getcharacterNumber.length == 3) {
                                    var zeroCode = "00"
                                } else if (getcharacterNumber.length == 4) {
                                    var zeroCode = "0"
                                } else if (getcharacterNumber.length == 5) {
                                    var zeroCode = ""
                                }

                                const addDriver = await models.m_driver.create(
                                    {
                                        'kode_driver': "D" + getIDBu + zeroCode + codeUrut,
                                        'nik': req.body.nik,
                                        'divisi': "",
                                        'nama': req.body.nama,
                                        'id_mitra': req.body.id_mitra,
                                        'no_ktp': req.body.no_ktp,
                                        'no_sim': req.body.no_sim,
                                        'vehicle_type': req.body.vehicle_type,
                                        'jenis_sim': req.body.jenis_sim,
                                        'alamat': req.body.alamat,
                                        'tgl_lahir': !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                                        'agama': req.body.agama,
                                        'no_telp': req.body.notelp,
                                        'no_telp2': req.body.notelp2,
                                        'email': req.body.email,
                                        'password': CryptoJS.MD5(123456).toString(),
                                        'foto': req.files.cover[0].filename,
                                        'foto_sim': req.files.foto_sim ? req.files.foto_sim[0].filename : null,
                                        'tgl_masuk': !req.body.tgl_masuk === true ? 0 : core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                                        'tgl_sim': !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                                        'uk_seragam': req.body.uk_seragam,
                                        'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                        'rekening_bank': req.body.rekening_bank,
                                        'rekening_norek': req.body.rekening_norek,
                                        'status': 1,
                                        'ritase': 0,
                                        'point': 0,
                                        'deposit': 0,
                                        'wilayah': "",
                                        'tgl_update': 0,
                                        'foto_ktp': "",
                                        'foto_stnk': "",
                                        'foto_ijasah': "",
                                        'foto_kk': "",
                                        'jaminan': "",
                                        'foto_jaminan': "",
                                        'available': 1,
                                        'id_bu_brench': 0


                                    }
                                )
                                if (addDriver) {
                                    output = {
                                        status: {
                                            code: 200,
                                            message: 'Berhasil Menambahkan Driver Baru'
                                        },
                                    }
                                } else {
                                    output = {
                                        status: {
                                            code: 402,
                                            message: 'Gagal menambahkan Driver'
                                        },
                                    }
                                }
                            }
                        }
                    }
                } else {
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
                    id_mitra: req.body.id_mitra,
                    no_ktp: req.body.no_ktp,
                    no_sim: req.body.no_sim,
                    vehicle_type: req.body.vehicle_type,
                    jenis_sim: req.body.jenis_sim,
                    alamat: req.body.alamat,
                    tgl_lahir: !req.body.tgl_lahir === true ? 0 : core.moment(req.body.tgl_lahir).format('YYYY-MM-DD'),
                    agama: req.body.agama,
                    no_telp: req.body.notelp,
                    no_telp2: req.body.notelp2,
                    email: req.body.email,
                    tgl_masuk: !req.body.tgl_masuk === true ? 0 : core.moment(req.body.tgl_masuk).format('YYYY-MM-DD'),
                    tgl_sim: !req.body.tgl_sim === true ? 0 : core.moment(req.body.tgl_sim).format('YYYY-MM-DD'),
                    uk_seragam: req.body.uk_seragam,
                    jenis_kepemilikan: req.body.jenis_kepemilikan,
                    rekening_bank: req.body.rekening_bank,
                    rekening_norek: req.body.rekening_norek,
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
            } else {
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

// Partial update for m_driver (safe: only provided fields updated)
exports.updateMDriver = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: { code: 400, message: 'Parameter id wajib diisi' }
            });
        }

        const driver = await models.m_driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({
                status: { code: 404, message: 'Driver tidak ditemukan' }
            });
        }

        const payload = {};
        const assign = (k, v) => { if (v !== undefined) payload[k] = v; };

        assign('nik', req.body.nik);
        assign('divisi', req.body.divisi);
        assign('nama', req.body.nama);
        assign('id_mitra', req.body.id_mitra);
        assign('no_ktp', req.body.no_ktp);
        assign('no_sim', req.body.no_sim);
        assign('vehicle_type', req.body.vehicle_type);
        assign('jenis_sim', req.body.jenis_sim);
        assign('alamat', req.body.alamat);
        assign('agama', req.body.agama);
        assign('no_telp', req.body.notelp);
        assign('no_telp2', req.body.notelp2);
        assign('email', req.body.email);
        assign('uk_seragam', req.body.uk_seragam);
        assign('jenis_kepemilikan', req.body.jenis_kepemilikan);
        assign('rekening_bank', req.body.rekening_bank);
        assign('rekening_norek', req.body.rekening_norek);
        assign('status', req.body.status);
        assign('id_bu_brench', req.body.id_bu_brench);

        // Dates formatting if provided
        if (req.body.tgl_lahir !== undefined) {
            payload.tgl_lahir = req.body.tgl_lahir ? core.moment(req.body.tgl_lahir).format('YYYY-MM-DD') : null;
        }
        if (req.body.tgl_masuk !== undefined) {
            payload.tgl_masuk = req.body.tgl_masuk ? core.moment(req.body.tgl_masuk).format('YYYY-MM-DD') : null;
        }
        if (req.body.tgl_sim !== undefined) {
            payload.tgl_sim = req.body.tgl_sim ? core.moment(req.body.tgl_sim).format('YYYY-MM-DD') : null;
        }

        await driver.update(payload);

        return res.status(200).json({
            status: { code: 200, message: 'Berhasil mengupdate data driver' },
            data: driver
        });
    } catch (error) {
        return res.status(500).json({
            status: { code: 500, message: 'Gagal mengupdate data driver' },
            error: error.message
        });
    }
}
exports.uploadPhotoDriver = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const uplPhoto = await models.m_driver.update(
                {
                    foto: req.file.filename
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )

            if (uplPhoto) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil upload photo driver'
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



exports.statusOnDriver = async (req, res) => {
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
            } else {
                output = {
                    status: {
                        code: 402,
                        message: 'Gagal mengubah Driver Ready'
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
exports.statusOffDriver = async (req, res) => {
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
                        message: 'Berhasil Menghapus Driver'
                    },
                }
            } else {
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



// ===============



exports.getKiriman = async (req, res) => {
    try {
        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });

        const getUser = await models.users.findOne(
            {
                id: 1
            }
        )


        const getDetail = await models.m_pengadaan_detail.findAndCountAll(
            {
                order: [['id_mpd', 'desc']],
                where: {
                    id_supir: req.query.uid,
                    // tgl_update:  {
                    //             [Op.like]: `%2023%`
                    //         },
                },
                include: [
                    {
                        model: models.m_pengadaan,
                        required: false,
                        include:
                            [
                                {
                                    model: models.customer,
                                    include: [
                                        {
                                            model: models.alamat
                                        },

                                    ]
                                },
                                {
                                    model: models.users
                                }
                            ]

                    },
                    {
                        model: models.m_sm,
                    },
                    {
                        model: models.alamat,
                        required: true
                    }
                ]
            }
        )

        if (getDetail) {
            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                error: false,
                message: 'Success get Data',
                countRunsheet: getDetail.count,
                countUndelivery: 0,
                countDelivery: 2,
                runsheet_detail: getDetail.rows.map((i) => {
                    return {
                        idmp: i.m_pengadaan.id_mp,
                        noSJ: i.m_sm?.msm,
                        customer: i.m_pengadaan.customer.nama_perusahaan,
                        pickupDate: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                        jenisBarang: i.m_pengadaan.jenis_barang,
                        // packing: packing[i],
                        asuransi: i.m_pengadaan.asuransi,
                        // status: status[i],
                        // spk: noSpk[i],
                        sp: i.m_pengadaan.msp,
                        marketing: i.m_pengadaan.user.nama_lengkap,
                        service: i.m_pengadaan.service,
                        order_date: core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY hh:mm:ss"),
                        pickup_date: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                        alamatInvoice: i.m_pengadaan.alamat_invoice,
                        telpCustomer: i.m_pengadaan.customer.telepon,
                        memo: i.m_pengadaan.memo,
                        idmpd: i.id_mpd,
                        kendaraan: i.kendaraan,
                        muatId: i.m_pengadaan.customer.alamat?.id,
                        muatAddress: i.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan.customer.alamat.alamat,
                        muatKecamatan: i.m_pengadaan.customer.alamat.kecamatan,
                        muatKota: i.m_pengadaan.customer.alamat.kota,
                        bongkarId: i.alamat?.id,
                        bongkarAddress: i.alamat?.alamat,
                        bongkarKecamatan: i.alamat?.kecamatan,
                        bongkarKota: i.alamat?.kota,
                        via: i.via,
                        item: i.nama_barang,
                        ongkir: i.harga,
                        qty: i.qty,
                        berat: i.berat,
                        service: i.m_pengadaan.service,
                        price: i.harga,
                        priceRp: core.rupiah(i.harga),
                        subtotal: i.harga,
                        total: i.harga,
                        cod_amount: i.harga
                    }
                }),
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
exports.getDetailKiriman = async (req, res) => {
    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const getUser = await models.users.findOne(
            {
                id: 1
            }
        )


        const getDetail = await models.m_pengadaan_detail.findAll(
            {
                where: {
                    id_mp: req.query.idmp
                },
                include: [
                    {
                        model: models.m_pengadaan,
                        required: false,
                        include:
                            [
                                {
                                    model: models.customer,
                                    include: [
                                        {
                                            model: models.alamat
                                        },

                                    ]
                                },
                                {
                                    model: models.users
                                }
                            ]

                    },
                    {
                        model: models.m_sm,
                    },
                    {
                        model: models.alamat,
                        required: true
                    }
                ]
            }
        )

        if (getDetail) {
            const getPrice = getDetail.map((i) => i.harga)
            const noSpk = getDetail.map((i) => i.m_pengadaan.mspk)
            const noSp = getDetail.map((i) => i.m_pengadaan.msp)
            const marketing = getDetail.map((i) => i.m_pengadaan.user.nama_lengkap)
            const service = getDetail.map((i) => i.m_pengadaan.service)
            const orderDate = getDetail.map((i) => core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY hh:mm:ss"))
            const pickupDate = getDetail.map((i) => core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"))
            const alamaInvoice = getDetail.map((i) => i.m_pengadaan.alamat_invoice)
            const telpCustomer = getDetail.map((i) => i.m_pengadaan.customer.telepon)
            const customer = getDetail.map((i) => i.m_pengadaan.customer.nama_perusahaan)
            const memo = getDetail.map((i) => i.m_pengadaan.memo)
            const idmp = getDetail.map((i) => i.m_pengadaan.id_mp)
            const jenisBarang = getDetail.map((i) => i.m_pengadaan.jenis_barang)
            // const packing = getDetail.map((i) => i.m_pengadaan.packing.jenis)
            const asuransi = getDetail.map((i) => i.m_pengadaan.asuransi)

            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                idmp: idmp[0],
                jenisBarang: jenisBarang[0],
                // packing: packing[0],
                asuransi: asuransi[0],
                // status: status[0],
                spk: noSpk[0],
                sp: noSp[0],
                marketing: marketing[0],
                service: service[0],
                order_date: orderDate[0],
                pickup_date: pickupDate[0],
                alamatInvoice: alamaInvoice[0],
                telpCustomer: telpCustomer[0],
                customer: customer[0],
                memo: memo[0],
                Totalprice: core.rupiah(core.sumArray(getPrice)),
                detail: getDetail.map((i) => {
                    return {
                        idmpd: i.id_mpd,
                        noSJ: i.m_sm?.msm,
                        kendaraan: i.kendaraan,
                        pickupAddress: i.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan.customer.alamat.alamat,
                        destination: i.alamat?.alamat,
                        via: i.via,
                        item: i.nama_barang,
                        qty: i.qty,
                        berat: i.berat,
                        service: i.m_pengadaan.service,
                        pickupDate: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                        Price: core.rupiah(i.harga)

                    }
                }),
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

exports.getKurir = async (req, res) => {
    try {
        models.m_driver.hasMany(models.m_pengadaan_detail, { targetKey: 'id', foreignKey: 'id_supir' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));



        const getDriv = await models.m_driver.findAndCountAll(
            {

                order: [['id', 'desc']],
                where: {
                    id: req.query.keyword
                },
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: models.m_pengadaan_detail,
                        require: false
                    },
                ]
            }
        )
        if (getDriv.rows) {
            let no = (getDriv.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
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
exports.getDetailKurir = async (req, res) => {
    try {
        const getDriv = await models.m_driver.findOne(
            {
                where: {
                    id: req.query.id,

                },

            }
        )



        const getCOD = await models.m_pengadaan_detail.findAll(
            {
                order: [['id_mpd', 'desc']],
                where: {
                    id_supir: req.query.id,
                    tgl_update: {
                        [Op.between]: [new Date('2023-01-01'), new Date('2023-12-31')]
                    }
                }

            }
        )
        if (getDriv) {

            const getCODPrice = getCOD.map((i) => i.cod_amount)
            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: getDriv,
                totalCOD: core.sumArray(getCODPrice)


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

exports.getRunsheet = async (req, res) => {
    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const getUser = await models.users.findOne(
            {
                id: 1
            }
        )


        const getDetail = await models.m_pengadaan_detail.findAndCountAll(
            {
                order: [['id_mpd', 'desc']],
                where: {
                    id_supir: req.query.uid,
                },
                include: [
                    {
                        model: models.m_pengadaan,
                        required: false,
                        include:
                            [
                                {
                                    model: models.customer,
                                    include: [
                                        {
                                            model: models.alamat
                                        },

                                    ]
                                },
                                {
                                    model: models.users
                                }
                            ]

                    },
                    {
                        model: models.m_sm,
                        where: {
                            tgl_muat: {
                                [Op.between]: [new Date('2023-01-01'), new Date('2023-12-31')]
                            }
                        },
                    },
                    {
                        model: models.alamat,
                        required: true
                    }
                ],

                limit: 50
            }
        )

        if (getDetail) {




            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                error: false,
                message: 'Success get Data',
                totalSJ: getDetail.count,
                countRunsheet: getDetail.count,
                countUndelivery: 0,
                countDelivery: 2,
                runsheet_detail: await Promise.all(getDetail.rows.map(async (i) => {

                    const getStatusKirim = await models.m_driver_order.findOne(
                        {
                            order: [['id_mdriver_order', 'desc']],
                            where: {
                                id_mpd: i.id_mpd
                            }

                        }
                    )
                    const getStatusMaster = await models.m_status_master.findOne(
                        {
                            id_status: getStatusKirim?.status
                        }
                    )



                    return {
                        idmp: i.m_pengadaan?.id_mp,
                        idmpd: i.id_mpd,
                        sp: i.m_pengadaan?.msp,
                        noSJ: i.m_sm?.msm,
                        id_driver: req.query.uid,
                        idStatusOrder: i.m_pengadaan?.status,
                        idStatusKirim: (getStatusKirim?.status == null ? "99" : getStatusKirim?.status),
                        titleStatusKirim: getStatusMaster?.status_name,
                        remarkStatusKirim: getStatusMaster?.remark,
                        customer: i.m_pengadaan?.customer.nama_perusahaan,
                        pickupDate: core.moment(i.m_pengadaan?.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                        jenisBarang: i.m_pengadaan?.jenis_barang,
                        // packing: packing[i],
                        asuransi: i.m_pengadaan?.asuransi,
                        // status: status[i],
                        // spk: noSpk[i],
                        marketing: i.m_pengadaan?.user.nama_lengkap,
                        service: i.m_pengadaan?.service,
                        order_date: core.moment(i.m_pengadaan?.tgl_order).format("DD-MM-YYYY hh:mm:ss"),
                        pickup_date: core.moment(i.m_pengadaan?.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                        alamatInvoice: i.m_pengadaan?.alamat_invoice,
                        telpCustomer: i.m_pengadaan?.customer?.telepon,
                        memo: i.m_pengadaan?.memo,
                        kendaraan: i.kendaraan,

                        muatId: i.m_pengadaan?.customer.alamat?.id,
                        muatPIC: i.m_pengadaan?.customer.alamat?.pic,
                        muatPhone: i.m_pengadaan?.customer.alamat?.hp,
                        muatAddress: i.m_pengadaan?.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan?.customer.alamat?.alamat,
                        muatKecamatan: i.m_pengadaan?.customer.alamat?.kecamatan,
                        muatKota: i.m_pengadaan?.customer.alamat?.kota,
                        muatLat: i.m_pengadaan?.customer.alamat?.lat,
                        muatLon: i.m_pengadaan?.customer.alamat?.lon,

                        bongkarId: i.alamat?.id,
                        bongkarPIC: i.alamat?.pic,
                        bongkarPhone: i.alamat?.hp,
                        bongkarAddress: i.alamat?.alamat,
                        bongkarKecamatan: i.alamat?.kecamatan,
                        bongkarKota: i.alamat?.kota,
                        bongkarLat: i.alamat?.lat,
                        bongkarLon: i.alamat?.lon,

                        via: i.via,
                        item: i.nama_barang,
                        ongkir: i.harga,
                        berat: i.berat,
                        qty: i.qty,
                        koli: i.koli,
                        ikat: i.ikat,
                        service: i.m_pengadaan?.service,
                        price: i.harga,
                        priceRp: core.rupiah(i.harga),
                        subtotal: i.harga,
                        total: i.harga,
                        cod_amount: i.harga

                    }
                })),
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
exports.getDetailRunsheet = async (req, res) => {
    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const getUser = await models.users.findOne(
            {
                id: 1
            }
        )


        const getDetail = await models.m_pengadaan_detail.findAll(
            {
                where: {
                    id_mp: req.query.idmp
                },
                include: [
                    {
                        model: models.m_pengadaan,
                        required: false,
                        include:
                            [
                                {
                                    model: models.customer,
                                    include: [
                                        {
                                            model: models.alamat
                                        },

                                    ]
                                },
                                {
                                    model: models.users
                                }
                            ]

                    },
                    {
                        model: models.m_sm,
                    },
                    {
                        model: models.alamat,
                        required: true
                    }
                ]
            }
        )

        if (getDetail) {
            const getPrice = getDetail.map((i) => i.harga)
            const noSpk = getDetail.map((i) => i.m_pengadaan.mspk)
            const noSp = getDetail.map((i) => i.m_pengadaan.msp)
            const marketing = getDetail.map((i) => i.m_pengadaan.user.nama_lengkap)
            const service = getDetail.map((i) => i.m_pengadaan.service)
            const orderDate = getDetail.map((i) => core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY hh:mm:ss"))
            const pickupDate = getDetail.map((i) => core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"))
            const alamaInvoice = getDetail.map((i) => i.m_pengadaan.alamat_invoice)
            const telpCustomer = getDetail.map((i) => i.m_pengadaan.customer.telepon)
            const customer = getDetail.map((i) => i.m_pengadaan.customer.nama_perusahaan)
            const memo = getDetail.map((i) => i.m_pengadaan.memo)
            const idmp = getDetail.map((i) => i.m_pengadaan.id_mp)
            const jenisBarang = getDetail.map((i) => i.m_pengadaan.jenis_barang)
            // const packing = getDetail.map((i) => i.m_pengadaan.packing.jenis)
            const asuransi = getDetail.map((i) => i.m_pengadaan.asuransi)

            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                idmp: idmp[0],
                jenisBarang: jenisBarang[0],
                // packing: packing[0],
                asuransi: asuransi[0],
                // status: status[0],
                spk: noSpk[0],
                sp: noSp[0],
                marketing: marketing[0],
                service: service[0],
                order_date: orderDate[0],
                pickup_date: pickupDate[0],
                alamatInvoice: alamaInvoice[0],
                telpCustomer: telpCustomer[0],
                customer: customer[0],
                memo: memo[0],
                Totalprice: core.rupiah(core.sumArray(getPrice)),
                detail: getDetail.map((i) => {
                    return {
                        idmpd: i.id_mpd,
                        noSJ: i.m_sm?.msm,
                        kendaraan: i.kendaraan,
                        pickupAddress: i.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan.customer.alamat.alamat,
                        destination: i.alamat?.alamat,
                        via: i.via,
                        item: i.nama_barang,
                        qty: i.qty,
                        berat: i.berat,
                        service: i.m_pengadaan.service,
                        pickupDate: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                        Price: core.rupiah(i.harga)

                    }
                }),
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

exports.postStatusKirim = async (req, res) => {
    try {

        const getdriver = await models.m_driver.findOne(
            {
                where: {
                    id: req.body.id_kurir,

                }
            }
        )
        if (getdriver) {

            const addStatus = await models.m_driver_order.create(
                {
                    'id_mp': req.body.id_runsheet,
                    'id_mpd': req.body.id_runsheet_detail,
                    'id_driver': req.body.id_kurir,
                    'status': req.body.id_status,
                    'memo': req.body.memo,
                    'status_date': core.moment().format('YYYY-MM-DD'),
                    'lat': req.body.lat,
                    'lon': req.body.lon,
                    'foto': req.body.gambar,
                    'koli': req.body.koli,
                    'berat': req.body.berat,


                }
            )
            if (addStatus) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Menambahkan Status Kirim Baru'
                    },
                }

            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'Gagal menambahkan Status Kirim'
                    },
                }

            }

        }
        else {
            output = {
                status: {
                    code: 502,
                    message: 'Driver tidak tersedia'
                },
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


//-------------------------------------driver mobile-----------------------------------------//
exports.getOptionStatus = async (req, res) => {
    try {
        const getUser = await models.m_driver.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getStatus = await models.m_status_master.findAll(
                {
                    where: {
                        id_status: [0, 1, 2, 3, 5, 7, 9, 10, 11, 15, 16, 17, 18, 19]
                    }
                }
            )
            if (getStatus) {
                output = {
                    status: {
                        code: 200,
                        message: 'succes get data'
                    },
                    data: getStatus.map((i) => {
                        return {
                            statusId: i.id_status,
                            status: i.status_name,
                            keterangan: i.remark,

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


exports.DriverPosition = async (req, res) => {
    try {
        const getUser = await models.m_driver.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const addPosition = await models.kendaraanstatus.create(
                {
                    id_kendaraan: req.body.id_kendaraan,
                    no_polisi: req.body.no_polisi,
                    id_pengemudi: req.body.id_pengemudi,
                    nama_driver: req.body.nama_driver,
                    id_msm: req.body.id_msm,
                    kondisi_kendaraan: "no ready",
                    action: req.body.action,
                    empty_load: req.body.empty_load,
                    keterangan: req.body.keterangan,
                    memo: null,
                    customer: req.body.customer,
                    posisi: req.body.posisi,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                    tujuan: req.body.tujuan,
                    tgl_update: Date.now(),
                    id_user: req.user.id,
                    tgl_create: Date.now(),
                }
            )
            // if()
            // const updStatus = await models.m_sm.update(
            //     {
            //         status_perubahan:req.body.action
            //     },
            //     {
            //         where:{

            //         }
            //     }
            // )
            if (addPosition) {
                if (addPosition.empty_load == "Success") {
                    const addPoint = await models.reward.create(
                        {
                            id_driver: req.body.id_pengemudi,
                            id_msm: req.body.id_msm,
                            point: 10,
                            keterangan: "berhasil mendapatkan 10 point",


                        }
                    )
                    if (addPoint) {
                        const getPoint = await models.m_driver.findOne(
                            {
                                where: {
                                    id: req.body.id_pengemudi
                                }
                            }
                        )
                        const pointBefore = getPoint.total_point == null ? 0 : getPoint.total_point
                        const countPoint = await models.m_driver.update(
                            {
                                total_point: Number(pointBefore + addPoint.point)
                            },
                            {
                                where: {
                                    id: req.body.id_pengemudi
                                }
                            }
                        )
                        if (countPoint) {
                            output = {
                                status: {
                                    code: 200,
                                    message: 'status berhasil dirubah menjadi ' + addPosition.empty_load
                                },
                            }


                        }
                    }
                }
                else {
                    output = {
                        status: {
                            code: 200,
                            message: 'status berhasil dirubah menjadi ' + addPosition.empty_load
                        },
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

exports.updateMemo = async (req, res) => {
    try {
        const getUser = await models.m_driver.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updateData = await models.kendaraanstatus.update(
                {
                    memo: req.body.memo
                },
                {
                    where: {
                        id_msm: req.body.id_msm,
                        empty_load: 'Success'
                    }
                }
            )
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'succes update memo'
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


exports.updatePhoto = async (req, res) => {
    try {
        const getUser = await models.m_driver.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const upldFoto = await models.kendaraanstatus.update(
                {
                    foto: req.file.filename
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (upldFoto) {
                output = {
                    status: {
                        code: 200,
                        message: "Berhasil Upload foto"
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

exports.historyReward = async (req, res) => {
    try {
        models.reward.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });
        models.reward.belongsTo(models.m_sm, { targetKey: 'id_msm', foreignKey: 'id_msm' });
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getHistory = await models.reward.findAndCountAll(
                {
                    ...req.query.id_driver ? {
                        where: {
                            id_driver: req.query.id_driver
                        }
                    } : {},
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_driver
                        },
                        {
                            model: models.m_sm
                        }
                    ]
                }
            )
            if (getHistory.rows) {
                let no = (getHistory.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getHistory.rows.map((item) => {
                    return {
                        no: no++,
                        sm: item.m_sm.msm,
                        keterangan: item.keterangan,
                        date: core.moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')


                    }
                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
                        totalData: getHistory.count,
                        totalPage: Math.ceil(getHistory.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: req.query.id_driver ? result : {}

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


exports.updateStatusKpu = async (req, res) => {
    try {
        const type = req.body.type
        const productid = req.query.id

        if (type == 'dev') {
            let data = JSON.stringify({
                "status": req.body.status,
                "lat": req.body.lat,
                "lon": req.body.lon
            });

            // Konfigurasi request Axios
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://silog-web.kpu.go.id/api/tracking/${productid}`,
                headers: {
                    'Authorization': 'Bearer 3e1a9d5158305dc1a27ff65d85d15b60837099b19f8b10ae42b975fc8781ad043eb9a8049dac9e119d12f1f8d850a182bed8a5b80203b15341cc49d8bcc98f31',
                    'Content-Type': 'application/json'
                },
                data: data
            };

            // Request data dari API eksternal menggunakan Axios
            const response = await axios.request(config);
            const responseData = response.data;


            if (response) {

                const setStatusToDb = await models.kendaraanstatus.create(
                    {
                        id_kendaraan: 0,
                        no_polisi: req.body.nopol,
                        id_pengemudi: 0,
                        nama_driver: req.body.nama,
                        id_msm: 0,
                        kondisi_kendaraan: 'ready',
                        action: 0,
                        empty_load: req.body.status,
                        keterangan: "KPU",
                        memo: req.body.nohp,
                        customer: "KPU",
                        posisiL: "",
                        longitude: req.body.lon,
                        latitude: req.body.lat,
                        tujuan: "KPU",
                        foto: "",
                        tgl_update: Date.now(),
                        tgl_create: Date.now(),
                        id_user: 0
                    }
                )
                if (setStatusToDb) {

                    res.status(201).json({
                        status: {
                            code: 200,
                            message: 'Success set status'
                        },
                        // responseData
                    }

                    );


                }


            }


        }
        else if (type == 'prod') {
            let data = JSON.stringify({
                "status": req.body.status,
                "lat": req.body.lat,
                "lon": req.body.lon
            });

            // Konfigurasi request Axios
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://silog-pilkada.kpu.go.id/api/tracking/${productid}`,
                headers: {
                    'Authorization': 'Bearer i5doxeokSfvgJlR0M74xPONaMNMfYfWKvg08Hce5JHqiBQjJ2buDhMkSL8lII2vyAZ54Mhoo9jzd3BXopMIeMt2KjwMwaFIscF4g',
                    'Content-Type': 'application/json'
                },
                data: data
            };

            // Request data dari API eksternal menggunakan Axios
            const response = await axios.request(config);
            const responseData = response.data;


            if (response) {
                const setStatusToDb = await models.kendaraanstatus.create(
                    {
                        id_kendaraan: 0,
                        no_polisi: req.body.nopol,
                        id_pengemudi: 0,
                        nama_driver: req.body.nama,
                        id_msm: 0,
                        kondisi_kendaraan: 'ready',
                        action: 0,
                        keterangan: "KPU",
                        empty_load: req.body.status,
                        memo: req.body.nohp,
                        customer: "KPU",
                        posisiL: "",
                        longitude: req.body.lon,
                        latitude: req.body.lat,
                        tujuan: "KPU",
                        foto: "",
                        tgl_update: Date.now(),
                        tgl_create: Date.now(),
                        id_user: 0
                    }
                )
                if (setStatusToDb) {
                    res.status(201).json({
                        status: {
                            code: 200,
                            message: 'Success set status'
                        },
                        // responseData
                    }

                    );
                }


            }

        }
        else {
            res.status(400).json({
                status: {
                    code: 400,
                    message: 'please input type'
                },
                // responseData
            }

            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan saat fetching data atau menyimpan ke database",
            error: error.message
        });
    }
}

exports.getSimStatus = async (req, res) => {
  try {
    const { type = 'expired', page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let whereCondition;
    let orderBy;
    let message;

    if (type === 'expired') {
      // SIM yang sudah expired
      whereCondition = {
        tgl_sim: {
          [Op.lt]: today,
        },
        status: 1,
      };
      orderBy = [['tgl_sim', 'DESC']]; // Most recently expired first
      message = 'Data driver dengan SIM yang sudah expired';
    } else if (type === 'expiring_soon') {
      // SIM yang akan expired dalam 30 hari
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      whereCondition = {
        tgl_sim: {
          [Op.between]: [today, thirtyDaysLater],
        },
        status: 1,
      };
      orderBy = [['tgl_sim', 'ASC']]; // Soonest to expire first
      message = 'Data driver dengan SIM akan segera habis dalam 30 hari ke depan';
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Parameter type harus "expired" atau "expiring_soon"',
      });
    }

    // Use findAndCountAll to get both data and count in one query
    const result = await models.m_driver.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: models.kendaraan,
          as: 'kendaraans',
          attributes: [],
          where: { jenis_kepemilikan: { [Op.in]: ['eureka', 'eur_sewa'] } },
          required: true
        }
      ],
      attributes: [
        'id', 'nama', 'kode_driver', 'nik', 'tgl_sim', 'no_sim',
        'jenis_sim', 'divisi', 'vehicle_type', 'id_mitra',
        'id_bu_brench', 'status'
      ],
      order: orderBy,
      limit: parsedLimit,
      offset: offset,
      distinct: true,
      subQuery: false,
      raw: false,
    });

    // Ensure no duplicates in the result
    const seenIds = new Set();
    const finalDrivers = result.rows.filter(driver => {
      if (seenIds.has(driver.id)) {
        return false;
      }
      seenIds.add(driver.id);
      return true;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(result.count / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    res.status(200).json({
      success: true,
      status: 200,
      message: message,
      type: type,
      totalData: finalDrivers.length,
      totalRecords: result.count,
      pagination: {
        currentPage: parsedPage,
        totalPages: totalPages,
        limit: parsedLimit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
      data: finalDrivers,
    });
  } catch (error) {
    console.error('Error fetching SIM status data:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Gagal mengambil data driver berdasarkan status SIM',
    });
  }
};

exports.getDriverAll = async (req, res) => {
  const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

  try {
    const drivers = await models.m_driver.findAndCountAll({
      order: [["id", "desc"]],
      where: {
        nama: { [Op.ne]: "" },
        ...(req.query.jenis_kepemilikan && { jenis_kepemilikan: req.query.jenis_kepemilikan }),
        ...(req.query.status && { status: req.query.status }),
        ...(req.query.id_mitra && { id_mitra: req.query.id_mitra }),
        ...(req.query.keyword && {
          [Op.or]: [
            {
              nama: {
                [Op.like]: `%${req.query.keyword}%`,
              },
            },
          ],
        }),
      },
      limit,
      offset,
    });

    let no = drivers.count > 0 ? (req.query.page - 1) * req.query.limit + 1 : 0;

    const result = drivers.rows.map((item) => ({
      no: no++,
      driverId: item.id,
      driverCode: item.kode_driver,
      nik: item.nik || "-",
      division: item.divisi || "-",
      driverReligion: item.agama || "-",
      driverName: item.nama,
      jenisKepemilikan: item.jenis_kepemilikan,
      vehicle: item.vehicle_type || "-",
      driverEmail: item.email || "-",
      driverKtp: item.no_ktp || "-",
      simType: item.jenis_sim || "-",
      tglSim: item.tgl_sim || "-",
      numberSim: item.no_sim || "-",
      noTelp1: item.no_telp || "-",
      noTelp2: item.no_telp2 || "-",
      dateIn: item.tgl_masuk || "-",
      dateBirth: item.tgl_lahir || "-",
      driverAddress: item.alamat || "-",
      driverImage:
        !item.foto || item.foto === ""
          ? "https://api.eurekalogistics.co.id/images/no-pictures.png"
          : "https://api.eurekalogistics.co.id/images/Driver/" + item.foto,
      simImage:
        !item.foto_sim || item.foto_sim === ""
          ? "https://api.eurekalogistics.co.id/images/no-pictures.png"
          : "https://api.eurekalogistics.co.id/images/Driver/" + item.foto_sim,
      driverStatus: item.status,
      bankRekening: item.rekening_bank,
      norek: item.rekening_norek,
      ukuran_seragam: item.uk_seragam,
      point: item.total_point ?? 0,
    }));

    const output = {
      status: {
        code: 200,
        message: "Success Get Data",
      },
      data: {
        totalData: drivers.count,
        totalPage: Math.ceil(drivers.count / req.query.limit),
        limit: Number(req.query.limit),
        currentPage: Number(req.query.page),
        order: result,
      },
    };

    const errorsFromMiddleware = await customErrorMiddleware(req);
    if (!errorsFromMiddleware) {
      res.status(200).send(output);
    } else {
      res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
  } catch (error) {
    const output = {
      status: {
        code: 500,
        message: error.message,
      },
    };
    res.status(500).send(output);
  }
};
