const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mp_muatan', {
    muatan_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    asal: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tujuan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    asal_alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tujuan_alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tanggal_muat: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tanggal_bongkar: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    truk_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    berat_satuan: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    jenis_barang_id: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    tarif: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status_muatan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    add_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mp_muatan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "muatan_id" },
        ]
      },
    ]
  });
};
