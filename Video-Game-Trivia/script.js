const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionContainer = document.getElementById('q-container');
const question = document.getElementById('question');
const answersBtns = document.getElementById('answer-buttons');
const difficulty = document.getElementById('difficulty-select');
const numQuestions = document.getElementById('number-select');
const difHeader = document.getElementById('dif-header');
const qHeader = document.getElementById('q-header');
const resContainer = document.getElementById('results-container');
const resText = document.getElementById('results');
const repeatBtn = document.getElementById('repeat-btn');
const commText = document.getElementById('commentary');
let curr,questions,score;
var questionsList;

//Resets game state after completeing game
repeatBtn.addEventListener('click',resetGame);
//Starts game
startBtn.addEventListener('click',startQuiz);
//Moves to next question, if there are no more questions the
//user is directed to the results screen.
nextBtn.addEventListener('click', () => {
  curr++;
  console.log("Current num: "+curr);
  if(curr  == numQuestions.value) {
    console.log("here");
    finisher();
  }else {
    nextQuestion();
  }
})

//Prepares screen for questions
function startQuiz() {
    startBtn.classList.add('hide');
    difficulty.classList.add('hide');
    numQuestions.classList.add('hide');
    difHeader.classList.add('hide');
    qHeader.classList.add('hide');
    console.log(difficulty.value);
    console.log(numQuestions.value);
    score = 0;
    curr = 0;
    questionContainer.classList.remove('hide');
    $(function() {
        $.ajax({
          type:'GET',
          async:false,
          url:'https://opentdb.com/api.php?amount='+ numQuestions.value+'&category=15&difficulty='+difficulty.value+'&type=multiple',
          success:function(data){
            questionsList = data.results;
            console.log("After Data Call:" + questionsList);
            nextQuestion();
          }
        });
    });

}

//Cycles between questions
function nextQuestion() {
  resetState();
  showQuestion(questionsList[curr]);
}

//Shows next question and updates buttons with answers.
function showQuestion(currQuestion) {
  console.log("q:"+currQuestion);
  question.innerText = currQuestion.question;
  var answers = currQuestion.incorrect_answers;
  answers.push(currQuestion.correct_answer);
  console.log(answers);
  answers = shuffle(answers);

  answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer;
    button.classList.add("btn");

    if(answer === currQuestion.correct_answer) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click',selectAnswer)
    answersBtns.appendChild(button);
  });
}

//Shuffles answer array
function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function resetGame(){
  startBtn.classList.remove('hide');
  difficulty.classList.remove('hide');
  numQuestions.classList.remove('hide');
  difHeader.classList.remove('hide');
  qHeader.classList.remove('hide');
  resContainer.classList.add('hide');

}


function resetState() {
  //clearStatusClass(document.body);
  nextBtn.classList.add('hide');
  while (answersBtns.firstChild) {
    answersBtns.removeChild(answersBtns.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  selectedButton.classList.add("selectedButton");
  const correct = selectedButton.dataset.correct;
  updateScore(correct);
  nextBtn.classList.remove('hide');
}


function updateScore(correct) {
  if(correct) {
    score++;
  }
  console.log("Score: "+ score);
}

//Sets up results screen.
function finisher() {
  questionContainer.classList.add('hide');
  nextBtn.classList.add("hide");

  resContainer.classList.remove('hide');
  resText.classList.remove("hide");
  resText.innerText = "You got "+ score + " correct";
  var percent = (score* 1.0) / curr;
  if(percent < 0.5) {
    commText.innerText = "Wow You Suck!"
  }else if( percent >0.5 < 0.8) {
    commText.innerText = "Not Bad"
  }else {
    commText.innerText = "You're Pretty Good!"
  }
  console.log("You got "+ score + "correct");
}
