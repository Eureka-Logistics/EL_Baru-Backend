const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pengadaan_unit', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    spk_bayangan: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: ""
    },
    spk: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    perusahaan: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    jenis_barang: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    berat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    b1: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    b2: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    b3: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    b4: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    b5: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    b6: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    qty1: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty2: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty3: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty4: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty5: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qty6: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    h1: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    h2: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    h3: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    h4: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    h5: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    h6: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    overtonase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_alm: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alm2: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alm3: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb2: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb3: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb4: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb5: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb6: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_alb7: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    waktu_muat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    waktu_bongkar: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    do: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    harga: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biayakg: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    biaya_lain: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biayamb: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biayamd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    biayaot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    top: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tgl_pickup: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "0000-00-00"
    },
    tgl_kirim: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "0000-00-00"
    },
    via: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    jenis_armada: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    pengiriman: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    lama_pengiriman: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    pembayaran: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    packing: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_pesan: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_setuju: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tgl_ok: {
      type: DataTypes.DATE,
      allowNull: false
    },
    armada: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    id_mitra: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    id_mitra2: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    id_mitra3: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kendaraan2: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_kontainer: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    no_kontainer2: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    no_seal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    no_seal2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    no_polisi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    no_polisi2: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nama_supir: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nama_supir2: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    hp: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    hp2: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    operasional: {
      type: DataTypes.ENUM('','Y','N','T'),
      allowNull: false,
      defaultValue: ""
    },
    tgl_op: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ket_op: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    purchasing: {
      type: DataTypes.ENUM('','Y','N','T'),
      allowNull: false,
      defaultValue: ""
    },
    tgl_purch: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ket_purchasing: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    akunting: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ket_akunting: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pengadaan_unit',
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
    ]
  });
};
