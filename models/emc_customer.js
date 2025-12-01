const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_customer', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID CUstomer Elogs"
    },
    id_cs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID Customer RACE"
    },
    fulfillment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fulfillment_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Agent RACEPoint"
    },
    agent_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pin: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: ""
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    divisi: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    nik: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    payment: {
      type: DataTypes.ENUM('cash','tempo','credit',''),
      allowNull: false
    },
    top: {
      type: DataTypes.ENUM('1','14','30'),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    referral_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "0"
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    foto_google: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deposit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "Y"
    },
    masa_aktif: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_reg: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status_login: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    code: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    code_date: {
      type: DataTypes.DATE,
      allowNull: false
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
    tableName: 'emc_customer',
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
    ]
  });
};
