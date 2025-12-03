const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('top', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_sm: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    topv: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    tgl_terimasm: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    no_invoice: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    tgl_invoice: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tagihan: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'top',
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
