console.log("Lets write javascript");

let songs;
let currFolder;


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/Spotify-Clone/assets/songs/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // Show all the songs in play List (left)
    let songUL = document.querySelector(".middle");
    songUL.innerHTML = "";

    // Loop through the songs and generate HTML for each song card
    for (const song of songs) {
        songUL.innerHTML += `<div class="songCard">
                                <div><img class="invert" src="assets/img/music.svg" alt="Music"></div>
                                <div class="songInfor">
                                    <p class="songName">${song.replaceAll("%20", " ")}</p>
                                    <p>Artist: Ravi Katiyar</p>
                                </div>
                                <div><img class="myplayer invert" src="assets/play-bar/play.svg" alt="Play" data-song="${song}"></div>
                            </div>`;
    }

    // Attach event listeners to each song card and myplayer button
    document.querySelectorAll('.songCard').forEach((card, index) => {
        card.addEventListener('click', () => {
            // Play music and change the myplayer icon when songCard is clicked
            playMusic(songs[index]);
            updatePlayerIcons(index);
        });
    });

    document.querySelectorAll('.myplayer').forEach((player, index) => {
        player.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event from bubbling up to the songCard
            if (currentSong && currentSong.src.includes(songs[index])) {
                // Toggle play/pause for the current song
                if (currentSong.paused) {
                    currentSong.play();
                    player.src = "assets/play-bar/pause.svg";
                } else {
                    currentSong.pause();
                    player.src = "assets/play-bar/play.svg";
                }
            } else {
                // Play the selected song and update icons
                playMusic(songs[index]);
                updatePlayerIcons(index);
            }
        });
    });

    return songs;
}

function convertSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to 2 digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentSong = new Audio();
let currentPlayer = null; // Track the current player icon

const playMusic = (track, pause = false) => {
    currentSong.src = `/Spotify-Clone/assets/songs/${currFolder}/` + track;
    console.log(`/assets/songs/${currFolder}/` + track);
    
    if (!pause) {
        currentSong.play();
        play.src = "assets/play-bar/pause.svg";
    }

    document.querySelector(".mySongName").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`;
};

function updatePlayerIcons(index) {
    // Update the icons for all players
    document.querySelectorAll('.myplayer').forEach((player, idx) => {
        if (idx === index) {
            player.src = currentSong.paused ? "assets/play-bar/play.svg" : "assets/play-bar/pause.svg";
            currentPlayer = player;
        } else {
            player.src = "assets/play-bar/play.svg"; // Reset other icons
        }
    });
}

(async function () {
    await getSongs("PreLoaded");
    playMusic(songs[0], true);

    // Attach eventListner in play, previous, and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/play-bar/pause.svg";
        } else {
            currentSong.pause();
            play.src = "assets/play-bar/play.svg";
        }
        if (currentPlayer) {
            currentPlayer.src = currentSong.paused ? "assets/play-bar/play.svg" : "assets/play-bar/pause.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Event listeners for the hamburger menu, close button, and previous/next controls
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
            updatePlayerIcons(index - 1);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            currentSong.pause();
        }
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
            updatePlayerIcons(index + 1);
        }
    });

    // Volume control and mute/unmute functionality
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.2;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    });

    // Social media links
    insta.addEventListener("click", () => {
        window.open("https://www.instagram.com/spotify/", "blank");
    });

    twitter.addEventListener("click", () => {
        window.open("https://x.com/spotify", "blank");
    });

    fb.addEventListener("click", () => {
        window.open("https://www.facebook.com/Spotify", "blank");
    });

    // Load PlayList Whenever card is clicked
    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`${item.currentTarget.dataset.folder}`);


            console.log(item.target.src);
            if (item.target.src.includes("plybtn.svg")) {
                item.target.src = item.target.src.replace("plybtn.svg", "pasbtn.svg");
                playMusic(songs[0]);
                updatePlayerIcons(0)

            }
            else if (item.target.src.includes("pasbtn.svg")) {
                item.target.src = item.target.src.replace("pasbtn.svg", "plybtn.svg");
                currentSong.pause();
                updatePlayerIcons(1);
                play.src = "assets/play-bar/play.svg";
            }
        });
    });
})();
