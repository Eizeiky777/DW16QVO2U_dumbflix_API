'use strict';
module.exports = (sequelize, DataTypes) => {
  const Episode = sequelize.define('Episode', {
    title: DataTypes.STRING,
    thumbnailFilm: DataTypes.STRING,
    linkFilm: DataTypes.STRING,
    filmId: DataTypes.INTEGER
  }, {});
  Episode.associate = function(models) {
    // associations can be defined here
    Episode.belongsTo(models.Film);
  };
  return Episode;
};

