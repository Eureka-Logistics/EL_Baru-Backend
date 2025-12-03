const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_driver_order', {
    id_mdriver_order: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mpd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
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
    foto: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ""
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    berat: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_driver_order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mdriver_order" },
        ]
      },
    ]
  });
};
