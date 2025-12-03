const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_vehicle_status', {
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
    id_pengemudi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 34
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kondisi_kendaraan: {
      type: DataTypes.ENUM('Ready','No Ready'),
      allowNull: false,
      defaultValue: "Ready"
    },
    empty_load: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    muatan: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "-"
    },
    posisi: {
      type: DataTypes.STRING(125),
      allowNull: false,
      defaultValue: ""
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false
    },
    tujuan: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "-"
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_vehicle_status',
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
    ]
  });
};
