const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ops_pengajuan_keur_detail', {
    id_pengajuan_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_polisi: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    merk: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    tahun: {
      type: DataTypes.DATE(4),
      allowNull: false
    },
    masa_berlaku: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    pengguna: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    wilayah: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    biaya_stnk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_keur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_pajak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_acc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_acc_box: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_jasaraharja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    biaya_gantiplat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_gantiplat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_stnk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_keur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_pajak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_acc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_acc_box: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riil_jasaraharja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_ket: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_ops_pengajuan_keur_detail',
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
