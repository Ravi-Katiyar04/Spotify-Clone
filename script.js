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
let currentSong=new Audio();
const playMusic=(track)=>{
    
    // let audio= new Audio("/assets/songs/"+track)
    currentSong.src="/assets/songs/"+track
    currentSong.play()
}

(async function () {

    

    // Get the list of all song

    let songs = await getSongs()

    // Show all the songs in play List (left)
    let songUL = document.querySelector(".middle")

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

    Array.from(document.querySelector(".middle").querySelectorAll(".songCard")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".songName").innerHTML)
            playMusic(e.querySelector(".songName").innerHTML)
            
        })
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
