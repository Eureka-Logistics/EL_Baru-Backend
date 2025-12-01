const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('act_gl_detail', {
    id_gl_detail: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_gl: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ar_detail: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ap: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ap_detail: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_msm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    msm: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    debit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kredit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_dept: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_account: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    keterangan_inv: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    no_faktur: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    number_sort: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'act_gl_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_gl_detail" },
        ]
      },
    ]
  });
};
