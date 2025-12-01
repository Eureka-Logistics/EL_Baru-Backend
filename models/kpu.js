const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kpu', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_dapil: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    no_surat: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    jml_surat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jml_boks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_boks: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    no_penerima: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_polisi: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    nama_supir: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    hp_supir: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.ENUM('Terkirim','Belum Terkirim'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kpu',
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
