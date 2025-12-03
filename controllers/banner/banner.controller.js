const { off } = require('process');
const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');
const CryptoJS = core.CryptoJS



exports.uploadBanner = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            if (!req.file) {

                output = {
                    status: {
                        code: 400,
                        message: 'gagal menambahan, foto tidak boleh kosong'
                    }
                }

            }



            else {
                const addPosition = await models.banner_elogs.create(
                    {
                        name: req.body.name,
                        description: req.body.description,
                        sort: 0,
                        picture: "",
                        status: 1,
                        picture: req.file.filename,
                    }
                )

                if (addPosition) {

                    output = {
                        status: {
                            code: 200,
                            message: 'berhasil menambahkan banner'

                        },
                    }



                }
            }


        }

        // }
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
exports.getBannerAdmin = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

            const getBanner = await models.banner.findAll(
                {
                    order: [['updated_at', 'desc']],
                    // where: {
                    //     type: "elogs"
                    // },
                    limit: limit,
                    offset: offset
                }
            )
            if (getBanner) {

                output = {
                    status: {
                        code: 200,
                        message: 'berhasil mmendapatkan banner'
                    },
                    data: getBanner.map((i) => {
                        return {
                            id: i.id_banner,
                            name: i.name,
                            description: i.description,
                            picture: "https://apirace.eurekalogistics.co.id/iamges/banner/" + i.picture,
                            status: i.status,
                            sort: i.sort,
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
exports.getBannerWeb = async (req, res) => {
    try {
        // const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getBanner = await models.banner_elogs.findAll(
            {
                order: [['sort', 'asc']],
                where: {
                    status: 1,
                    // sort: { [Op.ne]: 0 }
                },
                // limit: limit,
                // offset: offset
            }
        )
        if (getBanner) {

            output = {
                status: {
                    code: 200,
                    message: 'berhasil mmendapatkan banner'
                },
                data: getBanner.map((i) => {
                    return {
                        id: i.id_banner,
                        name: i.name,
                        description: i.description,
                        // picture: "https://apirace.eurekalogistics.co.id/assets/banner/" + i.picture,
                        status: i.status,
                        urutan: i.sort
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

exports.AktifBanner = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.banner.update(
                {
                    status: 1
                },
                {
                    where: {
                        id_banner: req.body.id_banner
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: "Succes set banner active"
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
exports.NonAktifBanner = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.banner.update(
                {
                    status: 0
                },
                {
                    where: {
                        id_banner: req.body.id_banner
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: "Succes set Banner Non Aktif"
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
exports.setSortingBanner = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getSortOld = await models.banner.findOne(
                {
                    where: {
                        sort: req.body.sort
                    }
                }
            )
            const getSortNew = await models.banner.findOne(
                {
                    where: {
                        id_banner: req.body.id
                    }
                }
            )
            if (getSortOld) {
                const setSortingOld = await models.banner.update(
                    {
                        sort: getSortNew.sort
                    },
                    {
                        where: {
                            id_banner: getSortOld.id_banner
                        }
                    }
                )

                const setSortingNew = await models.banner.update(
                    {
                        sort: req.body.sort
                    },
                    {
                        where: {
                            id_banner: req.body.id
                        }
                    }
                )
                if (setSortingNew && setSortingOld) {
                    output = {
                        status: {
                            code: 200,
                            message: "Succes sorting Data"
                        }
                    }
                }



            }
            else {
                const setSortingNew = await models.banner.update(
                    {
                        sort: req.body.sort
                    },
                    {
                        where: {
                            id_banner: req.body.id
                        }
                    }
                )
                if (setSortingNew) {
                    output = {
                        status: {
                            code: 200,
                            message: "Succes sorting Data"
                        }
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

exports.setSortingBanner2 = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updateData = await models.banner.bulkUpdate(
                req.body.sort.map((sort, index) => ({ sort })),
                {
                    where: {
                        id_banner: {
                            [Op.in]: req.body.ids // req.body.ids merupakan array yang berisi ID yang ingin di-update
                        }
                    }
                }
            );
            if (updateData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Succes Update Data'
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
