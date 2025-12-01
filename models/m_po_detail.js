const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_po_detail', {
    id_mpod: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mpo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_sm: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    al_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    po_berdasarkan: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: "koli"
    },
    hitung_berdasarkan: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: "koli"
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    volume: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false,
      defaultValue: 0.000
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    harga_bongkar_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    harga_inap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    harga_jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    kontainer: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    seal: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    supir: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    telp: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_po_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mpod" },
        ]
      },
      {
        name: "id_mpo",
        using: "BTREE",
        fields: [
          { name: "id_mpo" },
        ]
      },
      {
        name: "id_msm",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
      {
        name: "al_bongkar",
        using: "BTREE",
        fields: [
          { name: "al_bongkar" },
        ]
      },
      {
        name: "no_sm",
        using: "BTREE",
        fields: [
          { name: "no_sm" },
        ]
      },
      {
        name: "harga",
        using: "BTREE",
        fields: [
          { name: "harga" },
          { name: "harga_muat" },
          { name: "harga_bongkar_muat" },
          { name: "harga_inap" },
        ]
      },
      {
        name: "kendaraan",
        using: "BTREE",
        fields: [
          { name: "kendaraan" },
          { name: "kontainer" },
          { name: "seal" },
          { name: "nopol" },
          { name: "supir" },
        ]
      },
    ]
  });
};
