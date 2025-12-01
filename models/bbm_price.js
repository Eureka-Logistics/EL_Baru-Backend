const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bbm_price', {
    id_bbm_price: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bbm: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    jenis: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    harga_bbm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provinsi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gambar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    masa_berlaku: {
      type: DataTypes.STRING(225),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bbm_price',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_bbm_price" },
        ]
      },
    ]
  });
};
