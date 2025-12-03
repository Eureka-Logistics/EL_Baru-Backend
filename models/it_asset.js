const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset', {
    id_asset: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_asset_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asset_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    asset_jenis: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    asset_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    asset_brand: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    asset_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    imei: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    licensi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kondisi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    asset_nilai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date_buy: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    asset_img: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_asset" },
        ]
      },
    ]
  });
};
