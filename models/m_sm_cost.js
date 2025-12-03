const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_cost', {
    id_msm_cost: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cost_type: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount_type: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    discount_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_ditagihkan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_approve: {
      type: DataTypes.ENUM('0','1','2',''),
      allowNull: false,
      defaultValue: '0'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    modified_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'm_sm_cost',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_msm_cost" },
        ]
      },
      {
        name: "id_msm",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
    ]
  });
};
