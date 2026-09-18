import { readFileSync, existsSync } from 'node:fs'
const required = ['dist/index.html','dist/assets']
for (const file of required) if (!existsSync(file)) throw new Error(`Missing build output: ${file}`)
const html = readFileSync('dist/index.html','utf8')
if (!html.includes('Contract Lifecycle Management')) throw new Error('Unexpected build output')
console.log('Smoke test passed: production build is present and valid.')
