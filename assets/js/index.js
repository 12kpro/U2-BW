const URLParams = new URLSearchParams(window.location.search);
const pageType = URLParams.get("page");
const id = URLParams.get("id");

console.log(pageType, id);
document.addEventListener("DOMContentLoaded", () => {
  volumeBarInit('.current-track__options__vol input[type="range"]');

  const searchCnt = document.getElementById("search_cnt");
  const searchInputCnt = document.getElementById("search_input");
  const searchInput = searchInputCnt.querySelector("input");
  const searchBtn = searchInputCnt.querySelector("button");
  let timeout = null;

  searchInput.addEventListener("keyup", function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      searchBtn.disabled = false;
    }, 1000);
  });

  searchBtn.addEventListener("click", async (e) => {
    const url = `${BASE_URL}search?q=${searchInput.value}`;
    console.log(url);
    searchCnt.innerHTML = "";
    let searchResults = await resp(url);

    for (const album of searchResults.data) {
      searchCnt.insertAdjacentHTML(
        "beforeend",
        cardTpl(album.id, "album", album.album.cover, album.title_short, album.title_version)
      );
    }
  });
});
