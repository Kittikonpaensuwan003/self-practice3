const API = "http://localhost:3000/products";


async function loadProducts() {
  const res = await fetch(API);
  const data = await res.json();

  const box = document.getElementById("productBox");
  box.innerHTML = "";

  data.forEach(p => {
    box.innerHTML += `ID: ${p.id}\nTitle: ${p.title}\nPrice: ${p.price}\n-------------\n`;
  });
}


async function addProduct() {
  const title = document.getElementById("newTitle").value
  const price = document.getElementById("newPrice").value

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price: Number(price) })
  })

  loadProducts()
}


async function updateProduct() {
  const id = document.getElementById("editId").value
  const title = document.getElementById("editTitle").value
  const price = document.getElementById("editPrice").value

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price: Number(price) })
  })

  loadProducts()
}


async function deleteProduct() {
  const id = document.getElementById("deleteId").value;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  })

  loadProducts()
}


document.getElementById("btnGet").addEventListener("click", loadProducts)
document.getElementById("btnPost").addEventListener("click", addProduct)
document.getElementById("btnPut").addEventListener("click", updateProduct)
document.getElementById("btnDelete").addEventListener("click", deleteProduct)
