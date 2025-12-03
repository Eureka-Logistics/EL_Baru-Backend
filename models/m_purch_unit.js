const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_purch_unit', {
    id_mpu: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tgl_tersedia: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00"
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    jenis_unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Wilayah: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jml_unit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tgl_akhir_ketersediaan: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00"
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_purch_unit',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_mpu" },
        ]
      },
    ]
  });
};
