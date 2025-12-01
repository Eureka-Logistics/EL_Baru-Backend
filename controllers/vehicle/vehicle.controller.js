const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');



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
            const getMitra = await models.mitra.findAll(
                {
                    order: [['nama_mitra', 'asc']],
                    where: {
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_mitra: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },
                                },
                            ]
                        } : {}
                    }
                }
            )

            const getIDBu = getUser.id_bu === 11 ? 1 : getUser.id_bu === 21 ? 1 : 2;

            const getCodeVehicle = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],
                    limit: 1,
                    where: {
                        code_kendaraan: {
                            [Op.like]: `%V${getIDBu}%`
                        },
                    }
                }
            )

            var vehicleCode
            // console.log("anjayy", getCodeVehicle.length)
            if (getCodeVehicle.length === 0) {
                var vehicleCode = `V${getIDBu}00001`
            } else {
                const getCodeAR = Number(getCodeVehicle[0].code_kendaraan.substring(2, 8))
                const codeAR = getCodeAR + 1
                console.log("ahhaha", getCodeAR)
                const getcharacterNumber = codeAR.toString()

                if (codeAR > 99999) {
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
                    var vehicleCode = "V" + getIDBu + zeroCode + codeAR
                }
            }

            const getType = await models.kendaraan_jenis.findAll(
                {
                    order: [['id_kendaraan_jenis', 'desc']],

                    where: {
                        status: "1"
                    }
                }
            )

            const getData = await models.m_driver.findAll(
                {
                    order: [['id', 'desc']],
                    ...req.query.vehicleType ? {
                        where: {
                            status: "1",
                            vehicle_type: req.query.vehicleType
                        }
                    } : {}
                }
            )

            const response = {
                code: vehicleCode,
                mitra: getMitra.map((i) => {
                    return {
                        id: i.id_mitra,
                        mitra: i.nama_mitra,
                        type: i.type,
                    }
                }),

                driverType: getType.map((i) => {
                    return {
                        id: i.id_kendaraan_jenis,
                        tipe: i.nama_kendaraan_jenis
                    }
                }),
                driverName: req.query.vehicleType ? getData.map((i) => {
                    return {
                        driverId: i.id,
                        driverName: i.nama
                    }
                }).filter(i => i.driverName != "") : {},
                jenisSim: [
                    {
                        "Jenis": "SIM A"
                    },
                    {
                        "Jenis": "SIM A Umum"
                    },
                    {
                        "Jenis": "SIM B1"
                    },
                    {
                        "Jenis": "SIM B1 Umum"
                    },
                    {
                        "Jenis": "SIM B2"
                    },
                    {
                        "Jenis": "SIM B2 Umum"
                    },
                    {
                        "Jenis": " SIM C"
                    },
                    {
                        "Jenis": "SIM D"
                    },
                ],
                jenisKepemilikan: [
                    {
                        "jenis": "eureka"
                    },
                    {
                        "jenis": "eur_sewa"
                    },
                    {
                        "jenis": "eur_oncall"
                    },
                    {
                        "jenis": "race"
                    },
                    {
                        "jenis": "rcn_sewa"
                    },
                    {
                        "jenis": "rcn_oncall"
                    },
                ],
                warnaPlat: [
                    {
                        "warna": "Hitam"
                    },
                    {
                        "warna": "Kuning"
                    },
                    {
                        "warna": "Putih"
                    },
                    {
                        "warna": "Merah"
                    },
                    {
                        "warna": "Hijau"
                    },
                ]
            }

            if (response) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: response
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
exports.filterVeh = async (req, res) => {
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

                },
                mitra: getMitra.map((i) => {
                    return {
                        id: i.id_mitra,
                        namaMitra: i.nama_mitra
                    }
                }),
                filterStatus: [
                    {
                        "value": 1,
                        "status": "aktif"
                    },
                    {
                        "value": 0,
                        "status": "tidak aktif"
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



exports.getvehicle = async (req, res) => {
    try {
        models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getVeh = await models.kendaraan.findAndCountAll(
            {
                order: [['id', 'desc']],
                where: {
                    ...req.query.status ? {
                        status: req.query.status
                    } : {},
                    ...req.query.jenisKepemilikan ? {
                        jenis_kepemilikan: req.query.jenisKepemilikan
                    } : {},
                    ...req.query.id_mitra ? {
                        id_vendor: req.query.id_mitra
                    } : {},
                    ...req.query.keyword ? {
                        [Op.or]: [
                            {
                                no_polisi: {
                                    [Op.like]: `%${req.query.keyword}%`
                                },
                            },
                            {
                                kode_kendaraan: {
                                    [Op.like]: `%${req.query.keyword}%`
                                }
                            },
                        ]
                    } : {}
                },
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: models.m_driver,
                    }
                ]
            }
        )

        if (getVeh.rows) {
            let no = (getVeh.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0

            const result = getVeh.rows.map((item) => {
                return {
                    no: no++,
                    vehicleId: item.id,
                    vehicleCode: item.code_kendaraan,
                    gps_device_id: item.gps_device_id,
                    jenisKepemilikan: item.jenis_kepemilikan,
                    driverId: item.m_driver == null || item.m_driver.id == 0 ? "-" : item.m_driver.id,
                    vehicleCode: item.kode_kendaraan,
                    policeNumber: item.no_polisi,
                    platColor: item.warna_plat,
                    stnk: item.stnk,
                    stnkDate: item.tgl_stnk,
                    kirDate: core.moment(item.tgl_kir).format('YYYY-MM-DD'),
                    bpkbNumber: item.no_bpkb == null || item.no_bpkb == "" ? "-" : item.no_bpkb,
                    vendor: item.vendor,
                    vehicleType: item.jenis_kendaraan,
                    vehicleMerk: item.merk_mobil,
                    vehilceYear: item.tahun_mobil,
                    buyDate: item.tgl_beli,
                    vehicleLentgth: item.panjang,
                    vehicleWidth: item.lebar,
                    vehicleHeight: item.tinggi,
                    // size: 'panjang ' + item.panjang + ' m' + ',' + 'lebar ' + item.lebar + ' m' + ',' + 'tinggi ' + item.tinggi + ' m',
                    cubication: item.kubikasi,
                    capacity: item.kapasitas,
                    maxCapacity: item.kapasitas_maks,
                    driverName: item.m_driver == null || item.m_driver.nama == "" ? "-" : item.m_driver.nama,
                    vehicleImage: item.foto == null || item.foto == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/vehicle/" + item.foto,
                    stnkImage: item.foto_stnk == null || item.foto_stnk == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/vehicle/" + item.foto_stnk,
                    status: item.status
                }
            })

            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: {
                    totalData: getVeh.count,
                    totalPage: Math.ceil(getVeh.count / req.query.limit),
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
exports.getvehicleDetail = async (req, res) => {
    try {
        models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

        const getVeh = await models.kendaraan.findAll(
            {
                where: {
                    id: req.query.id,
                },
                include: [
                    {
                        model: models.m_driver,
                    }
                ]
            }
        )
        if (getVeh) {
            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: getVeh.map((item) => {
                    return {
                        vehicleId: item.id,
                        vehicleCode: item.code_kendaraan,
                        jenisKepemilikan: item.jenis_kepemilikan,
                        driverId: item.m_driver == null || item.m_driver.id == 0 ? "-" : item.m_driver.id,
                        policeNumber: item.no_polisi,
                        platColor: item.warna_plat,
                        stnk: item.stnk,
                        stnkDate: item.tgl_stnk,
                        kirDate: core.moment(item.tgl_kir).format('YYYY-MM-DD'),
                        bpkbNumber: item.no_bpkb == null || item.no_bpkb == "" ? "-" : item.no_bpkb,
                        id_vendor: item.id_vendor,
                        vendor: item.vendor,
                        id_jenis_kendaraan: item.id_kendaraan_jenis,
                        vehicleType: item.jenis_kendaraan,
                        vehicleMerk: item.merk_mobil,
                        vehilceYear: item.tahun_mobil,
                        expiredPlat: core.moment(item.tgl_plat_nomor).format('YYYY-MM-DD'),
                        buyDate: item.tgl_beli,
                        vehicleLentgth: item.panjang,
                        vehicleWidth: item.lebar,
                        vehicleHeight: item.tinggi,
                        cubication: item.kubikasi,
                        capacity: item.kapasitas,
                        maxCapacity: item.kapasitas_maks,
                        driverName: item.m_driver == null || item.m_driver.nama == "" ? "-" : item.m_driver.nama,
                        vehicleImage: item.foto == null || item.foto == "" ? "https://api.eurekalogistics.co.id/images/no-pictures.png" : "https://api.eurekalogistics.co.id/images/vehicle/" + item.foto,
                        status: item.status
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



exports.getvehicleMitra = async (req, res) => {
    try {
        models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getVeh = await models.kendaraan.findAndCountAll(
            {
                order: [['vendor', 'asc']],
                // group: ['vendor'],
                where: {
                    status: '1',
                    vendor: { [Op.ne]: "eureka" },
                },
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: models.m_driver,
                    }
                ]
            }
        )

        if (getVeh.rows) {
            let no = (getVeh.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
            const result = getVeh.rows.map((item) => {
                return {
                    no: no++,
                    vehicleId: item.id,
                    vehicleCode: item.code_kendaraan,
                    mitraId: item.id_vendor,
                    driverId: item.m_driver == null || item.m_driver.id == 0 ? "-" : item.m_driver.id,
                    vehicleCode: item.kode_kendaraan,
                    policeNumber: item.no_polisi,
                    platColor: item.warna_plat,
                    stnk: item.stnk,
                    stnkDate: item.tgl_stnk,
                    kirDate: core.moment(item.tgl_kir).format('YYYY-MM-DD'),
                    bpkbNumber: item.no_bpkb == null || item.no_bpkb == "" ? "-" : item.no_bpkb,
                    vendor: item.vendor,
                    vehicleType: item.jenis_kendaraan,
                    vehicleMerk: item.merk_mobil,
                    vehilceYear: item.tahun_mobil,
                    buyDate: item.tgl_beli,
                    vehicleLentgth: item.panjang,
                    vehicleWidth: item.lebar,
                    vehicleHeight: item.tinggi,
                    // size: 'panjang ' + item.panjang + ' m' + ',' + 'lebar ' + item.lebar + ' m' + ',' + 'tinggi ' + item.tinggi + ' m',
                    cubication: item.kubikasi,
                    capacity: item.kapasitas,
                    maxCapacity: item.kapasitas_maks,
                    driverName: item.m_driver == null || item.m_driver.nama == "" ? "-" : item.m_driver.nama,
                    vehicleImage: item.foto == null || item.foto == "" ? "https://sandbox.eurekalogistics.co.id/jsonx/public/assets/no-pictures.png" : "https://sandbox.eurekalogistics.co.id/jsonx/public/assets/vehicle/" + item.foto,
                }
            })
            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: {
                    totalData: getVeh.count,
                    totalPage: Math.ceil(getVeh.count / req.query.limit),
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



exports.createVehicle = async (req, res) => {

    try {
        // Debug: Log struktur data yang diterima
        console.log('=== DEBUG CREATE VEHICLE ===');
        console.log('req.files:', req.files);
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        console.log('req.files.cover:', req.files?.cover);
        console.log('req.files.foto_stnk:', req.files?.foto_stnk);
        if (req.files?.cover) {
            console.log('cover filename:', req.files.cover[0].filename);
        }
        if (req.files?.foto_stnk) {
            console.log('foto_stnk filename:', req.files.foto_stnk[0].filename);
        }
        
        const errorsFromMiddleware = await customErrorMiddleware(req)

        if (!errorsFromMiddleware) {
            const getUser = await models.users.findOne(
                {
                    where: {
                        id: req.user.id
                    }
                }
            )

            if (getUser) {
                const findVehicle = await models.kendaraan.findOne(
                    {
                        where: {
                            no_polisi: req.body.no_polisi,
                            jenis_kendaraan: req.body.jenis_kendaraan,
                            merk_mobil: req.body.merk_mobil,
                            tahun_mobil: req.body.tahun_mobil
                        }
                    }
                )

                if (!findVehicle) {
                    // Debug: Log kondisi file
                    console.log('=== DEBUG VEHICLE FILE CONDITION ===');
                    console.log('req.files exists:', !!req.files);
                    console.log('req.files.cover exists:', !!req.files?.cover);
                    console.log('req.files.foto_stnk exists:', !!req.files?.foto_stnk);
                    
                    if (!req.files) {
                        const getIDBu = getUser.id_bu === 11 ? 1 : getUser.id_bu === 21 ? 1 : 2;

                        const getCodeVehicle = await models.kendaraan.findAll(
                            {
                                order: [['id', 'desc']],
                                limit: 1,
                                where: {
                                    code_kendaraan: {
                                        [Op.like]: `%V${getIDBu}%`
                                    },
                                }
                            }
                        )

                        if (getCodeVehicle.length === 0) {
                            const setData = await models.kendaraan.create(
                                {
                                    'kode_kendaraan': req.body.kode_kendaraan,
                                    'code_kendaraan': "V" + getIDBu + "00001",
                                    'id_driver': req.body.id_driver ? parseInt(req.body.id_driver) : 0,
                                    'no_polisi': req.body.no_polisi,
                                    'id_vendor': req.body.id_vendor ? parseInt(req.body.id_vendor) : 0,
                                    'vendor': req.body.vendor,
                                    'id_kendaraan_jenis': req.body.id_kendaraan_jenis ? parseInt(req.body.id_kendaraan_jenis) : 0,
                                    'jenis_kendaraan': req.body.jenis_kendaraan,
                                    'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                    'merk_mobil': req.body.merk_mobil,
                                    'tahun_mobil': req.body.tahun_mobil,
                                    'warna_plat': req.body.warna_plat,
                                    'tgl_beli': core.moment(req.body.tgl_beli).format('YYYY-MM-DD'),
                                    'panjang': req.body.panjang,
                                    'lebar': req.body.lebar,
                                    'tinggi': req.body.tinggi,
                                    'no_bpkb': req.body.no_bpkb,
                                    'stnk': req.body.stnk,
                                    'tgl_stnk': core.moment(req.body.tgl_stnk).format('YYYY-MM-DD'),
                                    'tgl_kir': core.moment(req.body.tgl_kir).format('YYYY-MM-DD'),
                                    'tgl_plat_nomor': core.moment(req.body.tgl_plat_nomor).format('YYYY-MM-DD'),
                                    'kapasitas': req.body.kapasitas,
                                    'kapasitas_maks': req.body.kapasitas_maks,
                                    'kubikasi': req.body.kubikasi,
                                    'foto': "",
                                    'foto_stnk': "",
                                    'tgl_update': Date.now(),
                                    'status': "1",
                                    'lat': "-6.3120400",
                                    'lon': "-6.106.8695370",
                                    'location': req.body.location,
                                    'engine': "OFF",
                                    'gpstime': Date.now(),
                                    'id_bu_brench': req.body.id_bu_brench ? parseInt(req.body.id_bu_brench) : 0
                                }
                            )

                            if (setData) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Berhasil menambahkan mobil baru'
                                    },
                                }

                            }
                        } else {
                            const getCodeAR = Number(getCodeVehicle[0].code_kendaraan.substring(2, 8))
                            const codeAR = getCodeAR + 1

                            const getcharacterNumber = codeAR.toString()

                            if (codeAR > 99999) {
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

                                const setData = await models.kendaraan.create(
                                    {
                                        'kode_kendaraan': req.body.kode_kendaraan,
                                        'code_kendaraan': "V" + getIDBu + zeroCode + codeAR,
                                        'id_driver': req.body.id_driver ? parseInt(req.body.id_driver) : 0,
                                        'no_polisi': req.body.no_polisi,
                                        'id_vendor': req.body.id_vendor ? parseInt(req.body.id_vendor) : 0,
                                        'vendor': req.body.vendor,
                                        'id_kendaraan_jenis': req.body.id_kendaraan_jenis ? parseInt(req.body.id_kendaraan_jenis) : 0,
                                        'jenis_kendaraan': req.body.jenis_kendaraan,
                                        'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                        'merk_mobil': req.body.merk_mobil,
                                        'tahun_mobil': req.body.tahun_mobil,
                                        'warna_plat': req.body.warna_plat,
                                        'tgl_beli': core.moment(req.body.tgl_beli).format('YYYY-MM-DD'),
                                        'panjang': req.body.panjang,
                                        'lebar': req.body.lebar,
                                        'tinggi': req.body.tinggi,
                                        'no_bpkb': req.body.no_bpkb,
                                        'stnk': req.body.stnk,
                                        'tgl_stnk': core.moment(req.body.tgl_stnk).format('YYYY-MM-DD'),
                                        'tgl_kir': core.moment(req.body.tgl_kir).format('YYYY-MM-DD'),
                                        'tgl_plat_nomor': core.moment(req.body.tgl_plat_nomor).format('YYYY-MM-DD'),
                                        'kapasitas': req.body.kapasitas,
                                        'kapasitas_maks': req.body.kapasitas_maks,
                                        'kubikasi': req.body.kubikasi,
                                        'foto': req.files && req.files.cover ? req.files.cover[0].filename : "",
                                        'foto_stnk': req.files && req.files.foto_stnk ? req.files.foto_stnk[0].filename : "",
                                        'tgl_update': Date.now(),
                                        'status': "1",
                                        'lat': "-6.3120400",
                                        'lon': "-6.106.8695370",
                                        'location': req.body.location,
                                        'engine': "OFF",
                                        'gpstime': Date.now(),
                                        'id_bu_brench': req.body.id_bu_brench ? parseInt(req.body.id_bu_brench) : 0

                                    }
                                )

                                if (setData) {
                                    output = {
                                        status: {
                                            code: 200,
                                            message: 'Berhasil menambahkan mobil baru'
                                        },
                                    }
                                }
                            }
                        }
                    } else {
                        // Ada file yang diupload (req.files ada)
                        console.log('=== DEBUG VEHICLE: PROCESSING WITH FILES ===');
                        const getIDBu = getUser.id_bu === 11 ? 1 : getUser.id_bu === 21 ? 1 : 2;

                        const getCodeVehicle = await models.kendaraan.findAll(
                            {
                                order: [['id', 'desc']],
                                limit: 1,
                                where: {
                                    code_kendaraan: {
                                        [Op.like]: `%V1%`
                                    },
                                }
                            }
                        )

                        if (getCodeVehicle.length === 0) {
                            const setData = await models.kendaraan.create(
                                {
                                    'kode_kendaraan': req.body.kode_kendaraan,
                                    'code_kendaraan': "V" + getIDBu + "00001",
                                    'id_driver': req.body.id_driver ? parseInt(req.body.id_driver) : 0,
                                    'no_polisi': req.body.no_polisi,
                                    'id_vendor': req.body.id_vendor ? parseInt(req.body.id_vendor) : 0,
                                    'vendor': req.body.vendor,
                                    'id_kendaraan_jenis': req.body.id_kendaraan_jenis ? parseInt(req.body.id_kendaraan_jenis) : 0,
                                    'jenis_kendaraan': req.body.jenis_kendaraan,
                                    'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                    'merk_mobil': req.body.merk_mobil,
                                    'tahun_mobil': req.body.tahun_mobil,
                                    'warna_plat': req.body.warna_plat,
                                    'tgl_beli': core.moment(req.body.tgl_beli).format('YYYY-MM-DD'),
                                    'panjang': req.body.panjang,
                                    'lebar': req.body.lebar,
                                    'tinggi': req.body.tinggi,
                                    'no_bpkb': req.body.no_bpkb,
                                    'stnk': req.body.stnk,
                                    'tgl_stnk': core.moment(req.body.tgl_stnk).format('YYYY-MM-DD'),
                                    'tgl_kir': core.moment(req.body.tgl_kir).format('YYYY-MM-DD'),
                                    'tgl_plat_nomor': core.moment(req.body.tgl_plat_nomor).format('YYYY-MM-DD'),
                                    'kapasitas': req.body.kapasitas,
                                    'kapasitas_maks': req.body.kapasitas_maks,
                                    'kubikasi': req.body.kubikasi,
                                    'foto': "",
                                    'foto_stnk': "",
                                    'tgl_update': Date.now(),
                                    'status': "1",
                                    'lat': "-6.3120400",
                                    'lon': "-6.106.8695370",
                                    'location': req.body.location,
                                    'engine': "OFF",
                                    'gpstime': Date.now(),
                                    'id_bu_brench': req.body.id_bu_brench ? parseInt(req.body.id_bu_brench) : 0



                                }
                            )
                            if (setData) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Berhasil menambahkan mobil baru'
                                    },
                                }

                            }
                        } else {
                            const getCodeAR = Number(getCodeVehicle[0].code_kendaraan.substring(2, 8))
                            const codeAR = getCodeAR + 1

                            const getcharacterNumber = codeAR.toString()

                            if (codeAR > 99999) {
                                output = {
                                    status: {
                                        code: 400,
                                        message: 'Gagal menginput data kode sudah maks di 99999'
                                    }
                                }
                            } else {
                                const getIDBu = getUser.id_bu === 11 ? 1 : getUser.id_bu === 21 ? 1 : 2;

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

                                const setData = await models.kendaraan.create(
                                    {
                                        'kode_kendaraan': req.body.kode_kendaraan,
                                        'code_kendaraan': "V" + getIDBu + zeroCode + codeAR,
                                        'id_driver': req.body.id_driver ? parseInt(req.body.id_driver) : 0,
                                        'no_polisi': req.body.no_polisi,
                                        'id_vendor': req.body.id_vendor ? parseInt(req.body.id_vendor) : 0,
                                        'vendor': req.body.vendor,
                                        'id_kendaraan_jenis': req.body.id_kendaraan_jenis ? parseInt(req.body.id_kendaraan_jenis) : 0,
                                        'jenis_kendaraan': req.body.jenis_kendaraan,
                                        'jenis_kepemilikan': req.body.jenis_kepemilikan,
                                        'merk_mobil': req.body.merk_mobil,
                                        'tahun_mobil': req.body.tahun_mobil,
                                        'warna_plat': req.body.warna_plat,
                                        'tgl_beli': core.moment(req.body.tgl_beli).format('YYYY-MM-DD'),
                                        'panjang': req.body.panjang,
                                        'lebar': req.body.lebar,
                                        'tinggi': req.body.tinggi,
                                        'no_bpkb': req.body.no_bpkb,
                                        'stnk': req.body.stnk,
                                        'tgl_stnk': core.moment(req.body.tgl_stnk).format('YYYY-MM-DD'),
                                        'tgl_kir': core.moment(req.body.tgl_kir).format('YYYY-MM-DD'),
                                        'tgl_plat_nomor': core.moment(req.body.tgl_plat_nomor).format('YYYY-MM-DD'),
                                        'kapasitas': req.body.kapasitas,
                                        'kapasitas_maks': req.body.kapasitas_maks,
                                        'kubikasi': req.body.kubikasi,
                                        'foto': req.files && req.files.cover ? req.files.cover[0].filename : "",
                                        'foto_stnk': req.files && req.files.foto_stnk ? req.files.foto_stnk[0].filename : "",
                                        'tgl_update': Date.now(),
                                        'status': "1",
                                        'lat': "-6.3120400",
                                        'lon': "-6.106.8695370",
                                        'location': req.body.location,
                                        'engine': "OFF",
                                        'gpstime': Date.now(),
                                        'id_bu_brench': req.body.id_bu_brench ? parseInt(req.body.id_bu_brench) : 0



                                    }
                                )
                                if (setData) {
                                    output = {
                                        status: {
                                            code: 200,
                                            message: 'Berhasil menambahkan mobil baru'
                                        },
                                    }

                                }
                            }
                        }
                    }
                } else {
                    output = {
                        status: {
                            code: 400,
                            message: "Mobil sudah terdaftar"
                        }
                    }
                }
            } else {
                output = {
                    status: {
                        code: 400,
                        message: "Belum login akun"
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
exports.editVehicle = async (req, res) => {
    try {
        const errorsFromMiddleware = await customErrorMiddleware(req)
        if (!errorsFromMiddleware) {


            const getUser = await models.users.findOne(
                {
                    where: {
                        id: req.user.id
                    }
                }
            )

            if (getUser) {
                const updData = await models.kendaraan.update(
                    {
                        kode_kendaraan: req.body.kode_kendaraan,
                        id_driver: req.body.id_driver ? parseInt(req.body.id_driver) : 0,
                        no_polisi: req.body.no_polisi,
                        vendor: req.body.vendor,
                        id_vendor: req.body.id_vendor ? parseInt(req.body.id_vendor) : 0,
                        jenis_kendaraan: req.body.jenis_kendaraan,
                        id_kendaraan_jenis: req.body.id_kendaraan_jenis ? parseInt(req.body.id_kendaraan_jenis) : 0,
                        jenis_kepemilikan: req.body.jenis_kepemilikan,
                        merk_mobil: req.body.merk_mobil,
                        tahun_mobil: req.body.tahun_mobil,
                        warna_plat: req.body.warna_plat,
                        tgl_beli: req.body.tgl_beli,
                        panjang: req.body.panjang ? parseFloat(req.body.panjang) : 0.00,
                        lebar: req.body.lebar ? parseFloat(req.body.lebar) : 0.00,
                        tinggi: req.body.tinggi ? parseFloat(req.body.tinggi) : 0.00,
                        no_bpkb: req.body.no_bpkb,
                        stnk: req.body.stnk,
                        tgl_stnk: req.body.tgl_stnk,
                        tgl_kir: req.body.tgl_kir,
                        tgl_plat_nomor: req.body.tgl_plat_nomor,
                        kapasitas: req.body.kapasitas ? parseInt(req.body.kapasitas) : 0,
                        kapasitas_maks: req.body.kapasitas_maks ? parseInt(req.body.kapasitas_maks) : 0,
                        kubikasi: req.body.kubikasi ? parseFloat(req.body.kubikasi) : 0.00,
                        foto: req.files && req.files.cover ? req.files.cover[0].filename : undefined,
                        foto_stnk: req.files && req.files.foto_stnk ? req.files.foto_stnk[0].filename : undefined,
                    },
                    {
                        where: {
                            id: parseInt(req.body.id)
                        }
                    }
                )
                if (updData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Berhasil mengubah data mobil'
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
exports.uploadPhoto = async (req, res) => {
    try {
        // Debug: Log struktur data yang diterima
        console.log('=== DEBUG UPLOAD PHOTO VEHICLE ===');
        console.log('req.files:', req.files);
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const uplPhoto = await models.kendaraan.update(
                {
                    foto: req.files && req.files.cover ? req.files.cover[0].filename : undefined,
                    foto_stnk: req.files && req.files.foto_stnk ? req.files.foto_stnk[0].filename : undefined
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
                        message: 'Berhasil upload photo'
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

exports.readyVehicle = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const UpdVeh = await models.kendaraan.update(
                {
                    status: "1"
                },
                {
                    where: {
                        id: req.body.id_vehicle,
                    }
                }
            )

            if (UpdVeh) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil set ready vehicle'
                    },
                }
            } else {
                output = {
                    status: {
                        code: 502,
                        message: 'Vehicle tidak berhasil di ubah'
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
exports.delVehicle = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id,
                }
            }
        )

        if (getUser) {
            const statusUpdate = await models.kendaraan.update(
                {
                    status: "0"
                },
                {
                    where: {
                        id: req.body.id_vehicle,

                    }
                }
            )

            if (statusUpdate) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil set off vehicle'
                    },
                }
            } else {
                output = {
                    status: {
                        code: 502,
                        message: 'Vehicle tidak berhasil di ubah'
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



exports.getType = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                // limit: limit,
                // offset: offset,
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const get = await models.kendaraan_jenis.findAndCountAll(
                {
                    order: [['id_kendaraan_jenis', 'desc']],
                    where: {
                        status: "1",
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_kendaraan_jenis: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },
                            ]
                        } : {}
                    }
                }
            )

            if (get.rows) {
                const result = get.rows.map((i) => {
                    return {
                        id: i.id_kendaraan_jenis,
                        type: i.nama_kendaraan_jenis,
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
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
exports.createType = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getType = await models.kendaraan_jenis.findOne(
                {
                    where: {
                        nama_kendaraan_jenis: req.body.jenis,
                        status: '1'

                    }
                }
            )

            if (!getType) {
                const updStatus = await models.kendaraan_jenis.create(
                    {
                        'nama_kendaraan_jenis': req.body.jenis,
                        'status': '1'
                    }
                )

                if (updStatus) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Berhasil menambahkan tipe kendaraan'
                        },
                    }
                }
            } else {
                output = {
                    status: {
                        code: 402,
                        message: 'tipe kendaraan sudah ada'
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
exports.delType = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const updStatus = await models.kendaraan_jenis.update(
                {
                    status: "0"
                },
                {
                    where: {
                        id_kendaraan_jenis: req.body.id
                    }
                }
            )

            if (updStatus) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil delete data type'
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