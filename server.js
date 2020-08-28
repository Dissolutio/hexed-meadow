const Server = require('boardgame.io/server').Server
const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const HexedMeadow = require('./src/game/game').HexedMeadow

const server = Server({ games: [HexedMeadow] })
const PORT = process.env.PORT || 8000
const frontEndAppBuildPath = path.resolve(__dirname, './build')

// Serve the build directory
const static_pages = new Koa()
static_pages.use(serve(frontEndAppBuildPath))
server.app.use(mount('/', static_pages))
server.run(PORT, () => {
  server.app.use(
    async (ctx, next) =>
      await serve(frontEndAppBuildPath)(
        Object.assign(ctx, { path: 'index.html' }),
        next
      )
  )
})
