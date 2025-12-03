const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_notif', {
    id_notif: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_from: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_notif: {
      type: DataTypes.DATE,
      allowNull: true
    },
    desc_notif: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_notif: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_notif',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_notif" },
        ]
      },
    ]
  });
};
