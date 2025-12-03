const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chat_driver', {
    id_chat: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_chat_android: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dari: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kepada: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(5),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chat_driver',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_chat" },
        ]
      },
    ]
  });
};
