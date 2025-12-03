const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_jne_kode', {
    id_kode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    divisi: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'emc_jne_kode',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_kode" },
        ]
      },
    ]
  });
};
