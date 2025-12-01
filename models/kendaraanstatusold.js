const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kendaraanstatusold', {
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
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kondisi_kendaraan: {
      type: DataTypes.ENUM('Ready','No Ready'),
      allowNull: false,
      defaultValue: "Ready"
    },
    empty_load: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    action: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'kendaraanstatusold',
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
