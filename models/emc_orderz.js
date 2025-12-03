const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_orderz', {
    id_order: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_order: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      unique: "no_order"
    },
    awb: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "Personal"
    },
    code_type: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
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
    qty: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: ""
    },
    total_km: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    vehicle: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Motor"
    },
    vehicle_number: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    koin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    promo_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    promo_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    packing: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    packing_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ""
    },
    packing_fee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    insurance: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    insurance_fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    driver_helper: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    extra_helper: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    roundtrip_exp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    roundtrip_reg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    overnight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pallet_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    pallet_fee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    night: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    night_fee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    add_cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pay: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "Cash"
    },
    return_item: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    credit_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    koin_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date_pickup: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    date_order: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "1"
    },
    info_cancel: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    new: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0"
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
    date_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'emc_orderz',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_order" },
        ]
      },
      {
        name: "no_order",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "no_order" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
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
        name: "new",
        using: "BTREE",
        fields: [
          { name: "new" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
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
        name: "id_driver",
        using: "BTREE",
        fields: [
          { name: "id_driver" },
        ]
      },
    ]
  });
};
