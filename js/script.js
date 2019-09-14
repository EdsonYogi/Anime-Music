const animeMusic = document.querySelector('.info')
const search = document.querySelector('.searchMusic')
const animeImage = document.querySelector('.animeImg')
const animeTitle = document.querySelector('.titleAnime')
const previousAnime = document.querySelector('.backwardAnime')
const nextAnime = document.querySelector('.forwardAnime')
let year = document.querySelector('.year')
let seasons = document.querySelector('.seasons')
let animeList
let memoDirection
let memoSeasons
let memoYear
let n = 0

previousAnime.addEventListener('click', onPreviousAnime)
function onPreviousAnime() {
    if(n > 0) {
      n = n - 1
      memoDirection = 'Previous'
      onCleanerOptions()
      getAnimeID()
    }
}

nextAnime.addEventListener('click', onNextAnime)
function onNextAnime() {
    n = n + 1
    memoDirection = 'Next'
    onCleanerOptions()
    getAnimeID()
}

function onCleanerOptions() {
  animeMusic.querySelectorAll('option').forEach((item) => {
    item.remove()
  })
}

seasons.addEventListener('change', onSeasons)
year.addEventListener('change', onSeasons)

function onSeasons() {
  n = 0
  memoYear = year.value
  memoSeasons = seasons.value
  onCleanerOptions()
  getAnimeList()
}

onSeasons()

function getAnimeList() {
  fetch(`https://api.jikan.moe/v3/season/${memoYear}/${memoSeasons}`)
  .then(response => response.json())
  .then(animes => {
    animeList = animes.anime
    getAnimeID()
  });
}

function getAnimeID() {
  const id = animeList[n].mal_id
  getAnimeInfo(id)
}

function getAnimeInfo(id) {
   fetch(`https://api.jikan.moe/v3/anime/${id}/`)
  .then(response => response.json())
  .then(animeInfo => {
    if(animeInfo.opening_themes.length > 0  || animeInfo.ending_themes.length > 0) {
      const image = animeInfo.image_url
      const title = animeInfo.title
      const opening = animeInfo.opening_themes
      const ending = animeInfo.ending_themes
      setAnimeInfo(image, title, opening, ending)
    } else if(memoDirection == 'Previous') {
      if(n > 0) {
        n -= 1
        getAnimeID()
      }
    } else if(memoDirection == 'Next') {
      n+= 1
      getAnimeID()
    }
  });
}

function setAnimeInfo(image, title, opening, ending) {
  let option

  animeTitle.innerText = title
  animeImage.setAttribute('src', image) 

  opening.forEach((item) => {
    option = document.createElement('option')
    let info = item.split('by')
    let song = info[0].split('"')
    song = song[1]
    let artist 
    artist = info[1].split(' (ep')
    artist = artist[0]
    option.text = `${artist} - ${song}`
    animeMusic.appendChild(option)
  })

  ending.forEach((item) => {
    option = document.createElement('option')
    let info = item.split('by')
    let song = info[0].split('"')
    song = song[1]
    let artist 
    artist = info[1].split(' (ep')
    artist = artist[0]
    option.text = `${artist} - ${song}`
    animeMusic.appendChild(option)
  })
}

search.addEventListener('click', onSearchMusic)

function onSearchMusic() {
  if(animeMusic.value) {
    animeMusic.classList.remove('noSelected')
    window.open(`https://music.youtube.com/search?q=${animeMusic.value}`, '_blank');
  } else {
    animeMusic.classList.add('noSelected')
    alert('Um item da lista deve ser selecionada!')
  }
}