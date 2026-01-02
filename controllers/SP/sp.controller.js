const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op, Sequelize, where, DATE } = require('sequelize');
const { mode } = require('crypto-js');
const e = require('express');
const CryptoJS = core.CryptoJS
const db = require("../../config/db.config");
const mysql = require('mysql2');
const ExcelJS = require('exceljs');


//SALES


// exports.getSelectCreateSp = async (req, res) => {
//     try {
//         models.customer.belongsTo(models.customer_npwp, { targetKey: 'customer_id', foreignKey: 'id_customer' });
//         models.customer.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
//         models.m_bu_employee.belongsTo(models.users, { targetKey: 'id_karyawan', foreignKey: 'id_employee' });
//         models.users.belongsTo(models.m_bu_employee, { targetKey: 'id_employee', foreignKey: 'id_karyawan' });


//         models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota' });

//         const datenow = core.moment(Date.now()).format('YY')

//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )

//         const getPerusahaan = await models.m_bu.findOne(
//             {
//                 where: {
//                     id_bu: getUser.id_bu
//                 }
//             }
//         )

//         const getCabang = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const getCode = await models.m_pengadaan.findAll(
//                 {
//                     order: [['id_mp', 'desc']],
//                     limit: 1,
//                     where: {
//                         msp: {
//                             [Op.like]: `%${getUser.id_bu}-SO-%`
//                         },
//                     }
//                 }
//             )
//             if (getCode != "") {

//                 const getcodeSp = Number(getCode[0].msp.substring(9, 16))
//                 const spCode = getcodeSp + 1

//                 const getcharacterNumber = spCode.toString()

//                 const getDate = getCode[0].msp.substring(6, 8)

//                 const kodeCabang = getUser.kode_cabang
//                 // console.log("🚀 ~ file: sp.controller.js:39 ~ exports.getSelectCreateSp= ~ kodeCabang:", kodeCabang)
//                 ///----//

//                 const getKendaraanjenis = await models.kendaraan_jenis.findAll(
//                     {
//                         order: [['nama_kendaraan_jenis', 'desc']],
//                         where: {
//                             status: 1
//                         }
//                     }
//                 )

//                 const getCompany = await models.customer.findAll(
//                     {
//                         order: [['id_customer', 'desc']],
//                         where: {

//                             ...req.query.keyword ? {
//                                 [Op.or]: [
//                                     {
//                                         nama_perusahaan: {
//                                             [Op.like]: `%${req.query.keyword}%`
//                                         },
//                                     },
//                                 ]
//                             } : {}
//                         },
//                         include: [
//                             {
//                                 model: models.users,
//                                 include: [
//                                     {
//                                         model: models.m_bu_employee
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 )

//                 const getInvoiceAddress = await models.customer.findAll(
//                     {
//                         // order: [['id_customer', 'desc']],
//                         ...req.query.companyId ? {
//                             where: {
//                                 // status: 1,
//                                 id_customer: req.query.companyId,
//                             }
//                         } : {},
//                         include: [
//                             {
//                                 model: models.customer_npwp
//                             }
//                         ]
//                     }
//                 )

//                 const getPacking = await models.packing.findAll(
//                     {
//                         order: [['id', 'desc']],
//                     }
//                 )

//                 const getAddress = await models.alamat.findAll(
//                     {
//                         ...req.query.companyId ? {
//                             where: {
//                                 id_customer: req.query.companyId
//                             },
//                             include: [
//                                 {
//                                     model: models.m_wil_kota,
//                                 }
//                             ]
//                         } : {}
//                     }
//                 )

//                 const getMarketing = await models.m_bu_employee.findAll(
//                     {
//                         // ...req.query.divisi && req.query.kode_cabang ? {
//                         where: {
//                             // divisi: req.query.divisi,
//                             id_bu: getCabang.id_bu,
//                             id_bu_brench: getCabang.id_bu_brench,
//                             category: "Sales"

//                         },
//                         // } : {},
//                         include: [
//                             {
//                                 model: models.users,
//                                 where: {
//                                     // id_bu: getCabang.id_bu,
//                                     // category: "Sales"
//                                 }
//                             }
//                         ]
//                     }
//                 )

//                 const getVia = await models.m_shipment.findAll()

//                 if (getCompany && getPacking && getCode && getMarketing && getVia) {
//                     if (datenow == getDate) {
//                         var zeroCode

//                         if (getcharacterNumber.length == 1) {
//                             var zeroCode = "00000"
//                         } else if (getcharacterNumber.length == 2) {
//                             var zeroCode = "0000"
//                         } else if (getcharacterNumber.length == 3) {
//                             var zeroCode = "000"
//                         } else if (getcharacterNumber.length == 4) {
//                             var zeroCode = "00"
//                         } else if (getcharacterNumber.length == 5) {
//                             var zeroCode = "0"
//                         } else if (getcharacterNumber.length == 6) {
//                             var zeroCode = ""
//                         }

//                         const response = {
//                             noSP: getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + "-" + zeroCode + spCode,
//                             noPH: "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + zeroCode + spCode,

//                             marketing: getMarketing.map((i) => {
//                                 return {
//                                     id: i.user.id,
//                                     id_bu: i.id_bu,
//                                     id_bu_brench: i.id_bu_brench,
//                                     nik: i.code_employee,
//                                     fullname: i.fullname,
//                                     // cabang: i.kode_cabang,
//                                     divisi: i.division,
//                                     idGl: i.id_gl,
//                                     idasm: i.id_asm,
//                                     idMgr: i.id_mgr,
//                                     idKacab: i.id_kacab,
//                                     idAmd: i.id_amd,
//                                 }
//                             }),


//                             company: getCompany.map((i) => {
//                                 return {
//                                     id: i.id_customer,
//                                     companyName: i.nama_perusahaan,
//                                     // companyAddress: i.alamat_kantor,
//                                     companyStuff: i.jenis_barang,
//                                     id_sales: i.user === null ? "-" : i.user.id,
//                                     marketing: i.user === null ? "-" : i.user.nama_lengkap,
//                                     id_gl: i.user === null ? "-" : i.user.m_bu_employee === null ? "-" : i.user.m_bu_employee.id_gl,
//                                     id_asm: i.user === null ? "-" : i.user.m_bu_employee === null ? "-" : i.user.m_bu_employee.id_asm,
//                                     id_mgr: i.user === null ? "-" : i.user.m_bu_employee === null ? "-" : i.user.m_bu_employee.id_mgr,
//                                     id_kacab: i.user === null ? "-" : i.user.m_bu_employee === null ? "-" : i.user.m_bu_employee.id_kacab,
//                                     id_amd: i.user === null ? "-" : i.user.m_bu_employee === null ? "-" : i.user.m_bu_employee.id_amd
//                                 }
//                             }),
//                             address: req.query.companyId ? getAddress.map((i) => {
//                                 return {
//                                     addressId: i.id,
//                                     address: i.kota + " - " + i.alamat + "," + i.kota,
//                                     id_kota: i.id_kota,
//                                     nama_kota: i.m_wil_kotum == null ? "-" : i.m_wil_kotum.nama_kota,
//                                     pic: i.pic,
//                                     jabatan: i.jabatan,
//                                     phone: i.phone
//                                 }
//                             }) : {},
//                             invoiceAddress: req.query.companyId ? getInvoiceAddress.map((i) => {
//                                 return {
//                                     npwpId: i.customer_npwp == null ? "-" : i.customer_npwp.npwp_id,
//                                     customerId: i.id_customer,
//                                     invoiceAddress: [
//                                         { adddress: i.alamat_kantor, },
//                                         { addresss: i.customer_npwp?.address_npwp }
//                                     ],
//                                     // invoiceAddress2: i

//                                 }
//                             }).filter(i => i.invoiceAddress != "") : {},
//                             packing: getPacking.map((i) => {

//                                 return {
//                                     id: i.id,
//                                     packing: i.jenis
//                                 }
//                             }),
//                             type: getKendaraanjenis.map((i) => {

//                                 return {
//                                     id: i.id_kendaraan_jenis,
//                                     type: i.nama_kendaraan_jenis,

//                                 }
//                             }),
//                             insurance: [
//                                 {
//                                     tipe: "With insurance",
//                                     value: "Y"
//                                 },
//                                 {
//                                     tipe: "Without insurance",
//                                     value: "N"
//                                 },
//                             ],
//                             service: [
//                                 {
//                                     tipe: "retailer"
//                                 },
//                                 {
//                                     tipe: "charter"
//                                 },
//                             ],
//                             via: [
//                                 {
//                                     via: "darat"
//                                 },
//                                 {
//                                     via: "laut"
//                                 },
//                                 {
//                                     via: "udara"
//                                 },
//                             ],
//                             discount: [
//                                 {
//                                     value: 2,
//                                     discount: "2 %"
//                                 },
//                                 {
//                                     value: 5,
//                                     discount: "5 %"
//                                 },
//                                 {
//                                     value: 10,
//                                     discount: "10 %"
//                                 },
//                                 {
//                                     value: 20,
//                                     discount: "20 %"
//                                 },
//                             ]

//                         }
//                         if (response) {
//                             output = {
//                                 status: {
//                                     code: 200,
//                                     message: 'Success get data'
//                                 },
//                                 data: response
//                             }
//                         }
//                     } else {
//                         var zeroCode

//                         if (getcharacterNumber.length == 1) {
//                             var zeroCode = "00000"
//                         } else if (getcharacterNumber.length == 2) {
//                             var zeroCode = "0000"
//                         } else if (getcharacterNumber.length == 3) {
//                             var zeroCode = "000"
//                         } else if (getcharacterNumber.length == 4) {
//                             var zeroCode = "00"
//                         } else if (getcharacterNumber.length == 5) {
//                             var zeroCode = "0"
//                         } else if (getcharacterNumber.length == 6) {
//                             var zeroCode = ""
//                         }

//                         const response = {
//                             noSP: getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + "-" + "000001",
//                             noPH: "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
//                             marketing: getMarketing.map((i) => {
//                                 return {
//                                     id: i.user.id,
//                                     id_bu: i.id_bu,
//                                     id_bu_brench: i.id_bu_brench,
//                                     nik: i.code_employee,
//                                     fullname: i.fullname,
//                                     // cabang: i.kode_cabang,
//                                     divisi: i.division,
//                                     idGl: i.id_gl,
//                                     idasm: i.id_asm,
//                                     idMgr: i.id_mgr,
//                                     idKacab: i.id_kacab,
//                                     idAmd: i.id_amd,
//                                 }
//                             }),


//                             company: getCompany.map((i) => {
//                                 return {
//                                     id: i.id_customer,
//                                     companyName: i.nama_perusahaan,
//                                     companyAddress: i.alamat_kantor,
//                                     companyStuff: i.jenis_barang
//                                 }
//                             }),
//                             address: req.query.companyId ? getAddress.map((i) => {
//                                 return {
//                                     addressId: i.id,
//                                     address: i.kota + " - " + i.alamat + "," + i.kota,
//                                     id_kota: i.id_kota,
//                                     nama_kota: i.m_wil_kotum == null ? "-" : i.m_wil_kotum.nama_kota,
//                                     pic: i.pic,
//                                     jabatan: i.jabatan,
//                                     phone: i.phone
//                                 }
//                             }) : {},
//                             invoiceAddress: req.query.companyId ? getInvoiceAddress.map((i) => {
//                                 return {
//                                     npwpId: i.customer_npwp == null ? "-" : i.customer_npwp.npwp_id,
//                                     customerId: i.id_customer,
//                                     invoiceAddress: [
//                                         { adddress: i.alamat_kantor, },
//                                         { addresss: i.customer_npwp?.address_npwp }
//                                     ],
//                                     // invoiceAddress2: i

//                                 }
//                             }).filter(i => i.invoiceAddress != "") : {},
//                             packing: getPacking.map((i) => {

//                                 return {
//                                     id: i.id,
//                                     packing: i.jenis
//                                 }
//                             }),
//                             type: getKendaraanjenis.map((i) => {

//                                 return {
//                                     id: i.id_kendaraan_jenis,
//                                     type: i.nama_kendaraan_jenis,

//                                 }
//                             }),
//                             insurance: [
//                                 {
//                                     tipe: "With insurance",
//                                     value: 0
//                                 },
//                                 {
//                                     tipe: "Without insurance",
//                                     value: 1
//                                 },
//                             ],
//                             service: [
//                                 {
//                                     tipe: "Retailer"
//                                 },
//                                 {
//                                     tipe: "Charter"
//                                 },
//                             ]

//                         }
//                         if (response) {
//                             output = {
//                                 status: {
//                                     code: 200,
//                                     message: 'Success get data'
//                                 },
//                                 data: response
//                             }
//                         }
//                     }
//                 }
//             }
//             else {
//                 const getKendaraanjenis = await models.kendaraan_jenis.findAll(
//                     {
//                         order: [['nama_kendaraan_jenis', 'desc']],
//                         where: {
//                             status: 1
//                         }
//                     }
//                 )

//                 const getCompany = await models.customer.findAll(
//                     {
//                         order: [['id_customer', 'desc']],
//                         where: {
//                             // status: 1,
//                             ...req.query.keyword ? {
//                                 [Op.or]: [
//                                     {
//                                         nama_perusahaan: {
//                                             [Op.like]: `%${req.query.keyword}%`
//                                         },
//                                     },
//                                 ]
//                             } : {}
//                         }
//                     }
//                 )

//                 const getInvoiceAddress = await models.customer.findAll(
//                     {
//                         // order: [['id_customer', 'desc']],
//                         ...req.query.companyId ? {
//                             where: {
//                                 // status: 1,
//                                 id_customer: req.query.companyId,
//                             }
//                         } : {},
//                         include: [
//                             {
//                                 model: models.customer_npwp
//                             }
//                         ]
//                     }
//                 )

//                 const getPacking = await models.packing.findAll(
//                     {
//                         order: [['id', 'desc']],
//                     }
//                 )

//                 const getAddress = await models.alamat.findAll(
//                     {
//                         ...req.query.companyId ? {
//                             where: {
//                                 id_customer: req.query.companyId
//                             },
//                             include: [
//                                 {
//                                     model: models.m_wil_kota,
//                                 }
//                             ]
//                         } : {}
//                     }
//                 )

//                 const getMarketing = await models.m_bu_employee.findAll(
//                     {
//                         // ...req.query.divisi && req.query.kode_cabang ? {
//                         where: {
//                             // divisi: req.query.divisi,
//                             id_bu: getCabang.id_bu,
//                             id_bu_brench: getCabang.id_bu_brench,
//                             category: "Sales"

//                         },
//                         // } : {},
//                         include: [
//                             {
//                                 model: models.users,
//                                 where: {
//                                     // id_bu: getCabang.id_bu,
//                                     // category: "Sales"
//                                 }
//                             }
//                         ]
//                     }
//                 )


//                 const getVia = await models.m_shipment.findAll()

//                 if (getCompany && getPacking && getCode && getMarketing && getVia) {


//                     const response = {
//                         noSP: getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + "-" + "000001",
//                         noPH: "Q" + getUser.kode_cabang + core.moment(Date.now()).format('YY') + "-" + "00001",


//                         marketing: getMarketing.map((i) => {
//                             return {
//                                 id: i.user.id,
//                                 id_bu: i.id_bu,
//                                 id_bu_brench: i.id_bu_brench,
//                                 nik: i.code_employee,
//                                 fullname: i.fullname,
//                                 // cabang: i.kode_cabang,
//                                 divisi: i.division,
//                                 idGl: i.id_gl,
//                                 idasm: i.id_asm,
//                                 idMgr: i.id_mgr,
//                                 idKacab: i.id_kacab,
//                                 idAmd: i.id_amd,
//                             }
//                         }),


//                         company: getCompany.map((i) => {
//                             return {
//                                 id: i.id_customer,
//                                 companyName: i.nama_perusahaan,
//                                 // companyAddress: i.alamat_kantor,
//                                 companyStuff: i.jenis_barang
//                             }
//                         }),
//                         address: req.query.companyId ? getAddress.map((i) => {
//                             return {
//                                 addressId: i.id,
//                                 address: i.kota + " - " + i.alamat + "," + i.kota,
//                                 id_kota: i.id_kota,
//                                 nama_kota: i.m_wil_kotum == null ? "-" : i.m_wil_kotum.nama_kota,
//                                 pic: i.pic,
//                                 jabatan: i.jabatan,
//                                 phone: i.phone
//                             }
//                         }) : {},
//                         invoiceAddress: req.query.companyId ? getInvoiceAddress.map((i) => {
//                             return {
//                                 npwpId: i.customer_npwp == null ? "-" : i.customer_npwp.npwp_id,
//                                 customerId: i.id_customer,
//                                 invoiceAddress: [
//                                     { adddress: i.alamat_kantor, },
//                                     { addresss: i.customer_npwp?.address_npwp }
//                                 ],
//                                 // invoiceAddress2: i

//                             }
//                         }).filter(i => i.invoiceAddress != "") : {},
//                         packing: getPacking.map((i) => {

//                             return {
//                                 id: i.id,
//                                 packing: i.jenis
//                             }
//                         }),
//                         type: getKendaraanjenis.map((i) => {

//                             return {
//                                 id: i.id_kendaraan_jenis,
//                                 type: i.nama_kendaraan_jenis,

//                             }
//                         }),
//                         insurance: [
//                             {
//                                 tipe: "With insurance",
//                                 value: "Y"
//                             },
//                             {
//                                 tipe: "Without insurance",
//                                 value: "N"
//                             },
//                         ],
//                         service: [
//                             {
//                                 tipe: "Retailer"
//                             },
//                             {
//                                 tipe: "Charter"
//                             },
//                         ],
//                         via: [
//                             {
//                                 via: "darat"
//                             },
//                             {
//                                 via: "laut"
//                             },
//                             {
//                                 via: "udara"
//                             },
//                         ],
//                         discount: [
//                             {
//                                 value: 2,
//                                 discount: "2 %"
//                             },
//                             {
//                                 value: 5,
//                                 discount: "5 %"
//                             },
//                             {
//                                 value: 10,
//                                 discount: "10 %"
//                             },
//                             {
//                                 value: 20,
//                                 discount: "20 %"
//                             },
//                         ]




//                     }
//                     if (response) {
//                         output = {
//                             status: {
//                                 code: 200,
//                                 message: 'Success get data'
//                             },
//                             data: response
//                         }
//                     }
//                 }



//                 // res.send("ridwan" + getCode)
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

exports.getSelectCreateSp = async (req, res) => {
  try {
    models.customer.belongsTo(models.customer_npwp, { targetKey: 'customer_id', foreignKey: 'id_customer' });
    models.customer.hasOne(models.customer_npwp, { foreignKey: 'customer_id', sourceKey: 'id_customer' });
    models.customer.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
    models.m_bu_employee.belongsTo(models.users, { targetKey: 'id_karyawan', foreignKey: 'id_employee' });
    models.users.belongsTo(models.m_bu_employee, { targetKey: 'id_employee', foreignKey: 'id_karyawan' });
    models.alamat.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_kota' });

    const datenow = core.moment(Date.now()).format('YY');
    const getUser = await models.users.findOne({ where: { id: req.user.id } });
    const getPerusahaan = await models.m_bu.findOne({ where: { id_bu: getUser.id_bu } });
    const getCabang = await models.users.findOne({ where: { id: req.user.id } });

    const getCode = await models.m_pengadaan.findAll({
      order: [['id_mp', 'desc']],
      limit: 1,
      where: {
        msp: {
          [Op.like]: `%${getUser.id_bu}-SO-%`
        }
      }
    });

    const spCode = getCode.length > 0 ? Number(getCode[0].msp.substring(9, 16)) + 1 : 1;
    const getcharacterNumber = spCode.toString();
    const getDate = getCode.length > 0 ? getCode[0].msp.substring(6, 8) : datenow;
    const kodeCabang = getUser.kode_cabang;
    const zeroCode = "000000".substring(getcharacterNumber.length);
    const noSP = `${getPerusahaan.id_bu}-SO-${datenow}-${zeroCode}${spCode}`;
    const noPH = `Q${kodeCabang}${datenow}-${zeroCode}${spCode}`;

    const getKendaraanjenis = await models.kendaraan_jenis.findAll({
      order: [['nama_kendaraan_jenis', 'desc']],
      where: { status: 1 }
    });

    const getCompany = await models.customer.findAll({
      order: [['id_customer', 'desc']],
      where: req.query.keyword ? {
        [Op.or]: [
          {
            nama_perusahaan: {
              [Op.like]: `%${req.query.keyword}%`
            }
          }
        ]
      } : {},
      include: [
        {
          model: models.users,
          include: [{ model: models.m_bu_employee }]
        }
      ]
    });

    const getInvoiceAddress = await models.customer.findAll({
      ...(req.query.companyId ? {
        where: { id_customer: req.query.companyId }
      } : {}),
      include: [{ model: models.customer_npwp }]
    });

    const getPacking = await models.packing.findAll({ order: [['id', 'desc']] });

    const getAddress = await models.alamat.findAll({
      ...(req.query.companyId ? {
        where: { id_customer: req.query.companyId },
        include: [{ model: models.m_wil_kota }]
      } : {})
    });

    const getMarketing = await models.m_bu_employee.findAll({
    where: {
        id_bu: getCabang.id_bu,
        id_bu_brench: getCabang.id_bu_brench,
        category: "Sales"
    },
    include: [
        { 
        model: models.users, 
        where: { aktif: 'Y' }, // filter user aktif
        required: true // inner join, hanya ambil yang ada user aktif
        }
    ]
    });

    // Mapping response
    const marketing = getMarketing.map(i => ({
    id: i.user.id,
    id_bu: i.id_bu,
    id_bu_brench: i.id_bu_brench,
    nik: i.code_employee,
    fullname: i.fullname,
    divisi: i.division,
    idGl: i.id_gl,
    idasm: i.id_asm,
    idMgr: i.id_mgr,
    idKacab: i.id_kacab,
    idAmd: i.id_amd
    }));

    const getVia = await models.m_shipment.findAll();

    const response = {
      noSP,
      noPH,
      marketing: getMarketing.map(i => ({
        id: i.user?.id || "-",
        id_bu: i.id_bu,
        id_bu_brench: i.id_bu_brench,
        nik: i.code_employee,
        fullname: i.fullname,
        divisi: i.division,
        idGl: i.id_gl,
        idasm: i.id_asm,
        idMgr: i.id_mgr,
        idKacab: i.id_kacab,
        idAmd: i.id_amd
      })),
      company: getCompany.map(i => ({
        id: i.id_customer,
        companyName: i.nama_perusahaan,
        companyStuff: i.jenis_barang,
        id_sales: i.user?.id || "-",
        marketing: i.user?.nama_lengkap || "-",
        id_gl: i.user?.m_bu_employee?.id_gl || "-",
        id_asm: i.user?.m_bu_employee?.id_asm || "-",
        id_mgr: i.user?.m_bu_employee?.id_mgr || "-",
        id_kacab: i.user?.m_bu_employee?.id_kacab || "-",
        id_amd: i.user?.m_bu_employee?.id_amd || "-"
      })),
      address: req.query.companyId
        ? getAddress.map(i => ({
            addressId: i.id,
            address: `${i.kota} - ${i.alamat}, ${i.kota}`,
            id_kota: i.id_kota,
            nama_kota: i.m_wil_kotum?.nama_kota || "-",
            pic: i.pic,
            jabatan: i.jabatan,
            phone: i.phone
          }))
        : {},
      
    invoiceAddress: req.query.companyId
        ? Array.from(
            new Map(
                getInvoiceAddress.flatMap(i => {
                const arr = [];
                if (i.alamat_kantor) arr.push(i.alamat_kantor);
                if (i.customer_npwp?.address_npwp) arr.push(i.customer_npwp.address_npwp);
                return arr;
                }).map(addr => [addr, { address: addr }])
            ).values()
            )
        : [],

      packing: getPacking.map(i => ({
        id: i.id,
        packing: i.jenis
      })),
      type: getKendaraanjenis.map(i => ({
        id: i.id_kendaraan_jenis,
        type: i.nama_kendaraan_jenis
      })),
      insurance: [
        { tipe: "With insurance", value: "Y" },
        { tipe: "Without insurance", value: "N" }
      ],
      service: [
        { tipe: "Retailer" },
        { tipe: "Charter" }
      ],
      via: [
        { via: "darat" },
        { via: "laut" },
        { via: "udara" }
      ],
      discount: [
        { value: 2, discount: "2 %" },
        { value: 5, discount: "5 %" },
        { value: 10, discount: "10 %" },
        { value: 20, discount: "20 %" }
      ]
    };

    const output = {
      status: {
        code: 200,
        message: 'Success get data'
      },
      data: response
    };

    const errorsFromMiddleware = await customErrorMiddleware(req);
    if (!errorsFromMiddleware) {
      res.status(output.status.code).send(output);
    } else {
      res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
    }
  } catch (error) {
    res.status(500).send({
      status: {
        code: 500,
        message: error.message
      }
    });
  }
};

// Export Excel SP List
exports.exportSpListExcel = async (req, res) => {
    try {
        // Setup associations
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        // users -> BU & Brench
        if (!models.users.associations.bu) {
            models.users.belongsTo(models.m_bu, { targetKey: 'id_bu', foreignKey: 'id_bu', as: 'bu' });
        }
        if (!models.users.associations.brench) {
            models.users.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench', as: 'brench' });
        }
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });
        if (!models.m_pengadaan_detail.associations.kotaAsal) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'kotaAsal' });
        }
        if (!models.m_pengadaan_detail.associations.kotaTujuan) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'kotaTujuan' });
        }
        // Relasi ke m_sm untuk ambil id_mitra_pickup + join ke mitra untuk dapat nama mitra
        if (!models.m_pengadaan_detail.associations.m_sm) {
            models.m_pengadaan_detail.hasMany(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        }
        if (!models.m_sm.associations.mitra) {
            models.m_sm.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra_pickup', as: 'mitra' });
        }

        // Filters
        const whereSp = {
            ...(req.query.statusSP ? { status: req.query.statusSP } : {}),
            ...(req.query.customerId ? { id_customer: req.query.customerId } : {}),
            ...(req.query.sales ? { id_sales: req.query.sales } : {}),
            ...(req.query.keyword ? { msp: { [Op.like]: `%${req.query.keyword}%` } } : {}),
            ...(req.query.startDate && req.query.endDate ? {
                tgl_pickup: { [Op.between]: [req.query.startDate, req.query.endDate] }
            } : {})
        };

        const rows = await models.m_pengadaan.findAll({
            where: whereSp,
            order: [['id_mp', 'desc']],
            include: [
                {
                    model: models.users,
                    attributes: ['nama_lengkap', 'id_bu', 'id_bu_brench'],
                    include: [
                        { model: models.m_bu, as: 'bu', attributes: ['name_bu', 'code_bu'] },
                        { model: models.m_bu_brench, as: 'brench', attributes: ['code_bu_brench'] }
                    ]
                },
                { model: models.customer, attributes: ['nama_perusahaan'] },
                {
                    model: models.m_status_order,
                    required: false,
                    include: [{ model: models.users, attributes: ['nama_lengkap'] }]
                },
                {
                    model: models.m_pengadaan_detail,
                    required: false,
                    include: [
                        { model: models.alamat, as: 'kotaAsal', attributes: ['kota'] },
                        { model: models.alamat, as: 'kotaTujuan', attributes: ['kota'] },
                        {
                            model: models.m_sm,
                            required: false,
                            attributes: ['id_mitra_pickup'],
                            include: [
                                {
                                    model: models.mitra,
                                    as: 'mitra',
                                    attributes: ['nama_mitra']
                                }
                            ]
                        },
                    ]
                }
            ]
        });

        // Kumpulkan id massage_do untuk alasan reject (sales/act/ops/purch)
        const massageIds = new Set();
        rows.forEach((item) => {
            const st = item.m_status_order || {};
            if (st.sales_reject) massageIds.add(st.sales_reject);
            if (st.act_reject) massageIds.add(st.act_reject);
            if (st.ops_reject) massageIds.add(st.ops_reject);
            if (st.purch_reject) massageIds.add(st.purch_reject);
        });

        const massageMap = {};
        if (massageIds.size > 0) {
            const massages = await models.massage_do.findAll({
                where: { id_massage_do: { [Op.in]: Array.from(massageIds) } },
                attributes: ['id_massage_do', 'massage']
            });
            massages.forEach((m) => {
                massageMap[m.id_massage_do] = m.massage;
            });
        }

        const excelRows = [];
        let no = 1;
        for (const item of rows) {
            const details = Array.isArray(item.m_pengadaan_details) ? item.m_pengadaan_details : [];
            const firstDetail = details[0] || null;
            const lastDetail = details.length > 0 ? details[details.length - 1] : null;
            const kendaraan = firstDetail?.kendaraan || '-';
            // Ambil nama mitra dari relasi m_sm -> mitra (ambil yang pertama ada namanya)
            let mitra = '';
            for (const det of details) {
                const smsList = Array.isArray(det.m_sms) ? det.m_sms : [];
                const foundSm = smsList.find(sm => sm && sm.id_mitra_pickup && sm.id_mitra_pickup !== 0);
                if (foundSm) {
                    mitra = foundSm.mitra?.nama_mitra || '';
                    break;
                }
            }
            const kotaMuat = firstDetail?.kotaAsal?.kota || '-';
            const kotaBongkar = lastDetail?.kotaTujuan?.kota || '-';
            const destination = `${kotaMuat} - ${kotaBongkar}`.trim();

            const statusOrder = item.m_status_order || {};
            const formatDate = (val) => {
                if (!val) return 'Invalid Date';
                const formatted = core.moment(val).format('YYYY-MM-DD HH:mm:ss');
                return formatted === '1970-01-01 07:00:00' ? 'Invalid Date' : formatted;
            };

            const reasonSalesReject = statusOrder.sales_reject ? (massageMap[statusOrder.sales_reject] || '') : '';
            const reasonActReject = statusOrder.act_reject ? (massageMap[statusOrder.act_reject] || '') : '';
            const reasonOpsReject = statusOrder.ops_reject ? (massageMap[statusOrder.ops_reject] || '') : '';
            const reasonPurchReject = statusOrder.purch_reject ? (massageMap[statusOrder.purch_reject] || '') : '';

            excelRows.push({
                no: no++,
                idmp: item.id_mp || '',
                sp: item.msp || '',
                salesName: item.user?.nama_lengkap || '-',
                buName: item.user?.bu?.name_bu || item.user?.bu?.code_bu || '',
                buBrench: item.user?.brench?.code_bu_brench || '',
                gl: '-',
                asm: '-',
                mgr: '-',
                kacab: '-',
                amd: '-',
                perusahaan: item.customer?.nama_perusahaan || '-',
                kendaraan: kendaraan,
                mitra: mitra,
                service: item.service || '',
                pickupDate: item.tgl_pickup ? core.moment(item.tgl_pickup).format('YYYY-MM-DD') : '',
                approveSales: statusOrder.act_sales || '',
                dateApproveSales: formatDate(statusOrder.tgl_act_1),
                approveAct: statusOrder.act_akunting || '',
                dateApproveAct: formatDate(statusOrder.tgl_act_3),
                approveOps: statusOrder.kendaraan_operasional || '',
                idops: statusOrder.operasional || '',
                operationalName: statusOrder.user?.nama_lengkap || '',
                dateApproveOps: formatDate(statusOrder.tgl_act_4),
                approvePurch: statusOrder.kendaraan_purchasing || '',
                dateApprovePurch: formatDate(statusOrder.tgl_act_5),
                new: item.new || '',
                destination: destination,
                actSales: statusOrder.act_sales || '',
                salesRejectReason: reasonSalesReject,
                actRejectReason: reasonActReject,
                opsRejectReason: reasonOpsReject,
                purchRejectReason: reasonPurchReject
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SP List');
        worksheet.columns = [
            { header: 'no', key: 'no', width: 6 },
            { header: 'idmp', key: 'idmp', width: 12 },
            { header: 'sp', key: 'sp', width: 18 },
            { header: 'salesName', key: 'salesName', width: 22 },
            { header: 'BU', key: 'buName', width: 18 },
            { header: 'BU Brench', key: 'buBrench', width: 14 },
            { header: 'gl', key: 'gl', width: 8 },
            { header: 'asm', key: 'asm', width: 8 },
            { header: 'mgr', key: 'mgr', width: 8 },
            { header: 'kacab', key: 'kacab', width: 8 },
            { header: 'amd', key: 'amd', width: 8 },
            { header: 'perusahaan', key: 'perusahaan', width: 30 },
            { header: 'kendaraan', key: 'kendaraan', width: 14 },
            { header: 'mitra', key: 'mitra', width: 12 },
            { header: 'service', key: 'service', width: 12 },
            { header: 'pickupDate', key: 'pickupDate', width: 20 },
            { header: 'approveSales', key: 'approveSales', width: 12 },
            { header: 'dateApproveSales', key: 'dateApproveSales', width: 20 },
            { header: 'approveAct', key: 'approveAct', width: 12 },
            { header: 'dateApproveAct', key: 'dateApproveAct', width: 20 },
            { header: 'approveOps', key: 'approveOps', width: 12 },
            { header: 'idops', key: 'idops', width: 10 },
            { header: 'operationalName', key: 'operationalName', width: 20 },
            { header: 'dateApproveOps', key: 'dateApproveOps', width: 20 },
            { header: 'approvePurch', key: 'approvePurch', width: 14 },
            { header: 'dateApprovePurch', key: 'dateApprovePurch', width: 20 },
            { header: 'new', key: 'new', width: 6 },
            { header: 'destination', key: 'destination', width: 30 },
            { header: 'act_sales', key: 'actSales', width: 10 },
            { header: 'sales_reject_reason', key: 'salesRejectReason', width: 28 },
            { header: 'act_reject_reason', key: 'actRejectReason', width: 28 },
            { header: 'ops_reject_reason', key: 'opsRejectReason', width: 28 },
            { header: 'purch_reject_reason', key: 'purchRejectReason', width: 28 },
        ];
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        excelRows.forEach((r) => worksheet.addRow(r));

        const start = req.query.startDate ? core.moment(req.query.startDate).format('YYYYMMDD') : null;
        const end = req.query.endDate ? core.moment(req.query.endDate).format('YYYYMMDD') : null;
        const dateLabel = start && end ? `${start}_${end}` : core.moment().format('YYYYMMDD_HHmmss');
        const filename = `sp_list_${dateLabel}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exportSpListExcel:', error);
        if (!res.headersSent) {
            res.status(500).json({
                status: { code: 500, message: error.message }
            });
        }
    }
}

exports.createSp = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const getPerusahaan = await models.m_bu.findOne(
            {
                where: {
                    id_bu: getUser.id_bu
                }
            }
        )

        const getCode = await models.m_pengadaan.findAll(
            {
                order: [['id_mp', 'desc']],
                limit: 1,
                where: {
                    msp: {
                        [Op.like]: `%${getPerusahaan.id_bu}-SO-%`
                    },
                }
            }
        )

        const getCodeSpk = await models.m_pengadaan.findAll(
            {
                order: [['id_mp', 'desc']],
                limit: 1,
                where: {
                    mspk: {
                        [Op.like]: `%${getPerusahaan.id_bu}-PK-%`
                    },
                }
            }
        )


        const dateNow = core.moment(Date.now()).format('YY')

        const kodeCabang = getUser.kode_cabang

        if (getCode != "" && getCodeSpk != "") {
            if (getCode.length === 0) {
                const getcodeSpk = Number(getCodeSpk[0].mspk.substring(9, 16))
                const spkCode = getcodeSpk + 1

                const getcharacterNumberSpk = spkCode.toString()

                const getDateSpk = getCodeSpk[0].mspk.substring(6, 8)

                if (spkCode > 999999) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menginput data kode sudah maks di 999999'
                        }
                    }
                } else {
                    if (dateNow === getDateSpk) {
                        var zeroCodeSpk

                        if (getcharacterNumberSpk.length == 1) {
                            var zeroCodeSpk = "00000"
                        } else if (getcharacterNumberSpk.length == 2) {
                            var zeroCodeSpk = "0000"
                        } else if (getcharacterNumberSpk.length == 3) {
                            var zeroCodeSpk = "000"
                        } else if (getcharacterNumberSpk.length == 4) {
                            var zeroCodeSpk = "00"
                        } else if (getcharacterNumberSpk.length == 5) {
                            var zeroCodeSpk = "0"
                        } else if (getcharacterNumberSpk.length == 6) {
                            var zeroCodeSpk = ""
                        }

                        const createSP = await models.m_pengadaan.create(
                            {
                                'id_admin': req.user.id,
                                'mp_ref': 0,
                                'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                                'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + zeroCodeSpk + spkCode,
                                'memo': req.body.memo,
                                'id_sales': req.body.id_sales,
                                'id_gl': req.body.id_gl,
                                'id_asm': req.body.id_asm,
                                'id_mgr': req.body.id_mgr,
                                'id_kacab': req.body.id_kacab,
                                'id_amd': req.body.id_amd,
                                'id_customer': req.body.id_customer,
                                'alamat_invoice': req.body.alamat_invoice,
                                'top': "",
                                'leadtime': "",
                                'do': "-",
                                'service': req.body.service,
                                'jenis_barang': req.body.jenis_barang,
                                'packing': req.body.packing,
                                'asuransi': req.body.asuransi,
                                'asuransi_fee': req.body.asuransi_fee,
                                'foto': "",
                                'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                'tgl_estimasi_tiba': 0,
                                'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                                'waktu_muat': core.moment(req.body.tgl_pickup).format("hh:mm:ss"),
                                'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("hh:mm:ss"),
                                'armada': "",
                                'transit': "",
                                'via': "",
                                'kendaraan': "",
                                'mitra': "",
                                'kendaraan_mitra': "",
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                                'overtonase': req.body.overtonase,
                                'biaya_multi_drop': req.body.overtonase,
                                'biaya_lain': req.body.overtonase,
                                'diskon': 0,
                                'total_keseluruhan': req.body.total_keseluruhan,
                                'status': 1,
                                'print_spk': "0",
                                'spk_date': 0,
                                'tgl_update': Date.now(),
                                'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                'new': 1,
                                'is_multi': req.body.is_multi,
                                'is_tarif_multidrop': req.body.is_tarif_multidrop,
                                'is_issue': 0
                            }
                        )

                        if (createSP) {
                            const createStatusOrder = await models.m_status_order.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    'customer': req.body.id_customer,
                                    'act_customer': "Y",
                                    'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'act_sales': "Y",
                                    'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'akunting': 0,
                                    'act_akunting': "N",
                                    'tgl_act_3': 0,
                                    'operasional': 0,
                                    'kendaraan_operasional': "N",
                                    'tgl_act_4': 0,
                                    'purchasing': 0,
                                    'tgl_act_5': 0,
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                }
                            )

                            const createPengadaanApprove = await models.m_pengadaan_approve.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    // 'customer': req.body.id_customer,
                                    'apv_sales': "Y",
                                    'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'apv_ops': "N",
                                    'tgl_apv_ops': 0,
                                    'operasional': 0,
                                    'akunting': 0,
                                    'apv_akunting': "N",
                                    'tgl_apv_akt': 0,
                                    'tgl_apv_purch': 0,
                                    'purchasing': 0,
                                    'apv_purch': "N",
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                }
                            )

                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": createSP.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": req.user.fullname + " membuat SP",
                                    "baca": "0"
                                },
                            )

                            if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create SP'
                                    },
                                    noSP: createSP.msp,
                                    noPH: createSP.ph,
                                    idmp: createSP.id_mp
                                }
                            }
                        }
                    } else {
                        const createSP = await models.m_pengadaan.create(
                            {
                                'id_admin': req.user.id,
                                'mp_ref': 0,
                                'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                                'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'memo': req.body.memo,
                                'id_sales': req.body.id_sales,
                                'id_gl': req.body.id_gl,
                                'id_asm': req.body.id_asm,
                                'id_mgr': req.body.id_mgr,
                                'id_kacab': req.body.id_kacab,
                                'id_amd': req.body.id_amd,
                                'id_customer': req.body.id_customer,
                                'alamat_invoice': req.body.alamat_invoice,
                                'top': "",
                                'leadtime': "",
                                'do': "-",
                                'service': req.body.service,
                                'jenis_barang': req.body.jenis_barang,
                                'packing': req.body.packing,
                                'asuransi': req.body.asuransi,
                                'asuransi_fee': req.body.asuransi_fee,
                                'foto': "",
                                'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                'tgl_estimasi_tiba': 0,
                                'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                                'waktu_muat': core.moment(req.body.tgl_pickup).format("hh:mm:ss"),
                                'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("hh:mm:ss"),
                                'armada': "",
                                'transit': "",
                                'via': "",
                                'kendaraan': "",
                                'mitra': "",
                                'kendaraan_mitra': "",
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                                'overtonase': req.body.overtonase,
                                'biaya_multi_drop': req.body.overtonase,
                                'biaya_lain': req.body.overtonase,
                                'diskon': 0,
                                'total_keseluruhan': req.body.total_keseluruhan,
                                'status': 1,
                                'print_spk': "0",
                                'spk_date': 0,
                                'tgl_update': Date.now(),
                                'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                'new': 1,
                                'is_multi': req.body.is_multi,
                                'is_tarif_multidrop': req.body.is_tarif_multidrop,
                                'is_issue': 0

                            }
                        )
                        if (createSP) {
                            const createStatusOrder = await models.m_status_order.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    'customer': req.body.id_customer,
                                    'act_customer': "Y",
                                    'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'act_sales': "Y",
                                    'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'akunting': 0,
                                    'act_akunting': "N",
                                    'tgl_act_3': 0,
                                    'operasional': 0,
                                    'kendaraan_operasional': "N",
                                    'tgl_act_4': 0,
                                    'purchasing': 0,
                                    'tgl_act_5': 0,
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

                                }
                            )
                            const createPengadaanApprove = await models.m_pengadaan_approve.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    // 'customer': req.body.id_customer,
                                    'apv_sales': "Y",
                                    'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'apv_ops': "N",
                                    'tgl_apv_ops': 0,
                                    'operasional': 0,
                                    'akunting': 0,
                                    'apv_akunting': "N",
                                    'tgl_apv_akt': 0,
                                    'tgl_apv_purch': 0,
                                    'purchasing': 0,
                                    'apv_purch': "N",
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')

                                }
                            )

                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": createSP.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": req.user.fullname + " membuat SP",
                                    "baca": "0"

                                },

                            )

                            if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create SP'
                                    },
                                    noSP: createSP.msp,
                                    noPH: createSP.ph,
                                    idmp: createSP.id_mp
                                }
                            }
                        }
                    }
                }
            } else if (getCodeSpk.length === 0) {
                const getcodeSp = Number(getCode[0].msp.substring(9, 16))
                const spCode = getcodeSp + 1

                const getcharacterNumber = spCode.toString()

                const getDate = getCode[0].msp.substring(6, 8)

                if (spCode > 999999) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menginput data kode sudah maks di 999999'
                        }
                    }
                } else {
                    if (dateNow === getDate) {
                        var zeroCode

                        if (getcharacterNumber.length == 1) {
                            var zeroCode = "00000"
                        } else if (getcharacterNumber.length == 2) {
                            var zeroCode = "0000"
                        } else if (getcharacterNumber.length == 3) {
                            var zeroCode = "000"
                        } else if (getcharacterNumber.length == 4) {
                            var zeroCode = "00"
                        } else if (getcharacterNumber.length == 5) {
                            var zeroCode = "0"
                        } else if (getcharacterNumber.length == 6) {
                            var zeroCode = ""
                        }

                        const createSP = await models.m_pengadaan.create(
                            {
                                'id_admin': req.user.id,
                                'mp_ref': 0,
                                'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                                'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + zeroCode + spCode,
                                'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'memo': req.body.memo,
                                'id_sales': req.body.id_sales,
                                'id_gl': req.body.id_gl,
                                'id_asm': req.body.id_asm,
                                'id_mgr': req.body.id_mgr,
                                'id_kacab': req.body.id_kacab,
                                'id_amd': req.body.id_amd,
                                'id_customer': req.body.id_customer,
                                'alamat_invoice': req.body.alamat_invoice,
                                'top': "",
                                'leadtime': "",
                                'do': "-",
                                'service': req.body.service,
                                'jenis_barang': req.body.jenis_barang,
                                'packing': req.body.packing,
                                'asuransi': req.body.asuransi,
                                'asuransi_fee': req.body.asuransi_fee,
                                'foto': "",
                                'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                'tgl_estimasi_tiba': 0,
                                'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                                'waktu_muat': core.moment(req.body.tgl_pickup).format("HH:mm:ss"),
                                'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("HH:mm:ss"),
                                'armada': "",
                                'transit': "",
                                'via': "",
                                'kendaraan': "",
                                'mitra': "",
                                'kendaraan_mitra': "",
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                                'overtonase': req.body.overtonase,
                                'biaya_multi_drop': req.body.overtonase,
                                'biaya_lain': req.body.overtonase,
                                'diskon': 0,
                                'total_keseluruhan': req.body.total_keseluruhan,
                                'status': 1,
                                'print_spk': "0",
                                'spk_date': 0,
                                'tgl_update': Date.now(),
                                'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                'new': 1,
                                'is_multi': req.body.is_multi,
                                'is_tarif_multidrop': req.body.is_tarif_multidrop,
                                'is_issue': 0

                            }
                        )

                        if (createSP) {
                            const createStatusOrder = await models.m_status_order.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    'customer': req.body.id_customer,
                                    'act_customer': "Y",
                                    'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'act_sales': "Y",
                                    'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'akunting': 0,
                                    'act_akunting': "N",
                                    'tgl_act_3': 0,
                                    'operasional': 0,
                                    'kendaraan_operasional': "N",
                                    'tgl_act_4': 0,
                                    'purchasing': 0,
                                    'tgl_act_5': 0,
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                }
                            )

                            const createPengadaanApprove = await models.m_pengadaan_approve.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    // 'customer': req.body.id_customer,
                                    'apv_sales': "Y",
                                    'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'apv_ops': "N",
                                    'tgl_apv_ops': 0,
                                    'operasional': 0,
                                    'akunting': 0,
                                    'apv_akunting': "N",
                                    'tgl_apv_akt': 0,
                                    'tgl_apv_purch': 0,
                                    'purchasing': 0,
                                    'apv_purch': "N",
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                }
                            )

                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": createSP.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": req.user.fullname + " membuat SP",
                                    "baca": "0"
                                },
                            )

                            if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create SP'
                                    },
                                    noSP: createSP.msp,
                                    noPH: createSP.ph,
                                    idmp: createSP.id_mp
                                }
                            }
                        }
                    } else {
                        const createSP = await models.m_pengadaan.create(
                            {
                                'id_admin': req.user.id,
                                'mp_ref': 0,
                                'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                                'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'memo': req.body.memo,
                                'id_sales': req.body.id_sales,
                                'id_gl': req.body.id_gl,
                                'id_asm': req.body.id_asm,
                                'id_mgr': req.body.id_mgr,
                                'id_kacab': req.body.id_kacab,
                                'id_amd': req.body.id_amd,
                                'id_customer': req.body.id_customer,
                                'alamat_invoice': req.body.alamat_invoice,
                                'top': "",
                                'leadtime': "",
                                'do': "-",
                                'service': req.body.service,
                                'jenis_barang': req.body.jenis_barang,
                                'packing': req.body.packing,
                                'asuransi': req.body.asuransi,
                                'asuransi_fee': req.body.asuransi_fee,
                                'foto': "",
                                'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                'tgl_estimasi_tiba': 0,
                                'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                                'waktu_muat': core.moment(req.body.tgl_pickup).format("hh:mm:ss"),
                                'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("hh:mm:ss"),
                                'armada': "",
                                'transit': "",
                                'via': "",
                                'kendaraan': "",
                                'mitra': "",
                                'kendaraan_mitra': "",
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                                'overtonase': req.body.overtonase,
                                'biaya_multi_drop': req.body.overtonase,
                                'biaya_lain': req.body.overtonase,
                                'diskon': 0,
                                'total_keseluruhan': req.body.total_keseluruhan,
                                'status': 1,
                                'print_spk': "0",
                                'spk_date': 0,
                                'tgl_update': Date.now(),
                                'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                'new': 1,
                                'is_multi': req.body.is_multi,
                                'is_tarif_multidrop': req.body.is_tarif_multidrop,
                                'is_issue': 0

                            }
                        )
                        if (createSP) {
                            const createStatusOrder = await models.m_status_order.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    'customer': req.body.id_customer,
                                    'act_customer': "Y",
                                    'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'sales': req.user.id,
                                    'act_sales': "Y",
                                    'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'akunting': 0,
                                    'act_akunting': "N",
                                    'tgl_act_3': 0,
                                    'operasional': 0,
                                    'kendaraan_operasional': "N",
                                    'tgl_act_4': 0,
                                    'purchasing': 0,
                                    'tgl_act_5': 0,
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

                                }
                            )
                            const createPengadaanApprove = await models.m_pengadaan_approve.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    // 'customer': req.body.id_customer,
                                    'apv_sales': "Y",
                                    'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'sales': req.user.id,
                                    'apv_ops': "N",
                                    'tgl_apv_ops': 0,
                                    'operasional': 0,
                                    'akunting': 0,
                                    'apv_akunting': "N",
                                    'tgl_apv_akt': 0,
                                    'tgl_apv_purch': 0,
                                    'purchasing': 0,
                                    'apv_purch': "N",
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')

                                }
                            )

                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": createSP.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": req.user.fullname + " membuat SP",
                                    "baca": "0"

                                },

                            )

                            if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create SP'
                                    },
                                    noSP: createSP.msp,
                                    noPH: createSP.ph,
                                    idmp: createSP.id_mp
                                }
                            }
                        }
                    }
                }
            } else {
                const getcodeSp = Number(getCode[0].msp.substring(9, 16))
                const spCode = getcodeSp + 1

                const getcharacterNumber = spCode.toString()

                const getDate = getCode[0].msp.substring(6, 8)

                // ===========

                const getcodeSpk = Number(getCodeSpk[0].mspk.substring(9, 16))
                const spkCode = getcodeSpk + 1

                const getcharacterNumberSpk = spkCode.toString()

                const getDateSpk = getCodeSpk[0].mspk.substring(6, 8)

                if (spCode > 999999) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menginput data kode sudah maks di 999999'
                        }
                    }
                } else if (spkCode > 999999) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Gagal menginput data kode sudah maks di 999999'
                        }
                    }
                } else {
                    if (dateNow === getDate && dateNow === getDateSpk) {
                        var zeroCode
                        var zeroCodeSpk

                        if (getcharacterNumber.length == 1) {
                            var zeroCode = "00000"
                        } else if (getcharacterNumber.length == 2) {
                            var zeroCode = "0000"
                        } else if (getcharacterNumber.length == 3) {
                            var zeroCode = "000"
                        } else if (getcharacterNumber.length == 4) {
                            var zeroCode = "00"
                        } else if (getcharacterNumber.length == 5) {
                            var zeroCode = "0"
                        } else if (getcharacterNumber.length == 6) {
                            var zeroCode = ""
                        }

                        if (getcharacterNumberSpk.length == 1) {
                            var zeroCodeSpk = "00000"
                        } else if (getcharacterNumberSpk.length == 2) {
                            var zeroCodeSpk = "0000"
                        } else if (getcharacterNumberSpk.length == 3) {
                            var zeroCodeSpk = "000"
                        } else if (getcharacterNumberSpk.length == 4) {
                            var zeroCodeSpk = "00"
                        } else if (getcharacterNumberSpk.length == 5) {
                            var zeroCodeSpk = "0"
                        } else if (getcharacterNumberSpk.length == 6) {
                            var zeroCodeSpk = ""
                        }

                        const createSP = await models.m_pengadaan.create(
                            {
                                'id_admin': req.user.id,
                                'mp_ref': 0,
                                'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                                'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + zeroCode + spCode,
                                'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + zeroCodeSpk + spkCode,
                                'memo': req.body.memo,
                                'id_sales': req.body.id_sales,
                                'id_sales': req.body.id_sales,
                                'id_gl': req.body.id_gl,
                                'id_asm': req.body.id_asm,
                                'id_mgr': req.body.id_mgr,
                                'id_kacab': req.body.id_kacab,
                                'id_amd': req.body.id_amd,
                                'id_customer': req.body.id_customer,
                                'alamat_invoice': req.body.alamat_invoice,
                                'top': "",
                                'leadtime': "",
                                'do': "-",
                                'service': req.body.service,
                                'jenis_barang': req.body.jenis_barang,
                                'packing': req.body.packing,
                                'asuransi': req.body.asuransi,
                                'asuransi_fee': req.body.asuransi_fee,
                                'foto': "",
                                'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                'tgl_estimasi_tiba': 0,
                                'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                                'waktu_muat': core.moment(req.body.tgl_pickup).format("hh:mm:ss"),
                                'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("hh:mm:ss"),
                                'armada': "",
                                'transit': "",
                                'via': "",
                                'kendaraan': "",
                                'mitra': "",
                                'kendaraan_mitra': "",
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                                'overtonase': req.body.overtonase,
                                'biaya_multi_drop': req.body.overtonase,
                                'biaya_lain': req.body.overtonase,
                                'diskon': 0,
                                'total_keseluruhan': req.body.total_keseluruhan,
                                'status': 1,
                                'print_spk': "0",
                                'spk_date': 0,
                                'tgl_update': Date.now(),
                                'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                'new': 1,
                                'is_multi': req.body.is_multi,
                                'is_tarif_multidrop': req.body.is_tarif_multidrop,
                                'is_issue': 0

                            }
                        )

                        if (createSP) {
                            const createStatusOrder = await models.m_status_order.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    'customer': req.body.id_customer,
                                    'act_customer': "Y",
                                    'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'sales': req.user.id,
                                    'act_sales': "Y",
                                    'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    'akunting': 0,
                                    'act_akunting': "N",
                                    'tgl_act_3': 0,
                                    'operasional': 0,
                                    'kendaraan_operasional': "N",
                                    'tgl_act_4': 0,
                                    'purchasing': 0,
                                    'tgl_act_5': 0,
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                                }
                            )

                            const createPengadaanApprove = await models.m_pengadaan_approve.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    // 'customer': req.body.id_customer,
                                    'apv_sales': "Y",
                                    'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'sales': req.user.id,
                                    'apv_ops': "N",
                                    'tgl_apv_ops': 0,
                                    'operasional': 0,
                                    'akunting': 0,
                                    'apv_akunting': "N",
                                    'tgl_apv_akt': 0,
                                    'tgl_apv_purch': 0,
                                    'purchasing': 0,
                                    'apv_purch': "N",
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
                                }
                            )

                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": createSP.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": req.user.fullname + " membuat SP",
                                    "baca": "0"
                                },
                            )

                            if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create SP'
                                    },
                                    noSP: createSP.msp,
                                    noPH: createSP.ph,
                                    idmp: createSP.id_mp
                                }
                            }
                        }
                    } else {
                        const createSP = await models.m_pengadaan.create(
                            {
                                'id_admin': req.user.id,
                                'mp_ref': 0,
                                'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                                'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                                'memo': req.body.memo,
                                'id_sales': req.body.id_sales,
                                'id_sales': req.body.id_sales,
                                'id_gl': req.body.id_gl,
                                'id_asm': req.body.id_asm,
                                'id_mgr': req.body.id_mgr,
                                'id_kacab': req.body.id_kacab,
                                'id_amd': req.body.id_amd,
                                'id_customer': req.body.id_customer,
                                'alamat_invoice': req.body.alamat_invoice,
                                'top': "",
                                'leadtime': "",
                                'do': "-",
                                'service': req.body.service,
                                'jenis_barang': req.body.jenis_barang,
                                'packing': req.body.packing,
                                'asuransi': req.body.asuransi,
                                'asuransi_fee': req.body.asuransi_fee,
                                'foto': "",
                                'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                'tgl_estimasi_tiba': 0,
                                'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                                'waktu_muat': core.moment(req.body.tgl_pickup).format("hh:mm:ss"),
                                'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("hh:mm:ss"),
                                'armada': "",
                                'transit': "",
                                'via': "",
                                'kendaraan': "",
                                'mitra': "",
                                'kendaraan_mitra': "",
                                'biaya_muat': req.body.biaya_muat,
                                'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                                'overtonase': req.body.overtonase,
                                'biaya_multi_drop': req.body.overtonase,
                                'biaya_lain': req.body.overtonase,
                                'diskon': 0,
                                'total_keseluruhan': req.body.total_keseluruhan,
                                'status': 1,
                                'print_spk': "0",
                                'spk_date': 0,
                                'tgl_update': Date.now(),
                                'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                'new': 1,
                                'is_multi': req.body.is_multi,
                                'is_tarif_multidrop': req.body.is_tarif_multidrop,
                                'is_issue': 0

                            }
                        )
                        if (createSP) {
                            const createStatusOrder = await models.m_status_order.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    'customer': req.body.id_customer,
                                    'act_customer': "Y",
                                    'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'sales': req.user.id,
                                    'act_sales': "Y",
                                    'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'akunting': 0,
                                    'act_akunting': "N",
                                    'tgl_act_3': 0,
                                    'operasional': 0,
                                    'kendaraan_operasional': "N",
                                    'tgl_act_4': 0,
                                    'purchasing': 0,
                                    'tgl_act_5': 0,
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

                                }
                            )
                            const createPengadaanApprove = await models.m_pengadaan_approve.create(
                                {
                                    'id_mp': createSP.id_mp,
                                    // 'customer': req.body.id_customer,
                                    'apv_sales': "Y",
                                    'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                    'sales': req.user.id,
                                    'apv_ops': "N",
                                    'tgl_apv_ops': 0,
                                    'operasional': 0,
                                    'akunting': 0,
                                    'apv_akunting': "N",
                                    'tgl_apv_akt': 0,
                                    'tgl_apv_purch': 0,
                                    'purchasing': 0,
                                    'apv_purch': "N",
                                    'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')

                                }
                            )

                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": createSP.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": req.user.fullname + " membuat SP",
                                    "baca": "0"

                                },

                            )

                            if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create SP'
                                    },
                                    noSP: createSP.msp,
                                    noPH: createSP.ph,
                                    idmp: createSP.id_mp
                                }
                            }
                        }
                    }
                }
            }
        }
        else {

            const createSP = await models.m_pengadaan.create(
                {
                    'id_admin': req.user.id,
                    'mp_ref': 0,
                    'ph': "Q" + kodeCabang + core.moment(Date.now()).format('YY') + "-" + "00001",
                    'msp': getPerusahaan.id_bu + "-SO-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                    'mspk': getPerusahaan.id_bu + "-PK-" + core.moment(Date.now()).format('YY') + '-' + "000001",
                    'memo': req.body.memo,
                    'id_sales': req.body.id_sales,
                    'id_sales': req.body.id_sales,
                    'id_gl': req.body.id_gl,
                    'id_asm': req.body.id_asm,
                    'id_mgr': req.body.id_mgr,
                    'id_kacab': req.body.id_kacab,
                    'id_amd': req.body.id_amd,
                    'id_customer': req.body.id_customer,
                    'alamat_invoice': req.body.alamat_invoice,
                    'top': "",
                    'leadtime': "",
                    'do': "-",
                    'service': req.body.service,
                    'jenis_barang': req.body.jenis_barang,
                    'packing': req.body.packing,
                    'asuransi': req.body.asuransi,
                    'asuransi_fee': req.body.asuransi_fee,
                    'foto': "",
                    'tgl_pickup': core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                    'tgl_estimasi_tiba': 0,
                    'tgl_bongkar': core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:mm:ss"),
                    'waktu_muat': core.moment(req.body.tgl_pickup).format("hh:mm:ss"),
                    'waktu_bongkar': core.moment(req.body.tgl_bongkar).format("hh:mm:ss"),
                    'armada': "",
                    'transit': "",
                    'via': "",
                    'kendaraan': "",
                    'mitra': "",
                    'kendaraan_mitra': "",
                    'biaya_muat': req.body.biaya_muat,
                    'biaya_muat_bongkar': req.body.biaya_muat_bongkar,
                    'overtonase': req.body.overtonase,
                    'biaya_multi_drop': req.body.overtonase,
                    'biaya_lain': req.body.overtonase,
                    'diskon': 0,
                    'total_keseluruhan': req.body.total_keseluruhan,
                    'status': 1,
                    'print_spk': "0",
                    'spk_date': 0,
                    'tgl_update': Date.now(),
                    'tgl_order': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    'new': 1,
                    'is_multi': req.body.is_multi,
                    'is_tarif_multidrop': req.body.is_tarif_multidrop,
                    'is_issue': 0

                }
            )

            if (createSP) {
                const createStatusOrder = await models.m_status_order.create(
                    {
                        'id_mp': createSP.id_mp,
                        'customer': req.body.id_customer,
                        'act_customer': "Y",
                        'tgl_act_1': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        'sales': req.user.id,
                        'act_sales': "Y",
                        'tgl_act_2': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        'akunting': 0,
                        'act_akunting': "N",
                        'tgl_act_3': 0,
                        'operasional': 0,
                        'kendaraan_operasional': "N",
                        'tgl_act_4': 0,
                        'purchasing': 0,
                        'tgl_act_5': 0,
                        'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                    }
                )

                const createPengadaanApprove = await models.m_pengadaan_approve.create(
                    {
                        'id_mp': createSP.id_mp,
                        // 'customer': req.body.id_customer,
                        'apv_sales': "Y",
                        'tgl_apv_sales': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                        'sales': req.user.id,
                        'apv_ops': "N",
                        'tgl_apv_ops': 0,
                        'operasional': 0,
                        'akunting': 0,
                        'apv_akunting': "N",
                        'tgl_apv_akt': 0,
                        'tgl_apv_purch': 0,
                        'purchasing': 0,
                        'apv_purch': "N",
                        'tgl_update': core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
                    }
                )

                const updStatMsg = await models.m_chat.create(
                    {
                        "id_mp": createSP.id_mp,
                        "user": req.user.id,
                        "ph": "",
                        "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        "chat": req.user.fullname + " membuat SP",
                        "baca": "0"
                    },
                )

                if (createStatusOrder && createPengadaanApprove && updStatMsg) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success create SP'
                        },
                        noSP: createSP.msp,
                        noPH: createSP.ph,
                        idmp: createSP.id_mp
                    }
                }
            }


        }


        // =============
        // if (getUser) {
        //     // const updPengadanaan = await models.m_pengadaan.update(
        //     //     // {
        //     //     //     is_multi: req.body.is_multi
        //     //     // },
        //     //     {
        //     //         where: {
        //     //             id_mp: req.body.id_mp
        //     //         }
        //     //     }
        //     // )

        //     if (dateNow == getDate) {
        //         var zeroCode

        //         if (getcharacterNumber.length == 1) {
        //             var zeroCode = "0000"
        //         }
        //         else if (getcharacterNumber.length == 2) {
        //             var zeroCode = "000"
        //         }
        //         else if (getcharacterNumber.length == 3) {
        //             var zeroCode = "00"
        //         }
        //         else if (getcharacterNumber.length == 4) {
        //             var zeroCode = "0"
        //         }
        //         else if (getcharacterNumber.length == 5) {
        //             var zeroCode = ""
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

exports.getSpSales = async (req, res) => {
    try {

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        // models.m_pengadaan.belongsTo(models.m_chat, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat' });
        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_pengadaan.findAndCountAll(
                {
                    order: [['id_mp', 'desc']],
                    where: {
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msp: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}
                    },

                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.users,
                            required: false
                        },
                        {
                            model: models.customer,
                            required: false,

                        },

                        {
                            model: models.m_status_order,
                            required: false,
                            include: [
                                { model: models.users }
                            ]

                        },
                    ]

                }
            )

            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {
                        no: no++,
                        idmp: item.id_mp,
                        sp: item.msp,
                        salesName: item.user.nama_lengkap,
                        perusahaan: item.customer?.nama_perusahaan,
                        service: item.service,
                        pickupDate: core.moment(item.tgl_pickup,).format('YYYY-MM-DD hh:mm:ss'),
                        // kendaraan: item.m_pengadaan_detail.kendaraan,
                        approveAct: item.m_status_order.act_akunting,
                        dateApproveAct: core.moment(item.m_status_order.tgl_act_3).format('YYYY-MM-DD HH:mm:ss'),
                        approveOps: item.m_status_order.kendaraan_operasional,
                        idops: item.m_status_order.operasional,
                        operationalName: item.m_status_order.user == null ? "" : item.m_status_order.user.nama_lengkap,
                        dateApproveOps: core.moment(item.m_status_order.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.m_status_order.kendaraan_purchasing,
                        dateApprovePurch: core.moment(item.m_status_order.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                        // chat: item.m_chat
                        // idMuat: item.m_pengadaan_detail.id_almuat,
                        // idBongkar: item.m_pengadaan_detail.id_albongkar,
                        // destinasi
                        // kendaraan: item.m_status_order


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

exports.getSelectDetailSp = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getCompany = await models.customer.findAll(
                {
                    order: [['nama_perusahaan', 'asc']],
                    where: {
                        status: 1,
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    nama_perusahaan: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}

                    }
                }
            )


            const getDestination = await models.alamat.findAll(
                {


                    ...req.query.companyId ? {
                        order: [['pic', 'asc']],
                        where: {
                            id_customer: req.query.companyId
                        }
                    } : {}
                }
            )

            const getKendaraanjenis = await models.kendaraan_jenis.findAll(
                {
                    order: [['nama_kendaraan_jenis', 'desc']],
                    where: {
                        status: 1
                    }
                }
            )

            const getShipment = await models.m_shipment.findAll({ order: [['via', 'asc']] })

            const getNoSp = await models.m_pengadaan.findAll(
                {
                    order: [['id_mp', 'desc']],

                    where: {
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msp: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}
                    },
                    limit: 100
                }
            )
            const kodeCabang = getUser.kode_cabang;
            const getMarketing = await models.users.findAll(
                {
                    where: {
                        level: 'sales',
                        divisi: 'sales',
                        kode_cabang: kodeCabang
                    }


                }
            )


            if (getDestination && getKendaraanjenis && getShipment && getNoSp) {
                const response = {

                    spNumber: getNoSp.map((i) => {

                        return {
                            idmp: i.id_mp,
                            noSp: i.msp,
                            noPh: i.ph,
                            jenis_barang: i.jenis_barang


                        }
                    }),
                    customer: getCompany.map((i) => {

                        return {
                            id: i.id_customer,
                            company: i.nama_perusahaan,
                            companyStuff: i.jenis_barang

                        }
                    }).filter(i => i.company != ""),

                    marketing: getMarketing.map((i) => {
                        return {
                            id: i.id,
                            fullname: i.nama_lengkap,
                            cabang: i.kode_cabang,
                            divisi: i.divisi
                        }
                    }),

                    destination: req.query.companyId ? getDestination.map((i) => {
                        return {
                            id: i.id,
                            pic: i.pic,
                            address: i.alamat,
                            kecamatan: i.kecamatan,
                            idKota: i.id_kota,
                            kota: i.kota,


                        }
                    }) : {},

                    type: getKendaraanjenis.map((i) => {

                        return {
                            id: i.id_kendaraan_jenis,
                            type: i.nama_kendaraan_jenis,

                        }
                    }),
                    shipment: getShipment.map((i) => {

                        return {
                            id: i.id,
                            shipment: i.shipment,
                            via: i.via,

                        }
                    }),
                    via: [
                        {
                            via: "darat"
                        },
                        {
                            via: "laut"
                        },
                        {
                            via: "udara"
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

exports.createDetailSp = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // Ambil kota_muat dan kota_bongkar dari tabel alamat
            let kotaMuat = null;
            let kotaBongkar = null;
            
            if (req.body.id_almuat) {
                const alamatMuat = await models.alamat.findOne({
                    where: { id: req.body.id_almuat },
                    attributes: ['kota']
                });
                kotaMuat = alamatMuat ? alamatMuat.kota : null;
            }
            
            if (req.body.id_albongkar) {
                const alamatBongkar = await models.alamat.findOne({
                    where: { id: req.body.id_albongkar },
                    attributes: ['kota']
                });
                kotaBongkar = alamatBongkar ? alamatBongkar.kota : null;
            }
            
            const createDetail = await models.m_pengadaan_detail.create(
                {
                    'id_mp': req.body.idMp,
                    'ph': req.body.ph,
                    'no_sj': req.body.kpu ?? "",
                    'do': "",
                    'via': req.body.via,
                    'shipment': req.body.shipment,
                    'id_unit': 0,
                    'id_supir': 0,
                    'kendaraan': req.body.kendaraan,
                    'id_mitra': 0,
                    'kendaraan_mitra': "",
                    'id_almuat': req.body.id_almuat,
                    'id_albongkar': req.body.id_albongkar,
                    'id_kota_muat': req.body.id_kota_muat,
                    'id_kota_bongkar': req.body.id_kota_bongkar,
                    'kota_muat': kotaMuat,
                    'kota_bongkar': kotaBongkar,
                    'nama_barang': req.body.nama_barang,
                    'tgl_dropoff': core.moment(Date.now()).format('YYYY-MM-DD'),
                    'waktu_dropoff': "0000:00:00",
                    'berat': req.body.berat,
                    'qty': req.body.qty,
                    'koli': req.body.koli,
                    'volume': req.body.volume,
                    'harga_net': 0,
                    'diskon': req.body.diskon,
                    'harga_type': "",
                    'harga': req.body.harga,
                    'total': req.body.total,
                    'harga_muat': req.body.harga_muat,
                    'harga_bongkar': req.body.harga_bongkar,
                    'biaya_overtonase': req.body.biaya_overtonase,
                    'biaya_multimuat': req.body.biaya_multimuat,
                    'biaya_multidrop': req.body.biaya_multidrop,
                    'biaya_mel': req.body.biaya_mel,
                    'biaya_tambahan': req.body.biaya_tambahan,
                    'biaya_lain': req.body.biaya_lain,
                    // 'biaya_jalan': req.body.biaya_jalan,
                    'max_tonase': req.body.max_tonase,
                    'harga_selanjutnya': req.body.harga_selanjutnya,
                    'id_price_customer': req.body.id_price_customer,
                    'km': 0,
                    'ikat': 0,
                    'diskon': 0,
                    'durasi_lelang': "00:00:00",
                    'harga_lelang': 0,
                    'status': 0,
                    'tgl_update': Date.now(),
                    'tgl_lelang': 0,
                    'end_lelang': 0,
                }
            )

            if (createDetail) {
                const getPrice = await models.m_pengadaan_detail.findAll(
                    {
                        where: {
                            id_mp: req.body.idMp
                        }
                    }
                )

                const total = core.sumArray(getPrice.map((i) => i.total))
                const tarif = core.sumArray(getPrice.map((i) => i.harga))
                const biayaMuat = core.sumArray(getPrice.map((i) => i.harga_muat))
                const biayBongkar = core.sumArray(getPrice.map((i) => i.harga_bongkar))
                const biayaOvertonase = core.sumArray(getPrice.map((i) => i.biaya_overtonase))
                const biayaMultiMuat = core.sumArray(getPrice.map((i) => i.biaya_multimuat))
                const biayaMultiDrop = core.sumArray(getPrice.map((i) => i.biaya_multidrop))
                const biayaMel = core.sumArray(getPrice.map((i) => i.biaya_mel))
                const biayaTambahan = core.sumArray(getPrice.map((i) => i.biaya_tambahan))
                const biayaLain = core.sumArray(getPrice.map((i) => i.biaya_lain))
                const maxTonase = core.sumArray(getPrice.map((i) => i.max_tonase))
                const hargaSelanjutnya = core.sumArray(getPrice.map((i) => i.harga_selanjutnya))
                if (total) {
                    const udpTotalSp = await models.m_pengadaan.update(
                        {
                            total_keseluruhan: total,
                            biaya_muat: biayaMuat,
                            biaya_muat_bongkar: biayBongkar,
                            overtonase: maxTonase,
                            biaya_overtonase: biayaOvertonase,
                            biaya_multi_muat: biayaMultiMuat,
                            biaya_multi_drop: biayaMultiDrop,
                            biaya_lain: biayaLain,
                            biaya_tambahan: biayaTambahan,
                            biaya_mel: biayaMel,
                            biaya_jalan: tarif,
                            harga_selanjutnya: hargaSelanjutnya,


                        },
                        {
                            where: {
                                id_mp: req.body.idMp
                            }
                        }
                    )
                }



                const getuserbu = await models.users.findOne(
                    {
                        where: {
                            id: req.user.id
                        }
                    }
                )

                const getPengadaan = await models.m_pengadaan.findOne({
                    where: {
                        id_mp: req.body.idMp
                    }
                })

                const getPerusahaan = await models.m_bu.findOne(
                    {
                        where: {
                            id_bu: getuserbu.id_bu
                        }
                    }
                )

                const getDataSm = await models.m_sm.findAll(
                    {
                        order: [['id_msm', 'desc']],
                        limit: 1,
                        where: {
                            msm: {
                                [Op.like]: `%${getPerusahaan.id_bu}-SJ-%`
                            },
                        }
                    }
                )

                const dateNow = core.moment(Date.now()).format('YY')

                const kodeCabang = getUser.kode_cabang

                if (getDataSm.length === 0) {
                    // Calculate tgl_eta based on tgl_bongkar + leadtime (in days)
                    // Use default leadtime of 1 day if leadtime is empty or invalid
                    const leadTimeDays = getPengadaan && getPengadaan.leadtime && getPengadaan.leadtime.trim() !== '' ? parseInt(getPengadaan.leadtime.trim()) : 1;
                    const tglEta = !isNaN(leadTimeDays) ? core.moment(Date.now()).add(leadTimeDays, 'days').format("YYYY-MM-DD HH:mm:ss") : core.moment(Date.now()).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                    
                    const createSM = await models.m_sm.create(
                        {
                            'id_mpd': createDetail.id_mpd,
                            'id_mitra_pickup': 0,
                            'id_mitra': 0,
                            'id_mitra_2': 0,
                            'msm': getPerusahaan.id_bu + "-SJ-" + dateNow + "-" + "000001",
                            'photo': '',
                            'tgl_muat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            'tgl_bongkar': '1970-01-01',
                            'tgl_eta': tglEta,
                            'pembungkus': '-',
                            'berat': 0,
                            'qty': 0,
                            'koli': 0,
                            'ikat': 0,
                            'km': 0,
                            'do': '-',
                            'kendaraan': '',
                            'kendaraan_2': '',
                            'pickup_kontainer': '',
                            'id_unit': 0,
                            'id_unit_2': 0,
                            'id_unit_3': 0,
                            'id_driver': 0,
                            'id_driver_2': 0,
                            'id_driver_3': 0,
                            'telp_2': '',
                            'seal': '',
                            'nama_kapal': '',
                            'kapal_berangkat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            'tgl_update': Date.now(),
                            'keterangan_ap': '',
                            'status_date': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            'id_bu': getuserbu.id_bu,
                            'id_bu_brench': getuserbu.id_bu_brench,
                            'id_user': req.user.id,
                        }
                    )

                    if (createSM) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create Sp Detail'
                            },
                        }
                    }
                } else {
                    const getSm = Number(getDataSm[0].msm.substring(9, 16))
                    const smCode = getSm + 1

                    const getcharacterNumber = smCode.toString()
                    const getDate = getDataSm[0].msm.substring(6, 8)

                    if (smCode > 999999) {
                        output = {
                            status: {
                                code: 400,
                                message: 'Gagal menginput data kode sudah maks di 999999'
                            }
                        }
                    } else {
                        if (dateNow === getDate) {
                            var zeroCode

                            if (getcharacterNumber.length == 1) {
                                var zeroCode = "00000"
                            } else if (getcharacterNumber.length == 2) {
                                var zeroCode = "0000"
                            } else if (getcharacterNumber.length == 3) {
                                var zeroCode = "000"
                            } else if (getcharacterNumber.length == 4) {
                                var zeroCode = "00"
                            } else if (getcharacterNumber.length == 5) {
                                var zeroCode = "0"
                            } else if (getcharacterNumber.length == 6) {
                                var zeroCode = ""
                            }

                            // Calculate tgl_eta based on tgl_bongkar + leadtime (in days)
                            // Use default leadtime of 1 day if leadtime is empty or invalid
                            const leadTimeDays = getPengadaan && getPengadaan.leadtime && getPengadaan.leadtime.trim() !== '' ? parseInt(getPengadaan.leadtime.trim()) : 1;
                            const tglEta = !isNaN(leadTimeDays) ? core.moment(Date.now()).add(leadTimeDays, 'days').format("YYYY-MM-DD HH:mm:ss") : core.moment(Date.now()).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                            
                            const createSM = await models.m_sm.create(
                                {
                                    'id_mpd': createDetail.id_mpd,
                                    'id_mitra_pickup': 0,
                                    'id_mitra': 0,
                                    'id_mitra_2': 0,
                                    'msm': getPerusahaan.id_bu + "-SJ-" + dateNow + "-" + zeroCode + smCode,
                                    'photo': '',
                                    'tgl_muat': core.moment(getPengadaan.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_bongkar': '1970-01-01',
                                    'tgl_eta': tglEta,
                                    'pembungkus': '-',
                                    'berat': 0,
                                    'qty': 0,
                                    'koli': 0,
                                    'ikat': 0,
                                    'km': 0,
                                    'do': '-',
                                    'kendaraan': '',
                                    'kendaraan_2': '',
                                    'pickup_kontainer': '',
                                    'id_unit': 0,
                                    'id_unit_2': 0,
                                    'id_unit_3': 0,
                                    'id_driver': 0,
                                    'id_driver_2': 0,
                                    'id_driver_3': 0,
                                    'telp_2': '',
                                    'seal': '',
                                    'nama_kapal': '',
                                    'kapal_berangkat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_update': Date.now(),
                                    'keterangan_ap': '',
                                    'status_date': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'id_bu': getuserbu.id_bu,
                                    'id_bu_brench': getuserbu.id_bu_brench,
                                    'id_user': req.user.id,
                                }
                            )

                            if (createSM) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create Sp Detail'
                                    },
                                }
                            }
                        } else {
                            // Calculate tgl_eta based on tgl_bongkar + leadtime (in days)
                            // Use default leadtime of 1 day if leadtime is empty or invalid
                            const leadTimeDays = getPengadaan && getPengadaan.leadtime && getPengadaan.leadtime.trim() !== '' ? parseInt(getPengadaan.leadtime.trim()) : 1;
                            const tglEta = !isNaN(leadTimeDays) ? core.moment(Date.now()).add(leadTimeDays, 'days').format("YYYY-MM-DD HH:mm:ss") : core.moment(Date.now()).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                            
                            const createSM = await models.m_sm.create(
                                {
                                    'id_mpd': createDetail.id_mpd,
                                    'id_mitra_pickup': 0,
                                    'id_mitra': 0,
                                    'id_mitra_2': 0,
                                    'msm': getPerusahaan.id_bu + "-SJ-" + dateNow + "-" + "000001",
                                    'photo': '',
                                    'tgl_muat': core.moment(getPengadaan.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_bongkar': '1970-01-01',
                                    'tgl_eta': tglEta,
                                    'pembungkus': '-',
                                    'berat': 0,
                                    'qty': 0,
                                    'koli': 0,
                                    'ikat': 0,
                                    'km': 0,
                                    'do': '-',
                                    'kendaraan': '',
                                    'kendaraan_2': '',
                                    'pickup_kontainer': '',
                                    'id_unit': 0,
                                    'id_unit_2': 0,
                                    'id_unit_3': 0,
                                    'id_driver': 0,
                                    'id_driver_2': 0,
                                    'id_driver_3': 0,
                                    'telp_2': '',
                                    'seal': '',
                                    'nama_kapal': '',
                                    'kapal_berangkat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_update': Date.now(),
                                    'keterangan_ap': '',
                                    'status_date': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'id_bu': getuserbu.id_bu,
                                    'id_bu_brench': getuserbu.id_bu_brench,
                                    'id_user': req.user.id,
                                }
                            )

                            if (createSM) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create Sp Detail'
                                    },
                                }
                            }
                        }
                    }
                }
                // ========
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

exports.createDetailSp_vico = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // Validasi: jika is_multi = 0, hanya boleh create 1 detail
            const getPengadaanForValidation = await models.m_pengadaan.findOne({
                where: {
                    id_mp: req.body.idMp
                }
            })

            if (getPengadaanForValidation && getPengadaanForValidation.is_multi === 0) {
                // Cek apakah sudah ada detail yang dibuat sebelumnya
                const existingDetail = await models.m_pengadaan_detail.findOne({
                    where: {
                        id_mp: req.body.idMp
                    }
                })

                if (existingDetail) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Tidak dapat membuat detail lebih dari 1 karena SO Single Drop'
                        }
                    }
                    const errorsFromMiddleware = await customErrorMiddleware(req)
                    if (!errorsFromMiddleware) {
                        return res.status(output.status.code).send(output)
                    } else {
                        return res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
                    }
                }
            }

            // Hitung total_produk
            const totalProduk = (req.body.harga || 0) * (req.body.jumlah || 0)
            
            // Ambil semua biaya untuk perhitungan total detail
            const detailBiayaOvertonase = req.body.biaya_overtonase || 0
            const detailBiayaPengganti = 0 // Tidak ada di detail level
            const detailBiayaMuat = req.body.harga_muat || 0
            const detailBiayaMuatBongkar = req.body.harga_bongkar || 0
            const detailBiayaMultiDrop = req.body.biaya_multidrop || 0
            const detailBiayaLain = req.body.biaya_lain || 0
            const detailBiayaMel = req.body.biaya_mel || 0
            const detailBiayaTambahan = req.body.biaya_tambahan || 0
            const detailBiayaMultiMuat = req.body.biaya_multimuat || 0
            
            // Hitung subtotal detail: totalProduk + semua biaya
            const subtotalDetail = totalProduk + detailBiayaOvertonase + detailBiayaPengganti + detailBiayaMuat + detailBiayaMuatBongkar + detailBiayaMultiDrop + detailBiayaLain + detailBiayaMel + detailBiayaTambahan + detailBiayaMultiMuat
            
            // Hitung diskon dari subtotal detail (asumsi diskon adalah persentase, misalnya 20 berarti 20%)
            const diskonPersen = req.body.diskon || 0
            const diskonNilai = subtotalDetail * (diskonPersen / 100)
            
            // Hitung base amount: subtotal detail - diskonNilai
            const baseAmount = subtotalDetail - diskonNilai
            
            // Hitung pajak dari base amount (hanya jika ada dari payload frontend)
            const pajak = req.body.pajak ? (req.body.pajak / 100) * baseAmount : 0
            
            // Hitung total: totalProduk + semua biaya - diskonNilai + pajak
            const total = baseAmount + pajak
            
            // Ambil kota_muat dan kota_bongkar dari tabel alamat
            let kotaMuat = null;
            let kotaBongkar = null;
            
            if (req.body.id_almuat) {
                const alamatMuat = await models.alamat.findOne({
                    where: { id: req.body.id_almuat },
                    attributes: ['kota']
                });
                kotaMuat = alamatMuat ? alamatMuat.kota : null;
            }
            
            if (req.body.id_albongkar) {
                const alamatBongkar = await models.alamat.findOne({
                    where: { id: req.body.id_albongkar },
                    attributes: ['kota']
                });
                kotaBongkar = alamatBongkar ? alamatBongkar.kota : null;
            }
            
            const createDetail = await models.m_pengadaan_detail.create(
                {
                    'id_mp': req.body.idMp,
                    'ph': req.body.ph,
                    'no_sj': req.body.kpu ?? "",
                    'do': "",
                    'via': req.body.via,
                    'shipment': req.body.shipment,
                    'id_unit': 0,
                    'id_supir': 0,
                    'kendaraan': req.body.kendaraan,
                    'id_mitra': 0,
                    'kendaraan_mitra': "",
                    'id_almuat': req.body.id_almuat,
                    'id_albongkar': req.body.id_albongkar,
                    'id_kota_muat': req.body.id_kota_muat,
                    'id_kota_bongkar': req.body.id_kota_bongkar,
                    'kota_muat': kotaMuat,
                    'kota_bongkar': kotaBongkar,
                    'nama_barang': req.body.nama_barang,
                    'tgl_dropoff': core.moment(Date.now()).format('YYYY-MM-DD'),
                    'waktu_dropoff': "0000:00:00",
                    'berat': req.body.berat,
                    'qty': req.body.qty,
                    'koli': req.body.koli,
                    'volume': req.body.volume,
                    'harga_net': 0,
                    'diskon': req.body.diskon,
                    'harga_type': "",
                    'harga': req.body.harga,
                    'jumlah': req.body.jumlah || 0,
                    'total_produk': totalProduk,
                    'total': Math.round(total), // Bulatkan ke integer
                    'harga_muat': req.body.harga_muat || 0,
                    'harga_bongkar': req.body.harga_bongkar || 0,
                    'biaya_overtonase': req.body.biaya_overtonase || 0,
                    'biaya_multimuat': req.body.biaya_multimuat || 0,
                    'biaya_multidrop': req.body.biaya_multidrop || 0,
                    'biaya_mel': req.body.biaya_mel || 0,
                    'biaya_tambahan': req.body.biaya_tambahan || 0,
                    'biaya_lain': req.body.biaya_lain || 0,
                    'pajak': req.body.pajak !== undefined ? req.body.pajak : null,
                    'max_tonase': req.body.max_tonase,
                    'harga_selanjutnya': req.body.harga_selanjutnya,
                    'id_price_customer': req.body.id_price_customer,
                    'km': 0,
                    'ikat': 0,
                    'durasi_lelang': "00:00:00",
                    'harga_lelang': 0,
                    'status': 0,
                    'tgl_update': Date.now(),
                    'tgl_lelang': 0,
                    'end_lelang': 0,
                }
            )

            if (createDetail) {
                const getPrice = await models.m_pengadaan_detail.findAll(
                    {
                        where: {
                            id_mp: req.body.idMp
                        }
                    }
                )

                // Get existing m_pengadaan data to get diskon and biaya_pengganti
                const getPengadaanData = await models.m_pengadaan.findOne({
                    where: {
                        id_mp: req.body.idMp
                    }
                })

                const subtotal = core.sumArray(getPrice.map((i) => i.total_produk || 0))
                const tarif = core.sumArray(getPrice.map((i) => i.harga))
                const biayaMuat = core.sumArray(getPrice.map((i) => i.harga_muat))
                const biayBongkar = core.sumArray(getPrice.map((i) => i.harga_bongkar))
                const biayaOvertonase = core.sumArray(getPrice.map((i) => i.biaya_overtonase))
                const biayaMultiMuat = core.sumArray(getPrice.map((i) => i.biaya_multimuat))
                const biayaMultiDrop = core.sumArray(getPrice.map((i) => i.biaya_multidrop))
                const biayaMel = core.sumArray(getPrice.map((i) => i.biaya_mel))
                const biayaTambahan = core.sumArray(getPrice.map((i) => i.biaya_tambahan))
                const biayaLain = core.sumArray(getPrice.map((i) => i.biaya_lain))
                const maxTonase = core.sumArray(getPrice.map((i) => i.max_tonase))
                const hargaSelanjutnya = core.sumArray(getPrice.map((i) => i.harga_selanjutnya))
                
                // Hitung diskonNilai dan pajakNilai dari setiap detail
                const diskonNilaiArray = getPrice.map((detail) => {
                    const detailSubtotal = (detail.total_produk || 0) + (detail.biaya_overtonase || 0) + (detail.harga_muat || 0) + (detail.harga_bongkar || 0) + (detail.biaya_multidrop || 0) + (detail.biaya_lain || 0) + (detail.biaya_mel || 0) + (detail.biaya_tambahan || 0) + (detail.biaya_multimuat || 0)
                    const diskonPersen = detail.diskon || 0
                    return diskonPersen ? (diskonPersen / 100) * detailSubtotal : 0
                })
                
                const pajakNilaiArray = getPrice.map((detail) => {
                    const detailSubtotal = (detail.total_produk || 0) + (detail.biaya_overtonase || 0) + (detail.harga_muat || 0) + (detail.harga_bongkar || 0) + (detail.biaya_multidrop || 0) + (detail.biaya_lain || 0) + (detail.biaya_mel || 0) + (detail.biaya_tambahan || 0) + (detail.biaya_multimuat || 0)
                    const diskonPersen = detail.diskon || 0
                    const diskonNilai = diskonPersen ? (diskonPersen / 100) * detailSubtotal : 0
                    const baseAmount = detailSubtotal - diskonNilai
                    const pajakPersen = detail.pajak || 0
                    return pajakPersen ? (pajakPersen / 100) * baseAmount : 0
                })
                
                // Sum diskonNilai dan pajakNilai dari semua detail
                const diskonNilaiTotal = core.sumArray(diskonNilaiArray)
                const pajakNilaiTotal = core.sumArray(pajakNilaiArray)
                
                // Sum total dari semua detail untuk total_keseluruhan
                const totalKeseluruhan = core.sumArray(getPrice.map((i) => i.total || 0))
                
                const biayaPengganti = getPengadaanData ? (getPengadaanData.biaya_pengganti || 0) : 0
                
                if (subtotal !== null && subtotal !== undefined) {
                    const udpTotalSp = await models.m_pengadaan.update(
                        {
                            subtotal: subtotal,
                            diskon: Math.round(diskonNilaiTotal),
                            pajak: Math.round(pajakNilaiTotal),
                            total_keseluruhan: totalKeseluruhan,
                            biaya_muat: biayaMuat,
                            biaya_muat_bongkar: biayBongkar,
                            overtonase: maxTonase,
                            biaya_overtonase: biayaOvertonase,
                            biaya_multi_muat: biayaMultiMuat,
                            biaya_multi_drop: biayaMultiDrop,
                            biaya_lain: biayaLain,
                            biaya_tambahan: biayaTambahan,
                            biaya_mel: biayaMel,
                            biaya_jalan: tarif,
                            harga_selanjutnya: hargaSelanjutnya,


                        },
                        {
                            where: {
                                id_mp: req.body.idMp
                            }
                        }
                    )
                }



                const getuserbu = await models.users.findOne(
                    {
                        where: {
                            id: req.user.id
                        }
                    }
                )

                const getPengadaan = await models.m_pengadaan.findOne({
                    where: {
                        id_mp: req.body.idMp
                    }
                })

                const getPerusahaan = await models.m_bu.findOne(
                    {
                        where: {
                            id_bu: getuserbu.id_bu
                        }
                    }
                )

                const getDataSm = await models.m_sm.findAll(
                    {
                        order: [['id_msm', 'desc']],
                        limit: 1,
                        where: {
                            msm: {
                                [Op.like]: `%${getPerusahaan.id_bu}-SJ-%`
                            },
                        }
                    }
                )

                const dateNow = core.moment(Date.now()).format('YY')

                const kodeCabang = getUser.kode_cabang

                if (getDataSm.length === 0) {
                    // Calculate tgl_eta based on tgl_bongkar + leadtime (in days)
                    // Use default leadtime of 1 day if leadtime is empty or invalid
                    const leadTimeDays = getPengadaan && getPengadaan.leadtime && getPengadaan.leadtime.trim() !== '' ? parseInt(getPengadaan.leadtime.trim()) : 1;
                    const tglEta = !isNaN(leadTimeDays) ? core.moment(Date.now()).add(leadTimeDays, 'days').format("YYYY-MM-DD HH:mm:ss") : core.moment(Date.now()).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                    
                    const createSM = await models.m_sm.create(
                        {
                            'id_mpd': createDetail.id_mpd,
                            'id_mitra_pickup': 0,
                            'id_mitra': 0,
                            'id_mitra_2': 0,
                            'msm': getPerusahaan.id_bu + "-SJ-" + dateNow + "-" + "000001",
                            'photo': '',
                            'tgl_muat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            'tgl_bongkar': '1970-01-01',
                            'tgl_eta': tglEta,
                            'pembungkus': '-',
                            'berat': 0,
                            'qty': 0,
                            'koli': 0,
                            'ikat': 0,
                            'km': 0,
                            'do': '-',
                            'kendaraan': '',
                            'kendaraan_2': '',
                            'pickup_kontainer': '',
                            'id_unit': 0,
                            'id_unit_2': 0,
                            'id_unit_3': 0,
                            'id_driver': 0,
                            'id_driver_2': 0,
                            'id_driver_3': 0,
                            'telp_2': '',
                            'seal': '',
                            'nama_kapal': '',
                            'kapal_berangkat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            'tgl_update': Date.now(),
                            'keterangan_ap': '',
                            'status_date': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            'id_bu': getuserbu.id_bu,
                            'id_bu_brench': getuserbu.id_bu_brench,
                            'id_user': req.user.id,
                        }
                    )

                    if (createSM) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create Sp Detail'
                            },
                        }
                    }
                } else {
                    const getSm = Number(getDataSm[0].msm.substring(9, 16))
                    const smCode = getSm + 1

                    const getcharacterNumber = smCode.toString()
                    const getDate = getDataSm[0].msm.substring(6, 8)

                    if (smCode > 999999) {
                        output = {
                            status: {
                                code: 400,
                                message: 'Gagal menginput data kode sudah maks di 999999'
                            }
                        }
                    } else {
                        if (dateNow === getDate) {
                            var zeroCode

                            if (getcharacterNumber.length == 1) {
                                var zeroCode = "00000"
                            } else if (getcharacterNumber.length == 2) {
                                var zeroCode = "0000"
                            } else if (getcharacterNumber.length == 3) {
                                var zeroCode = "000"
                            } else if (getcharacterNumber.length == 4) {
                                var zeroCode = "00"
                            } else if (getcharacterNumber.length == 5) {
                                var zeroCode = "0"
                            } else if (getcharacterNumber.length == 6) {
                                var zeroCode = ""
                            }

                            // Calculate tgl_eta based on tgl_bongkar + leadtime (in days)
                            // Use default leadtime of 1 day if leadtime is empty or invalid
                            const leadTimeDays = getPengadaan && getPengadaan.leadtime && getPengadaan.leadtime.trim() !== '' ? parseInt(getPengadaan.leadtime.trim()) : 1;
                            const tglEta = !isNaN(leadTimeDays) ? core.moment(Date.now()).add(leadTimeDays, 'days').format("YYYY-MM-DD HH:mm:ss") : core.moment(Date.now()).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                            
                            const createSM = await models.m_sm.create(
                                {
                                    'id_mpd': createDetail.id_mpd,
                                    'id_mitra_pickup': 0,
                                    'id_mitra': 0,
                                    'id_mitra_2': 0,
                                    'msm': getPerusahaan.id_bu + "-SJ-" + dateNow + "-" + zeroCode + smCode,
                                    'photo': '',
                                    'tgl_muat': core.moment(getPengadaan.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_bongkar': '1970-01-01',
                                    'tgl_eta': tglEta,
                                    'pembungkus': '-',
                                    'berat': 0,
                                    'qty': 0,
                                    'koli': 0,
                                    'ikat': 0,
                                    'km': 0,
                                    'do': '-',
                                    'kendaraan': '',
                                    'kendaraan_2': '',
                                    'pickup_kontainer': '',
                                    'id_unit': 0,
                                    'id_unit_2': 0,
                                    'id_unit_3': 0,
                                    'id_driver': 0,
                                    'id_driver_2': 0,
                                    'id_driver_3': 0,
                                    'telp_2': '',
                                    'seal': '',
                                    'nama_kapal': '',
                                    'kapal_berangkat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_update': Date.now(),
                                    'keterangan_ap': '',
                                    'status_date': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'id_bu': getuserbu.id_bu,
                                    'id_bu_brench': getuserbu.id_bu_brench,
                                    'id_user': req.user.id,
                                }
                            )

                            if (createSM) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create Sp Detail'
                                    },
                                }
                            }
                        } else {
                            // Calculate tgl_eta based on tgl_bongkar + leadtime (in days)
                            // Use default leadtime of 1 day if leadtime is empty or invalid
                            const leadTimeDays = getPengadaan && getPengadaan.leadtime && getPengadaan.leadtime.trim() !== '' ? parseInt(getPengadaan.leadtime.trim()) : 1;
                            const tglEta = !isNaN(leadTimeDays) ? core.moment(Date.now()).add(leadTimeDays, 'days').format("YYYY-MM-DD HH:mm:ss") : core.moment(Date.now()).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                            
                            const createSM = await models.m_sm.create(
                                {
                                    'id_mpd': createDetail.id_mpd,
                                    'id_mitra_pickup': 0,
                                    'id_mitra': 0,
                                    'id_mitra_2': 0,
                                    'msm': getPerusahaan.id_bu + "-SJ-" + dateNow + "-" + "000001",
                                    'photo': '',
                                    'tgl_muat': core.moment(getPengadaan.tgl_pickup).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_bongkar': '1970-01-01',
                                    'tgl_eta': tglEta,
                                    'pembungkus': '-',
                                    'berat': 0,
                                    'qty': 0,
                                    'koli': 0,
                                    'ikat': 0,
                                    'km': 0,
                                    'do': '-',
                                    'kendaraan': '',
                                    'kendaraan_2': '',
                                    'pickup_kontainer': '',
                                    'id_unit': 0,
                                    'id_unit_2': 0,
                                    'id_unit_3': 0,
                                    'id_driver': 0,
                                    'id_driver_2': 0,
                                    'id_driver_3': 0,
                                    'telp_2': '',
                                    'seal': '',
                                    'nama_kapal': '',
                                    'kapal_berangkat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'tgl_update': Date.now(),
                                    'keterangan_ap': '',
                                    'status_date': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    'id_bu': getuserbu.id_bu,
                                    'id_bu_brench': getuserbu.id_bu_brench,
                                    'id_user': req.user.id,
                                }
                            )

                            if (createSM) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success create Sp Detail'
                                    },
                                }
                            }
                        }
                    }
                }
                // ========
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
// exports.createDetailSM = async (req, res) => {
//     try {

//         const datenow = core.moment(Date.now()).format('YY')

//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {

//             const getDetail = await models.m_pengadaan_detail.findAll(
//                 {
//                     where: {
//                         id_mp: req.body.idmp
//                     },
//                     include: [
//                         {
//                             model: models.m_pengadaan,
//                             required: false,
//                             include:
//                                 [
//                                     {
//                                         model: models.customer,
//                                         include: [
//                                             {
//                                                 model: models.alamat
//                                             },

//                                         ]
//                                     },
//                                     {
//                                         model: models.users
//                                     }
//                                 ]

//                         }, 
//                         {
//                             model: models.alamat,
//                             required: true
//                         }
//                     ]
//                 }
//             )
//             if (getDetail) {

//                 const getDataSm = await models.m_sm.findAll(
//                     {
//                         order: [['id_msm', 'desc']],
//                         limit: 1
//                     }

//                 )


//                 const getSm = Number(getDataSm[0].msm.substring(8, 15))
//                 const getChar = getSm.toString()
//                 const smCode = getSm + 1
//                 const kodeCabang1 = getUser.kode_cabang
//                 const getDateData = getDataSm[0].tgl_update
//                 const getdate1 = core.moment(getDateData).format('YY') 

//                 getDetail.map((i) => {
//                 if (datenow == getdate1) {
//                     var zerocody
//                     if (getChar.length == 1) {
//                         zerocody = "0000"
//                     }
//                     if (getChar.length == 2) {
//                         zerocody = "000"
//                     }
//                     if (getChar.length == 3) {
//                         zerocody = "00"
//                     }
//                     if (getChar.length == 4) {
//                         zerocody = "0"
//                     }
//                     if (getChar.length == 5) {
//                         zerocody = ""
//                     }
//                     const zeroCode = zerocody
//                     if (getDetail) {

//                         // const createSM = await models.m_sm.create(
//                         //     {
//                         //         'id_mpd': createDetail.id_mpd,
//                         //         'id_mitra_pickup': 0,
//                         //         'id_mitra': 0,
//                         //         'id_mitra_2': 0,
//                         //         'msm': kodeCabang1 + getdate1 + "-" + zeroCode + smCode,
//                         //         'photo': '',
//                         //         'tgl_muat': core.moment("0000-00-00 00:00:00"),
//                         //         'pembungkus': -'',
//                         //         'berat': i.berat,
//                         //         'qty': i.qty,
//                         //         'koli': i.koli,
//                         //         'do': '-',
//                         //         'kendaraan': '',
//                         //         'kendaraan_2': '',
//                         //         'pickup_kontainer': '',
//                         //         'id_unit': 0,
//                         //         'id_unit_2': 0,
//                         //         'id_unit_3': 0,
//                         //         'id_driver': 0,
//                         //         'id_driver_2': 0,
//                         //         'id_driver_3': 0,
//                         //         'telp_2': '',
//                         //         'seal': '',
//                         //         'nama_kapal': '',
//                         //         'kapal_berangkat': '',
//                         //         'tgl_update': Date.now(),
//                         //         'keterangan_ap': '',
//                         //         'status_date': '' 
//                         //     }
//                         // )
//                         // if (createSM) {
//                         //     output = {
//                         //         status: {
//                         //             code: 200,
//                         //             message: 'Success create Sp Detail'
//                         //         },

//                         //     }
//                         // }
//                     }

//                 } else {
//                     const createSM = await models.m_sm.create(
//                         {
//                             'id_mpd': i.id_mpd,
//                             'id_mitra_pickup': 0,
//                             'id_mitra': 0,
//                             'id_mitra_2': 0,
//                             'msm': kodeCabang1 + getdate1 + "-" + "00001",
//                             'photo': "",
//                             'tgl_muat': "0000-00-00 00:00:00",
//                             'pembungkus': "-",
//                             'berat': i.berat,
//                             'qty': i.qty,
//                             'koli': i.koli,
//                             'do': '-',
//                             'id_unit': 0,
//                             'id_unit_2': 0,
//                             'id_unit_3': 0,
//                             'id_driver': 0,
//                             'id_driver_2': 0,
//                             'id_driver_3': 0

//                         }
//                     )
//                     if (createSM) {
//                         output = {
//                             status: {
//                                 code: 200,
//                                 message: 'Success create Sp Detail'
//                             },

//                         }
//                     }



//                 }

//             }
//         }
//         }
//         // }
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

exports.deleteDetailSp = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDataMpd = await models.m_pengadaan_detail.findOne(
                {
                    where: {
                        id_mpd: req.body.id
                    }
                }
            )
            const getPriceTotal = getDataMpd.total
            const totalProdukDeleted = getDataMpd.total_produk || 0
            const hargaMuat = getDataMpd.harga_muat
            const hargaBongkar = getDataMpd.harga_bongkar
            const biayaOvertonase = getDataMpd.biaya_overtonase
            const biayaMultiMuat = getDataMpd.biaya_multimuat
            const biayaMultiDrop = getDataMpd.biaya_multidrop
            const biayaMel = getDataMpd.biaya_mel
            const biayaTambahan = getDataMpd.biaya_tambahan
            const biayaLain = getDataMpd.biaya_lain
            const maxTonase = getDataMpd.max_tonase
            const getPrice = getDataMpd.harga
            const hargaSelanjutnya = getDataMpd.harga_selanjutnya


            const getIdmp = getDataMpd.id_mp
            if (getDataMpd) {
                const getPengadaan = await models.m_pengadaan.findOne(
                    {
                        where: {
                            id_mp: getIdmp
                        }
                    }
                )

                // Get remaining details to recalculate subtotal
                const getRemainingPrice = await models.m_pengadaan_detail.findAll(
                    {
                        where: {
                            id_mp: getIdmp,
                            id_mpd: { [Op.ne]: req.body.id }
                        }
                    }
                )

                const biayaMuatMp = getPengadaan.biaya_muat
                const biayaBongkarMp = getPengadaan.biaya_muat_bongkar
                const overtonaseMp = getPengadaan.overtonase
                const biayaOvertonaseMp = getPengadaan.biaya_overtonase
                const biayaMultidropMp = getPengadaan.biaya_multi_drop
                const biayaLainMp = getPengadaan.biaya_lain
                const biayaMelMp = getPengadaan.biaya_mel
                const biayaJalanMp = getPengadaan.biaya_jalan
                const hargaSelanjutnyaMp = getPengadaan.harga_selanjutnya
                const biayaTambahanMp = getPengadaan.biaya_tambahan
                const biayaMultimuatMp = getPengadaan.biaya_multi_muat
                const subtotalMp = getPengadaan.subtotal || 0
                const diskon = getPengadaan.diskon || 0
                const biayaPengganti = getPengadaan.biaya_pengganti || 0

                // Recalculate subtotal from remaining details
                const newSubtotal = core.sumArray(getRemainingPrice.map((i) => i.total_produk || 0))
                
                // Calculate new total_keseluruhan: subtotal + diskon + biaya_overtonase + biaya_pengganti + biaya_muat + biaya_muat_bongkar + biaya_multi_drop + biaya_lain + biaya_mel + biaya_jalan + biaya_tambahan + biaya_multi_muat
                const newBiayaMuat = biayaMuatMp - hargaMuat
                const newBiayaBongkar = biayaBongkarMp - hargaBongkar
                const newBiayaOvertonase = biayaOvertonaseMp - biayaOvertonase
                const newBiayaMultiDrop = biayaMultidropMp - biayaMultiDrop
                const newBiayaLain = biayaLainMp - biayaLain
                const newBiayaMel = biayaMelMp - biayaMel
                const newBiayaJalan = biayaJalanMp - getPrice
                const newBiayaTambahan = biayaTambahanMp - biayaTambahan
                const newBiayaMultiMuat = biayaMultimuatMp - biayaMultiMuat
                const newTotalKeseluruhan = newSubtotal + diskon + newBiayaOvertonase + biayaPengganti + newBiayaMuat + newBiayaBongkar + newBiayaMultiDrop + newBiayaLain + newBiayaMel + newBiayaJalan + newBiayaTambahan + newBiayaMultiMuat

                if (getPengadaan) {
                    const updData = await models.m_pengadaan.update(
                        {
                            subtotal: newSubtotal,
                            biaya_muat: newBiayaMuat,
                            biaya_muat_bongkar: newBiayaBongkar,
                            overtonase: overtonaseMp - maxTonase,
                            biaya_overtonase: newBiayaOvertonase,
                            biaya_multi_drop: newBiayaMultiDrop,
                            biaya_lain: newBiayaLain,
                            biaya_mel: newBiayaMel,
                            biaya_jalan: newBiayaJalan,
                            harga_selanjutnya: hargaSelanjutnyaMp - hargaSelanjutnya,
                            biaya_tambahan: newBiayaTambahan,
                            biaya_multi_muat: newBiayaMultiMuat,
                            total_keseluruhan: newTotalKeseluruhan,
                        },
                        {
                            where: {
                                id_mp: getIdmp
                            }
                        }
                    )
                    if (updData) {
                        const updData = await models.m_pengadaan_detail.destroy(
                            {
                                where: {
                                    id_mpd: req.body.id
                                }
                            }
                        )
                        if (updData) {

                            const updataSm = await models.m_sm.destroy(
                                {
                                    where: {
                                        id_mpd: req.body.id
                                    }
                                }
                            )
                            if (updataSm) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Success delete data'
                                    },

                                }
                            }


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

exports.getSpDetailSales = async (req, res) => {
    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        // models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });
        models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_price_customer', foreignKey: 'id_price_customer' });
        // models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_muat_kota', foreignKey: 'id_tujuan_kota' });

        if (!models.m_tarif_customer.associations.kotaAsal) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_customer.associations.kotaTujuan) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }





        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )
        if (getUser) {

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
                                            }
                                        ]
                                    },
                                    {
                                        model: models.users
                                    }
                                ]

                        },
                        // {
                        //     model: models.customer,
                        //     required: false
                        // },
                        {
                            model: models.alamat,
                            required: true
                        },
                        {
                            model: models.m_sm,
                            required: true
                        },
                        {
                            model: models.m_tarif_customer,
                            required: true,
                            include: [
                                {
                                    model: models.m_wil_kota,
                                    as: 'kotaAsal'
                                },
                                {
                                    model: models.m_wil_kota,
                                    as: 'kotaTujuan'
                                },
                            ]
                        }
                    ]
                }
            )
            // const getMuat = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idMuat
            //         },
            //         attributes: ['kota']
            //     }
            // )
            // const getBongkar = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idBongkar
            //         },
            //         attributes: ['kota']
            //     }


            // )
            // console.log("🚀 ~ file: sp.controller.js:188 ~ exports.getSpDetail= ~ getDetail:", getDetail.id_almuat)
            if (getDetail) {
                // const getMuat = await models.alamat.findOne(

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getDetail.map((i) => {
                        return {
                            spk: i.m_pengadaan.mspk,
                            sp: i.m_pengadaan.msp,
                            nosj: i.m_sm.msm,
                            idsj: i.m_sm.id_msm,
                            marketing: i.m_pengadaan.user.nama_lengkap,
                            service: i.m_pengadaan.service,
                            order_date: core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY hh:mm:ss"),
                            pickupDate: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                            alamat_invoice: "-",
                            telp_customer: i.m_pengadaan.customer.telepon,
                            kendaraan: i.kendaraan,
                            pickupAddress: i.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan.customer.alamat.alamat,
                            customer: i.m_pengadaan.customer.nama_perusahaan,
                            destination: i.alamat?.alamat,
                            via: i.via,
                            item: i.nama_barang,
                            qty: i.qty,
                            berat: i.berat,
                            service: i.m_pengadaan.service,
                            pickupDate: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                            kotaMuat: i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaAsal.nama_kota,
                            kotaBongkar: i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaBongkar.nama_kota

                        }
                    }),
                    // muat: getMuat,
                    // bongkar: getBongkar
                    // data: [

                    //     { detail: getDetail },
                    //     { muat: getMuat },
                    //     { bongkar: getBongkar }

                    // ]

                    // {
                    //     muat: getMuat.map((i) => { return i.kota })
                    // },
                    // {
                    //     bongkar: getBongkar.kota
                    // },

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

exports.getTarifAlamat = async (req, res) => {
    try {

        models.m_tarif_customer.belongsTo(models.kendaraan_jenis, { targetKey: 'id_kendaraan_jenis', foreignKey: 'id_kendaraan_jenis' });


        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )

        if (getUser) {
            const getTarif = await models.m_tarif_customer.findOne(
                {
                    where: {
                        id_muat_kota: req.body.id_muat_kota,
                        id_tujuan_kota: req.body.id_tujuan_kota,
                        id_customer: req.body.id_customer,
                        id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                        service_type: req.body.service_type
                    }
                }
            )

            const getKendaraan = await models.kendaraan_jenis.findOne(
                {
                    where: {
                        id_kendaraan_jenis: req.body.id_kendaraan_jenis,
                    }
                }
            )


            output = {
                status: {
                    code: 200,
                    message: 'Success get Data'
                },
                data: {
                    order: getTarif,
                    jenisKendaraan: getKendaraan
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

exports.createDoMassage = async (req, res) => {
  try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
    const getMassageDo = await models.massage_do.findOne(
      {
        where: {
          status: 1,
          massage: req.body.massage,
          ...(req.body.used_by ? { used_by: req.body.used_by } : {})
        }
      }
    )
    if (getUser && !getMassageDo) {
      const createDo = await models.massage_do.create(
        {
          'massage': req.body.massage,
          'used_by': req.body.used_by ?? null,
          'status': 1
        }
      )
            const updateStatus = await models.m_status_order.update(
                {
                    act_sales: "Y",
                    tgl_act_1: Date.now()
                }
            )
            if (createDo && updateStatus) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success create massage cancel DO'
                    },

                }
            }

        }
        else {
            output = {
                status: {
                    code: 402,
                    message: 'massage cancel DO has already created'
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

exports.deleteDoMassage = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.massage_do.update(

                {
                    status: 0
                },
                {
                    where: {
                        id_massage_do: req.body.id
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success delete data'
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

exports.updateDoMassage = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )

        const getData = await models.massage_do.findOne(
            {
                where: {
                    status: 1,
                    massage: req.body.massage
                }
            }
        )
        if (getUser && !getData) {
            const updData = await models.massage_do.update(
                {
                    massage: req.body.massage
                },
                {
                    where: {
                        id_massage_do: req.body.id
                    }
                }
            )
            if (updData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success update data'
                    },

                }


            }
        }
        else {
            output = {
                status: {
                    code: 402,
                    message: 'Massage Cancel Do has been created'
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

exports.getSelectCancelDo = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getMassageDo = await models.massage_do.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            if (getMassageDo) {
                const response = {

                    company: getMassageDo.map((i) => {
                        return {
                            id: i.id_massage_do,
                            massage: i.massage,

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

exports.cancelDoSp = async (req, res) => {
    let output = {}
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }

        )
        const getPengadaan = await models.m_pengadaan.findOne(
            {
                where: {
                    id_mp: req.body.id_mp
                }
            }
        )

        // Normalisasi status untuk perbandingan (handle string dan number)
        // Status 0 atau "0" berarti sudah di cancel
        let isAlreadyCancelled = false
        if (getPengadaan && getPengadaan.status !== undefined && getPengadaan.status !== null) {
            const statusValue = getPengadaan.status
            // Cek apakah status adalah 0 (number) atau "0" (string)
            isAlreadyCancelled = statusValue === 0 || statusValue === "0" || String(statusValue).trim() === "0"
        }

        // Cek apakah status sudah "0" (sudah di cancel) - HARUS DICEK DULU SEBELUM PROSES CANCEL
        if (!getPengadaan) {
            output = {
                status: {
                    code: 404,
                    message: 'Data pengadaan tidak ditemukan'
                },
            }
        } else if (isAlreadyCancelled) {
            output = {
                status: {
                    code: 402,
                    message: 'Sp ini sudah di cancel'
                },
            }
        }
        // Jika status bukan "0" dan user ada, proses cancel
        else if (getUser && getPengadaan && !isAlreadyCancelled) {
            // const getDataAkunting = await models.m_status_order.findOne(
            //     {
            //         where: {
            //             id_mp: req.body.id_mp,
            //             akunting: { [Op.ne]: 0 },
            //             act_akunting: "Y"
            //         }
            //     }
            // )
            // if (!getDataAkunting) {
            const cancelDo = await models.m_pengadaan_do.create(
                {
                    'id_mp': req.body.id_mp,
                    'id_massage_do': req.body.id_massage_do,
                    'status': 1,
                    'keterangan': req.body.keterangan
                }
            )
            const updDataSales = await models.m_status_order.update(
                {
                    act_sales: "N",
                    // tgl_act_2: Date.now()
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            await models.m_status_order.update(
                {
                    sales_reject: req.body.id_massage_do
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            // const updtStatus = await models.m_status_order.update(
            //     {

            //     }
            // )
            if (cancelDo && updDataSales) {
                const updData = await models.m_pengadaan.update(
                    {
                        status: "0",

                    },
                    {
                        where: {
                            id_mp: req.body.id_mp
                        }
                    }
                )

                const cretaMassage = await models.m_chat.create(
                    {
                        'id_mp': req.body.id_mp,
                        'ph': "",
                        'user': req.user.id,
                        'chat': 'canceled SP',
                        'baca': "0",
                        'tgl_chat': core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                    }
                )
                if (updData && cretaMassage) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success cancel sp'
                        },
                    }
                } else {
                    output = {
                        status: {
                            code: 500,
                            message: 'Gagal update status atau create chat'
                        },
                    }
                }

            } else {
                output = {
                    status: {
                        code: 500,
                        message: 'Gagal create cancel do atau update sales'
                    },
                }
            }
            // }
            // else {
            //     output = {
            //         status: {
            //             code: 403,
            //             message: 'SP Tidak bisa di cancel, accounting sudah Approved'
            //         },
            //     }


            // }
        } else if (!getUser) {
            // Jika user tidak ditemukan
            output = {
                status: {
                    code: 403,
                    message: 'User tidak ditemukan atau tidak memiliki akses'
                },
            }
        } else {
            // Kondisi lain yang tidak ter-handle
            output = {
                status: {
                    code: 500,
                    message: 'Terjadi kesalahan saat memproses cancel'
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

exports.getMassageDoDetail = async (req, res) => {
    try {

        models.m_pengadaan.belongsTo(models.m_pengadaan_do, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_do.belongsTo(models.massage_do, { targetKey: 'id_massage_do', foreignKey: 'id_massage_do' });

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
                    include: [
                        {
                            model: models.m_pengadaan_do,
                            where: {
                                status: 1,
                                id_mp: req.query.id_mp
                            },
                            include: {
                                model: models.massage_do
                            }
                        }
                    ]
                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success getdata'
                    },
                    data: getData.map((i) => {
                        return {
                            massage: i.m_pengadaan_do.massage_do.massage
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


exports.getCancelDoList = async (req, res) => {
    try {

        models.m_pengadaan_do.belongsTo(models.massage_do, { targetKey: 'id_massage_do', foreignKey: 'id_massage_do' });

        models.m_pengadaan_do.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });

        // models.m_pengadaan.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDo = await models.m_pengadaan_do.findAndCountAll(
                {
                    order: [["id", "desc"]],
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_pengadaan,
                            where: {
                                status: "0"
                            },
                            include: [
                                {
                                    model: models.customer
                                },
                                {
                                    model: models.users
                                },
                                {
                                    model: models.m_pengadaan_detail
                                },
                            ]
                        },
                        {
                            model: models.massage_do
                        }
                    ]
                }
            )


            if (getDo.rows) {
                let no = (getDo.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = await Promise.all(getDo.rows.map(async (item) => {
                    const bongkar = item.m_pengadaan.m_pengadaan_details.map((i) => i.id_albongkar);
                    const muat = item.m_pengadaan.m_pengadaan_details.map((i) => i.id_almuat);
                    const vehicle = item.m_pengadaan.m_pengadaan_details.map((i) => i.kendaraan);

                    const getBongkar = await models.alamat.findOne({
                        ...bongkar.slice(-1).pop() != undefined ? {
                            where: {
                                id: bongkar.slice(-1).pop()
                            }
                        } : ""
                    });
                    const getMuat = await models.alamat.findOne({
                        ...muat[0] != undefined ? {
                            where: {
                                id: muat[0]
                            }
                        } : ""
                    });
                    // console.log("🚀 ~ file: sp.controller.js:2031 ~ result ~ getMuat:", getMuat)
                    return {
                        no: no++,
                        idmp: item.m_pengadaan.id_mp,
                        sp: item.m_pengadaan.msp,
                        perusahaan: item.m_pengadaan.customer.nama_perusahaan,
                        marketing: item.m_pengadaan.user.nama_lengkap,
                        service: item.m_pengadaan.service,
                        pickupDate: core.moment(item.m_pengadaan.tgl_pickup).format('YYYY-MM-DD HH:MM:SS'),
                        destination: getMuat.kota + " - " + getBongkar.kota,
                        vehicle: vehicle[0],
                        massage: item?.massage_do?.massage,
                    };
                }));


                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getDo.count,
                        totalPage: Math.ceil(getDo.count / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        order: result

                    }
                };
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

exports.getMassageDo = async (req, res) => {
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
      const getMassageDo = await models.massage_do.findAndCountAll(
        {
          where: {
            status: 1,
            ...(req.query.used_by ? { used_by: req.query.used_by } : {})
          },
          limit: limit,
          offset: offset,
        }
      )
      if (getMassageDo.rows) {
        let no = (getMassageDo.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
        const result = getMassageDo.rows.map((item) => {
          return {
            no: no++,
            id: item.id_massage_do,
            massage: item.massage,
            used_by: item.used_by ?? null,

          }
        })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: getMassageDo.count,
                        totalPage: Math.ceil(getMassageDo.count / req.query.limit),
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


exports.createMassageSales = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const createData = await models.m_chat.create(
                {
                    'id_mp': req.body.id_mp,
                    'ph': req.body.ph,
                    'user': req.user.id,
                    'chat': req.body.chat,
                    'baca': req.body.baca,
                    'tgl_chat': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                }
            )
            if (createData) {
                const updtateData = await models.m_pengadaan.update(
                    {
                        is_issue: 1
                    },
                    {
                        where: {
                            id_mp: req.body.id_mp
                        }
                    }
                )
                if (updtateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success create massage'
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
exports.solvedIssue = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const createData = await models.m_chat.create(
                {
                    'id_mp': req.body.id_mp,
                    'ph': req.body.ph,
                    'user': req.user.id,
                    'chat': "solved issue",
                    'baca': "0",
                    'tgl_chat': core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                }
            )
            if (createData) {
                const updtateData = await models.m_pengadaan.update(
                    {
                        is_issue: 0
                    },
                    {
                        where: {
                            id_mp: req.body.id_mp
                        }
                    }
                )
                if (updtateData) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Success solved issue'
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


exports.editSp = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const updData = await models.m_pengadaan.update(
                {
                    memo: req.body.memo,
                    id_sales: req.body.id_sales,
                    id_customer: req.body.id_customer,
                    alamat_invoice: req.body.alamat_invoice,
                    service: req.body.service,
                    jenis_barang: req.body.jenis_barang,
                    packing: req.body.packing,
                    asuransi: req.body.asuransi,
                    asuransi_fee: req.body.asuransi_fee,
                    tgl_pickup: core.moment(req.body.tgl_pickup).format("YYYY-MM-DD HH:MM:SS"),
                    tgl_bongkar: core.moment(req.body.tgl_bongkar).format("YYYY-MM-DD HH:MM:SS"),
                    waktu_muat: core.moment(req.body.tgl_pickup).format("HH:MM:SS"),
                    waktu_bongkar: core.moment(req.body.tgl_bongkar).format("HH:MM:SS"),
                    biaya_muat: req.body.biaya_muat,
                    biaya_muat_bongkar: req.body.biaya_muat_bongkar,
                    overtonase: req.body.overtonase,
                    biaya_multi_drop: req.body.overtonase,
                    biaya_lain: req.body.overtonase,
                    diskon: req.body.diskon,
                    total_keseluruhan: req.body.total_keseluruhan,
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            if (updData) {
                const updStatMsg = await models.m_chat.create(
                    {
                        "id_mp": req.body.id_mp,
                        "user": req.user.id,
                        "ph": "",
                        "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        "chat": req.user.fullname + " mengedit SP",
                        "baca": "0"

                    },

                )
                if (updStatMsg) {
                    output = {
                        status: {
                            code: 200,
                            message: "succes update data"
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
exports.editSpDetail_vico = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // Ambil data detail yang sudah ada untuk mendapatkan nilai pajak jika tidak ada di payload
            const existingDetail = await models.m_pengadaan_detail.findOne({
                where: {
                    id_mpd: req.body.id_mpd
                }
            })
            
            // Hitung total_produk
            const totalProduk = (req.body.harga || 0) * (req.body.jumlah || 0)
            
            // Ambil semua biaya untuk perhitungan total detail
            const detailBiayaOvertonase = req.body.biaya_overtonase || 0
            const detailBiayaPengganti = 0 // Tidak ada di detail level
            const detailBiayaMuat = req.body.harga_muat || 0
            const detailBiayaMuatBongkar = req.body.harga_bongkar || 0
            const detailBiayaMultiDrop = req.body.biaya_multidrop || 0
            const detailBiayaLain = req.body.biaya_lain || 0
            const detailBiayaMel = req.body.biaya_mel || 0
            const detailBiayaTambahan = req.body.biaya_tambahan || 0
            const detailBiayaMultiMuat = req.body.biaya_multimuat || 0
            
            // Hitung subtotal detail: totalProduk + semua biaya
            const subtotalDetail = totalProduk + detailBiayaOvertonase + detailBiayaPengganti + detailBiayaMuat + detailBiayaMuatBongkar + detailBiayaMultiDrop + detailBiayaLain + detailBiayaMel + detailBiayaTambahan + detailBiayaMultiMuat
            
            // Hitung diskon dari subtotal detail (asumsi diskon adalah persentase, misalnya 20 berarti 20%)
            const diskonPersen = req.body.diskon || 0
            const diskonNilai = subtotalDetail * (diskonPersen / 100)
            
            // Hitung base amount: subtotal detail - diskonNilai
            const baseAmount = subtotalDetail - diskonNilai
            
            // Hitung pajak: gunakan dari payload jika ada, jika tidak ambil dari database, jika tidak ada sama sekali maka 0
            const pajakPersen = req.body.pajak !== undefined ? req.body.pajak : (existingDetail && existingDetail.pajak !== null ? existingDetail.pajak : 0)
            const pajak = pajakPersen ? (pajakPersen / 100) * baseAmount : 0
            
            // Hitung total: totalProduk + semua biaya - diskonNilai + pajak
            const total = baseAmount + pajak
            
            // Ambil kota_muat dan kota_bongkar dari tabel alamat
            let kotaMuat = null;
            let kotaBongkar = null;
            
            if (req.body.id_almuat) {
                const alamatMuat = await models.alamat.findOne({
                    where: { id: req.body.id_almuat },
                    attributes: ['kota']
                });
                kotaMuat = alamatMuat ? alamatMuat.kota : null;
            }
            
            if (req.body.id_albongkar) {
                const alamatBongkar = await models.alamat.findOne({
                    where: { id: req.body.id_albongkar },
                    attributes: ['kota']
                });
                kotaBongkar = alamatBongkar ? alamatBongkar.kota : null;
            }
            
            // Buat object update data
            const updateData = {
                    // ph: req.body.ph,
                    via: req.body.via,
                    shipment: req.body.shipment,
                    kendaraan: req.body.kendaraan,
                    id_almuat: req.body.id_almuat,
                    id_albongkar: req.body.id_albongkar,
                    id_kota_muat: req.body.id_kota_muat,
                    id_kota_bongkar: req.body.id_kota_bongkar,
                    kota_muat: kotaMuat,
                    kota_bongkar: kotaBongkar,
                    nama_barang: req.body.nama_barang,
                    berat: req.body.berat,
                    qty: req.body.qty,
                    koli: req.body.koli,
                    volume: req.body.volume,
                    diskon: req.body.diskon,
                    harga: req.body.harga ? req.body.harga : 0,
                    jumlah: req.body.jumlah || 0,
                    total_produk: totalProduk,
                    total: Math.round(total), // Bulatkan ke integer
                    harga_muat: req.body.harga_muat || 0,
                    harga_bongkar: req.body.harga_bongkar || 0,
                    biaya_overtonase: req.body.biaya_overtonase || 0,
                    biaya_multimuat: req.body.biaya_multimuat || 0,
                    biaya_multidrop: req.body.biaya_multidrop || 0,
                    biaya_mel: req.body.biaya_mel || 0,
                    biaya_tambahan: req.body.biaya_tambahan || 0,
                    biaya_lain: req.body.biaya_lain || 0,
                    harga_selanjutnya: req.body.harga_selanjutnya,
                    max_tonase: req.body.max_tonase,
                    id_price_customer: req.body.id_price_customer,
                    tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                }
            
            // Hanya update pajak jika ada di payload
            if (req.body.pajak !== undefined) {
                updateData.pajak = req.body.pajak
            }
            
            const updData = await models.m_pengadaan_detail.update(
                updateData,
                {
                    where: {
                        id_mpd: req.body.id_mpd
                    }
                }
            )
            const getDataMp = await models.m_pengadaan_detail.findOne(
                {
                    where: {
                        id_mpd: req.body.id_mpd
                    }
                }
            )

            const getPrice = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: getDataMp.id_mp
                    }
                }
            )

            // Get existing m_pengadaan data to get diskon and biaya_pengganti
            const getPengadaanData = await models.m_pengadaan.findOne({
                where: {
                    id_mp: getDataMp.id_mp
                }
            })

            const subtotal = core.sumArray(getPrice.map((i) => i.total_produk || 0))
            const price = core.sumArray(getPrice.map((i) => i.harga))
            const biayaMuat = core.sumArray(getPrice.map((i) => i.harga_muat))
            const biayBongkar = core.sumArray(getPrice.map((i) => i.harga_bongkar))
            const biayaOvertonase = core.sumArray(getPrice.map((i) => i.biaya_overtonase))
            const biayaMultiMuat = core.sumArray(getPrice.map((i) => i.biaya_multimuat))
            const biayaMultiDrop = core.sumArray(getPrice.map((i) => i.biaya_multidrop))
            const biayaMel = core.sumArray(getPrice.map((i) => i.biaya_mel))
            const biayaTambahan = core.sumArray(getPrice.map((i) => i.biaya_tambahan))
            const biayaLain = core.sumArray(getPrice.map((i) => i.biaya_lain))
            const maxTonase = core.sumArray(getPrice.map((i) => i.max_tonase))
            const hargaSelanjutnya = core.sumArray(getPrice.map((i) => i.harga_selanjutnya))
            
            // Hitung diskonNilai dan pajakNilai dari setiap detail
            const diskonNilaiArray = getPrice.map((detail) => {
                const detailSubtotal = (detail.total_produk || 0) + (detail.biaya_overtonase || 0) + (detail.harga_muat || 0) + (detail.harga_bongkar || 0) + (detail.biaya_multidrop || 0) + (detail.biaya_lain || 0) + (detail.biaya_mel || 0) + (detail.biaya_tambahan || 0) + (detail.biaya_multimuat || 0)
                const diskonPersen = detail.diskon || 0
                return diskonPersen ? (diskonPersen / 100) * detailSubtotal : 0
            })
            
            const pajakNilaiArray = getPrice.map((detail) => {
                const detailSubtotal = (detail.total_produk || 0) + (detail.biaya_overtonase || 0) + (detail.harga_muat || 0) + (detail.harga_bongkar || 0) + (detail.biaya_multidrop || 0) + (detail.biaya_lain || 0) + (detail.biaya_mel || 0) + (detail.biaya_tambahan || 0) + (detail.biaya_multimuat || 0)
                const diskonPersen = detail.diskon || 0
                const diskonNilai = diskonPersen ? (diskonPersen / 100) * detailSubtotal : 0
                const baseAmount = detailSubtotal - diskonNilai
                const pajakPersen = detail.pajak || 0
                return pajakPersen ? (pajakPersen / 100) * baseAmount : 0
            })
            
            // Sum diskonNilai dan pajakNilai dari semua detail
            const diskonNilaiTotal = core.sumArray(diskonNilaiArray)
            const pajakNilaiTotal = core.sumArray(pajakNilaiArray)
            
            // Sum total dari semua detail untuk total_keseluruhan
            const totalKeseluruhan = core.sumArray(getPrice.map((i) => i.total || 0))
            
            const biayaPengganti = getPengadaanData ? (getPengadaanData.biaya_pengganti || 0) : 0
            
            if (subtotal !== null && subtotal !== undefined) {
                const udpTotalSp = await models.m_pengadaan.update(
                    {
                        subtotal: subtotal,
                        diskon: Math.round(diskonNilaiTotal),
                        pajak: Math.round(pajakNilaiTotal),
                        total_keseluruhan: totalKeseluruhan,
                        biaya_muat: biayaMuat,
                        biaya_muat_bongkar: biayBongkar,
                        overtonase: maxTonase,
                        biaya_overtonase: biayaOvertonase,
                        biaya_multi_muat: biayaMultiMuat,
                        biaya_multi_drop: biayaMultiDrop,
                        biaya_lain: biayaLain,
                        biaya_tambahan: biayaTambahan,
                        biaya_mel: biayaMel,
                        biaya_jalan: price,
                        harga_selanjutnya: hargaSelanjutnya,


                    },
                    {
                        where: {
                            id_mp: getDataMp.id_mp
                        }
                    }
                )
                if (updData) {
                    output = {
                        status: {
                            code: 200,
                            message: "succes update data"
                        },
                        // data: total
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

exports.editSpDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // Ambil kota_muat dan kota_bongkar dari tabel alamat
            let kotaMuat = null;
            let kotaBongkar = null;
            
            if (req.body.id_almuat) {
                const alamatMuat = await models.alamat.findOne({
                    where: { id: req.body.id_almuat },
                    attributes: ['kota']
                });
                kotaMuat = alamatMuat ? alamatMuat.kota : null;
            }
            
            if (req.body.id_albongkar) {
                const alamatBongkar = await models.alamat.findOne({
                    where: { id: req.body.id_albongkar },
                    attributes: ['kota']
                });
                kotaBongkar = alamatBongkar ? alamatBongkar.kota : null;
            }
            
            const updData = await models.m_pengadaan_detail.update(
                {
                    // ph: req.body.ph,
                    via: req.body.via,
                    shipment: req.body.shipment,
                    kendaraan: req.body.kendaraan,
                    id_almuat: req.body.id_almuat,
                    id_albongkar: req.body.id_albongkar,
                    id_kota_muat: req.body.id_kota_muat,
                    id_kota_bongkar: req.body.id_kota_bongkar,
                    kota_muat: kotaMuat,
                    kota_bongkar: kotaBongkar,
                    nama_barang: req.body.nama_barang,
                    berat: req.body.berat,
                    qty: req.body.qty,
                    koli: req.body.koli,
                    volume: req.body.volume,
                    diskon: req.body.diskon,
                    harga: req.body.harga ? req.body.harga : 0,
                    total: req.body.total,
                    harga_muat: req.body.harga_muat,
                    harga_bongkar: req.body.harga_bongkar,
                    biaya_overtonase: req.body.biaya_overtonase,
                    biaya_multimuat: req.body.biaya_multimuat,
                    biaya_multidrop: req.body.biaya_multidrop,
                    biaya_mel: req.body.biaya_mel,
                    biaya_tambahan: req.body.biaya_tambahan,
                    biaya_lain: req.body.biaya_lain,
                    harga_selanjutnya: req.body.harga_selanjutnya,
                    max_tonase: req.body.max_tonase,
                    id_price_customer: req.body.id_price_customer,
                    tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                },
                {
                    where: {
                        id_mpd: req.body.id_mpd
                    }
                }
            )
            const getDataMp = await models.m_pengadaan_detail.findOne(
                {
                    where: {
                        id_mpd: req.body.id_mpd
                    }
                }
            )

            const getPrice = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: getDataMp.id_mp
                    }
                }
            )

            const total = core.sumArray(getPrice.map((i) => i.total))
            const price = core.sumArray(getPrice.map((i) => i.harga))
            const biayaMuat = core.sumArray(getPrice.map((i) => i.harga_muat))
            const biayBongkar = core.sumArray(getPrice.map((i) => i.harga_bongkar))
            const biayaOvertonase = core.sumArray(getPrice.map((i) => i.biaya_overtonase))
            const biayaMultiMuat = core.sumArray(getPrice.map((i) => i.biaya_multimuat))
            const biayaMultiDrop = core.sumArray(getPrice.map((i) => i.biaya_multidrop))
            const biayaMel = core.sumArray(getPrice.map((i) => i.biaya_mel))
            const biayaTambahan = core.sumArray(getPrice.map((i) => i.biayaMel_tambahan))
            const biayaLain = core.sumArray(getPrice.map((i) => i.biaya_lain))
            const maxTonase = core.sumArray(getPrice.map((i) => i.max_tonase))
            const hargaSelanjutnya = core.sumArray(getPrice.map((i) => i.harga_selanjutnya))
            if (total) {
                const udpTotalSp = await models.m_pengadaan.update(
                    {
                        total_keseluruhan: total,
                        biaya_muat: biayaMuat,
                        biaya_muat_bongkar: biayBongkar,
                        overtonase: maxTonase,
                        biaya_overtonase: biayaOvertonase,
                        biaya_multi_muat: biayaMultiMuat,
                        biaya_multi_drop: biayaMultiDrop,
                        biaya_lain: biayaLain,
                        biaya_tambahan: biayaTambahan,
                        biaya_mel: biayaMel,
                        biaya_jalan: price,
                        harga_selanjutnya: hargaSelanjutnya,


                    },
                    {
                        where: {
                            id_mp: getDataMp.id_mp
                        }
                    }
                )
                if (updData) {
                    output = {
                        status: {
                            code: 200,
                            message: "succes update data"
                        },
                        // data: total
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



//OPERASIONAL 
exports.getCustomerFilter = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getData = await models.customer.findAll(
                {
                    order: [['id_customer', 'desc']],
                    where: {
                        is_deleted: 0
                    }
                }
            )
            if (getData) {
                output = {
                    status: {
                        code: 200,

                    },
                    data: getData.map((i) => {
                        return {
                            idcustomer: i.id_customer,
                            customer: i.nama_perusahaan
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

exports.getSp = async (req, res) => {
    try {
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat' });
        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

            const options = {
                pagination: {
                    limit: limit,
                    offset: offset,
                },
                result: {
                    order: [['id_mp', 'desc']],
                    where: {

                        status: [1, 2],
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msp: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {},
                        ...req.query.id_customer ? {
                            [Op.or]: [
                                {
                                    id_customer: {
                                        [Op.like]: `%${req.query.id_customer}%`
                                    },

                                },


                            ]
                        } : {},
                        ...(req.query.startDate && req.query.endDate ? {
                            tgl_order: {
                                [Op.and]: [
                                    {
                                        [Op.between]: [req.query.startDate, req.query.endDate]
                                    },
                                    {
                                        [Op.or]: [
                                            {
                                                [Op.like]: `%${req.query.startDate}%`
                                            },
                                            {
                                                [Op.like]: `%${req.query.endDate}%`
                                            }
                                        ]
                                    }
                                ]
                            }
                        } : {}),
                        ...req.query.tahun ? {
                            tgl_pickup: {
                                [Op.gte]: new Date(req.query.tahun),
                                [Op.lt]: new Date(new Date(Number(req.query.tahun), 11, 31, 23, 59, 59, 999))
                            },
                        } : {},
                    },

                    // group: ['id_mp'],


                    // limit: limit,
                    // offset: offset,
                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            required: false,
                            attributes: { exclude: [] }, // Include all attributes including kota_muat and kota_bongkar
                            include: [
                                {
                                    model: models.m_sm
                                }
                            ]
                        },
                        {
                            model: models.users,
                            where: {
                                ...req.query.id_bu ? {
                                    id_bu: req.query.id_bu
                                } : {},
                                ...req.query.id_bu_brench ? {
                                    id_bu_brench: req.query.id_bu_brench
                                } : {},
                                ...req.query.sales ? {
                                    nama_lengkap: req.query.sales
                                } : {},
                            }
                            // required: false,

                        },
                        {
                            model: models.customer,
                            required: false,

                        },
                        // {
                        //     model: models.m_chat,
                        //     required: false,
                        // },
                        {
                            model: models.m_status_order,
                            required: true,
                            // order: [['id_mp', 'desc']],
                            where:
                            {
                                [Op.and]: [
                                    {
                                        akunting: { [Op.ne]: 0 },
                                    },
                                    {
                                        act_akunting: "Y",

                                    },
                                    {
                                        kendaraan_operasional: 'N',
                                    },
                                    {
                                        operasional: 0,
                                    }
                                ]



                                // tgl_act_4: "0000-00-00 00:00:00"
                                // tgl_act_4: !null
                                // [Op.and]: [{ kendaraan_operasional: 'N' }, { act_akunting: "Y" },],


                            },


                            include: [
                                { model: models.users }
                            ]

                        },
                    ],
                    // order: [[{ model: models.m_status_order }, 'tgl_act_3', 'DESC']],

                }

            }
            const [total, getData] = await Promise.all([
                models.m_pengadaan.findAll({ ...options.result }),
                models.m_pengadaan.findAll({ ...options.pagination, ...options.result })
            ])


            // const getData = await models.m_pengadaan.findAndCountAll(
            //     {

            //         order: [['id_mp', 'desc']],
            //         where: {

            //             ...req.query.keyword ? {
            //                 [Op.or]: [
            //                     {
            //                         msp: {
            //                             [Op.like]: `%${req.query.keyword}%`
            //                         },

            //                     },


            //                 ]
            //             } : {},
            //             ...req.query.id_customer ? {
            //                 [Op.or]: [
            //                     {
            //                         id_customer: {
            //                             [Op.like]: `%${req.query.id_customer}%`
            //                         },

            //                     },


            //                 ]
            //             } : {},
            //             ...(req.query.startDate && req.query.endDate ? {
            //                 tgl_order: {
            //                     [Op.and]: [
            //                         {
            //                             [Op.between]: [req.query.startDate, req.query.endDate]
            //                         },
            //                         {
            //                             [Op.or]: [
            //                                 {
            //                                     [Op.like]: `%${req.query.startDate}%`
            //                                 },
            //                                 {
            //                                     [Op.like]: `%${req.query.endDate}%`
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }
            //             } : {})
            //         },
            //         // group: ['id_mp'],


            //         limit: limit,
            //         offset: offset,
            //         include: [
            //             {
            //                 model: models.m_pengadaan_detail,
            //                 include: [
            //                     {
            //                         model: models.m_sm
            //                     }
            //                 ]
            //             },
            //             {
            //                 model: models.users,
            //                 where: {
            //                     ...req.query.id_bu ? {
            //                         id_bu: req.query.id_bu
            //                     } : {},
            //                     ...req.query.id_bu_brench ? {
            //                         id_bu_brench: req.query.id_bu_brench
            //                     } : {},
            //                     ...req.query.sales ? {
            //                         nama_lengkap: req.query.sales
            //                     } : {},
            //                 }
            //                 // required: false,

            //             },
            //             {
            //                 model: models.customer,
            //                 required: false,

            //             },
            //             // {
            //             //     model: models.m_chat,
            //             //     required: false,
            //             // },
            //             {
            //                 model: models.m_status_order,
            //                 required: true,
            //                 // order: [['id_mp', 'desc']],
            //                 where:
            //                 {
            //                     [Op.and]: [
            //                         {
            //                             akunting: { [Op.ne]: 0 },
            //                         },
            //                         {
            //                             act_akunting: "Y",

            //                         },
            //                         {
            //                             kendaraan_operasional: 'N',
            //                         },
            //                         {
            //                             operasional: 0,
            //                         }
            //                     ]



            //                     // tgl_act_4: "0000-00-00 00:00:00"
            //                     // tgl_act_4: !null
            //                     // [Op.and]: [{ kendaraan_operasional: 'N' }, { act_akunting: "Y" },],


            //                 },


            //                 include: [
            //                     { model: models.users }
            //                 ]

            //             },
            //         ],
            //         // order: [[{ model: models.m_status_order }, 'tgl_act_3', 'DESC']],

            //     }
            // )


            if (getData) {
                const currentPage = Number(req.query.page) || 1; // Halaman saat ini
                const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman
                const startIndex = (currentPage - 1) * itemsPerPage + 1;
                const result = await Promise.all(getData.map(async (item, index) => {
                    // Coba gunakan detail dari include terlebih dahulu
                    const detailsFromInclude = Array.isArray(item.m_pengadaan_details) ? item.m_pengadaan_details : [];
                    
                    // Load detail langsung dari database untuk memastikan data ter-load dengan benar
                    let loadedDetails = [];
                    if (item.id_mp) {
                        loadedDetails = await models.m_pengadaan_detail.findAll({
                            where: {
                                id_mp: item.id_mp
                            },
                            attributes: ['id_mpd', 'id_mp', 'kota_muat', 'kota_bongkar', 'id_almuat', 'id_albongkar', 'kendaraan'],
                            raw: true // Gunakan raw untuk mendapatkan plain object
                        });
                    }
                    
                    // Gunakan detail dari database jika lebih lengkap, atau gunakan dari include
                    const details = loadedDetails && loadedDetails.length > 0 ? loadedDetails : detailsFromInclude;
                    
                    const vehicle = details.map((i) => i.kendaraan).filter(Boolean);
                    
                    // Ambil kota_muat dan kota_bongkar langsung dari m_pengadaan_detail
                    let kotaMuat = null;
                    let kotaBongkar = null;
                    let idAlmuat = null;
                    let idAlbongkar = null;
                    
                    for (const det of details) {
                        if (!det) continue;
                        
                        // Convert to plain object jika perlu (untuk data dari include)
                        const detData = det.get ? det.get({ plain: true }) : det;
                        
                        // Ambil kota_muat dari detail pertama
                        if (kotaMuat === null && detData.kota_muat !== null && detData.kota_muat !== undefined && detData.kota_muat !== "") {
                            kotaMuat = detData.kota_muat;
                        }
                        
                        // Ambil kota_bongkar dari detail terakhir (update setiap kali ada nilai)
                        if (detData.kota_bongkar !== null && detData.kota_bongkar !== undefined && detData.kota_bongkar !== "") {
                            kotaBongkar = detData.kota_bongkar;
                        }
                        
                        // Simpan id_almuat dan id_albongkar untuk fallback
                        if (idAlmuat === null && detData.id_almuat) {
                            idAlmuat = detData.id_almuat;
                        }
                        if (detData.id_albongkar) {
                            idAlbongkar = detData.id_albongkar;
                        }
                    }
                    
                    // Fallback: jika kota_muat atau kota_bongkar masih null, ambil dari tabel alamat
                    if ((kotaMuat === null || kotaMuat === "") && idAlmuat) {
                        const alamatMuat = await models.alamat.findOne({ 
                            where: { id: idAlmuat },
                            attributes: ['kota']
                        });
                        kotaMuat = alamatMuat ? alamatMuat.kota : null;
                    }
                    
                    if ((kotaBongkar === null || kotaBongkar === "") && idAlbongkar) {
                        const alamatBongkar = await models.alamat.findOne({ 
                            where: { id: idAlbongkar },
                            attributes: ['kota']
                        });
                        kotaBongkar = alamatBongkar ? alamatBongkar.kota : null;
                    }

                    return {
                        no: startIndex + index,
                        idmp: item.id_mp,
                        noSj: item.m_pengadaan_detail?.m_sm?.msm,
                        sp: item.msp,
                        salesName: item.user == null ? "-" : item.user.nama_lengkap,
                        perusahaan: item.customer?.nama_perusahaan,
                        service: item.service,
                        pickupDate: core.moment(item.tgl_pickup,).format('YYYY-MM-DD HH:mm:ss'),
                        kendaraan: vehicle,
                        approveAct: item.m_status_order.act_akunting,
                        dateApproveAct: core.moment(item.m_status_order.tgl_act_3).locale('id').format('YYYY-MM-DD HH:mm:ss'),
                        approveOps: item.m_status_order.kendaraan_operasional,
                        idops: item.m_status_order.operasional,
                        operationalName: item.m_status_order.user == null ? "" : item.m_status_order.user.nama_lengkap,
                        dateApproveOps: core.moment(item.m_status_order.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.m_status_order.kendaraan_purchasing,
                        dateApprovePurch: core.moment(item.m_status_order.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                        destination: (kotaMuat == null || kotaMuat == "" ? "kota muat belom diinput" : kotaMuat) + " - " + (kotaBongkar == null || kotaBongkar == "" ? "kota bongkar belom diinput" : kotaBongkar)
                        // chat: item.m_chat
                        // idMuat: item.m_pengadaan_detail.id_almuat,
                        // idBongkar: item.m_pengadaan_detail.id_albongkar,
                        // destinasi
                        // kendaraan: item.m_status_order

                    };
                }));


                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {

                        totalData: total.length,
                        totalPage: Math.ceil(total.length / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        canLoadMore: Math.ceil(total.length / req.query.limit) <= Number(req.query.page) ? false : true,
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

// exports.getSp = async (req, res) => {
//   try {
//     // Relasi antar model
//     models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
//     models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
//     models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//     models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
//     models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//     models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });
//     models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

//     const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));
//     const getUser = await models.users.findOne({ where: { id: req.user.id } });

//     if (!getUser) throw new Error("User tidak ditemukan");

//     const options = {
//       limit,
//       offset,
//       order: [['id_mp', 'desc']],
//       where: {
//         status: [1, 2],
//         ...(req.query.keyword && {
//           [Op.or]: [
//             { msp: { [Op.like]: `%${req.query.keyword}%` } },
//           ]
//         }),
//         ...(req.query.id_customer && {
//           id_customer: { [Op.like]: `%${req.query.id_customer}%` }
//         }),
//         ...(req.query.startDate && req.query.endDate && {
//           tgl_order: { [Op.between]: [req.query.startDate, req.query.endDate] }
//         }),
//         ...(req.query.tahun && {
//           tgl_pickup: {
//             [Op.gte]: new Date(req.query.tahun),
//             [Op.lt]: new Date(new Date(Number(req.query.tahun), 11, 31, 23, 59, 59, 999))
//           }
//         })
//       },
//       include: [
//         {
//           model: models.m_pengadaan_detail,
//           include: [{ model: models.m_sm }]
//         },
//         {
//           model: models.users,
//           where: {
//             ...(req.query.id_bu && { id_bu: req.query.id_bu }),
//             ...(req.query.id_bu_brench && { id_bu_brench: req.query.id_bu_brench }),
//             ...(req.query.sales && { nama_lengkap: req.query.sales }),
//           }
//         },
//         {
//           model: models.customer,
//           required: false,
//         },
//         {
//           model: models.m_status_order,
//           required: true,
//           where: {
//             akunting: { [Op.ne]: 0 },
//             act_akunting: "Y",
//             kendaraan_operasional: 'N',
//             operasional: 0
//           },
//           include: [{ model: models.users }]
//         }
//       ]
//     };

//     const [total, getData] = await Promise.all([
//       models.m_pengadaan.findAll({ ...options }),
//       models.m_pengadaan.findAll({ ...options, limit, offset })
//     ]);

//     const currentPage = Number(req.query.page) || 1;
//     const itemsPerPage = Number(req.query.limit) || 10;
//     const startIndex = (currentPage - 1) * itemsPerPage + 1;

//     const result = await Promise.all(getData.map(async (item, index) => {
//       const bongkar = item.m_pengadaan_details.map((i) => i.id_albongkar).filter(Boolean);
//       const muat = item.m_pengadaan_details.map((i) => i.id_almuat).filter(Boolean);
//       const vehicle = item.m_pengadaan_details.map((i) => i.kendaraan);

//       const getBongkar = bongkar.length ? await models.alamat.findOne({ where: { id: bongkar.at(-1) } }) : null;
//       const getMuat = muat.length ? await models.alamat.findOne({ where: { id: muat[0] } }) : null;

//       return {
//         no: startIndex + index,
//         idmp: item.id_mp,
//         noSj: item.m_pengadaan_detail?.m_sm?.msm,
//         sp: item.msp,
//         salesName: item.user?.nama_lengkap || "-",
//         perusahaan: item.customer?.nama_perusahaan,
//         service: item.service,
//         pickupDate: item.tgl_pickup ? core.moment(item.tgl_pickup).format('YYYY-MM-DD HH:mm:ss') : null,
//         kendaraan: vehicle,
//         approveAct: item.m_status_order.act_akunting,
//         dateApproveAct: item.m_status_order.tgl_act_3 ? core.moment(item.m_status_order.tgl_act_3).locale('id').format('YYYY-MM-DD HH:mm:ss') : null,
//         approveOps: item.m_status_order.kendaraan_operasional,
//         idops: item.m_status_order.operasional,
//         operationalName: item.m_status_order.user?.nama_lengkap || "",
//         dateApproveOps: item.m_status_order.tgl_act_4 ? core.moment(item.m_status_order.tgl_act_4).format('YYYY-MM-DD HH:mm:ss') : null,
//         approvePurch: item.m_status_order.kendaraan_purchasing,
//         dateApprovePurch: item.m_status_order.tgl_act_5 ? core.moment(item.m_status_order.tgl_act_5).format('YYYY-MM-DD HH:mm:ss') : null,
//         destination:
//           (getMuat ? getMuat.kota : "kota muat belom diinput") +
//           " - " +
//           (getBongkar ? getBongkar.kota : "kota bongkar belom diinput")
//       };
//     }));

//     const output = {
//       status: {
//         code: 200,
//         message: 'Success get Data SP NEW'
//       },
//       data: {
//         totalData: total.length,
//         totalPage: Math.ceil(total.length / itemsPerPage),
//         limit: itemsPerPage,
//         currentPage,
//         canLoadMore: Math.ceil(total.length / itemsPerPage) > currentPage,
//         order: result
//       }
//     };

//     const errorsFromMiddleware = await customErrorMiddleware(req);

//     if (!errorsFromMiddleware) {
//       res.status(output.status.code).send(output);
//     } else {
//       res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
//     }

//   } catch (error) {
//     const output = {
//       status: {
//         code: 500,
//         message: error.message
//       }
//     };
//     res.status(output.status.code).send(output);
//   }
// };

exports.getSpMassage = async (req, res) => {
    try {
        models.m_pengadaan_detail.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_supir' });
        // models.m_chat.belongsTo(models.users, { targetKey: 'id', foreignKey: 'user' });
        if (!models.m_chat.associations.namaUser) {
            models.m_chat.belongsTo(models.users, { targetKey: 'id', foreignKey: 'user', as: 'namaUser' });
        }



        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )
        if (getUser) {
            const getMassage = await models.m_chat.findAll(
                {
                    where: {
                        id_mp: req.query.id_mp
                    },
                    include: [
                        {
                            model: models.users,
                            as: 'namaUser'
                        }
                    ]
                }

            )
            const getDriver = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: req.query.id_mp
                    },
                    include: [
                        {
                            model: models.m_driver
                        }
                    ]
                }
            )

            if (getMassage && getDriver) {


                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getMassage.map((i) => {
                        return {
                            idChat: i.id_chat,
                            id_mp: i.id_mp,
                            ph: "",
                            chat: i.chat,
                            user: i.namaUser.nama_lengkap,
                            baca: i.baca,
                            tgl_chat: core.moment(i.tgl_chat).format('YYYY-MM-DD HH:mm:ss'),
                            // tgl_chat: core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss  A')

                        }

                    }),
                    supir:
                        getDriver.map((i) => {
                            return {
                                supir: i?.m_driver?.nama
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

exports.getSpDetail = async (req, res) => {


    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        // models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });




        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )
        if (getUser) {

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
                                            }
                                        ]
                                    }
                                ]

                        },
                        {
                            model: models.m_sm,
                            // required: false
                        },
                        {
                            model: models.alamat,
                            required: true
                        }
                    ]
                }
            )
            // const getMuat = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idMuat
            //         },
            //         attributes: ['kota']
            //     }
            // )
            // const getBongkar = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idBongkar
            //         },
            //         attributes: ['kota']
            //     }


            // )
            // console.log("🚀 ~ file: sp.controller.js:188 ~ exports.getSpDetail= ~ getDetail:", getDetail.id_almuat)
            if (getDetail) {
                const getPrice = getDetail.map((i) => i.harga)


                // const getMuat = await models.alamat.findOne(

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    Totalprice: core.rupiah(core.sumArray(getPrice)),
                    data: getDetail.map((i) => {
                        return {
                            idMpd: i.id_mpd,
                            sp: i.m_pengadaan.msp,
                            noSj: i.m_sm?.msm,
                            kendaraan: i.kendaraan,
                            pickupAddress: i.m_pengadaan.customer.alamat == null ? "Alamat Pickup tidak di Input" : i.m_pengadaan.customer.alamat.alamat,
                            perusahaan: i.m_pengadaan.customer.nama_perusahaan,
                            destination: i.alamat?.alamat,
                            via: i.via,
                            item: i.nama_barang,
                            qty: i.qty,
                            berat: i.berat,
                            service: i.m_pengadaan.service,
                            pickupDate: core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY hh:mm:ss"),
                            price: core.rupiah(i.harga),
                            unitId: i.id_unit,
                            supirId: i.id_supir,
                            // supirId: i.m_pengadaan == 0 ? "-" : i.m_pengadaan.id_supir
                        }
                    }),
                    // muat: getMuat,
                    // bongkar: getBongkar
                    // data: [

                    //     { detail: getDetail },
                    //     { muat: getMuat },
                    //     { bongkar: getBongkar }

                    // ]

                    // {
                    //     muat: getMuat.map((i) => { return i.kota })
                    // },
                    // {
                    //     bongkar: getBongkar.kota
                    // },

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

exports.getSelectApprove = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getType = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],
                    where: {
                        status: "1"
                    },
                    group: ['jenis_kendaraan']

                }
            )
            const getKendaraan = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],
                    ...req.query.vehicleType ? {
                        where: {
                            status: "1",
                            jenis_kendaraan: req.query.vehicleType
                        }
                    } : {}
                }
            )
            const getDriver = await models.m_driver.findAll(
                {
                    order: [['id', 'desc']],
                    // ...req.query.nama ? {
                    where: {
                        status: "1",
                        // nama: req.query.nama
                    }
                    // } : {}
                }
            )

            const getMitra = await models.mitra.findAll(
                {
                    order: [['id_mitra', 'asc']],
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
            if (getKendaraan && getDriver) {
                const response = {
                    mitra: getMitra.map((i) => {
                        return {
                            id: i.id_mitra,
                            mitra: i.nama_mitra
                        }
                    }),
                    type: getType.map((i) => {
                        return {
                            tipe: i.jenis_kendaraan
                        }
                    }),
                    vehicle: req.query.vehicleType ? getKendaraan.map((i) => {
                        return {
                            id: i.id_vehicle,
                            tipe: i.jenis_kendaraan,
                            no_polisi: i.no_polisi,

                        }
                    }) : {},
                    Driver: getDriver.map((i) => {

                        return {
                            id: i.id,
                            name: i.nama

                        }
                    }).filter(i => i.name != ""),
                    // driver: req.query.vehicleType ? getData.map((i) => {
                    //     return {
                    //         driverId: i.id,
                    //         driverName: i.nama
                    //     }
                    // }).filter(i => i.driverName != "") : {}
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

exports.getCabang = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getcabangList = await models.users.findAll(
                {
                    group: [['kode_cabang']]
                }
            )
            if (getcabangList) {

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: getcabangList.map((i) => {

                        return {
                            case: i.id,
                            kode: i.kode_cabang


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

exports.approveSp = async (req, res) => {
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
                // Validasi: cek apakah act_akunting sudah "Y" sebelum approve
                const getStatusOrder = await models.m_status_order.findOne(
                    {
                        where: {
                            id_mp: req.body.id_mp
                        }
                    }
                )

                if (!getStatusOrder) {
                    output = {
                        status: {
                            code: 400,
                            message: 'Status order tidak ditemukan'
                        }
                    }
                    res.status(output.status.code).send(output)
                    return
                }

                if (getStatusOrder.act_akunting !== "Y") {
                    output = {
                        status: {
                            code: 400,
                            message: 'Tidak dapat approve SP. Act akunting belum disetujui (act_akunting harus "Y")'
                        }
                    }
                    res.status(output.status.code).send(output)
                    return
                }

                const updMulti = await models.m_pengadaan.update(
                    {
                        is_multi: req.body.is_multi
                    },
                    {
                        where: {
                            id_mp: req.body.id_mp
                        }
                    }
                )

                const updPengDi = await models.m_pengadaan_detail.update(
                    {
                        id_mitra: 1,
                        id_unit: req.body.id_unit,
                        id_supir: req.body.id_supir,
                        tgl_update: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

                    },
                    {
                        where: {
                            id_mpd: req.body.id_mpd,
                            // id_mp: req.body.id_mp
                        }
                    }
                )

                // const getDetail = await models.m_pengadaan_detail.findAll(
                //     {
                //         where: {
                //             id_mp: req.body.id_mp
                //             // id_mpd: req.body.id_mpd,
                //         }
                //     }
                // )
                if (updPengDi) {
                    const getIsMulti = await models.m_pengadaan.findOne(
                        {
                            where: {
                                id_mp: req.body.id_mp
                            }
                        }
                    )

                    // if (getUser.divisi == 'operasional') {
                    if (getIsMulti.is_multi === 1) {
                        const updOrderStat = await models.m_status_order.update(
                            {
                                operasional: req.user.id,
                                kendaraan_operasional: "Y",
                                tgl_act_4: Date.now(),
                                // purchasing: 2,
                                // kendaraan_purchasing: "Y",
                                // tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

                            },
                            {
                                where: {
                                    id_mp: req.body.id_mp
                                }
                            }
                        )

                        const updSM = await models.m_sm.update(
                            {

                                id_mitra_pickup: req.body.id_mitra_pickup,
                                id_unit: req.body.id_unit,
                                id_driver: req.body.id_supir,
                                pickup_kendaraan: req.body.pickup_kendaraan,
                                pickup_nopol: req.body.pickup_nopol,
                                pickup_supir: req.body.pickup_supir,
                                berat: req.body.berat,
                                qty: req.body.qty,
                                koli: req.body.koli,
                                ikat: req.body.ikat,
                                // id_mitra: req.body.id_mitra,
                                // id_mitra_2: req.body.id_mitra_2,
                                tgl_muat: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                where: {
                                    id_mpd: req.body.id_mpd
                                }
                            }
                        )

                        const updApprove = await models.m_pengadaan_approve.update(
                            {

                                operasional: req.user.id,
                                apv_ops: 'Y',
                                tgl_apv_ops: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                purchasing: 2,
                                // kendaraan_purchasing: "Y",
                                // tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

                            },
                            {
                                where: {
                                    id_mp: req.body.id_mp
                                }
                            }
                        )

                        const getDriver = await models.m_driver.findOne(
                            {
                                where: {
                                    id: req.body.id_supir
                                }
                            }
                        )
                        if (updOrderStat && getDriver) {
                            // console.log("?? ~ file: sp.controller.js:3206 ~ exports.approveSp= ~ updOrderStat:", updOrderStat)
                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": req.body.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": "Menggunakan unit " + req.body.plat_nomor + " | " + req.body.merk + " | " + getDriver.nama,
                                    "baca": "0"

                                },

                            )
                            if (updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Berhasil Approve Sp'
                                    },

                                }
                            }
                            else {
                                output = {
                                    status: {
                                        code: 402,
                                        message: 'Gagal Approve Sp'
                                    },

                                }
                            }
                        }

                    }
                    else {
                        const updOrderStat = await models.m_status_order.update(
                            {
                                operasional: req.user.id,
                                kendaraan_operasional: "Y",
                                tgl_act_4: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                purchasing: 2,
                                kendaraan_purchasing: "Y",
                                tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

                            },
                            {
                                where: {
                                    id_mp: req.body.id_mp
                                }
                            }
                        )

                        const updSM = await models.m_sm.update(
                            {

                                id_mitra_pickup: req.body.id_mitra_pickup,
                                id_unit: req.body.id_unit,
                                id_unit_2: req.body.id_unit,
                                id_unit_3: req.body.id_unit,
                                id_driver: req.body.id_supir,
                                id_driver_2: req.body.id_supir,
                                id_driver_3: req.body.id_supir,
                                pickup_kendaraan: req.body.pickup_kendaraan,
                                kendaraan_2: req.body.pickup_kendaraan,
                                pickup_kendaraan: req.body.pickup_kendaraan,
                                pickup_nopol: req.body.pickup_nopol,
                                nopol: req.body.pickup_nopol,
                                nopol_2: req.body.pickup_nopol,
                                pickup_supir: req.body.pickup_supir,
                                supir: req.body.pickup_supir,
                                supir_2: req.body.pickup_supir,
                                id_mitra: req.body.id_mitra_pickup,
                                id_mitra_2: req.body.id_mitra_pickup,
                                berat: req.body.berat,
                                qty: req.body.qty,
                                koli: req.body.koli,
                                ikat: req.body.ikat,
                                tgl_muat: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                tgl_update: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                where: {
                                    id_mpd: req.body.id_mpd
                                }
                            }
                        )

                        const updApprove = await models.m_pengadaan_approve.update(
                            {

                                operasional: req.user.id,
                                apv_ops: 'Y',
                                tgl_apv_ops: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                            },
                            {
                                where: {
                                    id_mp: req.body.id_mp
                                }
                            }
                        )

                        const getDriver = await models.m_driver.findOne(
                            {
                                where: {
                                    id: req.body.id_supir
                                }
                            }
                        )
                        if (updOrderStat) {
                            // console.log("?? ~ file: sp.controller.js:3206 ~ exports.approveSp= ~ updOrderStat:", updOrderStat)
                            const updStatMsg = await models.m_chat.create(
                                {
                                    "id_mp": req.body.id_mp,
                                    "user": req.user.id,
                                    "ph": "",
                                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    "chat": "Menggunakan unit " + req.body.plat_nomor + " | " + req.body.merk + " | " + getDriver.nama,
                                    "baca": "0"

                                },

                            )
                            if (updStatMsg) {
                                output = {
                                    status: {
                                        code: 200,
                                        message: 'Berhasil Approve Sp'
                                    },

                                }
                            }
                            else {
                                output = {
                                    status: {
                                        code: 402,
                                        message: 'Gagal Approve Sp'
                                    },

                                }
                            }
                        }

                    }


                    // }

                    // if (getUser.divisi == 'purchasing') {


                    //     const updOrderStat = await models.m_status_order.update(
                    //         {
                    //             purchasing: req.user.id,
                    //             kendaraan_purchasing: "Y",
                    //             tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

                    //         },
                    //         {
                    //             where: {
                    //                 id_mp: req.body.id_mp
                    //             }
                    //         }
                    //     )

                    //     const updSM = await models.m_sm.update(
                    //         {

                    //             // id_mitra_pickup: req.body.id_mitra_pickup,
                    //             id_mitra: req.body.id_mitra,
                    //             id_mitra_2: req.body.id_mitra_2,
                    //             // tgl_muat: core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                    //             // 'pembungkus': '-',
                    //             // 'berat': 0,
                    //             // 'qty': 0,
                    //             // 'koli': 0,
                    //             // 'do': '-',
                    //             // 'kendaraan': '',
                    //             // 'kendaraan_2': '',
                    //             // 'pickup_kontainer': '',
                    //             // 'telp_2': '',
                    //             // 'seal': '',
                    //             // 'nama_kapal': '',
                    //             // 'kapal_berangkat': '',
                    //             // tgl_update: core.moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                    //             // 'keterangan_ap': '',
                    //             // 'status_date': ''
                    //         },
                    //         {
                    //             where: {
                    //                 id_mpd: req.body.id_mpd
                    //             }
                    //         }
                    //     )


                    //     const updApprove = await models.m_pengadaan_approve.update(
                    //         {

                    //             purchasing: req.user.id,
                    //             apv_purch: 'Y',
                    //             tgl_apv_purch: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                    //         },
                    //         {
                    //             where: {
                    //                 id_mp: req.body.id_mp
                    //             }
                    //         }
                    //     )
                    //     if (updOrderStat) {
                    //         const updStatMsg = await models.m_chat.create(
                    //             {
                    //                 "id_mp": req.body.id_mp,
                    //                 "user": req.user.id,
                    //                 "ph": "",
                    //                 "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    //                 "chat": "Menggunakan unit " + req.body.plat_nomor + " | " + req.body.merk,
                    //                 "baca": "0"

                    //             },

                    //         )
                    //         if (updStatMsg) {
                    //             output = {
                    //                 status: {
                    //                     code: 200,
                    //                     message: 'Berhasil Approve Sp'
                    //                 },

                    //             }
                    //         }
                    //         else {
                    //             output = {
                    //                 status: {
                    //                     code: 402,
                    //                     message: 'Gagal Approve Sp'
                    //                 },

                    //             }
                    //         }
                    //     }
                    // }





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

exports.approvePurchasing = async (req, res) => {
    try {
        const errorsFromMiddleware = await customErrorMiddleware(req);
        if (errorsFromMiddleware) {
            return res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware);
        }

        const getUser = await models.users.findOne({ where: { id: req.user.id } });
        if (!getUser) {
            return res.status(404).send({ status: { code: 404, message: 'User not found' } });
        }

        const getDetail = await models.m_pengadaan_detail.findAll({ where: { id_mpd: req.body.id_mp } });
        if (!getDetail) {
            return res.status(404).send({ status: { code: 404, message: 'Details not found' } });
        }

        const updOrderStat = await models.m_status_order.update(
            {
                purchasing: req.user.id,
                kendaraan_purchasing: "Y",
                tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            },
            { where: { id_mp: req.body.id_mp } }
        );

        const updSM = await models.m_sm.update(
            {
                id_mitra_pickup: req.body.id_mitra_pickup,
                id_unit: req.body.id_unit,
                id_driver: req.body.id_driver,
                pickup_kendaraan: req.body.pickup_kendaraan,
                pickup_nopol: req.body.pickup_nopol,
                pickup_supir: req.body.pickup_supir,
                id_mitra: req.body.id_mitra,
                id_unit_2: req.body.id_unit_2,
                id_driver_2: req.body.id_driver_2,
                kendaraan: req.body.kendaraan,
                nopol: req.body.nopol,
                supir: req.body.supir,
                id_mitra_2: req.body.id_mitra_2,
                id_unit_3: req.body.id_unit_3,
                id_driver_3: req.body.id_driver_3,
                kendaraan_2: req.body.kendaraan_2,
                nopol_2: req.body.nopol_2,
                supir_2: req.body.supir_2,
                berat: req.body.berat,
                qty: req.body.qty,
                koli: req.body.koli,
                ikat: req.body.ikat,
            },
            { where: { id_mpd: req.body.id_mpd } }
        );

        const updApprove = await models.m_pengadaan_approve.update(
            {
                purchasing: req.user.id,
                apv_purch: 'Y',
                tgl_apv_purch: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            },
            { where: { id_mp: req.body.id_mp } }
        );

        const GetDriv1 = req.body.id_driver == 0 ? null : await models.m_driver.findOne({ where: { id: req.body.id_driver } });
        const GetDriv2 = req.body.id_driver_2 == 0 ? null : await models.m_driver.findOne({ where: { id: req.body.id_driver_2 } });
        const GetDriv3 = req.body.id_driver_3 == 0 ? null : await models.m_driver.findOne({ where: { id: req.body.id_driver_3 } });

        const driver1Name = GetDriv1 ? GetDriv1.nama : "-";
        const driver2Name = GetDriv2 ? GetDriv2.nama : "-";
        const driver3Name = GetDriv3 ? GetDriv3.nama : "-";
        const chatMessage = `Menggunakan unit: ${req.body.pickup_nopol}, ${req.body.nopol}, ${req.body.nopol_2} | Driver: ${driver1Name}, ${driver2Name}, ${driver3Name}`;

        const updStatMsg = await models.m_chat.create({
            id_mp: req.body.id_mp,
            user: req.user.id,
            ph: "",
            tgl_chat: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            chat: chatMessage,
            baca: "0"
        });

        if (updStatMsg) {
            return res.status(200).send({ status: { code: 200, message: 'Berhasil Approve Sp' } });
        } else {
            return res.status(402).send({ status: { code: 402, message: 'Gagal Approve Sp' } });
        }
    } catch (error) {
        return res.status(500).send({ status: { code: 500, message: error.message } });
    }
};

// exports.approvePurchasing = async (req, res) => {
//     try {
//         const errorsFromMiddleware = await customErrorMiddleware(req)
//         if (!errorsFromMiddleware) {
//             const getUser = await models.users.findOne(
//                 {
//                     where: {
//                         id: req.user.id
//                     }
//                 }
//             )
//             if (getUser) {



//                 const getDetail = await models.m_pengadaan_detail.findAll(
//                     {
//                         where: {
//                             id_mpd: req.body.id_mp
//                         }
//                     }
//                 )
//                 if (getDetail) {


//                     // if (getUser.divisi == 'purchasing') {


//                     const updOrderStat = await models.m_status_order.update(
//                         {
//                             purchasing: req.user.id,
//                             kendaraan_purchasing: "Y",
//                             tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

//                         },
//                         {
//                             where: {
//                                 id_mp: req.body.id_mp
//                             }
//                         }
//                     )

//                     const updSM = await models.m_sm.update(
//                         {
//                             id_mitra_pickup: req.body.id_mitra_pickup,
//                             id_unit: req.body.id_unit,
//                             id_driver: req.body.id_driver,
//                             pickup_kendaraan: req.body.pickup_kendaraan,
//                             pickup_nopol: req.body.pickup_nopol,
//                             pickup_supir: req.body.pickup_supir,
//                             //----------------------------------------//
//                             id_mitra: req.body.id_mitra,
//                             id_unit_2: req.body.id_unit_2,
//                             id_driver_2: req.body.id_driver_2,
//                             kendaraan: req.body.kendaraan,
//                             nopol: req.body.nopol,
//                             supir: req.body.supir,
//                             //---------------------------------------------//
//                             id_mitra_2: req.body.id_mitra_2,
//                             id_unit_3: req.body.id_unit_3,
//                             id_driver_3: req.body.id_driver_3,
//                             kendaraan_2: req.body.kendaraan_2,
//                             nopol_2: req.body.nopol_2,
//                             supir_2: req.body.supir_2,
//                             berat: req.body.berat,
//                             qty: req.body.qty,
//                             koli: req.body.koli,
//                             ikat: req.body.ikat,


//                         },
//                         {
//                             where: {
//                                 id_mpd: req.body.id_mpd
//                             }
//                         }
//                     )


//                     const updApprove = await models.m_pengadaan_approve.update(
//                         {

//                             purchasing: req.user.id,
//                             apv_purch: 'Y',
//                             tgl_apv_purch: core.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
//                         },
//                         {
//                             where: {
//                                 id_mp: req.body.id_mp
//                             }
//                         }
//                     )
//                     const GetDriv1 = req.body.id_driver == 0 ? 1512 : await models.m_driver.findOne(
//                         {
//                             where: {
//                                 id: req.body.id_driver
//                             }
//                         }
//                     )
//                     const GetDriv2 = req.body.id_driver_2 == 0 ? 1512 : await models.m_driver.findOne(
//                         {
//                             where: {
//                                 id: req.body.id_driver_2,
//                             }
//                         }
//                     )
//                     const GetDriv3 = req.body.id_driver_3 == 0 ? 1512 : await models.m_driver.findOne(
//                         {
//                             where: {
//                                 id: req.body.id_driver_3,
//                             }
//                         }
//                     )
//                     if (updOrderStat) {
//                         if (GetDriv1 == null && GetDriv2 == null && GetDriv3 == null) {
//                             const updStatMsg = await models.m_chat.create(
//                                 {
//                                     "id_mp": req.body.id_mp,
//                                     "user": req.user.id,
//                                     "ph": "",
//                                     "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//                                     "chat": "Menggunakan unit: " + req.body.pickup_nopol + "," + req.body.nopol + "," + req.body.nopol_2 + " | " + "Driver:" + "-" + "-" + "-",
//                                     "baca": "0"

//                                 },

//                             )
//                             if (updStatMsg) {
//                                 output = {
//                                     status: {
//                                         code: 200,
//                                         message: 'Berhasil Approve Sp'
//                                     },

//                                 }
//                             }
//                             else {
//                                 output = {
//                                     status: {
//                                         code: 402,
//                                         message: 'Gagal Approve Sp'
//                                     },

//                                 }
//                             }
//                         }
//                         else {
//                             const updStatMsg = await models.m_chat.create(
//                                 {
//                                     "id_mp": req.body.id_mp,
//                                     "user": req.user.id,
//                                     "ph": "",
//                                     "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//                                     "chat": "Menggunakan unit: " + req.body.pickup_nopol + "," + req.body.nopol + "," + req.body.nopol_2 + " | " + "Driver :" + GetDriv1 == null ? "-" : GetDriv1.nama + "," + GetDriv2 == null ? "-" : GetDriv2.nama + "," + GetDriv3 == null ? "-" : GetDriv3.nama,
//                                     "baca": "0"

//                                 },

//                             )
//                             if (updStatMsg) {
//                                 output = {
//                                     status: {
//                                         code: 200,
//                                         message: 'Berhasil Approve Sp'
//                                     },

//                                 }
//                             }
//                             else {
//                                 output = {
//                                     status: {
//                                         code: 402,
//                                         message: 'Gagal Approve Sp'
//                                     },

//                                 }

//                             }
//                         }
//                     }
//                 }





//             }
//         }

//         // }

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


exports.declineSp = async (req, res) => {
    try {
        // const errorsFromMiddleware = await customErrorMiddleware(req)
        // if (!errorsFromMiddleware) {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            // const updPengDi = await models.m_pengadaan_detail.update(
            //     {
            //         // id_mp : req.body.id_mp,
            //         id_unit: req.body.id_unit,
            //         id_supir: req.body.id_supir,
            //         tgl_update: core.moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),

            //     },
            //     {
            //         where: {
            //             id_mp: req.body.id_mp
            //         }
            //     }
            // )
            // if (updPengDi) {
            const updOrderStat = await models.m_status_order.update(
                {
                    operasional: req.user.id,
                    kendaraan_operasional: "N",
                    tgl_act_4: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),

                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            if (updOrderStat) {
            const opsRejectId = parseInt(req.body.id_do_massage || 0, 10) || 0;
            await models.m_status_order.update(
                {
                    ops_reject: opsRejectId
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
                const updStatMsg = await models.m_chat.create(
                    {
                        "id_mp": req.body.id_mp,
                        "user": req.user.id,
                        "ph": "",
                        "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        "chat": "Tidak Menggunakan unit",
                        "baca": "0"

                    },

                )
                if (updStatMsg) {
                    output = {
                        status: {
                            code: 200,
                            message: 'SP Declined'
                        },

                    }
                }
                else {
                    output = {
                        status: {
                            code: 402,
                            message: 'Decline Sp failed'
                        },

                    }
                }
            }
        }
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

exports.getSelect = async (req, res) => {
    try {


        models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });
        models.kendaraan.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_vendor' });
        models.m_driver.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // const getVendor = await models.

            const getTipe = await models.kendaraan_jenis.findAll(
                {
                    order: [['id_kendaraan_jenis', 'desc']],

                    where: {
                        status: "1"
                    }
                }
            )

            const getKendaraan = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],
                    include: [
                        {
                            model: models.mitra
                        }
                    ],
                    ...req.query.vehicleType ? {
                        where: {
                            status: "1",
                            // id_kendaraan_jenis: req.query.vehicleType,
                            // id_vendor: req.query.mitra,
                            jenis_kepemilikan: ["eureka", "eur_sewa",]
                        }
                    } : {},

                }
            )
            const getDriver = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],
                    limit: 1,
                    // group: [['id']],
                    include: [
                        {
                            model: models.m_driver,
                            include: [
                                {
                                    model: models.mitra,
                                    // required: true
                                }
                            ],
                            // required: true,

                            ...req.query.id ? {
                                where: {
                                    // status: "1",
                                    id: req.query.id
                                }
                            } : {},
                        }
                    ]
                }
            )
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

            if (getDriver && getKendaraan && getTipe) {
                const response = {
                    mitra: getMitra.map((i) => {
                        return {
                            id: i.id_mitra,
                            mitra: i.nama_mitra,
                            type: i.type
                        }
                    }).filter(i => i.mitra != ""),

                    type: getTipe.map((i) => {
                        return {
                            id: i.id_kendaraan_jenis,
                            tipe: i.nama_kendaraan_jenis,
                        }
                    }),
                    vehicle: getKendaraan.map((i) => {
                        return {
                            id: i.id,
                            driverId: i.id_driver,
                            idKendaraanJenis: i.id_kendaraan_jenis,
                            tipe: i.jenis_kendaraan,
                            kd_kendaraan: i.kode_kendaraan,
                            no_polisi: i.no_polisi,
                            idMitra: i.id_vendor,
                            mitra: i.mitra == null ? "-" : i.mitra.nama_mitra,


                        }
                    }),
                    Driver: req.query.id ? getDriver.map((i) => {
                        return {
                            idUnit: i.id,
                            idDriver: i.m_driver.id,
                            name: i.m_driver.nama,
                            mitra: i?.m_driver?.mitra?.nama_mitra
                        }
                    }).filter(i => i.nama != "") : {},
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


exports.getSelectPurch = async (req, res) => {
    try {


        models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            // const getVendor = await models.

            const getTipe = await models.kendaraan_jenis.findAll(
                {
                    order: [['id_kendaraan_jenis', 'desc']],

                    where: {
                        status: "1"
                    }
                }
            )

            const getKendaraan = await models.kendaraan.findAll(
                {
                    order: [['jenis_kendaraan', 'desc']],
                    ...req.query.vehicleType ? {
                        where: {
                            status: "1",
                            jenis_kendaraan: req.query.vehicleType,
                            id_mitra: req.query.id_mitra,
                        }
                    } : {},

                }
            )
            const getDriver = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],


                    include: [
                        {
                            model: models.m_driver,
                            // required: true,

                            ...req.query.id ? {
                                where: {
                                    // status: "1",
                                    id: req.query.id
                                }
                            } : {},
                        }
                    ]
                }
            )
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

            if (getDriver && getKendaraan && getTipe) {
                const response = {
                    mitra: getMitra.map((i) => {
                        return {
                            id: i.id_mitra,
                            mitra: i.nama_mitra
                        }
                    }),

                    type: getTipe.map((i) => {
                        return {
                            id: i.id_kendaraan_jenis,
                            tipe: i.nama_kendaraan_jenis,
                        }
                    }),
                    vehicle: req.query.vehicleType ? getKendaraan.map((i) => {
                        return {
                            id: i.id,
                            driverId: i.id_driver,
                            tipe: i.jenis_kendaraan,
                            kd_kendaraan: i.kode_kendaraan,
                            no_polisi: i.no_polisi,

                        }
                    }) : {},
                    Driver: req.query.id ? getDriver.map((i) => {
                        return {
                            idUnit: i.id,
                            idDriver: i.m_driver.id,
                            name: i.m_driver.nama
                        }
                    }).filter(i => i.nama != "") : {},
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

// exports.anotherDriver = async (req, res) => {
//     try {
//         models.m_driver.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });

//         const getUser = await models.users.findOne(
//             {
//                 where: {
//                     id: req.user.id
//                 }
//             }
//         )
//         if (getUser) {
//             const getdriv = await models.m_driver.findAll(
//                 {
//                     order: [['id', 'desc']],
//                     where: {
//                         status: "1"
//                     },
//                     include: [
//                         {
//                             model: models.mitra
//                         }
//                     ]
//                 }
//             )
//             if (getdriv) {
//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Succecs Get Data'
//                     },
//                     data: getdriv.map((i) => {
//                         return {
//                             id: i.id,
//                             mitra: i.mitra == null ? "-" : i.mitra.nama_mitra,
//                             name: i.nama
//                         }
//                     }).filter(i => i.name != "")

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

exports.anotherDriver = async (req, res) => {
    try {
        // Relasi mitra (boleh tetap di sini untuk mitra)
        models.m_driver.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });

        // Tidak perlu definisi relasi kendaraan di sini jika sudah diinisialisasi di index.js!

        const getUser = await models.users.findOne({
            where: { id: req.user.id }
        });

        if (getUser) {
            const getdriv = await models.m_driver.findAll({
                order: [['id', 'desc']],
                where: { status: "1" },
                include: [
                    { model: models.mitra },
                    { model: models.kendaraan, as: 'kendaraans' }
                ]
            });

            if (getdriv) {
                output = {
                    status: {
                        code: 200,
                        message: 'Succecs Get Data'
                    },
                    data: getdriv.map((i) => {
                        // Ambil kendaraan pertama, atau bisa juga array semua id kendaraan
                        // Kalau hanya mau satu id kendaraan (misal pertama):
                        const idUnit = Array.isArray(i.kendaraans) && i.kendaraans.length > 0
                            ? i.kendaraans[0].id
                            : null;

                        return {
                            id: i.id,
                            mitra: i.mitra == null ? "-" : i.mitra.nama_mitra,
                            name: i.nama,
                            idUnit // <-- ini id kendaraan pertama, atau null kalau tidak ada
                        }
                    }).filter(i => i.name != "")
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
        res.status(output.status.code).send(output)
    } else {
        res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
    }
}

exports.setLostSale = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const setData = await models.m_status_order.update(
                {
                    operasional: req.user.id,
                    kendaraan_operasional: "N",
                    tgl_act_4: Date.now(),
                    // purchasing:req.user.id,
                    kendaraan_purchasing: "N",
                    tgl_act_5: Date.now()
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            if (setData) {
                const setMsg = await models.m_chat.create(
                    {
                        id_mp: req.body.id_mp,
                        ph: "",
                        user: req.user.id,
                        chat: "Lost Sale sesuai info customer",
                        baca: "0",
                        tgl_chat: Date.now()
                    }
                )
                if (setMsg) {
                    output = {
                        status: {
                            code: 200,
                            message: 'Succes Set Data'
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



//akunting
exports.approveAkunting = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const ApproveStatus = await models.m_status_order.update(
                {
                    akunting: req.user.id,
                    act_akunting: "Y",
                    tgl_act_3: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const approvePeng = await models.m_pengadaan_detail.update(
                {
                    akunting: req.user.id,
                    apv_akunting: "Y",
                    tgl_apv_akunting: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const createMassage = await models.m_chat.create(
                {
                    "id_mp": req.body.id_mp,
                    "user": req.user.id,
                    "ph": "",
                    "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    "chat": "Approved By Akunting",
                    "baca": "0"
                }
            )
            if (approvePeng && ApproveStatus && createMassage) {
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Approve Sp '
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

exports.rejecAkunting = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const ApproveStatus = await models.m_status_order.update(
                {
                    akunting: req.user.id,
                    act_akunting: "N",
                    tgl_act_3: core.moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const aktRejectId = parseInt(req.body.id_do_massage || 0, 10) || 0;
            await models.m_status_order.update(
                {
                    akt_reject: aktRejectId
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const approvePeng = await models.m_pengadaan_detail.update(
                {
                    akunting: req.user.id,
                    apv_akunting: "N",
                    tgl_apv_akunting: core.moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            if (approvePeng && ApproveStatus) {
                const updStatMsg = await models.m_chat.create(
                    {
                        "id_mp": req.body.id_mp,
                        "user": getUser.id,
                        "ph": "",
                        "tgl_chat": Date.now(),
                        "chat": req.user.fullname + " reject SP Akunting",
                        "baca": "0"

                    },
                )
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Reject Sp '
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

exports.getListWaitingAkunting = async (req, res) => {
    try {
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        // models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat' });
        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const options = {
                pagination: {
                    limit: limit,
                    offset: offset,
                },
                result: {
                    // distinct: true,
                    order: [['id_mp', 'desc']],
                    where: {
                        status: [1, 2],

                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msp: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {}
                    },
                    group: [['msp']],
                    // group: [Sequelize.fn('m_pengadaaan', Sequelize.col('id_mp'))],
                    // raw: false,
                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                // {
                                //     model: models.m_sm
                                // }
                            ]
                        },
                        {
                            model: models.users,
                            required: false
                        },
                        {
                            model: models.customer,
                            required: false,

                        },
                        // {
                        //     model: models.m_chat,
                        //     required: false,
                        // },
                        {
                            model: models.m_status_order,
                            required: true,
                            order: [['tgl_act_1', 'desc']],
                            where:
                            {
                                [Op.and]: [
                                    // {
                                    //     kendaraan_operasional: 'N',

                                    // },
                                    // {
                                    //     operasional: 0,

                                    // },
                                    {
                                        act_akunting: "N",

                                    },
                                    {
                                        akunting: 0,

                                    },
                                    {
                                        [Op.or]: [
                                            { tgl_act_3: "0000-00-00 00:00:00" },
                                            { tgl_act_3: "1970-01-01 07:00:00" }
                                        ]
                                    },
                                    {
                                        act_sales: "Y"
                                    }

                                ],
                                // tgl_act_4: "0000-00-00 00:00:00"
                                // tgl_act_4: !null
                                // [Op.and]: [{ kendaraan_operasional: 'N' }, { act_akunting: "Y" },],


                            },


                            include: [
                                {
                                    model: models.users,
                                    required: false
                                }
                            ]

                        },
                    ]

                }
            }
            const [total, getData] = await Promise.all([
                models.m_pengadaan.findAll({ ...options.result }),
                models.m_pengadaan.findAll({ ...options.pagination, ...options.result })
            ])



            if (getData) {

                let no = (getData.length > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.map((item) => {
                    return {
                        no: no++,
                        idmp: item.id_mp,
                        noSj: item.m_pengadaan_detail?.m_sm?.msm,
                        sp: item.msp,
                        salesName: item.user == null ? "-" : item.user.nama_lengkap,
                        perusahaan: item.customer?.nama_perusahaan,
                        service: item.service,
                        pickupDate: core.moment(item.tgl_pickup,).format('YYYY-MM-DD HH:mm:ss'),
                        // kendaraan: item.m_pengadaan_detail.kendaraan,
                        approveAct: item.m_status_order?.act_akunting,
                        dateApproveAct: core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD HH:mm:ss'),
                        approveOps: item.m_status_order?.kendaraan_operasional,
                        idops: item.m_status_order?.operasional,
                        operationalName: item.m_status_order?.user == null ? "" : item.m_status_order?.user.nama_lengkap,
                        dateApproveOps: core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.m_status_order === null ? "N" : item.m_status_order.kendaraan_purchasing,
                        dateApprovePurch: item.m_status_order === null ? "Invalid date" : core.moment(item.m_status_order.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                        // // chat: item.m_chat
                        // idMuat: item.m_pengadaan_detail.id_almuat,
                        // idBongkar: item.m_pengadaan_detail.id_albongkar,
                        // destinasi
                        // kendaraan: item.m_status_order
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {


                        totalData: total.length,
                        totalPage: Math.ceil(total.length / req.query.limit),
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

//purhasing
exports.getDetailApprovePurchIDMP = async (req, res) => {
    try {

        const unit = models.kendaraan

        models.m_pengadaan_detail.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_supir' });
        models.m_pengadaan_detail.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        if (!models.m_pengadaan_detail.associations.kendaraanUnit) {
            models.m_pengadaan_detail.belongsTo(unit, { targetKey: 'id', foreignKey: 'id_unit', as: 'kendaraanUnit' });
        }

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: req.query.id_mp
                    },
                    include: [
                        {
                            model: models.m_driver
                        },
                        {
                            model: models.kendaraan,
                            as: 'kendaraanUnit'
                        },
                        {
                            model: models.mitra
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
                    data: req.query.id_mp ? getDetail.map((i) => {
                        return {
                            idmpd: i.id_mpd,
                            mitraId: i.mitra == null ? 0 : i.mitra.id_mitra,
                            mitra: i.mitra == null ? "-" : i.mitra.nama_mitra,
                            driverId: i.m_driver?.id,
                            driverName: i.m_driver?.nama,
                            tipeKendaraan: i.kendaraan,
                            unit: i.kendaraanUnit?.no_polisi
                        }
                    }) : {}
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

exports.getDetailApprovePurch = async (req, res) => {
    try {

        const unit = models.kendaraan

        models.m_pengadaan_detail.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_supir' });
        models.m_pengadaan_detail.belongsTo(models.mitra, { targetKey: 'id_mitra', foreignKey: 'id_mitra' });
        if (!models.m_pengadaan_detail.associations.kendaraanUnit) {
            models.m_pengadaan_detail.belongsTo(unit, { targetKey: 'id', foreignKey: 'id_unit', as: 'kendaraanUnit' });
        }

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDetail = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mpd: req.query.id_mpd
                    },
                    include: [
                        {
                            model: models.m_driver
                        },
                        {
                            model: models.kendaraan,
                            as: 'kendaraanUnit'
                        },
                        {
                            model: models.mitra
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
                    data: req.query.id_mpd ? getDetail.map((i) => {
                        return {
                            idmpd: i.id_mpd,
                            mitraId: i.mitra == null ? "-" : i.mitra.id_mitra,
                            mitra: i.mitra == null ? "-" : i.mitra.nama_mitra,
                            driverId: i.m_driver?.id,
                            driverName: i.m_driver?.nama,
                            tipeKendaraan: i.kendaraan,
                            unit: i.kendaraanUnit?.no_polisi
                        }
                    }) : {}
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

exports.getListMultiDrop = async (req, res) => {
    try {
        models.m_pengadaan.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                },

            }
        )
        if (getUser) {
            const getData = await models.m_pengadaan.findAndCountAll(
                {
                    where: {
                        is_multi: 1
                    },
                    include: [
                        {
                            model: models.m_pengadaan_detail
                        }
                    ],
                    limit: limit,
                    offset: offset,
                    order: [['id_mp', 'desc']]
                },
            )
            if (getData.rows) {
                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = getData.rows.map((item) => {
                    return {}
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

exports.getListWaitingPurch = async (req, res) => {
    try {
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat' });
        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        // const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

            const options = {
                pagination: {
                    limit: limit,
                    offset: offset,
                },
                result: {
                    distinct: true,
                    required: true,
                    order: [['id_mp', 'desc']],
                    // group: [['msp']], // Hapus group untuk menghindari duplikasi
                    where: {
                        status: [1, 2],
                        msp: {
                            [Op.or]: [
                                { [Op.like]: `%${'21-%'}%` },
                                { [Op.like]: `%${'11-%'}%` }
                            ]
                        },
                        is_multi: [0, 1],
                        ...req.query.is_multi ? {
                            is_multi: req.query.is_multi
                        } : {},
                        ...req.query.keyword ? {
                            [Op.or]: [
                                {
                                    msp: {
                                        [Op.like]: `%${req.query.keyword}%`
                                    },

                                },


                            ]
                        } : {},

                    },
                    include: [
                        {
                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                {
                                    model: models.m_sm
                                }
                            ]
                        },
                        {
                            model: models.users,
                            required: false
                        },
                        {
                            model: models.customer,
                            required: false,

                        },
                        // {
                        //     model: models.m_chat,
                        //     required: false,
                        // },
                        {
                            model: models.m_status_order,
                            required: true,
                            order: [['tgl_act_4', 'desc']],
                            where:
                            {
                                ...req.query.statusApprovePurch ? {

                                    kendaraan_purchasing: req.query.statusApprovePurch,

                                } : {},
                                [Op.and]: [
                                    {
                                        [Op.or]: [
                                            {
                                                kendaraan_operasional: "Y",

                                            },
                                            {
                                                kendaraan_operasional: "N",

                                            },
                                        ]
                                    },
                                    {
                                        operasional: { [Op.ne]: 0 },

                                    },
                                    {
                                        act_akunting: "Y",

                                    },
                                    {
                                        akunting: { [Op.ne]: 0 },

                                    },

                                    {
                                        kendaraan_purchasing: "N"

                                    },
                                    {
                                        purchasing: 0,

                                    },

                                ],
                            },


                            // include: [
                            //     {
                            //         model: models.users,
                            //         required: false
                            //     }
                            // ]

                        },
                    ]
                }
            }
            const [total, getData] = await Promise.all([
                models.m_pengadaan.findAll({ ...options.result }),
                models.m_pengadaan.findAll({ ...options.pagination, ...options.result })
            ])

            // Kelompokkan data berdasarkan SP yang unik untuk menghindari duplikasi
            const uniqueSPData = [];
            const seenSPs = new Set();
            
            for (const item of getData) {
                if (!seenSPs.has(item.msp)) {
                    seenSPs.add(item.msp);
                    uniqueSPData.push(item);
                }
            }

            // const getData = await models.m_pengadaan.findAndCountAll(
            //     {
            //         distinct: true,
            //         required: true,
            //         order: [['id_mp', 'desc']],
            //         group: [['msp']],
            //         where: {
            //             msp: {
            //                 [Op.or]: [
            //                     { [Op.like]: `%${'21-%'}%` },
            //                     { [Op.like]: `%${'11-%'}%` }
            //                 ]
            //             },
            //             is_multi: [0, 1],
            //             ...req.query.is_multi ? {
            //                 is_multi: req.query.is_multi
            //             } : {},
            //             ...req.query.keyword ? {
            //                 [Op.or]: [
            //                     {
            //                         msp: {
            //                             [Op.like]: `%${req.query.keyword}%`
            //                         },

            //                     },


            //                 ]
            //             } : {}
            //         },
            //         // ...req.query.is_multi == 1 ? { group: [['msp']] } : {},
            //         limit: limit,
            //         offset: offset,
            //         include: [
            //             {
            //                 model: models.m_pengadaan_detail,
            //                 required: false,
            //                 include: [
            //                     {
            //                         model: models.m_sm
            //                     }
            //                 ]
            //             },
            //             {
            //                 model: models.users,
            //                 required: false
            //             },
            //             {
            //                 model: models.customer,
            //                 required: false,

            //             },
            //             // {
            //             //     model: models.m_chat,
            //             //     required: false,
            //             // },
            //             {
            //                 model: models.m_status_order,
            //                 required: true,
            //                 order: [['tgl_act_4', 'desc']],
            //                 where:
            //                 {
            //                     [Op.and]: [
            //                         {
            //                             [Op.or]: [
            //                                 {
            //                                     kendaraan_operasional: "Y",

            //                                 },
            //                                 {
            //                                     kendaraan_operasional: "N",

            //                                 },
            //                             ]
            //                         },
            //                         {
            //                             operasional: { [Op.ne]: 0 },

            //                         },
            //                         {
            //                             act_akunting: "Y",

            //                         },
            //                         {
            //                             akunting: { [Op.ne]: 0 },

            //                         },

            //                         {
            //                             kendaraan_purchasing: "N"

            //                         },
            //                         {
            //                             purchasing: 0,

            //                         },

            //                     ],
            //                 },


            //                 // include: [
            //                 //     {
            //                 //         model: models.users,
            //                 //         required: false
            //                 //     }
            //                 // ]

            //             },
            //         ]

            //     }
            // )

            if (uniqueSPData) {
                const currentPage = Number(req.query.page) || 1; // Halaman saat ini
                const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman
                const startIndex = (currentPage - 1) * itemsPerPage + 1;

                // let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = uniqueSPData.map((item, index) => {
                    return {
                        no: startIndex + index,
                        idmp: item.id_mp,
                        noSj: item.m_pengadaan_detail?.m_sm?.msm,
                        sp: item.msp,
                        salesName: item.user.nama_lengkap,
                        perusahaan: item.customer?.nama_perusahaan,
                        service: item.service,
                        pickupDate: core.moment(item.tgl_pickup,).format('YYYY-MM-DD hh:mm:ss'),
                        // kendaraan: item.m_pengadaan_detail.kendaraan,
                        approveAct: item.m_status_order?.act_akunting,
                        dateApproveAct: core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD hh:mm:ss'),
                        approveOps: item.m_status_order?.kendaraan_operasional,
                        idops: item.m_status_order?.operasional,
                        operationalName: item.m_status_order?.user == null ? "" : item.m_status_order?.user.nama_lengkap,
                        dateApproveOps: core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.m_status_order?.kendaraan_operasional,
                        dateApprovePurch: core.moment(item.m_status_order?.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                    }
                })

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    data: {
                        totalData: uniqueSPData.length,
                        totalPage: Math.ceil(uniqueSPData.length / req.query.limit),
                        limit: Number(req.query.limit),
                        currentPage: Number(req.query.page),
                        canLoadMore: Math.ceil(uniqueSPData.length / req.query.limit) <= Number(req.query.page) ? false : true,
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
exports.getListWaitingPurch2 = async (req, res) => {
    try {
        models.m_status_order.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        // models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        // if (!models.m_pengadaan_detail.associations.kendaraanUnit) {
        //     models.m_pengadaan_detail.belongsTo(unit, { targetKey: 'id', foreignKey: 'id_unit', as: 'kendaraanUnit' });
        // }



        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_status_order.findAndCountAll(
                {
                    distinct: true,
                    required: true,
                    order: [['tgl_act_4', 'desc']],
                    where: {
                        // ...req.query.is_multi
                        //     ? {
                        //         '$m_pengadaan.is_multi$': `${req.query.is_multi}`

                        //     }
                        //     : {},
                        [Op.and]: [
                            {
                                kendaraan_operasional: "N" ?? "Y",

                            },
                            {
                                operasional: { [Op.ne]: 0 },

                            },
                            // {
                            //     act_akunting: "Y",

                            // },
                            // {
                            //     akunting: { [Op.ne]: 0 },

                            // },
                            {
                                kendaraan_purchasing: "N",

                            },
                            {
                                purchasing: 0,

                            },


                        ],
                    },

                    // ...req.query.is_multi == 1 ? { group: [['msp']] } : {},
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.users,
                        },
                        {
                            model: models.m_pengadaan,
                            required: false,
                            where: {
                                status: { [Op.ne]: 0 },
                                tgl_order: {
                                    [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
                                },
                                ...req.query.is_multi ? {
                                    is_multi: req.query.is_multi,
                                } : {},

                                ...req.query.keyword ? {
                                    [Op.or]: [
                                        {
                                            msp: {
                                                [Op.like]: `%${req.query.keyword}%`
                                            },

                                        },


                                    ]
                                } : {}
                            },


                            include: [
                                {
                                    model: models.m_pengadaan_detail,
                                    required: false,
                                    include: [
                                        {
                                            model: models.m_sm
                                        }
                                    ]


                                },
                                {
                                    model: models.users,
                                    required: false
                                },
                                {
                                    model: models.customer,
                                    required: false,

                                },
                                // {
                                //     model: models.m_chat,
                                //     required: false,
                                // },

                            ]
                        },


                        // include: [
                        //     {
                        //         model: models.users,
                        //         required: false
                        //     }
                        // ]


                    ]

                }
            )

            if (getData.rows) {
                const currentPage = Number(req.query.page) || 1; // Halaman saat ini
                const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman
                const startIndex = (currentPage - 1) * itemsPerPage + 1;

                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = await Promise.all(getData.rows.map(async (item, index) => {

                    // const getTujuan = await models.alamat.findOne(
                    //     {
                    //         where: {
                    //             id: item.m_pengadaan.m_pengadaan_details[0].id_albongkar
                    //         }
                    //     }
                    // )
                    // const getChatMkt = await models.m_chat.findOne(
                    //     {
                    //         where: {
                    //             id_mp: item.m_pengadaan.id_mp,
                    //             user: ['1', '323']
                    //         }
                    //     }
                    // )
                    // const getChatOps = await models.m_chat.findOne(
                    //     {
                    //         where: {
                    //             id_mp: item.m_pengadaan.id_mp,
                    //             user: ['4', '14']
                    //         }
                    //     }
                    // )
                    // // console.log(item.m_pengadaan.id_mp)
                    // const getChatPurch = await models.m_chat.findOne(
                    //     {
                    //         where: {
                    //             id_mp: item.m_pengadaan.id_mp,
                    //             user: ['2', '255', '47']
                    //         }
                    //     }
                    // )
                    return {
                        no: startIndex + index,
                        idmp: item.id_mp,
                        // noSj: item.m_pengadaan.m_pengadaan_detail?.m_sm?.msm,
                        sp: item.m_pengadaan == null ? "-" : item.m_pengadaan.msp,
                        sj: item.m_pengadaan == null ? "-" : item.m_pengadaan.m_pengadaan_detail == null ? "-" : item.m_pengadaan.m_pengadaan_detail.m_sm == null ? "-" : item.m_pengadaan.m_pengadaan_detail.m_sm.msm,
                        salesName: item.m_pengadaan == null ? "-" : item.m_pengadaan.user?.nama_lengkap,
                        perusahaan: item.m_pengadaan == null ? "-" : item.m_pengadaan.customer == null ? "-" : item.m_pengadaan.customer.nama_perusahaan,
                        kendaraan: item.m_pengadaan == null ? "-" : item.m_pengadaan.m_pengadaan_detail == null ? "-" : item.m_pengadaan.m_pengadaan_detail.kendaraan,
                        pickupDate: item.m_pengadaan == null ? "-" : core.moment(item.m_pengadaan.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                        approveAct: item.act_akunting,
                        dateApproveAct: core.moment(item.tgl_act_3).format('YYYY-MM-DD hh:mm:ss'),
                        approveOps: item.kendaraan_operasional,
                        idops: item.operasional,
                        operationalName: item.user == null ? "" : item.user.nama_lengkap,
                        dateApproveOps: core.moment(item.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.kendaraan_operasional,
                        dateApprovePurch: core.moment(item.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                        // customer: item.m_pengadaan.customer.nama_perusahaan,

                        // total: item.m_pengadaan == null ? "-" : item.m_pengadaan.total_keseluruhan,
                        // tujuan: getTujuan == null ? "-" : getTujuan.alamat_detail,
                        // chatMkt: getChatMkt == null ? "-" : getChatMkt.chat,
                        // chatOps: getChatOps == null ? "-" : getChatOps.chat,
                        // getChatPurch: getChatPurch == null ? "-" : getChatPurch.chat,


                        // tujuan:item.m_pengadaan.
                        // total:item.
                        // kendaraan: item.m_pengadaan_detail.kendaraan,

                    }
                }))

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

exports.getSelectApprovePurc = async (req, res) => {
    try {

        models.kendaraan.belongsTo(models.m_driver, { targetKey: 'id', foreignKey: 'id_driver' });

        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getTipe = await models.kendaraan_jenis.findAll(
                {
                    order: [['id_kendaraan_jenis', 'desc']],

                    where: {
                        status: "1"
                    }
                }
            )

            const getKendaraan = await models.kendaraan.findAll(
                {
                    order: [['jenis_kendaraan', 'desc']],
                    ...req.query.mitra ? {
                        where: {
                            status: "1",
                            // jenis_kendaraan: req.query.vehicleType,
                            id_vendor: req.query.mitra,
                            jenis_kepemilikan: ["eur_oncall", "eureka", "eur_sewa", "race", "rcn_oncall", "rcn_sewa"]
                        }
                    } : {},

                }
            )
            const getDriver = await models.kendaraan.findAll(
                {
                    order: [['id', 'desc']],


                    include: [
                        {
                            model: models.m_driver,
                            // required: true,

                            ...req.query.id ? {
                                where: {
                                    // status: "1",
                                    id: req.query.id
                                }
                            } : {},
                        }
                    ]
                }
            )
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
            if (getDriver && getKendaraan && getMitra && getTipe) {
                const response = {
                    mitra: getMitra.map((i) => {
                        return {
                            id: i.id_mitra,
                            mitra: i.nama_mitra
                        }
                    }),

                    type: getTipe.map((i) => {
                        return {
                            id: i.id_kendaraan_jenis,
                            tipe: i.nama_kendaraan_jenis,
                        }
                    }),
                    vehicle: req.query.mitra ? getKendaraan.map((i) => {
                        return {
                            id: i.id,
                            driverId: i.id_driver,
                            tipe: i.jenis_kendaraan,
                            kd_kendaraan: i.kode_kendaraan,
                            no_polisi: i.no_polisi,
                            idMitra: i.id_vendor,
                            mitra: i.vendor,


                        }
                    }) : {},
                    Driver: req.query.id ? getDriver.map((i) => {
                        return {
                            idUnit: i.id,
                            idDriver: i.m_driver.id,
                            name: i.m_driver.nama
                        }
                    }).filter(i => i.nama != "") : {},
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
exports.rejectPurch = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const ApproveStatus = await models.m_status_order.update(
                {
                    purchasing: req.user.id,
                    kendaraan_purchasing: "N",
                    tgl_act_5: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const purchRejectId = parseInt(req.body.id_do_massage || 0, 10) || 0;
            await models.m_status_order.update(
                {
                    purch_reject: purchRejectId
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const approvePeng = await models.m_pengadaan_approve.update(
                {
                    akunting: req.user.id,
                    apv_akunting: "N",
                    tgl_apv_akt: core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                },
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            if (approvePeng && ApproveStatus) {

                const updStatMsg = await models.m_chat.create(
                    {
                        "id_mp": req.body.id_mp,
                        "user": getUser.id,
                        "ph": "",
                        "tgl_chat": core.moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        "chat": req.body.massage,
                        "baca": "0"

                    },
                )
                output = {
                    status: {
                        code: 200,
                        message: 'Berhasil Reject Sp'
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



exports.addPoPurch = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDataSp = await models.m_pengadaan.findOne(
                {
                    where: {
                        id_mp: req.body.id_mp
                    }
                }
            )
            const geDataSpDetail = await models.m_pengadaan_detail.findOne(
                {
                    where: {
                        id_mpd: req.body.id_mpd
                    }
                }
            )
            const getDataSm = await models.m_sm.findOne(
                {
                    where: {
                        id_msm: req.body.id_msm
                    }
                }
            )
            if (getDataSp && geDataSpDetail && getDataSm) {

                const createPO = await models.m_po.create(
                    {
                        mpo: req.body.mpo,
                        note: "",
                        id_mitra: req.body.id_mitra,
                        service: getDataSp.service,
                        top: 30,
                        overtonase: getDataSp.overtonase,
                        biaya_kg: 0,
                        biaya_overtonase: getDataSp.biaya_overtonase,
                        biaya_multi_drop: getDataSp.biaya_multi_drop,
                        biaya_muat: geDataSpDetail.biaya_muat,
                        biaya_bongkar_muat: geDataSpDetail.biaya_bongkar_muat,
                        biaya_inap: 0,
                        biaya_lain: getDataSp.biaya_lain,
                        total_keseluruhan: getDataSp.total_keseluruhan,
                        tgl_kirim: getDataSp.tgl_pickup,
                        via: geDataSpDetail.via,
                        kendaraan: geDataSpDetail.kendaraan,
                        seal: "",
                        kontainer: "",
                        nopol: req.body.nopol,
                        supir: req.body.supir,
                        telp: 0,
                        memo: getDataSp.memo,
                        tgl_po: Date.now(),
                        status: "N",
                        approved: 2,
                        app_user: req.user.id,
                        app_date: Date.now(),
                        app_act: 0,
                        app_user_act: 0,
                        app_date_act: 0,
                        tgl_update: Date.now(),
                        status_sendmail: 0,
                        date_sendmail: 0,
                    }
                )
                if (createPO) {
                    const createPoDetail = await models.m_po_detail.create(
                        {
                            id_mpo: createPO.id_mpo,
                            id_msm: getDataSm.id_msm,
                            no_sm: getDataSm.msm,
                            al_muat: req.body.al_muat,
                            al_bongkar: req.body.al_bongkar,
                            po_berdasarkan: "koli",
                            hitung_berdasarkan: "koli",
                            berat: geDataSpDetail.berat,
                            qty: geDataSpDetail.qty,
                            volume: geDataSpDetail.volume,
                            exp: 0,
                            harga: geDataSpDetail.harga,
                            harga_muat: geDataSpDetail.harga_muat,
                            harga_bongkar_muat: geDataSpDetail.harga_bongkar_muat,
                            harga_inap: 0,
                            kendaraan: geDataSpDetail.kendaraan,
                            kontainer: "",
                            seal: "",
                            nopol: req.body.nopol,
                            supir: req.body.supir,
                            telp: 0,
                            tgl_update: Date.now(),
                        }
                    )
                    if (createPoDetail) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Success create PO'
                            },
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
//ackunting,ops,sales

exports.getFilterSp = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getCustomer = await models.customer.findAll(
                {
                    where: {
                        // status: 1
                    }
                }
            )
            const getSales = await models.users.findAll(
                {
                    where: {
                        user_level: 2,
                        status: 1
                    }
                }
            )
            const getCabang = await models.m_bu_brench.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )
            const getBu = await models.m_bu.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )


            if (getCustomer && getSales && getCabang) {
                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    customer: getCustomer.map((i) => {
                        return {
                            idcustomer: i.id_customer,
                            customer: i.nama_perusahaan
                        }
                    }),
                    cabang: getCabang.map((i) => {
                        return {
                            id: i.id_bu_brench,
                            cabang: i.code_bu_brench
                        }
                    }),
                    sales: getSales.map((i) => {
                        return {
                            idSales: i.id,
                            sales: i.nama_lengkap
                        }
                    }),
                    bu: getBu.map((i) => {
                        return {
                            idbu: i.id_bu,
                            bu: i.name_bu
                        }
                    }),
                    aproved: [
                        {
                            'keterangan': 'Approve purch',
                            'status': 'Y',
                        },
                    ]
                    // statusSp: [
                    //     {
                    //         value:0,
                    //         status:"cancel"
                    //     }
                    // ]
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

// exports.getFilterSp = async (req, res) => {
//   let output = {
//     status: {
//       code: 500,
//       message: 'Unknown error'
//     }
//   }

//   try {
//     const getUser = await models.users.findOne({
//       where: { id: req.user.id }
//     })

//     if (!getUser) {
//       output.status = { code: 404, message: 'User tidak ditemukan' }
//       return res.status(output.status.code).send(output)
//     }

//     const [
//       getCustomer,
//       getSales,
//       getCabang,
//       getBu
//     ] = await Promise.all([
//       models.customer.findAll(),
//       models.users.findAll({ where: { user_level: 2, status: 1 } }),
//       models.users.findAll({
//         attributes: ['kode_cabang'],
//         where: { status: 1 },
//         group: ['kode_cabang']
//       }),
//       models.m_bu.findAll({ where: { status: 1 } })
//     ])

//     output = {
//       status: {
//         code: 200,
//         message: 'Success get Data'
//       },
//       customer: getCustomer.map(i => ({
//         idcustomer: i.id_customer,
//         customer: i.nama_perusahaan
//       })),
//       cabang: getCabang.map(i => ({
//         cabang: i.kode_cabang
//       })),
//       sales: getSales.map(i => ({
//         idSales: i.id,
//         sales: i.nama_lengkap
//       })),
//       bu: getBu.map(i => ({
//         idbu: i.id_bu,
//         bu: i.name_bu
//       })),
//       aproved: [
//         {
//           keterangan: 'Approve purch',
//           status: 'Y'
//         }
//       ]
//     }

//   } catch (error) {
//     output.status = {
//       code: 500,
//       message: error.message
//     }
//   }

//   const errorsFromMiddleware = await customErrorMiddleware(req)

//   if (!errorsFromMiddleware) {
//     res.status(output.status.code).send(output)
//   } else {
//     res.status(errorsFromMiddleware.status.code).send(errorsFromMiddleware)
//   }
// }

// exports.getSpListAll2 = async (req, res) => {
//     try {

//         models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
//         models.users.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });
//         models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
//         models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//         models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//         models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

//         models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

//         if (!models.m_pengadaan.associations.gl) {
//             models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_gl', as: 'gl' });
//         }
//         if (!models.m_pengadaan.associations.asm) {
//             models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_asm', as: 'asm' });
//         }
//         if (!models.m_pengadaan.associations.mgr) {
//             models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_mgr', as: 'mgr' });
//         }
//         if (!models.m_pengadaan.associations.kacab) {
//             models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_kacab', as: 'kacab' });
//         }
//         if (!models.m_pengadaan.associations.amd) {
//             models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_amd', as: 'amd' });
//         }

//         const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

//         // Siapkan kondisi query dengan parameter yang dinamis
//         const queryConditions = {
//             tgl_order: {
//                 [Op.gte]: new Date(new Date().getFullYear(), 0, 1) // Default tahun ini
//             },
//             ...(req.query.tglSp && {
//                 tgl_order: {
//                     [Op.gte]: new Date(req.query.tglSp + '-01-01'), // Awal tahun
//                     [Op.lt]: new Date((parseInt(req.query.tglSp) + 1) + '-01-01') // Awal tahun berikutnya
//                 }
//             }),
//             ...(req.query.customerId && { id_customer: req.query.customerId }),
//             ...(req.query.sales && { id_sales: req.query.sales }),
//             ...(req.query.tgl_pickup && { tgl_pickup: req.query.tgl_pickup }),
//             ...(req.query.statusSP && { status: req.query.statusSP }),
//             ...(req.query.keyword && {
//                 [Op.or]: [{ msp: { [Op.like]: `%${req.query.keyword}%` } }]
//             })
//         };

//         // Optimasi query utama dengan JOIN yang diperlukan
//         const options = {
//             where: queryConditions,
//             limit: limit,
//             offset: offset,
//             group: ['id_mp'],
//             order: [['id_mp', 'desc']],
//             include: [
//                 {
//                     model: models.users,
//                     attributes: ['nama_lengkap'],
//                     where: {
//                         ...(req.query.buId && { id_bu: req.query.buId }),
//                     },
//                     include: {
//                         model: models.m_bu_brench,
//                         attributes: ['code_bu_brench'],
//                         where: {
//                             ...(req.query.codeBrench && { code_bu_brench: req.query.codeBrench })
//                         }
//                     }
//                 },
//                 { model: models.customer, required: false },
//                 { model: models.m_pengadaan_detail, required: false },
//                 {
//                     model: models.m_status_order,
//                     required: false,
//                     include: [{ model: models.users }]
//                 },
//                 {
//                     model: models.m_bu_employee,
//                     as: 'gl',
//                     attributes: ['fullname']
//                 },
//                 {
//                     model: models.m_bu_employee,
//                     as: 'asm',
//                     attributes: ['fullname']
//                 },
//                 {
//                     model: models.m_bu_employee,
//                     as: 'mgr',
//                     attributes: ['fullname']

//                 },
//                 {
//                     model: models.m_bu_employee,
//                     as: 'kacab',
//                     attributes: ['fullname']

//                 },
//                 {
//                     model: models.m_bu_employee,
//                     as: 'amd',
//                     attributes: ['fullname']
//                 }
//             ]
//         };

//         // Query untuk count data total dengan kondisi di `include`
//         const totalData = await models.m_pengadaan.count({
//             where: queryConditions,
//             include: [
//                 {
//                     model: models.users,
//                     where: {
//                         ...(req.query.buId && { id_bu: req.query.buId }),
//                     },
//                     include: {
//                         model: models.m_bu_brench,
//                         where: {
//                             ...(req.query.codeBrench && { code_bu_brench: req.query.codeBrench })
//                         }
//                     }
//                 }
//             ]
//         });

//         // Mendapatkan data sesuai paginasi
//         const getData = await models.m_pengadaan.findAll(options);

//         if (getData) {
//             const currentPage = Number(req.query.page) || 1;
//             const itemsPerPage = Number(req.query.limit) || 10;
//             const startIndex = (currentPage - 1) * itemsPerPage + 1;

//             const result = await Promise.all(getData.map(async (item, index) => {
//                 const bongkar = item.m_pengadaan_details.map((i) => i.id_albongkar);
//                 const muat = item.m_pengadaan_details.map((i) => i.id_almuat);
//                 const kendaraan = item.m_pengadaan_details.map((i) => i.kendaraan);
//                 const getBongkar = await models.alamat.findOne({
//                     ...bongkar.slice(-1).pop() != undefined ? {
//                         where: {
//                             id: bongkar.slice(-1).pop()
//                         }
//                     } : ""
//                 });
//                 const getMuat = await models.alamat.findOne({
//                     ...muat[0] != undefined ? {
//                         where: {
//                             id: muat[0]
//                         }
//                     } : ""
//                 });

//                 return {
//                     no: startIndex + index,
//                     idmp: item.id_mp,
//                     sp: item.msp,
//                     salesName: item.user == null ? "-" : item.user.nama_lengkap,
//                     gl: item.gl == null ? "-" : item.gl.fullname,
//                     asm: item.asm == null ? "-" : item.asm.fullname,
//                     mgr: item.mgr == null ? "-" : item.mgr.fullname,
//                     kacab: item.kacab == null ? "-" : item.kacab.fullname,
//                     amd: item.amd == null ? "-" : item.amd.fullname,
//                     perusahaan: item.customer?.nama_perusahaan,
//                     kendaraan: kendaraan[0] == null ? "-" : kendaraan[0],
//                     service: item.service,
//                     pickupDate: core.moment(item.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
//                     approveSales: item.m_status_order?.act_sales,
//                     dateApproveSales: core.moment(item.m_status_order?.tgl_act_1).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_1).format('YYYY-MM-DD HH:mm:ss'),
//                     approveAct: item.m_status_order?.act_akunting,
//                     dateApproveAct: core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD HH:mm:ss'),
//                     approveOps: item.m_status_order?.kendaraan_operasional,
//                     idops: item.m_status_order?.operasional,
//                     operationalName: item.m_status_order?.user == null ? "" : item.m_status_order.user.nama_lengkap,
//                     dateApproveOps: core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
//                     approvePurch: item.m_status_order?.kendaraan_purchasing,
//                     dateApprovePurch: core.moment(item.m_status_order?.tgl_act_5).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
//                     destination: (getMuat == null ? "kota muat belum diinput" : getMuat.kota == null ? "-" : getMuat.kota) + " " + (getBongkar == null ? "kota bongkar belum diinput" : getBongkar.kota == null ? "-" : getBongkar.kota)
//                 };
//             }));


//             return res.json({
//                 totalData: totalData,
//                 totalPerPage: result.length,
//                 currentPage: currentPage,
//                 totalPage: Math.ceil(totalData / itemsPerPage),
//                 data: result
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

exports.getSpListAll2 = async (req, res) => {
    try {
        console.log('[getSpListAll2] enter version=v2.2');

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.users.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

        // if (!models.m_pengadaan.associations.gl) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_gl', as: 'gl' });
        // }
        // if (!models.m_pengadaan.associations.asm) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_asm', as: 'asm' });
        // }
        // if (!models.m_pengadaan.associations.mgr) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_mgr', as: 'mgr' });
        // }
        // if (!models.m_pengadaan.associations.kacab) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_kacab', as: 'kacab' });
        // }
        // if (!models.m_pengadaan.associations.amd) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_amd', as: 'amd' });
        // }

        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        // Siapkan kondisi query dengan parameter yang dinamis
        const queryConditions = {
            // tgl_order: {
            //     [Op.gte]: new Date(new Date().getFullYear(), 0, 1) // Default tahun ini
            // },
            // ...(req.query.tglSp && {
            //     tgl_order: {
            //         [Op.gte]: new Date(req.query.tglSp + '-01-01'), // Awal tahun
            //         [Op.lt]: new Date((parseInt(req.query.tglSp) + 1) + '-01-01') // Awal tahun berikutnya
            //     }
            // }),
            ...(req.query.customerId && { id_customer: req.query.customerId }),
            ...(req.query.sales && { id_sales: req.query.sales }),
            ...(req.query.tgl_pickup && { tgl_pickup: req.query.tgl_pickup }),
            ...(req.query.statusSP && { status: req.query.statusSP }),
            ...(req.query.keyword && {
                [Op.or]: [
                    { msp: { [Op.like]: `%${req.query.keyword}%` } }, // No SO
                    Sequelize.literal(`EXISTS (
                        SELECT 1 FROM customer 
                        WHERE customer.id_customer = m_pengadaan.id_customer 
                        AND customer.nama_perusahaan LIKE ${mysql.escape('%' + req.query.keyword + '%')}
                    )`), // Perusahaan
                    Sequelize.literal(`EXISTS (
                        SELECT 1 FROM users 
                        WHERE users.id = m_pengadaan.id_sales 
                        AND users.nama_lengkap LIKE ${mysql.escape('%' + req.query.keyword + '%')}
                    )`), // Marketing
                    Sequelize.literal(`EXISTS (
                        SELECT 1 FROM m_pengadaan_detail 
                        WHERE m_pengadaan_detail.id_mp = m_pengadaan.id_mp 
                        AND m_pengadaan_detail.kendaraan LIKE ${mysql.escape('%' + req.query.keyword + '%')}
                    )`), // Vehicle
                    Sequelize.literal(`EXISTS (
                        SELECT 1 FROM m_pengadaan_detail mpd
                        INNER JOIN alamat a1 ON a1.id = mpd.id_almuat
                        INNER JOIN alamat a2 ON a2.id = mpd.id_albongkar
                        WHERE mpd.id_mp = m_pengadaan.id_mp 
                        AND (a1.kota LIKE ${mysql.escape('%' + req.query.keyword + '%')} 
                             OR a2.kota LIKE ${mysql.escape('%' + req.query.keyword + '%')})
                    )`) // Destination
                ]
            })
        };

        // Optimasi query utama dengan JOIN yang diperlukan
        const options = {
            where: queryConditions,
            limit: limit,
            offset: offset,
            group: ['id_mp'],
            order: [['id_mp', 'desc']],
            include: [
                {
                    model: models.users,
                    attributes: ['nama_lengkap'],
                    where: {
                        ...(req.query.buId && { id_bu: req.query.buId }),
                    },
                    include: {
                        model: models.m_bu_brench,
                        attributes: ['code_bu_brench'],
                        where: {
                            ...(req.query.codeBrench && { code_bu_brench: req.query.codeBrench })
                        }
                    }
                },
                { model: models.customer, required: false },
                { model: models.m_pengadaan_detail, required: false },
                {
                    model: models.m_status_order,
                    required: false,
                    include: [{ model: models.users }]
                },
                // {
                //     model: models.m_bu_employee,
                //     as: 'gl',
                //     attributes: ['fullname']
                // },
                // {
                //     model: models.m_bu_employee,
                //     as: 'asm',
                //     attributes: ['fullname']
                // },
                // {
                //     model: models.m_bu_employee,
                //     as: 'mgr',
                //     attributes: ['fullname']

                // },
                // {
                //     model: models.m_bu_employee,
                //     as: 'kacab',
                //     attributes: ['fullname']

                // },
                // {
                //     model: models.m_bu_employee,
                //     as: 'amd',
                //     attributes: ['fullname']
                // }
            ]
        };

        // Query untuk count data total dengan kondisi di `include`
        const totalData = await models.m_pengadaan.count({
            where: queryConditions,
            include: [
                {
                    model: models.users,
                    where: {
                        ...(req.query.buId && { id_bu: req.query.buId }),
                    },
                    include: {
                        model: models.m_bu_brench,
                        where: {
                            ...(req.query.codeBrench && { code_bu_brench: req.query.codeBrench })
                        }
                    }
                }
            ]
        });

        // Mendapatkan data sesuai paginasi
        const getData = await models.m_pengadaan.findAll(options);
        console.log('[getSpListAll2] version=v2.1 rowsIsArray=', Array.isArray(getData), 'lenOrType=', Array.isArray(getData) ? getData.length : typeof getData);

        const currentPage = Number(req.query.page) || 1;
        const itemsPerPage = Number(req.query.limit) || 10;
        const startIndex = (currentPage - 1) * itemsPerPage + 1;

        const rows = Array.isArray(getData) ? getData : [];

        const result = [];
        for (let index = 0; index < rows.length; index++) {
            const item = rows[index] || {};
            const details = Array.isArray(item.m_pengadaan_details) ? item.m_pengadaan_details : [];
            const kendaraan = [];
            let kotaMuat = null;
            let kotaBongkar = null;
            
            for (const det of details) {
                if (!det) continue;
                if (det.kendaraan !== null && det.kendaraan !== undefined) kendaraan.push(det.kendaraan);
                
                // Ambil kota_muat dari detail pertama
                if (kotaMuat === null && det.kota_muat !== null && det.kota_muat !== undefined) {
                    kotaMuat = det.kota_muat;
                }
                
                // Ambil kota_bongkar dari detail terakhir
                if (det.kota_bongkar !== null && det.kota_bongkar !== undefined) {
                    kotaBongkar = det.kota_bongkar;
                }
            }

            result.push({
                no: startIndex + index,
                idmp: item.id_mp,
                sp: item.msp,
                salesName: item.user == null ? "-" : item.user.nama_lengkap,
                gl: "-",
                asm: "-",
                mgr: "-",
                kacab: "-",
                amd: "-",
                perusahaan: item.customer?.nama_perusahaan,
                kendaraan: kendaraan[0] == null ? "-" : kendaraan[0],
                service: item.service,
                pickupDate: core.moment(item.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                approveSales: item.m_status_order?.act_sales,
                dateApproveSales: core.moment(item.m_status_order?.tgl_act_1).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_1).format('YYYY-MM-DD HH:mm:ss'),
                approveAct: item.m_status_order?.act_akunting,
                dateApproveAct: core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_3).format('YYYY-MM-DD HH:mm:ss'),
                approveOps: item.m_status_order?.kendaraan_operasional,
                idops: item.m_status_order?.operasional,
                operationalName: item.m_status_order?.user == null ? "" : item.m_status_order.user.nama_lengkap,
                dateApproveOps: core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                approvePurch: item.m_status_order?.kendaraan_purchasing,
                dateApprovePurch: core.moment(item.m_status_order?.tgl_act_5).format('YYYY-MM-DD HH:mm:ss') == "1970-01-01 07:00:00" ? "Invalid Date" : core.moment(item.m_status_order?.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                new: item.new,
                destination: (kotaMuat == null || kotaMuat == "" ? "kota muat belum diinput" : kotaMuat) + " " + (kotaBongkar == null || kotaBongkar == "" ? "kota bongkar belum diinput" : kotaBongkar)
            });
        }

        // Format output sesuai yang diinginkan
        return res.json({
            status: { code: 200, message: 'Success get Data' },
            data: {
                totalData: totalData,
                totalPage: Math.ceil(totalData / itemsPerPage),
                limit: limit,
                currentPage: currentPage,
                canLoadMore: totalData > currentPage * limit,
                order: result
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// exports.getSpListAll2 = async (req, res) => {
//     try {
//         // Relasi antar model
//         models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
//         models.users.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench' });
//         models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
//         models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//         models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//         models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });

//         const itemsPerPage = Number(req.query.limit) || 20;
//         const currentPage = Number(req.query.page) || 1;
//         const offset = (currentPage - 1) * itemsPerPage;

//         // Kondisi query berat (untuk findAll)
//         const fullQueryConditions = {
//             ...(req.query.customerId && { id_customer: req.query.customerId }),
//             ...(req.query.sales && { id_sales: req.query.sales }),
//             ...(req.query.tgl_pickup && { tgl_pickup: req.query.tgl_pickup }),
//             ...(req.query.statusSP && { status: req.query.statusSP }),
//             ...(req.query.keyword && {
//                 [Op.or]: [{ msp: { [Op.like]: `%${req.query.keyword}%` } }]
//             })
//         };

//         // Kondisi query ringan (untuk count)
//         const lightQueryConditions = {
//             ...(req.query.customerId && { id_customer: req.query.customerId }),
//             ...(req.query.sales && { id_sales: req.query.sales }),
//             ...(req.query.tgl_pickup && { tgl_pickup: req.query.tgl_pickup }),
//             ...(req.query.statusSP && { status: req.query.statusSP })
//             // keyword tidak disertakan agar query count tetap ringan
//         };

//         // Hitung total data hanya dengan kondisi ringan
//         const totalData = await models.m_pengadaan.count({ where: lightQueryConditions });

//         // Data utama dengan relasi
//         const getData = await models.m_pengadaan.findAll({
//             where: fullQueryConditions,
//             limit: itemsPerPage,
//             offset,
//             order: [['id_mp', 'desc']],
//             include: [
//                 {
//                     model: models.users,
//                     attributes: ['nama_lengkap'],
//                     required: false,
//                     where: {
//                         ...(req.query.buId && { id_bu: req.query.buId }),
//                     },
//                     include: {
//                         model: models.m_bu_brench,
//                         attributes: ['code_bu_brench'],
//                         required: false,
//                         where: {
//                             ...(req.query.codeBrench && { code_bu_brench: req.query.codeBrench })
//                         }
//                     }
//                 },
//                 { model: models.customer, required: false },
//                 { model: models.m_pengadaan_detail, required: false },
//                 {
//                     model: models.m_status_order,
//                     required: false,
//                     include: [{ model: models.users, required: false }]
//                 }
//             ]
//         });

//         // Ambil ID alamat terbatas (maks 100 untuk hindari query berat)
//         const allIdAlamat = new Set();
//         getData.forEach(item => {
//             item.m_pengadaan_details.forEach(d => {
//                 if (d.id_almuat) allIdAlamat.add(d.id_almuat);
//                 if (d.id_albongkar) allIdAlamat.add(d.id_albongkar);
//             });
//         });

//         const alamatIds = Array.from(allIdAlamat).slice(0, 100); // batasi ID alamat
//         const alamatData = await models.alamat.findAll({
//             where: { id: alamatIds },
//             raw: true
//         });

//         const alamatMap = {};
//         alamatData.forEach(a => { alamatMap[a.id] = a; });

//         const startIndex = offset + 1;

//         const result = getData.map((item, index) => {
//             const bongkar = item.m_pengadaan_details.map(i => i.id_albongkar);
//             const muat = item.m_pengadaan_details.map(i => i.id_almuat);
//             const kendaraan = item.m_pengadaan_details.map(i => i.kendaraan);

//             const getBongkar = alamatMap[bongkar.at(-1)] || null;
//             const getMuat = alamatMap[muat[0]] || null;

//             return {
//                 no: startIndex + index,
//                 idmp: item.id_mp,
//                 sp: item.msp,
//                 salesName: item.user?.nama_lengkap || '-',
//                 gl: '-',
//                 asm: '-',
//                 mgr: '-',
//                 kacab: '-',
//                 amd: '-',
//                 perusahaan: item.customer?.nama_perusahaan || '-',
//                 kendaraan: kendaraan[0] || '-',
//                 service: item.service,
//                 pickupDate: item.tgl_pickup
//                     ? core.moment(item.tgl_pickup).format('YYYY-MM-DD HH:mm:ss')
//                     : null,
//                 approveSales: item.m_status_order?.act_sales,
//                 dateApproveSales: item.m_status_order?.tgl_act_1
//                     ? core.moment(item.m_status_order.tgl_act_1).format('YYYY-MM-DD HH:mm:ss')
//                     : null,
//                 approveAct: item.m_status_order?.act_akunting,
//                 dateApproveAct: item.m_status_order?.tgl_act_3
//                     ? core.moment(item.m_status_order.tgl_act_3).format('YYYY-MM-DD HH:mm:ss')
//                     : null,
//                 approveOps: item.m_status_order?.kendaraan_operasional,
//                 idops: item.m_status_order?.operasional,
//                 operationalName: item.m_status_order?.user?.nama_lengkap || '',
//                 dateApproveOps: item.m_status_order?.tgl_act_4
//                     ? core.moment(item.m_status_order.tgl_act_4).format('YYYY-MM-DD HH:mm:ss')
//                     : null,
//                 approvePurch: item.m_status_order?.kendaraan_purchasing,
//                 dateApprovePurch: item.m_status_order?.tgl_act_5
//                     ? core.moment(item.m_status_order.tgl_act_5).format('YYYY-MM-DD HH:mm:ss')
//                     : null,
//                 destination: `${getMuat?.kota || '-'} ${getBongkar?.kota || '-'}`
//             };
//         });

//         return res.json({
//             status: { code: 200, message: 'Success get Data' },
//             data: {
//                 totalData,
//                 totalPage: Math.ceil(totalData / itemsPerPage),
//                 limit: itemsPerPage,
//                 currentPage,
//                 canLoadMore: totalData > currentPage * itemsPerPage,
//                 order: result
//             }
//         });

//     } catch (error) {
//         console.error('❌ getSpListAll2 error:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


exports.getSpListAllDetail_vico = async (req, res) => {
    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        // models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        if (!models.users.associations.brench) {
            models.users.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench', as: 'brench' });
        }
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });
        if (!models.alamat.associations.m_wil_provinsi) {
            models.alamat.belongsTo(models.m_wil_provinsi, { targetKey: 'id_provinsi', foreignKey: 'id_provinsi' });
        }
        models.m_pengadaan_detail.belongsTo(models.kendaraan_jenis, { targetKey: 'nama_kendaraan_jenis', foreignKey: 'kendaraan' });
        models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_tarif_customer', foreignKey: 'id_price_customer' });

        // models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_price_customer', foreignKey: 'id_price_customer' });
        // models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_muat_kota', foreignKey: 'id_tujuan_kota' });

        if (!models.m_tarif_customer.associations.kotaAsal) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_customer.associations.kotaTujuan) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }
        // if (!models.m_pengadaan.associations.gl) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_gl', as: 'gl' });
        // }
        // if (!models.m_pengadaan.associations.asm) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_asm', as: 'asm' });
        // }
        // if (!models.m_pengadaan.associations.mgr) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_mgr', as: 'mgr' });
        // }
        // if (!models.m_pengadaan.associations.kacab) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_kacab', as: 'kacab' });
        // }
        // if (!models.m_pengadaan.associations.amd) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_amd', as: 'amd' });
        // }


        // models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'nama_kendaraan_jenis', foreignKey: 'kendaraan' });






        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )
        if (getUser) {
            const getDetail = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: req.query.idmp
                    },
                    group: ['id_mpd'],
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
                                        model: models.users,
                                        include: [
                                            {
                                                model: models.m_bu_brench,
                                                as: 'brench',
                                                attributes: ['wilayah'],
                                                required: false
                                            }
                                        ]
                                    },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'gl',
                                    //     attributes: ['fullname']
                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'asm',
                                    //     attributes: ['fullname']
                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'mgr',
                                    //     attributes: ['fullname']

                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'kacab',
                                    //     attributes: ['fullname']

                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'amd',
                                    //     attributes: ['fullname']

                                    // },
                                ]

                        },
                        {
                            model: models.m_sm,
                            // required: false
                        },
                        {
                            model: models.alamat,
                            required: true
                        },
                        {
                            model: models.kendaraan_jenis,
                            // required: false
                        },
                        {
                            model: models.m_tarif_customer,
                            include: [
                                {
                                    model: models.m_wil_kota,
                                    as: 'kotaAsal'
                                },
                                {
                                    model: models.m_wil_kota,
                                    as: 'kotaTujuan'
                                },
                            ]
                        }
                    ]
                }
            )




            // const getMuat = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idMuat
            //         },
            //         attributes: ['kota']
            //     }
            // )
            // const getBongkar = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idBongkar
            //         },
            //         attributes: ['kota']
            //     }


            // )
            // console.log("🚀 ~ file: sp.controller.js:188 ~ exports.getSpDetail= ~ getDetail:", getDetail.id_almuat)
            const getPengadaan = await models.m_pengadaan.findAll(
                {
                    where: {
                        id_mp: req.query.idmp
                    },
                    include: [
                        {
                            model: models.users,
                            include: [
                                {
                                    model: models.m_bu_brench,
                                    as: 'brench',
                                    attributes: ['wilayah'],
                                    required: false
                                }
                            ]
                        },

                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'gl',
                        //     attributes: ['fullname']
                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'asm',
                        //     attributes: ['fullname']
                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'mgr',
                        //     attributes: ['fullname']

                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'kacab',
                        //     attributes: ['fullname']

                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'amd',
                        //     attributes: ['fullname']

                        // },

                    ]
                }
            )
            const getAlamat = await models.m_pengadaan_detail.findAll(
                {
                    group: ['id_almuat'],
                    where: {
                        id_mp: req.query.idmp
                    }
                }
            )

            const idcustomer = getPengadaan.map((i) => i.id_customer)

            const getCustomer = await models.customer.findAll(
                {
                    where: {
                        id_customer: idcustomer
                    }
                }
            )

            const getAlamatInvoice = await models.customer_npwp.findAll(
                {
                    where: {
                        customer_id: idcustomer
                    }


                }
            )


            if (getDetail) {
                const getPrice = getDetail.map((i) => i.harga)
                const getPriceBerat = getDetail.map((i) => i.berat)
                // console.log("🚀 ~ file: sp.controller.js:4990 ~ exports.getSpListAllDetail= ~ getPrice:", getPrice)
                // const getSubPrice = getDetail.map((i) => i.harga[0])
                const idmp = (getPengadaan.map((i) => i.id_mp) != '' ? getPengadaan.map((i) => i.id_mp) : getDetail.map((i) => i.m_pengadaan.id_mp));
                const noSpk = (getPengadaan.map((i) => i.mspk) != '' ? getPengadaan.map((i) => i.mspk) : getDetail.map((i) => i.m_pengadaan.mspk));
                const noSp = (getPengadaan.map((i) => i.msp) != '' ? getPengadaan.map((i) => i.msp) : getDetail.map((i) => i.m_pengadaan.msp));
                const memo = (getPengadaan.map((i) => i.memo) != '' ? getPengadaan.map((i) => i.memo) : getDetail.map((i) => i.m_pengadaan.memo));
                const hargaTotal = (getPengadaan.map((i) => i.biaya_jalan) != '' ? getPengadaan.map((i) => i.biaya_jalan) : getPengadaan.map((i) => i.biaya_jalan));
                const melTotal = (getPengadaan.map((i) => i.biaya_mel) != '' ? getPengadaan.map((i) => i.biaya_mel) : getPengadaan.map((i) => i.biaya_mel));
                const biayaLainTotal = (getPengadaan.map((i) => i.biaya_lain) != '' ? getPengadaan.map((i) => i.biaya_lain) : getPengadaan.map((i) => i.biaya_lain));
                const biayaMultimuatTotal = (getPengadaan.map((i) => i.biaya_multi_muat) != '' ? getPengadaan.map((i) => i.biaya_multi_muat) : getPengadaan.map((i) => i.biaya_multi_muat));
                const hargaSelanjutnyaTotal = (getPengadaan.map((i) => i.harga_selanjutnya) != '' ? getPengadaan.map((i) => i.harga_selanjutnya) : getPengadaan.map((i) => i.harga_selanjutnya));
                const service = (getPengadaan.map((i) => i.service) != '' ? getPengadaan.map((i) => i.service) : getDetail.map((i) => i.m_pengadaan.service));

                const orderDate = (getPengadaan.map((i) => i.tgl_order) != '0000-00-00 00:00:00' ? getPengadaan.map((i) => core.moment(i.tgl_order).format("DD-MM-YYYY HH:mm:ss")) : getDetail.map((i) => core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY HH:mm:ss")));
                const pickupDate = (getPengadaan.map((i) => i.tgl_pickup) != '0000-00-00 00:00:00' ? getPengadaan.map((i) => core.moment(i.tgl_pickup).format("DD-MM-YYYY HH:mm:ss")) : getDetail.map((i) => core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY HH:mm:ss")));
                const bongkarDate = (getDetail.map((i) => i.tgl_bongkar) != '0000-00-00 00:00:00' ? getDetail.map((i) => core.moment(i.tgl_bongkar).format("DD-MM-YYYY HH:mm:ss")) : '-')
                const jenisBarang = (getPengadaan.map((i) => i.jenis_barang) != '' ? getPengadaan.map((i) => i.jenis_barang) : getDetail.map((i) => i.m_pengadaan.jenis_barang));
                const asuransi = (getPengadaan.map((i) => i.asuransi) != '' ? getPengadaan.map((i) => i.asuransi) : getDetail.map((i) => i.m_pengadaan.asuransi));
                const getGl = getDetail.map((i) => i.m_pengadaan.gl == null ? "-" : i.m_pengadaan.fullname)
                const getAsm = getDetail.map((i) => i.m_pengadaan.asm == null ? "-" : i.m_pengadaan.asm.fullname)
                const getMgr = getDetail.map((i) => i.m_pengadaan.mgr == null ? "-" : i.m_pengadaan.mgr.fullname)
                const getKacab = getDetail.map((i) => i.m_pengadaan.kacab == null ? "-" : i.m_pengadaan.kacab.fullname)
                const getAmd = getDetail.map((i) => i.m_pengadaan.amd == null ? "-" : i.m_pengadaan.amd.fullname)


                const alamaInvoice = (getPengadaan.map((i) => i.alamat_invoice) != '' ? getPengadaan.map((i) => i.alamat_invoice) : getDetail.map((i) => i.m_pengadaan.alamat_invoice));

                const marketing = getPengadaan.map((i) => i.user.nama_lengkap == null ? "-" : i.user.nama_lengkap)
                const branch = getPengadaan.map((i) => i.user?.brench?.wilayah || "-")
                const getService = getPengadaan.map((i) => i.service)
                const telpCustomer = (getCustomer.map((i) => i.telepon) != '' ? getCustomer.map((i) => i.telepon) : getDetail.map((i) => i.m_pengadaan.customer.telepon));
                const customer = (getCustomer.map((i) => i.nama_perusahaan) != '' ? getCustomer.map((i) => i.nama_perusahaan) : getDetail.map((i) => i.m_pengadaan.customer.nama_perusahaan));
                // MOU & Surat Pelayanan fields from customer
                const mouFileArr = getCustomer.map((i) => i.mou_file);
                const mouNumberArr = getCustomer.map((i) => i.mou_number);
                const mouExpiredArr = getCustomer.map((i) => i.mou_expired ? core.moment(i.mou_expired).format('YYYY-MM-DD') : null);
                const suratPelayananArr = getCustomer.map((i) => i.surat_pelayanan);
                const suratPelayananNumberArr = getCustomer.map((i) => i.surat_pelayanan_number);
                const suratPelayananExpiredArr = getCustomer.map((i) => i.surat_pelayanan_expired ? core.moment(i.surat_pelayanan_expired).format('YYYY-MM-DD') : null);
                ///////TOTAL BIAYA\\\\\\\\\\\\\\\\
                const total_muat = getDetail.map((i) => i.harga_muat)
                const total_biayaMuatBongkar = getDetail.map((i) => i.harga_bongkar)
                const total_overtonase = getDetail.map((i) => i.m_pengadaan.overtonase)
                const total_biayaOvertonase = getPengadaan.map((i) => i.biaya_overtonase)
                const total_biayaMultidrop = getPengadaan.map((i) => i.biaya_multi_drop)
                const total_biayaLain = getDetail.map((i) => i.m_pengadaan.biaya_muat_bongkar)
                const total_diskon = getDetail.map((i) => i.m_pengadaan.diskon)
                const total_keseluruhan = getDetail.map((i) => i.m_pengadaan.total_keseluruhan)
                const kotaMuat = getDetail.map((i) => i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaAsal.nama_kota)
                const kotBongkar = getDetail.map((i) => i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaTujuan.nama_kota)

                const totalan = getPrice * getPriceBerat

                // const kedaraanId = getDetail.map((i) => i.m_pengadaan.packing.jenis)
                // const status = getDetail.map((i) => i.m_pengadaan.status == 1 ? "Aktif" : "Cancel")



                const sumMuat = core.sumArray(total_muat)
                const sumBongkar = core.sumArray(total_biayaMuatBongkar)
                const sumOvertonase = total_biayaOvertonase
                const sumMultidrop = total_biayaMultidrop
                const sumBiayaLain = core.sumArray(total_biayaLain)
                const sumBiayaMultiMuat = core.sumArray(biayaMultimuatTotal)
                // const sumBongkar = core.sumArray(total_biayaMuatBongkar) 
                const sumDiscont = core.sumArray(total_diskon)
                const sumBerat = core.sumArray(getPriceBerat)
                const sumMel = core.sumArray(melTotal)
                const sumBiayaLa = core.sumArray(biayaLainTotal)
                const sumHargaSelanjutnya = core.sumArray(hargaSelanjutnyaTotal)
                const sumHarga = core.sumArray(hargaTotal)

                // Hitung total_produk dari m_pengadaan_detail
                const totalProdukArray = getDetail.map((i) => i.total_produk || 0)
                const sumTotalProduk = core.sumArray(totalProdukArray)

                // Hitung total_biaya_tambahan dari semua biaya di m_pengadaan_detail
                const totalBiayaTambahanArray = getDetail.map((i) => {
                    return (i.harga_muat || 0) + 
                           (i.harga_bongkar || 0) + 
                           (i.biaya_overtonase || 0) + 
                           (i.biaya_multimuat || 0) + 
                           (i.biaya_multidrop || 0) + 
                           (i.biaya_mel || 0) + 
                           (i.biaya_tambahan || 0) + 
                           (i.biaya_lain || 0) + 
                           (i.harga_selanjutnya || 0)
                })
                const sumTotalBiayaTambahan = core.sumArray(totalBiayaTambahanArray)

                // Hitung total_diskon (diskonNilai) dari setiap detail
                const diskonNilaiArray = getDetail.map((detail) => {
                    const detailSubtotal = (detail.total_produk || 0) + 
                                          (detail.biaya_overtonase || 0) + 
                                          (detail.harga_muat || 0) + 
                                          (detail.harga_bongkar || 0) + 
                                          (detail.biaya_multidrop || 0) + 
                                          (detail.biaya_lain || 0) + 
                                          (detail.biaya_mel || 0) + 
                                          (detail.biaya_tambahan || 0) + 
                                          (detail.biaya_multimuat || 0) +
                                          (detail.harga_selanjutnya || 0)
                    const diskonPersen = detail.diskon || 0
                    return diskonPersen ? (diskonPersen / 100) * detailSubtotal : 0
                })
                const sumTotalDiskon = Math.round(core.sumArray(diskonNilaiArray))

                // Hitung total_pajak (pajakNilai) dari setiap detail
                const pajakNilaiArray = getDetail.map((detail) => {
                    const detailSubtotal = (detail.total_produk || 0) + 
                                          (detail.biaya_overtonase || 0) + 
                                          (detail.harga_muat || 0) + 
                                          (detail.harga_bongkar || 0) + 
                                          (detail.biaya_multidrop || 0) + 
                                          (detail.biaya_lain || 0) + 
                                          (detail.biaya_mel || 0) + 
                                          (detail.biaya_tambahan || 0) + 
                                          (detail.biaya_multimuat || 0) +
                                          (detail.harga_selanjutnya || 0)
                    const diskonPersen = detail.diskon || 0
                    const diskonNilai = diskonPersen ? (diskonPersen / 100) * detailSubtotal : 0
                    const baseAmount = detailSubtotal - diskonNilai
                    const pajakPersen = detail.pajak || 0
                    return pajakPersen ? (pajakPersen / 100) * baseAmount : 0
                })
                const sumTotalPajak = Math.round(core.sumArray(pajakNilaiArray))

                // const getMuat = await models.alamat.findOne(

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    idmp: idmp[0],
                    jenisBarang: jenisBarang[0],
                    // packing: packing[0],
                    asuransi: asuransi[0],
                    // gl: getGl[0],
                    // asm: getAsm[0],
                    // mgr: getMgr[0],
                    // kacab: getKacab[0],
                    // amd: getAmd[0],

                    gl: "-",
                    asm: "-",
                    mgr: "-",
                    kacab: "-",
                    amd: "-",
                    // status: status[0],
                    spk: noSpk[0],
                    sp: noSp[0],
                    marketing: marketing[0],
                    branch: branch[0],
                    service: service[0],
                    order_date: orderDate[0],
                    pickup_date: pickupDate[0],
                    bongkar_date: bongkarDate[0],
                    alamatInvoice: alamaInvoice[0],
                    telpCustomer: telpCustomer[0],
                    idcustomer: idcustomer[0],
                    mou_file: mouFileArr[0],
                    mou_number: mouNumberArr[0],
                    mou_expired: mouExpiredArr[0],
                    surat_pelayanan: suratPelayananArr[0],
                    surat_pelayanan_number: suratPelayananNumberArr[0],
                    surat_pelayanan_expired: suratPelayananExpiredArr[0],
                    // kotaasal: kotaMuat[0],
                    // kotaBongkar: kotBongkar[0],
                    tarif: sumTotalProduk,
                    total_biaya_tambahan: sumTotalBiayaTambahan,
                    total_diskon: sumTotalDiskon,
                    total_pajak: sumTotalPajak,
                    biayaLain: sumBiayaLa,
                    biayaMel: sumMel,
                    hargaSelanjutnya: sumHargaSelanjutnya,
                    biayaMultiMuat: sumBiayaMultiMuat,
                    biayaTambahan: (getPengadaan.map((i) => i.biaya_tambahan) != '' ? getPengadaan.map((i) => i.biaya_tambahan) : getPengadaan.map((i) => i.biaya_tambahan))[0],
                    customer: customer[0],
                    memo: memo[0],
                    totalMuat: sumMuat,
                    totalBongkar: sumBongkar,
                    totalovertonase: sumOvertonase[0],
                    biayaMultiDrop: sumMultidrop[0],
                    // totalBiayaLain: sumBiayaLain,
                    totalDiskon: sumDiscont,
                    new: (getPengadaan.map((i) => i.new) != '' ? getPengadaan.map((i) => i.new) : getDetail.map((i) => i.m_pengadaan.new))[0],
                    id_oddo: getPengadaan.map((i) => i.id_oddo)[0] || null,


                    // subTotal: service[0] != "Charter" ? core.sumArray(getPrice) * core.sumArray(getPriceBerat) : core.sumArray(getPrice),
                    // Totalprice: sumDiscont == 0 && service[0] == "Charter" ? core.sumArray(getPrice) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain : service[0] != "Charter" ? (core.sumArray(getPrice) * core.sumArray(getPriceBerat) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain) : (core.sumArray(getPrice) * sumDiscont) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain,
                    totalFix: getPengadaan.map((i) => i.total_keseluruhan)[0],
                    alamatInvoiceList: getAlamatInvoice.map((ii) => {
                        sumBiayaLain
                        return {
                            id: ii.npwp_id,
                            npwp: ii.npwp,
                            address_npwp: ii.address_npwp

                        }
                    }),


                    detail: await Promise.all(getAlamat.map(async (i) => {
                        const getPickup = await models.alamat.findOne(
                            {
                                where: {
                                    id: i.id_almuat
                                },
                                include: [
                                    {
                                        model: models.m_wil_provinsi,
                                        attributes: ['nama_provinsi'],
                                        required: false
                                    }
                                ]
                            }
                        );

                        const getTujuan = await models.m_pengadaan_detail.findAll(
                            {
                                where: {
                                    id_mp: idmp[0],
                                    id_almuat: i.id_almuat
                                }
                            }
                        );

                        const getKendaraan = await models.kendaraan.findOne(
                            {
                                where: {
                                    id: i.id_unit
                                }
                            }
                        )
                        const getDriver = await models.m_driver.findOne(
                            {
                                where: {
                                    id: i.id_supir
                                }
                            }
                        )
                        return {
                            idmpd: i.id_mpd,
                            pickupId: getPickup == null ? "" : getPickup.id,
                            pickup: getPickup == null ? "-" : getPickup.alamat + " (PIC: " + getPickup.pic + " - " + getPickup.jabatan + " - " + getPickup.hp + ")",
                            idKendaraan: getKendaraan == null ? "" : getKendaraan.id,
                            nopol: getKendaraan == null ? "" : getKendaraan.no_polisi,
                            driver: getDriver == null ? "" : getDriver.nama,
                            noTelp: getDriver == null ? "" : getDriver.no_telp,

                            tujuan: await Promise.all(getTujuan.map(async (ii) => {
                                const getBongkar = await models.alamat.findOne(
                                    {
                                        where: {
                                            id: ii.id_albongkar
                                        },
                                        include: [
                                            {
                                                model: models.m_wil_provinsi,
                                                attributes: ['nama_provinsi'],
                                                required: false
                                            }
                                        ]
                                    }
                                );

                                const getTarif = await models.m_tarif_customer.findOne(
                                    {
                                        where: {
                                            id_tarif_customer: ii.id_price_customer
                                        }
                                    }
                                );

                                const getSJ = await models.m_sm.findOne(
                                    {
                                        where: {
                                            id_mpd: ii.id_mpd
                                        }
                                    }
                                );
                                // res.send(getSJ)
                                const getShipment = await models.m_shipment.findOne(
                                    {
                                        where: {
                                            id: ii.shipment
                                        }
                                    }
                                )
                                const getKendaraanJenis = await models.kendaraan_jenis.findOne(
                                    {
                                        where: {
                                            nama_kendaraan_jenis: ii.kendaraan,
                                        }
                                    }
                                )

                                const getMitra1 = getSJ ? await models.mitra.findOne(
                                    { 
                                        where: { id_mitra: getSJ.id_mitra_pickup } 
                                    }
                                ) : null;
                                
                                const getMitra2 = getSJ ? await models.mitra.findOne(
                                    { 
                                        where: { id_mitra: getSJ.id_mitra } 
                                    }
                                ) : null;
                                
                                const getMitra3 = getSJ ? await models.mitra.findOne(
                                    { 
                                        where: { id_mitra: getSJ.id_mitra_2 } 
                                    }
                                ) : null;


                                return {
                                    idmpd: ii.id_mpd,
                                    noSJ: getSJ?.msm,
                                    supirSJ1: getSJ == null ? "-" : getSJ.id_driver,
                                    supirSJ2: getSJ == null ? "-" : getSJ.id_driver_2,
                                    supir1: getSJ?.pickup_supir || "-",
                                    supir2: getSJ?.supir || "-",
                                    supir3: getSJ?.supir_2 || "-",
                                    mitraSJ1: getSJ == null ? "-" : getSJ.id_mitra_pickup,
                                    mitraSJ2: getSJ == null ? "-" : getSJ.id_mitra,
                                    mitraSJ3: getSJ == null ? "-" : getSJ.id_mitra_2,
                                    mitra1: getMitra1?.nama_mitra || "-",
                                    mitra2: getMitra2?.nama_mitra || "-",
                                    mitra3: getMitra3?.nama_mitra || "-",
                                    kendaraan1: getSJ?.pickup_kendaraan || "-",
                                    kendaraan2: getSJ?.kendaraan || "-",
                                    kendaraan3: getSJ?.kendaraan_2 || "-",
                                    nopol1: getSJ?.pickup_nopol || "-",
                                    nopol2: getSJ?.nopol || "-",
                                    nopol3: getSJ?.nopol_2 || "-",
                                    kendaraanJenisId: getKendaraanJenis.id_kendaraan_jenis,
                                    kendaraan: ii.kendaraan,
                                    service: getService,
                                    pickupId: getPickup?.id,
                                    pickup: getPickup?.alamat,
                                    destinationId: getBongkar?.id,
                                    destination: getBongkar?.alamat,
                                    cp_penerima_nama: getBongkar?.pic || "-",
                                    cp_pengirim_nama: getPickup?.pic || "-",
                                    kota_penerima: getBongkar?.kota || "-",
                                    kota_pengirim: getPickup?.kota || "-",
                                    nama_pengirim: getPickup?.pic || "-",
                                    provinsi_penerima: getBongkar?.m_wil_provinsi?.nama_provinsi || "-",
                                    provinsi_pengirim: getPickup?.m_wil_provinsi?.nama_provinsi || "-",
                                    via: ii.via,
                                    shipmentID: ii.shipment,
                                    shipmentName: getShipment.shipment,
                                    id_kota_muat: ii?.id_kota_muat,
                                    id_kota_bongkar: ii?.id_kota_bongkar,
                                    item: ii.nama_barang,
                                    qty: ii.qty,
                                    koli: ii.koli,
                                    berat: ii.berat,
                                    ikat: ii.ikat,
                                    Price: ii.harga,
                                    biayaLain: ii.biaya_lain,
                                    biayaMel: ii.biaya_mel,
                                    harga_type: ii.harga_type,
                                    biaya_multi_drop: ii.biaya_multidrop,
                                    max_tonase: ii.max_tonase,
                                    biaya_overtonase: ii.biaya_overtonase,
                                    harga_selanjutnya: ii.harga_selanjutnya,
                                    biaya_tambahan: ii.biaya_tambahan,
                                    biaya_multimuat: ii.biaya_multimuat,
                                    // harga: ii.harga,
                                    harga_muat: ii.harga_muat,
                                    harga_bongkar: ii.harga_bongkar,
                                    diskon: ii.diskon,
                                    unitId: ii.id_unit,
                                    supirId: ii.id_supir,
                                    total: ii.total,
                                    // totalBiayaRetail: (ii.harga * ii.berat) + ii.harga_bongkar + ii.harga_muat,
                                    // totalBiayaCharter: ii.harga + ii.harga_bongkar + ii.harga_muat,
                                    // biaya_jalan: getTarif?.biaya_jalan,

                                    // supirSM2:ii.m_sm.id_unit_2 == null ?"-":ii.m_sm.id_unit_2,

                                }

                            })),


                            // destination: getBongkar.alamat,
                            // via: i.via,
                            // item: i.nama_barang,
                            // qty: i.qty,
                            // berat: i.berat,  
                            // Price: i.harga,
                            // harga_type: i.harga_type,
                            // harga: i.harga,
                            // harga_muat: i.harga_muat,
                            // harga_bongkar: i.harga_bongkar,
                            // diskon: i.diskon,
                            // total: i.total

                        }



                    })),
                    // const totalSemua = results.reduce((total, item) => total + item.total, 0);


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

exports.updateIdOddo = async (req, res) => {
    let output = {};
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            if (!req.body.id_mp) {
                output = {
                    status: {
                        code: 400,
                        message: 'Field id_mp wajib diisi'
                    }
                }
            } else {
                const updData = await models.m_pengadaan.update(
                    {
                        id_oddo: req.body.id_oddo || null
                    },
                    {
                        where: {
                            id_mp: req.body.id_mp
                        }
                    }
                )
                if (updData) {
                    output = {
                        status: {
                            code: 200,
                            message: "Success update id_oddo"
                        }
                    }
                } else {
                    output = {
                        status: {
                            code: 404,
                            message: "Data tidak ditemukan"
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

exports.getSpListAllDetail = async (req, res) => {
    try {

        models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

        models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        // models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });
        models.m_pengadaan_detail.belongsTo(models.kendaraan_jenis, { targetKey: 'nama_kendaraan_jenis', foreignKey: 'kendaraan' });
        models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_tarif_customer', foreignKey: 'id_price_customer' });

        // models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_price_customer', foreignKey: 'id_price_customer' });
        // models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_muat_kota', foreignKey: 'id_tujuan_kota' });

        if (!models.users.associations.brench) {
            models.users.belongsTo(models.m_bu_brench, { targetKey: 'id_bu_brench', foreignKey: 'id_bu_brench', as: 'brench' });
        }
        if (!models.alamat.associations.m_wil_provinsi) {
            models.alamat.belongsTo(models.m_wil_provinsi, { targetKey: 'id_provinsi', foreignKey: 'id_provinsi' });
        }
        if (!models.m_tarif_customer.associations.kotaAsal) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
        }
        if (!models.m_tarif_customer.associations.kotaTujuan) {
            models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
        }
        // if (!models.m_pengadaan.associations.gl) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_gl', as: 'gl' });
        // }
        // if (!models.m_pengadaan.associations.asm) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_asm', as: 'asm' });
        // }
        // if (!models.m_pengadaan.associations.mgr) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_mgr', as: 'mgr' });
        // }
        // if (!models.m_pengadaan.associations.kacab) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_kacab', as: 'kacab' });
        // }
        // if (!models.m_pengadaan.associations.amd) {
        //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_amd', as: 'amd' });
        // }


        // models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'nama_kendaraan_jenis', foreignKey: 'kendaraan' });






        const getUser = await models.users.findOne(
            {
                id: req.user.id
            }
        )
        if (getUser) {
            const getDetail = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: req.query.idmp
                    },
                    group: ['id_mpd'],
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
                                        model: models.users,
                                        include: [
                                            {
                                                model: models.m_bu_brench,
                                                as: 'brench',
                                                attributes: ['wilayah'],
                                                required: false
                                            }
                                        ]
                                    },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'gl',
                                    //     attributes: ['fullname']
                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'asm',
                                    //     attributes: ['fullname']
                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'mgr',
                                    //     attributes: ['fullname']

                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'kacab',
                                    //     attributes: ['fullname']

                                    // },
                                    // {
                                    //     model: models.m_bu_employee,
                                    //     as: 'amd',
                                    //     attributes: ['fullname']

                                    // },
                                ]

                        },
                        {
                            model: models.m_sm,
                            // required: false
                        },
                        {
                            model: models.alamat,
                            required: true
                        },
                        {
                            model: models.kendaraan_jenis,
                            // required: false
                        },
                        {
                            model: models.m_tarif_customer,
                            include: [
                                {
                                    model: models.m_wil_kota,
                                    as: 'kotaAsal'
                                },
                                {
                                    model: models.m_wil_kota,
                                    as: 'kotaTujuan'
                                },
                            ]
                        }
                    ]
                }
            )




            // const getMuat = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idMuat
            //         },
            //         attributes: ['kota']
            //     }
            // )
            // const getBongkar = await models.alamat.findOne(
            //     {
            //         where: {
            //             id: req.query.idBongkar
            //         },
            //         attributes: ['kota']
            //     }


            // )
            // console.log("🚀 ~ file: sp.controller.js:188 ~ exports.getSpDetail= ~ getDetail:", getDetail.id_almuat)
            const getPengadaan = await models.m_pengadaan.findAll(
                {
                    where: {
                        id_mp: req.query.idmp
                    },
                    include: [
                        {
                            model: models.users,
                            include: [
                                {
                                    model: models.m_bu_brench,
                                    as: 'brench',
                                    attributes: ['wilayah'],
                                    required: false
                                }
                            ]
                        },

                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'gl',
                        //     attributes: ['fullname']
                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'asm',
                        //     attributes: ['fullname']
                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'mgr',
                        //     attributes: ['fullname']

                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'kacab',
                        //     attributes: ['fullname']

                        // },
                        // {
                        //     model: models.m_bu_employee,
                        //     as: 'amd',
                        //     attributes: ['fullname']

                        // },

                    ]
                }
            )
            const getAlamat = await models.m_pengadaan_detail.findAll(
                {
                    group: ['id_almuat'],
                    where: {
                        id_mp: req.query.idmp
                    }
                }
            )

            const idcustomer = getPengadaan.map((i) => i.id_customer)

            const getCustomer = await models.customer.findAll(
                {
                    where: {
                        id_customer: idcustomer
                    }
                }
            )

            const getAlamatInvoice = await models.customer_npwp.findAll(
                {
                    where: {
                        customer_id: idcustomer
                    }


                }
            )


            if (getDetail) {
                const getPrice = getDetail.map((i) => i.harga)
                const getPriceBerat = getDetail.map((i) => i.berat)
                // console.log("🚀 ~ file: sp.controller.js:4990 ~ exports.getSpListAllDetail= ~ getPrice:", getPrice)
                // const getSubPrice = getDetail.map((i) => i.harga[0])
                const idmp = (getPengadaan.map((i) => i.id_mp) != '' ? getPengadaan.map((i) => i.id_mp) : getDetail.map((i) => i.m_pengadaan.id_mp));
                const noSpk = (getPengadaan.map((i) => i.mspk) != '' ? getPengadaan.map((i) => i.mspk) : getDetail.map((i) => i.m_pengadaan.mspk));
                const noSp = (getPengadaan.map((i) => i.msp) != '' ? getPengadaan.map((i) => i.msp) : getDetail.map((i) => i.m_pengadaan.msp));
                const memo = (getPengadaan.map((i) => i.memo) != '' ? getPengadaan.map((i) => i.memo) : getDetail.map((i) => i.m_pengadaan.memo));
                // Ambil nilai pertama karena biaya_jalan sudah merupakan total dari semua detail, tidak perlu dijumlahkan
                const hargaTotal = getPengadaan.length > 0 ? (getPengadaan[0].biaya_jalan || 0) : 0;
                const melTotal = (getPengadaan.map((i) => i.biaya_mel) != '' ? getPengadaan.map((i) => i.biaya_mel) : getPengadaan.map((i) => i.biaya_mel));
                const biayaLainTotal = (getPengadaan.map((i) => i.biaya_lain) != '' ? getPengadaan.map((i) => i.biaya_lain) : getPengadaan.map((i) => i.biaya_lain));
                const biayaMultimuatTotal = (getPengadaan.map((i) => i.biaya_multi_muat) != '' ? getPengadaan.map((i) => i.biaya_multi_muat) : getPengadaan.map((i) => i.biaya_multi_muat));
                const hargaSelanjutnyaTotal = (getPengadaan.map((i) => i.harga_selanjutnya) != '' ? getPengadaan.map((i) => i.harga_selanjutnya) : getPengadaan.map((i) => i.harga_selanjutnya));
                const service = (getPengadaan.map((i) => i.service) != '' ? getPengadaan.map((i) => i.service) : getDetail.map((i) => i.m_pengadaan.service));

                const orderDate = (getPengadaan.map((i) => i.tgl_order) != '0000-00-00 00:00:00' ? getPengadaan.map((i) => core.moment(i.tgl_order).format("DD-MM-YYYY HH:mm:ss")) : getDetail.map((i) => core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY HH:mm:ss")));
                const pickupDate = (getPengadaan.map((i) => i.tgl_pickup) != '0000-00-00 00:00:00' ? getPengadaan.map((i) => core.moment(i.tgl_pickup).format("DD-MM-YYYY HH:mm:ss")) : getDetail.map((i) => core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY HH:mm:ss")));
                const bongkarDate = (getDetail.map((i) => i.tgl_bongkar) != '0000-00-00 00:00:00' ? getDetail.map((i) => core.moment(i.tgl_bongkar).format("DD-MM-YYYY HH:mm:ss")) : '-')
                const jenisBarang = (getPengadaan.map((i) => i.jenis_barang) != '' ? getPengadaan.map((i) => i.jenis_barang) : getDetail.map((i) => i.m_pengadaan.jenis_barang));
                const asuransi = (getPengadaan.map((i) => i.asuransi) != '' ? getPengadaan.map((i) => i.asuransi) : getDetail.map((i) => i.m_pengadaan.asuransi));
                const getGl = getDetail.map((i) => i.m_pengadaan.gl == null ? "-" : i.m_pengadaan.fullname)
                const getAsm = getDetail.map((i) => i.m_pengadaan.asm == null ? "-" : i.m_pengadaan.asm.fullname)
                const getMgr = getDetail.map((i) => i.m_pengadaan.mgr == null ? "-" : i.m_pengadaan.mgr.fullname)
                const getKacab = getDetail.map((i) => i.m_pengadaan.kacab == null ? "-" : i.m_pengadaan.kacab.fullname)
                const getAmd = getDetail.map((i) => i.m_pengadaan.amd == null ? "-" : i.m_pengadaan.amd.fullname)


                const alamaInvoice = (getPengadaan.map((i) => i.alamat_invoice) != '' ? getPengadaan.map((i) => i.alamat_invoice) : getDetail.map((i) => i.m_pengadaan.alamat_invoice));

                const marketing = getPengadaan.map((i) => i.user.nama_lengkap == null ? "-" : i.user.nama_lengkap)
                const getService = getPengadaan.map((i) => i.service)
                const telpCustomer = (getCustomer.map((i) => i.telepon) != '' ? getCustomer.map((i) => i.telepon) : getDetail.map((i) => i.m_pengadaan.customer.telepon));
                const customer = (getCustomer.map((i) => i.nama_perusahaan) != '' ? getCustomer.map((i) => i.nama_perusahaan) : getDetail.map((i) => i.m_pengadaan.customer.nama_perusahaan));
                // MOU & Surat Pelayanan fields from customer
                const mouFileArr = getCustomer.map((i) => i.mou_file);
                const mouNumberArr = getCustomer.map((i) => i.mou_number);
                const mouExpiredArr = getCustomer.map((i) => i.mou_expired ? core.moment(i.mou_expired).format('YYYY-MM-DD') : null);
                const suratPelayananArr = getCustomer.map((i) => i.surat_pelayanan);
                const suratPelayananNumberArr = getCustomer.map((i) => i.surat_pelayanan_number);
                const suratPelayananExpiredArr = getCustomer.map((i) => i.surat_pelayanan_expired ? core.moment(i.surat_pelayanan_expired).format('YYYY-MM-DD') : null);
                ///////TOTAL BIAYA\\\\\\\\\\\\\\\\
                const total_muat = getDetail.map((i) => i.harga_muat)
                const total_biayaMuatBongkar = getDetail.map((i) => i.harga_bongkar)
                const total_overtonase = getDetail.map((i) => i.m_pengadaan.overtonase)
                const total_biayaOvertonase = getPengadaan.map((i) => i.biaya_overtonase)
                const total_biayaMultidrop = getPengadaan.map((i) => i.biaya_multi_drop)
                const total_biayaLain = getDetail.map((i) => i.m_pengadaan.biaya_muat_bongkar)
                const total_diskon = getDetail.map((i) => i.m_pengadaan.diskon)
                const total_keseluruhan = getDetail.map((i) => i.m_pengadaan.total_keseluruhan)
                const kotaMuat = getDetail.map((i) => i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaAsal.nama_kota)
                const kotBongkar = getDetail.map((i) => i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaTujuan.nama_kota)

                const totalan = getPrice * getPriceBerat

                // const kedaraanId = getDetail.map((i) => i.m_pengadaan.packing.jenis)
                // const status = getDetail.map((i) => i.m_pengadaan.status == 1 ? "Aktif" : "Cancel")



                const sumMuat = core.sumArray(total_muat)
                const sumBongkar = core.sumArray(total_biayaMuatBongkar)
                const sumOvertonase = total_biayaOvertonase
                const sumMultidrop = total_biayaMultidrop
                const sumBiayaLain = core.sumArray(total_biayaLain)
                const sumBiayaMultiMuat = core.sumArray(biayaMultimuatTotal)
                // const sumBongkar = core.sumArray(total_biayaMuatBongkar) 
                const sumDiscont = core.sumArray(total_diskon)
                const sumBerat = core.sumArray(getPriceBerat)
                const sumMel = core.sumArray(melTotal)
                const sumBiayaLa = core.sumArray(biayaLainTotal)
                const sumHargaSelanjutnya = core.sumArray(hargaSelanjutnyaTotal)
                // hargaTotal sudah merupakan nilai tunggal (bukan array), jadi langsung gunakan nilainya
                const sumHarga = hargaTotal

                // const getMuat = await models.alamat.findOne(

                output = {
                    status: {
                        code: 200,
                        message: 'Success get Data'
                    },
                    idmp: idmp[0],
                    jenisBarang: jenisBarang[0],
                    // packing: packing[0],
                    asuransi: asuransi[0],
                    // gl: getGl[0],
                    // asm: getAsm[0],
                    // mgr: getMgr[0],
                    // kacab: getKacab[0],
                    // amd: getAmd[0],

                    gl: "-",
                    asm: "-",
                    mgr: "-",
                    kacab: "-",
                    amd: "-",
                    // status: status[0],
                    spk: noSpk[0],
                    sp: noSp[0],
                    marketing: marketing[0],
                    service: service[0],
                    order_date: orderDate[0],
                    pickup_date: pickupDate[0],
                    bongkar_date: bongkarDate[0],
                    alamatInvoice: alamaInvoice[0],
                    telpCustomer: telpCustomer[0],
                    idcustomer: idcustomer[0],
                    mou_file: mouFileArr[0],
                    mou_number: mouNumberArr[0],
                    mou_expired: mouExpiredArr[0],
                    surat_pelayanan: suratPelayananArr[0],
                    surat_pelayanan_number: suratPelayananNumberArr[0],
                    surat_pelayanan_expired: suratPelayananExpiredArr[0],
                    // kotaasal: kotaMuat[0],
                    // kotaBongkar: kotBongkar[0],
                    tarif: sumHarga,
                    biayaLain: sumBiayaLa,
                    biayaMel: sumMel,
                    hargaSelanjutnya: sumHargaSelanjutnya,
                    biayaMultiMuat: sumBiayaMultiMuat,
                    biayaTambahan: (getPengadaan.map((i) => i.biaya_tambahan) != '' ? getPengadaan.map((i) => i.biaya_tambahan) : getPengadaan.map((i) => i.biaya_tambahan))[0],
                    customer: customer[0],
                    memo: memo[0],
                    totalMuat: sumMuat,
                    totalBongkar: sumBongkar,
                    totalovertonase: sumOvertonase[0],
                    biayaMultiDrop: sumMultidrop[0],
                    // totalBiayaLain: sumBiayaLain,
                    totalDiskon: sumDiscont,
                    new: (getPengadaan.map((i) => i.new) != '' ? getPengadaan.map((i) => i.new) : getDetail.map((i) => i.m_pengadaan.new))[0],


                    // subTotal: service[0] != "Charter" ? core.sumArray(getPrice) * core.sumArray(getPriceBerat) : core.sumArray(getPrice),
                    Totalprice: sumDiscont == 0 && service[0] == "Charter" ? core.sumArray(getPrice) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain : service[0] != "Charter" ? (core.sumArray(getPrice) * core.sumArray(getPriceBerat) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain) : (core.sumArray(getPrice) * sumDiscont) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain,
                    totalFix: getPengadaan.map((i) => i.total_keseluruhan)[0],
                    alamatInvoiceList: getAlamatInvoice.map((ii) => {
                        sumBiayaLain
                        return {
                            id: ii.npwp_id,
                            npwp: ii.npwp,
                            address_npwp: ii.address_npwp

                        }
                    }),


                    detail: await Promise.all(getAlamat.map(async (i) => {
                        const getPickup = await models.alamat.findOne(
                            {
                                where: {
                                    id: i.id_almuat
                                },
                                include: [
                                    {
                                        model: models.m_wil_provinsi,
                                        attributes: ['nama_provinsi'],
                                        required: false
                                    }
                                ]
                            }
                        );

                        const getTujuan = await models.m_pengadaan_detail.findAll(
                            {
                                where: {
                                    id_mp: idmp[0],
                                    id_almuat: i.id_almuat
                                }
                            }
                        );

                        const getKendaraan = await models.kendaraan.findOne(
                            {
                                where: {
                                    id: i.id_unit
                                }
                            }
                        )
                        const getDriver = await models.m_driver.findOne(
                            {
                                where: {
                                    id: i.id_supir
                                }
                            }
                        )
                        return {
                            idmpd: i.id_mpd,
                            pickupId: getPickup == null ? "" : getPickup.id,
                            pickup: getPickup == null ? "-" : getPickup.alamat + " (PIC: " + getPickup.pic + " - " + getPickup.jabatan + " - " + getPickup.hp + ")",
                            idKendaraan: getKendaraan == null ? "" : getKendaraan.id,
                            nopol: getKendaraan == null ? "" : getKendaraan.no_polisi,
                            driver: getDriver == null ? "" : getDriver.nama,
                            noTelp: getDriver == null ? "" : getDriver.no_telp,

                            tujuan: await Promise.all(getTujuan.map(async (ii) => {
                                const getBongkar = await models.alamat.findOne(
                                    {
                                        where: {
                                            id: ii.id_albongkar
                                        },
                                        include: [
                                            {
                                                model: models.m_wil_provinsi,
                                                attributes: ['nama_provinsi'],
                                                required: false
                                            }
                                        ]
                                    }
                                );

                                const getTarif = await models.m_tarif_customer.findOne(
                                    {
                                        where: {
                                            id_tarif_customer: ii.id_price_customer
                                        }
                                    }
                                );

                                const getSJ = await models.m_sm.findOne(
                                    {
                                        where: {
                                            id_mpd: ii.id_mpd
                                        }
                                    }
                                );
                                // res.send(getSJ)
                                const getShipment = await models.m_shipment.findOne(
                                    {
                                        where: {
                                            id: ii.shipment
                                        }
                                    }
                                )
                                const getKendaraanJenis = await models.kendaraan_jenis.findOne(
                                    {
                                        where: {
                                            nama_kendaraan_jenis: ii.kendaraan,
                                        }
                                    }
                                )

                                const getMitra1 = getSJ ? await models.mitra.findOne(
                                    { 
                                        where: { id_mitra: getSJ.id_mitra_pickup } 
                                    }
                                ) : null;
                                
                                const getMitra2 = getSJ ? await models.mitra.findOne(
                                    { 
                                        where: { id_mitra: getSJ.id_mitra } 
                                    }
                                ) : null;
                                
                                const getMitra3 = getSJ ? await models.mitra.findOne(
                                    { 
                                        where: { id_mitra: getSJ.id_mitra_2 } 
                                    }
                                ) : null;


                                return {
                                    idmpd: ii.id_mpd,
                                    noSJ: getSJ?.msm,
                                    supirSJ1: getSJ == null ? "-" : getSJ.id_driver,
                                    supirSJ2: getSJ == null ? "-" : getSJ.id_driver_2,
                                    supir1: getSJ?.pickup_supir || "-",
                                    supir2: getSJ?.supir || "-",
                                    supir3: getSJ?.supir_2 || "-",
                                    mitraSJ1: getSJ == null ? "-" : getSJ.id_mitra_pickup,
                                    mitraSJ2: getSJ == null ? "-" : getSJ.id_mitra,
                                    mitraSJ3: getSJ == null ? "-" : getSJ.id_mitra_2,
                                    mitra1: getMitra1?.nama_mitra || "-",
                                    mitra2: getMitra2?.nama_mitra || "-",
                                    mitra3: getMitra3?.nama_mitra || "-",
                                    kendaraan1: getSJ?.pickup_kendaraan || "-",
                                    kendaraan2: getSJ?.kendaraan || "-",
                                    kendaraan3: getSJ?.kendaraan_2 || "-",
                                    nopol1: getSJ?.pickup_nopol || "-",
                                    nopol2: getSJ?.nopol || "-",
                                    nopol3: getSJ?.nopol_2 || "-",
                                    kendaraanJenisId: getKendaraanJenis == null ? "" : getKendaraanJenis.id_kendaraan_jenis,
                                    kendaraan: ii.kendaraan,
                                    service: getService,
                                    pickupId: getPickup?.id,
                                    pickup: getPickup?.alamat,
                                    destinationId: getBongkar?.id,
                                    destination: getBongkar?.alamat,
                                    via: ii.via,
                                    shipmentID: ii.shipment,
                                    shipmentName: getShipment == null ? "-" : getShipment.shipment,
                                    id_kota_muat: ii?.id_kota_muat,
                                    id_kota_bongkar: ii?.id_kota_bongkar,
                                    item: ii.nama_barang,
                                    qty: ii.qty,
                                    koli: ii.koli,
                                    berat: ii.berat,
                                    ikat: ii.ikat,
                                    Price: ii.harga,
                                    biayaLain: ii.biaya_lain,
                                    biayaMel: ii.biaya_mel,
                                    harga_type: ii.harga_type,
                                    biaya_multi_drop: ii.biaya_multidrop,
                                    max_tonase: ii.max_tonase,
                                    biaya_overtonase: ii.biaya_overtonase,
                                    harga_selanjutnya: ii.harga_selanjutnya,
                                    biaya_tambahan: ii.biaya_tambahan,
                                    biaya_multimuat: ii.biaya_multimuat,
                                    // harga: ii.harga,
                                    harga_muat: ii.harga_muat,
                                    harga_bongkar: ii.harga_bongkar,
                                    diskon: ii.diskon,
                                    unitId: ii.id_unit,
                                    supirId: ii.id_supir,
                                    total: ii.total,
                                    totalBiayaRetail: (ii.harga * ii.berat) + ii.harga_bongkar + ii.harga_muat,
                                    totalBiayaCharter: ii.harga + ii.harga_bongkar + ii.harga_muat,
                                    biaya_jalan: getTarif?.biaya_jalan,

                                    // supirSM2:ii.m_sm.id_unit_2 == null ?"-":ii.m_sm.id_unit_2,

                                }

                            })),


                            // destination: getBongkar.alamat,
                            // via: i.via,
                            // item: i.nama_barang,
                            // qty: i.qty,
                            // berat: i.berat,  
                            // Price: i.harga,
                            // harga_type: i.harga_type,
                            // harga: i.harga,
                            // harga_muat: i.harga_muat,
                            // harga_bongkar: i.harga_bongkar,
                            // diskon: i.diskon,
                            // total: i.total

                        }



                    })),
                    // const totalSemua = results.reduce((total, item) => total + item.total, 0);


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

// exports.getSpListAllDetail = async (req, res) => {
//     try {

//         models.m_pengadaan_detail.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });
//         models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });

//         models.m_pengadaan_detail.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_almuat' });
//         models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
//         models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
//         // models.customer.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_customer' });
//         models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
//         models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });
//         models.m_pengadaan_detail.belongsTo(models.kendaraan_jenis, { targetKey: 'nama_kendaraan_jenis', foreignKey: 'kendaraan' });
//         models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_tarif_customer', foreignKey: 'id_price_customer' });

//         // models.m_pengadaan_detail.belongsTo(models.m_tarif_customer, { targetKey: 'id_price_customer', foreignKey: 'id_price_customer' });
//         // models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_muat_kota', foreignKey: 'id_tujuan_kota' });

//         if (!models.m_tarif_customer.associations.kotaAsal) {
//             models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_muat_kota', as: 'kotaAsal' });
//         }
//         if (!models.m_tarif_customer.associations.kotaTujuan) {
//             models.m_tarif_customer.belongsTo(models.m_wil_kota, { targetKey: 'id_kota', foreignKey: 'id_tujuan_kota', as: 'kotaTujuan' });
//         }
//         // if (!models.m_pengadaan.associations.gl) {
//         //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_gl', as: 'gl' });
//         // }
//         // if (!models.m_pengadaan.associations.asm) {
//         //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_asm', as: 'asm' });
//         // }
//         // if (!models.m_pengadaan.associations.mgr) {
//         //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_mgr', as: 'mgr' });
//         // }
//         // if (!models.m_pengadaan.associations.kacab) {
//         //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_kacab', as: 'kacab' });
//         // }
//         // if (!models.m_pengadaan.associations.amd) {
//         //     models.m_pengadaan.belongsTo(models.m_bu_employee, { targetKey: 'code_employee_position', foreignKey: 'id_amd', as: 'amd' });
//         // }


//         // models.m_pengadaan_detail.belongsTo(models.kendaraan, { targetKey: 'nama_kendaraan_jenis', foreignKey: 'kendaraan' });






//         const getUser = await models.users.findOne(
//             {
//                 id: req.user.id
//             }
//         )
//         if (getUser) {
//             const getDetail = await models.m_pengadaan_detail.findAll(
//                 {
//                     where: {
//                         id_mp: req.query.idmp
//                     },
//                     group: ['id_mpd'],
//                     include: [
//                         {
//                             model: models.m_pengadaan,
//                             required: false,
//                             include:
//                                 [
//                                     {
//                                         model: models.customer,
//                                         include: [
//                                             {
//                                                 model: models.alamat
//                                             },

//                                         ]
//                                     },
//                                     {
//                                         model: models.users
//                                     },
//                                     // {
//                                     //     model: models.m_bu_employee,
//                                     //     as: 'gl',
//                                     //     attributes: ['fullname']
//                                     // },
//                                     // {
//                                     //     model: models.m_bu_employee,
//                                     //     as: 'asm',
//                                     //     attributes: ['fullname']
//                                     // },
//                                     // {
//                                     //     model: models.m_bu_employee,
//                                     //     as: 'mgr',
//                                     //     attributes: ['fullname']

//                                     // },
//                                     // {
//                                     //     model: models.m_bu_employee,
//                                     //     as: 'kacab',
//                                     //     attributes: ['fullname']

//                                     // },
//                                     // {
//                                     //     model: models.m_bu_employee,
//                                     //     as: 'amd',
//                                     //     attributes: ['fullname']

//                                     // },
//                                 ]

//                         },
//                         {
//                             model: models.m_sm,
//                             // required: false
//                         },
//                         {
//                             model: models.alamat,
//                             required: true
//                         },
//                         {
//                             model: models.kendaraan_jenis,
//                             // required: false
//                         },
//                         {
//                             model: models.m_tarif_customer,
//                             include: [
//                                 {
//                                     model: models.m_wil_kota,
//                                     as: 'kotaAsal'
//                                 },
//                                 {
//                                     model: models.m_wil_kota,
//                                     as: 'kotaTujuan'
//                                 },
//                             ]
//                         }
//                     ]
//                 }
//             )




//             // const getMuat = await models.alamat.findOne(
//             //     {
//             //         where: {
//             //             id: req.query.idMuat
//             //         },
//             //         attributes: ['kota']
//             //     }
//             // )
//             // const getBongkar = await models.alamat.findOne(
//             //     {
//             //         where: {
//             //             id: req.query.idBongkar
//             //         },
//             //         attributes: ['kota']
//             //     }


//             // )
//             // console.log("🚀 ~ file: sp.controller.js:188 ~ exports.getSpDetail= ~ getDetail:", getDetail.id_almuat)
//             const getPengadaan = await models.m_pengadaan.findAll(
//                 {
//                     where: {
//                         id_mp: req.query.idmp
//                     },
//                     include: [
//                         {
//                             model: models.users
//                         },

//                         // {
//                         //     model: models.m_bu_employee,
//                         //     as: 'gl',
//                         //     attributes: ['fullname']
//                         // },
//                         // {
//                         //     model: models.m_bu_employee,
//                         //     as: 'asm',
//                         //     attributes: ['fullname']
//                         // },
//                         // {
//                         //     model: models.m_bu_employee,
//                         //     as: 'mgr',
//                         //     attributes: ['fullname']

//                         // },
//                         // {
//                         //     model: models.m_bu_employee,
//                         //     as: 'kacab',
//                         //     attributes: ['fullname']

//                         // },
//                         // {
//                         //     model: models.m_bu_employee,
//                         //     as: 'amd',
//                         //     attributes: ['fullname']

//                         // },

//                     ]
//                 }
//             )
//             const getAlamat = await models.m_pengadaan_detail.findAll(
//                 {
//                     group: ['id_almuat'],
//                     where: {
//                         id_mp: req.query.idmp
//                     }
//                 }
//             )

//             const idcustomer = getPengadaan.map((i) => i.id_customer)

//             const getCustomer = await models.customer.findAll(
//                 {
//                     where: {
//                         id_customer: idcustomer
//                     }
//                 }
//             )

//             const getAlamatInvoice = await models.customer_npwp.findAll(
//                 {
//                     where: {
//                         customer_id: idcustomer
//                     }


//                 }
//             )


//             if (getDetail) {
//                 const getPrice = getDetail.map((i) => i.harga)
//                 const getPriceBerat = getDetail.map((i) => i.berat)
//                 // console.log("🚀 ~ file: sp.controller.js:4990 ~ exports.getSpListAllDetail= ~ getPrice:", getPrice)
//                 // const getSubPrice = getDetail.map((i) => i.harga[0])
//                 const idmp = (getPengadaan.map((i) => i.id_mp) != '' ? getPengadaan.map((i) => i.id_mp) : getDetail.map((i) => i.m_pengadaan.id_mp));
//                 const noSpk = (getPengadaan.map((i) => i.mspk) != '' ? getPengadaan.map((i) => i.mspk) : getDetail.map((i) => i.m_pengadaan.mspk));
//                 const noSp = (getPengadaan.map((i) => i.msp) != '' ? getPengadaan.map((i) => i.msp) : getDetail.map((i) => i.m_pengadaan.msp));
//                 const memo = (getPengadaan.map((i) => i.memo) != '' ? getPengadaan.map((i) => i.memo) : getDetail.map((i) => i.m_pengadaan.memo));
//                 const hargaTotal = (getPengadaan.map((i) => i.biaya_jalan) != '' ? getPengadaan.map((i) => i.biaya_jalan) : getPengadaan.map((i) => i.biaya_jalan));
//                 const melTotal = (getPengadaan.map((i) => i.biaya_mel) != '' ? getPengadaan.map((i) => i.biaya_mel) : getPengadaan.map((i) => i.biaya_mel));
//                 const biayaLainTotal = (getPengadaan.map((i) => i.biaya_lain) != '' ? getPengadaan.map((i) => i.biaya_lain) : getPengadaan.map((i) => i.biaya_lain));
//                 const biayaMultimuatTotal = (getPengadaan.map((i) => i.biaya_multi_muat) != '' ? getPengadaan.map((i) => i.biaya_multi_muat) : getPengadaan.map((i) => i.biaya_multi_muat));
//                 const hargaSelanjutnyaTotal = (getPengadaan.map((i) => i.harga_selanjutnya) != '' ? getPengadaan.map((i) => i.harga_selanjutnya) : getPengadaan.map((i) => i.harga_selanjutnya));
//                 const service = (getPengadaan.map((i) => i.service) != '' ? getPengadaan.map((i) => i.service) : getDetail.map((i) => i.m_pengadaan.service));

//                 const orderDate = (getPengadaan.map((i) => i.tgl_order) != '0000-00-00 00:00:00' ? getPengadaan.map((i) => core.moment(i.tgl_order).format("DD-MM-YYYY HH:mm:ss")) : getDetail.map((i) => core.moment(i.m_pengadaan.tgl_order).format("DD-MM-YYYY HH:mm:ss")));
//                 const pickupDate = (getPengadaan.map((i) => i.tgl_pickup) != '0000-00-00 00:00:00' ? getPengadaan.map((i) => core.moment(i.tgl_pickup).format("DD-MM-YYYY HH:mm:ss")) : getDetail.map((i) => core.moment(i.m_pengadaan.tgl_pickup).format("DD-MM-YYYY HH:mm:ss")));
//                 const bongkarDate = (getDetail.map((i) => i.tgl_bongkar) != '0000-00-00 00:00:00' ? getDetail.map((i) => core.moment(i.tgl_bongkar).format("DD-MM-YYYY HH:mm:ss")) : '-')
//                 const jenisBarang = (getPengadaan.map((i) => i.jenis_barang) != '' ? getPengadaan.map((i) => i.jenis_barang) : getDetail.map((i) => i.m_pengadaan.jenis_barang));
//                 const asuransi = (getPengadaan.map((i) => i.asuransi) != '' ? getPengadaan.map((i) => i.asuransi) : getDetail.map((i) => i.m_pengadaan.asuransi));
//                 const getGl = getDetail.map((i) => i.m_pengadaan.gl == null ? "-" : i.m_pengadaan.fullname)
//                 const getAsm = getDetail.map((i) => i.m_pengadaan.asm == null ? "-" : i.m_pengadaan.asm.fullname)
//                 const getMgr = getDetail.map((i) => i.m_pengadaan.mgr == null ? "-" : i.m_pengadaan.mgr.fullname)
//                 const getKacab = getDetail.map((i) => i.m_pengadaan.kacab == null ? "-" : i.m_pengadaan.kacab.fullname)
//                 const getAmd = getDetail.map((i) => i.m_pengadaan.amd == null ? "-" : i.m_pengadaan.amd.fullname)


//                 const alamaInvoice = (getPengadaan.map((i) => i.alamat_invoice) != '' ? getPengadaan.map((i) => i.alamat_invoice) : getDetail.map((i) => i.m_pengadaan.alamat_invoice));

//                 const marketing = getPengadaan.map((i) => i.user.nama_lengkap == null ? "-" : i.user.nama_lengkap)
//                 const getService = getPengadaan.map((i) => i.service)
//                 const telpCustomer = (getCustomer.map((i) => i.telepon) != '' ? getCustomer.map((i) => i.telepon) : getDetail.map((i) => i.m_pengadaan.customer.telepon));
//                 const customer = (getCustomer.map((i) => i.nama_perusahaan) != '' ? getCustomer.map((i) => i.nama_perusahaan) : getDetail.map((i) => i.m_pengadaan.customer.nama_perusahaan));
//                 ///////TOTAL BIAYA\\\\\\\\\\\\\\\\
//                 const total_muat = getDetail.map((i) => i.harga_muat)
//                 const total_biayaMuatBongkar = getDetail.map((i) => i.harga_bongkar)
//                 const total_overtonase = getDetail.map((i) => i.m_pengadaan.overtonase)
//                 const total_biayaOvertonase = getPengadaan.map((i) => i.biaya_overtonase)
//                 const total_biayaMultidrop = getPengadaan.map((i) => i.biaya_multi_drop)
//                 const total_biayaLain = getDetail.map((i) => i.m_pengadaan.biaya_muat_bongkar)
//                 const total_diskon = getDetail.map((i) => i.m_pengadaan.diskon)
//                 const total_keseluruhan = getDetail.map((i) => i.m_pengadaan.total_keseluruhan)
//                 const kotaMuat = getDetail.map((i) => i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaAsal.nama_kota)
//                 const kotBongkar = getDetail.map((i) => i.m_tarif_customer == null ? "-" : i.m_tarif_customer.kotaTujuan.nama_kota)

//                 const totalan = getPrice * getPriceBerat

//                 // const kedaraanId = getDetail.map((i) => i.m_pengadaan.packing.jenis)
//                 // const status = getDetail.map((i) => i.m_pengadaan.status == 1 ? "Aktif" : "Cancel")



//                 const sumMuat = core.sumArray(total_muat)
//                 const sumBongkar = core.sumArray(total_biayaMuatBongkar)
//                 const sumOvertonase = total_biayaOvertonase
//                 const sumMultidrop = total_biayaMultidrop
//                 const sumBiayaLain = core.sumArray(total_biayaLain)
//                 const sumBiayaMultiMuat = core.sumArray(biayaMultimuatTotal)
//                 // const sumBongkar = core.sumArray(total_biayaMuatBongkar) 
//                 const sumDiscont = core.sumArray(total_diskon)
//                 const sumBerat = core.sumArray(getPriceBerat)
//                 const sumMel = core.sumArray(melTotal)
//                 const sumBiayaLa = core.sumArray(biayaLainTotal)
//                 const sumHargaSelanjutnya = core.sumArray(hargaSelanjutnyaTotal)
//                 const sumHarga = core.sumArray(hargaTotal)

//                 // const getMuat = await models.alamat.findOne(

//                 output = {
//                     status: {
//                         code: 200,
//                         message: 'Success get Data'
//                     },
//                     idmp: idmp[0],
//                     jenisBarang: jenisBarang[0],
//                     // packing: packing[0],
//                     asuransi: asuransi[0],
//                     // gl: getGl[0],
//                     // asm: getAsm[0],
//                     // mgr: getMgr[0],
//                     // kacab: getKacab[0],
//                     // amd: getAmd[0],

//                     gl: "-",
//                     asm: "-",
//                     mgr: "-",
//                     kacab: "-",
//                     amd: "-",
//                     // status: status[0],
//                     spk: noSpk[0],
//                     sp: noSp[0],
//                     marketing: marketing[0],
//                     service: service[0],
//                     order_date: orderDate[0],
//                     pickup_date: pickupDate[0],
//                     bongkar_date: bongkarDate[0],
//                     alamatInvoice: alamaInvoice[0],
//                     telpCustomer: telpCustomer[0],
//                     idcustomer: idcustomer[0],
//                     // kotaasal: kotaMuat[0],
//                     // kotaBongkar: kotBongkar[0],
//                     tarif: sumHarga,
//                     biayaLain: sumBiayaLa,
//                     biayaMel: sumMel,
//                     hargaSelanjutnya: sumHargaSelanjutnya,
//                     biayaMultiMuat: sumBiayaMultiMuat,
//                     biayaTambahan: (getPengadaan.map((i) => i.biaya_tambahan) != '' ? getPengadaan.map((i) => i.biaya_tambahan) : getPengadaan.map((i) => i.biaya_tambahan))[0],
//                     customer: customer[0],
//                     memo: memo[0],
//                     totalMuat: sumMuat,
//                     totalBongkar: sumBongkar,
//                     totalovertonase: sumOvertonase[0],
//                     biayaMultiDrop: sumMultidrop[0],
//                     // totalBiayaLain: sumBiayaLain,
//                     totalDiskon: sumDiscont,


//                     // subTotal: service[0] != "Charter" ? core.sumArray(getPrice) * core.sumArray(getPriceBerat) : core.sumArray(getPrice),
//                     Totalprice: sumDiscont == 0 && service[0] == "Charter" ? core.sumArray(getPrice) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain : service[0] != "Charter" ? (core.sumArray(getPrice) * core.sumArray(getPriceBerat) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain) : (core.sumArray(getPrice) * sumDiscont) + sumMuat + sumBongkar + sumOvertonase + sumMultidrop + sumBiayaLain,
//                     totalFix: getPengadaan.map((i) => i.total_keseluruhan)[0],
//                     alamatInvoiceList: getAlamatInvoice.map((ii) => {
//                         sumBiayaLain
//                         return {
//                             id: ii.npwp_id,
//                             npwp: ii.npwp,
//                             address_npwp: ii.address_npwp

//                         }
//                     }),


//                     detail: await Promise.all(getAlamat.map(async (i) => {
//                         const getPickup = await models.alamat.findOne(
//                             {
//                                 where: {
//                                     id: i.id_almuat
//                                 }
//                             }
//                         );

//                         const getTujuan = await models.m_pengadaan_detail.findAll(
//                             {
//                                 where: {
//                                     id_mp: idmp[0],
//                                     id_almuat: i.id_almuat
//                                 }
//                             }
//                         );

//                         const getKendaraan = await models.kendaraan.findOne(
//                             {
//                                 where: {
//                                     id: i.id_unit
//                                 }
//                             }
//                         )
//                         const getDriver = await models.m_driver.findOne(
//                             {
//                                 where: {
//                                     id: i.id_supir
//                                 }
//                             }
//                         )
//                         return {
//                             idmpd: i.id_mpd,
//                             pickupId: getPickup.id,
//                             pickup: getPickup.alamat + " (PIC: " + getPickup.pic + " - " + getPickup.jabatan + " - " + getPickup.hp + ")",
//                             idKendaraan: getKendaraan == null ? "" : getKendaraan.id,
//                             nopol: getKendaraan == null ? "" : getKendaraan.no_polisi,
//                             driver: getDriver == null ? "" : getDriver.nama,
//                             noTelp: getDriver == null ? "" : getDriver.no_telp,

//                             tujuan: await Promise.all(getTujuan.map(async (ii) => {
//                                 const getBongkar = await models.alamat.findOne(
//                                     {
//                                         where: {
//                                             id: ii.id_albongkar
//                                         }
//                                     }
//                                 );

//                                 const getTarif = await models.m_tarif_customer.findOne(
//                                     {
//                                         where: {
//                                             id_tarif_customer: ii.id_price_customer
//                                         }
//                                     }
//                                 );

//                                 const getSJ = await models.m_sm.findOne(
//                                     {
//                                         where: {
//                                             id_mpd: ii.id_mpd
//                                         }
//                                     }
//                                 );
//                                 // res.send(getSJ)
//                                 const getShipment = await models.m_shipment.findOne(
//                                     {
//                                         where: {
//                                             id: ii.shipment
//                                         }
//                                     }
//                                 )
//                                 const getKendaraanJenis = await models.kendaraan_jenis.findOne(
//                                     {
//                                         where: {
//                                             nama_kendaraan_jenis: ii.kendaraan,
//                                         }
//                                     }
//                                 )

//                                 const getMitra1 = getSJ ? await models.mitra.findOne(
//                                     { 
//                                         where: { id_mitra: getSJ.id_mitra_pickup } 
//                                     }
//                                 ) : null;
                                
//                                 const getMitra2 = getSJ ? await models.mitra.findOne(
//                                     { 
//                                         where: { id_mitra: getSJ.id_mitra } 
//                                     }
//                                 ) : null;
                                
//                                 const getMitra3 = getSJ ? await models.mitra.findOne(
//                                     { 
//                                         where: { id_mitra: getSJ.id_mitra_2 } 
//                                     }
//                                 ) : null;


//                                 return {
//                                     idmpd: ii.id_mpd,
//                                     noSJ: getSJ?.msm,
//                                     supirSJ1: getSJ == null ? "-" : getSJ.id_driver,
//                                     supirSJ2: getSJ == null ? "-" : getSJ.id_driver_2,
//                                     supir1: getSJ?.pickup_supir || "-",
//                                     supir2: getSJ?.supir || "-",
//                                     supir3: getSJ?.supir_2 || "-",
//                                     mitraSJ1: getSJ == null ? "-" : getSJ.id_mitra_pickup,
//                                     mitraSJ2: getSJ == null ? "-" : getSJ.id_mitra,
//                                     mitraSJ3: getSJ == null ? "-" : getSJ.id_mitra_2,
//                                     mitra1: getMitra1?.nama_mitra || "-",
//                                     mitra2: getMitra2?.nama_mitra || "-",
//                                     mitra3: getMitra3?.nama_mitra || "-",
//                                     kendaraan1: getSJ?.pickup_kendaraan || "-",
//                                     kendaraan2: getSJ?.kendaraan || "-",
//                                     kendaraan3: getSJ?.kendaraan_2 || "-",
//                                     nopol1: getSJ?.pickup_nopol || "-",
//                                     nopol2: getSJ?.nopol || "-",
//                                     nopol3: getSJ?.nopol_2 || "-",
//                                     kendaraanJenisId: getKendaraanJenis.id_kendaraan_jenis,
//                                     kendaraan: ii.kendaraan,
//                                     service: getService,
//                                     pickupId: getPickup?.id,
//                                     pickup: getPickup?.alamat,
//                                     destinationId: getBongkar?.id,
//                                     destination: getBongkar?.alamat,
//                                     via: ii.via,
//                                     shipmentID: ii.shipment,
//                                     shipmentName: getShipment.shipment,
//                                     id_kota_muat: ii?.id_kota_muat,
//                                     id_kota_bongkar: ii?.id_kota_bongkar,
//                                     item: ii.nama_barang,
//                                     qty: ii.qty,
//                                     koli: ii.koli,
//                                     berat: ii.berat,
//                                     ikat: ii.ikat,
//                                     Price: ii.harga,
//                                     biayaLain: ii.biaya_lain,
//                                     biayaMel: ii.biaya_mel,
//                                     harga_type: ii.harga_type,
//                                     biaya_multi_drop: ii.biaya_multidrop,
//                                     max_tonase: ii.max_tonase,
//                                     biaya_overtonase: ii.biaya_overtonase,
//                                     harga_selanjutnya: ii.harga_selanjutnya,
//                                     biaya_tambahan: ii.biaya_tambahan,
//                                     biaya_multimuat: ii.biaya_multimuat,
//                                     // harga: ii.harga,
//                                     harga_muat: ii.harga_muat,
//                                     harga_bongkar: ii.harga_bongkar,
//                                     diskon: ii.diskon,
//                                     unitId: ii.id_unit,
//                                     supirId: ii.id_supir,
//                                     total: ii.total,
//                                     totalBiayaRetail: (ii.harga * ii.berat) + ii.harga_bongkar + ii.harga_muat,
//                                     totalBiayaCharter: ii.harga + ii.harga_bongkar + ii.harga_muat,
//                                     biaya_jalan: getTarif?.biaya_jalan,

//                                     // supirSM2:ii.m_sm.id_unit_2 == null ?"-":ii.m_sm.id_unit_2,

//                                 }

//                             })),


//                             // destination: getBongkar.alamat,
//                             // via: i.via,
//                             // item: i.nama_barang,
//                             // qty: i.qty,
//                             // berat: i.berat,  
//                             // Price: i.harga,
//                             // harga_type: i.harga_type,
//                             // harga: i.harga,
//                             // harga_muat: i.harga_muat,
//                             // harga_bongkar: i.harga_bongkar,
//                             // diskon: i.diskon,
//                             // total: i.total

//                         }



//                     })),
//                     // const totalSemua = results.reduce((total, item) => total + item.total, 0);


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

exports.getSpListApprove = async (req, res) => {
    try {

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        // models.m_pengadaan.belongsTo(models.m_chat, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        // models.m_pengadaan.belongsTo(models.m_chat, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        models.m_pengadaan_approve.belongsTo(models.users, { targetKey: 'id', foreignKey: 'sales' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });


        if (!models.m_pengadaan_detail.associations.kotaAsal) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat', as: 'kotaAsal' });
        }
        if (!models.m_pengadaan_detail.associations.kotaTujuan) {
            models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar', as: 'kotaTujuan' });
        }

        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_almuat' });
        // models.m_pengadaan_detail.belongsTo(models.alamat, { targetKey: 'id', foreignKey: 'id_albongkar' });


        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));


        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_pengadaan.findAndCountAll(
                {
                    order: [['id_mp', 'desc']],
                    ...req.query.statusSP ? {
                        where: {

                            ...req.query.customerId ? {
                                id_customer: req.query.customerId
                            } : {},
                            ...req.query.cabang ? {
                                msp: { [Op.like]: `%${req.query.cabang}` }
                            } : {},
                            ...req.query.sales ? {
                                id_sales: req.query.sales
                            } : {},
                            ...req.query.tgl_pickup ? {
                                tgl_pickup: req.query.tgl_pickup
                            } : {},
                            ...req.query.statusSP ? { status: req.query.statusSP } : {},
                            ...req.query.keyword ? {
                                [Op.or]: [
                                    {
                                        msp: {
                                            [Op.like]: `%${req.query.keyword}%`
                                        },

                                    },



                                ]
                            } : {}
                        },
                    } : {},
                    // group: 'msp',[]
                    // attributes: [['msp']],

                    limit: limit,
                    offset: offset,
                    include: [

                        {
                            model: models.users,
                            required: true,
                            where: {
                                ...req.query.buId ? {
                                    id_bu: req.query.buId
                                } : {},
                            }
                        },
                        {
                            model: models.customer,
                            required: false,

                        },
                        {
                            model: models.m_pengadaan_detail,
                            required: false,
                            include: [
                                {
                                    model: models.alamat,
                                    as: 'kotaAsal',
                                },
                                {
                                    model: models.alamat,
                                    as: 'kotaTujuan'
                                },
                            ]

                        },

                        {
                            model: models.m_status_order,
                            required: true,
                            where: [
                                {
                                    tgl_act_3: {
                                        [Op.not]: null
                                    }
                                },
                                // {
                                //     akunting:{
                                //         [Op.ne]:0
                                //     }
                                // },
                                {
                                    act_akunting: "Y"
                                },
                                {
                                    [Op.or]: [
                                        {
                                            tgl_act_4: {
                                                [Op.not]: null
                                            },
                                            kendaraan_operasional: "Y",
                                        },
                                        {
                                            tgl_act_5: {
                                                [Op.not]: null
                                            },
                                            kendaraan_purchasing: "Y"
                                        }
                                    ]
                                }
                            ],
                            include: [
                                { model: models.users }
                            ]

                        },
                    ]

                }
            )


            if (getData.rows) {



                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = await Promise.all(getData.rows.map(async (item) => {
                    const bongkar = item.m_pengadaan_details.map((i) => i.id_albongkar);
                    const muat = item.m_pengadaan_details.map((i) => i.id_almuat);
                    const kendaraan = item.m_pengadaan_details.map((i) => i.kendaraan);
                    // console.log("🚀 ~ file: sp.controller.js:4728 ~ result ~ bongkar:", bongkar.slice(-1).pop())
                    // var bongkaranId
                    const getBongkar = await models.alamat.findOne({
                        ...bongkar.slice(-1).pop() != undefined ? {
                            where: {
                                id: bongkar.slice(-1).pop()
                            }
                        } : ""
                    });
                    const getMuat = await models.alamat.findOne({
                        ...muat[0] != undefined ? {
                            where: {
                                id: muat[0]
                            }
                        } : ""
                    });

                    return {
                        no: no++,
                        idmp: item.id_mp,
                        sp: item.msp,
                        salesName: item.user == null ? "-" : item.user.nama_lengkap,
                        perusahaan: item.customer?.nama_perusahaan,
                        kendaraan: kendaraan[0] == null ? "-" : kendaraan[0],
                        service: item.service,
                        pickupDate: core.moment(item.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                        approveAct: item.m_status_order.act_akunting,
                        dateApproveAct: core.moment(item.m_status_order.tgl_act_3).format('YYYY-MM-DD HH:mm:ss'),
                        approveOps: item.m_status_order.kendaraan_operasional,
                        idops: item.m_status_order.operasional,
                        operationalName: item.m_status_order.user == null ? "" : item.m_status_order.user.nama_lengkap,
                        dateApproveOps: core.moment(item.m_status_order.tgl_act_4).format('YYYY-MM-DD HH:mm:ss'),
                        approvePurch: item.m_status_order.kendaraan_purchasing,
                        dateApprovePurch: core.moment(item.m_status_order.tgl_act_5).format('YYYY-MM-DD HH:mm:ss'),
                        destination: getMuat.kota + " - " + getBongkar.kota
                    };
                }));

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
                };
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


//statuss Approve
exports.statusApproveAll = async (req, res) => {
    try {
        const GetUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (GetUser) {

            const getDataSp = await models.m_pengadaan_detail.findAndCountAll(
                {
                    where: {
                        id_mp: req.query.id_mp
                    }
                }
            )
            // console.log("🚀 ~ file: sp.controller.js:4897 ~ exports.statusApproveAll= ~ getDataSp:", getDataSp.count)


            const getStatus = await models.m_status_order.findOne(
                {
                    where: {
                        id_mp: req.query.id_mp
                    }
                }
            )
            if (getStatus) {
                output = {
                    status: {
                        code: 200,
                        message: getStatus
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

//getStatusDetail

exports.getStatusDetail = async (req, res) => {
    try {
        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {
            const getDataDetail = await models.m_pengadaan_detail.findAll(
                {
                    where: {
                        id_mp: req.query.id_mp
                    }
                }
            )

            if (getDataDetail) {
                output = {
                    status: {
                        code: 200,
                        data: getDataDetail
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

exports.getLostSales = async (req, res) => {
    try {
        models.m_status_order.belongsTo(models.m_pengadaan, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        models.m_pengadaan.belongsTo(models.users, { targetKey: 'id', foreignKey: 'id_sales' });
        models.m_pengadaan.belongsTo(models.customer, { targetKey: 'id_customer', foreignKey: 'id_customer' });
        models.m_pengadaan.hasMany(models.m_pengadaan_detail, { targetKey: 'id_mp', foreignKey: 'id_mp' });
        // models.m_pengadaan_detail.belongsTo(models.m_sm, { targetKey: 'id_mpd', foreignKey: 'id_mpd' });
        models.m_pengadaan.belongsTo(models.m_status_order, { targetKey: 'id_mp', foreignKey: 'id_mp' });

        models.m_status_order.belongsTo(models.users, { targetKey: 'id', foreignKey: 'operasional' });
        const { limit, offset } = core.getPagination(Number(req.query.limit), Number(req.query.page));

        // if (!models.m_pengadaan_detail.associations.kendaraanUnit) {
        //     models.m_pengadaan_detail.belongsTo(unit, { targetKey: 'id', foreignKey: 'id_unit', as: 'kendaraanUnit' });
        // }



        const getUser = await models.users.findOne(
            {
                where: {
                    id: req.user.id
                }
            }
        )
        if (getUser) {

            const getData = await models.m_status_order.findAndCountAll(
                {
                    // distinct: true,
                    order: [['id', 'desc']],
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    {
                                        sales_reject: {
                                            [Op.in]: [8, 11]
                                        }
                                    },

                                    {
                                        [Op.and]: [
                                            { ops_reject: 53 },
                                            { purch_reject: 54 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },

                    // ...req.query.is_multi == 1 ? { group: [['msp']] } : {},
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: models.m_pengadaan,
                            // where:
                            include: [
                                {
                                    model: models.m_pengadaan_detail,
                                    required: false,


                                },
                                {
                                    model: models.users,
                                    required: false
                                },
                                {
                                    model: models.customer,
                                    required: false,

                                },
                                // {
                                //     model: models.m_chat,
                                //     required: false,
                                // },

                            ]
                        },


                        // include: [
                        //     {
                        //         model: models.users,
                        //         required: false
                        //     }
                        // ]


                    ]

                }
            )

            if (getData.rows) {
                const currentPage = Number(req.query.page) || 1; // Halaman saat ini
                const itemsPerPage = Number(req.query.limit) || 10; // Jumlah item per halaman
                const startIndex = (currentPage - 1) * itemsPerPage + 1;

                let no = (getData.count > 0) ? (req.query.page - 1) * req.query.limit + 1 : 0
                const result = await Promise.all(getData.rows.map(async (item, index) => {

                    const detail0 = Array.isArray(item.m_pengadaan?.m_pengadaan_details)
                      ? item.m_pengadaan.m_pengadaan_details[0] : null;
                    const idAlbongkar = detail0?.id_albongkar || null;
                    const getTujuan = idAlbongkar
                      ? await models.alamat.findOne({ where: { id: idAlbongkar } })
                      : null;
                    const chatMkt = item.sales_reject
                    ? await models.massage_do.findOne({
                            where: { id_massage_do: item.sales_reject }
                        })
                    : null;

                    const chatOps = item.ops_reject
                    ? await models.massage_do.findOne({
                            where: { id_massage_do: item.ops_reject }
                        })
                    : null;

                    const chatPurch = item.purch_reject
                    ? await models.massage_do.findOne({
                            where: { id_massage_do: item.purch_reject }
                        })
                    : null;
                    return {
                        no: startIndex + index,
                        idmp: item.id_mp,
                        // noSj: item.m_pengadaan.m_pengadaan_detail?.m_sm?.msm,
                        sp: item.m_pengadaan == null ? "-" : item.m_pengadaan.msp,
                        salesName: item.m_pengadaan == null ? "-" : item.m_pengadaan.user?.nama_lengkap,
                        perusahaan: item.m_pengadaan == null ? "-" : item.m_pengadaan.customer?.nama_perusahaan,
                        kendaraan: detail0 == null ? "-" : detail0.kendaraan,
                        pickupDate: item.m_pengadaan == null ? "-" : core.moment(item.m_pengadaan.tgl_pickup).format('YYYY-MM-DD HH:mm:ss'),
                        total: item.m_pengadaan == null ? "-" : item.m_pengadaan.total_keseluruhan,
                        tujuan: getTujuan == null ? "-" : getTujuan.alamat_detail,
                        chatMkt: chatMkt?.massage || "-",
                        chatOps: chatOps?.massage || "-",
                        chatPurch: chatPurch?.massage || "-"


                        // tujuan:item.m_pengadaan.
                        // total:item.
                        // kendaraan: item.m_pengadaan_detail.kendaraan,

                    }
                }))

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

exports.getDataSjPerbulan = async (req, res) => {
    try {
        // const getUser = await models.users.findOne({
        //     where: {
        //         id: req.user.id,
        //     },
        // });

        // if (!getUser) {
        //     return res
        //         .status(404)
        //         .json({ status: { code: 404, message: "User not found" } });
        // }

        const query = `
            WITH LatestStatus AS (
                SELECT
                    ks.id_msm,
                    sm.id_bu_brench,
                    br.name_bu_brench,
                    ks.action,
                    ks.empty_load
                FROM
                    kendaraanstatus ks
                INNER JOIN m_sm sm ON sm.id_msm = ks.id_msm
                INNER JOIN m_bu_brench br ON br.id_bu_brench = sm.id_bu_brench
                INNER JOIN (
                    SELECT
                        id_msm,
                        MAX(id) AS max_id
                    FROM
                        kendaraanstatus
                    GROUP BY
                        id_msm
                ) latest ON ks.id_msm = latest.id_msm AND ks.id = latest.max_id
                WHERE
                    sm.id_bu = '11'
                    AND ks.empty_load <> '19'
            )
            SELECT
                id_bu_brench,
                name_bu_brench,
                COUNT(id_msm) AS jumlah,
                SUM(CASE WHEN action = 2 THEN 1 ELSE 0 END) AS on_Pickup,
                SUM(CASE WHEN action = 3 THEN 1 ELSE 0 END) AS on_Delivery,
                SUM(CASE WHEN action = 5 THEN 1 ELSE 0 END) AS Unloading,
                SUM(CASE WHEN action = 9 THEN 1 ELSE 0 END) AS Success,
                SUM(CASE
                    WHEN empty_load IN ('Pending Pickup', 'Failed', 'Doc Returned')
                    THEN 1 ELSE 0
                END) AS Pending
            FROM
                LatestStatus
            GROUP BY
                id_bu_brench, name_bu_brench
            ORDER BY
                id_bu_brench;
        `;

        const data = await db.query(query);

        res.status(200).json({
            status: {
                code: 200,
                message: "Success get data",
            },
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getListSJ = async (req, res) => {
  try {
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const id_bu = req.query.id_bu || '11';
    const search = req.query.search || '';
    const searchQuery = `%${search}%`;

    const startDate = req.query.start_date || null;
    const endDate = req.query.end_date || null;

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    let dateFilter = '';
    const dateParams = [];

    if (startDate && endDate) {
      dateFilter = 'AND a.tgl_muat BETWEEN ? AND ?';
      dateParams.push(startDate, endDate);
    } else if (startDate) {
      dateFilter = 'AND a.tgl_muat >= ?';
      dateParams.push(startDate);
    } else if (endDate) {
      dateFilter = 'AND a.tgl_muat <= ?';
      dateParams.push(endDate);
    }

    const sql = `
      SELECT 
          a.id_msm,
          d.kode_customer,
          d.nama_perusahaan,
          e.kota AS muat,
          f.kota AS bongkar,
          a.id_msm AS trans,
          a.msm,
          b.nama_barang,
          a.do AS sj,
          b.via,
          a.berat,
          a.qty,
          a.koli,
          a.tgl_muat,
          a.waktu_muat,
          a.waktu_bongkar,
          a.tgl_eta,
          DATEDIFF(a.tgl_eta, a.tgl_muat) AS eta,
          a.kendaraan,
          a.nopol,
          a.pickup_supir,
          a.telp,
          a.id_mitra_pickup,
          g.nama_mitra,
          h.no_polisi,
          h.id_kendaraan_jenis,
          j.nama_kendaraan_jenis,
          i.nama AS nama_driver,
          i.no_telp,
          a.keterangan,
          a.tgl_bongkar AS tgl_tiba,
          DATEDIFF(a.tgl_bongkar, a.tgl_muat) AS tgl_real_tiba,
          a.nama_kapal,
          a.kapal_berangkat,
          a.is_deleted,
          c.status,
          MAX(IF(l.action != 19, l.tujuan, NULL)) AS tujuan,
          COALESCE(MAX(IF(l.action IN (1, 2, 3, 5, 9), l.action, NULL)), 1) AS action
      FROM 
          m_sm a
          INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
          INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
          INNER JOIN customer d ON d.id_customer = c.id_customer
          LEFT JOIN alamat e ON e.id = b.id_almuat
          LEFT JOIN alamat f ON f.id = b.id_albongkar
          LEFT JOIN mitra g ON g.id_mitra = a.id_mitra_pickup
          LEFT JOIN kendaraan h ON h.id = a.id_unit
          LEFT JOIN m_driver i ON i.id = a.id_driver
          LEFT JOIN kendaraan_jenis j ON j.id_kendaraan_jenis = h.id_kendaraan_jenis
          LEFT JOIN kendaraanstatus l 
            ON l.id_msm = a.id_msm 
            AND l.action IN (1, 2, 3, 5, 9)
      WHERE 
          a.msm != ''
          AND a.id_mitra_pickup != '0'
          AND a.status_pembatalan != '1'
          AND a.is_deleted != '1'
          AND c.status IN (1, 2)
          ${dateFilter}
          AND a.id_bu = ?
          AND (
            a.msm LIKE ? OR
            d.nama_perusahaan LIKE ? OR
            b.nama_barang LIKE ? OR
            a.nopol LIKE ? OR
            i.nama LIKE ?
          )
      GROUP BY 
          a.id_msm
      ORDER BY 
          a.tgl_muat DESC
      LIMIT ? OFFSET ?
    `;

    const sqlParams = [
      ...dateParams,
      id_bu,
      searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
      length,
      start,
    ];

    const data = await db.query(sql, sqlParams);

    const totalSql = `
      SELECT COUNT(*) AS total
      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      INNER JOIN customer d ON d.id_customer = c.id_customer
      LEFT JOIN m_driver i ON i.id = a.id_driver
      WHERE a.msm != ''
        AND a.id_mitra_pickup != '0'
        AND a.status_pembatalan != '1'
        AND a.is_deleted != '1'
        AND c.status IN (1, 2)
        ${dateFilter}
        AND a.id_bu = ?
        AND (
          a.msm LIKE ? OR
          d.nama_perusahaan LIKE ? OR
          b.nama_barang LIKE ? OR
          a.nopol LIKE ? OR
          i.nama LIKE ?
        )
    `;

    const totalParams = [
      ...dateParams,
      id_bu,
      searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
    ];

    const totalResult = await db.query(totalSql, totalParams);
    const recordsFiltered = totalResult[0]?.total || 0;

    const totalAllSql = `
      SELECT COUNT(*) AS total
      FROM m_sm a
      INNER JOIN m_pengadaan_detail b ON b.id_mpd = a.id_mpd
      INNER JOIN m_pengadaan c ON c.id_mp = b.id_mp
      WHERE a.msm != ''
        AND a.id_mitra_pickup != '0'
        AND a.status_pembatalan != '1'
        AND a.is_deleted != '1'
        AND c.status IN (1, 2)
        ${dateFilter}
        AND a.id_bu = ?
    `;

    const totalAllParams = [...dateParams, id_bu];
    const totalAllResult = await db.query(totalAllSql, totalAllParams);
    const recordsTotal = totalAllResult[0]?.total || 0;

    res.json({
      draw,
      recordsTotal,
      recordsFiltered,
      data,
    });

  } catch (error) {
    console.error('Gagal mengambil data SM:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data SM',
      error: error.message,
    });
  }
};

// Endpoint untuk approve SO accounting - hanya untuk divisi akunting
exports.approveSoAccounting = async (req, res) => {
    try {
        // Validasi: hanya divisi akunting yang boleh akses
        if (req.user.divisi !== 'akunting') {
            return res.status(403).json({
                status: {
                    code: 403,
                    message: 'Akses ditolak. Hanya divisi akunting yang dapat menggunakan endpoint ini.'
                }
            });
        }

        const { id_mp } = req.body;

        // Validasi input
        if (!id_mp) {
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'Parameter id_mp diperlukan'
                }
            });
        }

        // Cek apakah SP ada
        const getPengadaan = await models.m_pengadaan.findOne({
            where: {
                id_mp: id_mp
            }
        });

        if (!getPengadaan) {
            return res.status(404).json({
                status: {
                    code: 404,
                    message: 'SP tidak ditemukan'
                }
            });
        }

        // Update field 'new' menjadi '1' (closed)
        const updateResult = await models.m_pengadaan.update(
            {
                new: '1'
            },
            {
                where: {
                    id_mp: id_mp
                }
            }
        );

        if (updateResult[0] > 0) {
            // Insert ke m_chat untuk mencatat aksi close SO
            await models.m_chat.create({
                id_mp: id_mp,
                ph: getPengadaan.ph,
                user: req.user.id.toString(),
                chat: `SO telah di-close oleh divisi akunting (${req.user.fullname})`,
                baca: '0',
                tgl_chat: new Date()
            });

            return res.status(200).json({
                status: {
                    code: 200,
                    message: 'SP berhasil di-approve oleh akunting'
                },
                data: {
                    id_mp: id_mp,
                    new: '1',
                    message: 'Status SP telah diubah menjadi closed'
                }
            });
        } else {
            return res.status(500).json({
                status: {
                    code: 500,
                    message: 'Gagal mengupdate status SP'
                }
            });
        }

    } catch (error) {
        console.error('Error in approveSoAccounting:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// Endpoint untuk revisi SO accounting - hanya untuk divisi akunting
exports.revisiSoAccounting = async (req, res) => {
    try {
        // Validasi: hanya divisi akunting yang boleh akses
        if (req.user.divisi !== 'akunting') {
            return res.status(403).json({
                status: {
                    code: 403,
                    message: 'Akses ditolak. Hanya divisi akunting yang dapat menggunakan endpoint ini.'
                }
            });
        }

        const { id_mp } = req.body;

        // Validasi input
        if (!id_mp) {
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'Parameter id_mp diperlukan'
                }
            });
        }

        // Cek apakah SP ada
        const getPengadaan = await models.m_pengadaan.findOne({
            where: {
                id_mp: id_mp
            }
        });

        if (!getPengadaan) {
            return res.status(404).json({
                status: {
                    code: 404,
                    message: 'SP tidak ditemukan'
                }
            });
        }

        // Update field 'new' menjadi '2' (revisi)
        const updateResult = await models.m_pengadaan.update(
            {
                new: '2'
            },
            {
                where: {
                    id_mp: id_mp
                }
            }
        );

        if (updateResult[0] > 0) {
            // Insert ke m_chat untuk mencatat aksi revisi SO
            await models.m_chat.create({
                id_mp: id_mp,
                ph: getPengadaan.ph,
                user: req.user.id.toString(),
                chat: `SO telah di-revisi oleh divisi akunting (${req.user.fullname})`,
                baca: '0',
                tgl_chat: new Date()
            });

            return res.status(200).json({
                status: {
                    code: 200,
                    message: 'SP berhasil di-revisi oleh akunting'
                },
                data: {
                    id_mp: id_mp,
                    new: '2',
                    message: 'Status SP telah diubah menjadi revisi'
                }
            });
        } else {
            return res.status(500).json({
                status: {
                    code: 500,
                    message: 'Gagal mengupdate status SP'
                }
            });
        }

    } catch (error) {
        console.error('Error in revisiSoAccounting:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// ========== CRUD ENDPOINTS UNTUK TAMBAHAN BIAYA DETAIL SJ (m_sm_cost) ==========

// Helper function untuk update m_pengadaan_detail berdasarkan cost_type
const updatePengadaanDetailCost = async (id_mpd, cost_type, amount, is_ditagihkan, is_approve) => {
    // Hanya update jika is_ditagihkan = 0 dan is_approve = 1
    if (is_ditagihkan !== 0 || is_approve !== '1') {
        return;
    }

    const updateFields = {};
    
    // Mapping cost_type ke field yang sesuai di m_pengadaan_detail
    switch (cost_type.toLowerCase()) {
        case 'biaya muat':
            updateFields.harga_muat = amount;
            break;
        case 'biaya bongkar':
            updateFields.harga_bongkar = amount;
            break;
        case 'biaya overtonase':
            updateFields.biaya_overtonase = amount;
            break;
        case 'biaya multimuat':
            updateFields.biaya_multimuat = amount;
            break;
        case 'biaya multidrop':
            updateFields.biaya_multidrop = amount;
            break;
        case 'biaya mel':
            updateFields.biaya_mel = amount;
            break;
        case 'biaya tambahan':
            updateFields.biaya_tambahan = amount;
            break;
        case 'biaya lain':
            updateFields.biaya_lain = amount;
            break;
        default:
            throw new Error(`Cost type '${cost_type}' tidak dikenali`);
    }

    // Update m_pengadaan_detail
    await models.m_pengadaan_detail.update(updateFields, {
        where: { id_mpd: id_mpd }
    });

    // Recalculate total di m_pengadaan_detail
    const detail = await models.m_pengadaan_detail.findOne({
        where: { id_mpd: id_mpd }
    });

    if (detail) {
        const total = (detail.harga * detail.berat) + 
                     detail.harga_muat + 
                     detail.harga_bongkar + 
                     detail.biaya_overtonase + 
                     detail.biaya_multimuat + 
                     detail.biaya_multidrop + 
                     detail.biaya_mel + 
                     detail.biaya_tambahan + 
                     detail.biaya_lain;

        await models.m_pengadaan_detail.update(
            { total: total },
            { where: { id_mpd: id_mpd } }
        );
    }
};

// CREATE - Tambah biaya detail SJ
// exports.createSmCost = async (req, res) => {
//     try {
//         const {
//             id_msm,
//             cost_type,
//             qty,
//             price,
//             tax,
//             discount_type,
//             discount_value,
//             is_ditagihkan
//         } = req.body;

//         // Validasi input
//         if (!id_msm || !cost_type || !qty || !price || !tax || !discount_value || is_ditagihkan === undefined) {
//             return res.status(400).json({
//                 status: {
//                     code: 400,
//                     message: 'Semua field wajib diisi'
//                 }
//             });
//         }

//         // Hitung amount
//         const subtotal = qty * price;
//         const discountAmount = discount_type === 'percentage' ? 
//             (subtotal * discount_value / 100) : discount_value;
//         const afterDiscount = subtotal - discountAmount;
//         const taxAmount = afterDiscount * tax / 100;
//         const amount = afterDiscount + taxAmount;

//         // Cek apakah SM ada dan dapatkan id_mpd
//         const sm = await models.m_sm.findOne({
//             where: { id_msm: id_msm }
//         });

//         if (!sm) {
//             return res.status(404).json({
//                 status: {
//                     code: 404,
//                     message: 'SM tidak ditemukan'
//                 }
//             });
//         }

//         // Create m_sm_cost
//         const newCost = await models.m_sm_cost.create({
//             id_msm: id_msm,
//             cost_type: cost_type,
//             qty: qty,
//             price: price,
//             tax: tax,
//             discount_type: discount_type,
//             discount_value: discount_value,
//             is_ditagihkan: is_ditagihkan,
//             is_approve: '0', // Default status: pending
//             amount: amount,
//             created_by: req.user.id,
//             created_at: new Date(),
//             modified_at: new Date()
//         });

//         // Update m_pengadaan_detail jika is_ditagihkan = 0 dan is_approve = 1 (approved)
//         if (is_ditagihkan === 0) {
//             await updatePengadaanDetailCost(sm.id_mpd, cost_type, amount, is_ditagihkan, '0');
//         }

//         return res.status(201).json({
//             status: {
//                 code: 201,
//                 message: 'Biaya detail SJ berhasil ditambahkan'
//             },
//             data: newCost
//         });

//     } catch (error) {
//         console.error('Error in createSmCost:', error);
//         return res.status(500).json({
//             status: {
//                 code: 500,
//                 message: 'Server error',
//                 error: error.message
//             }
//         });
//     }
// };

// CREATE - Tambah biaya detail SJ (hanya ke m_sm_cost, tidak update msm)
exports.createSmCost = async (req, res) => {
    try {
        const {
            id_msm,
            cost_type,
            qty,
            price,
            tax,
            discount_type,
            discount_value,
            is_ditagihkan,
            keterangan
        } = req.body;

        // Validasi input
        if (!id_msm || !cost_type || !qty || !price || is_ditagihkan === undefined) {
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'Semua field wajib diisi'
                }
            });
        }

        // Hitung amount
        const subtotal = qty * price;
        const discountAmount = discount_value ? (discount_type === 'percentage' ? 
            (subtotal * discount_value / 100) : discount_value) : 0;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = tax ? (afterDiscount * tax / 100) : 0;
        const amount = afterDiscount + taxAmount;

        // Create m_sm_cost
        const newCost = await models.m_sm_cost.create({
            id_msm: id_msm,
            cost_type: cost_type,
            qty: qty,
            price: price,
            tax: tax || null,
            discount_type: discount_type,
            discount_value: discount_value || null,
            is_ditagihkan: is_ditagihkan,
            is_approve: '1', // Default status: pending
            amount: amount,
            keterangan: keterangan || null,
            created_by: req.user.id,
            created_at: new Date(),
            modified_at: new Date()
        });

        return res.status(201).json({
            status: {
                code: 201,
                message: 'Biaya detail SJ berhasil ditambahkan'
            },
            data: newCost
        });

    } catch (error) {
        console.error('Error in createSmCost:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// READ - Get semua biaya detail SJ berdasarkan id_msm
exports.getSmCosts = async (req, res) => {
    try {
        const { id_msm } = req.query;

        if (!id_msm) {
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'Parameter id_msm diperlukan'
                }
            });
        }

        const costs = await models.m_sm_cost.findAll({
            where: { id_msm: id_msm },
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            status: {
                code: 200,
                message: 'Data biaya detail SJ berhasil diambil'
            },
            data: costs
        });

    } catch (error) {
        console.error('Error in getSmCosts:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// GET ALL - Get semua biaya detail SJ dengan pagination dan filter
exports.getAllSmCosts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            id_msm,
            cost_type,
            is_approve,
            is_ditagihkan,
            created_by,
            start_date,
            end_date
        } = req.query;

        // Build where condition
        const whereCondition = {};
        
        if (id_msm) whereCondition.id_msm = id_msm;
        if (cost_type) whereCondition.cost_type = { [models.Sequelize.Op.like]: `%${cost_type}%` };
        if (is_approve) whereCondition.is_approve = is_approve;
        if (is_ditagihkan !== undefined) whereCondition.is_ditagihkan = is_ditagihkan;
        if (created_by) whereCondition.created_by = created_by;
        
        // Date range filter
        if (start_date || end_date) {
            whereCondition.created_at = {};
            if (start_date) whereCondition.created_at[models.Sequelize.Op.gte] = new Date(start_date);
            if (end_date) whereCondition.created_at[models.Sequelize.Op.lte] = new Date(end_date);
        }

        // Calculate pagination
        const offset = (page - 1) * limit;
        const currentPage = parseInt(page);
        const itemsPerPage = parseInt(limit);

        // Get total count
        const totalData = await models.m_sm_cost.count({
            where: whereCondition
        });

        // Get data with pagination
        const costs = await models.m_sm_cost.findAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
            limit: itemsPerPage,
            offset: offset
        });

        // Calculate pagination info
        const totalPage = Math.ceil(totalData / itemsPerPage);
        const canLoadMore = totalData > currentPage * itemsPerPage;

        return res.status(200).json({
            status: {
                code: 200,
                message: 'Data semua biaya detail SJ berhasil diambil'
            },
            data: {
                totalData: totalData,
                totalPage: totalPage,
                limit: itemsPerPage,
                currentPage: currentPage,
                canLoadMore: canLoadMore,
                costs: costs
            }
        });

    } catch (error) {
        console.error('Error in getAllSmCosts:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// UPDATE - Update biaya detail SJ
exports.updateSmCost = async (req, res) => {
    try {
        const { id_msm_cost } = req.params;
        const {
            cost_type,
            qty,
            price,
            tax,
            discount_type,
            discount_value,
            is_ditagihkan
        } = req.body;

        // Validasi input
        if (!cost_type || !qty || !price || !tax || !discount_value || is_ditagihkan === undefined) {
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'Semua field wajib diisi'
                }
            });
        }

        // Cek apakah cost ada
        const existingCost = await models.m_sm_cost.findOne({
            where: { id_msm_cost: id_msm_cost }
        });

        if (!existingCost) {
            return res.status(404).json({
                status: {
                    code: 404,
                    message: 'Biaya detail SJ tidak ditemukan'
                }
            });
        }

        // Hitung amount baru
        const subtotal = qty * price;
        const discountAmount = discount_type === 'percentage' ? 
            (subtotal * discount_value / 100) : discount_value;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * tax / 100;
        const amount = afterDiscount + taxAmount;

        // Update m_sm_cost
        const updatedCost = await models.m_sm_cost.update({
            cost_type: cost_type,
            qty: qty,
            price: price,
            tax: tax,
            discount_type: discount_type,
            discount_value: discount_value,
            is_ditagihkan: is_ditagihkan,
            amount: amount,
            modified_at: new Date()
        }, {
            where: { id_msm_cost: id_msm_cost }
        });

        // Update m_pengadaan_detail jika is_ditagihkan = 0 dan is_approve = 1 (approved)
        if (is_ditagihkan === 0) {
            const sm = await models.m_sm.findOne({
                where: { id_msm: existingCost.id_msm }
            });
            
            if (sm) {
                await updatePengadaanDetailCost(sm.id_mpd, cost_type, amount, is_ditagihkan, existingCost.is_approve);
            }
        }

        return res.status(200).json({
            status: {
                code: 200,
                message: 'Biaya detail SJ berhasil diupdate'
            },
            data: {
                id_msm_cost: id_msm_cost,
                updated: updatedCost[0] > 0
            }
        });

    } catch (error) {
        console.error('Error in updateSmCost:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// DELETE - Hapus biaya detail SJ
exports.deleteSmCost = async (req, res) => {
    try {
        const { id_msm_cost } = req.params;

        // Cek apakah cost ada
        const existingCost = await models.m_sm_cost.findOne({
            where: { id_msm_cost: id_msm_cost }
        });

        if (!existingCost) {
            return res.status(404).json({
                status: {
                    code: 404,
                    message: 'Biaya detail SJ tidak ditemukan'
                }
            });
        }

        // Hapus m_sm_cost
        const deletedCost = await models.m_sm_cost.destroy({
            where: { id_msm_cost: id_msm_cost }
        });

        // Reset field di m_pengadaan_detail jika is_ditagihkan = 0 dan is_approve = 1
        if (existingCost.is_ditagihkan === 0 && existingCost.is_approve === '1') {
            const sm = await models.m_sm.findOne({
                where: { id_msm: existingCost.id_msm }
            });
            
            if (sm) {
                await updatePengadaanDetailCost(sm.id_mpd, existingCost.cost_type, 0, existingCost.is_ditagihkan, existingCost.is_approve);
            }
        }

        return res.status(200).json({
            status: {
                code: 200,
                message: 'Biaya detail SJ berhasil dihapus'
            },
            data: {
                id_msm_cost: id_msm_cost,
                deleted: deletedCost > 0
            }
        });

    } catch (error) {
        console.error('Error in deleteSmCost:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// APPROVE - Approve biaya detail SJ (hanya untuk divisi akunting)
exports.approveSmCost = async (req, res) => {
    try {
        // Validasi: hanya divisi akunting yang boleh akses
        if (req.user.divisi !== 'akunting') {
            return res.status(403).json({
                status: {
                    code: 403,
                    message: 'Akses ditolak. Hanya divisi akunting yang dapat menggunakan endpoint ini.'
                }
            });
        }

        const { id_msm_cost } = req.params;

        // Cek apakah cost ada
        const existingCost = await models.m_sm_cost.findOne({
            where: { id_msm_cost: id_msm_cost }
        });

        if (!existingCost) {
            return res.status(404).json({
                status: {
                    code: 404,
                    message: 'Biaya detail SJ tidak ditemukan'
                }
            });
        }

        // Update is_approve menjadi '1' (approved)
        const updatedCost = await models.m_sm_cost.update({
            is_approve: '1',
            modified_at: new Date()
        }, {
            where: { id_msm_cost: id_msm_cost }
        });

        // Update m_pengadaan_detail jika is_ditagihkan = 0 dan sekarang approved
        if (existingCost.is_ditagihkan === 0) {
            const sm = await models.m_sm.findOne({
                where: { id_msm: existingCost.id_msm }
            });
            
            if (sm) {
                await updatePengadaanDetailCost(sm.id_mpd, existingCost.cost_type, existingCost.amount, existingCost.is_ditagihkan, '1');
            }
        }

        return res.status(200).json({
            status: {
                code: 200,
                message: 'Biaya detail SJ berhasil di-approve oleh akunting'
            },
            data: {
                id_msm_cost: id_msm_cost,
                is_approve: '1',
                updated: updatedCost[0] > 0
            }
        });

    } catch (error) {
        console.error('Error in approveSmCost:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// REJECT - Reject biaya detail SJ (hanya untuk divisi akunting)
exports.rejectSmCost = async (req, res) => {
    try {
        // Validasi: hanya divisi akunting yang boleh akses
        if (req.user.divisi !== 'akunting') {
            return res.status(403).json({
                status: {
                    code: 403,
                    message: 'Akses ditolak. Hanya divisi akunting yang dapat menggunakan endpoint ini.'
                }
            });
        }

        const { id_msm_cost } = req.params;

        // Cek apakah cost ada
        const existingCost = await models.m_sm_cost.findOne({
            where: { id_msm_cost: id_msm_cost }
        });

        if (!existingCost) {
            return res.status(404).json({
                status: {
                    code: 404,
                    message: 'Biaya detail SJ tidak ditemukan'
                }
            });
        }

        // Update is_approve menjadi '2' (rejected)
        const updatedCost = await models.m_sm_cost.update({
            is_approve: '2',
            modified_at: new Date()
        }, {
            where: { id_msm_cost: id_msm_cost }
        });

        // Reset field di m_pengadaan_detail jika sebelumnya approved
        if (existingCost.is_ditagihkan === 0 && existingCost.is_approve === '1') {
            const sm = await models.m_sm.findOne({
                where: { id_msm: existingCost.id_msm }
            });
            
            if (sm) {
                await updatePengadaanDetailCost(sm.id_mpd, existingCost.cost_type, 0, existingCost.is_ditagihkan, '2');
            }
        }

        return res.status(200).json({
            status: {
                code: 200,
                message: 'Biaya detail SJ berhasil di-reject oleh akunting'
            },
            data: {
                id_msm_cost: id_msm_cost,
                is_approve: '2',
                updated: updatedCost[0] > 0
            }
        });

    } catch (error) {
        console.error('Error in rejectSmCost:', error);
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Server error',
                error: error.message
            }
        });
    }
};

// GET List Alamat berdasarkan id_customer
exports.getListAlamat = async (req, res) => {
    let output;
    try {
        const { id_customer } = req.query;

        if (!id_customer) {
            output = {
                status: {
                    code: 400,
                    message: 'Parameter id_customer diperlukan'
                }
            };
        } else {
            const getUser = await models.users.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (getUser) {
                const listAlamat = await models.alamat.findAll({
                    where: {
                        id_customer: id_customer
                    },
                    order: [['id', 'asc']]
                });

                output = {
                    status: {
                        code: 200,
                        message: 'Success get data'
                    },
                    data: listAlamat.map((item) => {
                        return {
                            id: item.id,
                            alamat: item.alamat || '',
                            pic: item.pic || ''
                        };
                    })
                };
            } else {
                output = {
                    status: {
                        code: 401,
                        message: 'Unauthorized'
                    }
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

// POST Ganti Alamat - Update id_albongkar di m_pengadaan_detail
exports.gantiAlamat = async (req, res) => {
    let output;
    try {
        const { idmpd, alamat } = req.body;

        if (!idmpd || !alamat) {
            output = {
                status: {
                    code: 400,
                    message: 'Parameter idmpd dan alamat diperlukan'
                }
            };
        } else {
            const getUser = await models.users.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (getUser) {
                // Cek apakah data detail dengan id_mpd tersebut ada
                const checkDetail = await models.m_pengadaan_detail.findOne({
                    where: {
                        id_mpd: idmpd
                    }
                });

                if (!checkDetail) {
                    output = {
                        status: {
                            code: 404,
                            message: 'Data pengadaan detail tidak ditemukan'
                        }
                    };
                } else {
                    // Update id_albongkar
                    const updData = await models.m_pengadaan_detail.update(
                        {
                            id_albongkar: alamat
                        },
                        {
                            where: {
                                id_mpd: idmpd
                            }
                        }
                    );

                    if (updData) {
                        output = {
                            status: {
                                code: 200,
                                message: 'Alamat berhasil diganti'
                            },
                            data: {
                                id_mpd: idmpd,
                                id_albongkar: alamat
                            }
                        };
                    } else {
                        output = {
                            status: {
                                code: 500,
                                message: 'Gagal update alamat'
                            }
                        };
                    }
                }
            } else {
                output = {
                    status: {
                        code: 401,
                        message: 'Unauthorized'
                    }
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
