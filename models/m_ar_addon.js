const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_addon', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    non_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_nbp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addon_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_ar_addon_type',
        key: 'id'
      }
    },
    invoice: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ppn: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_delete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    sales_invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "from jurnal.id"
    }
  }, {
    sequelize,
    tableName: 'm_ar_addon',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_ar",
        using: "BTREE",
        fields: [
          { name: "id_ar" },
          { name: "invoice" },
        ]
      },
      {
        name: "addon_type_id",
        using: "BTREE",
        fields: [
          { name: "addon_type_id" },
        ]
      },
    ]
  });
};
