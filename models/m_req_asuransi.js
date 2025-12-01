const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_req_asuransi', {
    id_req_asuransi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_surat: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    msp: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nama_perusahaan: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    service: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jenis_barang: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    packing: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_pickup: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tgl_order: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tgl_buat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    batal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ket_batal: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_sales: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_req_asuransi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_req_asuransi" },
        ]
      },
    ]
  });
};
