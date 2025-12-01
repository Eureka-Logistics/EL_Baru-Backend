const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alamat_fee', {
    id_fee: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_almuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_albongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 300
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 300
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    tgl: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    keterangan: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    foto_tarif: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'alamat_fee',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_fee" },
        ]
      },
    ]
  });
};
