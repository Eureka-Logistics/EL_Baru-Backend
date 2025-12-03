const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_questionnaire', {
    id_questionnaire: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ucust: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    f1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    f2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    f3: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    f4: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    f5: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    f6: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    f7: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    q_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_questionnaire',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_questionnaire" },
        ]
      },
    ]
  });
};
