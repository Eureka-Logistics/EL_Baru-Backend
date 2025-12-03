const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_operasional_uang_jalan_detail', {
    id_uang_jalan_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_uang_jalan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'm_operasional_uang_jalan',
        key: 'id_uang_jalan'
      }
    },
    akun: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pajak: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    besar_pajak: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "persentase"
    },
    nominal_pajak: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_operasional_uang_jalan_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan_detail" },
        ]
      },
      {
        name: "id_uang_jalan",
        using: "BTREE",
        fields: [
          { name: "id_uang_jalan" },
        ]
      },
    ]
  });
};
