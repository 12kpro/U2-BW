const artists = ["queen", "nek", "3 doors down", "metallica"];

document.addEventListener("DOMContentLoaded", async () => {
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
        cardTpl(album.album.id, "album", album.album.cover, album.title_short, album.title_version)
      );
    }
  });

  //randomContent(artists, "artist", 10);
  buildSection("Album", artists, "album", 15);
  buildSection("Artisti", artists, "artists", 12);
  buildSection("Suggeriti", artists, "album", 8);
});
