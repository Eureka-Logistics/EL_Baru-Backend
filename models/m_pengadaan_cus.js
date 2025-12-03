const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_pengadaan_cus', {
    id_pc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ph_cus: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_customer_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    jenis_barang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    do: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    service: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    vehicle: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    packing: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asuransi: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: "N"
    },
    tgl_pickup: {
      type: DataTypes.DATE,
      allowNull: false
    },
    waktu_muat: {
      type: DataTypes.TIME,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_order: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_pengadaan_cus',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pc" },
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
        name: "packing",
        using: "BTREE",
        fields: [
          { name: "packing" },
        ]
      },
      {
        name: "id_pc",
        using: "BTREE",
        fields: [
          { name: "id_pc" },
        ]
      },
    ]
  });
};
