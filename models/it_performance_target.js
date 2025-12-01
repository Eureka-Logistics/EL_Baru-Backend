const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_performance_target', {
    id_target: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_target: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    target: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type_target: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status_target: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_support: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    finish_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_performance_target',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_target" },
        ]
      },
    ]
  });
};
