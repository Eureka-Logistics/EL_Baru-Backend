const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengadaan_race', {
    id_mpr: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_penerima: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    invenlocation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cabangid: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pic_nik: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pic_divisi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tgl_sj: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jam_pickup: {
      type: DataTypes.TIME,
      allowNull: false
    },
    item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ikat: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    referensi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    referensi_1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pic_penerima: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone_penerima: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    provinsi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kota: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kecamatan: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kodepos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status_sp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    receivedrep: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    receivedrepate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receivedrepuser: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    receivedeksp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    receivedekspdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receivedekpsuser: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    modified_date_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tgl_sinkron: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'm_pengadaan_race',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mpr" },
        ]
      },
      {
        name: "cabangid",
        using: "BTREE",
        fields: [
          { name: "cabangid" },
        ]
      },
      {
        name: "referensi",
        using: "BTREE",
        fields: [
          { name: "referensi" },
        ]
      },
      {
        name: "referensi_1",
        using: "BTREE",
        fields: [
          { name: "referensi_1" },
        ]
      },
      {
        name: "penerima",
        using: "BTREE",
        fields: [
          { name: "penerima" },
        ]
      },
      {
        name: "pic_penerima",
        using: "BTREE",
        fields: [
          { name: "pic_penerima" },
        ]
      },
    ]
  });
};
