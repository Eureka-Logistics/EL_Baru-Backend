const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const { sumObjs } = require('../../config/core.config');
// const { Json } = require('sequelize/types/utils');
const CryptoJS = core.CryptoJS


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
            const getData = await models.m_bu_employee.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getbu = await models.m_bu.findAll({
                where: {
                    status: 1
                }
            })
            const getBuBrench = await models.m_bu_brench.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getEmployeePosition = await models.m_bu_employee_position.findAll(
                {

                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    user: getData,
                    bu: getbu,
                    buBrench: getBuBrench,
                    employePosition: getEmployeePosition
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

//bu
exports.getBU = async (req, res) => {
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
            const getdata = await models.m_bu.findAndCountAll(
                {
                    // where: {
                    //     status: "1"
                    // },
                    limit: limit,
                    offset: offset

                }
            )
            if (getdata.rows) {
                let no = (getdata.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getdata.rows.map((item) => {
                    return {
                        no: no++,
                        id: item.id,
                        buId: item.id_bu,
                        buCode: item.code_bu,
                        cbu: item.cbu,
                        buName: item.name_bu,
                        status: item.status


                    }


                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getdata.count,
                        totalPage: Math.ceil(getdata.count / req.query.limit),
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
exports.createBu = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDataBu = await models.m_bu.findOne(
                {
                    where: {
                        [Op.and]: [
                            {
                                status: 1,
                            },
                            {
                                name_bu: req.body.name,
                            },
                            {
                                id_bu: req.body.id_bu,
                            }
                        ]




                    }
                }
            )
            if (!getDataBu) {
                const createdataBu = await models.m_bu.create(
                    {
                        'id_bu': req.body.id_bu,
                        'code_bu': req.body.code,
                        'cbu': req.body.cbu,
                        'name_bu': req.body.name,
                        'status': 1,
                    }
                )
                if (createdataBu) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success create BU'
                        },
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'Bussines unit has already created'
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
exports.editBu = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        if (getUser) {
            const getBu = await models.m_bu.findOne(
                {
                    where: {
                        code_bu: req.body.code_bu,
                        cbu: req.body.cbu,
                        name_bu: req.body.name_bu,
                        id_bu: req.body.id_bu,
                        status: 1
                    }
                }
            )
            if (!getBu) {
                const updateData = await models.m_bu.update(
                    {
                        code_bu: req.body.code_bu,
                        id_bu: req.body.id_bu,
                        cbu: req.body.cbu, // length varchar (2)
                        name_bu: req.body.name_bu,
                    },
                    {
                        where: {
                            id: req.body.id
                        }
                    }
                )
                if (updateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success update Data'
                        },
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'BU has already added'
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
exports.delBu = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const delData = await models.m_bu.update(
                {
                    status: 0
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (delData) {
                output = {
                    status: {
                        code: 200,
                        message: "Data non aktif"

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
exports.getBuDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_bu.findOne(
                {
                    where: {
                        id: req.query.id
                    }
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
exports.activeBu = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const delData = await models.m_bu.update(
                {
                    status: 1
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (delData) {
                output = {
                    status: {
                        code: 200,
                        message: "Data active"

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


//bu braanch
exports.getBuBranch = async (req, res) => {
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
            const getData = await models.m_bu_brench.findAndCountAll(
                {
                    where: {
                        status: 1
                    },
                    limit: limit,
                    offset: offset
                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        buId: item.id_bu,
                        bubrenchId: item.id_bu_brench,
                        buBrenchName: item.name_bu_brench,
                        buCode: item.code_bu_brench,
                        alamat: item.alamat,
                        noTelp: item.no_telp,
                        status: item.status


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
exports.getSelectBuBranch = async (req, res) => {
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
            if (getBu) {
                const response = {
                    BU: getBu.map((i) => {
                        return {
                            id: i.id_bu,
                            codeBu: i.code_bu,
                            nameBu: i.name_bu,
                        }
                    }),
                }
                if (response) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get data'
                        },
                        data: response
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

// exports.getBuBranch = async (req, res) => {
//     try {

//         const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         const getData = await models.m_bu_brench.findAndCountAll(
//             {
//                 where: {
//                     status: 1
//                 }
//             }
//         )
//         if (getData.rows) {
//             let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
//             const result = getData.rows.map((item) => {
//                 return {
//                     no: no++,
//                     buId: item.id_bu,
//                     bubrenchId: item.id_bu_brench,
//                     buCode: item.code_bu_brench,
//                     status: item.status


//                 }


//             })
//             output = {
//                 status: {
//                     code: 200,
//                     message: 'Success get Data'
//                 },
//                 data: {

//                     totalData: getData.count,
//                     totalPage: Math.ceil(getData.count / req.query.limit),
//                     limit: Number(req.query.limit),
//                     currentPage: Number(req.query.page),
//                     order: result


//                 }

//             }
//         }

//     } catch (error) {
//         output = {
//             status: {
//                 code: 500,
//                 message: error.message
//             }
//         }
//     }

//     const errorsFromMiddleware = await customErrorMiddleware(req)

//     if (!errorsFromMiddleware) {
//         res.status(output.status.code).send(output)
//     } else {
//         res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
//     }
// }

exports.createBuBranch = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getBuBranch = await models.m_bu_brench.findOne(
                {
                    where: {
                        code_bu_brench: req.body.code_bu_brench,
                        id_bu: req.body.id_bu,
                        id_bu_brench: req.body.id_bu_brench,
                    }
                }
            )
            if (!getBuBranch) {
                const creatData = await models.m_bu_brench.create(
                    {
                        'id_bu_brench': req.body.id_bu_brench,
                        'code_bu_brench': req.body.code_bu_brench,
                        'name_bu_brench': req.body.name_bu_brench,
                        'id_bu': req.body.id_bu,
                        'alamat': req.body.alamat,
                        'no_telp': req.body.no_telp,
                        'status': 1
                    }
                )
                if (creatData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success create Data'
                        },
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'code BU has already created'
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

exports.editBuBrench = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        // const getBuBrench = await models.m_bu_brench.findOne(
        //     {
        //         where: {
        //             // code_bu_brench: req.body.code_bu_brench,
        //             id_bu_brench: req.body.id_bu_brench,

        //             // id_bu: req.body.id_bu,
        //             status: 1,
        //         }
        //     }
        // )
        if (getUser) {
            const editData = await models.m_bu_brench.update(
                {
                    code_bu_brench: req.body.code_bu_brench,
                    id_bu: req.body.id_bu,
                    name_bu_brench: req.body.name_bu_brench,
                    alamat: req.body.alamat,
                    no_telp: req.body.no_telp,
                    id_bu_brench: req.body.id_bu_brench
                },
                {
                    where: {
                        id_bu_brench: req.body.id_bu_brench
                    }
                }
            )
            if (editData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update Data'
                    },
                }

            }
        }
        // else {
        //     output = {
        //         status: {
        //             code: 402,
        //             message: "Code Bu has already created"
        //         }
        //     }
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

exports.delBuBrench = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const delData = await models.m_bu_brench.update(
                {
                    status: 0
                },
                {
                    where: {
                        id_bu_brench: req.body.id_bu_brench
                    }
                }
            )
            if (delData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success delete Data'
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
exports.getBuBrenchDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_bu_brench.findOne(
                {
                    where: {
                        id_bu_brench: req.query.id_bu_brench
                    }
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

//bu employe
exports.getSelectBuEmployee = async (req, res) => {
    try {
        models.m_bu_brench.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        models.m_bu_employee_position.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'code_employee_position' });


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
                    where: {
                        status: 1
                    },
                    include: [
                        {
                            model: models.m_bu
                        }
                    ]
                }
            )

            const getBuEmploye = await models.m_bu_employee_position.findAll({
                include: [
                    {
                        model: models.m_bu_employee
                    }
                ]
            })
            if (getBu && getBuBrench && getBuEmploye) {
                const response = {
                    BU: getBu.map((i) => {
                        return {
                            id: i.id_bu,
                            codeBu: i.code_bu,
                            nameBu: i.name_bu,
                        }
                    }),
                    BuBrench: getBuBrench.map((i) => {
                        return {
                            idBuBrench: i.id_bu_brench,
                            codeBuBrench: i.code_bu_brench,
                            // nameBu: i.m_bu.name_bu,
                        }
                    }),
                    BuEmployee: getBuEmploye.map((i) => {
                        return {
                            codeEmployeePosition: i.code_employee_position,
                            namePosition: i.name_employee_position,
                            name: i.m_bu_employee == null ? "-" : i.m_bu_employee.fullname,

                        }
                    }),
                    designation: [
                        {
                            'designation': 'Group Leader'
                        },
                        {
                            'designation': 'Assistant Manager'
                        },
                        {
                            'designation': 'Staff'
                        },
                        {
                            'designation': 'Manager'
                        },
                        {
                            'designation': 'Kacab'
                        },
                        {
                            'designation': 'Konsultan'
                        },
                        {
                            'designation': 'Security'
                        },
                        {
                            'designation': 'Koordinator'
                        },

                    ]
                }
                if (response) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success get data'
                        },
                        data: response
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
exports.getBuEmployeDetail = async (req, res) => {
    try {
        models.m_bu_employee.belongsTo(models.m_bu_employee_position, { targetKey: 'id_employee_position', foreignKey: 'code_employee_position' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_bu_employee.findOne(
                {
                    where: {
                        id_employee: req.query.id_employee
                    },
                    include: [
                        {
                            model: models.m_bu_employee_position
                        }
                    ]
                }
            )
            const getBu = await models.m_bu.findOne(
                {
                    where: {
                        id_bu: getDetail.id_bu
                    }
                }

            )
            const getBuBrench = await models.m_bu_brench.findOne(
                {
                    where: {
                        id_bu_brench: getDetail.id_bu_brench
                    }
                }

            )
            const getGl = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_gl
                    }
                }

            )
            const positionGl = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_gl
                    }
                }

            )
            const getAsm = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_asm
                    }
                }

            )
            const positionAsm = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_asm
                    }
                }

            )
            const getMgr = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_mgr
                    }
                }

            )
            const positionMgr = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_mgr
                    }
                }

            )
            const getKacab = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_kacab
                    }
                }


            )
            const positionKacab = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_kacab
                    }
                }

            )
            const getAmd = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_amd
                    }
                }

            )
            const positionAmd = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: getDetail.id_amd
                    }
                }

            )

            if (getDetail) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    id: getDetail.id_employee,
                    employeeCode: getDetail.code_employee,
                    name: getDetail == null ? "-" : getDetail.fullname,
                    category: getDetail.category,
                    division: getDetail.division,
                    job_level: getDetail.job_level,
                    designation: getDetail.designation,
                    code_employee_position: getDetail.code_employee_position,
                    position: getDetail?.m_bu_employee_position == null ? "-" : getDetail?.m_bu_employee_position?.name_employee_position,
                    buId: getDetail.id_bu,
                    bu: getBu == null ? "-" : getBu.name_bu,
                    id_bu_brench: getDetail.idBuBrench,
                    buBrench: getBuBrench == null ? "-" : getBuBrench.name_bu_brench,
                    idGl: getDetail.id_gl,
                    gl: getGl == null ? "-" : getGl.fullname,
                    positionGl: positionGl?.name_employee_position,
                    idAsm: getDetail.id_asm,
                    asm: getAsm == null ? "-" : getAsm.fullname,
                    positionAsm: positionAsm?.name_employee_position,
                    idMgr: getDetail.id_mgr,
                    mgr: getMgr == null ? "-" : getMgr.fullname,
                    positionMgr: positionMgr?.name_employee_position,
                    idKacab: getDetail.id_kacab,
                    kacab: getKacab == null ? "-" : getKacab.fullname,
                    positionKacab: positionKacab?.name_employee_position,
                    idAmd: getDetail.id_amd,
                    amd: getAmd == null ? "-" : getAmd == null ? "-" : getAmd.fullname,
                    positionAmd: positionAmd == null ? "-" : positionAmd?.name_employee_position,
                    noTelp: getDetail.no_telp,
                    email: getDetail.email,
                    photo: getDetail.photo,




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

exports.getBuEmploye = async (req, res) => {
    try {

        models.m_bu_employee.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        models.m_bu_employee.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });
        models.m_bu_employee.belongsTo(models.m_bu_employee_position, { targetKey: 'name_employee_position', foreignKey: 'code_employee_position' });

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_bu_employee.findAll(
                {
                    where: {
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
                    },
                    limit: limit,
                    offset: offset,
                    group: ['id_employee'],
                    order: [['id_employee', 'desc']],
                    include: [
                        {
                            model: models.m_bu
                        },
                        {
                            model: models.m_bu_brench
                        },
                        {
                            model: models.m_bu_employee_position,
                            // as: 'gl'
                        },

                    ],

                }
            )
            const getCount = await models.m_bu_employee.count({
                where: {
                    status: 1
                }
            });
            if (getData) {
                let no = (getData.length > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.map((item) => {
                    return {
                        no: no++,
                        id: item.id,
                        idEmploye: item.id_employee,
                        employeCode: item.code_employee,
                        employeeCodePosition: item.code_employee_position,
                        position: item.m_bu_employee_position?.name_employee_position,
                        employeeName: item.fullname,
                        levelJob: item.job_level,
                        designation: item.designation,
                        BU: item.m_bu == null ? "-" : item.m_bu.name_bu,
                        BuBrench: item.m_bu_brench == null ? "-" : item.m_bu_brench.code_bu_brench,
                        idGl: item.id_gl,
                        idAsm: item.id_asm,
                        idMgr: item.id_mgr,
                        idKacab: item.id_kacab,
                        idAmd: item.id_amd,
                        noTelp: item.no_telp,
                        email: item.email,
                        photo: item.photo


                    }


                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getCount,
                        totalPage: Math.ceil(getCount / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: result


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
exports.createBuEmployee = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee: req.body.code_employee,
                        fullname: req.body.fullname,


                    }
                }
            )
            if (!getData) {
                const createData = await models.m_bu_employee.create(
                    {
                        'code_employee': req.body.code_employee,
                        'fullname': req.body.fullname,
                        'job_level': req.body.job_level,
                        'designation': req.body.designation,
                        'code_employee_position': req.body.code_employee_position,
                        'id_bu': req.body.id_bu,
                        'id_bu_brench': req.body.id_bu_brench,
                        'id_gl': req.body.id_gl,
                        'id_asm': req.body.id_asm,
                        'id_mgr': req.body.id_mgr,
                        'id_kacab': req.body.id_kacab,
                        'id_amd': req.body.id_amd,
                        'no_telp': req.body.no_telp,
                        'email': req.body.email,
                        'photo': req.body.photo,
                        'status': 1

                    }
                )
                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success create BU Employee'
                        },
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'BU Employee has already added'
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
exports.editBuEmployee = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            // const getData = await models.m_bu_employee.findAll(
            //     {
            //         where: {
            //             code_employee: req.body.code_employee,
            //             fullname: req.body.fullname,


            //         }
            //     }
            // )
            // if (!getData) {
            const createData = await models.m_bu_employee.update(
                {
                    code_employee: req.body.code_employee,
                    fullname: req.body.fullname,
                    job_level: req.body.job_level,
                    designation: req.body.designation,
                    code_employee_position: req.body.code_employee_position,
                    id_bu: req.body.id_bu,
                    id_bu_brench: req.body.id_bu_brench,
                    id_gl: req.body.id_gl,
                    id_asm: req.body.id_asm,
                    id_mgr: req.body.id_mgr,
                    id_kacab: req.body.id_kacab,
                    id_amd: req.body.id_amd,
                    no_telp: req.body.no_telp,
                    email: req.body.email,
                    photo: req.body.photo,


                },
                {
                    where: {
                        id_employee: req.body.id_employee
                    }
                }
            )
            if (createData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update BU Employee'
                    },
                }
            }
        }
        // else {
        //     output = {
        //         status: {
        //             code: 402,
        //             message: 'BU Employee has already added'
        //         },
        //     }
        // }

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


exports.getSelectAddemployeePosition = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_bu_employee.findAll(
                {
                    order: [['id_employee', 'desc']],
                    where: {
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
                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update BU Employee'
                    },
                    employee: getData.map((i) => {
                        return {
                            id_employee: i.id_employee,
                            name: i.fullname,
                            codeEmployeePosition: i.code_employee_position == null || i.code_employee_position == "" ? "-" : i.code_employee_position
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

exports.addEmployeePosition = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            getPosition = await models.m_bu_employee.findOne(
                {
                    where: {
                        code_employee_position: req.body.code_employee_position
                    }
                }
            )
            getEmployee = await models.m_bu_employee.findOne(
                {
                    where: {
                        id_employee: req.body.id_employee
                    }
                }
            )
            if (!getPosition) {
                const addData = await models.m_bu_employee.update(
                    {
                        code_employee_position: req.body.code_employee_position
                    },
                    {
                        where: {
                            id_employee: req.body.id_employee
                        }
                    }
                )
                if (addData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success add Employee Position or Employee has been positoned'
                        },
                    }



                }

            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'Posisi has been added to another employee'
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

exports.delEmployeePosition = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const delData = await models.m_bu_employee.update(
                {
                    code_employee_position: ""
                },
                {
                    where: {
                        id_employee: req.body.id_employee
                    }
                }
            )
            if (delData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success delete Employee Position'
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
//bu employee position

exports.buEmployeePostionFilter = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                filter: [
                    {
                        "value": "G",
                        "position": "GL"
                    },
                    {
                        "value": "A",
                        "position": "ASM"
                    },
                    {
                        "value": "M",
                        "position": "MGR"
                    },
                    {
                        "value": "K",
                        "position": "KACAB"
                    },
                    {
                        "value": "Z",
                        "position": "AMD"
                    },
                    {
                        "value": "D",
                        "position": "AMD"
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

exports.getBuEmployePosition = async (req, res) => {
    try {

        // models.m_bu_employee.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu' });
        // models.m_bu_employee.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });
        // models.m_bu_employee.belongsTo(models.m_bu_employee_position, { as: "gl", targetKey: 'code_employee_position', foreignKey: 'id_gl' });
        // models.m_bu_employee.belongsTo(models.m_bu_employee_position, { as: "asm", targetKey: 'code_employee_position', foreignKey: 'id_asm' });
        // models.m_bu_employee.belongsTo(models.m_bu_employee_position, { as: "mgr", targetKey: 'code_employee_position', foreignKey: 'id_mgr' });
        // models.m_bu_employee.belongsTo(models.m_bu_employee_position, { as: "kacab", targetKey: 'code_employee_position', foreignKey: 'id_kacab' });
        models.m_bu_employee_position.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'code_employee_position' });




        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.m_bu_employee_position.findAndCountAll(
                {
                    ...req.query.filter ? {
                        where: {
                            [Op.or]: [
                                {
                                    code_employee_position: {
                                        [Op.like]: `${req.query.filter}%`
                                    },

                                },


                            ]
                        },

                    } : {},


                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_bu_employee
                        }
                    ]

                }
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        id: item.id_employee_position,
                        code: item.code_employee_position,
                        position: item.name_employee_position,
                        employeeId: item.m_bu_employee == null ? "-" : item.m_bu_employee.id_employee,
                        name: item.m_bu_employee == null ? "-" : item.m_bu_employee.fullname


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
                        order: req.query.filter ? result : {}


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
exports.getBuEmployePositionDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        id_employee_position: req.query.id_employee_position
                    }
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

// exports.getBuEmployeDetail = async (req, res) => {
//     try {
//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const getDetail = await models.m_bu_employee.findOne(
//                 {
//                     where: {
//                         id_employee: req.query.id_employee
//                     }
//                 }
//             )
//             if (getDetail) {
//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Success get Data'
//                     },
//                     data: getDetail
//                 }

//             }

//         }
//     } catch (error) {
//         output = {
//             status: {
//                 code: 500,
//                 message: error.message
//             }
//         }
//     }

//     const errorsFromMiddleware = await customErrorMiddleware(req)

//     if (!errorsFromMiddleware) {
//         res.status(output.status.code).send(output)
//     } else {
//         res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
//     }
// }

exports.createBuEmployeePosition = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: req.body.code_employee_position,
                        name_employee_position: req.body.name_employee_position
                    }
                }
            )

            if (!getData) {
                const createData = await models.m_bu_employee_position.create(
                    {
                        'code_employee_position': req.body.code_employee_position,
                        'name_employee_position': req.body.name_employee_position
                    }
                )
                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success create Data'
                        },
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'BU Employee Position has already created'
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
exports.editBuEmployeePosition = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_bu_employee_position.findOne(
                {
                    where: {
                        code_employee_position: req.body.code_employee_position,
                        name_employee_position: req.body.name_employee_position
                    }
                }
            )

            if (!getData) {
                const createData = await models.m_bu_employee_position.update(
                    {
                        code_employee_position: req.body.code_employee_position,
                        name_employee_position: req.body.name_employee_position
                    },
                    {
                        where: {
                            id_employee_position: req.body.id_employee_position
                        }
                    }
                )
                if (createData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success update Data'
                        },
                    }
                }
            }
            else {
                output = {
                    status: {
                        code: 402,
                        message: 'BU Employee Position has already created'
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

// exports.delBuEmployeePositio = async (req, res) => {
//     try {
//         const getUser = await models.users.findOne(
//             {

//             }
//         )
//     } catch (error) {

//     }
// }

exports.getAllBU = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(
            Number(req.query.limit),
            Number(req.query.page)
        );

        const getdata = await models.m_bu.findAndCountAll({
            // where: {
            //     status: "1"
            // },
            limit: limit,
            offset: offset
        });

        if (getdata.rows) {
            let no =
                getdata.count > 0
                    ? (req.query.page - 1) * req.query.limit + 1
                    : 0;

            const result = getdata.rows.map((item) => {
                return {
                    no: no++,
                    id: item.id,
                    buId: item.id_bu,
                    buCode: item.code_bu,
                    cbu: item.cbu,
                    buName: item.name_bu,
                    status: item.status,
                };
            });

            output = {
                status: {
                    code: 200,
                    message: "Success get Data",
                },
                data: {
                    totalData: getdata.count,
                    totalPage: Math.ceil(getdata.count / req.query.limit),
                    limit: Number(req.query.limit),
                    currentPage: Number(req.query.page),
                    order: result,
                },
            };
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message,
            },
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
};

exports.getAllBUBrench = async (req, res) => {
    try {
        const { limit, offset } = core.getPagination(
            Number(req.query.limit),
            Number(req.query.page)
        );

        const getdata = await models.m_bu_brench.findAndCountAll({
            limit: limit,
            offset: offset
        });

        if (getdata.rows) {
            let no =
                getdata.count > 0
                    ? (req.query.page - 1) * req.query.limit + 1
                    : 0;

            const result = getdata.rows.map((item) => {
                return {
                    // no: no++,
                    id: item.id,
                    id_bu_brench: item.id_bu_brench,
                    code_bu_brench: item.code_bu_brench,
                    name_bu_brench: item.name_bu_brench,
                    wilayah: item.wilayah,
                    id_bu: item.id_bu,
                    alamat: item.alamat,
                    no_telp: item.no_telp,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    status: item.status,
                };
            });

            output = {
                status: {
                    code: 200,
                    message: "Success get Data",
                },
                data: {
                    totalData: getdata.count,
                    totalPage: Math.ceil(getdata.count / req.query.limit),
                    limit: Number(req.query.limit),
                    currentPage: Number(req.query.page),
                    order: result,
                },
            };
        }
    } catch (error) {
        output = {
            status: {
                code: 500,
                message: error.message,
            },
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status.code).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
};




