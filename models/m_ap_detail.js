const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_detail', {
    id_apd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mpod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    jenis_angkut: {
      type: DataTypes.ENUM('Biaya Sewa','Multidrop','Retail','Charter','Biaya Tol','Biaya TKBM'),
      allowNull: false,
      defaultValue: "Retail"
    },
    no_surat_jalan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sumber: {
      type: DataTypes.ENUM('elogs','race','smu'),
      allowNull: false
    },
    tgl_kirim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_terima: {
      type: DataTypes.DATE,
      allowNull: false
    },
    berat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    volume: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    berdasarkan: {
      type: DataTypes.ENUM('berat','volume','quantity','all'),
      allowNull: false,
      defaultValue: "all"
    },
    berdasarkan_addon: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "all"
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    overtonase: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biaya_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biaya_bongkar_addon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_inap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biaya_mel: {
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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_lain: {
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
    potongan_inap: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    potongan_lain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    asuransi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_noppn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_nopph: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah_harga: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    jumlah_biaya: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    jumlah_potongan: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "jumlah harga + biaya - potongan"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_ap_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_apd" },
        ]
      },
      {
        name: "id_ap",
        using: "BTREE",
        fields: [
          { name: "id_ap" },
        ]
      },
      {
        name: "id_mpod",
        using: "BTREE",
        fields: [
          { name: "id_mpod" },
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
        name: "asuransi",
        using: "BTREE",
        fields: [
          { name: "asuransi" },
        ]
      },
      {
        name: "biaya_ap",
        using: "BTREE",
        fields: [
          { name: "biaya_noppn" },
          { name: "biaya_overtonase" },
          { name: "biaya_bongkar" },
          { name: "biaya_muat" },
          { name: "biaya_multidrop" },
          { name: "biaya_inap" },
          { name: "biaya_mel" },
          { name: "biaya_putar" },
          { name: "biaya_insentif" },
          { name: "biaya_lain" },
        ]
      },
      {
        name: "id_ap_2",
        using: "BTREE",
        fields: [
          { name: "id_ap" },
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
        name: "id_msm_3",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
    ]
  });
};
