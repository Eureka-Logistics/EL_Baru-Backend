const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengajuan_driver', {
    id_ptj: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_ptj: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    id_sm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_sm: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    kode_trf: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    nopol: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cabang_2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    customer_2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rute_2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_driver: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    nama_transfer: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    b_bbm: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_bbm_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_tol: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_tol_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_parkir: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_parkir_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bongkar_muat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bongkar_muat_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_inap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_makan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_makan_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_timbangan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_timbangan_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_service_dll: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_kenek: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_kenek_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sisa_real: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sisa_real_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    kurang_real: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bank_transfer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    selisih: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status_perihal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_muatan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status_ptj: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    catatan_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_sesuai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    date_transfer: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_ptj: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_add: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    filename_excel: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pengajuan_driver',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ptj" },
        ]
      },
    ]
  });
};
