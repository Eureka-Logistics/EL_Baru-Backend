const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tsm', {
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
    msm: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    tgl_muat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pembungkus: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    do: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kontainer: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    seal: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    supir: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telp: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'tsm',
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
    ]
  });
};
