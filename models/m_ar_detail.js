const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_detail', {
    id_ard: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    msm: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    do: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    service: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "retailer"
    },
    via: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    tgl_berangkat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    tgl_berangkat_kapal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    tgl_tiba: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    berat: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: true
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    volume: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    overtonase: {
      type: DataTypes.DOUBLE(5,1),
      allowNull: false,
      defaultValue: 0.0
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_kg_laut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_volume: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_inap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_multimuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_mel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_tol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_putar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_insentif: {
      type: DataTypes.FLOAT(10,1),
      allowNull: false
    },
    biaya_portal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_packing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_noppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_nopph: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bongkar_noppn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bongkar_lain: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    potongan_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    potongan_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    potongan_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    potongan_rusak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    potongan_biaya_sewa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    potongan_diskon: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    potongan_lain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    potongan_inap: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    asuransi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    inap_ppn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pas_bandara: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_kwitansi: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    total_pengganti: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_harga: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_tagihan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tgl_pembayaran: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    keterangan_bayar: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ar_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ard" },
        ]
      },
      {
        name: "id_ar",
        using: "BTREE",
        fields: [
          { name: "id_ar" },
          { name: "id_msm" },
          { name: "msm" },
          { name: "id_mitra" },
          { name: "id_mitra2" },
        ]
      },
      {
        name: "biaya",
        using: "BTREE",
        fields: [
          { name: "harga" },
          { name: "overtonase" },
          { name: "biaya_overtonase" },
          { name: "biaya_muat" },
          { name: "biaya_bongkar" },
          { name: "biaya_kg_laut" },
          { name: "biaya_volume" },
          { name: "biaya_inap" },
          { name: "biaya_multidrop" },
          { name: "biaya_multimuat" },
          { name: "biaya_lain" },
          { name: "biaya_mel" },
          { name: "biaya_tol" },
          { name: "biaya_putar" },
          { name: "biaya_insentif" },
          { name: "biaya_portal" },
        ]
      },
      {
        name: "biaya_packing",
        using: "BTREE",
        fields: [
          { name: "biaya_packing" },
        ]
      },
      {
        name: "potongan",
        using: "BTREE",
        fields: [
          { name: "potongan_bongkar" },
          { name: "potongan_overtonase" },
          { name: "potongan_multidrop" },
          { name: "potongan_rusak" },
          { name: "potongan_biaya_sewa" },
          { name: "potongan_diskon" },
          { name: "potongan_lain" },
          { name: "asuransi" },
          { name: "bongkar_lain" },
          { name: "inap_ppn" },
          { name: "pas_bandara" },
          { name: "admin" },
        ]
      },
      {
        name: "total",
        using: "BTREE",
        fields: [
          { name: "no_kwitansi" },
          { name: "total_pengganti" },
          { name: "total_harga" },
          { name: "total_tagihan" },
          { name: "tgl_pembayaran" },
        ]
      },
      {
        name: "id_msm",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
          { name: "msm" },
        ]
      },
      {
        name: "id_msm_2",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
      {
        name: "id_ar_2",
        using: "BTREE",
        fields: [
          { name: "id_ar" },
        ]
      },
    ]
  });
};
