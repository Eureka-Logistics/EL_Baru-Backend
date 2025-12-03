const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_chat_internal_status', {
    id_status: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_chat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_chat_internal_status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
      {
        name: "id_chat",
        using: "BTREE",
        fields: [
          { name: "id_chat" },
        ]
      },
      {
        name: "id_users",
        using: "BTREE",
        fields: [
          { name: "id_users" },
        ]
      },
    ]
  });
};
