const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kecamatan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kecamatan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kecamatan',
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
