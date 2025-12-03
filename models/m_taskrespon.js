const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_taskrespon', {
    id_respon: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_task: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bertemu: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    jabatan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tagihan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dapat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aktivitas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    positif: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    negatif: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    peluang: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hambatan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    img_a: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_c: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_taskrespon',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_respon" },
        ]
      },
    ]
  });
};
