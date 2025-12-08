const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan_new', {
    id_uang_jalan_race: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_uang_jalan: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    driver_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nopol_unit: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    id_helper: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    helper_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_rek: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'uang_jalan_new',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan_race" },
        ]
      },
    ]
  });
};
