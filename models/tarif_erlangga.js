const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tarif_erlangga', {
    '1000': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    '3000': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    '5000': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    '13000': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    '23000': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cabang: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tarif_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tarif_multi_drop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tarif_comal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'tarif_erlangga',
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
