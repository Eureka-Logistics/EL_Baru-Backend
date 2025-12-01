const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ops_pengajuan_keur', {
    id_pengajuan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_pengajuan: {
      type: DataTypes.STRING(27),
      allowNull: false
    },
    periode_bulan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    periode_tahun: {
      type: DataTypes.DATE(4),
      allowNull: false,
      defaultValue: "0000"
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_pengajuan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_ops_pengajuan_keur',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pengajuan" },
        ]
      },
    ]
  });
};
