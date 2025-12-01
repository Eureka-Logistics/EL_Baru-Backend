const core = require('../config/core.config')
const models = core.models()
const { check } = require('express-validator')
const db = require('../config/db.config')

const CryptoJS = core.CryptoJS


exports.validate = (method) => {
    switch (method) {
        case 'get-vehicle': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page Tidak Boleh Kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit Tidak Boleh Kosong`),
            ]
        }
        case 'get-vehicle-detail': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Vehicle Tidak Boleh Kosong`),
            ]
        }

        case 'get-vehicle-mitra': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page Tidak Boleh Kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit Tidak Boleh Kosong`),
            ]
        }

        case 'create-vehicle': {
            return [
                // check('kode_kendaraan')
                //     .not().isEmpty()
                //     .withMessage(`kode kendaraan Tidak Boleh Kosong`),
                // check('id_driver')
                //     .not().isEmpty()
                //     .withMessage(`ID driver Tidak Boleh Kosong`),
                // check('no_polisi')
                //     .not().isEmpty()
                //     .withMessage(`nomor polisi Tidak Boleh Kosong`),
                // check('vendor')
                //     .not().isEmpty()
                //     .withMessage(`vendor Tidak Boleh Kosong`),
                // check('jenis_kendaraan')
                //     .not().isEmpty()
                //     .withMessage(`jenis kendaraan Tidak Boleh Kosong`),
                // check('merk_mobil')
                //     .not().isEmpty()
                //     .withMessage(`merk mobil Tidak Boleh Kosong`),
                // check('tahun_mobil')
                //     .not().isEmpty()
                //     .withMessage(`tahun mobil Tidak Boleh Kosong`),
                // check('warna_plat')
                //     .not().isEmpty()
                //     .withMessage(`warna plat Tidak Boleh Kosong`),
                // check('tgl_beli')
                //     .not().isEmpty()
                //     .withMessage(`tanggal beli Tidak Boleh Kosong`),
                // check('panjang')
                //     .not().isEmpty()
                //     .withMessage(`panjang kendaraan Tidak Boleh Kosong`),
                // check('lebar')
                //     .not().isEmpty()
                //     .withMessage(`lebar kenaraan Tidak Boleh Kosong`),
                // check('tinggi')
                //     .not().isEmpty()
                //     .withMessage(`tinggi kendaraan Tidak Boleh Kosong`),
                // check('no_bpkb')
                //     .not().isEmpty()
                //     .withMessage(`nomor bpkb kendaraan Tidak Boleh Kosong`),
                // check('stnk')
                //     .not().isEmpty()
                //     .withMessage(`stnk kendaraan Tidak Boleh Kosong`),
                // check('tgl_stnk')
                //     .not().isEmpty()
                //     .withMessage(`tanggal stnk kendaraan Tidak Boleh Kosong`),
                // check('tgl_plat_nomor')
                //     .not().isEmpty()
                //     .withMessage(`tanggal play nomor kendaraan Tidak Boleh Kosong`),
                // check('tgl_kir')
                //     .not().isEmpty()
                //     .withMessage(`tanggal kir kendaraan Tidak Boleh Kosong`),
                // check('kapasitas')
                //     .not().isEmpty()
                //     .withMessage(`kapasitas kendaraan Tidak Boleh Kosong`),
                // check('kapasitas_maks')
                //     .not().isEmpty()
                //     .withMessage(`kapasitas maks kendaraan Tidak Boleh Kosong`),
                // check('kubikasi')
                //     .not().isEmpty()
                //     .withMessage(`kubikasi kendaraan masuk Tidak Boleh Kosong`),
                // check('location')
                //     .not().isEmpty()
                //     .withMessage(`location kendaraan masuk Tidak Boleh Kosong`),
            ]
        }
        case 'edit-vehicle': {
            return [
                // check('id')
                //     .not().isEmpty()
                //     .withMessage(`ID kendaraan Tidak Boleh Kosong`),
                // check('kode_kendaraan')
                //     .not().isEmpty()
                //     .withMessage(`kode kendaraan Tidak Boleh Kosong`),
                // check('id_driver')
                //     .not().isEmpty()
                //     .withMessage(`ID driver Tidak Boleh Kosong`),
                // check('no_polisi')
                //     .not().isEmpty()
                //     .withMessage(`nomor polisi Tidak Boleh Kosong`),
                // check('vendor')
                //     .not().isEmpty()
                //     .withMessage(`vendor Tidak Boleh Kosong`),
                // check('jenis_kendaraan')
                //     .not().isEmpty()
                //     .withMessage(`jenis kendaraan Tidak Boleh Kosong`),
                // check('merk_mobil')
                //     .not().isEmpty()
                //     .withMessage(`merk mobil Tidak Boleh Kosong`),
                // check('tahun_mobil')
                //     .not().isEmpty()
                //     .withMessage(`tahun mobil Tidak Boleh Kosong`),
                // check('warna_plat')
                //     .not().isEmpty()
                //     .withMessage(`warna plat Tidak Boleh Kosong`),
                // check('tgl_beli')
                //     .not().isEmpty()
                //     .withMessage(`tanggal beli Tidak Boleh Kosong`),
                // check('panjang')
                //     .not().isEmpty()
                //     .withMessage(`panjang kendaraan Tidak Boleh Kosong`),
                // check('lebar')
                //     .not().isEmpty()
                //     .withMessage(`lebar kenaraan Tidak Boleh Kosong`),
                // check('tinggi')
                //     .not().isEmpty()
                //     .withMessage(`tinggi kendaraan Tidak Boleh Kosong`),
                // check('no_bpkb')
                //     .not().isEmpty()
                //     .withMessage(`nomor bpkb kendaraan Tidak Boleh Kosong`),
                // check('stnk')
                //     .not().isEmpty()
                //     .withMessage(`stnk kendaraan Tidak Boleh Kosong`),
                // check('tgl_stnk')
                //     .not().isEmpty()
                //     .withMessage(`tanggal stnk kendaraan Tidak Boleh Kosong`),
                // check('kapasitas')
                //     .not().isEmpty()
                //     .withMessage(`kapasitas kendaraan Tidak Boleh Kosong`),
                // check('kapasitas_maks')
                //     .not().isEmpty()
                //     .withMessage(`kapasitas maks kendaraan Tidak Boleh Kosong`),
                // check('kubikasi')
                //     .not().isEmpty()
                //     .withMessage(`kubikasi kendaraan masuk Tidak Boleh Kosong`),
                // check('location')
                //     .not().isEmpty()
                //     .withMessage(`location kendaraan masuk Tidak Boleh Kosong`),
            ]
        }
        case 'upload-vehicle-photo': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Vehicle Tidak Boleh Kosong`)
            ]
        }

        case 'on-vehicle': {
            return [
                check('id_vehicle')
                    .not().isEmpty()
                    .withMessage(`ID Vehicle Tidak Boleh Kosong`)
            ]
        }
        case 'off-vehicle': {
            return [
                check('id_vehicle')
                    .not().isEmpty()
                    .withMessage(`ID Vehicle Tidak Boleh Kosong`)
            ]
        }

        case 'create-type': {
            return [
                check('jenis')
                    .not().isEmpty()
                    .withMessage(`Jenis Tipe Tidak Boleh Kosong`)
            ]
        }

        case 'del-type': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Tipe Tidak Boleh Kosong`)
            ]
        }
    }
}