const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cabang', {
    id_cabang: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cabang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kode_cabang: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    alamat_cabang: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_telp: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'cabang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_cabang" },
        ]
      },
    ]
  });
};
