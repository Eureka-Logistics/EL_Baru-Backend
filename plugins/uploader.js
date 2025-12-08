// PLUGIN
const uploader = {}
const path = require('path')
const multer = require('multer')

const { check, validationResult } = require('express-validator');
// -------------

// PATH UPLOAD
var uploadDriverPhoto = ''
var uploadVehiclePhoto = ''
var uploadApprovedPhoto = ''
// var uploadPathBannerPerpus = ''
var uploadBannerPhoto = ''
var uploadDarurat = ''


// ------------------

const currYear = new Date().getFullYear();


// FUNGSI UPLOAD 
// const driverPhoto = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDriverPhoto)
//     },
//     filename: (req, file, cb) => {
//         cb(null, 'DriverCover' + '-' + Date.now() + path.extname(file.originalname))
//     }
// })
// const uploadPhotoDriver = multer({ storage: driverPhoto })


const driverPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDriverPhoto)
    },
    filename: (req, file, cb) => {
        cb(null, currYear + "~" + "DriverPhoto" + "-" + Date.now() + path.extname(file.originalname))
    }
})
const uploadPhotoDriver = multer({ storage: driverPhoto })
// ----------------------------
const vehiclePhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadVehiclePhoto)
    },
    filename: (req, file, cb) => {
        cb(null, currYear + "~" + "VehiclePhoto" + "-" + Date.now() + path.extname(file.originalname))
    }
})
const uploadPhotoVehicle = multer({ storage: vehiclePhoto })
// ----------------------------
const approvedPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadApprovedPhoto)
    },
    filename: (req, file, cb) => {
        cb(null, currYear + "~" + "ApprovedPhoto" + "-" + Date.now() + path.extname(file.originalname))
    }
})
const uploadPhotoApproved = multer({ storage: approvedPhoto })
// ----------------------------
const bannerPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadBannerPhoto)
    },
    filename: (req, file, cb) => {
        cb(null, currYear + "~" + "bannerPhoto" + "-" + Date.now() + path.extname(file.originalname))
    }
})
const uploadPhotoBanner = multer({ storage: bannerPhoto })
// -------------------------
const daruratPhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDarurat)
  },
  filename: (req, file, cb) => {
    cb(null, currYear + "~" + "daruratPhoto" + "-" + Date.now() + path.extname(file.originalname))
  }
})
const uploadPhotoDarurat = multer({ storage: daruratPhoto })
// --------------------------

uploader.addPhotoDriver = uploadPhotoDriver.single('cover'), uploadDriverPhoto = './public/assets/Driver/'
uploader.addPhotoDriverMultiple = uploadPhotoDriver.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'foto_sim', maxCount: 1 }
]), uploadDriverPhoto = './public/assets/Driver/'
uploader.addPhotoVehicle = uploadPhotoVehicle.single('cover'), uploadVehiclePhoto = './public/assets/vehicle/'
uploader.addPhotoVehicleMultiple = uploadPhotoVehicle.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'foto_stnk', maxCount: 1 }
]), uploadVehiclePhoto = './public/assets/vehicle/'
uploader.addPhotoApproved = uploadPhotoApproved.single('cover'), uploadApprovedPhoto = './public/assets/approvedOrder/'
uploader.addPhotoBanner = uploadPhotoBanner.single('cover'), uploadBannerPhoto = './public/assets/banner/'
uploader.addPhotoDarurat = uploadPhotoDarurat.single('foto'), uploadDarurat = './public/assets/darurat/'

// Uang Jalan Config
const fs = require('fs')
const uangJalanPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        const year = new Date().getFullYear()
        const uploadPath = `./public/assets/uang_jalan/${year}/`
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, currYear + "~" + "UJ" + "-" + Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
    }
})
const uploadPhotoUangJalan = multer({ storage: uangJalanPhoto })

uploader.addPhotoUangJalan = uploadPhotoUangJalan.fields([
    { name: 'bbm_img', maxCount: 10 },
    { name: 'makan_img', maxCount: 10 },
    { name: 'parkir_img', maxCount: 10 },
    { name: 'tol_img', maxCount: 10 },
    { name: 'tkbm_img', maxCount: 10 },
    { name: 'penyeberangan_img', maxCount: 10 },
    { name: 'overtonase_img', maxCount: 10 },
    { name: 'timbangan_img', maxCount: 10 },
    { name: 'pass_bandara_img', maxCount: 10 },
    { name: 'karantina_img', maxCount: 10 },
    { name: 'kawalan_img', maxCount: 10 }
])

// -----------------

module.exports = uploader;



