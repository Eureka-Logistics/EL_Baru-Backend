const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_driver_perbaikan', {
    id_mdp: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_vehicle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    km_vehicle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_driver_perbaikan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mdp" },
        ]
      },
    ]
  });
};
