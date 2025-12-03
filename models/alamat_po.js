const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alamat_po', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_po: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_pu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipe: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    sm: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    berat: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    ov: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    volume: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    harga: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biayaov: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ht: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'alamat_po',
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
