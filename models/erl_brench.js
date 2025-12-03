const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erl_brench', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_erl_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code_erl_brench: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    name_erl_brench: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'erl_brench',
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
