const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_acount', {
    id_account: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Klarifikasi: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Klarifikasi_acount: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    Kode_rekening: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    nama_rek: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    als_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'act_acount',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_account" },
        ]
      },
    ]
  });
};
