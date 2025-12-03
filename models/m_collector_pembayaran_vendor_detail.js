const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_collector_pembayaran_vendor_detail', {
    id_pembayaran_vendor_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pembayaran_vendor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_collector_pembayaran_vendor',
        key: 'id_pembayaran_vendor'
      }
    },
    id_ap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'm_ap',
        key: 'id_ap'
      }
    },
    ket_invoice: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_collector_pembayaran_vendor_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pembayaran_vendor_detail" },
        ]
      },
      {
        name: "id_pembayaran_vendor",
        using: "BTREE",
        fields: [
          { name: "id_pembayaran_vendor" },
        ]
      },
      {
        name: "id_ap",
        using: "BTREE",
        fields: [
          { name: "id_ap" },
        ]
      },
    ]
  });
};
