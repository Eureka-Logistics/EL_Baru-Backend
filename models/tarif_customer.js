const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tarif_customer', {
    id_tc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cabang: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    tipe: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tujuan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    armada: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    tarif: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    multi_drop: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif_comal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tarif_customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_tc" },
        ]
      },
    ]
  });
};
