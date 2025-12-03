const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uang_jalan_ptj', {
    id_uj_ptj: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_uang_jalan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_mp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_unit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    makan_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    makan_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    bbm_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parkir_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parkir_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    tol_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tol_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    timbangan_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    timbangan_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    penyeberangan_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    penyeberangan_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    bongkar_muat_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    overtonase_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    overtonase_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    karantina_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    karantina_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    kawalan_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kawalan_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    pass_bandara_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pass_bandara_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true,
      defaultValue: 0.00
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_user_ops: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ops_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    finance_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    finance_spv: {
      type: DataTypes.TINYINT(1),
      allowNull: true
    },
    finance_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    finance_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'uang_jalan_ptj',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_uj_ptj" },
        ]
      },
    ]
  });
};
