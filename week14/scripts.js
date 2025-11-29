function pad(n) { return n.toString().padStart(2, "0"); }
function formatHMS(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

let _clockIntervalId = null
function updateRealTimeClock() {
  const el = document.getElementById("clock")
  if (!el) return
  const d = new Date()
  el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
function startRealTimeClock() {
  if (_clockIntervalId) return
  updateRealTimeClock()
  _clockIntervalId = setInterval(updateRealTimeClock, 1000)
}
function stopRealTimeClock() {
  if (!_clockIntervalId) return
  clearInterval(_clockIntervalId)
  _clockIntervalId = null
}

let _countUpIntervalId = null
let _countUpElapsed = 0

function tickCountUp() {
  const display = document.getElementById("timer")
  if (!display) return
  _countUpElapsed += 1
  display.textContent = formatHMS(_countUpElapsed)
}
function startCountUpTimer() {
  if (_countUpIntervalId) return
  _countUpIntervalId = setInterval(tickCountUp, 1000)
}
function stopCountUpTimer() {
  if (!_countUpIntervalId) return
  clearInterval(_countUpIntervalId)
  _countUpIntervalId = null
}
function resetCountUpTimer() {
  stopCountUpTimer()
  _countUpElapsed = 0
  const display = document.getElementById("timer")
  if (display) display.textContent = formatHMS(0)
}

let _bgIntervalId = null
function randomHexColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")
}
function tickBackgroundChange() {
  const label = document.getElementById("bg-current")
  const color = randomHexColor()
  document.body.style.backgroundColor = color
  if (label) label.textContent = "สีปัจจุบัน: " + color
}
function startBackgroundChange() {
  if (_bgIntervalId) return
  tickBackgroundChange()
  _bgIntervalId = setInterval(tickBackgroundChange, 1000)
}
function stopBackgroundChange() {
  if (!_bgIntervalId) return
  clearInterval(_bgIntervalId)
  _bgIntervalId = null
}

let _countdownIntervalId = null
let _countdownRemaining = 0
function tickCountdown() {
  const display = document.getElementById("countdown-display")
  if (!display) return
  _countdownRemaining -= 1
  if (_countdownRemaining <= 0) {
    clearInterval(_countdownIntervalId)
    _countdownIntervalId = null
    display.textContent = "Time's up!"
  } else {
    display.textContent = `${_countdownRemaining} วินาที (${formatHMS(_countdownRemaining)})`
  }
}
function startCountdown(seconds) {
  const display = document.getElementById("countdown-display")
  if (!display) return
  if (!Number.isInteger(seconds) || seconds <= 0) {
    alert("กรุณากรอกวินาทีที่เป็นจำนวนเต็มบวก")
    return
  }
  if (_countdownIntervalId) {
    clearInterval(_countdownIntervalId)
    _countdownIntervalId = null
  }
  _countdownRemaining = seconds
  display.textContent = `${_countdownRemaining} วินาที (${formatHMS(_countdownRemaining)})`
  _countdownIntervalId = setInterval(tickCountdown, 1000)
}
function stopCountdown() {
  if (!_countdownIntervalId) return
  clearInterval(_countdownIntervalId)
  _countdownIntervalId = null
}

function createCheckInText() {
  const d = new Date();
  const date = d.toLocaleDateString("th-TH")
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  return `${date} ${time} — Checked in`
}
function addCheckIn() {
  const list = document.getElementById("checkin-list")
  if (!list) return
  const li = document.createElement("li")
  li.textContent = createCheckInText()
  list.appendChild(li)
}

function initRealTimeClockControls() {
  startRealTimeClock()
}
function initCountUpControls() {
  const startBtn = document.getElementById("timer-start")
  const stopBtn = document.getElementById("timer-stop")
  if (startBtn) startBtn.addEventListener("click", startCountUpTimer)
  if (stopBtn) stopBtn.addEventListener("click", stopCountUpTimer)
}
function initBackgroundControls() {
  const startBtn = document.getElementById("bg-start")
  const stopBtn = document.getElementById("bg-stop")
  if (startBtn) startBtn.addEventListener("click", startBackgroundChange)
  if (stopBtn) stopBtn.addEventListener("click", stopBackgroundChange)
}
function initCountdownControls() {
  const startBtn = document.getElementById("countdown-start")
  const input = document.getElementById("countdown-input")
  if (startBtn && input) {
    startBtn.addEventListener("click", () => {
      const sec = parseInt(input.value, 10)
      startCountdown(sec)
    })
  }
}
function initCheckInControls() {
  const btn = document.getElementById("checkin-btn")
  if (btn) btn.addEventListener("click", addCheckIn)
}

function initAll() {
  initRealTimeClockControls()
  initCountUpControls()
  initBackgroundControls()
  initCountdownControls()
  initCheckInControls()
}

document.addEventListener("DOMContentLoaded", initAll)

window._app = {
  startRealTimeClock,
  stopRealTimeClock,
  startCountUpTimer,
  stopCountUpTimer,
  resetCountUpTimer,
  startBackgroundChange,
  stopBackgroundChange,
  startCountdown,
  stopCountdown,
  addCheckIn
}
