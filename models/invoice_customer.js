const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invoice_customer', {
    id_invoice: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_invoice: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tgl_invoice: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    no_faktur: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    id_pu: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_po: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    do: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_sm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_customer: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tujuan: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    m3: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_tagihan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tgl_pembayaran: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'invoice_customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_invoice" },
        ]
      },
    ]
  });
};
