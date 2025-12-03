const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_info', {
    id_info: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_vehicle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    judul: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_kategori: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    img_foto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lon: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE(10,7),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'm_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_info" },
        ]
      },
    ]
  });
};
