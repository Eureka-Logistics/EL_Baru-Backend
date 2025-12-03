const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_pengajuan', {
    id_pengajuan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_ap: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_inv: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    perihal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "0"
    },
    kode_kendaraan: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0"
    },
    nopol: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "0"
    },
    kilometer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_ap: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_terima: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_in: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_out: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    total_ap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_ap_pengajuan',
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
