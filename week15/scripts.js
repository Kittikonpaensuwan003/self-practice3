function pad(n, len = 2) { return String(n).padStart(len, '0') }
function formatDateTimeYMDHMS(d) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}
function formatStopwatch(ms) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milli = ms % 1000
  return `${pad(minutes)}:${pad(seconds)}.${pad(milli, 3)}`
}

let _tzInterval = null
function updateTzClock() {
  const sel = document.getElementById('tzSelect')
  const out = document.getElementById('tzClock')
  if(!sel || !out) return
  const tz = sel.value || 'UTC'
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).formatToParts(now)
  const map = {}
  for (const p of parts) map[p.type] = p.value
  const y = map.year, mo = map.month, d = map.day, hh = map.hour, mm = map.minute, ss = map.second
  out.textContent = `${y}-${mo}-${d} ${hh}:${mm}:${ss} (${tz})`
}
function startTzClock() {
  if (_tzInterval) return
  updateTzClock()
  _tzInterval = setInterval(updateTzClock, 1000)
}
function stopTzClock() {
  if (!_tzInterval) return
  clearInterval(_tzInterval)
  _tzInterval = null
}

let _swStartTime = 0
let _swElapsedBefore = 0
let _swInterval = null
let _swRunning = false
function swRender(ms) {
  const el = document.getElementById('stopwatch')
  if (el) el.textContent = formatStopwatch(ms)
}
function swTick() {
  const now = performance.now()
  const elapsed = _swElapsedBefore + (now - _swStartTime)
  swRender(Math.floor(elapsed))
}
function swStart() {
  if (_swRunning) return
  _swRunning = true
  _swStartTime = performance.now()
  _swInterval = setInterval(swTick, 25)
}
function swStop() {
  if (!_swRunning) return
  const now = performance.now()
  _swElapsedBefore += (now - _swStartTime)
  _swRunning = false
  if (_swInterval) { clearInterval(_swInterval); _swInterval = null }
  swRender(Math.floor(_swElapsedBefore))
}
function swReset() {
  swStop()
  _swElapsedBefore = 0
  _swStartTime = 0
  const laps = document.getElementById('laps')
  if (laps) laps.innerHTML = ''
  swRender(0)
}
function swLap() {
  const laps = document.getElementById('laps')
  if (!laps) return
  const now = performance.now()
  const elapsed = _swElapsedBefore + (_swRunning ? (now - _swStartTime) : 0)
  const li = document.createElement('li')
  const lapNumber = laps.children.length + 1
  li.textContent = `Lap ${lapNumber} — ${formatStopwatch(Math.floor(elapsed))}`
  laps.appendChild(li)
}

const THEMES = ['light','dark','accent']
const THEME_KEY = 'app_theme_v1'
function applyTheme(name) {
  document.body.classList.remove(...THEMES.map(t => 'theme-' + t))
  if (name && name !== 'light') document.body.classList.add('theme-' + name)
  const cur = document.getElementById('themeCurrent')
  if (cur) cur.textContent = name || 'light'
  try { localStorage.setItem(THEME_KEY, name); } catch(e) {}
}
function loadThemeFromStorage() {
  try {
    const t = localStorage.getItem(THEME_KEY) || 'light'
    applyTheme(t)
  } catch(e) { applyTheme('light') }
}
function toggleTheme() {
  const cur = (localStorage.getItem(THEME_KEY) || 'light')
  const idx = THEMES.indexOf(cur)
  const next = THEMES[(idx + 1) % THEMES.length]
  applyTheme(next)
}

let _postsCache = null 
async function loadPosts() {
  const status = document.getElementById('postsStatus')
  const list = document.getElementById('postList')
  if (!list) return
  list.innerHTML = ''
  if (status) status.textContent = 'Loading...'
  try {
    if (!_postsCache) {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      _postsCache = data
    }
    const first10 = (_postsCache || []).slice(0, 10)
    for (const p of first10) {
      const li = document.createElement('li')
      li.style.marginBottom = '8px'
      const title = document.createElement('div')
      title.textContent = p.title
      title.style.fontWeight = '600'
      const btn = document.createElement('button')
      btn.textContent = 'Details'
      btn.style.marginLeft = '8px'
      const details = document.createElement('div')
      details.className = 'mono'
      details.style.marginTop = '6px'
      details.style.display = 'none'
      details.textContent = p.body
      btn.addEventListener('click', () => {
        if (details.style.display === 'none') {
          details.style.display = 'block'
          btn.textContent = 'Hide'
        } else {
          details.style.display = 'none'
          btn.textContent = 'Details'
        }
      })
      li.appendChild(title)
      li.appendChild(btn)
      li.appendChild(details)
      list.appendChild(li)
    }
    if (status) status.textContent = ''
  } catch (err) {
    console.error('loadPosts', err)
    if (status) status.textContent = 'Load failed'
    list.innerHTML = '<li>โหลดโพสต์ไม่สำเร็จ</li>'
  }
}

function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `checkins:${y}-${m}-${day}`
}
function loadTodayListToUI() {
  const key = todayKey()
  const raw = localStorage.getItem(key)
  const arr = raw ? JSON.parse(raw) : []
  const ul = document.getElementById('todayList')
  const cnt = document.getElementById('todayCount')
  if (ul) {
    ul.innerHTML = ''
    for (const it of arr) {
      const li = document.createElement('li')
      li.textContent = `${it.name} — ${it.timestamp}`
      ul.appendChild(li)
    }
  }
  if (cnt) cnt.textContent = String(arr.length)
}
function saveCheckin(name) {
  if (!name || !name.trim()) return { ok:false, msg:'กรุณากรอกชื่อ' }
  const key = todayKey()
  const raw = localStorage.getItem(key)
  const arr = raw ? JSON.parse(raw) : []
  const normalized = name.trim()
  if (arr.some(x => x.name === normalized)) {
    return { ok:false, msg:'คุณเช็คอินแล้วในวันนี้ (ชื่อซ้ำ)' }
  }
  const ts = new Date()
  const entry = { name: normalized, timestamp: formatDateTimeYMDHMS(ts) }
  arr.push(entry)
  localStorage.setItem(key, JSON.stringify(arr))
  loadTodayListToUI()
  return { ok:true, entry }
}

document.addEventListener('DOMContentLoaded', () => {
  const tzSel = document.getElementById('tzSelect')
  if (tzSel) tzSel.addEventListener('change', () => { updateTzClock() })
  startTzClock();

  const swStartBtn = document.getElementById('swStart')
  const swStopBtn = document.getElementById('swStop')
  const swLapBtn = document.getElementById('swLap')
  const swResetBtn = document.getElementById('swReset')
  if (swStartBtn) swStartBtn.addEventListener('click', swStart)
  if (swStopBtn) swStopBtn.addEventListener('click', swStop)
  if (swLapBtn) swLapBtn.addEventListener('click', swLap)
  if (swResetBtn) swResetBtn.addEventListener('click', swReset)
  swRender(0)

  const themeBtn = document.getElementById('themeToggle')
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme)
  loadThemeFromStorage();

  const loadPostsBtn = document.getElementById('loadPosts')
  if (loadPostsBtn) loadPostsBtn.addEventListener('click', loadPosts)

  const checkinBtn = document.getElementById('btnCheckinNow')
  if (checkinBtn) checkinBtn.addEventListener('click', () => {
    const input = document.getElementById('checkinName')
    const name = input ? input.value : ''
    const res = saveCheckin(name)
    if (!res.ok) {
      alert(res.msg)
    } else {
      if (input) input.value = ''
    }
  })
  loadTodayListToUI()
})
