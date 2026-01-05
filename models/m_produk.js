const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_produk', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(5),
      allowNull: true,
      primaryKey: true
    },
    message_main_attachment_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    product_tmpl_id: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    create_uid: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    write_uid: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    default_code: {
      type: DataTypes.STRING(19),
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    combination_indices: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    volume: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    can_image_variant_1024_be_zoomed: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    create_date: {
      type: DataTypes.STRING(23),
      allowNull: true
    },
    write_date: {
      type: DataTypes.STRING(23),
      allowNull: true
    },
    company_id: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    template_name: {
      type: DataTypes.STRING(89),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_produk',
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

