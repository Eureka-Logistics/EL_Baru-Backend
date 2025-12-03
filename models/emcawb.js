const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emcawb', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    awbmitra: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    awbemc: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    }
  }, {
    sequelize,
    tableName: 'emcawb',
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
