const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_customer_chat', {
    id_emcchat: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ufrom: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_emc_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attach: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_chat: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_customer_chat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_emcchat" },
        ]
      },
    ]
  });
};
