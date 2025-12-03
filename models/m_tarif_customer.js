const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_tarif_customer', {
    id_tarif_customer: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_tarif_customer: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    id_tarif_eureka: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_muat_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tujuan_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kendaraan_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    service_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    via: {
      type: DataTypes.ENUM('darat','laut','udara'),
      allowNull: false
    },
    jenis_kiriman: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    diskon_percent: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    diskon_rupiah: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    biaya_jalan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_muat: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_bongkar: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    biaya_overtonase: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_multimuat: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_multidrop: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_mel: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_tambahan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    biaya_lain: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kode_surat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    min_tonase_1: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    min_tonase_2: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    min_tonase_3: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    min_tonase_4: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    min_tonase_5: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    tarif_2: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    tarif_3: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    tarif_4: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    tarif_5: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    satuan: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    kode_surat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_pp: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_tarif_customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_tarif_customer" },
        ]
      },
    ]
  });
};
