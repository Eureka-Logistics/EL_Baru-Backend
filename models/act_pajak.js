const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_pajak', {
    id_pajak: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_nomor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    end_nomor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    last_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    date_pajak: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'act_pajak',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pajak" },
        ]
      },
    ]
  });
};
