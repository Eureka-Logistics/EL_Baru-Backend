const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_karyawan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    proposal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nama_lengkap: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    als: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    no_telp: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_cabang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    perusahaan: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    kode_cabang: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    user_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_group: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    id_session: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tgl_login: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
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
    koordinator: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "username",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "password",
        using: "BTREE",
        fields: [
          { name: "password" },
        ]
      },
      {
        name: "nama_lengkap",
        using: "BTREE",
        fields: [
          { name: "nama_lengkap" },
        ]
      },
      {
        name: "id_bu",
        using: "BTREE",
        fields: [
          { name: "id_bu" },
          { name: "id_bu_brench" },
        ]
      },
    ]
  });
};
