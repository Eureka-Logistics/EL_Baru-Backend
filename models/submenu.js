const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('submenu', {
    id_sub: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_sub: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    link_sub: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_main: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_submain: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    adminsubmenu: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(5),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'submenu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sub" },
        ]
      },
    ]
  });
};
