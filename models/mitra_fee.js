const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mitra_fee', {
    id_mitra_fee: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_from: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    via: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: ""
    },
    service: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    vehicle: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: ""
    },
    jenis_barang: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    tonase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    panjang_kendaraan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    lebar_kendaraan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tinggi_kendaran: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    lead_time: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: "1"
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    min_muat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    berat_kurangdari: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    harga_kurangdari: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    berat_lebihdari: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    harga_lebihdari: {
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
    biaya_overtonase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_inap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_mel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_putar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_multidrop: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    biaya_multidrop_lkota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biaya_kawalan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00"
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00"
    },
    akhir_harga: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "0000-00-00"
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keterangan_blain: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mitra_fee',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mitra_fee" },
        ]
      },
    ]
  });
};
