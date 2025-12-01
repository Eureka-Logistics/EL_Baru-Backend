const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_voucher', {
    id_voucher: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    voucher: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    voucher_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    voucher_detail: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    voucher_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    non_point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    erl_point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0"
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_voucher',
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
