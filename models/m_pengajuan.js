const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengajuan', {
    id_pengajuan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Dana"
    },
    perusahaan: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    no_pengajuan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    no_surat: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    pph: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pph_nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bukti_potong: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pemohon: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    perihal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    judul_surat: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    uraian: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 = Pengajuan dibuat, 1 = Pengajuan baru, 2 = Waiting Approve, 3 = Process AKT & Keu, 4 = Close"
    },
    tgl_pengajuan: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_insert: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pengajuan',
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
