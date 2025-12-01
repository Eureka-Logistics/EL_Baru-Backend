const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');


exports.getReportSales = async (req, res) => {
    try {

        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });

        // models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getReport = await models.m_pengadaan.findAndCountAll(
                {
                    order: [['id_mp', 'desc']],
                    limit: limit,
                    offset: offset,

                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            required: true
                            // required:true,
                            // group: ['msp'],

                        },
                        {
                            model: models.users,

                            // ...req.query.filter ? {
                            //     where: {
                            //         divisi: "sales",
                            //         [Op.or]: [
                            //             {

                            //                 kode_cabang: {
                            //                     [Op.like]: `%${req.query.filter}%`
                            //                 },

                            //             },

                            //         ]
                            //     }
                            // } : {}
                        }
                    ]
                }
            )
            if (getReport.rows) {
                let no = (getReport.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getReport.rows.map((item) => {
                    const getPrice = getReport.rows.map((item) => item.m_pengadaan_details.map((i) => { return i.harga }))

                    // console.log("🚀 ~ file: report.controller.js:65 ~ result ~ getPrice:", getPrice)

                    return {
                        no: no++,
                        idmp: item.id_mp,
                        SpNumber: item.msp,
                        salesName: item.user.nama_lengkap,
                        totalPrice: core.sumArray(item.m_pengadaan_details.map((i) => { return i.harga }))








                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getReport.count,
                        totalPage: Math.ceil(getReport.count / req.query.limit),
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