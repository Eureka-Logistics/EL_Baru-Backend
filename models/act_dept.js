const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_dept', {
    id_dept: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_dept: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dept: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    katagori: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'act_dept',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_dept" },
        ]
      },
    ]
  });
};
