const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mitra_chat', {
    id_mchat: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ufrom: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "purch"
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mchat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attach: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_mchat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status_android: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'mitra_chat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mchat" },
        ]
      },
    ]
  });
};
