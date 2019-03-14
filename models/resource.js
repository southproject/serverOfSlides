/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('resource', {
      r_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      r_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      r_descript: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      rtype:{
          type:DataTypes.STRING(50),
          allowNull:false
      },
      file_url:{
        type:DataTypes.STRING(255),
        allowNull:true
      }
    }, {
      tableName: 'resource',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
    });
  };
  