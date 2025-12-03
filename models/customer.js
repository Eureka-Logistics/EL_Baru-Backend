const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer', {
    id_customer: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    akun: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kode_customer: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    nama_perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jenis_usaha: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    jenis_barang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    jenis_transaksi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jenis_layanan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jenis_entitas: {
      type: DataTypes.ENUM('Perorangan', 'PT', 'CV'),
      allowNull: true
    },
    tgl_bediri: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tahun_berdiri: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    npwp: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    alamat_npwp: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "JL. H BAPING RAYA, GG ASEM  Blok- No.40 RT:6 RW:9 Kec:CIRACAS Kel:CIRACAS Kota\/Kab.JAKARTA TIMUR DKI JAKARTA     13740"
    },
    ktp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tdp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    siup: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pkp: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    tax_pic: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tax_position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tax_phone_office: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tax_mobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tax_email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    invoice_pic: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    invoice_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    invoice_position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    invoice_phone_office: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    invoice_mobile: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    invoice_email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pic_office: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    pic_position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pic_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pic_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pic_fax: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pic_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pic_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    alamat_kantor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telepon: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    hp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    fax: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bank_pic: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bank_position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bank_phone_office: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bank_mobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bank_email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nama_bank: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nama_akun: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_rek: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    mata_uang: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "Rupiah (Rp)"
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_pembayaran: {
      type: DataTypes.ENUM('Cash','Credit',''),
      allowNull: false,
      defaultValue: "Cash"
    },
    jenis_angkutan: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    kemasan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    unique_cus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    foto_kantor: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_pic: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_ktp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_npwp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    manager: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    manager_memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    manager_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    akunting: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    akunting_memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    akunting_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    direktur: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    direktur_memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    direktur_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mou_file: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    mou_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mou_expired: {
      type: DataTypes.DATE,
      allowNull: true
    },
    surat_pelayanan: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    surat_pelayanan_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    surat_pelayanan_expired: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tgl_bergabung: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_bp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    new: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
      {
        name: "id_sales",
        using: "BTREE",
        fields: [
          { name: "id_sales" },
        ]
      },
      {
        name: "nama_perusahaan",
        using: "BTREE",
        fields: [
          { name: "nama_perusahaan" },
        ]
      },
      {
        name: "kode_customer",
        using: "BTREE",
        fields: [
          { name: "kode_customer" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
    ]
  });
};
