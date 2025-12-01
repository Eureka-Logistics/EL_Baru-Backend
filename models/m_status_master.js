const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_status_master', {
    id_statusm: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    boostrap: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_status_master',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_statusm" },
        ]
      },
      {
        name: "id_status",
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
    ]
  });
};
