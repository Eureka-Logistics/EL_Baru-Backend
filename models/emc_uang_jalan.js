const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_uang_jalan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: ""
    },
    nopol: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: ""
    },
    driver: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: ""
    },
    nominal_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    riil_bbm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_partol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_dll: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_pengaju: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_acc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_acc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    date_pengajuan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_ptj: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'emc_uang_jalan',
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
