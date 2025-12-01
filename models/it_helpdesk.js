const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('it_helpdesk', {
    id_helpdesk: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_helpdesk: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    type_helpdesk: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status_helpdesk: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    id_user: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    },
    divisi: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    id_support: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    it_memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_request: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    end_request: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_finish: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'it_helpdesk',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_helpdesk" },
          { name: "id_user" },
        ]
      },
    ]
  });
};
