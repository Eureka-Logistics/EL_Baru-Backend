const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_permintaan_inventaris', {
    id_permintaan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_permintaan: {
      type: DataTypes.STRING(17),
      allowNull: false
    },
    id_tiket: {
      type: DataTypes.INTEGER,
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
    tableName: 'it_asset_permintaan_inventaris',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_permintaan" },
        ]
      },
    ]
  });
};
