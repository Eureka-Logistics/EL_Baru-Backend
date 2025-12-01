const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_laporan_emc', {
    id_laporan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 11
    },
    no_sm: {
      type: DataTypes.STRING(13),
      allowNull: false,
      defaultValue: ""
    },
    jasa: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    awb: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    pembayaran: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: ""
    },
    departemen: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    pengirim: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    penerima: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    wilayah: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    telp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    jenis_barang: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    service: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ""
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
    harga_kg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_order: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    }
  }, {
    sequelize,
    tableName: 'm_laporan_emc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_laporan" },
        ]
      },
    ]
  });
};
