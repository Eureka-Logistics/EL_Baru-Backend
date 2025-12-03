const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_promo_history', {
    id_phistory: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_order: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    promo_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    promo_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    promo_type: {
      type: DataTypes.ENUM('diskon','amount','',''),
      allowNull: false
    },
    datecreate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_promo_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_phistory" },
        ]
      },
    ]
  });
};
