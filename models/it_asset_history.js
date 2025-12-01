const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_asset_history', {
    id_history: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_asset: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_asset_history',
    timestamps: false
  });
};
