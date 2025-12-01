const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_vehicle_position', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vehicle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    nopol: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location_detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lon: {
      type: DataTypes.DOUBLE(10,6),
      allowNull: true,
      defaultValue: 0.000000
    },
    lat: {
      type: DataTypes.DOUBLE(10,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    gpstime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    speed: {
      type: DataTypes.DOUBLE(5,2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'm_vehicle_position',
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
