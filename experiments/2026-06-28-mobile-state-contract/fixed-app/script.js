const form = document.querySelector("#reminder-form");
const subjectInput = document.querySelector("#subject");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const methodInput = document.querySelector("#method");
const memoInput = document.querySelector("#memo");
const editButton = document.querySelector("#edit-button");

const emptyState = document.querySelector("#empty-state");
const errorStatus = document.querySelector("#error-status");
const successStatus = document.querySelector("#success-status");
const resultPanel = document.querySelector("#result-panel");

const resultSubject = document.querySelector("#result-subject");
const resultDate = document.querySelector("#result-date");
const resultTime = document.querySelector("#result-time");
const resultMethod = document.querySelector("#result-method");
const resultMemo = document.querySelector("#result-memo");

const requiredFields = [
  {
    input: subjectInput,
    error: document.querySelector("#subject-error"),
    message: "件名を入力してください。",
  },
  {
    input: dateInput,
    error: document.querySelector("#date-error"),
    message: "日付を選んでください。",
  },
  {
    input: timeInput,
    error: document.querySelector("#time-error"),
    message: "時間を選んでください。",
  },
];

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const errors = validateRequiredFields();
  if (errors.length > 0) {
    showErrorState(errors);
    return;
  }

  showSuccessState({
    subject: subjectInput.value.trim(),
    date: dateInput.value,
    time: timeInput.value,
    method: methodInput.value,
    memo: memoInput.value.trim(),
  });
});

for (const field of requiredFields) {
  field.input.addEventListener("input", () => {
    if (field.input.getAttribute("aria-invalid") === "true") {
      validateRequiredFields();
      updateErrorSummary();
    }
  });
}

editButton.addEventListener("click", () => {
  subjectInput.focus();
});

function validateRequiredFields() {
  const errors = [];

  for (const field of requiredFields) {
    const value = field.input.value.trim();
    const hasError = value === "";

    field.input.setAttribute("aria-invalid", String(hasError));
    field.error.hidden = !hasError;
    field.error.textContent = hasError ? field.message : "";

    if (hasError) {
      errors.push(field);
    }
  }

  return errors;
}

function showErrorState(errors) {
  emptyState.hidden = false;
  resultPanel.hidden = true;
  successStatus.textContent = "";
  errorStatus.textContent = "未入力の必須項目があります。各項目のエラーを確認してください。";
  errors[0].input.focus();
}

function updateErrorSummary() {
  const hasErrors = requiredFields.some(
    (field) => field.input.getAttribute("aria-invalid") === "true",
  );
  errorStatus.textContent = hasErrors
    ? "未入力の必須項目があります。各項目のエラーを確認してください。"
    : "";
}

function showSuccessState(reservation) {
  clearErrorState();

  resultSubject.textContent = reservation.subject;
  resultDate.textContent = formatDate(reservation.date);
  resultTime.textContent = reservation.time;
  resultMethod.textContent = reservation.method;
  resultMemo.textContent = reservation.memo || "メモはありません。";

  emptyState.hidden = true;
  resultPanel.hidden = false;
  successStatus.textContent = "予約内容を確認できます。";
  resultPanel.focus();
}

function clearErrorState() {
  errorStatus.textContent = "";

  for (const field of requiredFields) {
    field.input.setAttribute("aria-invalid", "false");
    field.error.hidden = true;
    field.error.textContent = "";
  }
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}
