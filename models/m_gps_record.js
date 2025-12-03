const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_gps_record', {
    id_record: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.STRING(100),
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
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_gps_record',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_record" },
        ]
      },
    ]
  });
};
