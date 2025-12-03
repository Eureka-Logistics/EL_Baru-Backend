const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_status_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    act_customer: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    tgl_act_1: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    act_sales: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    tgl_act_2: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    akunting: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 25
    },
    act_akunting: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    tgl_act_3: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    operasional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kendaraan_operasional: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    tgl_act_4: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    purchasing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kendaraan_purchasing: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    tgl_act_5: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_status_order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_mp",
        using: "BTREE",
        fields: [
          { name: "id_mp" },
          { name: "operasional" },
          { name: "kendaraan_operasional" },
          { name: "purchasing" },
          { name: "kendaraan_purchasing" },
        ]
      },
      {
        name: "kendaraan_purchasing",
        using: "BTREE",
        fields: [
          { name: "kendaraan_purchasing" },
        ]
      },
    ]
  });
};
