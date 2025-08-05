function calculatePrice() {
    document.getElementById("budget").addEventListener("submit", async function (e) {
  e.preventDefault();

  const salary = document.getElementById("salary").value;
  const days = document.getElementById("days").value;

  const response = await fetch("/api/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ salary, days })
  });

  const data = await response.json();
  document.getElementById("finalPrice").innerText = data.finalPrice;
});
  }