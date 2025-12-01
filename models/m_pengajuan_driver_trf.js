const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengajuan_driver_trf', {
    id_ptjtrf: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ptj: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kode_trf_2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    bulan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_sm: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    cabang: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    driver: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    customer: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nopol: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    jenis_unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rute: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    keterangan: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    periode_uang_masuk: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    periode_ptj: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nominal_transfer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    unit_balik: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status_muatan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    date_transfer: {
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
    }
  }, {
    sequelize,
    tableName: 'm_pengajuan_driver_trf',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ptjtrf" },
        ]
      },
    ]
  });
};
