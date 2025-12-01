const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_ap_biaya', {
    id_ap_biaya: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_ap: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    perihal: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    keperluan: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ppn: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    date_ap: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_terima: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_ap_biaya',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ap_biaya" },
        ]
      },
    ]
  });
};
