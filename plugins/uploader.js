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

// uploader.updateLogoPerpustakaan = uploadLogoPerpus.single('avatar'), uploadPathLogoPerpus = `./public/assets/images/profileLogo`,

// -----------------

module.exports = uploader;



