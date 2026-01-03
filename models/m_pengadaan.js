const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengadaan', {
    id_mp: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mp_ref: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    ph: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    msp: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mspk: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    tgl_pickup: {
      type: DataTypes.DATE,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 31
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    id_bu_branch: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    code_sales: {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: null
    },
    nama_sales: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null
    },
    id_gl: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    id_asm: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    id_mgr: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    id_kacab: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    id_amd: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    alamat_invoice: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    top: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    leadtime: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: ""
    },
    do: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    service: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    jenis_barang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    packing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    asuransi: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    asuransi_fee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_estimasi_tiba: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_bongkar: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    waktu_muat: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    waktu_bongkar: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    armada: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    transit: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    mitra: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kendaraan_mitra: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_muat_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_multi_drop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_mel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_jalan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    harga_selanjutnya: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_tambahan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_multi_muat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_pengganti: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_keseluruhan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "0"
    },
    print_spk: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0"
    },
    spk_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_order: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    new: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "1"
    },
    is_multi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_tarif_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_issue: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_uang_jalan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pajak: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    id_oddo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    tableName: 'm_pengadaan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mp" },
        ]
      },
      {
        name: "id_customer",
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
        name: "tgl_pickup",
        using: "BTREE",
        fields: [
          { name: "tgl_pickup" },
        ]
      },
      {
        name: "id_mp",
        using: "BTREE",
        fields: [
          { name: "id_mp" },
        ]
      },
      {
        name: "msp",
        using: "BTREE",
        fields: [
          { name: "msp" },
        ]
      },
      {
        name: "mspk",
        using: "BTREE",
        fields: [
          { name: "mspk" },
        ]
      },
      {
        name: "id_gl",
        using: "BTREE",
        fields: [
          { name: "id_gl" },
        ]
      },
      {
        name: "id_asm",
        using: "BTREE",
        fields: [
          { name: "id_asm" },
        ]
      },
      {
        name: "id_mgr",
        using: "BTREE",
        fields: [
          { name: "id_mgr" },
        ]
      },
      {
        name: "id_kacab",
        using: "BTREE",
        fields: [
          { name: "id_kacab" },
        ]
      },
      {
        name: "id_amd",
        using: "BTREE",
        fields: [
          { name: "id_amd" },
        ]
      },
      {
        name: "id_admin",
        using: "BTREE",
        fields: [
          { name: "id_admin" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
