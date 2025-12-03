const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_juornal_detail', {
    id_ajt: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_gl: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_sm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    msm: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_ar: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    no_faktur: {
      type: DataTypes.STRING(22),
      allowNull: false
    },
    id_ap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_ap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_mitra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_inv_mitra: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    dari: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tujuan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_account: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_dept: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    debet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kredit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'act_juornal_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ajt" },
        ]
      },
    ]
  });
};
