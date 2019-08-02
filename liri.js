require('dotenv').config();

const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const fs = require('fs');

let allArgs = process.argv;
let action;
let query;

if (allArgs.length > 3) {
    action = process.argv[2];
    query = process.argv[3];
    if (query.charAt(0) === '"' && query.charAt(query.length - 1) === '"') {
        query = query.substr(1, query.length - 2);
    }
    console.log(`${action},"${query}"`);
    let command = `${action},"${query}"`;
    appendLog(command);
    runLIRI(action, query);
} else if (allArgs.length === 3) {
    action = process.argv[2];
    query = null;
    console.log(action);
    let command = action;
    appendLog(command);
    runLIRI(action, query);
} else {
    console.log('Please enter an action for LIRI bot to take: \nconcert-this \'ARTIST/BAND\' \nspotify-this-song \'SONG NAME\' \nmovie-this \'MOVIE NAME\' \ndo-what-it-says');
}


function concert(query) {
    if (query === null) {
        console.log('An artist or band name is required to run this command');
        return;
    }
    let concertUrl = `https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`;
    axios.get(concertUrl)
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let concertArray = [];
                let city = response.data[i].venue.city;
                let region = response.data[i].venue.region;
                let country = response.data[i].venue.country;
                let location = city + ', ' + country;
                let date = response.data[i].datetime;
                if (region !== '') {
                    location = city + ', ' + region + ', ' + country;
                }
                console.log(`---------------`);
                console.log(`Venue Name: ${response.data[i].venue.name}`);
                console.log(`Location: ${location}`);
                console.log(`Date: ${moment(date).format('MM/DD/YYYY')}`);
                console.log(`---------------`);
                concertArray.push(`---------------`);
                concertArray.push(`Venue Name: ${response.data[i].venue.name}`);
                concertArray.push(`Location: ${location}`);
                concertArray.push(`Date: ${moment(date).format('MM/DD/YYYY')}`);
                concertArray.push(`---------------`);
                appendLog(concertArray.join('\n'));
            }
    });
}

async function spotifySong(query) {
    let respHandler;
    if (query === null) {
        query = 'The Sign';
        respHandler = handleSpotifyResponseNoArg
    } else {
        respHandler = handleSpotifyResponse
    }
    await spotify.search({ type: 'track', query: query })
        .then(respHandler)
        .catch(function(err) {
            console.log(err);
    });
}

function handleSpotifyResponseNoArg(response) {
    let spotifyNoArgArray = [];
    let defaultSongDetails = response.tracks.items.filter(t => t.artists[0].name === 'Ace of Base');
    console.log(`---------------`);
    spotifyNoArgArray.push(`---------------`);
    console.log(`Artist(s): ${defaultSongDetails[0].artists[0].name}`);
    spotifyNoArgArray.push(`Artist(s): ${defaultSongDetails[0].artists[0].name}`);
    console.log(`Track Title: ${defaultSongDetails[0].name}`);
    spotifyNoArgArray.push(`Track Title: ${defaultSongDetails[0].name}`);
    console.log(`Album: ${defaultSongDetails[0].album.name}`);
    spotifyNoArgArray.push(`Album: ${defaultSongDetails[0].album.name}`);
    let previewLink = defaultSongDetails[0].preview_url;
    if (previewLink === null) {
        console.log(`There is no preview for this song.`);
        spotifyNoArgArray.push(`There is no preview for this song.`);
    } else {
        console.log(`Preview Link: ${previewLink}`);
        spotifyNoArgArray.push(`Preview Link: ${previewLink}`);
    }
    console.log(`---------------`);
    spotifyNoArgArray.push(`---------------`);
    appendLog(spotifyNoArgArray.join('\n'));
}

function handleSpotifyResponse(response) {
    for (let i = 0; i < response.tracks.items.length; i++) {
        let spotifyArgArray = [];
        console.log(`---------------`);
        spotifyArgArray.push(`---------------`);
        let artistArray = [];
        for (let j = 0; j < response.tracks.items[i].artists.length; j++) {
            let artist = response.tracks.items[i].artists[j].name;
            artistArray.push(artist);
        }
        let artistList = artistArray.join(', ');
        console.log(`Artist: ${artistList}`);
        console.log(`Track Title: ${response.tracks.items[i].name}`);
        console.log(`Album: ${response.tracks.items[i].album.name}`);
        spotifyArgArray.push(`Artist: ${artistList}`);
        spotifyArgArray.push(`Track Title: ${response.tracks.items[i].name}`);
        spotifyArgArray.push(`Album: ${response.tracks.items[i].album.name}`);
        let previewLink = response.tracks.items[i].preview_url;
        if (previewLink === null) {
            console.log(`There is no preview for this song.`);
            spotifyArgArray.push(`Preview Link: ${previewLink}`);
        } else {
            console.log(`Preview Link: ${previewLink}`);
            spotifyArgArray.push(`Preview Link: ${previewLink}`);
        }
        console.log(`---------------`);
        spotifyArgArray.push(`---------------`);
        appendLog(spotifyArgArray.join('\n'))
    }
}

function movie(query) {
    if (query === null) {
        query = 'Mr. Nobody';
    }
    let movieUrl = `http://www.omdbapi.com/?t=${query}&y=&plot=short&apikey=trilogy`;
    axios.get(movieUrl)
        .then(function (response) {
            let movieArray = [];
            let ratings = response.data.Ratings;
            let IMDB = ratings.filter(r => r.Source === 'Internet Movie Database');
            let rottenTomatoes = ratings.filter(r => r.Source === 'Rotten Tomatoes');
            console.log(`---------------`);
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year Released: ${response.data.Year}`);
            movieArray.push(`---------------`);
            movieArray.push(`Title: ${response.data.Title}`);
            movieArray.push(`Year Released: ${response.data.Year}`);
            if (IMDB.length === 0) {
                console.log('IMDB Rating: None for this movie');
                movieArray.push('IMDB Rating: None for this movie');
            } else {
                console.log(`IMDB Rating: ${IMDB[0].Value}`);
                movieArray.push(`IMDB Rating: ${IMDB[0].Value}`);
            }
            if (rottenTomatoes.length === 0) {
                console.log('Rotten Tomatoes Rating: None for this movie');
                movieArray.push('Rotten Tomatoes Rating: None for this movie');
            } else {
                console.log(`Rotten Tomatoes Rating: ${rottenTomatoes[0].Value}`);
                movieArray.push(`Rotten Tomatoes Rating: ${rottenTomatoes[0].Value}`);
            }
            console.log(`Production Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
            console.log(`---------------`);
            movieArray.push(`Production Country: ${response.data.Country}`);
            movieArray.push(`Language: ${response.data.Language}`);
            movieArray.push(`Plot: ${response.data.Plot}`);
            movieArray.push(`Actors: ${response.data.Actors}`);
            movieArray.push(`---------------`);
            appendLog(movieArray.join('\n'));
        });
}

function fileAction() {
    fs.readFile('random.txt', 'utf8', function (err, response) {
        if (err) {
            console.log(err);
        }
        response = response.split(',');
        action = response[0];
        console.log(action);
        query = response[1];
        if (query.charAt(0) === '"' && query.charAt(query.length - 1) === '"') {
            query = query.substr(1, query.length - 2);
        }
        console.log(query);
        appendLog(`${action},"${query}"`);
        runLIRI(action, query);
    });
}

async function appendLog(toBeLogged) {
    let logText = toBeLogged;
    await fs.appendFile('log.txt', `\r\n${logText}`, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

function runLIRI(action, query) {
    switch (action) {
        case 'concert-this':
            concert(query);
            break;
        case 'spotify-this-song':
            spotifySong(query);
            break;
        case 'movie-this':
            movie(query);
            break;
        case 'do-what-it-says':
            fileAction();
            break;
        default:
            console.log('Sorry. LIRI can\'t do that.');
    }
}


