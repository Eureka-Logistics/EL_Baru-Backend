const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_real', {
    id_sm_real: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sm: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    customer: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dari: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    tujuan: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    alamat_muat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    alamat_bongkar: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jenis_barang: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sjdo: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    unit_transit: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    via: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    berat: {
      type: DataTypes.FLOAT(11,2),
      allowNull: true,
      defaultValue: 0.00
    },
    koli: {
      type: DataTypes.FLOAT(11,2),
      allowNull: true,
      defaultValue: 0.00
    },
    qty: {
      type: DataTypes.FLOAT(11,2),
      allowNull: true,
      defaultValue: 0.00
    },
    tgl_kirim: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "0000-00-00"
    },
    no_kendaraan: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    supir: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    no_tlp: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    multidrop: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_muat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_bongkar: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_inap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_penjualan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    sales: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    invoice_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_invoice: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    keterangan_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_sm_real',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sm_real" },
        ]
      },
    ]
  });
};
