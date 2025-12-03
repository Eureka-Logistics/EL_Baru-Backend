const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan_race', {
    id_uang_jalan_race: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rek_driver: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    bbm: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    makan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    parkir: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tol: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_sending: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'uang_jalan_race',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan_race" },
        ]
      },
    ]
  });
};
