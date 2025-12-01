const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_driver', {
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
    status_driver: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    p_normal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    p_non: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    no_ktp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    no_sim: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vehicle_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    nopol: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    jenis_sim: {
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
      defaultValue: "e10adc3949ba59abbe56e057f20f883e"
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true
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
      allowNull: false
    },
    foto_stnk: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_ijasah: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_kk: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    jaminan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_jaminan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_kendaraan: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_driver',
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
    ]
  });
};
