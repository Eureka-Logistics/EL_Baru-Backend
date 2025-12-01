const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_personal_detail', {
    id_ap_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_faktur: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    no_invoice_mitra: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    nomor_faktur: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    date_first: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_until: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    pcs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    berat: {
      type: DataTypes.DECIMAL(8,3),
      allowNull: false,
      defaultValue: 0.000
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    asuransi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lebih_bayar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_packing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_ap_personal_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ap_detail" },
        ]
      },
    ]
  });
};
