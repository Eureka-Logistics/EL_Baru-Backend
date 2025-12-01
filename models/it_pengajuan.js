const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_pengajuan', {
    id_pengajuan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_pengajuan: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    judul: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    desciption: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attach: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    date_pengajuan: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'it_pengajuan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pengajuan" },
        ]
      },
    ]
  });
};
