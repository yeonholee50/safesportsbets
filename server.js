const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes/api.js');
const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;
const Games = require('./models/games');
const Sports = require('./models/sport');
const cron = require('node-cron');
const moment = require('moment');
const http = require('http');
const socketIo = require('socket.io');

// Define the port for Render or local use
const PORT = process.env.PORT || 10000;

// Initialize the Express application
const app = express();

// Set up Express session
const expressSession = require('express-session')({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
});

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport for authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Import services
require('./services/gameService2');
require('./services/resultService2');

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://yeonholee50:yeonholee50@cluster0.j2eo96c.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
).then(() => {
  console.log('Connected to MongoDB');

  // Set up routes
  app.use(routes);

  // Serve static assets (usually for production)
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client/build/index.html"));
    });
  }

  // Initialize the server
  const server = http.createServer(app);

  // Set up Socket.IO
  const io = socketIo(server, {
    cors: {
      origin: "*", // Adjust this as per your requirements
      methods: ['GET', 'POST'],
      allowedHeaders: ['x-access-token', 'Origin', 'Content-Type', 'application/json'],
      credentials: true
    }
  });

  // Fetch data for Socket.IO
  const fetchData = async (socket, user_id) => {
    console.log('Fetching data...');
    let sportsPackage = '';
    let leagues = {};
    let sendUser = {};
    let liveGames = {};
    let gamesPackage = { leagues };

    // Fetch active sports in season
    const fetchActiveSports = async () => {
      console.log('Fetching active sports...');
      sportsPackage = '';
      await Sports.find({ active: true }).then(async sports => {
        let sportsObj = sports.map((sport) => ({
          name: sport.sportTitle,
          leagues: sport.leagues
        }));
        sportsPackage = sportsObj;
        console.log('Active sports fetched:', sportsPackage);
      });
    };

    // Fetch upcoming games based on active sports
    const fetchUpcomingGames = async () => {
      console.log('Fetching upcoming games...');
      leagues = {};
      gamesPackage = { leagues };
      const promises = sportsPackage.map(async (sport, index) => {
        const promises2 = await Object.keys(sport.leagues).map(async league => {
          await Games.find({
            "league": league,
            "startDate": { $gte: moment() },
            "game.keys.gameTotalOver.currVal": { $ne: null },
            "game.keys.gameTotalUnder.currVal": { $ne: null }
          }).then((games) => {
            if (games.length > 0) {
              // Sort games by ascending start date
              games.sort((a, b) => a.startDate - b.startDate);
              sportsPackage[index].leagues[`${league}`].games.active = true;
              gamesPackage.leagues[`${league}`] = games;
            } else {
              sportsPackage[index].leagues[`${league}`].games.active = false;
            }
            console.log(`Upcoming games for league ${league}:`, games);
          });
        });
        await Promise.all(promises2);
      });
      await Promise.all(promises);
      console.log('Upcoming games fetched:', gamesPackage);
    };

    // Fetch live and upcoming games
    const fetchLiveGames = async () => {
      console.log('Fetching live games...');
      liveGames = {};
      await Games.find({ $or: [{ "status": 'Live' }, { 'status': 'Upcoming' }] }).then((games) => {
        games.forEach((game) => {
          liveGames[`${game.gameUID}`] = game;
        });
        console.log('Live games fetched:', liveGames);
      });
    };

    // Fetch user information
    const fetchUser = async (user_id) => {
      console.log(`Fetching user data for user_id ${user_id}...`);
      sendUser = {};
      await User.findOne({ 'user_id': user_id }).then((user) => {
        sendUser = user;
        console.log('User data fetched:', sendUser);
      });
    };

    await fetchActiveSports();
    await fetchUpcomingGames();
    await fetchLiveGames();
    const returnData = { navData: sportsPackage, gameData: gamesPackage, liveGames: liveGames };

    // Schedule task to emit site data to users every minute using sockets
    const scheduleTask = cron.schedule('* * * * *', async () => {
      console.log('Scheduled task running...');
      await fetchActiveSports();
      await fetchUpcomingGames();
      await fetchLiveGames();
      await fetchUser(user_id);
      socket.emit('package', { navData: sportsPackage, gameData: gamesPackage, liveGames: liveGames, userData: sendUser });
      console.log('Data emitted to user:', { navData: sportsPackage, gameData: gamesPackage, liveGames: liveGames, userData: sendUser });
    });

    return returnData;
  };

  let loggedOnUsers = [];
  let sendData;

  // Handle user connection and data fetching for betting component
  io.on('connection', async (socket) => {
    console.log('New connection:', { socket: socket.id, userId: socket.handshake.headers['x-current-user'] });
   
