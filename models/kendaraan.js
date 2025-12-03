const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kendaraan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_kendaraan: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    gps_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    gps_device_id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    kode_kendaraan: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    no_polisi: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true,
      defaultValue: "1"
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'm_driver',
        key: 'id'
      }
    },
    id_kendaraan_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    jenis_kepemilikan: {
      type: DataTypes.ENUM('eureka','eur_sewa','eur_oncall','race','rcn_sewa','operasional'),
      allowNull: false
    },
    id_vendor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    vendor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tgl_stnk: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    tgl_plat_nomor: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    tgl_kir: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "0000-00-00"
    },
    merk_mobil: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tahun_mobil: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    warna_plat: {
      type: DataTypes.ENUM('Hitam','Kuning','Putih','Merah','Hijau'),
      allowNull: true
    },
    tgl_beli: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    panjang: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    lebar: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    tinggi: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    no_bpkb: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    stnk: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ""
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kapasitas_maks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kubikasi: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    foto: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foto_stnk: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    foto_plat_nomor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    foto_kir: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'kendaraan',
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
        name: "id_driver",
        using: "BTREE",
        fields: [
          { name: "id_driver" },
          { name: "vendor" },
          { name: "no_polisi" },
        ]
      },
      {
        name: "id_kendaraan_jenis",
        using: "BTREE",
        fields: [
          { name: "id_kendaraan_jenis" },
        ]
      },
      {
        name: "no_polisi",
        using: "BTREE",
        fields: [
          { name: "no_polisi" },
        ]
      },
    ]
  });
};
