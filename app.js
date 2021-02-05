require('dotenv').config();


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require ('spotify-web-api-node')

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

// Route -> Application Entry Point

app.get ("/", (req,res) => {
    res.render("index")
});
app.get ("/artist-search", (req, res) => {
    let artistName = req.query.artistName // -> query because its a form with a GET method

    spotifyApi
  .searchArtists(artistName)
  .then(data => {  // Promise resolved 
    console.log('The received data from the API: ', data.body.artists.items);
    let artistList = data.body.artists.items 
    res.render("artist-search-result", {
        artists:artistList
    });    
    })

  .catch(err => console.log('The error while searching artists occurred: ', err));
    
});

// Route when searching for albums
app.get('/albums/:artistID', (req, res) => {
    let artistID = req.params.artistID;
    spotifyApi.getArtistAlbums(artistID)
    .then((data) => // only after I get the results
        res.render('albums', { albumsList: data.body.items })   
    });
});

app.get('tracks/:trackID', (req, res) =>
    let trackId = req.params.trackId;
    spotifyApi.getAlbumTracks(trackId)
        .then ((data) => 
            res.render('tracks', { trackList: data})
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
