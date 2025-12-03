const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_bu_employee', {
    id_employee: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_employee: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Tidak Terkategori','Sales'),
      allowNull: true
    },
    division: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    job_level: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    designation: {
      type: DataTypes.ENUM('Group Leader','Assistant Manager','Staff','Manager','Kacab','Konsultan','Security','Koordinator','AMD'),
      allowNull: false
    },
    code_employee_position: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    id_bu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_bu_brench: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_gl: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    id_asm: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    id_mgr: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    id_kacab: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    id_amd: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    no_telp: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    Jenis_kelamin: {
      type: DataTypes.ENUM('L','P'),
      allowNull: true
    },
    tgl_lahir: {
      type: DataTypes.DATE,
      allowNull: true
    },
    agama: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status_kawin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_masuk_kerja: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Status_pegawai: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    lokasi: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Golongan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pendidikan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jurusan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pajak: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_bu_employee',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_employee" },
        ]
      },
      {
        name: "code_employee_position",
        using: "BTREE",
        fields: [
          { name: "code_employee_position" },
        ]
      },
      {
        name: "category",
        using: "BTREE",
        fields: [
          { name: "category" },
        ]
      },
    ]
  });
};
