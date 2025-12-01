const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kendaraanstatus', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_kendaraan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_polisi: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_pengemudi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 34
    },
    nama_driver: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kondisi_kendaraan: {
      type: DataTypes.ENUM('Ready','No Ready'),
      allowNull: false,
      defaultValue: "Ready"
    },
    action: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    empty_load: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customer: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "-"
    },
    posisi: {
      type: DataTypes.STRING(125),
      allowNull: false,
      defaultValue: ""
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tujuan: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "'-'"
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('elogs','cc','driver','lain'),
      allowNull: true,
      defaultValue: null
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_create: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kendaraanstatus',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
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
        name: "id_kendaraan",
        using: "BTREE",
        fields: [
          { name: "id_kendaraan" },
        ]
      },
      {
        name: "id_pengemudi",
        using: "BTREE",
        fields: [
          { name: "id_pengemudi" },
        ]
      },
      {
        name: "action",
        using: "BTREE",
        fields: [
          { name: "action" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
