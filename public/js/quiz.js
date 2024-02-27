const urlParams = new URLSearchParams(window.location.search);
const deckID = urlParams.get('deck')
console.log(deckID);

// Get the deck ID from the URL
let counter = 0;
let i = 0;
let q = 0;
let point = 0;
let countCorrect = 0;
let countWrong = 0;
let correctAnswer = 0;
let wrongAnswers = [];
let correctAnswersArr = [];
let wrongAnswers1 = [];

fetch('/api/deck/getByIdQuiz/' + deckID, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(data => {

        const dataArray = [];
        // เพิ่มข้อมูลลงใน array ด้วย forEach
        data.quizzes.forEach(each => {
            dataArray.push(each);
        });

        // หรือใช้ spread operator เพื่อเพิ่มข้อมูลใน array
        // console.log(dataArray);
        if (dataArray.length > 0) {
            const Item = dataArray[i];
            const Choice = Item.quiz_choice;


            // console.log(i);
            // ให้แสดงข้อมูลในArray
            // console.log(Item);

            // หรือให้แสดงข้อมูลบนหน้าเว็บ
            const decks = document.getElementById("innerhtmlQuiz");
            decks.innerHTML = '';
            const deckCol = document.createElement('div');
            deckCol.className = 'row justify-content-end';
            deckCol.innerHTML = `
                <div class="col-3" style="width: fit-content;" ">
                    <a id="btnnextquiz" class="button btn btn-lg btn-next">
                    <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                        <path
                            d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                    </svg><br>Next
                    </a>
                </div>
            <div class = "row">
                <div class="col-12 mb-5">
                    <p id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Item.quiz_question}</p>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice1" onclick="checkAnswer('btnChoice1')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice1" class="hljs" class="">${Choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice2" onclick="checkAnswer('btnChoice2')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice2" class="hljs" class="">${Choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice3" onclick="checkAnswer('btnChoice3')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice3" class="hljs" class="">${Choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice4" onclick="checkAnswer('btnChoice4')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice4" class="hljs" class="">${Choice[3]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            `;
            decks.appendChild(deckCol);
            hljs.highlightAll();

            const btnquiz = document.getElementById("btnnextquiz");
            btnquiz.addEventListener("click", () => {
                if (i >= dataArray.length - 1) {
                    // หากถึงจุดสิ้นสุดของ array ข้อความที่ตอบผิดจะถูกแสดง
                    if (wrongAnswers.length > 0) {
                        console.log('แสดงข้อความที่ตอบผิดอีกรอบ');
                        console.log(wrongAnswers);
                        // นำ correctAnswersArr ไปต่อท้าย wrongAnswers
                        wrongAnswers.push(...correctAnswersArr);
                        callbackwrongAnswers(wrongAnswers);
                    } else {
                        alert('Finish');
                        displayScore(point, countCorrect, countWrong);
                        return;
                    }
                } else {
                    i++;
                    correctAnswer++;

                    const newItem = dataArray[i];
                    const Choice = newItem.quiz_choice;

                    const newQuizElement = document.createElement('code');
                    newQuizElement.id = 'quiz';
                    newQuizElement.innerHTML = newItem.quiz_question;

                    const newChoiceElement1 = document.createElement('code');
                    newChoiceElement1.id = 'choice1';
                    newChoiceElement1.innerHTML = Choice[0];

                    const newChoiceElement2 = document.createElement('code');
                    newChoiceElement2.id = 'choice2';
                    newChoiceElement2.innerHTML = Choice[1];

                    const newChoiceElement3 = document.createElement('code');
                    newChoiceElement3.id = 'choice3';
                    newChoiceElement3.innerHTML = Choice[2];

                    const newChoiceElement4 = document.createElement('code');
                    newChoiceElement4.id = 'choice4';
                    newChoiceElement4.innerHTML = Choice[3];

                    const quizParent = document.getElementById('quiz').parentElement;
                    const choiceParent1 = document.getElementById('choice1').parentElement;
                    const choiceParent2 = document.getElementById('choice2').parentElement;
                    const choiceParent3 = document.getElementById('choice3').parentElement;
                    const choiceParent4 = document.getElementById('choice4').parentElement;

                    quizParent.replaceChild(newQuizElement, document.getElementById('quiz'));
                    choiceParent1.replaceChild(newChoiceElement1, document.getElementById('choice1'));
                    choiceParent2.replaceChild(newChoiceElement2, document.getElementById('choice2'));
                    choiceParent3.replaceChild(newChoiceElement3, document.getElementById('choice3'));
                    choiceParent4.replaceChild(newChoiceElement4, document.getElementById('choice4'));

                    hljs.highlightElement(newQuizElement);
                    hljs.highlightElement(newChoiceElement1);
                    hljs.highlightElement(newChoiceElement2);
                    hljs.highlightElement(newChoiceElement3);
                    hljs.highlightElement(newChoiceElement4);
                    // Clear class btn active
                    for (let j = 0; j <= 4; j++) {
                        const btnChoice = document.getElementById(`btnChoice${j}`);
                        if (btnChoice) {
                            if (btnChoice.classList.contains('btn')) {
                                btnChoice.classList.remove('active');
                                btnChoice.classList.remove('btn-success');
                                btnChoice.classList.remove('btn-danger');
                                btnChoice.disabled = false;

                            }
                        }

                    }

                }
            });
        } else {
            console.log('ไม่มีข้อมูลใน dataArray');
        }
    })
    .catch(err => console.log(err));

function callbackwrongAnswers(wrongAnswers) {
    console.log('แสดง Flashcards ที่ตอบผิดอีกครั้ง');

    // สร้างอาร์เรย์เพื่อเก็บ flashcard_id ของคำถามที่ตอบผิด
    const wrongFlashcardIds = wrongAnswers.map(wrongAnswer => wrongAnswer.flashcard_id);
    console.log(wrongFlashcardIds);

    let currentIndex = 0; // เพิ่มตัวแปรเพื่อเก็บ index ปัจจุบันของ wrongAnswers
    let currentIndexQuiz = 0;
    const decks = document.getElementById("innerhtmlQuiz");

    function displayNextFlashcard() {
        if (currentIndex < wrongFlashcardIds.length) {
            const currentFlashcardId = wrongFlashcardIds[currentIndex];

            // ดึงข้อมูล Flashcards จากเซิร์ฟเวอร์โดยใช้ currentFlashcardId
            fetch('/projectsenior/flashcard/getByIds/' + currentFlashcardId, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    // แสดงข้อมูลของ flashcard
                    displayFlashcard(data);

                    currentIndex++; // เพิ่ม index สำหรับการดึงข้อมูล flashcard ถัดไป
                })
                .catch(err => console.log(err));
        } else {
            console.log('ไม่มีข้อมูลใน wrongAnswers แล้ว');
            displayNextQuiz(wrongAnswers);
        }
    }

    // wrongQuiz
    function displayNextQuiz(wrongQuiz) {

        if (q >= wrongQuiz.length) {
            // หากถึงจุดสิ้นสุดของ array ข้อความที่ตอบผิดจะถูกแสดง

            console.log('Finish');
            console.log(point);
            alert('Finish');
            displayScore(point, countCorrect, countWrong);
            return;

        } else {
            const Item = wrongQuiz[q];
            console.log(q);
            console.log(wrongQuiz);
            displayQuiz(Item);

        }
    }

    // wrongQuiz
    function displayQuiz(Quizdata) {
        console.log(Quizdata);
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        const deckCol = document.createElement('div');
        deckCol.className = 'row justify-content-end';
        deckCol.innerHTML = `
                <div class="col-3" style="width: fit-content;" ">
                    <a id="btnnextquiz" class="button btn btn-lg btn-next">
                    <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                        <path
                            d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                    </svg><br>Next
                    </a>
                </div>
            <div class = "row">
                <div class="col-12 mb-5">
                    <p id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Quizdata.quiz_question}</p>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice1" onclick="checkAnswersWrongAnswer('btnChoice1', '${Quizdata._id}')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice1" class="hljs" class="">${Quizdata.quiz_choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice2" onclick="checkAnswersWrongAnswer('btnChoice2','${Quizdata._id}')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice2" class="hljs" class="">${Quizdata.quiz_choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice3" onclick="checkAnswersWrongAnswer('btnChoice3','${Quizdata._id}')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice3" class="hljs" class="">${Quizdata.quiz_choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice4" onclick="checkAnswersWrongAnswer('btnChoice4','${Quizdata._id}')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice4" class="hljs" class="">${Quizdata.quiz_choice[3]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            `;
        decks.appendChild(deckCol);
        hljs.highlightAll();
        const btnquiz = document.getElementById("btnnextquiz");
        btnquiz.addEventListener("click", () => {
            q++;
            displayNextQuiz(wrongAnswers);
        });


    }

    function displayFlashcard(flashcardData) {
        // สร้าง HTML เพื่อแสดง Flashcard
        decks.innerHTML = '';

        const deckCol = document.createElement('div');
        deckCol.className = 'row  d-flex justify-content-center align-items-center text-center inline';
        deckCol.innerHTML = `
            <div class="row justify-content-end">
                <div class="col-3" style="width: fit-content;" ">
                    <button id="btnnextquestion" class="button btn btn-lg btn-next">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                            <path
                                d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                        </svg><br>Next
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 50px;"><ins> Question</ins></h1>
                </div>
                <pre class="d-flex justify-content-center text-start">
                    <code id="question" class="hljs">${flashcardData.card_question}</code>
                </pre>
            </div>
            <hr class="style">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 50px; padding-top: 50px;"><ins> Answer </ins></h1>
                </div>
                <div class="col-md-12">
                    <pre class="d-flex justify-content-center text-start">
                        <code id="answer" class="hljs">${flashcardData.card_answer}</code>
                    </pre>
                </div>
            </div>
            `;
        decks.appendChild(deckCol);
        hljs.highlightAll();

        // เพิ่ม event listener ให้กับปุ่ม Next
        const btnNextQuestion = document.getElementById("btnnextquestion");
        btnNextQuestion.addEventListener("click", displayNextFlashcard);
    }

    // แสดง flashcard แรก
    displayNextFlashcard();
}

function checkAnswer(buttonId) {

    fetch('/api/deck/getByIdQuiz/' + deckID, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const dataArray = data.quizzes;
            const item = dataArray[correctAnswer];
            const answerCorrect = item.quiz_answerCorrect;
            console.log('คำตอบที่ถูกต้องคือ:', answerCorrect);

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;
            // console.log(selectedChoice);

            // เปรียบเทียบคำตอบที่ผู้ใช้เลือกกับคำตอบที่ถูกต้อง
            if (selectedChoice === answerCorrect) {
                console.log('คำตอบถูกต้อง!');
                point += 3;
                countCorrect++;
                correctAnswersArr.push(item);
                // ทำอะไรก็ตามที่ต้องการเมื่อเลือกคำตอบถูกต้อง
                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                wrongAnswers.push(item);
                console.log('คำตอบผิด!');
                point--;
                countWrong++;
                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
                // เพิ่มคลาส 'btn-success' ให้กับปุ่มที่เป็นคำตอบที่ถูกต้อง
                const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                    document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                        document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                            document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                if (correctButton) {
                    correctButton.classList.add('btn-success');
                    for (let i = 1; i <= 4; i++) {
                        const btnChoice = document.getElementById(`btnChoice${i}`);
                        btnChoice.disabled = true;
                    }
                    document.getElementById('btnnextquiz').disabled = false;
                }
            }

            answered = true;
        })
        .catch(err => console.log(err));
}

function checkAnswersWrongAnswer(buttonId, Quizdata) {

    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;
            console.log('คำตอบที่ถูกต้องคือ:', answerCorrect);

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;
            // console.log(selectedChoice);

            // เปรียบเทียบคำตอบที่ผู้ใช้เลือกกับคำตอบที่ถูกต้อง
            if (selectedChoice === answerCorrect) {
                console.log('คำตอบถูกต้อง!');
                point += 3;
                countCorrect++;
                // ทำอะไรก็ตามที่ต้องการเมื่อเลือกคำตอบถูกต้อง
                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                console.log('คำตอบผิด!');
                point -= 0.5;
                countWrong++;
                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
                // เพิ่มคลาส 'btn-success' ให้กับปุ่มที่เป็นคำตอบที่ถูกต้อง
                const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                    document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                        document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                            document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                if (correctButton) {
                    correctButton.classList.add('btn-success');
                    for (let i = 1; i <= 4; i++) {
                        const btnChoice = document.getElementById(`btnChoice${i}`);
                        btnChoice.disabled = true;
                    }
                    document.getElementById('btnnextquiz').disabled = false;
                }
            }

            answered = true;
        })
        .catch(err => console.log(err));
}

function displayScore(point, countCorrect, countWrong) {
    const score = document.getElementById("innerhtmlQuiz");
    score.innerHTML = '';
    const scoreCol = document.createElement('div');
    scoreCol.className = 'container';
    scoreCol.innerHTML = `
            <div class="row justify-content-end">
                <div class="col-3" style="width: fit-content;" ">
                    <button id="btnNextdone" class="button btn btn-lg btn-next">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                            <path
                                d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                        </svg><br>Next
                    </button>
                </div>
            </div>
            <div class="text-center" style="border-radius: 15px; padding: 2rem;background-color: #f5f5f5;height: 550px;">
                <h1 class="font-poppin fw-bold">Your Score</h1>
                <h2 class="font-poppin fw-medium">${point}</h2>
                <div class="row justify-content-center align-items-center text-center p-lg-5">
                    <div class="col-6" style="border: 2px solid black;border-radius: 10px 0px 0px 10px;">
                        <h2 class="font-poppin fw-bold">Correct</h2>
                        <h3 class="font-poppin fw-medium">${countCorrect}</h3>
                    </div>
                    <div class="col-6" style="border: 2px solid black;border-radius: 0px 10px 10px 0px;">
                        <h2 class="font-poppin fw-bold">Wrong</h2>
                        <h3 class="font-poppin fw-medium">${countWrong}</h3>
                    </div>
                </div>
            </div>
            `;
    score.appendChild(scoreCol);

    fetch('/api/deck/ById/' + deckID, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const btnNextdone = document.getElementById("btnNextdone");
            btnNextdone.addEventListener("click", () => {
                window.location = "deck?classroomID=" + data.classroom_id;
            });
        })
        .catch(err => console.log(err));

}

