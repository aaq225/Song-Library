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
  // going to make the default value for the page number = 1 assuming that when the server recieves the initial request from the client, they are at page 1
  const { artist, keyword, limit, page = 1 } = req.query; // expecting the name of artist client chose from dropdown, the value of keyword client wrote in textbox, the limit chosen from the dropdown, and the page number
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
  // I watched this video to learn about pagination: https://www.youtube.com/watch?v=Ynp6Gdd3XVE
  // Checking if the limit select is at the default value (do nothing), meaning user wants all songs displayed, otherwise, I will limit according to what client selects
  if (limit) { 
    // for example, if page is 5, and limit is 10, offset = 5-1 * 10 = 40, so the offset is 40 and we want to return songs starting from 40 ending at 50 for this page
    const offset = (page - 1) * parseInt(limit);
    query += ' LIMIT @limit OFFSET @offset';
    optionValues.limit = parseInt(limit); // need to make sure limit is integer to pass it as a query parameter in sql
    optionValues.offset = offset;
  }
  const statement = db.prepare(query);
  const songs = statement.all(optionValues);
  res.json(songs);
});

app.listen(3000, () => console.log("Starting up Top 40 Search"));