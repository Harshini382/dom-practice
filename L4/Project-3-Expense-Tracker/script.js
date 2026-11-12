
const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");

let transactions = JSON.parse(
  localStorage.getItem("transactions")
) || [];

const currency = amount => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
}).format(amount);

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("income").textContent = currency(income);
  document.getElementById("expense").textContent = currency(expense);
  document.getElementById("balance").textContent =
    currency(income - expense);
}

function renderTransactions() {
  const filter = document.getElementById("filter").value;

  const filtered = transactions
    .filter(t => filter === "all" || t.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty">No transactions found.</p>';
  }

  filtered.forEach(t => {
    const item = document.createElement("div");
    item.className = "transaction";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = t.title;

    const date = document.createElement("p");
    date.textContent = t.date;

    details.append(title, date);

    const amount = document.createElement("strong");
    amount.className = t.type === "income" ? "plus" : "minus";
    amount.textContent =
      `${t.type === "income" ? "+" : "-"}${currency(t.amount)}`;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";

    remove.addEventListener("click", () => deleteTransaction(t.id));

    item.append(details, amount, remove);
    list.appendChild(item);
  });

  updateSummary();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  if (!title || !date || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter valid transaction details.");
    return;
  }

  transactions.push({
    id: Date.now() + Math.random(),
    title,
    amount,
    type,
    date
  });

  saveData();
  form.reset();
  renderTransactions();
});

function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;

  transactions = transactions.filter(t => t.id !== id);
  saveData();
  renderTransactions();
}

document.getElementById("filter")
  .addEventListener("change", renderTransactions);

renderTransactions();
