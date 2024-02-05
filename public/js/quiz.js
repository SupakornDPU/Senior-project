const urlParams = new URLSearchParams(window.location.search);
const deckID = urlParams.get('deck')
console.log(deckID);

// Get the deck ID from the URL
let counter = 0;
let i = 0;
fetch('/projectsenior/deck/getByIdQuiz/' + deckID, {
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
        console.log(dataArray);
        if (dataArray.length > 0) {
            let i = 0;
            let j = 0;
            let k = 0;
            const Item = dataArray[i];
            const Choice = Item.quiz_choice;


            console.log(i);
            // ให้แสดงข้อมูลในArray
            console.log(Item);

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
            </div>
            <div class = "row">
                <div class="col-12 mb-5">
                    <p id="quiz" class="hljs" style="font-size: 25px; font-weight: bolder;">${Item.quiz_question}</p>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice1" class="hljs" class="">${Choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice2" class="hljs" class="">${Choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex justify-content-start text-start">
<code id="choice3" class="hljs" class="">${Choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary text-start"><i class="bi bi-4-square-fill"></i>
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

            // Initialize Highlight.js
            // การเตรียมการใช้งานไลบรารี Highlight.js โดยการกำหนดค่าพื้นฐานและตั้งค่าต่าง ๆ เพื่อให้ไลบรารีพร้อมที่จะทำการเน้นไวยากรณ์ของโค้ด (syntax highlighting) ในเว็บไซต์
            hljs.highlightAll();

            const btnquiz = document.getElementById("btnnextquiz");
            btnquiz.addEventListener("click", () => {
                i++;
                let runIdNumber = 0;

                console.log('ค่านับใหม่:', i);
                console.log('ค่านับใหม่:', k);
                console.log('ค่านับใหม่:', runIdNumber);

                const newItem = dataArray[i];
                const Choice = newItem.quiz_choice;
                console.log('ค่านับใหม่:', Choice[0]);
                console.log('ค่านับใหม่:', dataArray[i]);
                // Create new elements for the question and answer
                // สร้างองค์ประกอบ (elements) ใหม่สำหรับคำถาม (question) และคำตอบ (answer) โดยใช้ document.createElement('p')
                // ทั้งสององค์ประกอบถูกสร้างขึ้นและกำหนดค่าต่าง ๆ แล้ว แต่ยังไม่ได้ถูกเพิ่มเข้าไปใน DOM (Document Object Model) ของเว็บ
                const newQuizElement = document.createElement('p');
                newQuizElement.id = 'quiz';
                newQuizElement.innerHTML = newItem.quiz_question;

                const newChoiceElement1 = document.createElement('p');
                newChoiceElement1.id = 'choice1';
                newChoiceElement1.innerHTML = Choice[0];

                const newChoiceElement2 = document.createElement('p');
                newChoiceElement2.id = 'choice2';
                newChoiceElement2.innerHTML = Choice[1];

                const newChoiceElement3 = document.createElement('p');
                newChoiceElement3.id = 'choice3';
                newChoiceElement3.innerHTML = Choice[2];

                const newChoiceElement4 = document.createElement('p');
                newChoiceElement4.id = 'choice4';
                newChoiceElement4.innerHTML = Choice[3];

                // ดึงข้อมูลขององค์ประกอบที่เป็นต้นแบบ (parent elements)"
                // "Parent element" หมายถึง องค์ประกอบที่ต่ำกว่า (ติดต่อกันไป) ในลำดับของโครงสร้าง HTML หรือ DOM (Document Object Model)
                const quizParent = document.getElementById('quiz').parentElement;
                const choiceParent1 = document.getElementById('choice1').parentElement;
                const choiceParent2 = document.getElementById('choice2').parentElement;
                const choiceParent3 = document.getElementById('choice3').parentElement;
                const choiceParent4 = document.getElementById('choice4').parentElement;

                // Replace existing elements with the new ones
                // การนี้มีไว้เพื่อทำการแทนที่ (replace) องค์ประกอบที่มี ID 'question' และ 'answer' ที่อยู่ใน DOM (Document Object Model) ของหน้าเว็บ ด้วยองค์ประกอบใหม่ที่ถูกสร้างขึ้นมา 
                // หลังจากที่การแทนที่เสร็จสิ้น, องค์ประกอบใหม่จะถูกเพิ่มเข้าไปใน DOM และองค์ประกอบเดิมจะถูกลบทิ้ง.
                quizParent.replaceChild(newQuizElement, document.getElementById('quiz'));
                choiceParent1.replaceChild(newChoiceElement1, document.getElementById('choice1'));
                choiceParent2.replaceChild(newChoiceElement2, document.getElementById('choice2'));
                choiceParent3.replaceChild(newChoiceElement3, document.getElementById('choice3'));
                choiceParent4.replaceChild(newChoiceElement4, document.getElementById('choice4'));


                // Apply syntax highlighting to the new elements
                // hljs.highlightElement() จากไลบรารี highlight.js เพื่อให้มีการเน้น (highlight) ไวยากรณ์ของโค้ด (syntax highlighting) บนองค์ประกอบ HTML ที่ถูกสร้างขึ้นใหม่สำหรับคำถามและคำตอบ.
                hljs.highlightElement(newQuizElement);
                hljs.highlightElement(newChoiceElement1);
                hljs.highlightElement(newChoiceElement2);
                hljs.highlightElement(newChoiceElement3);
                hljs.highlightElement(newChoiceElement4);
            });
        } else {
            console.log('ไม่มีข้อมูลใน dataArray');
        }

        // data.flashcard.forEach(each => {
        //     console.log(each);

    })
    .catch(err => console.log(err));



