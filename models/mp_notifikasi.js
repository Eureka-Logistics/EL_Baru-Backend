const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mp_notifikasi', {
    notifikasi_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    notifikasi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipe_notifikasi: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tipe_user: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tautan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    add_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mp_notifikasi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notifikasi_id" },
        ]
      },
    ]
  });
};
