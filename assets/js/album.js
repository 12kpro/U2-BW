const URLParams = new URLSearchParams(window.location.search);
const id = URLParams.get("id") || 75621062;

document.addEventListener("DOMContentLoaded", async () => {
  volumeBarInit('.current-track__options__vol input[type="range"]');

  const url = `${BASE_URL}album/${id}`;

  let albumResults = await resp(url);
  console.log(albumResults);
  /*
  for (const album of searchResults.data) {
    searchCnt.insertAdjacentHTML(
      "beforeend",
      cardTpl(album.id, "album", album.album.cover, album.title_short, album.title_version)
    );
  }
*/
});
