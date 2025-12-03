const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('statistik', {
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    online: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'statistik',
    timestamps: false
  });
};
