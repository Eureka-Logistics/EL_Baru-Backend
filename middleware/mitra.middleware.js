const core = require('../config/core.config')
const models = core.models()
const { check } = require('express-validator')
const db = require('../config/db.config')

const CryptoJS = core.CryptoJS


exports.validate = (method) => {
    switch (method) {
        case 'get-mitra': {
            return [
                check('page')
                    .not().isEmpty()
                    .withMessage(`Page Tidak Boleh Kosong`),
                check('limit')
                    .not().isEmpty()
                    .withMessage(`Limit Tidak Boleh Kosong`),
            ]
        }
        case 'get-detail-mitra': {
            return [
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra Tidak Boleh Kosong`),
            ]
        }  
        case 'get-mitra-pic': {
            return [
                check('mitra_id')
                    .not().isEmpty()
                    .withMessage(`ID Mitra Tidak Boleh Kosong`),
            ]
        }
            
        case 'create-mitra': {
            return [
                check('kode')
                    .not().isEmpty()
                    .withMessage(`Kode Perusahaan Tidak Boleh Kosong`),
                check('title')
                    .not().isEmpty()
                    .withMessage(`Title Tidak Boleh Kosong`),
                check('nama_mitra')
                    .not().isEmpty()
                    .withMessage(`Nama Mitra Tidak Boleh Kosong`),
                check('jenis')
                    .not().isEmpty()
                    .withMessage(`Jenis Tidak Boleh Kosong`),
                check('jenis_usaha')
                    .not().isEmpty()
                    .withMessage(`Jenis Usaha Tidak Boleh Kosong`),
                check('kepemilikan')
                    .not().isEmpty()
                    .withMessage(`Kepemilikan Tidak Boleh Kosong`),
                check('jumlah_armada')
                    .not().isEmpty()
                    .withMessage(`Jumlah Armada Tidak Boleh Kosong`),
                check('jumlah_sdm_operasional')
                    .not().isEmpty()
                    .withMessage(`Jumlah SDM Operasional Tidak Boleh Kosong`),
                check('cabang')
                    .not().isEmpty()
                    .withMessage(`Cabang Tidak Boleh Kosong`),
                check('jenis_kiriman')
                    .not().isEmpty()
                    .withMessage(`Jenis Kiriman Tidak Boleh Kosong`),
                check('wilayah')
                    .not().isEmpty()
                    .withMessage(`Wilayah Tidak Boleh Kosong`),
                check('tujuan')
                    .not().isEmpty()
                    .withMessage(`Tujuan Tidak Boleh Kosong`),
                check('awal_kontrak')
                    .not().isEmpty()
                    .withMessage(`Awal Kontrak Tidak Boleh Kosong`),
                check('akhir_kontrak')
                    .not().isEmpty()
                    .withMessage(`Akhir Kontrak Tidak Boleh Kosong`),
                check('direktur')
                    .not().isEmpty()
                    .withMessage(`Direktur Tidak Boleh Kosong`),
                check('npwp_id')
                    .not().isEmpty()
                    .withMessage(`No NPWP Tidak Boleh Kosong`),
                check('npwp_name')
                    .not().isEmpty()
                    .withMessage(`Nama NPWP Tidak Boleh Kosong`),
                check('npwp_address')
                    .not().isEmpty()
                    .withMessage(`Alamat NPWP Tidak Boleh Kosong`),
                check('npwp_jalan')
                    .not().isEmpty()
                    .withMessage(`NPWP Jalan Tidak Boleh Kosong`),
                check('npwp_blok')
                    .not().isEmpty()
                    .withMessage(`NPWP Blok Tidak Boleh Kosong`),
                check('npwp_nomor')
                    .not().isEmpty()
                    .withMessage(`NPWP No Jalan Tidak Boleh Kosong`),
                check('npwp_rt')
                    .not().isEmpty()
                    .withMessage(`NPWP RT Tidak Boleh Kosong`),
                check('npwp_rw')
                    .not().isEmpty()
                    .withMessage(`NPWP RW Tidak Boleh Kosong`),
                check('npwp_kelurahan')
                    .not().isEmpty()
                    .withMessage(`NPWP Kelurahan Tidak Boleh Kosong`),
                check('npwp_kecamatan')
                    .not().isEmpty()
                    .withMessage(`NPWP Kecamatan Tidak Boleh Kosong`),
                check('npwp_kota')
                    .not().isEmpty()
                    .withMessage(`NPWP RT Tidak Boleh Kosong`),
                check('npwp_provinsi')
                    .not().isEmpty()
                    .withMessage(`NPWP Provinsi Tidak Boleh Kosong`),
                check('npwp_kodepos')
                    .not().isEmpty()
                    .withMessage(`NPWP Kodepos Tidak Boleh Kosong`),
                check('telepon')
                    .not().isEmpty()
                    .withMessage(`Telepon Perusahaan Tidak Boleh Kosong`),
                check('contact_person')
                    .not().isEmpty()
                    .withMessage(`Contact Person Tidak Boleh Kosong`),
                check('telp')
                    .not().isEmpty()
                    .withMessage(`Telp Tidak Boleh Kosong`),
                check('fax')
                    .not().isEmpty()
                    .withMessage(`fax Tidak Boleh Kosong`),
                check('email')
                    .not().isEmpty()
                    .withMessage(`Email Tidak Boleh Kosong`),
                check('alamat')
                    .not().isEmpty()
                    .withMessage(`Alamat Tidak Boleh Kosong`),
                check('homepage')
                    .not().isEmpty()
                    .withMessage(`Website Tidak Boleh Kosong`),
                check('pembayaran')
                    .not().isEmpty()
                    .withMessage(`Pembayaran Tidak Boleh Kosong`),
                check('nama_bank')
                    .not().isEmpty()
                    .withMessage(`Nama Bank Tidak Boleh Kosong`),
                check('nama_akun')
                    .not().isEmpty()
                    .withMessage(`Nama PIC Bank Tidak Boleh Kosong`),
                check('no_rek')
                    .not().isEmpty()
                    .withMessage(`No Rek Tidak Boleh Kosong`),
                check('status_usaha')
                    .not().isEmpty()
                    .withMessage(`Status Usaha Tidak Boleh Kosong`),
                check('metode_pembayaran')
                    .not().isEmpty()
                    .withMessage(`Metode Pembayaran Tidak Boleh Kosong`),
                check('type')
                    .not().isEmpty()
                    .withMessage(`Type Tidak Boleh Kosong`),
            ]
        }
        case 'edit-mitra': {
            return [
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra Tidak Boleh Kosong`),
                check('kode')
                    .not().isEmpty()
                    .withMessage(`Kode Perusahaan Tidak Boleh Kosong`),
                check('title')
                    .not().isEmpty()
                    .withMessage(`Title Tidak Boleh Kosong`),
                check('nama_mitra')
                    .not().isEmpty()
                    .withMessage(`Nama Mitra Tidak Boleh Kosong`),
                check('jenis')
                    .not().isEmpty()
                    .withMessage(`Jenis Tidak Boleh Kosong`),
                check('jenis_usaha')
                    .not().isEmpty()
                    .withMessage(`Jenis Usaha Tidak Boleh Kosong`),
                check('kepemilikan')
                    .not().isEmpty()
                    .withMessage(`Kepemilikan Tidak Boleh Kosong`),
                check('jumlah_armada')
                    .not().isEmpty()
                    .withMessage(`Jumlah Armada Tidak Boleh Kosong`),
                check('jumlah_sdm_operasional')
                    .not().isEmpty()
                    .withMessage(`Jumlah SDM Operasional Tidak Boleh Kosong`),
                check('cabang')
                    .not().isEmpty()
                    .withMessage(`Cabang Tidak Boleh Kosong`),
                check('jenis_kiriman')
                    .not().isEmpty()
                    .withMessage(`Jenis Kiriman Tidak Boleh Kosong`),
                check('wilayah')
                    .not().isEmpty()
                    .withMessage(`Wilayah Tidak Boleh Kosong`),
                check('tujuan')
                    .not().isEmpty()
                    .withMessage(`Tujuan Tidak Boleh Kosong`),
                check('awal_kontrak')
                    .not().isEmpty()
                    .withMessage(`Awal Kontrak Tidak Boleh Kosong`),
                check('akhir_kontrak')
                    .not().isEmpty()
                    .withMessage(`Akhir Kontrak Tidak Boleh Kosong`),
                check('direktur')
                    .not().isEmpty()
                    .withMessage(`Direktur Tidak Boleh Kosong`),
                check('npwp_id')
                    .not().isEmpty()
                    .withMessage(`No NPWP Tidak Boleh Kosong`),
                check('npwp_name')
                    .not().isEmpty()
                    .withMessage(`Nama NPWP Tidak Boleh Kosong`),
                check('npwp_address')
                    .not().isEmpty()
                    .withMessage(`Alamat NPWP Tidak Boleh Kosong`),
                check('npwp_jalan')
                    .not().isEmpty()
                    .withMessage(`NPWP Jalan Tidak Boleh Kosong`),
                check('npwp_blok')
                    .not().isEmpty()
                    .withMessage(`NPWP Blok Tidak Boleh Kosong`),
                check('npwp_nomor')
                    .not().isEmpty()
                    .withMessage(`NPWP No Jalan Tidak Boleh Kosong`),
                check('npwp_rt')
                    .not().isEmpty()
                    .withMessage(`NPWP RT Tidak Boleh Kosong`),
                check('npwp_rw')
                    .not().isEmpty()
                    .withMessage(`NPWP RW Tidak Boleh Kosong`),
                check('npwp_kelurahan')
                    .not().isEmpty()
                    .withMessage(`NPWP Kelurahan Tidak Boleh Kosong`),
                check('npwp_kecamatan')
                    .not().isEmpty()
                    .withMessage(`NPWP Kecamatan Tidak Boleh Kosong`),
                check('npwp_kota')
                    .not().isEmpty()
                    .withMessage(`NPWP RT Tidak Boleh Kosong`),
                check('npwp_provinsi')
                    .not().isEmpty()
                    .withMessage(`NPWP Provinsi Tidak Boleh Kosong`),
                check('npwp_kodepos')
                    .not().isEmpty()
                    .withMessage(`NPWP Kodepos Tidak Boleh Kosong`),
                check('telepon')
                    .not().isEmpty()
                    .withMessage(`Telepon Perusahaan Tidak Boleh Kosong`),
                check('contact_person')
                    .not().isEmpty()
                    .withMessage(`Contact Person Tidak Boleh Kosong`),
                check('telp')
                    .not().isEmpty()
                    .withMessage(`Telp Tidak Boleh Kosong`),
                check('fax')
                    .not().isEmpty()
                    .withMessage(`fax Tidak Boleh Kosong`),
                check('email')
                    .not().isEmpty()
                    .withMessage(`Email Tidak Boleh Kosong`),
                check('alamat')
                    .not().isEmpty()
                    .withMessage(`Alamat Tidak Boleh Kosong`),
                check('homepage')
                    .not().isEmpty()
                    .withMessage(`Website Tidak Boleh Kosong`),
                check('pembayaran')
                    .not().isEmpty()
                    .withMessage(`Pembayaran Tidak Boleh Kosong`),
                check('nama_bank')
                    .not().isEmpty()
                    .withMessage(`Nama Bank Tidak Boleh Kosong`),
                check('nama_akun')
                    .not().isEmpty()
                    .withMessage(`Nama PIC Bank Tidak Boleh Kosong`),
                check('no_rek')
                    .not().isEmpty()
                    .withMessage(`No Rek Tidak Boleh Kosong`),
                check('status_usaha')
                    .not().isEmpty()
                    .withMessage(`Status Usaha Tidak Boleh Kosong`),
                check('metode_pembayaran')
                    .not().isEmpty()
                    .withMessage(`Metode Pembayaran Tidak Boleh Kosong`),
                check('type')
                    .not().isEmpty()
                    .withMessage(`Type Tidak Boleh Kosong`),
            ]
        }
        case 'del-mitra': {
            return [
                check('id')
                    .not().isEmpty()
                    .withMessage(`ID Mitra Tidak Boleh Kosong`),
            ]
        }
            
        case 'create-mitra-pic': {
            return [
                check('id_mitra')
                    .not().isEmpty()
                    .withMessage(`ID Mitra Tidak Boleh Kosong`),
                check('nama')
                    .not().isEmpty()
                    .withMessage(`Nama PIC Tidak Boleh Kosong`),
                check('telepon')
                    .not().isEmpty()
                    .withMessage(`No Telp Tidak Boleh Kosong`),
                check('email')
                    .not().isEmpty()
                    .withMessage(`Email Tidak Boleh Kosong`),
                check('jabatan')
                    .not().isEmpty()
                    .withMessage(`Jabatan Tidak Boleh Kosong`),
                check('ktp')
                    .not().isEmpty()
                    .withMessage(`No NIK KTP Tidak Boleh Kosong`),
            ]
        }
        case 'edit-mitra-pic': {
            return [
                check('id_mitra_pic')
                    .not().isEmpty()
                    .withMessage(`ID Mitra PIC Tidak Boleh Kosong`),
                check('nama')
                    .not().isEmpty()
                    .withMessage(`Nama PIC Tidak Boleh Kosong`),
                check('telepon')
                    .not().isEmpty()
                    .withMessage(`No Telp Tidak Boleh Kosong`),
                check('email')
                    .not().isEmpty()
                    .withMessage(`Email Tidak Boleh Kosong`),
                check('jabatan')
                    .not().isEmpty()
                    .withMessage(`Jabatan Tidak Boleh Kosong`),
                check('ktp')
                    .not().isEmpty()
                    .withMessage(`No NIK KTP Tidak Boleh Kosong`),
            ]
        }
        case 'delete-mitra-pic': {
            return [
                check('id_mitra_pic')
                    .not().isEmpty()
                    .withMessage(`ID Mitra PIC Tidak Boleh Kosong`),
            ]
        }
    }
}