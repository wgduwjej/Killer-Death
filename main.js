const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/function')
const { color } = require('./lib/color')

require('./index.js')
nocache('./index.js', module => console.log(`${module} Telah Di Update✓`))

const starts = async (pebz = new WAConnection()) => {
    pebz.logger.level = 'warn'
    pebz.version = [2, 2143, 8]
    pebz.browserDescription = [ 'pebzgonz', 'Chrome', '3.0' ]
    console.log(banner.string)
    pebz.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./session.json') && pebz.loadAuthInfo('./session.json')
    pebz.on('connecting', () => {
        start('2', 'Connecting...')
    })
    pebz.on('open', () => {
        success('2', 'Connected')
    })
    await pebz.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(pebz.base64EncodedAuthInfo(), null, '\t'))

    pebz.on('chat-update', async (message) => {
        require('./index.js')(pebz, message)
    })
}


/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('[ ! ]', `'${module}'`, 'DI Pantau Oleh LordPebri')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })

}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
