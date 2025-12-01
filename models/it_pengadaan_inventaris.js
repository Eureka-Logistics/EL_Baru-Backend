const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_pengadaan_inventaris', {
    id_pengadaan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_pengadaan: {
      type: DataTypes.STRING(17),
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    divisi: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    req_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    jenis_inventaris: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    spesifikasi_lama: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pic_lama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tahun_lama: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kondisi_lama: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    spesifikasi_baru: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pic_baru: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estimasi_harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    alasan: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_pengadaan_inventaris',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pengadaan" },
        ]
      },
    ]
  });
};
