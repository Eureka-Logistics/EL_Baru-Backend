const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_brand', {
    id_brand: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    brand_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    brand_code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    brand_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    brand_img: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset_brand',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_brand" },
        ]
      },
    ]
  });
};
