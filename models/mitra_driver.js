const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mitra_driver', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mitra: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: ""
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    no_ktp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    no_sim: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jenis_sim: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tgl_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tempat_lahir: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    agama: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_telp: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    no_telp2: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_masuk: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
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
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'mitra_driver',
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
