const form = document.querySelector("#reminder-form");
const emptyState = document.querySelector("#empty-state");
const reservationCard = document.querySelector("#reservation-card");
const resultSubject = document.querySelector("#result-subject");
const resultDatetime = document.querySelector("#result-datetime");
const resultMethod = document.querySelector("#result-method");
const resultMemo = document.querySelector("#result-memo");

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const subject = formData.get("subject").trim();
  const date = formData.get("date");
  const time = formData.get("time");
  const method = formData.get("method");
  const memo = formData.get("memo").trim();

  resultSubject.textContent = subject;
  resultDatetime.textContent = `${formatDate(date)} ${time}`;
  resultMethod.textContent = method;
  resultMemo.textContent = memo || "メモはありません。";

  emptyState.hidden = true;
  reservationCard.hidden = false;
});

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return dateFormatter.format(date);
}
