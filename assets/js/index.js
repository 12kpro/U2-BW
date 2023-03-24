const artists = ["queen", "nek", "3 doors down", "metallica"];

document.addEventListener("DOMContentLoaded", async () => {
  volumeBarInit('.current-track__options__vol input[type="range"]');

  let player = new AudioControls("audio_track");

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
    console.log(searchResults);
    for (const track of searchResults.data) {
      searchCnt.append(
        cardTpl(track.album.id, "album", track.album.cover, track.title_short, track.title_version, track.preview)
      );
    }
  });

  //randomContent(artists, "artist", 10);
  buildSection("Album", artists, "album", 15);
  buildSection("Artisti", artists, "artists", 12);
  //  buildSection("Suggeriti", artists, "album", 8);
});
