const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mp_vendor_truk', {
    vendor_truk_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    truk_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    merk_manufactur: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    stnk_masa: {
      type: DataTypes.DATE,
      allowNull: false
    },
    stnk_image: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    no_polisi: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    add_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mp_vendor_truk',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "vendor_truk_id" },
        ]
      },
    ]
  });
};
