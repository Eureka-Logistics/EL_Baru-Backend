const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_promo', {
    id_promo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    promo_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    promo_code: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    promo_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    promo_type: {
      type: DataTypes.ENUM('diskon','amount'),
      allowNull: false,
      defaultValue: "amount"
    },
    promo_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    promo_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    promo_earlydate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    promo_enddate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    input_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status: {
      type: DataTypes.ENUM('1','0'),
      allowNull: false,
      defaultValue: "1"
    }
  }, {
    sequelize,
    tableName: 'emc_promo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_promo" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
