const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_ticket', {
    id_complaint: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_complaint: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    type_complaint: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status_complaint: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_support: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    complaint: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_complaint: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_complaint: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    date_finish: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_ticket',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_complaint" },
        ]
      },
    ]
  });
};
