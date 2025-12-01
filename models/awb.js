const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('awb', {
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    awbmitra: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'awb',
    timestamps: false
  });
};
