const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_kota', {
    id_kota: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kota: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kode_cabang: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_kota',
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
