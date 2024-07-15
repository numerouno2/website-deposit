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
            <span class="date">Start: ${new Date(
              deposit.startDate
            ).toLocaleDateString("id-ID")} - Done: ${new Date(
      deposit.endDate
    ).toLocaleDateString("id-ID")}</span>
            <button onclick="removeDeposit(${index})">Remove</button>
        `;
    historyList.appendChild(listItem);
  });

  const dateOption = document.getElementById("dateOption");
  const manualDate = document.getElementById("manualDate");
  const manualDateLabel = document.getElementById("manualDateLabel");

  dateOption.addEventListener("change", function () {
    if (dateOption.value === "manual") {
      manualDate.style.display = "block";
      manualDateLabel.style.display = "block";
    } else {
      manualDate.style.display = "none";
      manualDateLabel.style.display = "none";
    }
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
    const dateOption = document.getElementById("dateOption").value;
    let date;

    if (dateOption === "manual") {
      date = new Date(document.getElementById("manualDate").value);
      // Adjust for time zone differences
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    } else {
      date = new Date();
    }

    if (amount < 2000) {
      messageDiv.textContent = "The minimum deposit amount is 2000 rupiah!";
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
      messageDiv.textContent = "Thank you for your big deposit!";
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
