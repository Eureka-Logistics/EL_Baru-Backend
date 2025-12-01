const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ar_personal', {
    id_arp: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_ar: {
      type: DataTypes.STRING(23),
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    date_ar: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    berat: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      defaultValue: 0.00
    },
    ppn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_faktur: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_faktur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status_faktur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_ar_personal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_arp" },
        ]
      },
    ]
  });
};
