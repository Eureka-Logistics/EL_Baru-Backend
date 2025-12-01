const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_bu', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "id_bu"
    },
    name_bu: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    code_bu: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    cbu: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_bu',
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
      {
        name: "id_bu",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_bu" },
        ]
      },
    ]
  });
};
