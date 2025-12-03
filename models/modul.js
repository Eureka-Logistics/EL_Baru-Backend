const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modul', {
    id_modul: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_modul: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    static_content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    gambar: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    publish: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    status: {
      type: DataTypes.ENUM('user','admin'),
      allowNull: false
    },
    aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    link_seo: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'modul',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_modul" },
        ]
      },
    ]
  });
};
