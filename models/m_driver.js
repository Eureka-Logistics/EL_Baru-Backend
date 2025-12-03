const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_driver', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_karyawan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    kode_driver: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nik: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vehicle_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    no_ktp: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    no_sim: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    jenis_sim: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tgl_sim: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    uk_seragam: {
      type: DataTypes.ENUM('S','M','L','XL','XXL','XXXL','4XL'),
      allowNull: true
    },
    jenis_kepemilikan: {
      type: DataTypes.ENUM('tidakditentukan','eureka','eur_sewa','eur_oncall','race','rcn_sewa','rcn_oncall'),
      allowNull: false
    },
    rekening_bank: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    rekening_norek: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tgl_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tempat_lahir: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    agama: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_telp: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    no_telp2: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ritase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deposit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wilayah: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_masuk: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    available: {
      type: DataTypes.ENUM('1','0'),
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    foto_ktp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foto_sim: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    foto_stnk: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foto_ijasah: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foto_kk: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jaminan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foto_jaminan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    total_point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_driver',
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
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_karyawan",
        using: "BTREE",
        fields: [
          { name: "id_karyawan" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
    ]
  });
};
