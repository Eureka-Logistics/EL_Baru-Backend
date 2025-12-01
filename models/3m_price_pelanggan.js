const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('3m_price_pelanggan', {
    id_price_pelanggan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level_wil_muat: {
      type: DataTypes.ENUM('kecamatan','kota','provinsi'),
      allowNull: false
    },
    id_wil_muat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level_wil_bongkar: {
      type: DataTypes.ENUM('kecamatan','kota','provinsi'),
      allowNull: false
    },
    id_wil_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_kendaraan: {
      type: DataTypes.ENUM('Wingbox','Trailer','Traga','Motor','MOKO','Mobil','L300','GRAND MAX','Fuso','CDE','CDD'),
      allowNull: false
    },
    biaya_kirim: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    biaya_muat: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    biaya_bongkar: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: '3m_price_pelanggan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_price_pelanggan" },
        ]
      },
    ]
  });
};
