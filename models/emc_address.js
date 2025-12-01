const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_address', {
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
    type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    hp: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alamat_detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    kelurahan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kecamatan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kota: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    provinsi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kodepos: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kode_wilayah: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'emc_address',
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
        name: "id_customer_2",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
      {
        name: "pic",
        using: "BTREE",
        fields: [
          { name: "pic" },
        ]
      },
      {
        name: "perusahaan",
        using: "BTREE",
        fields: [
          { name: "perusahaan" },
        ]
      },
    ]
  });
};
