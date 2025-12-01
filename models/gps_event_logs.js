module.exports = (sequelize, DataTypes) => {
  return sequelize.define('gps_event_logs', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    vehicle_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    device_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    plat_nomor: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    geo_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    event_type: {
      type: DataTypes.ENUM('overspeed', 'stop', 'start', 'idle', 'parking', 'moving'),
      allowNull: false
    },
    from_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration_hours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    speed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    speed_limit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    driver_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    driver_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'gps_event_logs',
    timestamps: false, // Karena sudah ada created_at manual
    indexes: [
      {
        fields: ['vehicle_id']
      },
      {
        fields: ['event_type']
      },
      {
        fields: ['from_time']
      },
      {
        fields: ['driver_id']
      },
      {
        fields: ['vehicle_id', 'event_type', 'from_time', 'to_time'],
        unique: true,
        name: 'unique_gps_event'
      }
    ]
  });
};
