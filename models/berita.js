const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('berita', {
    id_berita: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_kategori: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    judul: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    judul_seo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    headline: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    isi_berita: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hari: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jam: {
      type: DataTypes.TIME,
      allowNull: false
    },
    gambar: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dibaca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    tag: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'berita',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_berita" },
        ]
      },
    ]
  });
};
