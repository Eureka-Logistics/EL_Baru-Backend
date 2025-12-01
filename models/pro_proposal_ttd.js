const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pro_proposal_ttd', {
    ttd_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_proposal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pemohon_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pemohon_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    kadept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kadept_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mgrcab_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mgrcab_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aktcab_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aktcab_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kacab_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kacab_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mgrpst_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mgrpst_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aktpst_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aktpst_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    finance_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    finance_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amd_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dirmkt_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dirmkt_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dirutm_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dirutm_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pro_proposal_ttd',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ttd_id" },
        ]
      },
    ]
  });
};
