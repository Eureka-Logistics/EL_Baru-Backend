const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invoice_vendor', {
    id_invoice: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_invoice: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    no_ap: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tgl_ap: {
      type: DataTypes.DATE,
      allowNull: false
    },
    invoice_vendor: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tgl_invoice: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_terima: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    id_po: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    no_sm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    do: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    vendor: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    jenis: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_muat: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_pickup: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_departure: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_arrived: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    kg: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    pph: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
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
    tableName: 'invoice_vendor',
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
