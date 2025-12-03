const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_status_chat', {
    id_mstatus_chat: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_status_chat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_chat: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    remark: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'm_status_chat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mstatus_chat" },
        ]
      },
    ]
  });
};
