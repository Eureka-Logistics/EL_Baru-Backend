const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_target', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cabang: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: ""
    },
    bulan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tahun: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: ""
    },
    total_target: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_target',
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
