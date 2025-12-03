const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_performance_employee', {
    id_performance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_karyawan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_penilai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_nilai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nilai_a: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_b: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_c: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_d: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_e: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_f: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_g: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_h: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_i: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_j: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_k: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_l: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_m: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_n: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_o: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_p: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_q: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_r: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_s: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_t: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_u: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_v: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_w: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_x: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_y: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    nilai_z: {
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_performance_employee',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_performance" },
        ]
      },
    ]
  });
};
