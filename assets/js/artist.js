const URLParams = new URLSearchParams(window.location.search);
const pageType = URLParams.get("page");
const id = URLParams.get("id") || 412;

console.log(pageType, id);
document.addEventListener("DOMContentLoaded", async () => {
  volumeBarInit('.current-track__options__vol input[type="range"]');
  const url = `${BASE_URL}artist/${id}`;

  const trackListCnt = document.getElementById("track_list");
  const artistResults = await resp(url);

  const heroImg = document.querySelector(".hero-image");
  const artistNameCnts = document.querySelectorAll(".artist-name");
  const artistRank = document.querySelector("#rank");

  const artistNavTitle = document.querySelector("#nav_play_btn span");
  artistNavTitle.innerText = artistResults.name;

  heroImg.style.backgroundImage = `url(${artistResults.picture_xl})`;
  for (const name of artistNameCnts) {
    name.innerText = artistResults.name;
  }
  artistRank.innerText = artistResults.nb_fan;
  const trackList = await resp(artistResults.tracklist);

  for (const [i, track] of trackList.data.entries()) {
    console.log(track);
    trackListCnt.insertAdjacentHTML(
      "beforeend",
      trackTpl(i + 1, track.album.cover, track.title_short, track.rank, toHHMM(track.duration), track.preview)
    );
  }
  const albumCnt = document.getElementById("artist_album");
  const suggestedCnt = document.getElementById("artist_suggested");
  const artistInfoImg = document.getElementById("artist_info_img");
  artistInfoImg.src = artistResults.picture_medium;

  const suggestedUrl = `${BASE_URL}search?q=${artistResults.name}`;
  const suggestedList = await resp(suggestedUrl);

  for (const album of suggestedList.data) {
    albumCnt.append(cardTpl(album.album.id, "album", album.album.cover, album.title_short, album.title_version));
    suggestedCnt.append(cardTpl(album.album.id, "album", album.album.cover, album.title_short, album.title_version));
  }
});
