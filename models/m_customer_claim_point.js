const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_customer_claim_point', {
    id_claim: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mcustomer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    voucher_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    awal_point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    claim_point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    claim_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_customer_claim_point',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_claim" },
        ]
      },
    ]
  });
};
