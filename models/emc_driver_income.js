const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_driver_income', {
    id_driver_pendapatan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    income_persen: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    income_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_driver_income',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_driver_pendapatan" },
        ]
      },
    ]
  });
};
