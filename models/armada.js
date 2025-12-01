const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('armada', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    icon: {
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
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'armada',
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
