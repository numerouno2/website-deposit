const deposits = JSON.parse(localStorage.getItem("deposits")) || [];

document.addEventListener("DOMContentLoaded", function () {
  const historyList = document.getElementById("history");
  deposits.forEach((deposit, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <span class="name">${deposit.name}</span>
            <span class="amount">${deposit.amount.toLocaleString(
              "id-ID"
            )} Rupiah</span>
            <span class="date">Mulai: ${new Date(
              deposit.startDate
            ).toLocaleDateString("id-ID")} - Selesai: ${new Date(
      deposit.endDate
    ).toLocaleDateString("id-ID")}</span>
            <button onclick="removeDeposit(${index})">Remove</button>
        `;
    historyList.appendChild(listItem);
  });
});

document
  .getElementById("depositForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const amount = parseInt(document.getElementById("amount").value);
    const messageDiv = document.getElementById("message");
    const historyList = document.getElementById("history");
    const date = new Date();

    if (amount < 2000) {
      messageDiv.textContent = "Jumlah deposit minimal adalah 2000 rupiah!";
      return;
    }

    const daysCovered = Math.floor(amount / 2000);
    let workDaysCount = 0;
    let currentDate = new Date(date);

    while (workDaysCount < daysCovered) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Bukan hari Sabtu atau Minggu
        workDaysCount++;
      }
    }

    const endDate = new Date(currentDate);

    const listItem = document.createElement("li");
    const index = deposits.length;
    listItem.innerHTML = `
        <span class="name">${name}</span>
        <span class="amount">${amount.toLocaleString("id-ID")} Rupiah</span>
        <span class="date">Mulai: ${date.toLocaleDateString(
          "id-ID"
        )} - Selesai: ${endDate.toLocaleDateString("id-ID")}</span>
        <button onclick="removeDeposit(${index})">Remove</button>
    `;
    historyList.appendChild(listItem);

    if (amount >= 100000) {
      messageDiv.textContent = "Terima kasih atas deposit besar Anda!";
    } else {
      messageDiv.textContent = "";
    }

    const deposit = {
      name: name,
      amount: amount,
      startDate: date,
      endDate: endDate,
    };

    deposits.push(deposit);
    localStorage.setItem("deposits", JSON.stringify(deposits));

    document.getElementById("depositForm").reset();
  });

function removeDeposit(index) {
  deposits.splice(index, 1);
  localStorage.setItem("deposits", JSON.stringify(deposits));
  location.reload();
}
