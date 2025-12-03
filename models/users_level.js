const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_level', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    levels: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kode_level: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users_level',
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
