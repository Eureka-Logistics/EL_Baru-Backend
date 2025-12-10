const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengadaan_detail', {
    id_mpd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ph: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    no_sj: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    do: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "darat"
    },
    shipment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_supir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kendaraan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kendaraan_mitra: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_almuat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_albongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kota_muat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_kota_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    nama_barang: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tgl_dropoff: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    waktu_dropoff: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
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
    km: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ikat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    harga_net: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_produk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    harga_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    harga_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_multimuat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_mel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_tambahan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    max_tonase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    harga_selanjutnya: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    durasi_lelang: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    harga_lelang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_price_customer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cod_amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    cod_input: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_lelang: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_lelang: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_pengadaan_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mpd" },
        ]
      },
      {
        name: "id_mp",
        using: "BTREE",
        fields: [
          { name: "id_mp" },
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
        name: "id_mpd",
        using: "BTREE",
        fields: [
          { name: "id_mpd" },
        ]
      },
      {
        name: "nama_barang",
        using: "BTREE",
        fields: [
          { name: "nama_barang" },
        ]
      },
    ]
  });
};
