const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_customer_voucher', {
    id_voucher: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    voucher_code: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    voucher_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_expired: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    date_create: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_customer_voucher',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_voucher" },
        ]
      },
    ]
  });
};
