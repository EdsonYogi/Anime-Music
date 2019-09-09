const animeOpening = document.querySelector('.opening .info')
const animeEnding = document.querySelector('.ending .info')  
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
  if(memoSeasons == seasons.value && memoYear == year.value) {
    if(n > 0) {
      n = n - 1
      memoDirection = 'Previous'
      getAnimeID()
    }
  } else {
    onSeasons()
  }
}

nextAnime.addEventListener('click', onNextAnime)
function onNextAnime() {
  if(memoSeasons == seasons.value && memoYear == year.value) {
    n = n + 1
    memoDirection = 'Next'
    getAnimeID()
  } else {
    onSeasons()
  }
}


function onSeasons() {
  n = 0
  memoYear = year.value
  memoSeasons = seasons.value
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
  animeTitle.innerText = title
  animeImage.setAttribute('src', image)
  animeOpening.innerText = opening
  animeEnding.innerText = ending
}