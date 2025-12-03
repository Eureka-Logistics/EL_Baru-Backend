const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('surat_muat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_muat: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    no_sm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pengirim: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_alamat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nama_barang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    pembungkus: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    do: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_kontainer: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    no_seal: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    no_polisi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ket_kirim: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estimasi: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    tgl_terima: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'surat_muat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
