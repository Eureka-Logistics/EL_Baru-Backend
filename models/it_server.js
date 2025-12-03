const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_server', {
    id_server: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    server: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    periode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_register: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    date_tempo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0000-00-00"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    category: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    note: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    departemen: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'it_server',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_server" },
        ]
      },
    ]
  });
};
