const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_policy', {
    id_customer_policy: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    muat_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    muat_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tkbm_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    tkbm_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    overtonase_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    overtonase_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    penyeberangan_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    penyeberangan_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    uang_inap_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    uang_inap_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tol_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    tol_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    timbangan_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    timbangan_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    karantina_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    karantina_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    inap_chargeable: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: true,
      defaultValue: 'N'
    },
    inap_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    bongkar_chargeable: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    bongkar_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'customer_policy',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [ { name: 'id_customer_policy' } ]
      },
      {
        name: 'id_customer',
        using: 'BTREE',
        fields: [ { name: 'id_customer' } ]
      }
    ]
  });
};