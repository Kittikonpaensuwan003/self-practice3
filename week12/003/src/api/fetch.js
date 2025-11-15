async function getData() {
  const res = await fetch(import.meta.env.VITE_APP_URL)
  const data = await res.json()
  return data
}


async function loadUser() {
  const data = await getData()
  const user = data.users[0]

  document.getElementById("userName").textContent = "Name: " + user.name
  document.getElementById("userEmail").textContent = "Email: " + user.email
}


async function loadPosts() {
  const data = await getData()
  const posts = data.posts

  const list = document.getElementById("postList")
  list.innerHTML = ""

  posts.forEach((p) => {
    const li = document.createElement("li")
    li.textContent = p.title
    list.appendChild(li)
  })
}


async function loadProducts() {
  const data = await getData()
  const products = data.products

  const box = document.getElementById("productBox")
  box.innerHTML = ""

  products.forEach((p) => {
    box.innerHTML += `Product: ${p.title}\nPrice: ${p.price} THB\n-----------------\n`
  })
}


document.getElementById("btnUser").addEventListener("click", loadUser)
document.getElementById("btnPosts").addEventListener("click", loadPosts)
document.getElementById("btnProducts").addEventListener("click", loadProducts)
