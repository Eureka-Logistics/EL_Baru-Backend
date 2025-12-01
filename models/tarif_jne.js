const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tarif_jne', {
    id_jne: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kota: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    kecamatan: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    regular: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    etd_regular: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ""
    },
    oke: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    etd_oke: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    yes: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'tarif_jne',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_jne" },
        ]
      },
    ]
  });
};
