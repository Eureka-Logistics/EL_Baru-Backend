const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ebh_product', {
    id_product: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_category_sub: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    product_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ""
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    product_foto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'ebh_product',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_product" },
        ]
      },
    ]
  });
};
