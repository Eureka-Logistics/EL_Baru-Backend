const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('gps_geofence', {
    id_geofence: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    geo_name: {
      type: DataTypes.STRING(100)
    },
    latitude: {
      type: DataTypes.STRING(30)
    },
    longitude: {
      type: DataTypes.STRING(30)
    },
    date_create: {
      type: DataTypes.DATE
    },
    is_active: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'gps_geofence',
    timestamps: false
  });
};
