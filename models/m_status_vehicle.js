const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_status_vehicle', {
    id_svehicle: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_vehicle: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    id_driver: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: ""
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    driver: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ""
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    muatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    posisi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tujuan: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_status_vehicle',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_svehicle" },
        ]
      },
    ]
  });
};
