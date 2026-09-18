import { readFileSync, existsSync } from 'node:fs'
const required = ['dist/index.html','dist/assets']
for (const file of required) if (!existsSync(file)) throw new Error(`Missing build output: ${file}`)
const html = readFileSync('dist/index.html','utf8')
if (!html.includes('Contract Lifecycle Management')) throw new Error('Unexpected build output')
const source = readFileSync('src/main.tsx','utf8')
const buttons = [...source.matchAll(/<button\b([^>]*)>/g)].map(match => match[1])
const disconnected = buttons.filter(attributes => !attributes.includes('onClick=') && !attributes.includes('type="submit"'))
if (disconnected.length) throw new Error(`Disconnected buttons found: ${disconnected.join(', ')}`)
for (const requiredAction of ['Save changes','Discard','Make a change','Send to Procurement','Confirm and continue','View request details']) {
  if (!source.includes(requiredAction)) throw new Error(`Missing prototype action: ${requiredAction}`)
}
console.log(`Smoke test passed: production build is valid and ${buttons.length} buttons have actions.`)
