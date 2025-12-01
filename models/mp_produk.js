const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mp_produk', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nama_Produk: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    SKU: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Kategori: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Deskripsi_Produk: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Harga: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Berat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Pemesanan_Minimum: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Status: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Jumlah_Stok: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Etalase: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Preorder: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Waktu_Proses_Preorder: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Kondisi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Gambar_1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Gambar_2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Gambar_3: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Gambar_4: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Gambar_5: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    URL_Video_Produk_1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    URL_Video_Produk_2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    URL_Video_Produk_3: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Custom_URL_Kategori: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Custom_URL_Produk: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Custom_Harga_Asli: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Custom_Stok: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Custom_Limited_Stok: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mp_produk',
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
