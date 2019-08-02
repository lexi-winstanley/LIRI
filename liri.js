require('dotenv').config();

const keys = require('./keys.js');
const axios = require('axios');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const fs = require('fs');


let allArgs = process.argv;
let action;
let query;

if (allArgs.length > 3) {
    action = process.argv[2];
    console.log(action);
    query = process.argv[3];
    console.log(query);
} else if (allArgs.length === 3) {
    action = process.argv[2];
    console.log(action);
    query = null;
    console.log(query);
} else {
    console.log('Please enter an action for LIRI bot to take: \nconcert-this \'ARTIST/BAND\' \nspotify-this-song \'SONG NAME\' \nmovie-this \'MOVIE NAME\' \ndo-what-it-says');
}


function concert(query) {
    if (query === null) {
        console.log('An artist or band name is required to run this command');
        return;
    }
    let concertUrl = `https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`;
    console.log(concertUrl);
    axios.get(concertUrl)
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let city = response.data[i].venue.city;
                let region = response.data[i].venue.region;
                let country = response.data[i].venue.country;
                let location = city + ', ' + country;
                if (region !== '') {
                    location = city + ', ' + region + ', ' + country;
                }
                console.log(`---------------`);
                console.log(`Venue Name: ${response.data[i].venue.name}`);
                console.log(`Location: ${location}`);
                console.log(`Date: ${response.data[i].datetime}`);
                console.log(`---------------`);
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
    let defaultSongDetails = response.tracks.items.filter(t => t.artists[0].name === 'Ace of Base');
    console.log(`---------------`);
    console.log(`Artist(s): ${defaultSongDetails[0].artists[0].name}`);
    console.log(`Track Title: ${defaultSongDetails[0].name}`);
    console.log(`Album: ${defaultSongDetails[0].album.name}`);
    let previewLink = defaultSongDetails[0].preview_url;
    if (previewLink === null) {
        console.log(`There is no preview for this song.`);
    } else {
        console.log(`Preview Link: ${previewLink}`);
    }
    console.log(`---------------`);
}

function handleSpotifyResponse(response) {
    for (let i = 0; i < response.tracks.items.length; i++) {
        console.log(`---------------`);
        let artistArray = [];
        for (let j = 0; j < response.tracks.items[i].artists.length; j++) {
            let artist = response.tracks.items[i].artists[j].name;
            artistArray.push(artist);
        }
        let artistList = artistArray.join(', ');
        console.log(`Artist: ${artistList}`);
        console.log(`Track Title: ${response.tracks.items[i].name}`);
        console.log(`Album: ${response.tracks.items[i].album.name}`);
        let previewLink = response.tracks.items[i].preview_url;
        if (previewLink === null) {
            console.log(`There is no preview for this song.`);
        } else {
            console.log(`Preview Link: ${previewLink}`);
        }
        console.log(`---------------`);
    }
}

async function movie(query) {
    if (query === null) {
        query = 'Mr. Nobody';
    }
    let movieUrl = `http://www.omdbapi.com/?t=${query}&y=&plot=short&apikey=trilogy`;
    console.log(movieUrl);
    await axios.get(movieUrl)
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let IMDB = response.data[i].Ratings.filter('Internet Movie Database');
                let rottenTomatoes = response.data[i].Ratings.filter('Rotten Tomatoes');
                console.log(`---------------`);
                console.log(`Title: ${response.data[i].Title}`);
                console.log(`Year Released: ${response.data[i].Year}`);
                console.log(`IMDB Rating: ${IMDB[i].Value}`);
                console.log(`Rotten Tomatoes Rating: ${rottenTomatoes[i].Value}`);
                console.log(`Production Country: ${response.data[i].Country}`);
                console.log(`Language: ${response.data[i].Language}`);
                console.log(`Plot: ${response.data[i].Plot}`);
                console.log(`Actors: ${response.data[i].Actors}`);
                console.log(`---------------`);
            }
        }).catch(function(err) {
            console.log(err);
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
        console.log(query);
        runLIRI(action, query);
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

runLIRI(action, query);
