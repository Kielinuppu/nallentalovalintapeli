document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const huoneImage = document.getElementById('huoneImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');
    const speakerIcon = document.getElementById('speakerIcon');

    // Väitteet ja niiden vastaavat kuvat
    const statements = [
        "MAKUUHUONEESSA NUKUTAAN",     // 0
        "MAKUUHUONEESSA KOKATAAN",     // 1
        "KEITTIÖSSÄ KOKATAAN",         // 2
        "KEITTIÖSSÄ PUETAAN",          // 3
        "ETEISESSÄ PUETAAN",           // 4
        "ETEISESSÄ NUKUTAAN",          // 5
        "VESSASSA KÄYDÄÄN PISSALLA",   // 6
        "VESSASSA KOKATAAN",           // 7
        "OLOHUONEESSA ISTUTAAN SOHVALLA", // 8
        "OLOHUONEESSA KÄYDÄÄN PISSALLA" // 9
    ];

    // Kuvavastaavuudet väitteille
    const imageMap = {
        0: 'Valinta_makuuhuone',
        1: 'Valinta_makuuhuone',
        2: 'Valinta_keittio',
        3: 'Valinta_keittio',
        4: 'Valinta_eteinen',
        5: 'Valinta_eteinen',
        6: 'Valinta_vessa',
        7: 'Valinta_vessa',
        8: 'Valinta_olohuone',
        9: 'Valinta_olohuone'
    };

    // Oikeat väitteet
    const correctStatements = [0, 2, 4, 6, 8];

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function generateQuestions() {
        let questions = [];
        let trueCount = 0;
        
        // Valitaan 2 oikeaa väitettä
        while (trueCount < 2) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
                trueCount++;
            }
        }
        
        // Valitaan 3 väärää väitettä
        while (questions.length < 5) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                !correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function loadQuestionContent(question) {
        const { statementIndex } = question;
        huoneImage.src = `${imageMap[statementIndex]}.png`;
        huoneImage.style.display = 'block';
        this.question.textContent = statements[statementIndex];
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function playQuestionAudio() {
        const { statementIndex } = gameQuestions[currentRound];
        const audioMap = {
            0: 'Valinta_makkari_o',
            1: 'Valinta_makkari_v',
            2: 'Valinta_keittio_o',
            3: 'Valinta_keittio_v',
            4: 'Valinta_eteinen_o',
            5: 'Valinta_eteinen_v',
            6: 'Valinta_vessa_o',
            7: 'Valinta_vessa_v',
            8: 'Valinta_olkkari_o',
            9: 'Valinta_olkkari_v'
        };
        playAudio(`${audioMap[statementIndex]}.mp3`);
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const { statementIndex } = gameQuestions[currentRound];
        const correctAnswer = correctStatements.includes(statementIndex);
        if ((isTrue && correctAnswer) || (!isTrue && !correctAnswer)) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = true;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }
    
    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
    speakerIcon.addEventListener('click', playQuestionAudio);
});