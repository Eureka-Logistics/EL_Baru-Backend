const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ebh_area', {
    id_area: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    area_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ""
    },
    area_pic: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ""
    },
    area_hp_pic: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    area_address: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ebh_area',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_area" },
        ]
      },
    ]
  });
};
