const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_jne_awb', {
    id_awb: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    awb: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    id_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'emc_jne_awb',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_awb" },
        ]
      },
    ]
  });
};
