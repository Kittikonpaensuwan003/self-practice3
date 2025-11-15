function inputMonitor() {
  function setup() {
    const titleInput = document.getElementById("titleInput")
    const passwordInput = document.getElementById("passwordInput")

    titleInput.addEventListener("input", updateTitlePreview)
    passwordInput.addEventListener("input", evaluateStrength)
  }

  
  function updateTitlePreview() {
    const input = document.getElementById("titleInput")
    const preview = document.getElementById("titlePreview")

    const text = input.value.trim()
    preview.textContent = text === "" ? "No title provided" : text
  }


  function evaluateStrength() {
    const pwd = document.getElementById("passwordInput").value
    const meter = document.getElementById("passwordMeter")
    const label = document.getElementById("strengthLabel")

    let strength = 0

    if (pwd.length >= 6) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    switch (strength) {
      case 0:
        meter.style.width = "0%"
        label.textContent = "Strength: -"
        meter.style.backgroundColor = ""
        break
      case 1:
        meter.style.width = "25%"
        meter.style.backgroundColor = "red"
        label.textContent = "Strength: Weak"
        break
      case 2:
        meter.style.width = "50%"
        meter.style.backgroundColor = "orange"
        label.textContent = "Strength: Fair"
        break
      case 3:
        meter.style.width = "75%"
        meter.style.backgroundColor = "dodgerblue"
        label.textContent = "Strength: Good"
        break
      case 4:
        meter.style.width = "100%"
        meter.style.backgroundColor = "green"
        label.textContent = "Strength: Strong"
        break
    }
  }

  return { setup, updateTitlePreview, evaluateStrength };
}


const { setup } = inputMonitor()
setup();
