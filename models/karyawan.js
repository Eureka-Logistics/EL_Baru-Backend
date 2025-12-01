const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('karyawan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nik: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    nama: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    tempat_lahir: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tgl_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_ktp: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_sim: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_telp: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    telp2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    jenis_sim: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    agama: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tgl_masuk: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'karyawan',
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
    ]
  });
};
