const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tarif_non_erlangga', {
    id: {
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
      type: DataTypes.STRING(20),
      allowNull: false
    },
    service: {
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
    armada: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tarif: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tarif_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'tarif_non_erlangga',
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
