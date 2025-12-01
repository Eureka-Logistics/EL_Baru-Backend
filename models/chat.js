const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pengirim: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_penerima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_pesan: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chat',
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
