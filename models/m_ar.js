const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar', {
    id_ar: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    proforma: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    proforma_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    print: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    print_qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: ""
    },
    alamat_invoice: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_invoice_ar: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    tgl_invoice_ar: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_kirim_invoice: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    no_faktur_ar: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    no_faktur_pajak: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_faktur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    service: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "retailer"
    },
    via: {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: "darat"
    },
    is_nbp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ppn: {
      type: DataTypes.DECIMAL(3,1),
      allowNull: false,
      defaultValue: 1.0
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    discount_persen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_ppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_pph: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_penjualan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_kirim: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_pajak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    sales_invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "from jurnal.id"
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ar" },
        ]
      },
      {
        name: "biaya",
        using: "BTREE",
        fields: [
          { name: "discount_persen" },
          { name: "discount_amount" },
          { name: "total_ppn" },
          { name: "total_penjualan" },
          { name: "total_pph" },
        ]
      },
      {
        name: "invoice",
        using: "BTREE",
        fields: [
          { name: "no_invoice_ar" },
          { name: "tgl_invoice_ar" },
          { name: "tgl_kirim_invoice" },
          { name: "no_faktur_ar" },
          { name: "no_faktur_pajak" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
          { name: "id_mitra" },
          { name: "no_invoice_ar" },
          { name: "tgl_invoice_ar" },
          { name: "no_faktur_ar" },
          { name: "no_faktur_pajak" },
          { name: "service" },
          { name: "via" },
        ]
      },
      {
        name: "no_invoice_ar",
        using: "BTREE",
        fields: [
          { name: "no_invoice_ar" },
        ]
      },
      {
        name: "sales_invoice_id",
        using: "BTREE",
        fields: [
          { name: "sales_invoice_id" },
        ]
      },
      {
        name: "sales_invoice_id_2",
        using: "BTREE",
        fields: [
          { name: "sales_invoice_id" },
        ]
      },
    ]
  });
};
