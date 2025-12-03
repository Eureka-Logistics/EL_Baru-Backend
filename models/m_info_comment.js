const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_info_comment', {
    id_icomment: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_info: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    from: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0"
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_comment: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_info_comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_icomment" },
        ]
      },
    ]
  });
};
