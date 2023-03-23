const URLParams = new URLSearchParams(window.location.search);
const id = URLParams.get("id") || 75621062;

document.addEventListener("DOMContentLoaded", async () => {
  volumeBarInit('.current-track__options__vol input[type="range"]');

  const url = `${BASE_URL}album/${id}`;

  const albumCover = document.getElementById("album_cover");
  const albumArtist = document.getElementById("album_artist");
  const albumYear = document.getElementById("album_year");
  const albumNumTracks = document.getElementById("album_number_tracks");
  const albumDuration = document.getElementById("album_duration");
  const albumName = document.getElementById("album_name");
  const albumArtistCover = document.getElementById("album_artist_cover");

  const albumTrackListCnt = document.getElementById("album_tracks");
  const alumOtherCnt = document.getElementById("album_other");

  let albumResults = await resp(url);
  console.log(albumResults);

  albumCover.src = albumResults.cover_medium;
  albumArtist.innerText = albumResults.artist.name;
  albumYear.innerText = albumResults.release_date; // fix per anno da data
  albumNumTracks.innerText = albumResults.nb_tracks;
  albumDuration.innerText = albumResults.duration; // fix per hh:mm:ss
  albumName.innerText = albumResults.title;
  albumArtistCover.src = albumResults.artist.picture_small;

  for (const [i, track] of albumResults.tracks.data.entries()) {
    albumTrackListCnt.insertAdjacentHTML(
      "beforeend",
      trackAlbumTpl(i + 1, track.title_short, track.artist.name, track.duration)
    );
  }
  const suggestedUrl = `${BASE_URL}search?q=${albumResults.artist.name}`;
  const suggestedList = await resp(suggestedUrl);

  for (const album of suggestedList.data) {
    alumOtherCnt.insertAdjacentHTML(
      "beforeend",
      cardTpl(album.id, "album", album.album.cover, album.title_short, album.title_version)
    );
  }
});
