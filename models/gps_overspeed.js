module.exports = (sequelize, DataTypes) => {
  return sequelize.define('gps_overspeed', {
    datetime: DataTypes.DATE,
    mileage: DataTypes.INTEGER,
    heading: DataTypes.INTEGER,
    speed: DataTypes.FLOAT,
    longitude: DataTypes.DOUBLE,
    latitude: DataTypes.DOUBLE,
    acc: DataTypes.TINYINT,
    event_message: DataTypes.STRING,
    fuel1_volume: DataTypes.FLOAT,
    fuel2_volume: DataTypes.FLOAT,
    temperature: DataTypes.FLOAT,
    geoName: DataTypes.STRING,
    device_name: DataTypes.STRING
  }, {
    tableName: 'gps_overspeed',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};
