console.log("Lets wirte javascript");

let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/assets/songs/${currFolder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Show all the songs in play List (left)

    let songUL = document.querySelector(".middle")

    // Get the list of all song
    songUL.innerHTML = ""

    // Loop through the songs and generate HTML for each song card
    for (const song of songs) {
        songUL.innerHTML += `<div class="songCard">
                            <div><img class="invert" src="assets/img/music.svg" alt="Music"></div>
                            <div class="songInfor">
                                <p class="songName">${song.replaceAll("%20", " ")}</p>
                                <p>Artist: Ravi Katiyar</p>
                            </div>
                            <div><img class="myplayer invert" src="assets/play-bar/play.svg" alt="Play"></div>
                        </div>`;
    }

    // Select all elements with the class "myplayer" and add event listeners to each
    document.querySelectorAll('.myplayer').forEach(player => {
        player.addEventListener('click', function () {
            if (currentSong.paused) {
                currentSong.play();
                player.src = "assets/play-bar/pause.svg";
            } else {
                currentSong.pause();
                player.src = "assets/play-bar/play.svg";
            }
        });
    });


    


    // Attach an evenet listner to each song

    Array.from(document.querySelector(".middle").querySelectorAll(".songCard")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".songName").innerHTML)
            playMusic(e.querySelector(".songName").innerHTML)

            // console.log(e.getElementsByClassName(".my-play>img").src);


        })
    })

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
const playMusic = (track, pause = false) => {

    // let audio= new Audio("/assets/songs/"+track)
    currentSong.src = `/assets/songs/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "assets/play-bar/pause.svg"
    }



    document.querySelector(".mySongName").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`




}



(async function () {

    await getSongs("Preloaded")



    playMusic(songs[0], true)


    // Attach eventListner in play, previos and next
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/play-bar/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/play-bar/play.svg"
        }

    })

    // Listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    // Add a eventLisener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add EventListener for the hamburger 

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add EventListener for close

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    // add eventListener to the previous and next

    previous.addEventListener("click", () => {
        console.log("previous clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    next.addEventListener("click", () => {

        // console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(index);
        if (index < songs.length - 1) {
            currentSong.pause()
        }

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    // add eventListener to the volume 

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {

        currentSong.volume = parseInt(e.target.value) / 100;

    })

    // add eventlistener on the social media icon

    insta.addEventListener("click", () => {
        window.open("https://www.instagram.com/spotify/", "blank")
    })

    twitter.addEventListener("click", () => {
        window.open("https://x.com/spotify", "blank")
    })

    fb.addEventListener("click", () => {
        window.open("https://www.facebook.com/Spotify", "blank")
    })

    // Load PlayList Whenever card is clicked 

    let arr = Array.from(document.querySelectorAll(".card"));

    arr.forEach(e => {

        e.addEventListener("click", async item => {
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)

            playMusic(songs[0])


        })
    })

    // add mute unmute in volume btn

    document.querySelector(".volume>img").addEventListener("click", e => {


        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;

            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.2;

            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })


})()