const gameContent = document.getElementById('gameContent');

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const base = ["roza", 'gwiezdne wojny', 'jurrasic park'];

function randomPhrase() {
  const phraseIndex = Math.floor(Math.random() * base.length);
  return base[phraseIndex];
};

const storedGame = localStorage.getItem('gameState')

const gameState = storedGame ? JSON.parse(storedGame) : {
  name: '',
  activeView: 'welcome',
  selectedLetters: [],
  secretPhrase: '',
  mistake: 0
};

const header = document.createElement('h1');

function stateUpdate(newGameState) {
  Object.assign(gameState, newGameState);
  localStorage.setItem('gameState', JSON.stringify(gameState))
  render();
}

function welcomeView() {
  header.textContent = "Welcome to Hangman!";

  const nameInput = document.createElement('input');
  nameInput.placeholder = 'Enter your name'

  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.textContent = "Play game!";

  gameContent.appendChild(header);
  gameContent.appendChild(nameInput);
  gameContent.appendChild(btn);


  btn.addEventListener('click', () => {
    stateUpdate({
      activeView: 'play',
      name: nameInput.value,
      selectedLetters: [],
      secretPhrase: randomPhrase(),
      mistake: 0,
      surrender: false
    });
  });
}

function playView() {
  header.textContent = `Hi, ${gameState.name}`;

  const againBtn = document.createElement('button');
  const image = document.createElement('img');
  image.src = "img/00.png"
  gameContent.appendChild(image);
  const alpDiv = document.createElement('div');
  alpDiv.setAttribute('id', 'alphabhetContainer')

  const phraseLettersContainer = document.createElement('div');
  phraseLettersContainer.setAttribute('id', 'phraseContainer');
  const mistakeContainer = document.createElement('div');
  // mistakeContainer.setAttribute('id', 'mistakeContainer');
  mistakeContainer.id = "mistakeContainer"

  let visibleLetters = 0;
  const phraseLetters = gameState.secretPhrase.split("");

  phraseLetters.forEach(phraseLetter => {
    const phraseLetterSpan = document.createElement('span');
    phraseLetterSpan.textContent = phraseLetter;
    const phraseLetterVisible = phraseLetter === ' ' || gameState.selectedLetters.includes(phraseLetter);

    if (phraseLetterVisible) {
      visibleLetters++
    };

    phraseLetterSpan.textContent = phraseLetterVisible ? phraseLetter : '_';
    phraseLettersContainer.appendChild(phraseLetterSpan);
  })


  alphabet.forEach(letter => {
    const letterButton = document.createElement('button');
    letterButton.classList.add('letters')
    letterButton.textContent = letter;
    letterButton.disabled = gameState.selectedLetters.includes(letter);

    letterButton.addEventListener('click', () => {
      const mistakes = !gameState.secretPhrase.includes(letter);

      stateUpdate({
        selectedLetters: gameState.selectedLetters.concat(letter),
        mistake: mistakes ? gameState.mistake + 1 : gameState.mistake
      });
    })
    image.src = `img/0${gameState.mistake}.png`;
    alpDiv.appendChild(letterButton);
  })

  mistakeContainer.textContent = `Ilość błędów: ${gameState.mistake}`

  againBtn.textContent = 'Give up!';

  gameContent.appendChild(header);
  gameContent.appendChild(againBtn);
  gameContent.appendChild(alpDiv);
  gameContent.appendChild(phraseLettersContainer);
  gameContent.appendChild(mistakeContainer);
  if (visibleLetters === gameState.secretPhrase.length || gameState.mistake === 9) {
    stateUpdate({
      activeView: 'endGame'
    })
  }
  againBtn.addEventListener('click', () => {
    stateUpdate({
      activeView: 'endGame',
      surrender: true
    });
  })
}

function endGameView() {
  if (gameState.mistake === 9) {
    header.innerHTML = `Game finished! You looose!!!`
  } else if (gameState.surrender) {
    header.textContent = `Did you gave up?`
  } else {
    header.textContent = `You win`
  }
  // gameState.mistake === 9 ?  : header.textContent = 'Game finished! You win';
  const countMistake = document.createElement('h3');
  const againBtn = document.createElement('button');
  const correctAns = document.createElement('p');

  correctAns.textContent = `Correct answer is: ${gameState.secretPhrase}`
  againBtn.textContent = 'Play again';
  countMistake.textContent = `You've made ${gameState.mistake} mistakes`
  console.log(gameState.surrender)

  gameContent.appendChild(header);
  gameContent.appendChild(correctAns);
  gameContent.appendChild(countMistake);
  gameContent.appendChild(againBtn);
  againBtn.addEventListener('click', () => {
    stateUpdate({
      activeView: 'welcome',
      surrender: false
    });
  })
}

function render() {
  gameContent.textContent = '';
  if (gameState.activeView === 'welcome') {
    welcomeView();
  } else if (gameState.activeView === 'play') {
    playView();
  } else {
    endGameView();
  }
};
render();