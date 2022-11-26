const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
$(".app").innerHTML = `
<div class="player" data-volume="up">
    <div class="dashboard">
        <div class="background"></div>
        <div class="header">
            <button class="header-left btn"> 
                <i class="icon- fa fa-chevron-down"></i>
            </button>
            <div class="header-center"></div>
            <button class="header-right btn">
            <i class="icon- fa fa-plus"></i>
            </button>
        </div>
        <div class="circular">
            <div class="cd">
                <img class="cd-thumbnail">
            </div>
        </div>
        <div class="runtime">
            <button class="volume-btn">
                <i class="icon-volume-up fa fa-volume-up"></i>
                <i class="icon-volume-down fa fa-volume-down"></i>
                <i class="icon-volume-off fa fa-volume-off"></i>
                <div class="volume-bar">
                    <input type="range" class="volume-progress">
                </div>
            </button>
            <div class="progress">
                <div class="progress-bar">
                    <div class="timeupdate"></div>
                    <div class="progress-preview">0:00</div>
                    <div class="progress-indicator"></div>
                </div>
            </div>
            <div class="timeTotal">0:00</div>
        </div>
        <div class="controls">
            <button class="autoplay-btn btn">
            <div class="toggle-autoplay" data-autoplay="false"></div>
            </button>
            <button class="repeat-btn btn">
                <i class="icon-repeat fas fa-redo-alt"></i>
            </button>
            <button class="prev-btn btn">
                <i class="icon-prev fa fa-step-backward"></i>
            </button>
            <button class="toggle-play btn">
                <i class="icon-play fa fa-play"></i>
                <i class="icon-pause fa fa-pause"></i>
            </button>
            <button class="next-btn btn">
                <i class="icon-next fa fa-step-forward"></i>
            </button>
            <button class="random-btn btn">
                <i class="icon-random fa fa-random"></i>
            </button>
            <button class="playbackRate-btn btn">
                <i>1X</i>
            </button>
        </div>
        <audio></audio>
    </div>
    <div class="playlist"></div>
</div>`;

const audio = $("audio");
const player = $(".player");
const dashboard = $(".dashboard");
const background = $(".background");
const headerLeftBtn = $(".header-left");
const headerCenter = $(".header-center");
const headerRightBtn = $(".header-right");

const circular = $(".circular");
const cd = $(".cd");
const cdThumbnail = $(".cd-thumbnail");

const progress = $(".progress");
const progressPreview = $(".progress-preview");
const timeupdate = $(".timeupdate");
const timeTotal = $(".timeTotal");

const volumeBtn = $(".volume-btn");
const volumeProgress = $(".volume-progress");

const autoPlayBtn = $(".autoplay-btn");
const autoplay = $(".toggle-autoplay");
const playbackRateBtn = $(".playbackRate-btn");
const prevBtn = $(".prev-btn");
const nextBtn = $(".next-btn");
const togglePlayBtn = $(".toggle-play");
const toggleRepeatBtn = $(".repeat-btn");
const randomSongBtn = $(".random-btn");
const playlist = $(".playlist");
const APP_MUSIC_DATA = "APP_MUSIC_DATA"
const appMusic = {
    isAutoplay: false,
    isCurrentIndex: 0,
    isPlayBackRate: 1,
    isPlaying: false,
    isPaused: false,
    isRandom: false,
    isRepeat: false,
    iScrubbing: false,
    isDuration: 10000,
    isVolume:50,

    //Get Item localStorage
    getLocalStorage: JSON.parse(localStorage.getItem(APP_MUSIC_DATA)) || {},

    //set Item localStorage
    setLocalStorage(key, value) {
        this.getLocalStorage[key] = value;
        localStorage.setItem(APP_MUSIC_DATA, JSON.stringify(this.getLocalStorage))
    },

    //Playlist Song
    playlist: [{
            name: "Losing Control",
            artist: "Villain of the story",
            album: "Divided",
            thumbnail: "https://i.postimg.cc/y62Drhym/image.jpg",
            audio: "https://cdns-preview-4.dzcdn.net/stream/c-465dbacd317d67cc6a4d1adb22355970-2.mp3"
        },
        {
            name: "Senden Baska",
            artist: "Serhet Durmus",
            album: "Singles",
            thumbnail: "https://i.postimg.cc/cCtNnnKZ/image.jpg",
            audio: "https://cdns-preview-9.dzcdn.net/stream/c-94e53a428fd9dbf35c5b06d800447c2a-4.mp3"
        },
        {
            name: "I don't care",
            artist: "Apocalyptica",
            album: "Singles",
            thumbnail: "https://i.postimg.cc/BZj8g7HZ/image.jpg",
            audio: "https://cdns-preview-d.dzcdn.net/stream/c-dbbdb0dd57e34c52b2379fb69bc7da4f-3.mp3"
        },
        {
            name: "Monster",
            artist: "Fight the Fade",
            album: "APOPHYSITIS",
            thumbnail: "https://i.postimg.cc/BnS4htk5/image.jpg",
            audio: "https://cdns-preview-4.dzcdn.net/stream/c-46413a2a74ddd53a2f13ef2b853202f7-3.mp3"
        },

        {
            name: "Dance With the Devil",
            artist: "Breaking Benjamin",
            album: "Phobia",
            thumbnail: "https://i.postimg.cc/15Xzmj0J/image.jpg",
            audio: "https://cdns-preview-b.dzcdn.net/stream/c-b2bbd0db3fb9e1314ef56dfc11c86a65-5.mp3"
        },
        {
            name: "The Catalyst",
            artist: "Linkin Park",
            album: "A Thousand Sun",
            thumbnail: "https://i.postimg.cc/FK3jRqxM/image.jpg",
            audio: "https://cdns-preview-8.dzcdn.net/stream/c-8930ac6a4a087666b651b8aad5cd4a26-5.mp3"
        },
        {
            name: "Lali",
            artist: "Jony",
            album: "Spisok tvoikh mysley",
            thumbnail: "https://i.postimg.cc/hvyGBHCW/image.jpg",
            audio: "https://cdns-preview-0.dzcdn.net/stream/c-095471cd71c784daa9eab6beb69c5848-3.mp3"
        }, {
            thumbnail: "https://sun9-70.userapi.com/c849536/v849536378/1166d/03ATAUsxevM.jpg",
            audio: "https://audio.jukehost.co.uk/FNxFjfP76vtMkjnUgEUXCnns5gDHptwG",
            name: "I Can Only Imagine",
            artist: "MercyMe",
        },

        {
            thumbnail: "https://images.genius.com/70f7c983655ba8aab31aac214c0d85f8.640x640x1.jpg",
            audio: "https://audio.jukehost.co.uk/vKPfcJ6mhjHcybY3x6bYv5PYLYMPaAgS",
            name: "Орлы",
            artist: "Слово Жизни Music",
        },

        {
            thumbnail: "https://static.tildacdn.com/tild6633-6330-4231-b361-653062313938/Untitled-3.jpg",
            audio: "https://audio.jukehost.co.uk/tK4mp9gjwwYaOa2Pii1QR99fN37hj2q0",
            name: "В этом городе Ты",
            artist: "Слово Жизни Music",
        },

        {
            thumbnail: "https://image.freepik.com/free-vector/hello-typography-badge-design-vector_53876-66780.jpg",
            audio: "https://audio.jukehost.co.uk/pr9YWAKSuBUz0sWYOg4ngiVzSTioeBIe",
            name: "Hello",
            artist: "Dimash Kudaybergen",
        },
        {
            name: "Perfect",
            audio: "https://dl.dropbox.com/s/3mjzj73400sxovk/perfect.mp3?raw=1",
            artist: "Ed Sheeran",
            thumbnail: "https://dl.dropbox.com/s/crlthbozdznb13g/perfect.jpeg?raw=1"
        },
        {
            name: "7 Rings",
            audio: "https://dl.dropbox.com/s/yo5tcfdjoz95ozf/7-rings.mp3?raw=1",
            artist: "Ariana Grande",
            thumbnail: "https://dl.dropbox.com/s/gobvfxj4r0t053v/7-rings.jpg?raw=1"
        },
        {
            name: "Happier",
            audio: "https://dl.dropbox.com/s/zp1xfir101y4sc3/happier.mp3?raw=1",
            artist: "Marshmello",
            thumbnail: "https://www.dropbox.com/s/xxmwcz14hkn7iwl/happier.png?raw=1"
        },
        {
            name: "Stay",
            audio: "https://dl.dropbox.com/s/umam9olakop001d/stay.mp3?raw=1",
            artist: "Justin Bieber",
            thumbnail: "https://dl.dropbox.com/s/kierj5lzst1yx9n/stay.jpg?raw=1"
        },
        {
            name: "Girls Like You",
            audio: "https://dl.dropbox.com/s/yi1cpg16snrl3fc/girls-like-you.mp3?raw=1",
            artist: "Maroon 5",
            thumbnail: "https://dl.dropbox.com/s/ouq5zzgbqsk9zx0/girls-like-you.png?raw=1"
        },
        {
            name: "2Stroke",
            artist: "Bones - Prod. Niq Venus",
            audio: "https://trevor-reznik.github.io/guides/email-template/4.opus",
            thumbnail: "https://trevor-reznik.github.io/guides/email-template/4.jpg"
        },
        {
            name: 'Playboi Carti type beat "Jaded"',
            artist: "Niq Venus",
            audio: "https://trevor-reznik.github.io/guides/email-template/1.mp3",
            thumbnail: "https://trevor-reznik.github.io/guides/email-template/14.jpg"
        },
        {
            name: 'Roddy Ricch type beat "HERO"',
            artist: "Niq Venus",
            audio: "https://trevor-reznik.github.io/guides/email-template/2.mp3",
            thumbnail: "https://trevor-reznik.github.io/guides/email-template/13.jpg"
        },
        {
            name: "Reeses Puffs",
            artist: "Niq Venus",
            audio: "https://trevor-reznik.github.io/guides/email-template/3.mp3",
            thumbnail: "https://trevor-reznik.github.io/guides/email-template/15.jpg"
        },
    ],

    definedProperties() {
        Object.defineProperty(this, "currentSong", {
            get() {
                return this.playlist[this.isCurrentIndex]
            }
        })
    },

    //Render Playlist Song
    renderPlaylistMusic() {
        const songs = this.playlist.map((song, index) => {
            return `
            <div class="song ${this.isCurrentIndex===index?"active":""}" data-index="${index}">
                <div class="song-thumbnail">
                    <img src="${song.thumbnail}" alt="" class="song-thumbnail-img">
                </div>
                <div class="song-body">
                    <div class="song-info">
                        <h5 class="song-name">${song.name}</h5>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                    <div class="song-option">
                        <i class="icon-option fa fa-ellipsis-v"></i>
                    </div>
                </div>
            </div>`
        });
        playlist.innerHTML = songs.join("");

    },

    //Handle Events 
    handleEventsClickSong() {
        $this = this;
        const sizeThumbnail = circular.offsetWidth;

        //Ring Thumbnail
        const thumbnailAnimate = background.animate([{
            transform: "rotate(360deg)"
        }], {
            duration: this.isDuration,
            iterations: Infinity
        });
        const cdThumbnailAnimate = cd.animate([{
            transform: "rotate(-360deg)"
        }], {
            duration: this.isDuration,
            iterations: Infinity
        });
        thumbnailAnimate.pause()
        cdThumbnailAnimate.pause()

        //Set Thumbnail Size ScrollY
        document.onscroll = function() {
            const newScroll = window.scrollY || document.documentElement.scrollTop;
            const newSizeThumbnail = sizeThumbnail - newScroll
            circular.style.width = newSizeThumbnail > 0 ? newSizeThumbnail + 'px' : 0
            circular.style.height = newSizeThumbnail > 0 ? newSizeThumbnail + 'px' : 0
            circular.style.opacity = newSizeThumbnail / newSizeThumbnail

        }

        playlist.style.marginTop = dashboard.offsetHeight + "px"

        //Set Play
        audio.onplay = () => {
            $this.isPlaying = true;
            thumbnailAnimate.play()
            cdThumbnailAnimate.play()
            player.classList.toggle("isPlaying", $this.isPlaying)
        };

        //Set Pause
        audio.onpause = () => {
            $this.isPlaying = false
            thumbnailAnimate.pause()
            cdThumbnailAnimate.pause()
            player.classList.toggle("isPlaying", $this.isPlaying)
        };

        //Set event after song End 
        audio.onended = () => {
            if ($this.isRepeat) {
                audio.play()
            } else if ($this.isRandom) {
                $this.randomSong()
                audio.play()
            } else if (audio.autoplay) {
                $this.nextSong()
                if (audio.autoplay) { audio.play() }
            }
        };

        //Set event if error song
        audio.onerror = () => {
            if (audio.autoplay) {
                $this.nextSong()
                if (audio.autoplay) { audio.play() }
            }
        };

        //Handle Current Time song
        audio.ontimeupdate = () => {
            $this.handleCurrentTime()
        };

        //handle preload total song Time
        audio.onloadeddata = () => {
            $this.handleDuration()
        };

        //handle progress while moving mouse
        progress.onmousemove = (e) => {
            $this.handleCurrentTimeLine(e)
        };

        //handle Scrubbing while Down mouse
        progress.onmousedown = (e) => {
            $this.handleScrubbing(e)
        };

        //handle progress while moving mouse and active Scrubbing
        document.onmousemove = (e) => {
            if ($this.iScrubbing) {
                this.handleCurrentTimeLine(e)
            }
        };

        //handle progress while up mouse and active Scrubbing
        document.onmouseup = (e) => {
            if ($this.iScrubbing) {
                this.handleScrubbing(e)
            }
        };

        //Set Volume
        volumeProgress.oninput = (e) => {
            if (e.target.closest(".volume-bar")) {
                audio.volume = Number(e.target.value) / 100;
                audio.muted = Number(e.target.value) === 0;
            }
        };

        //Toggle Muted
        volumeBtn.onclick = (e) => {
            if (!e.target.closest(".volume-bar")) {
                audio.muted = !audio.muted
            }
        };

        //Handle Volume Change
        audio.onvolumechange = () => {
            volumeProgress.value = audio.volume * 100;
            let iconChang;
            if (audio.muted || audio.volume === 0) {
                volumeProgress.value = 0;
                iconChang = "off"
            } else if (audio.volume >= 0.5) {
                iconChang = "up"
            } else {
                iconChang = "down"
            }
            player.dataset.volume = iconChang
            $this.setLocalStorage("isVolume", audio.volume * 100)
        };

        //Click Change PlaybackRate
        playbackRateBtn.onclick = () => { $this.changPlaybackRate() }

        //Toggle Autoplay
        autoPlayBtn.onclick = (e) => {
            audio.autoplay = !audio.autoplay;
            autoplay.dataset.autoplay = audio.autoplay;
            $this.setLocalStorage("isAutoplay", audio.autoplay)
        };

        //Toggle Play
        togglePlayBtn.onclick = () => {
            $this.isPlaying = !$this.isPlaying;
            if ($this.isPlaying) {
                audio.play()
            } else {
                audio.pause()
            }
        };

        //Net Song
        nextBtn.onclick = () => {
            if ($this.isRandom) {
                $this.randomSong();
            } else {
                $this.nextSong();
            }
            if (audio.autoplay) { audio.play() };
        };

        // Prev Song
        prevBtn.onclick = () => {
            if ($this.isRandom) {
                $this.randomSong()
            } else {
                $this.prevSong()
            }
            if (audio.autoplay) { audio.play() };

        };

        //Random Song
        randomSongBtn.onclick = () => {
            $this.isRandom = !$this.isRandom;
            player.classList.toggle("isRandom", $this.isRandom)
            $this.setLocalStorage("isRandom", $this.isRandom)
        };

        //Repeat Song
        toggleRepeatBtn.onclick = () => {
            $this.isRepeat = !$this.isRepeat
            player.classList.toggle("isRepeat", $this.isRepeat)
            $this.setLocalStorage("isRepeat", $this.isRepeat)

        };


        headerLeftBtn.onclick = () => {
            playlist.classList.toggle("isPlaylist")
        }

        //Oder Song
        playlist.onclick = (e) => {
            let nodeIndex;
            if (e.target.closest(".song:not(.active)")) {
                nodeIndex = Number(e.target.closest(".song").dataset.index);
                $this.isCurrentIndex = nodeIndex;
            }
            audio.load();
            $this.renderPlaylistMusic();
            $this.handleLoadCurrentSong();
            $this.scrollAutoTopViewPlaylist()

        };

    },

    changPlaybackRate() {
        const newPlayBackRate =
            (audio.playbackRate) <= 2 ? (audio.playbackRate + 0.25) : 0.25;
        audio.playbackRate = newPlayBackRate;
        playbackRateBtn.innerHTML = `<i>${newPlayBackRate}x</i>`
        this.isDuration = this.isDuration + (newPlayBackRate * 10000)
        this.setLocalStorage("isPlayBackRate", newPlayBackRate)
    },

    nextSong() {
        this.isCurrentIndex++;
        if (this.isCurrentIndex >= this.playlist.length) {
            this.isCurrentIndex = 0;
        }
        audio.load();
        this.renderPlaylistMusic();
        this.handleLoadCurrentSong();
        this.scrollAutoTopViewPlaylist()
    },

    prevSong() {
        this.isCurrentIndex--;
        if (this.isCurrentIndex < 0) {
            this.isCurrentIndex = this.playlist.length - 1
        }
        audio.load();
        this.renderPlaylistMusic();
        this.handleLoadCurrentSong();
        this.scrollAutoTopViewPlaylist()
    },

    randomSong() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.playlist.length);
        }
        while (randomIndex === this.isCurrentIndex) {
            this.isCurrentIndex = randomIndex
            this.renderPlaylistMusic()
            this.handleLoadCurrentSong();
            this.scrollAutoTopViewPlaylist()
        }
    },

    handleScrubbing(e) {
        const rect = progress.getBoundingClientRect();
        const parent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
        this.iScrubbing = (e.buttons && 1) === 1;
        progress.classList.toggle("isScrubbing", this.iScrubbing);
        if (this.iScrubbing) {
            this.isPaused = audio.paused;
            audio.pause()
        } else {
            audio.currentTime = parent * audio.duration;
            if (this.isPaused)
                audio.play()

        }
        this.handleCurrentTimeLine(e)
    },

    handleCurrentTimeLine(e) {
        const rect = progress.getBoundingClientRect();
        const parent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
        const hours = Math.floor((parent * audio.duration) / 3600);
        const minutes = Math.floor((parent * audio.duration) / 60) % 60;
        const seconds = Math.floor((parent * audio.duration) % 60);
        const hoursV = hours ? `${hours}:` : ``;
        const minutesV = (minutes && minutes > 600) ? `${minutes}` : `${minutes}`;
        const secondsV = (seconds < 10) ? `:0${seconds}` : `:${seconds}`;

        progressPreview.textContent = hoursV + minutesV + secondsV;

        progress.style.setProperty("--preview", parent);

        if (this.iScrubbing) {
            progress.style.setProperty("--progress", parent)
        }
    },


    handleCurrentTime() {
        if (audio.currentTime) {
            const hours = Math.floor(audio.currentTime / 3600);
            const minutes = Math.floor(audio.currentTime / 60) % 60;
            const seconds = Math.floor(audio.currentTime % 60);
            const hoursV = hours ? `${hours}:` : ``;
            const minutesV = (minutes && minutes > 600) ? `${minutes}` : `${minutes}`;
            const secondsV = (seconds < 10) ? `:0${seconds}` : `:${seconds}`;

            timeupdate.textContent = `${hoursV+minutesV+secondsV}`;
            circular.style.backgroundImage = `conic-gradient(red ${((audio.currentTime / audio.duration)*100)*3.6}deg, transparent 0deg)`;
            progress.style.setProperty("--progress", (audio.currentTime / audio.duration));
            this.setLocalStorage("isCurrentTime", audio.currentTime)
        }
    },

    handleDuration() {
        if (audio.readyState) {
            const hours = Math.floor(audio.duration / 3600);
            const minutes = Math.floor(audio.duration / 60) % 60;
            const seconds = Math.floor(audio.duration % 60);
            const hoursV = hours ? `${hours}:` : ``;
            const minutesV = (minutes && minutes > 600) ? `${minutes}` : `${minutes}`;
            const secondsV = (seconds < 10) ? `:0${seconds}` : `:${seconds}`;

            timeTotal.textContent = `${hoursV+minutesV+secondsV}`;
        }
    },

    scrollAutoTopViewPlaylist() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            });
        }, 1000)
    },

    handleLoadCurrentSong() {
        headerCenter.innerHTML = `<h5 class="header-song-name">${this.currentSong.name}</h5><p class="header-name-artist">${this.currentSong.artist}</p>`;
        cdThumbnail.src = this.currentSong.thumbnail;
        background.style.backgroundImage = `url(${this.currentSong.thumbnail})`;
        audio.src = this.currentSong.audio;
        audio.play()
        this.setLocalStorage("isCurrentIndex", this.isCurrentIndex)
    },

    handleLoadLocalStorage() {
        this.isAutoplay = (this.getLocalStorage.isAutoplay === undefined) ? this.isAutoplay : this.getLocalStorage.isAutoplay;
        this.isPlayBackRate = (this.getLocalStorage.playbackRate === undefined) ? this.isPlayBackRate : this.getLocalStorage.isPlayBackRate;
        this.isRandom = (this.getLocalStorage.isRandom === undefined) ? this.isRandom : this.getLocalStorage.isRandom;
        this.isRepeat = (this.getLocalStorage.isRepeat === undefined) ? this.isRepeat : this.getLocalStorage.isRepeat;
        this.isVolume = (this.getLocalStorage.isVolume === undefined) ? this.isVolume : this.getLocalStorage.isVolume;
        this.isCurrentTime = (this.getLocalStorage.isCurrentTime === undefined) ? this.isCurrentTime : this.getLocalStorage.isCurrentTime;
        this.isCurrentIndex = (this.getLocalStorage.isCurrentIndex === undefined) ? this.isCurrentIndex : this.getLocalStorage.isCurrentIndex;
    },

    start() {
        this.definedProperties();
        this.renderPlaylistMusic();
        this.handleEventsClickSong();
        this.handleLoadCurrentSong();
        this.handleLoadLocalStorage();
        audio.playbackRate = this.isPlayBackRate;
        audio.autoplay = this.isAutoplay;
        audio.volume = (this.isVolume / 100);
        audio.currentTime = this.isCurrentTime;
        autoplay.dataset.autoplay = this.isAutoplay;
        player.classList.toggle("isRepeat", this.isRepeat)
        player.classList.toggle("isRandom", this.isRandom)

    }
};
appMusic.start()
