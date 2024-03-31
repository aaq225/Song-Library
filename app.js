/*
Abdelrahman Qamhia - aaq225
CSE264 - Programming Assignment 5
My Personal Library
*/
const express = require("express");
const path = require("path");
const db = require('better-sqlite3')('top40.db'); // ran into problems using import so moved over to require
const app = express();
db.pragma('journal_mode = WAL');
app.use(express.static(
  path.resolve(__dirname, "public")
));


app.get('/artists', (req,res) => {
  const getArtistsStatement = db.prepare('SELECT DISTINCT artist FROM songlist ORDER BY artist'); // this selects all artists and orders them alphabetically
  const artists = getArtistsStatement.all(); // this executes the statement and returns the resulting artists (all of them)
  res.json(artists); // send the list of artists to the client side for display
});

app.get('/songs', (req,res) => {
  const { artist, keyword } = req.query; // expecting a pair of values from the client's select and textbox fields
  let query = 'SELECT * FROM songlist WHERE 1=1'; // this makes it easier to append on search parameters later, I used this source to learn about; https://www.navicat.com/en/company/aboutus/blog/1812-the-purpose-of-where-1-1-in-sql-statements
  const optionValues = {};

  if (artist) {
    query += ' AND artist = @artist'; // this is an sql named param
    optionValues.artist = artist;
  }

  if (keyword) {
    query += ' AND title LIKE @keyword';
    optionValues.keyword = `%${keyword}%`;
  }

  const statement = db.prepare(query);
  const songs = statement.all(optionValues);
  res.json(songs);
});

app.listen(3000, () => console.log("Starting up Top 40 Search"));


