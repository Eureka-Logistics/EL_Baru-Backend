const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erl_brench_rep', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_rep_erl: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_erl_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code_erl_brench: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'erl_brench_rep',
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
