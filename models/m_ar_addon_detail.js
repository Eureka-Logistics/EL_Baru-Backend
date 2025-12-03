const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_addon_detail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ard: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_ar_addon',
        key: 'id'
      }
    },
    addon_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addon_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    msm_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    msm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    do: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    based_on_price: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar_addon_detail',
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
      {
        name: "addon_id",
        using: "BTREE",
        fields: [
          { name: "addon_id" },
        ]
      },
      {
        name: "id_ard",
        using: "BTREE",
        fields: [
          { name: "id_ard" },
        ]
      },
    ]
  });
};
