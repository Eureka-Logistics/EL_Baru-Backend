const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tarif', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pickup: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kecamatan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tarif_net: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    e1: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    e2: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    estimasi: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tarif',
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
