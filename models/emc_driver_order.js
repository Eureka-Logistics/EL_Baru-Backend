const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_driver_order', {
    id_mdriver_order: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_order_detail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    foto: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    ttd_pengirim: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ttd_penerima: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ttd_driver: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    baca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'emc_driver_order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mdriver_order" },
        ]
      },
      {
        name: "id_order",
        using: "BTREE",
        fields: [
          { name: "id_order" },
        ]
      },
      {
        name: "id_order_detail",
        using: "BTREE",
        fields: [
          { name: "id_order_detail" },
        ]
      },
      {
        name: "id_driver",
        using: "BTREE",
        fields: [
          { name: "id_driver" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
