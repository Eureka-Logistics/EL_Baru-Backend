const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quotation', {
    id_quotation: {
      autoIncrement: true,
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    quotation_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pic_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    id_customer: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax_included: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tax_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    insurance_included: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    insurance_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    multidrop_included: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    multidrop_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tkbm_included: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tkbm_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    id_bu: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    id_bu_brench: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    id_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    akunting: {
      type: DataTypes.ENUM('N', 'Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    tgl_direktur: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('new', 'followup', 'approve', 'rev', 'done'),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'quotation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_quotation" },
        ]
      },
    ]
  });
};
