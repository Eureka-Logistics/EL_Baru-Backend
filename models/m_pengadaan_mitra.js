const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengadaan_mitra', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_mpd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    kendaraan_mitra: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kontainer_mitra: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    seal_mitra: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    no_polisi_mitra: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    supir_mitra: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telp_supir_mitra: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "0"
    },
    id_mitra_transit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    transit: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: "N"
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pengadaan_mitra',
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
      {
        name: "id_mpd",
        using: "BTREE",
        fields: [
          { name: "id_mpd" },
        ]
      },
      {
        name: "id_mitra",
        using: "BTREE",
        fields: [
          { name: "id_mitra" },
        ]
      },
    ]
  });
};
