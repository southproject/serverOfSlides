/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user_collection', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      course_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    }, {
      tableName: 'user_collection',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
    });
  };
  