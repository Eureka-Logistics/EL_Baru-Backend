const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan', {
    id_uang_jalan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_uang_jalan_periode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_tf: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
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
    norek_penerima: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tgl_transaksi: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    total_nominal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bbm_muatan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tol: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    parkir: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    operasional: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    makan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    timbangan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kawalan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    helper: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    bongkar_muat: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kiriman_sewa: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ptj: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    nominal_ptj: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    tgl_ptj: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ket_ptj: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_uj: {
      type: DataTypes.ENUM('open','alert','closed'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'uang_jalan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan" },
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
        name: "id_unit",
        using: "BTREE",
        fields: [
          { name: "id_unit" },
        ]
      },
      {
        name: "id_driver",
        using: "BTREE",
        fields: [
          { name: "id_driver" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
      {
        name: "id_uang_jalan_periode",
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan_periode" },
        ]
      },
    ]
  });
};
