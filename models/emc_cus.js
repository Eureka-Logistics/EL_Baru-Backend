const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_cus', {
    id_customer: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_customer: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    nama_perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    perusahaan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jenis_usaha: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    jenis_barang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tahun_berdiri: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    npwp: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    pkp: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    alamat_kantor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telepon: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    hp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    fax: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nama_bank: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nama_akun: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_rek: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    mata_uang: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "Rupiah (Rp)"
    },
    jenis_pembayaran: {
      type: DataTypes.ENUM('Cash','Credit'),
      allowNull: false,
      defaultValue: "Cash"
    },
    jenis_angkutan: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    kemasan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_bergabung: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    }
  }, {
    sequelize,
    tableName: 'emc_cus',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
    ]
  });
};
