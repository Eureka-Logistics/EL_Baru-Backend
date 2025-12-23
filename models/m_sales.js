const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_sales', {
    id_sales: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bu: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nama_bu: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nik_sales: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nama_sales: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    wilayah_sales: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kode_gl: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nama_gl: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wilayah_gl: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kode_asm: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nama_asm: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wilayah_asm: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kode_manager: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nama_manager: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wilayah_manager: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    tableName: 'm_sales',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sales" },
        ]
      },
      {
        name: "nik_sales",
        using: "BTREE",
        fields: [
          { name: "nik_sales" },
        ]
      },
    ]
  });
};

