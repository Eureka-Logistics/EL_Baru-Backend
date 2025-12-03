const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_status', {
    id_sm_status: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    location_city: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location_detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    received_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    received_phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    received_ttd: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_sm_status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sm_status" },
        ]
      },
      {
        name: "id_mp",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
    ]
  });
};
