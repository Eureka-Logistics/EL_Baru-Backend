const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history_pengiriman', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    history_pengiriman: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    id_alamat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lat_old: {
      type: DataTypes.FLOAT(11,7),
      allowNull: false
    },
    lon_old: {
      type: DataTypes.FLOAT(11,7),
      allowNull: false
    },
    lat_new: {
      type: DataTypes.FLOAT(11,7),
      allowNull: false
    },
    lon_new: {
      type: DataTypes.FLOAT(11,7),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'history_pengiriman',
    timestamps: true,
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
