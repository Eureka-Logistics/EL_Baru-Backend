const core = require('../../config/core.config')
const models = core.models();
const customErrorMiddleware = require('../../middleware/middleware.result');
const { Op } = require('sequelize');

// Helper function untuk default value
const val = (v, d) => (v === undefined || v === null || v === '' ? d : v);

exports.createFromOdoo = async (req, res) => {
    let output = {
        status: {
            code: 500,
            message: 'Internal server error'
        }
    };

    try {
        // Handle payload dari Odoo: { datas: [...] } atau langsung array
        let dataArray = [];
        if (req.body.datas && Array.isArray(req.body.datas)) {
            dataArray = req.body.datas;
        } else if (Array.isArray(req.body)) {
            dataArray = req.body;
        } else if (req.body) {
            dataArray = [req.body];
        }

        if (dataArray.length === 0) {
            output = {
                message: 'Payload kosong atau format tidak valid',
                status: 400
            };
            return res.status(400).send(output);
        }

        const results = {
            inserted: [],
            updated: [],
            errors: []
        };

        for (const item of dataArray) {
            try {
                // Get ID dari Odoo (bisa dari id, id_odoo, atau company_id jika ada)
                const idOdoo = item.id || item.id_odoo || item.company_id;
                const isPelanggan = item.is_pelanggan === 1 || item.is_pelanggan === true || item.is_pelanggan === '1';
                const isVendor = item.is_vendor === 1 || item.is_vendor === true || item.is_vendor === '1';
                const isUpdate = item.is_update === 1 || item.is_update === true || item.is_update === '1';

                if (!idOdoo) {
                    results.errors.push({
                        data: item,
                        error: 'id, id_odoo, atau company_id tidak ditemukan'
                    });
                    continue;
                }

                // Pastikan idOdoo adalah integer
                const idOdooInt = parseInt(idOdoo, 10);
                if (isNaN(idOdooInt)) {
                    results.errors.push({
                        data: item,
                        error: 'id_odoo harus berupa angka'
                    });
                    continue;
                }

                // Handle Customer
                if (isPelanggan) {
                    const existingCustomer = await models.customer.findOne({
                        where: {
                            id_odoo: idOdooInt
                        }
                    });

                    // Mapping field dari Odoo ke database
                    const customerData = {
                        id_odoo: idOdooInt,
                        parent_id: 0,
                        id_sales: 1, // Default sales, bisa disesuaikan
                        akun: val(item.akun, ''),
                        is_corporate: val(item.is_corporate, null),
                        kode_customer: val(item.code || item.kode_customer, null),
                        nama_perusahaan: val(item.name, ''),
                        perusahaan: val(item.name, ''),
                        jenis_entitas: val(item.jenis_entitas, null),
                        jenis_usaha: val(item.jenis_usaha, ''),
                        jenis_barang: val(item.jenis_barang, ''),
                        jenis_transaksi: val(item.jenis_transaksi, ''),
                        jenis_layanan: val(item.jenis_layanan, ''),
                        tgl_bediri: val(item.tgl_bediri, core.moment().format('YYYY-MM-DD')),
                        tahun_berdiri: val(item.tahun_berdiri, ''),
                        npwp: val(item.npwp, ''),
                        alamat_npwp: val(item.alamat_npwp || item.address, ''),
                        ktp: val(item.ktp, ''),
                        tdp: val(item.tdp, ''),
                        siup: val(item.siup, ''),
                        pkp: val(item.pkp === 1 || item.pkp === '1' ? 'PKP' : '', ''),
                        tax_pic: val(item.tax_pic, ''),
                        tax_position: val(item.tax_position, ''),
                        tax_phone_office: val(item.tax_phone_office, null),
                        tax_mobile: val(item.tax_mobile, null),
                        tax_email: val(item.tax_email, ''),
                        invoice_pic: val(item.invoice_pic, ''),
                        invoice_address: val(item.invoice_address || item.address, ''),
                        invoice_position: val(item.invoice_position, ''),
                        invoice_phone_office: val(item.invoice_phone_office, null),
                        invoice_mobile: val(item.invoice_mobile, null),
                        invoice_email: val(item.invoice_email, ''),
                        pic_office: val(item.pic_office, ''),
                        pic_position: val(item.pic_position, ''),
                        pic_phone: val(item.phone || item.pic_phone, ''),
                        pic_number: val(item.phone2 || item.mobile || item.pic_number, ''),
                        pic_fax: val(item.pic_fax, ''),
                        pic_email: val(item.email || item.pic_email, ''),
                        pic_birth: val(item.pic_birth, null),
                        alamat_kantor: val(item.address || item.alamat_kantor, ''),
                        telepon: val(item.phone || item.telepon, ''),
                        hp: val(item.phone2 || item.mobile || item.hp, ''),
                        fax: val(item.fax, ''),
                        email: val(item.email, ''),
                        bank_pic: val(item.bank_pic, ''),
                        bank_position: val(item.bank_position, ''),
                        bank_phone_office: val(item.bank_phone_office, null),
                        bank_mobile: val(item.bank_mobile, null),
                        bank_email: val(item.bank_email, ''),
                        nama_bank: val(item.rek_cabang ? item.rek_cabang.split(' - ')[0] : item.nama_bank, ''),
                        nama_akun: val(item.rek_milik || item.nama_akun, ''),
                        no_rek: val(item.rek_no || item.no_rek, ''),
                        mata_uang: val(item.mata_uang, 'Rupiah (Rp)'),
                        top: val(item.top || item.limit_piutang, 0),
                        jenis_pembayaran: val(item.jenis_pembayaran, 'Cash'),
                        jenis_angkutan: val(item.jenis_angkutan, ''),
                        kemasan: val(item.kemasan, ''),
                        unique_cus: 0,
                        foto_kantor: val(item.foto_kantor, ''),
                        foto_pic: val(item.foto_pic, ''),
                        foto_ktp: val(item.foto_ktp, ''),
                        foto_npwp: val(item.foto_npwp, ''),
                        manager: val(item.manager, 'N'),
                        manager_memo: val(item.manager_memo, ''),
                        manager_date: val(item.manager_date, core.moment().format('YYYY-MM-DD HH:mm:ss')),
                        akunting: val(item.akunting, 'N'),
                        akunting_memo: val(item.akunting_memo, ''),
                        akunting_date: val(item.akunting_date, core.moment().format('YYYY-MM-DD HH:mm:ss')),
                        direktur: val(item.direktur, 'N'),
                        direktur_memo: val(item.direktur_memo, ''),
                        direktur_date: val(item.direktur_date, core.moment().format('YYYY-MM-DD HH:mm:ss')),
                        mou_file: val(item.mou_file, 'N'),
                        mou_number: val(item.mou_number, null),
                        mou_expired: val(item.mou_expired, null),
                        surat_pelayanan: val(item.surat_pelayanan, 'N'),
                        surat_pelayanan_number: val(item.surat_pelayanan_number, null),
                        surat_pelayanan_expired: val(item.surat_pelayanan_expired, null),
                        tgl_bergabung: core.moment().format('YYYY-MM-DD HH:mm:ss'),
                        status: val(item.status, 1),
                        status_bp: val(item.status_bp, 0),
                        new: val(item.new, 1),
                        lat: val(item.latitude || item.lat, 0.0000000),
                        lon: val(item.longitude || item.lon, 0.0000000),
                        is_deleted: 0,
                        id_bu: val(item.company_id || item.id_bu, 11)
                    };

                    // Jika is_update = 1 atau data sudah ada, lakukan update
                    if (isUpdate || existingCustomer) {
                        if (existingCustomer) {
                            await models.customer.update(customerData, {
                                where: {
                                    id_odoo: idOdooInt
                                }
                            });
                        } else {
                            // Jika is_update tapi data belum ada, tetap insert
                            const newCustomer = await models.customer.create(customerData);
                            results.inserted.push({
                                id_odoo: idOdooInt,
                                type: 'customer',
                                id_customer: newCustomer.id_customer,
                                nama_perusahaan: customerData.nama_perusahaan
                            });
                            continue;
                        }
                        results.updated.push({
                            id_odoo: idOdooInt,
                            type: 'customer',
                            nama_perusahaan: customerData.nama_perusahaan
                        });
                    } else {
                        // Insert new customer
                        const newCustomer = await models.customer.create(customerData);
                        results.inserted.push({
                            id_odoo: idOdooInt,
                            type: 'customer',
                            id_customer: newCustomer.id_customer,
                            nama_perusahaan: customerData.nama_perusahaan
                        });
                    }
                }

                // Handle Vendor/Mitra
                if (isVendor) {
                    const existingMitra = await models.mitra.findOne({
                        where: {
                            id_odoo: idOdooInt
                        }
                    });

                    // Generate default dates untuk kontrak jika tidak ada
                    const defaultAwalKontrak = val(item.awal_kontrak, core.moment().format('YYYY-MM-DD'));
                    const defaultAkhirKontrak = val(item.akhir_kontrak, core.moment().add(1, 'year').format('YYYY-MM-DD'));
                    const awalKontrak = core.moment(defaultAwalKontrak);
                    const akhirKontrak = core.moment(defaultAkhirKontrak);
                    const kontrak = akhirKontrak.diff(awalKontrak, 'years');

                    // Mapping field dari Odoo ke database
                    const mitraData = {
                        id_odoo: idOdooInt,
                        kode_mitra: val(item.code || item.kode_mitra, null),
                        kode: val(item.code || item.kode, null),
                        qrcode: val(item.qrcode, ''),
                        title: val(item.title, ''),
                        nama_mitra: val(item.name, ''),
                        jenis: val(item.jenis, ''),
                        jenis_usaha: val(item.jenis_usaha, ''),
                        kepemilikan: val(item.kepemilikan, ''),
                        jumlah_armada: val(item.jumlah_armada, 0),
                        jumlah_sdm_operasional: val(item.jumlah_sdm_operasional, 0),
                        cabang: val(item.cabang, ''),
                        jenis_kiriman: val(item.jenis_kiriman, '[]'),
                        wilayah: val(item.wilayah, ''),
                        tujuan: val(item.tujuan, ''),
                        tahun_awal_kontrak: val(item.tahun_awal_kontrak, awalKontrak.format('YYYY')),
                        awal_kontrak: defaultAwalKontrak,
                        akhir_kontrak: defaultAkhirKontrak,
                        kontrak: val(item.kontrak, kontrak.toString()),
                        direktur: val(item.direktur, ''),
                        tahun_berdiri: val(item.tahun_berdiri, ''),
                        npwp_id: val(item.npwp || item.npwp_id, ''),
                        npwp_name: val(item.npwp_name || item.name, ''),
                        npwp_address: val(item.npwp_address || item.address, ''),
                        npwp_jalan: val(item.npwp_jalan, ''),
                        npwp_blok: val(item.npwp_blok, ''),
                        npwp_nomor: val(item.npwp_nomor, ''),
                        npwp_rt: val(item.npwp_rt, ''),
                        npwp_rw: val(item.npwp_rw, ''),
                        npwp_kelurahan: val(item.npwp_kelurahan, ''),
                        npwp_kecamatan: val(item.npwp_kecamatan, ''),
                        npwp_kota: val(item.city_name || item.npwp_kota, ''),
                        npwp_provinsi: val(item.npwp_provinsi, ''),
                        npwp_kodepos: val(item.postal_code ? parseInt(item.postal_code) : item.npwp_kodepos, 0),
                        is_taxable: val(item.pkp === 1 || item.pkp === '1' ? 1 : item.is_taxable, 0),
                        telepon: val(item.phone || item.telepon, ''),
                        contact_person: val(item.contact_person, ''),
                        telp: val(item.phone || item.telp, ''),
                        fax: val(item.fax, ''),
                        email: val(item.email, ''),
                        alamat: val(item.address || item.alamat, ''),
                        homepage: val(item.homepage, ''),
                        pembayaran: val(item.pembayaran, ''),
                        nama_bank: val(item.rek_cabang ? item.rek_cabang.split(' - ')[0] : item.nama_bank, ''),
                        nama_akun: val(item.rek_milik || item.nama_akun, ''),
                        no_rek: val(item.rek_no || item.no_rek, ''),
                        currency: val(item.currency, ''),
                        po_legalitas: val(item.po_legalitas, 'TIDAK'),
                        ktp_legalitas: val(item.ktp_legalitas, 'TIDAK'),
                        akta_pendirian: val(item.akta_pendirian, 'TIDAK'),
                        akta_perubahan_dasar: val(item.akta_perubahan_dasar, 'TIDAK'),
                        akta_susunan_direksi: val(item.akta_susunan_direksi, 'TIDAK'),
                        surat_domisili: val(item.surat_domisili, 'TIDAK'),
                        npwp_legalitas: val(item.npwp_legalitas, 'TIDAK'),
                        skt_legalitas: val(item.skt_legalitas, ''),
                        nppkp_legalitas: val(item.nppkp_legalitas, 'TIDAK'),
                        siup_legalitas: val(item.siup_legalitas, 'TIDAK'),
                        ijin_pendirian: val(item.ijin_pendirian, 'TIDAK'),
                        ppmd_legalitas: val(item.ppmd_legalitas, 'TIDAK'),
                        ijin_usaha: val(item.ijin_usaha, 'TIDAK'),
                        tdp_legalitas: val(item.tdp_legalitas, 'TIDAK'),
                        surat_kuasa: val(item.surat_kuasa, 'TIDAK'),
                        lama_bekerja: val(item.lama_bekerja, 0),
                        jenis_kartu_kredit: val(item.jenis_kartu_kredit, ''),
                        bank_penerbit: val(item.bank_penerbit, ''),
                        laporan_keuangan: val(item.laporan_keuangan, 'TIDAK'),
                        lama_usaha: val(item.lama_usaha, 0),
                        status_usaha: val(item.status_usaha, ''),
                        omset_bulanan: val(item.omset_bulanan, 0),
                        asset_tanah: val(item.asset_tanah, 'MILIK SENDIRI'),
                        asset_bangunan: val(item.asset_bangunan, 'MILIK SENDIRI'),
                        asset_kendaraan: val(item.asset_kendaraan, 'MILIK SENDIRI'),
                        asset_mesin: val(item.asset_mesin, 'MILIK SENDIRI'),
                        affiliasi: val(item.affiliasi, ''),
                        jumlah_unit: val(item.jumlah_unit, 0),
                        periode_sewa: val(item.periode_sewa, 0),
                        nilai_sewa: val(item.nilai_sewa, 0),
                        nilai_ruu: val(item.nilai_ruu, 0),
                        top: val(item.top, 0),
                        metode_pembayaran: val(item.metode_pembayaran, 'TUNAI'),
                        qty_motor: val(item.qty_motor, 0),
                        rp_motor: val(item.rp_motor, 0),
                        qty_grandmax: val(item.qty_grandmax, 0),
                        rp_grandmax: val(item.rp_grandmax, 0),
                        qty_l300: val(item.qty_l300, 0),
                        rp_l300: val(item.rp_l300, 0),
                        qty_traga: val(item.qty_traga, 0),
                        rp_traga: val(item.rp_traga, 0),
                        qty_cde: val(item.qty_cde, 0),
                        rp_cde: val(item.rp_cde, 0),
                        qty_cdd: val(item.qty_cdd, 0),
                        rp_cdd: val(item.rp_cdd, 0),
                        qty_fuso: val(item.qty_fuso, 0),
                        rp_fuso: val(item.rp_fuso, 0),
                        qty_wingbox: val(item.qty_wingbox, 0),
                        rp_wingbox: val(item.rp_wingbox, 0),
                        qty_trailer20: val(item.qty_trailer20, 0),
                        rp_trailer20: val(item.rp_trailer20, 0),
                        qty_trailer40: val(item.qty_trailer40, 0),
                        rp_trailer40: val(item.rp_trailer40, 0),
                        status: val(item.status, 1),
                        status_pph: val(item.status_pph, 0),
                        pph_ap: val(item.pph_ap, 1),
                        elogs: val(item.elogs, 'Y'),
                        race: val(item.race, 'Y'),
                        note: val(item.note, ''),
                        pic_id: val(item.pic_id, 47),
                        type: val(item.type, 'elogs'),
                        memo: val(item.memo, ''),
                        date_created: core.moment().format('YYYY-MM-DD HH:mm:ss'),
                        is_auto_extend: val(item.is_auto_extend, 0)
                    };

                    // Jika is_update = 1 atau data sudah ada, lakukan update
                    if (isUpdate || existingMitra) {
                        if (existingMitra) {
                            await models.mitra.update(mitraData, {
                                where: {
                                    id_odoo: idOdooInt
                                }
                            });
                        } else {
                            // Jika is_update tapi data belum ada, tetap insert
                            const newMitra = await models.mitra.create(mitraData);
                            results.inserted.push({
                                id_odoo: idOdooInt,
                                type: 'mitra',
                                id_mitra: newMitra.id_mitra,
                                nama_mitra: mitraData.nama_mitra
                            });
                            continue;
                        }
                        results.updated.push({
                            id_odoo: idOdooInt,
                            type: 'mitra',
                            nama_mitra: mitraData.nama_mitra
                        });
                    } else {
                        // Insert new mitra
                        const newMitra = await models.mitra.create(mitraData);
                        results.inserted.push({
                            id_odoo: idOdooInt,
                            type: 'mitra',
                            id_mitra: newMitra.id_mitra,
                            nama_mitra: mitraData.nama_mitra
                        });
                    }
                }

                // Jika bukan customer dan bukan vendor, skip
                if (!isPelanggan && !isVendor) {
                    results.errors.push({
                        data: item,
                        error: 'Data bukan customer (is_pelanggan=1) atau vendor (is_vendor=1)'
                    });
                }

            } catch (error) {
                results.errors.push({
                    data: item,
                    error: error.message
                });
            }
        }

        output = {
            message: 'success',
            status: 200,
            response: results
        };

    } catch (error) {
        output = {
            message: error.message || 'Internal server error',
            status: 500
        };
    }

    const errorsFromMiddleware = await customErrorMiddleware(req);

    if (!errorsFromMiddleware) {
        res.status(output.status).send(output);
    } else {
        res.status(errorsFromMiddleware.status.code).send({
            message: errorsFromMiddleware.status.message || 'Error',
            status: errorsFromMiddleware.status.code
        });
    }
};

