const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emctracking', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_awbmitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    awb: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    departemen: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nama_pengirim: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    alamat_pengirim: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    customer_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_kota_pengirim: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_provinsi_pengirim: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    negara_pengirim: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kodepos_pengirim: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    no_tlp_pengirim: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    email_pengirim: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    jenis_barang: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    jenis_pembayaran: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nama_penerima: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    alamat_penerima: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_kecamatan_penerima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kota_penerima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_provinsi_penerima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kodepos_penerima: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    no_telp_penerima: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    email_penerima: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    berat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    panjang: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lebar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tinggi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ongkir: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_pengiriman: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attn: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attn2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    stempel: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    packing_kayu: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    nilai_barang: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_stempel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diskon: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_petugas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_kirim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    stat: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tgl_terima: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emctracking',
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
