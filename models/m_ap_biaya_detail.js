const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_biaya_detail', {
    id_ap_biaya_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ap_biaya: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_invoice_mitra: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    jenis_barang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    jenis_pembelian: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ap_biaya_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ap_biaya_detail" },
        ]
      },
    ]
  });
};
