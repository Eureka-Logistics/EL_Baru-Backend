const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengajuan_otorisasi', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mpu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status_otr: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_pengajuan_otorisasi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
