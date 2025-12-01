const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alamat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    hp: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    alamat_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kecamatan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_kecamatan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kota: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    kode_wilayah: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    kode_provinsi: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    ritase: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: true,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    }
  }, {
    sequelize,
    tableName: 'alamat',
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
        name: "kota",
        using: "BTREE",
        fields: [
          { name: "kota" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
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
        name: "pic",
        using: "BTREE",
        fields: [
          { name: "pic" },
        ]
      },
    ]
  });
};
