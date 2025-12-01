const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kpu_dapil', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_dapil: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    jenis_surat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    propinsi: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nama_dapil: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    wilayah_dapil: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    jml_surat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ukuran: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    satker: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telepon: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fax: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    no_penerima: {
      type: DataTypes.STRING(40),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kpu_dapil',
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
