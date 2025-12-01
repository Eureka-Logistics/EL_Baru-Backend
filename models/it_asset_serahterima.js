const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_serahterima', {
    id_serahterima: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_asset: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_asset_permintaan_inventaris: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code_serahterima: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    pic_awal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pic_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset_serahterima',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_serahterima" },
        ]
      },
      {
        name: "id_serahterima",
        using: "BTREE",
        fields: [
          { name: "id_serahterima" },
        ]
      },
    ]
  });
};
