const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_pajak_pembatalan', {
    id_pembatalan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_faktur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unit: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    no_faktur: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    no_ar: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    npwp: {
      type: DataTypes.STRING(22),
      allowNull: false
    },
    nilai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_ar: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'act_pajak_pembatalan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pembatalan" },
        ]
      },
    ]
  });
};
