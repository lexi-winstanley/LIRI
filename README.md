# LIRI

## Description
This is a CLI App that allows users to query the following APIs from the command line: Bands in Town, Spotify and OMDB. The results of the users queries are displayed in the terminal and also written to a text file called log.txt. Users can find out where their favorite bands are playing (venue name, venue location, get search results for a song title, including preview links where available and get additional information about a movie.

## Organization
This application is organized into 4 main functions which run based on a switch case from the command input by the user, if the command matches one of LIRI's commands the appropriate function is called. If the user command does not match one of LIRI's commands a default error message and possible valid commands are displayed. Each time results are received from a query, they are displayed in the terminal and also appended to a log.txt file.

## Instructions
Notes: this application requires Node.js and several Node packages. These dependencies can be found in the package.json file and are necessary for LIRI to work as described.

From the terminal type the following: 
<br/>node liri.js command "query" 
<br/>Then press enter. LIRI will query the appropriate API and display the results in the terminal. LIRI will also print the commands/results to the log.txt file. 

If no arguments are passed to LIRI or an invalid command is used an error will appear: 


## Possible Commands/Results 
Command: concert-this "artist/band"
<br/>Results: venue name, venue location, event date

Command: spotify-this-song "song title"
<br/>Results: artist(s), track title, album, preview link

Command: movie-this "movie name"
<br/>Results: movie title, year released, IMDB rating, Rotten Tomatoes rating, production country, language, plot, actors

Command: do-what-it-says
<br/>Results: will run the command and query stored in the random.txt file and return data

## Video
https://drive.google.com/file/d/1DDmtOjiep5UZF1u2BXuoOvdSeKhkbfl9/view?usp=sharing

## Technologies Used
JavaScript
<br/>Node.js

<br/>Node Packages: 
<br/>axios, moment, node-spotify-api, fs, dotenv

## Role 
Sole developer with functionality requirements provided by UW Coding Bootcamp/Trilogy Education Services.
