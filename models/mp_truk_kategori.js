const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mp_truk_kategori', {
    truk_kategori_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    truk_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    maks_berat: {
      type: DataTypes.STRING(5),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mp_truk_kategori',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "truk_kategori_id" },
        ]
      },
    ]
  });
};
