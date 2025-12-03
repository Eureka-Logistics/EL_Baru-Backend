const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_vehicle', {
    id_vehicle: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_kendaraan: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_polisi: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    vendor: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    merk_mobil: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tahun_mobil: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    warna_plat: {
      type: DataTypes.STRING(10),
      allowNull: false
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
      allowNull: false,
      defaultValue: ""
    },
    tgl_stnk: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
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
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true,
      defaultValue: "1"
    },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false
    },
    lon: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    engine: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    gpstime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_vehicle',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_vehicle" },
        ]
      },
      {
        name: "id_driver",
        using: "BTREE",
        fields: [
          { name: "id_driver" },
        ]
      },
      {
        name: "kode_kendaraan",
        using: "BTREE",
        fields: [
          { name: "kode_kendaraan" },
        ]
      },
    ]
  });
};
