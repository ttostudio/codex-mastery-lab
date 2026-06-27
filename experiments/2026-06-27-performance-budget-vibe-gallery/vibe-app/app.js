const filterButtons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".product-card");
const resultCount = document.querySelector("#result-count");

function updateGallery(filter) {
  let visibleCount = 0;

  cards.forEach((card) => {
    const isVisible = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "card" : "cards"} shown`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    updateGallery(button.dataset.filter);
  });
});

updateGallery("all");
