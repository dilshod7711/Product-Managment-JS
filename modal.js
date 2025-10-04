const openModal = document.getElementById("openModal");
const overlayModal = document.getElementById("overlay-modal");
const closeModal = document.getElementById("closeModal");

openModal.addEventListener("click", () => {
  overlayModal.classList.remove("hidden");
  setTimeout(() => {
    overlayModal.classList.remove("translate-x-full");
  }, 10);
});

closeModal.addEventListener("click", () => {
  overlayModal.classList.add("translate-x-full");
  setTimeout(() => {}, 300);
});
