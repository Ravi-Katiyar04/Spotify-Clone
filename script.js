console.log("Lets wirte javascript");



async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/assets/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs


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
    currentSong.src = "/assets/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "assets/play-bar/pause.svg"
    }



    document.querySelector(".mySongName").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML =`${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`




}

let songs;

(async function () {

    songs = await getSongs()

    playMusic(songs[0], true)

    // Show all the songs in play List (left)
    let songUL = document.querySelector(".middle")

    // Get the list of all song

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<div class="songCard">
                        <div><img class="invert" src="assets/music.svg" alt="Music"></div>
                        <div class="songInfor">
                            <p class="songName">${song.replaceAll("%20", " ")}</p>
                            <p>Artist: Ravi Katiyar</p>
                        </div>
                        <div><img class="invert" src="assets/play-bar/play.svg" alt=""></div>
                    </div>`
    }

    // Attach an evenet listner to each song

    Array.from(document.querySelector(".middle").querySelectorAll(".songCard")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songName").innerHTML)
            playMusic(e.querySelector(".songName").innerHTML)

        })
    })

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

        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration) * 100 + "%"

    })

    // Add a eventLisener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left= percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent)/100 ; 
    })

    // Add EventListener for the hamburger 

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0"
    })

    // Add EventListener for close

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-100%"
    })

    // add eventListener to the previous and next

    previous.addEventListener("click", ()=>{
        console.log("prevois clicked");

        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
        
    })

    next.addEventListener("click", ()=>{
        
        // console.log("next clicked");
        // console.log(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs);
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(index);
        if(index < songs.length-1){
            currentSong.pause()
        }
        
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
        
    })

    // add eventListener to the volume 

    document.querySelector(".myseekbar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".mycircle").style.left= percent + "%";

        currentSong.volume=parseInt(percent)/100;
        
    })


    // // Play the first song
    // var audio = new Audio(songs[0]);
    // // audio.play();

    // //Get duration of song
    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration);

    // })
})()
