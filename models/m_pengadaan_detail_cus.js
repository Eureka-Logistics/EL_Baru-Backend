const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengadaan_detail_cus', {
    id_pdc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    via: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "darat"
    },
    shipment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    items: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Buku"
    },
    id_almuat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_albongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_barang: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tgl_drop: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jam_drop: {
      type: DataTypes.TIME,
      allowNull: false
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_detail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pengadaan_detail_cus',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pdc" },
        ]
      },
      {
        name: "id_pc",
        using: "BTREE",
        fields: [
          { name: "id_pc" },
        ]
      },
      {
        name: "id_almuat",
        using: "BTREE",
        fields: [
          { name: "id_almuat" },
        ]
      },
      {
        name: "id_albongkar",
        using: "BTREE",
        fields: [
          { name: "id_albongkar" },
        ]
      },
      {
        name: "id_pc_2",
        using: "BTREE",
        fields: [
          { name: "id_pc" },
        ]
      },
    ]
  });
};
