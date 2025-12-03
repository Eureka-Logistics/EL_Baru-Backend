const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const CryptoJS = core.CryptoJS


exports.getUserAll = async (req, res) => {


    const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const get = await models.users.findAndCountAll(
                {
                    order: [['id', 'desc']],
                    // ...req.query.divisi ? {
                    where: {
                        status: 1,
                        // divisi: req.query.divisi,
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_lengkap: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },
                                // {
                                //     username: {
                                //         [Op.like]: `%${req.query.keyword}%`
                                //     },

                                // },


                            ]
                        } : {}
                    },
                    // } : {},
                    limit: limit,
                    offset: offset,
                }
            )
            if (get.rows) {
                let no = (get.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = get.rows.map((item) => {
                    return {
                        no: no++,
                        userId: item.id,
                        username: item.username,
                        fullname: item.nama_lengkap,
                        email: item.email,
                        no_telp: item.no_telp == "" ? "-" : item.no_telp,
                        perusahaan: item.perusahaan,
                        kode_cabang: item.kode_cabang,
                        level: item.level,
                        divisi: item.divisi,

                    }
                })
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: get.count,
                        totalPage: Math.ceil(get.count / req.query.limit),
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

exports.getSelecetUser = async (req, res) => {
    try {

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getlevelUser = await models.users_level.findAll(
                {
                    order: [['id', 'desc']],
                    where: {
                        aktif: "Y",
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    levels: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },
                                {
                                    kode_level: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}

                    }
                }
            )
            const getcabangUser = await models.cabang.findAll(
                {
                    order: [['id_cabang', 'desc']],
                    where: {

                        ...req.query.keyword1 ? {
                            [Op.or]: [
                                {
                                    cabang: {
                                        [Op.like]: `%${req.query.keyword1}%`
                                    },

                                },
                                {
                                    kode_cabang: {
                                        [Op.like]: `%${req.query.keyword1}%`
                                    },

                                },


                            ]
                        } : {}

                    }
                }
            )
            const getGroupUser = await models.users_group.findAll(
                {
                    order: [['id', 'desc']],
                    where: {
                        aktif: "Y",
                        ...req.query.keyword2 ? {
                            [Op.or]: [
                                {
                                    groups: {
                                        [Op.like]: `%${req.query.keyword2}%`
                                    },

                                },

                            ]
                        } : {}

                    }

                }
            )
            if (getlevelUser && getcabangUser && getGroupUser) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    levelUser: getlevelUser.map((i) => {
                        return {
                            id: i.id,
                            levelUser: i.levels
                        }
                    }),
                    cabang: getcabangUser.map((i) => {
                        return {
                            id: i.id_cabang,
                            kodecabang: i.kode_cabang,
                            cabang: i.cabang,
                        }
                    }),
                    group: getGroupUser.map((i) => {
                        return {
                            id: i.id,
                            group: i.groups
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

exports.createUser = async (req, res) => {
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
                const getdataUser = await models.users.findOne(
                    {
                        where: {
                            // email: req.body.email,
                            username: req.body.username,
                            status: 1
                        }
                    }
                )
                if (!getdataUser) {
                    const createusr = await models.users.create(
                        {
                            'id_karyawan': 0,
                            'proposal': 0,
                            'username': req.body.username,
                            'password': "e10adc3949ba59abbe56e057f20f883e",
                            'nama_lengkap': req.body.nama_lengkap,
                            'als': "",
                            'email': req.body.email,
                            'foto': "",
                            'no_telp': req.body.no_telp,
                            'id_cabang': req.body.id_cabang,
                            'perusahaan': req.body.perusahaan,
                            'kode_cabang': req.body.kode_cabang,
                            'level': req.body.level,
                            'divisi': req.body.divisi,
                            'user_level': req.body.user_level,
                            'user_group': req.body.user_group,
                            'aktif': "Y",
                            'id_session': "",
                            'tgl_login': core.moment(Date.now()).format('YYYY-MM-DD dd-mm-ss'),
                            'status': 1,
                            'lat': '-6.3217499',
                            'lon': '106.8696286',
                            'koordinator': 0
                        }
                    )
                    if (createusr) {
                        output = {
                            status: {
                                code: 200,
                                message: 'succes create user'
                            }
                        }

                    }
                }
                else {
                    output = {
                        status: {
                            code: 402,
                            message: 'user sudah ada'
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

exports.editUser = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updUser = await models.users.update(
                {

                    username: req.body.username,
                    nama_lengkap: req.body.nama_lengkap,
                    email: req.body.email,
                    foto: "",
                    no_telp: req.body.no_telp,
                    id_cabang: req.body.id_cabang,
                    perusahan: req.body.perusahaan,
                    kode_cabang: req.body.kode_cabang,
                    level: req.body.level,
                    divisi: req.body.divisi,
                    user_level: req.body.user_level,
                    user_group: req.body.user_group,


                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (updUser) {
                output = {
                    status: {
                        code: 200,
                        message: 'succes update user'
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

exports.delUser = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const deleteUser = await models.users.update(
                {
                    status: 0
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            if (deleteUser) {
                output = {
                    status: {
                        code: 200,
                        message: 'succes delete user'
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


exports.greetingMassage = async (req, res) => {
    try {

    } catch (error) {

    }
}

exports.getAllUserCommanCenter = async (req, res) => {
  const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

  try {
    const users = await models.users.findAndCountAll({
      order: [["id", "desc"]],
      where: {
        status: 1,
        ...(req.query.keyword && {
          [Op.or]: [
            {
              nama_lengkap: {
                [Op.like]: `%${req.query.keyword}%`,
              },
            },
            // Tambahkan pencarian username kalau perlu
            // {
            //   username: {
            //     [Op.like]: `%${req.query.keyword}%`,
            //   },
            // },
          ],
        }),
      },
      limit,
      offset,
    });

    let no = users.count > 0 ? (req.query.page - 1) * req.query.limit + 1 : 0;

    const result = users.rows.map((user) => ({
      no: no++,
      userId: user.id,
      username: user.username,
      fullname: user.nama_lengkap,
      email: user.email,
      no_telp: user.no_telp === "" ? "-" : user.no_telp,
      perusahaan: user.perusahaan,
      kode_cabang: user.kode_cabang,
      level: user.level,
      divisi: user.divisi,
    }));

    const output = {
      status: {
        code: 200,
        message: "Success get Data",
      },
      data: {
        totalData: users.count,
        totalPage: Math.ceil(users.count / req.query.limit),
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
