const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_po_coment', {
    id_coment_po: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_po: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    to_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    coment: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status_po: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_po_coment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_coment_po" },
        ]
      },
    ]
  });
};
