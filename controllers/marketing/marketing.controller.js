const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where } = require('sequelize');
const db = require('../../config/db.config');
const { mode } = require('crypto-js');


exports.getSchedule = async (req, res) => {
    try {
        models.m_task.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_user' });
        models.m_task.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        // models.m_sm.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_task.findAndCountAll(
                {

                    where: {
                        ...req.query.id_user ? {
                            id_user: req.query.id_user
                        } : {},
                        ...req.query.datetask ? {
                            datetask: req.query.datetask
                        } : {},


                    },

                    order: [['id_task', 'desc']],
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.customer
                        },
                        {
                            model: models.users,
                            // where: {
                            //     divisi: req.query.divisi
                            // }
                        },
                    ]
                    // where: {

                    // }
                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((i) => {
                    return {
                        no: no++,
                        taskId: i.id_task,
                        userId: i.user.id,
                        marketing: i.user.nama_lengkap,
                        divisi: i.user.divisi,
                        customer: i.customer == null ? "-" : i.customer.nama_perusahaan,
                        typeTask: i.task_type,
                        porspek: i.porspek,
                        memo: i.memo,
                        dateTask: i.datetask,
                        dateCreated: core.moment(i.datecreate).format('YYYY-MM-DD hh:mm:ss')

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

                // const result = await models.
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


exports.getDetailKunjungan = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_taskrespon.findAll(
                {
                    ...req.query.id_task ? {
                        where: {
                            id_task: req.query.id_task
                        }
                    } : {}
                }
            )
            if (getDetail) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getDetail
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
            const getdataSales = await models.users.findAll(
                {
                    where: {
                        divisi: "sales"
                    }
                }
            )
            const getCustomer = await models.customer.findAll()

            if (getCustomer && getdataSales) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    customer: getCustomer.map((i) => {
                        return {
                            idCustomer: i.id_customer,
                            customer: i.nama_perusahaan
                        }
                    }),
                    marketing: getdataSales.map((i) => {
                        return {
                            idMarketing: i.id,
                            marketing: i.nama_lengkap
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

exports.createTask = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const createData = await models.m_task.create(
                {
                    'id_user': req.body.id_user,
                    'id_customer': req.body.id_customer,
                    'task_type': req.body.task_type,
                    'prospect': req.body.prospect,
                    'memo': req.body.memo,
                    'datetask': req.body.datetask,
                    'datecreate': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                    'tahu_1': 0,
                    'tahu_2': 0,
                    'tahu_3': 0,
                }
            )


            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success create task planing'
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

exports.createTaskDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const createDetail = await models.m_taskrespon.create(
                {
                    'id_task': req.body.id_task,
                    'bertemu': req.body.bertemu,
                    'jabatan': req.body.jabatan,
                    'tagihan': req.body.tagihan,
                    'dapat': req.body.dapat,
                    'aktivitas': req.body.aktivitas,
                    'positif': req.body.positif,
                    'negatif': req.body.negatif,
                    'peluang': req.body.peluang,
                    'hambatan': req.body.hambatan,
                    'img_a': req.body.img_a,
                    'img_b': req.body.img_b,
                    'img_c': req.body.img_c,

                }
            )
            if (createDetail) {
                output = {
                    status: {
                        code: 200,
                        message: "succses create task result"
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