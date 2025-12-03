const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_retail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tgl_pickup: {
      type: DataTypes.DATE,
      allowNull: false
    },
    awb: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    dest: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tgl_terima: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    penerima: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nama_dituju: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    via: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    srv: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    jml_pcs: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jml_kg: {
      type: DataTypes.DOUBLE(11,2),
      allowNull: false
    },
    tarif_kg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarif_total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_insert: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_retail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
