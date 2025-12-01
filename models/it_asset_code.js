const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_code', {
    id_asset_code: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    asset_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    asset_jenis: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    asset_kategori: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset_code',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_asset_code" },
        ]
      },
      {
        name: "id_asset_code",
        using: "BTREE",
        fields: [
          { name: "id_asset_code" },
        ]
      },
    ]
  });
};
