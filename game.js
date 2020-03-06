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
  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.textContent = "Play game!";

  const nameInputLabel = document.createElement('div');
  nameInputLabel.textContent = 'Enter your name: ';

  const nameInput = document.createElement('input');

  gameContent.appendChild(header);
  gameContent.appendChild(nameInputLabel);
  nameInputLabel.appendChild(nameInput);
  gameContent.appendChild(btn);
  nameInput.addEventListener('input', event => {
    stateUpdate({
      name: event.target.value
    })
  })
  btn.addEventListener('click', () => {
    stateUpdate({
      activeView: 'play',
      selectedLetters: [],
      secretPhrase: randomPhrase(),
      mistake: 0
    });
  });

  setTimeout(() => {
    nameInput.value = gameState.name;
    nameInput.focus();
  }, 0)
}

function playView() {
  header.textContent = `Hi, ${gameState.name}`;

  const againBtn = document.createElement('button');
  const alpDiv = document.createElement('div');

  const phraseLettersContainer = document.createElement('div');
  phraseLettersContainer.setAttribute('id', 'phraseContainer');
  const mistakeContainer = document.createElement('div');
  mistakeContainer.setAttribute('id', 'mistakeContainer');

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
    alpDiv.appendChild(letterButton);
  })

  mistakeContainer.textContent = `Ilość błędów: ${gameState.mistake}`

  againBtn.textContent = 'Give up!';

  gameContent.appendChild(header);
  gameContent.appendChild(againBtn);
  gameContent.appendChild(alpDiv);
  gameContent.appendChild(phraseLettersContainer);
  gameContent.appendChild(mistakeContainer);
  if (visibleLetters === gameState.secretPhrase.length || gameState.mistake === 8) {
    stateUpdate({
      activeView: 'endGame'
    })
  }
  againBtn.addEventListener('click', () => {
    stateUpdate({
      activeView: 'endGame'
    });
  })
}

function endGameView() {
  gameState.mistake === 8 ? header.textContent = 'Game finished! You looose' : header.textContent = 'Game finished! You win';
  const countMistake = document.createElement('h3');
  const againBtn = document.createElement('button');

  againBtn.textContent = 'Play again';
  countMistake.textContent = `Popełniłeś ${gameState.mistake} błędów`


  gameContent.appendChild(header);
  gameContent.appendChild(countMistake);
  gameContent.appendChild(againBtn);
  againBtn.addEventListener('click', () => {
    stateUpdate({
      activeView: 'welcome'
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