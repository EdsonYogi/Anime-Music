function animeList() {
  let year = document.querySelector('.year')
  let season = document.querySelector('.seasons')
  const animeTitle = document.querySelector('.titleAnime')
  const animeImg = document.querySelector('.animeImg')
  const animeOpening = document.querySelector('.opening .info')
  const animeEnding = document.querySelector('.ending .info')
  const backwardAnime = document.querySelector('.backwardAnime')
  const forwardAnime = document.querySelector('.forwardAnime')
  
  let i = -1
  let memoSeason = season.value
  let memoDirection

  backwardAnime.addEventListener('click', initBackwardAnime)

  function initBackwardAnime() {
    if(i > 0) {
      i -= 1
      memoDirection = 'Backward'
      initAnimeList()
    }
  }

  forwardAnime.addEventListener('click', initForwardAnime)

  function initForwardAnime() {
    i += 1
    memoDirection = 'Forward'
    initAnimeList()
  }
  
  function initAnimeList() {
    fetch(`https://api.jikan.moe/v3/season/${year.value}/${season.value}`)
    .then(response => response.json())
    .then(result => {
      const animesList = result.anime
      if(memoSeason == season.value) {
        if(animesList[i].type == 'TV') {
          const image = animesList[i].image_url
          const title = animesList[i].title
          const animeID = animesList[i].mal_id
          initAnimeInfo(animeID, image, title)
          console.log(i)
          console.log(animesList[i])
        }
      } else {
        memoSeason = season.value
        i = 0
        initAnimeList()
      }
    });
  }

  function initAnimeInfo(animeID, image, title) {
    fetch(`https://api.jikan.moe/v3/anime/${animeID}/`)
    .then(response => response.json())
    .then(info => {
      if(info.opening_themes.length > 0  || info.ending_themes.length > 0) {
        let opening = info.opening_themes
        let ending = info.ending_themes
        initAnimeContent(opening, ending, image, title)
      } else if(memoDirection == 'Backward') {
        i -= 1
        initAnimeList()
      } else if(memoDirection == 'Forward') {
        i += 1
        initAnimeList()
      }
    });
  }

  function initAnimeContent(opening, ending, image, title) {
    animeImg.setAttribute('src', image)
    animeTitle.innerHTML = title
    animeOpening.innerHTML = opening
    animeEnding.innerHTML = ending
  }
}

animeList()