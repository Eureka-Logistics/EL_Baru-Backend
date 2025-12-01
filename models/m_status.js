const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_status', {
    id_status: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mp: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    ph: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    id_user: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    baca: {
      type: DataTypes.ENUM('1','0'),
      allowNull: true,
      defaultValue: "0"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
      {
        name: "id_status",
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
    ]
  });
};
