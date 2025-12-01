const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('n_request', {
    id_nrequest: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_req: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    id_ncustomer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    al_muat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_kmuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    al_bongkar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_kbongkar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    items: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    koli: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pickup_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    vehicle: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    service: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "retail"
    },
    fees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    date_order: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'n_request',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_nrequest" },
        ]
      },
    ]
  });
};
