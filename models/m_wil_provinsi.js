const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_wil_provinsi', {
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_wil_provinsi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_provinsi" },
        ]
      },
    ]
  });
};
