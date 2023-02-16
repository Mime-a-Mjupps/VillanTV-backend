// Description: Server for the Spotify Now Playing API
import { SpotifyService } from 'spotify-now-playing'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { } from 'dotenv/config';
// Create a new express app instance
const app = express();
// Set the view engine to ejs
app.set('view engine', 'ejs');
const server = http.createServer(app);
// Create a Socket.IO instance, passing it our server
const io = new Server(server);
// Spotify stuff, API keys are in .env
let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;
let REFRESH_TOKEN_ACC_1 = process.env.REFRESH_TOKEN_ACC_1;
let REFRESH_TOKEN_ACC_2 = process.env.REFRESH_TOKEN_ACC_2;
// Create a new SpotifyService instance
const spotifyDance = new SpotifyService(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN_ACC_1)
const spotifyBar = new SpotifyService(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN_ACC_2)
async function getCurPlayingWithService(spotifyService) {
    let song = await spotifyBar.getCurrentSong()
    // If no song is playing return notplaying
    if (song == undefined || !song.isPlaying) {
        return { status: 'notplaying', data: null }
    }
    // Else we are playing, wohoo!
    return { status: 'playing', data: { title: song.title, by: Object.values(song.artists)[0].join(', '), img: song.album.image } }
}
// Fetches the current playing song from spotify and sends it to all clients
async function fetchAndSendSpotifyUpdates() {
    //Fetch spotify data.
    let bar = await getCurPlayingWithService(spotifyBar);
    let dance = await getCurPlayingWithService(spotifyDance);
    //Send these out to ALL clients.
    io.emit("spotifyUpdate", { bar: bar, dance: dance })
}
// Routes and stuff for the food ordering system
let curNums = [];
app.get('/', async (req, res) => {
    return res.render("index", { curNums: curNums });
})
// API routes
// Food ordering system
// Add a number to the queue
app.get('/addNum', (req, res) => {
    // If the number is already in the queue, don't add it again
    if (curNums.includes(req.query.num)) {
        res.redirect("/"); // Don't continue
    // If the query is empty, don't add it
    } else if (req.query.num == "") {
        res.redirect("/"); // Don't continue
    }
    // Add the number to the queue
    curNums.push(req.query.num);
    io.emit("orderUpdate", { curNums: curNums });
    res.redirect("/");
});
// Remove a number from the queue
app.get('/rmNum', (req, res) => {
    curNums = curNums.filter(n => n != req.query.num);
    io.emit("orderUpdate", { curNums: curNums });
    res.redirect("/");
});
// Socket.io stuff
let clients = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    clients.push(socket.id)
    console.log(clients)
    socket.on("disconnect", (reason) => {
        console.log('a user disconnected')
        clients = clients.filter(id => id !== socket.id)
        console.log(clients)
    });
});
//Auto spotify updates
function spotRunner() {
    //If we have a connected client, update..
    if (clients.length < 1) {
        console.log("Not sending update, no clients connected!")
        return;
    }
    console.log("Sending update, we have connected clients!")
    fetchAndSendSpotifyUpdates();
}
setInterval(spotRunner, 10000); //time is in ms
//Server stuff
server.listen(3000, () => {
    console.log('listening on *:3000');
});