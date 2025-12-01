const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_diterima', {
    purch_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pelanggan: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    invoice_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mitra: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_ap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_invoice_ap: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tgl_create_sm: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_terima_barang: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_terima_invoice: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_terima_sm: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status_ap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_ap: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_sm_diterima',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "purch_id" },
        ]
      },
      {
        name: "mitra",
        using: "BTREE",
        fields: [
          { name: "mitra" },
        ]
      },
      {
        name: "invoice_no",
        using: "BTREE",
        fields: [
          { name: "invoice_no" },
        ]
      },
      {
        name: "date_created",
        using: "BTREE",
        fields: [
          { name: "date_created" },
        ]
      },
      {
        name: "tgl_terima_invoice",
        using: "BTREE",
        fields: [
          { name: "tgl_terima_invoice" },
        ]
      },
      {
        name: "sm",
        using: "BTREE",
        fields: [
          { name: "sm" },
        ]
      },
      {
        name: "id_ap",
        using: "BTREE",
        fields: [
          { name: "id_ap" },
        ]
      },
      {
        name: "no_invoice_ap",
        using: "BTREE",
        fields: [
          { name: "no_invoice_ap" },
        ]
      },
    ]
  });
};
