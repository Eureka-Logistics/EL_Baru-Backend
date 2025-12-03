const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_smu', {
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
      type: DataTypes.STRING(13),
      allowNull: false,
      defaultValue: ""
    },
    tgl_muat: {
      type: DataTypes.DATE,
      allowNull: false
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
    pickup_kendaraan: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "0"
    },
    kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kendaraan_2: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    pickup_kontainer: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    kontainer: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    kontainer_2: {
      type: DataTypes.STRING(5),
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
      allowNull: false
    },
    seal: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    nama_kapal: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kapal_berangkat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    keterangan_ap: {
      type: DataTypes.STRING(30),
      allowNull: false
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
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'harga overtonase': {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_bongkar_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_inap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_smu',
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
    ]
  });
};
