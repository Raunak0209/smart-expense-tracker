let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const monthlyAmount = document.getElementById("monthlyAmount");
const topCategory = document.getElementById("topCategory");
const themeToggle = document.getElementById("themeToggle");

let pieChart, barChart;

// ADD EXPENSE
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const expense = {
    amount: Number(amount.value),
    category: category.value,
    date: date.value,
    description: description.value
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  form.reset();
  render();
});

// RENDER UI
function render() {
  list.innerHTML = "";
  let total = 0;
  let categoryMap = {};

  expenses.forEach((e, index) => {
    total += e.amount;
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;

    list.innerHTML += `
      <tr>
        <td>${e.date}</td>
        <td>${e.category}</td>
        <td>₹${e.amount}</td>
        <td><button onclick="removeExpense(${index})">❌</button></td>
      </tr>
    `;
  });

  totalAmount.textContent = `₹${total}`;

  const currentMonth = new Date().getMonth();
  const monthly = expenses
    .filter(e => new Date(e.date).getMonth() === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  monthlyAmount.textContent = `₹${monthly}`;

  const top = Object.keys(categoryMap).reduce((a, b) =>
    categoryMap[a] > categoryMap[b] ? a : b, "-"
  );
  topCategory.textContent = top;

  updateCharts(categoryMap);
}

// REMOVE
function removeExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

// CHARTS
function updateCharts(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: { labels, datasets: [{ data: values }] }
  });

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: { labels, datasets: [{ data: values }] }
  });
}

// DARK MODE
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

render();
