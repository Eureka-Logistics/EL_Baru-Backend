const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_asm', {
    id_asm: {
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
    nik_asm: {
      type: DataTypes.STRING(30),
      allowNull: false
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
    tableName: 'm_asm',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_asm" },
        ]
      },
      {
        name: "nik_asm",
        using: "BTREE",
        fields: [
          { name: "nik_asm" },
        ]
      },
    ]
  });
};

