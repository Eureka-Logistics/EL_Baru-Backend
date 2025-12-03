const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_spesifikasi', {
    id_spesifikasi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_asset: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brand: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    processor: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ram: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    hdd: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    monitor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    keyboard: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mouse: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lainnya: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    operatingsystem: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    office: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    adobe: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    enterpise: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    browser: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    messenger: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tools: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    porxy: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(25),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset_spesifikasi',
    timestamps: false
  });
};
