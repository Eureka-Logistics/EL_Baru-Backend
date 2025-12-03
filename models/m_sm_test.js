const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_test', {
    id_msm: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mpd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra_pickup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    id_mitra_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    msm: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ""
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tgl_muat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_bongkar: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tgl_eta: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    waktu_muat: {
      type: DataTypes.TIME,
      allowNull: true
    },
    waktu_bongkar: {
      type: DataTypes.TIME,
      allowNull: true
    },
    pembungkus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    do: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_unit_2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_unit_3: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_driver_2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_driver_3: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pickup_kendaraan: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "0"
    },
    kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    kendaraan_2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pickup_kontainer: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    kontainer: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    kontainer_2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pickup_nopol: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nopol: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nopol_2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pickup_supir: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    supir: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    supir_2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pickup_telp: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    telp: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    telp_2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    seal: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    nama_kapal: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kapal_berangkat: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    print_sm: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status_ap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_invoice_ap: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    tgl_terima_inv: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    keterangan_ap: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status_perubahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_pembatalan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_sm_test',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
      {
        name: "id_mpd",
        using: "BTREE",
        fields: [
          { name: "id_mpd" },
        ]
      },
      {
        name: "msm",
        using: "BTREE",
        fields: [
          { name: "msm" },
        ]
      },
      {
        name: "id_msm",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
      {
        name: "id_mitra_pickup",
        using: "BTREE",
        fields: [
          { name: "id_mitra_pickup" },
        ]
      },
      {
        name: "tgl_muat",
        using: "BTREE",
        fields: [
          { name: "tgl_muat" },
        ]
      },
      {
        name: "status_date",
        using: "BTREE",
        fields: [
          { name: "status_date" },
        ]
      },
      {
        name: "kendaraan",
        using: "BTREE",
        fields: [
          { name: "kendaraan" },
          { name: "nopol" },
          { name: "supir" },
          { name: "kendaraan_2" },
          { name: "kontainer" },
          { name: "kontainer_2" },
          { name: "nopol_2" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
          { name: "id_mitra_2" },
        ]
      },
    ]
  });
};
