const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('armadaa', {
    id_armada: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    armada: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    jumlah_roda: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    panjang: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lebar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tinggi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'armadaa',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_armada" },
        ]
      },
    ]
  });
};
