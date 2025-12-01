const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_static', {
    id_static: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email_static: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    phone_static: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    manufacture: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    model: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    version: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    reg_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'emc_static',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_static" },
        ]
      },
      {
        name: "email_static",
        using: "BTREE",
        fields: [
          { name: "email_static" },
        ]
      },
    ]
  });
};
