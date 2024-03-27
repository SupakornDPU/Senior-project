const urlParams = new URLSearchParams(window.location.search);
const deckID = urlParams.get('deck')
console.log(deckID);

// Get the deck ID from the URL
let counter = 0, play = 0, i = 0, q = 0, q1 = 0, q2 = 0, point = 0, countCorrect = 0, countWrong = 0, correctAnswer = 0, correctAnswer1 = 0, correctAnswer2 = 0;
let correctAnswersArr = [], correctAnswersArr1 = [], wrongAnswers = [], wrongAnswers1 = [], wrongAnswers2 = [];
let answerStats = {};
let selectedAnswer = null;
let sec = 30;

var playcard = localStorage.getItem('selectedPlay');
console.log(playcard);

$step = 1;
$loops = Math.round(100 / $step);
$increment = 360 / $loops;
$half = Math.round($loops / 2);
$barColor = '#343583';
$backColor = '#eff0fe';

var clock = {
    interval: null,
    init: function () {
        $('.input-btn').click(function () {
            switch ($(this).data('action')) {
                case 'start':
                    clock.stop();
                    clock.start();
                    break;
                case 'stop':
                    clock.stop();
                    break;
            }
        });
    },
    start: function (dataArray) {
        var pie = 0;
        var num = 0;
        var min = 0.25; // กำหนดให้นับถอยหลังเริ่มต้นทันทีและใช้ค่าเวลานับถอยหลังเป็น 1 นาที
        var sec = min * 60;
        var lop = sec;
        $('.count').text(min);
        if (min > 0) {
            $('.count').addClass('min')
        } else {
            $('.count').addClass('sec')
        }
        clock.interval = setInterval(function () {
            sec = sec - 1;
            if (min > 1) {
                pie = pie + (100 / (lop / min));
            } else {
                pie = pie + (100 / (lop));
            }
            if (pie >= 101) {
                pie = 1;
            }
            num = (sec / 60).toFixed(2).slice(0, -3);
            if (num == 0) {
                $('.count').removeClass('min').addClass('sec').text(sec);
            } else {
                $('.count').removeClass('sec').addClass('min').text(num);
            }
            //$('.clock').attr('class','clock pro-'+pie.toFixed(2).slice(0,-3));
            //console.log(pie+'__'+sec);
            $i = (pie.toFixed(2).slice(0, -3)) - 1;
            if ($i < $half) {
                $nextdeg = (90 + ($increment * $i)) + 'deg';
                $('.clock').css({ 'background-image': 'linear-gradient(90deg,' + $backColor + ' 50%,transparent 50%,transparent),linear-gradient(' + $nextdeg + ',' + $barColor + ' 50%,' + $backColor + ' 50%,' + $backColor + ')' });
            } else {
                $nextdeg = (-90 + ($increment * ($i - $half))) + 'deg';
                $('.clock').css({ 'background-image': 'linear-gradient(' + $nextdeg + ',' + $barColor + ' 50%,transparent 50%,transparent),linear-gradient(270deg,' + $barColor + ' 50%,' + $backColor + ' 50%,' + $backColor + ')' });
            }
            if (sec == 0) {
                clearInterval(clock.interval);
                $('.count').text(0);
                //$('.clock').removeAttr('class','clock pro-100');
                $('.clock').removeAttr('style');
                
                console.log(dataArray.quiz_answerCorrect
                );
                wrongAnswers.push(dataArray);
                console.log('คำตอบผิด!');
                point--;
                countWrong++;
                if (answerStats[dataArray.flashcard_id] === undefined) {
                    answerStats[dataArray.flashcard_id] = -1;
                } else {
                    answerStats[dataArray.flashcard_id]--;
                }
                console.log(answerStats);
            }
        }, 1000);
    },
    stop: function () {
        clearInterval(clock.interval);
        $('.count').text(0);
        $('.clock').removeAttr('style');
    }
};

function startCountdown(dataArray) {
    console.log(dataArray)
    if (sec > 0) {
        console.log(dataArray)
        clock.start(dataArray);
    } else {
        if (selectedAnswer === null) {
            // ถ้าไม่มีการเลือกคำตอบใด ๆ ให้ถือว่าเป็นการตอบผิด
            timeUpAction(dataArray);
        } else {
            alert('Time Up!'); // แจ้งเตือนเมื่อเวลาหมด
            // ทำสิ่งที่ต้องการหลังจากเวลาหมดตามที่คุณต้องการ
            clock.stop(); // เริ่มการนับถอยหลังใหม่
        }
    }
}

// // เวลาที่กำหนดไว้ (หน่วยเป็นวินาที)
// const totalTimeInSeconds = 5; // 5 นาที

// let timeLeft = totalTimeInSeconds;

// // แสดงเวลานับถอยหลัง
// function displayTime() {
//     console.log(timeLeft);
//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;
//     const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     document.getElementById("timer").textContent = formattedTime;
// }

// function updateTime(dataArray) {
//     timeLeft--; // ลดเวลาที่เหลือลงทุกๆ 1 วินาที
//     if (timeLeft >= 0) {
//         displayTime(); // แสดงเวลาที่เหลือ
//     } else {
//         clearInterval(countdownInterval); // หยุดการนับถอยหลังเมื่อเวลาหมด
//         if (selectedAnswer === null) {
//             // ถ้าไม่มีการเลือกคำตอบใด ๆ ให้ถือว่าเป็นการตอบผิด
//             timeUpAction(dataArray);
//         } else {
//             alert('Time Up!'); // แจ้งเตือนเมื่อเวลาหมด
//             // ทำสิ่งที่ต้องการหลังจากเวลาหมดตามที่คุณต้องการ
//             startCountdown(); // เริ่มการนับถอยหลังใหม่
//         }
//     }
// }

// function startCountdown(dataArray) {
//     let initialTime = 0 ;
//     initialTime = timeLeft; // กำหนดค่าเวลาเริ่มต้นใหม่
//     displayTime(initialTime); 
//     countdownInterval = setInterval(() => {
//         updateTime(dataArray);
//     }, 1000);
// }

function timeUpAction(dataArray) {
    // เพิ่มโค้ดเพื่อจัดการกรณีที่เวลาหมดแล้วไม่มีการเลือกคำตอบ
    wrongAnswers.push(dataArray[correctAnswer]);
    console.log('คำตอบผิด!');
    point--;
    countWrong++;
}

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

        if (playcard < dataArray.length) {
            dataArray.splice(playcard); // ตัดตำแหน่งที่มากกว่า playcard ออก
        }
        console.log(dataArray);
        // Sort dataArray by stat
        dataArray.sort((a, b) => a.stat - b.stat);

        startCountdown(dataArray[i]);

        if (dataArray.length > 0) {
            const Item = dataArray[i];
            const Choice = Item.quiz_choice;

            const decks = document.getElementById("innerhtmlQuiz");
            decks.innerHTML = '';
            const deckCol = document.createElement('div');
            deckCol.className = 'row justify-content-end';
            deckCol.innerHTML = `
            <div class="col-3" style="width: fit-content;" ">
                <div class="clock-wrap">
                    <div class="clock pro-0">
                         <span class="count" style="color: #000000;">0</span>
                    </div>
                 </div>
                </div>
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
                    <code id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Item.quiz_question}</code>
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
                if (selectedAnswer === null) {
                    // ถ้ายังไม่ได้เลือกคำตอบให้เพิ่ม Animation ให้กับปุ่มที่ไม่ได้เลือก 
                    const btnWrappers = document.getElementsByClassName('btn-wrapper');
                    for (let i = 0; i < btnWrappers.length; i++) {
                        const btnWrapper = btnWrappers[i];
                        const button = btnWrapper.querySelector('button');
                        if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                            btnWrapper.classList.add('animate__bounceIn');
                            setTimeout(() => {
                                btnWrapper.classList.remove('animate__bounceIn');
                            }, 500);
                        }
                    }
                    return; // ไม่ต้องดำเนินการต่อไปหากยังไม่มีการเลือกคำตอบ
                }
                if (i >= dataArray.length - 1) {
                    // หากถึงจุดสิ้นสุดของ array ข้อความที่ตอบผิดจะถูกแสดง
                    if (wrongAnswers.length > 0) {
                        // console.log('แสดงข้อความที่ตอบผิดอีกรอบ');
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
                    clock.start();
                    const newItem = dataArray[i];
                    const Choice = newItem.quiz_choice;

                    const newQuizElement = document.createElement('code');
                    newQuizElement.style = 'font-size: 25px; font-weight: bolder;';
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
                selectedAnswer = null;
            });
        } else {
            console.log('ไม่มีข้อมูลใน dataArray');
        }
    })
    .catch(err => console.log(err));

function callbackwrongAnswers(wrongAnswers) {
    // สร้างอาร์เรย์เพื่อเก็บ flashcard_id ของคำถามที่ตอบผิด
    const wrongFlashcardIds = wrongAnswers.map(wrongAnswer => wrongAnswer.flashcard_id);

    let currentIndex = 0; // เพิ่มตัวแปรเพื่อเก็บ index ปัจจุบันของ wrongAnswers
    let currentIndexQuiz = 0;
    const decks = document.getElementById("innerhtmlQuiz");
    // console.log(wrongFlashcardIds);

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
            if (wrongAnswers1.length > 0) {
                // นำ correctAnswersArr1 ไปต่อท้าย wrongAnswers
                wrongAnswers1.push(...correctAnswersArr1);
                callbackwrongAnswers2(wrongAnswers1);
            } else {
                console.log('Finish');
                console.log(point);
                alert('Finish');
                displayScore(point, countCorrect, countWrong);
                return;
            }
        } else {
            const Item = wrongQuiz[q];
            console.log(q);
            // console.log(wrongQuiz);
            displayQuiz(Item);

        }
    }

    // wrongQuiz
    function displayQuiz(Quizdata) {
        startCountdown(Quizdata);
        let selectedAnswer = false;
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        const deckCol = document.createElement('div');
        deckCol.className = 'row justify-content-end';
        deckCol.innerHTML = `
                <div class="col-3" style="width: fit-content;" ">
                    <div class="clock-wrap">
                        <div class="clock pro-0">
                            <span class="count" style="color: #000000;">0</span>
                        </div>
                    </div>
                </div>
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
                    <code id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Quizdata.quiz_question}</code>
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
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            if (checkAnswerSelected()) {
                q++;
                displayNextQuiz(wrongAnswers);
            } else {
                const btnWrappers = document.getElementsByClassName('btn-wrapper');
                for (let i = 0; i < btnWrappers.length; i++) {
                    const btnWrapper = btnWrappers[i];
                    const button = btnWrapper.querySelector('button');
                    if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                        btnWrapper.classList.add('animate__bounceIn');
                        setTimeout(() => {
                            btnWrapper.classList.remove('animate__bounceIn');
                        }, 500);
                    }
                }
            }
        });

        // เพิ่ม event listener ให้กับปุ่ม Choice เพื่อตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        const choices = document.querySelectorAll(".answer-block button");
        choices.forEach(choice => {
            choice.addEventListener("click", () => {
                selectedAnswer = true; // เมื่อผู้ใช้เลือกคำตอบแล้วกำหนดค่า selectedAnswer เป็น true
            });
        });

        // เพิ่มฟังก์ชันตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        function checkAnswerSelected() {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            return selectedAnswer;
        }
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
    selectedAnswer = buttonId;
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

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;
            if (selectedChoice === answerCorrect) {
                console.log('คำตอบถูกต้อง!');
                point += 3;
                countCorrect++;
                clock.stop();
                if (answerStats[item.flashcard_id] === undefined) {
                    answerStats[item.flashcard_id] = 1;
                } else {
                    answerStats[item.flashcard_id]++;
                }
                console.log(answerStats);

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
                console.log(item);
                console.log('คำตอบผิด!');
                point--;
                countWrong++;
                clock.stop();
                if (answerStats[item.flashcard_id] === undefined) {
                    answerStats[item.flashcard_id] = -1;
                } else {
                    answerStats[item.flashcard_id]--;
                }
                console.log(answerStats);

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
    selectedAnswer = buttonId;
    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;
            // console.log('คำตอบที่ถูกต้องคือ:', answerCorrect);
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;


            if (selectedChoice === answerCorrect) {
                console.log('คำตอบถูกต้อง!');
                point += 3;
                countCorrect++;
                clock.stop();
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = 1;
                } else {
                    answerStats[data.flashcard_id]++;
                }
                console.log(answerStats);

                correctAnswersArr1.push(data);
                // console.log('correctAnswersArr : ', correctAnswersArr);
                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                wrongAnswers1.push(data);
                console.log('คำตอบผิด!');
                point -= 0.5;
                countWrong++;
                clock.stop();
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = -1;
                } else {
                    answerStats[data.flashcard_id]--;
                }
                console.log(answerStats);

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

async function displayScore(point, countCorrect, countWrong) {
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

    // Api Update Stats
    try {
        const response = await fetch('/projectsenior/flashcard/stat', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answerStats)
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }

    // Api get deckID
    try {
        const response = await fetch('/api/deck/ById/' + deckID, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        const btnNextdone = document.getElementById("btnNextdone");
        btnNextdone.addEventListener("click", () => {
            window.location = "deck?classroomID=" + data.classroom_id;
        });
    } catch (err) {
        console.log(err);
    }

}

///////////////////////////////////////////////// WrongaAswerRound 2 ////////////////////////////////////////////////////////

function callbackwrongAnswers2(wrongAnswers1) {
    // สร้างอาร์เรย์เพื่อเก็บ flashcard_id ของคำถามที่ตอบผิด
    const wrongFlashcardIds = wrongAnswers1.map(wrongAnswers1 => wrongAnswers1.flashcard_id);
    // console.log(wrongFlashcardIds);

    let currentIndex = 0; // เพิ่มตัวแปรเพื่อเก็บ index ปัจจุบันของ wrongAnswers
    const decks = document.getElementById("innerhtmlQuiz");

    function displayNextFlashcard2() {
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
                    displayFlashcard2(data);

                    currentIndex++; // เพิ่ม index สำหรับการดึงข้อมูล flashcard ถัดไป
                })
                .catch(err => console.log(err));
        } else {
            console.log('ไม่มีข้อมูลใน wrongAnswers แล้ว');
            displayNextQuiz2(wrongAnswers1);
        }
    }

    // wrongQuiz
    function displayNextQuiz2(wrongQuiz2) {

        if (q1 >= wrongQuiz2.length) {

            if (wrongAnswers1.length > 0) {
                callbackwrongAnswers3(wrongAnswers2);
            } else {
                console.log('Finish');
                console.log(point);
                alert('Finish');
                displayScore(point, countCorrect, countWrong);
                return;
            }

        } else {
            const Item = wrongQuiz2[q1];
            displayQuiz2(Item);

        }
    }

    // wrongQuiz
    function displayQuiz2(Quizdata2) {
        startCountdown(Quizdata2);
        let selectedAnswer = false;
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        const deckCol = document.createElement('div');
        deckCol.className = 'row justify-content-end';
        deckCol.innerHTML = `
                <div class="col-3" style="width: fit-content;" ">
                    <div class="clock-wrap">
                        <div class="clock pro-0">
                            <span class="count" style="color: #000000;">0</span>
                        </div>
                    </div>
                </div>
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
                    <code id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Quizdata2.quiz_question}</code>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice1" onclick="checkAnswersWrongAnswer1('btnChoice1', '${Quizdata2._id}')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice1" class="hljs" class="">${Quizdata2.quiz_choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice2" onclick="checkAnswersWrongAnswer1('btnChoice2','${Quizdata2._id}')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice2" class="hljs" class="">${Quizdata2.quiz_choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice3" onclick="checkAnswersWrongAnswer1('btnChoice3','${Quizdata2._id}')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice3" class="hljs" class="">${Quizdata2.quiz_choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice4" onclick="checkAnswersWrongAnswer1('btnChoice4','${Quizdata2._id}')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice4" class="hljs" class="">${Quizdata2.quiz_choice[3]}</code>
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
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            if (checkAnswerSelected()) {
                q1++;
                displayNextQuiz2(wrongAnswers1);
            } else {
                const btnWrappers = document.getElementsByClassName('btn-wrapper');
                for (let i = 0; i < btnWrappers.length; i++) {
                    const btnWrapper = btnWrappers[i];
                    const button = btnWrapper.querySelector('button');
                    if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                        btnWrapper.classList.add('animate__bounceIn');
                        setTimeout(() => {
                            btnWrapper.classList.remove('animate__bounceIn');
                        }, 500);
                    }
                }
            }
        });

        // เพิ่ม event listener ให้กับปุ่ม Choice เพื่อตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        const choices = document.querySelectorAll(".answer-block button");
        choices.forEach(choice => {
            choice.addEventListener("click", () => {
                selectedAnswer = true; // เมื่อผู้ใช้เลือกคำตอบแล้วกำหนดค่า selectedAnswer เป็น true
            });
        });

        // เพิ่มฟังก์ชันตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        function checkAnswerSelected() {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            return selectedAnswer;
        }
    }

    function displayFlashcard2(flashcardData) {
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
        btnNextQuestion.addEventListener("click", displayNextFlashcard2);
    }

    // แสดง flashcard แรก
    displayNextFlashcard2();
}

function checkAnswersWrongAnswer1(buttonId, Quizdata) {

    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;
            // console.log('คำตอบที่ถูกต้องคือ:', answerCorrect);

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;

            if (selectedChoice === answerCorrect) {
                console.log('คำตอบถูกต้อง!');
                point += 3;
                countCorrect++;
                clock.stop();
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = 1;
                } else {
                    answerStats[data.flashcard_id]++;
                }

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
                clock.stop();
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = -1;
                } else {
                    answerStats[data.flashcard_id]--;
                }

                wrongAnswers2.push(data);
                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
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

///////////////////////////////////////////////// WrongaAswerRound 3 ////////////////////////////////////////////////////////

function callbackwrongAnswers3(wrongAnswers2) {
    let wrongFlashcardIds = wrongAnswers2.map(wrongAnswers2 => wrongAnswers2.flashcard_id);
    console.log("wrongFlashcardIds : ", wrongFlashcardIds);
    let currentIndex = 0;
    const decks = document.getElementById("innerhtmlQuiz");

    function displayNextFlashcard3() {
        wrongFlashcardIds = wrongAnswers2.map(wrongAnswers => wrongAnswers.flashcard_id);
        if (currentIndex < wrongFlashcardIds.length) {
            const currentFlashcardId = wrongFlashcardIds[currentIndex];

            fetch('/projectsenior/flashcard/getByIds/' + currentFlashcardId, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    displayFlashcard3(data);
                    currentIndex++;
                })
                .catch(err => console.log(err));
        } else {
            console.log('ไม่มีข้อมูลใน wrongAnswers แล้ว');
            displayNextQuiz3(wrongAnswers2);
        }
    }

    // wrongQuiz
    function displayNextQuiz3(wrongQuiz3) {
        if (q2 >= wrongQuiz3.length) {
            console.log('Finish');
            console.log(point);
            alert('Finish');
            displayScore(point, countCorrect, countWrong);
            return;

        } else {
            const Item = wrongQuiz3[q2];
            // console.log(q2);
            // console.log(wrongQuiz3);
            displayQuiz3(Item);
        }
    }

    // wrongQuiz
    function displayQuiz3(Quizdata3) {
        startCountdown(Quizdata3);
        let selectedAnswer = false;
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        const deckCol = document.createElement('div');
        deckCol.className = 'row justify-content-end';
        deckCol.innerHTML = `
                <div class="col-3" style="width: fit-content;" ">
                    <div class="clock-wrap">
                        <div class="clock pro-0">
                            <span class="count" style="color: #000000;">0</span>
                        </div>
                    </div>
                </div>
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
                    <code id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Quizdata3.quiz_question}</code>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice1" onclick="checkAnswersWrongAnswer2('btnChoice1', '${Quizdata3._id}')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice1" class="hljs" class="">${Quizdata3.quiz_choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice2" onclick="checkAnswersWrongAnswer2('btnChoice2','${Quizdata3._id}')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice2" class="hljs" class="">${Quizdata3.quiz_choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice3" onclick="checkAnswersWrongAnswer2('btnChoice3','${Quizdata3._id}')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice3" class="hljs" class="">${Quizdata3.quiz_choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start" id="btnChoice4" onclick="checkAnswersWrongAnswer2('btnChoice4','${Quizdata3._id}')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice4" class="hljs" class="">${Quizdata3.quiz_choice[3]}</code>
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
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            if (checkAnswerSelected()) {
                q2++;
                displayNextFlashcard3();
            } else {
                const btnWrappers = document.getElementsByClassName('btn-wrapper');
                for (let i = 0; i < btnWrappers.length; i++) {
                    const btnWrapper = btnWrappers[i];
                    const button = btnWrapper.querySelector('button');
                    if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                        btnWrapper.classList.add('animate__bounceIn');
                        setTimeout(() => {
                            btnWrapper.classList.remove('animate__bounceIn');
                        }, 500);
                    }
                }
            }
        });

        // เพิ่ม event listener ให้กับปุ่ม Choice เพื่อตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        const choices = document.querySelectorAll(".answer-block button");
        choices.forEach(choice => {
            choice.addEventListener("click", () => {
                selectedAnswer = true; // เมื่อผู้ใช้เลือกคำตอบแล้วกำหนดค่า selectedAnswer เป็น true
            });
        });

        // เพิ่มฟังก์ชันตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        function checkAnswerSelected() {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            return selectedAnswer;
        }
    }

    function displayFlashcard3(flashcardData2) {
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
                    <code id="question" class="hljs">${flashcardData2.card_question}</code>
                </pre>
            </div>
            <hr class="style">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 50px; padding-top: 50px;"><ins> Answer </ins></h1>
                </div>
                <div class="col-md-12">
                    <pre class="d-flex justify-content-center text-start">
                        <code id="answer" class="hljs">${flashcardData2.card_answer}</code>
                    </pre>
                </div>
            </div>
            `;
        decks.appendChild(deckCol);
        hljs.highlightAll();

        const btnNextQuestion = document.getElementById("btnnextquestion");
        btnNextQuestion.addEventListener("click", () => {
            console.log('Function displayNextQuiz3 Inside function');
            displayNextQuiz3(wrongAnswers2);
        });
    }
    console.log('Function displayNextQuiz3 Outside function');
    displayNextQuiz3(wrongAnswers2);
}

function checkAnswersWrongAnswer2(buttonId, Quizdata) {
    // console.log(Quizdata);

    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;

            if (selectedChoice === answerCorrect) {
                console.log('คำตอบถูกต้อง!');
                point += 3;
                countCorrect++;
                clock.stop();
                // Answer Stat
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = 1;
                } else {
                    answerStats[data.flashcard_id]++;
                }

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
                clock.stop();
                // play++;

                // Answer Stat
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = -1;
                } else {
                    answerStats[data.flashcard_id]--;
                }

                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
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
                wrongAnswers2.push(data);
                wrongFlashcardIds = wrongAnswers2.map(wrongAnswers => wrongAnswers.flashcard_id);
                // updatePlayDisplay();
            }
            console.log(answerStats);
            answered = true;
        })
        .catch(err => console.log(err));
}

// function updatePlayDisplay() {
//     const playElement = document.getElementById('play-value');
//     playElement.textContent = play;
// }