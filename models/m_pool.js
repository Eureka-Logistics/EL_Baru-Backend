const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pool', {
    id_pool: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_pool: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    alamat_pool: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pool_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    latitude: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pool',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pool" },
        ]
      },
      {
        name: "pool_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pool_code" },
        ]
      },
    ]
  });
};
