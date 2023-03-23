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

    const searchCntAlbum = document.createElement("div");
    searchCntAlbum.classList.add(
      "row",
      "row-cols-1",
      "row-cols-sm-2",
      "row-cols-md-3",
      "row-cols-lg-4",
      "row-cols-xl-5",
      "gx-4",
      "gy-3",
      "mb-4"
    );

    for (const [i, album] of searchResults.data.entries()) {
      console.log(album);
      if (i === 0) {
        searchCnt.insertAdjacentHTML("afterbegin", heroTpl(album.artist.picture, album.artist.name, album.artist.id));
      }
      searchCntAlbum.insertAdjacentHTML(
        "beforeend",
        cardTpl(album.album.cover, album.id, album.title_short, album.title_version)
      );
      searchCnt.append(searchCntAlbum);
    }
  });
});
