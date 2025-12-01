const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_pengajuan_detail', {
    id_pengajuan_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    biaya: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.DECIMAL(20,2),
      allowNull: false,
      defaultValue: 0.00
    },
    ppn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_ap_pengajuan_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pengajuan_detail" },
        ]
      },
    ]
  });
};
