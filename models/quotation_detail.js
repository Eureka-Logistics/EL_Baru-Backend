const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quotation_detail', {
    id_quotation_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    id_quotation: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    id_kota_muat: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    id_kec_muat: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    alamat_muat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_kota_tujuan: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    id_kec_tujuan: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    alamat_tujuan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_kendaraan_jenis: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    service: {
      type: DataTypes.ENUM('charter', 'retailer'),
      allowNull: false,
      defaultValue: 'charter'
    },
    min_tonase: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    leadtime: {
      type: DataTypes.INTEGER(50),
      allowNull: false
    },
    id_tarif_eureka: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    is_custom: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'quotation_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_quotation_detail" },
        ]
      },
    ]
  });
};
