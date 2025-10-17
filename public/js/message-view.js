document
  .getElementById("readButton")
  .addEventListener("click", async (event) => {
    /** @type {HTMLButtonElement} */
    const button = event.target;
    const id = button.dataset.id;
    result = await (await fetch(`/message/view/${id}/toggle-read`)).json();
  });
document
  .getElementById("archiveButton")
  .addEventListener("click", async (event) => {
    /** @type {HTMLButtonElement} */
    const button = event.target;
    const id = button.dataset.id;
    result = await (await fetch(`/message/view/${id}/toggle-archived`)).json();
  });
