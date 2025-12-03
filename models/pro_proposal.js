const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pro_proposal', {
    id_proposal: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    request_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    session: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    received_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    proposal_nomor: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kode_cabang: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ruang_lingkup: {
      type: DataTypes.ENUM('CAB','PST'),
      allowNull: false
    },
    kategori: {
      type: DataTypes.ENUM('REGULER','BANDING'),
      allowNull: false
    },
    proposal_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    proposal_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pemohon: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pemohon_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    proposal_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    otoritas: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nama_lembaga: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nama_mitra: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kode_pelanggan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    telp: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    alamat_lembaga: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    berlangganan_sejak: {
      type: DataTypes.STRING(4),
      allowNull: false,
      defaultValue: "2006"
    },
    history_target: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    history_penjualannetto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    history_potongan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    history_promosi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    history_akumulasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    history_top: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pengajuan_target: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pengajuan_sp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pengajuan_potongan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pengajuan_promosi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pengajuan_akumulasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pengajuan_top: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'pro_proposal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_proposal" },
        ]
      },
    ]
  });
};
