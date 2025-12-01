const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_po', {
    id_mpo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mpo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    top: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "30"
    },
    overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_kg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_bongkar_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_inap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_keseluruhan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_kirim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    kontainer: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    seal: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    supir: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    telp: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_po: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    approved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    app_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    app_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    app_act: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    app_user_act: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    app_date_act: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status_sendmail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_sendmail: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_po',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mpo" },
        ]
      },
      {
        name: "mpo",
        using: "BTREE",
        fields: [
          { name: "mpo" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
      {
        name: "service",
        using: "BTREE",
        fields: [
          { name: "service" },
        ]
      },
      {
        name: "top",
        using: "BTREE",
        fields: [
          { name: "top" },
        ]
      },
      {
        name: "overtonase",
        using: "BTREE",
        fields: [
          { name: "overtonase" },
        ]
      },
      {
        name: "biaya_kg",
        using: "BTREE",
        fields: [
          { name: "biaya_kg" },
        ]
      },
      {
        name: "biaya_overtonase",
        using: "BTREE",
        fields: [
          { name: "biaya_overtonase" },
        ]
      },
      {
        name: "biaya_muat",
        using: "BTREE",
        fields: [
          { name: "biaya_muat" },
        ]
      },
      {
        name: "biaya_bongkar_muat",
        using: "BTREE",
        fields: [
          { name: "biaya_bongkar_muat" },
        ]
      },
      {
        name: "biaya_inap",
        using: "BTREE",
        fields: [
          { name: "biaya_inap" },
        ]
      },
      {
        name: "biaya_lain",
        using: "BTREE",
        fields: [
          { name: "biaya_lain" },
        ]
      },
      {
        name: "tgl_kirim",
        using: "BTREE",
        fields: [
          { name: "tgl_kirim" },
        ]
      },
      {
        name: "via",
        using: "BTREE",
        fields: [
          { name: "via" },
        ]
      },
      {
        name: "kendaraan",
        using: "BTREE",
        fields: [
          { name: "kendaraan" },
        ]
      },
      {
        name: "nopol",
        using: "BTREE",
        fields: [
          { name: "nopol" },
        ]
      },
      {
        name: "tgl_po",
        using: "BTREE",
        fields: [
          { name: "tgl_po" },
        ]
      },
    ]
  });
};
