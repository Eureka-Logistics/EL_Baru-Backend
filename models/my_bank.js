const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('my_bank', {
    bank_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bank: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sandi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    rtgs: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    singkat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    bank_kode: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'my_bank',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bank_id" },
        ]
      },
    ]
  });
};
