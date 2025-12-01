const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_gl', {
    id_gl: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    source_gl: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    katagori_gl: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nomor: {
      type: DataTypes.STRING(21),
      allowNull: false
    },
    date_gl: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    referance: {
      type: DataTypes.STRING(28),
      allowNull: false
    },
    ref: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    total_debet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_kredit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_user: {
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
    tableName: 'act_gl',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_gl" },
        ]
      },
    ]
  });
};
