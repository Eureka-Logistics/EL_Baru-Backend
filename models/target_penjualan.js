const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('target_penjualan', {
    id_target: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cabang: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    tahun: {
      type: DataTypes.DATE(4),
      allowNull: true,
      defaultValue: "0000"
    },
    januari: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    februari: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maret: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    april: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mei: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    juni: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    juli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agustus: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    september: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    oktober: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    november: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    desember: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_target: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'target_penjualan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_target" },
        ]
      },
    ]
  });
};
