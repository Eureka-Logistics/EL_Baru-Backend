const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mitra', {
    id_mitra: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_mitra: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    kode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qrcode: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nama_mitra: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jenis: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    jenis_usaha: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kepemilikan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jumlah_armada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    jumlah_sdm_operasional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cabang: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jenis_kiriman: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: "[]",
      comment: "['Retail', 'Trucking','FCL','LCL']"
    },
    wilayah: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tujuan: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tahun_awal_kontrak: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    awal_kontrak: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    akhir_kontrak: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    kontrak: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    direktur: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tahun_berdiri: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    npwp_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    npwp_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    npwp_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    npwp_jalan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    npwp_blok: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    npwp_nomor: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    npwp_rt: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    npwp_rw: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    npwp_kelurahan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    npwp_kecamatan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    npwp_kota: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    npwp_provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    npwp_kodepos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_taxable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "perusahaan kena pajak"
    },
    telepon: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    contact_person: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    telp: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    homepage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pembayaran: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    nama_bank: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nama_akun: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    no_rek: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    po_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    ktp_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    akta_pendirian: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    akta_perubahan_dasar: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    akta_susunan_direksi: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    surat_domisili: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    npwp_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    skt_legalitas: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    nppkp_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    siup_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    ijin_pendirian: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    ppmd_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    ijin_usaha: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    tdp_legalitas: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    surat_kuasa: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    lama_bekerja: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_kartu_kredit: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_penerbit: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    laporan_keuangan: {
      type: DataTypes.ENUM('TIDAK','ADA'),
      allowNull: false
    },
    lama_usaha: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_usaha: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    omset_bulanan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asset_tanah: {
      type: DataTypes.ENUM('MILIK SENDIRI','SEWA'),
      allowNull: false
    },
    asset_bangunan: {
      type: DataTypes.ENUM('MILIK SENDIRI','SEWA'),
      allowNull: false
    },
    asset_kendaraan: {
      type: DataTypes.ENUM('MILIK SENDIRI','SEWA'),
      allowNull: false
    },
    asset_mesin: {
      type: DataTypes.ENUM('MILIK SENDIRI','SEWA'),
      allowNull: false
    },
    affiliasi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    jumlah_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    periode_sewa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nilai_sewa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nilai_ruu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    metode_pembayaran: {
      type: DataTypes.ENUM('TUNAI MUKA','TUNAI','CHECK','TRANSFER','CREDIT CARD'),
      allowNull: false
    },
    qty_motor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_motor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_grandmax: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_grandmax: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_l300: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_l300: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_traga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_traga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_cde: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_cde: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_cdd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_cdd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_fuso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_fuso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_wingbox: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_wingbox: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_trailer20: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_trailer20: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty_trailer40: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_trailer40: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status_pph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pph_ap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    elogs: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    race: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 47
    },
    type: {
      type: DataTypes.ENUM('elogs','race'),
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_auto_extend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'mitra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
      {
        name: "kode_mitra",
        using: "BTREE",
        fields: [
          { name: "kode_mitra" },
        ]
      },
      {
        name: "kode",
        using: "BTREE",
        fields: [
          { name: "kode" },
        ]
      },
      {
        name: "nama_mitra",
        using: "BTREE",
        fields: [
          { name: "nama_mitra" },
        ]
      },
      {
        name: "awal_kontrak",
        using: "BTREE",
        fields: [
          { name: "awal_kontrak" },
        ]
      },
      {
        name: "akhir_kontrak",
        using: "BTREE",
        fields: [
          { name: "akhir_kontrak" },
        ]
      },
      {
        name: "tahun_awal_kontrak",
        using: "BTREE",
        fields: [
          { name: "tahun_awal_kontrak" },
        ]
      },
      {
        name: "status_pph",
        using: "BTREE",
        fields: [
          { name: "status_pph" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
    ]
  });
};
