const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_bu_brench', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code_bu_brench: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    name_bu_brench: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wilayah: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    no_telp: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_bu_brench',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_bu_brench",
        using: "BTREE",
        fields: [
          { name: "id_bu_brench" },
        ]
      },
    ]
  });
};
