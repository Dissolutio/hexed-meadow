const Server = require('boardgame.io/server').Server
const HexedMeadow = require('./game/game').HexedMeadow

const server = Server({
    games: [HexedMeadow],
})

const port = process.env.PORT || 8000

server.run(port, () => console.log('server running on %c', port))
