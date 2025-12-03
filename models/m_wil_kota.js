const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_wil_kota', {
    id_kota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_kota: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_wil_kota',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_kota" },
        ]
      },
    ]
  });
};
