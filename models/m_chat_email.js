const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_chat_email', {
    id_chat_email: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    penerima: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_chat_email',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_chat_email" },
        ]
      },
    ]
  });
};
