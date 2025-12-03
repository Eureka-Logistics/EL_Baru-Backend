const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_chat_internal', {
    id_chat: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    atachmen: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_chat_internal',
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
