const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_order_detail', {
    id_order_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_awb: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    no_order: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_mpd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_origins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_destinations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    jarak: {
      type: DataTypes.DOUBLE(10,1),
      allowNull: false,
      defaultValue: 0.0
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    items_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    items_img: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    qty: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: ""
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    delivery_status: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "1"
    },
    delivery_status_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    baca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    }
  }, {
    sequelize,
    tableName: 'emc_order_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_order_detail" },
        ]
      },
      {
        name: "no_order",
        using: "BTREE",
        fields: [
          { name: "no_order" },
        ]
      },
      {
        name: "id_mp",
        using: "BTREE",
        fields: [
          { name: "id_mp" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "delivery_status" },
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
        name: "id_origins",
        using: "BTREE",
        fields: [
          { name: "id_origins" },
        ]
      },
      {
        name: "id_destinations",
        using: "BTREE",
        fields: [
          { name: "id_destinations" },
        ]
      },
    ]
  });
};
