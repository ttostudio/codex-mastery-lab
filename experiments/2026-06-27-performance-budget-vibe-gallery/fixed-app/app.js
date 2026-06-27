const buttons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category]");
const count = document.querySelector("#result-count");

function render(filter) {
  let shown = 0;

  cards.forEach((card) => {
    const match = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !match);
    if (match) shown += 1;
  });

  count.textContent = `${shown} ${shown === 1 ? "card" : "cards"} shown`;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    render(button.dataset.filter);
  });
});

render("all");
