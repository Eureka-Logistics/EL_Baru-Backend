const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dev_emc_address', {
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
    perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    hp: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alamat_detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    kecamatan: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    kota: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kode_wilayah: {
      type: DataTypes.STRING(5),
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
    tableName: 'dev_emc_address',
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
    ]
  });
};
