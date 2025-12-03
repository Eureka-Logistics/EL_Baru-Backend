const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_req_asuransi_detail', {
    id_req_asuransi_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_surat: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    nama_perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_mpd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jml_karton: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kota_dari: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kota_tujuan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tujuan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_pengiriman: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    eta: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    etd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    no_polisi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nama_supir: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_person: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tgl_tiba: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_bongkar: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    total_faktur: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rate_asuransi: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    tgl_buat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pb: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    batal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ket_batal: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    premi_asuransi: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_req_asuransi_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_req_asuransi_detail" },
        ]
      },
    ]
  });
};
