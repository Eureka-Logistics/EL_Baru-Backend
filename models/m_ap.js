const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap', {
    id_ap: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mitra',
        key: 'id_mitra'
      }
    },
    no_invoice_ap: {
      type: DataTypes.STRING(22),
      allowNull: false,
      defaultValue: "",
      unique: "no_invoice_ap"
    },
    tgl_invoice_ap: {
      type: DataTypes.DATE,
      allowNull: false
    },
    no_invoice_mitra: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    no_faktur: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    referensi_id_ap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    referensi_ap: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    referensi_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    referensi_invoice: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    referensi_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    referensi_note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_terima_invoice: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    service: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ppn: {
      type: DataTypes.DECIMAL(3,1),
      allowNull: false,
      defaultValue: 1.1
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    jenis_pph: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: " 0 = PPh dari Total, 1 = PPh dari Subtotal, 2 = PPh dari Total Non PPN"
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_harga: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total_biaya_noppn: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total_biaya_nopph: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total_ppn: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total_pph: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total_keseluruhan: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "harga + noppn + nopph + ppn - pph"
    },
    ket_biayalain: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tgl_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    custom_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "jurnal.id - gabungan id_ap,no_ap,tahun"
    },
    purchase_invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "from jurnal.id"
    },
    purchase_addon_invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "from jurnal.id"
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_ap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ap" },
        ]
      },
      {
        name: "no_invoice_ap",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "no_invoice_ap" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
      {
        name: "tgl_invoice_ap",
        using: "BTREE",
        fields: [
          { name: "tgl_invoice_ap" },
        ]
      },
      {
        name: "no_invoice_mitra",
        using: "BTREE",
        fields: [
          { name: "no_invoice_mitra" },
        ]
      },
      {
        name: "no_faktur",
        using: "BTREE",
        fields: [
          { name: "no_faktur" },
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
        name: "tgl_create",
        using: "BTREE",
        fields: [
          { name: "tgl_create" },
        ]
      },
    ]
  });
};
