const gameContent =document.getElementById('gameContent');
gameContent.textContent='';

const alphabet=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u', 'v', 'w', 'x', 'y', 'z'];
const base = ["roza",'gwiezdne wojny','jurrasic park'];

function randomPhrase(){
    const phraseIndex=Math.floor(Math.random()*base.length);
    return base[phraseIndex];
};


gameState={
    name:'',
    activeView:'welcome',
    selectedLetters:[],
    secretPhrase:'',
    mistake:0
};

const header =document.createElement('h1');

function createAlphabet(){};

function stateUpdate(newGameState){
    Object.assign(gameState,newGameState);
    render();
}

function welcomeView(){
    header.textContent="Welcome to Hangman!";
    const btn =document.createElement('button');
    btn.classList.add('btn');
    btn.textContent="Play game!";
    
    const nameInputLabel= document.createElement('div');
    nameInputLabel.textContent='Enter your name: ';
    
    const nameInput= document.createElement('input');
    
    nameInput.addEventListener('input',event=>{
        stateUpdate({name:event.target.value})
    })
    btn.addEventListener('click',()=>{
        stateUpdate({activeView:'play',
        selectedLetters:[],
        secretPhrase:randomPhrase()});
    });
    
    setTimeout(()=>{
        nameInput.value=gameState.name;
        nameInput.focus();
    },0)
    
    gameContent.appendChild(header);
    gameContent.appendChild(nameInputLabel);
    nameInputLabel.appendChild(nameInput);
    gameContent.appendChild(btn);
}

function playView(){
    header.textContent=`Hi, ` + gameState.name;
    
    const againBtn =document.createElement('button');
    const alpDiv =document.createElement('div');

    const phraseLettersContainer = document.createElement('div');
    phraseLettersContainer.setAttribute('id','phraseContainer');
    
    let visibleLetters=0;
    const phraseLetters =gameState.secretPhrase.split("");

    phraseLetters.forEach((phraseLetter)=>{
        const phraseLetterSpan = document.createElement('span');
        phraseLetterSpan.textContent=phraseLetter;
        const phraseLetterVisible = phraseLetter === ' ' || gameState.selectedLetters.includes(phraseLetter);

        if(phraseLetterVisible) {visibleLetters++};
        
        phraseLetterSpan.textContent = phraseLetterVisible ? phraseLetter : '*';
        phraseLettersContainer.appendChild(phraseLetterSpan);
    })


    for (let i=0;i<alphabet.length;i++){
        const letterButton =document.createElement('button');
        const letter= alphabet[i];
        letterButton.classList.add('letters')
        letterButton.textContent=letter;
        letterButton.disabled=gameState.selectedLetters.includes(letter);

        letterButton.addEventListener('click',()=>{
            stateUpdate({ selectedLetters:gameState.selectedLetters.concat(letter)});
            const mistakes =gameState.secretPhrase.includes(letter);
            console.log(mistakes);
            
        })

        alpDiv.appendChild(letterButton);
    }
    
    againBtn.textContent='Give up!';
    againBtn.addEventListener('click',(event)=>{
        stateUpdate({activeView:'endGame'});
    })
    
    if(visibleLetters===gameState.secretPhrase.length){
        stateUpdate({
            activeView:'endGame',
            selectedLetters:[]})
    }
    gameContent.appendChild(header);
    gameContent.appendChild(againBtn);
    gameContent.appendChild(alpDiv);
    gameContent.appendChild(phraseLettersContainer);
}

function endGameView(){
    header.textContent='Game finished!';
    gameContent.appendChild(header);

    const againBtn =document.createElement('button');
    againBtn.textContent='Play again';
    gameContent.appendChild(againBtn);
    againBtn.addEventListener('click',()=>{
        stateUpdate({activeView:'welcome'});
    })
}

function render(){
    gameContent.textContent='';
    if (gameState.activeView==='welcome'){
        welcomeView();
    } else if (gameState.activeView==='play'){
        playView();
    } else {
        endGameView();
    }
};
render();

