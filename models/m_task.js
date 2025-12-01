const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_task', {
    id_task: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    task_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    prospek: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    datetask: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    datecreate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tahu_1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tahu_2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tahu_3: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_task',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_task" },
        ]
      },
      {
        name: "id_task",
        using: "BTREE",
        fields: [
          { name: "id_task" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
    ]
  });
};
