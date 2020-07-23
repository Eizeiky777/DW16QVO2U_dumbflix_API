'use strict';
module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    title: DataTypes.STRING,
    thumbnailFilm: DataTypes.STRING,
    year: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Film.associate = function(models) {
    Film.belongsTo(models.Category, {
      foreignKey: {
        name: "categoryId",
      },
    });
    Film.hasMany(models.Episode);
  };
  return Film;
};