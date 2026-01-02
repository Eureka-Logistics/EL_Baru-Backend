const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_cab', {
    id_cab: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode_cabang: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nama_cabang: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wilayah_cabang: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'm_cab',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_cab" },
        ]
      },
    ]
  });
};

