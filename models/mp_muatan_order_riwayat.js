const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mp_muatan_order_riwayat', {
    muatan_order_riwayat_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    muatan_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    add_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mp_muatan_order_riwayat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "muatan_order_riwayat_id" },
        ]
      },
    ]
  });
};
