// Je kunt deze code gebruiken om tijdelijke iconen te genereren
// of je eigen iconen toevoegen in de public/icons map
const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 512
const ctx = canvas.getContext('2d')
if (ctx) {
  ctx.fillStyle = '#ff9328' // Keep hex for Canvas API compatibility
  ctx.fillRect(0, 0, 512, 512)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 200px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('DKL', 256, 256)
  
  // Download als PNG
  const link = document.createElement('a')
  link.download = 'icon-512.png'
  link.href = canvas.toDataURL()
  link.click()
} 