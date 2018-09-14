import { name } from '../../../package.json'

function log (msg, logFunc = console.info) {
  logFunc('[', name, ']', msg)
}

log.error = (msg) => { return log(msg, console.error) }

export default log
