const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sm_receive', {
    id_sm_receive: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    divisi: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    checklist: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    no_invoice_vendor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('reject','receive'),
      allowNull: false
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: true
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kepada: {
      type: DataTypes.ENUM('ar','ap'),
      allowNull: true
    },
    diserahkan: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    diserahkan_group: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tolak_user: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tolak_tgl: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_sm_receive',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sm_receive" },
        ]
      },
      {
        name: "id_sm",
        using: "BTREE",
        fields: [
          { name: "id_msm" },
        ]
      },
      {
        name: "divisi",
        using: "BTREE",
        fields: [
          { name: "divisi" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
