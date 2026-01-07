const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan_new', {
    id_uang_jalan_race: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_uang_jalan: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    driver_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nopol_unit: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    id_helper: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    helper_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_rek: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rek_driver: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    bbm: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    makan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    parkir: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tol: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tkbm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    penyeberangan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timbangan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pass_bandara: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    karantina: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kawalan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_bbm: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    bbm_liter: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    kota_muat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kota_bongkar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jenis_uj: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'Uang jalan Pokok'
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total_semua: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_perusahaan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    msm: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_muat: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 11
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_sending: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    transfer_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'uang_jalan_new',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan_race" },
        ]
      },
    ]
  });
};
