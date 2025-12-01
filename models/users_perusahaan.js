const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_perusahaan', {
    id_perusahaan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_perusahaan: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    nama_perusahaan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users_perusahaan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_perusahaan" },
        ]
      },
    ]
  });
};
