const urlParams = new URLSearchParams(window.location.search);
const deckID = urlParams.get('deck')
console.log(deckID);

// Get the deck ID from the URL
let counter = 0;
let i = 0;
fetch('/projectsenior/deck/getById/' + deckID, {
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})
  .then(response => response.json())
  .then(data => {

    const dataArray = [];

    // เพิ่มข้อมูลลงใน array ด้วย forEach
    data.flashcards.forEach(each => {
      dataArray.push(each);
    });

    // หรือใช้ spread operator เพื่อเพิ่มข้อมูลใน array
    console.log(dataArray);
    if (dataArray.length > 0) {
      let i = 0;
      const Item = dataArray[i];
      console.log(i);
      // ให้แสดงข้อมูลในArray
      console.log(Item);

      // หรือให้แสดงข้อมูลบนหน้าเว็บ
      const decks = document.getElementById("innerhtmlflashcard");
      decks.innerHTML = '';
      const deckCol = document.createElement('div');
      deckCol.className = 'row  d-flex justify-content-center align-items-center text-center inline';
      deckCol.innerHTML = `
        <div class="row justify-content-end">
            <div class="col-3" style="width: fit-content;" ">
                <a id="btnnextquestion" class="button btn btn-lg btn-next">
                <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                    <path
                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg><br>Next
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 50px;"><ins> Question</ins></h1>
            </div>
            <pre class="d-flex justify-content-center text-start">
                <code id="question" class="hljs">${Item.card_question}</code>
            </pre>
        </div>
        <hr class="style">
        <div class="row">
            <div class="col-md-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 50px; padding-top: 50px;"><ins> Answer </ins></h1>
            </div>
            <div class="col-md-12">
                <pre class="d-flex justify-content-center text-start">
                    <code id="answer" class="hljs">${Item.card_answer}</code>
                </pre>
            </div>
        </div>
        `;
      decks.appendChild(deckCol);

      // Initialize Highlight.js
      // การเตรียมการใช้งานไลบรารี Highlight.js โดยการกำหนดค่าพื้นฐานและตั้งค่าต่าง ๆ เพื่อให้ไลบรารีพร้อมที่จะทำการเน้นไวยากรณ์ของโค้ด (syntax highlighting) ในเว็บไซต์
      hljs.highlightAll();

      const btnquestion = document.getElementById("btnnextquestion");
      btnquestion.addEventListener("click", () => {
        if (i >= dataArray.length - 1) {
          console.log('Quiz');
          window.location.href = "quiz?deck=" + deckID;
          return;
      } else {
        i++;
        console.log('ค่านับใหม่:', i);

        const newItem = dataArray[i];

        // Create new elements for the question and answer
        // สร้างองค์ประกอบ (elements) ใหม่สำหรับคำถาม (question) และคำตอบ (answer) โดยใช้ document.createElement('p')
        // ทั้งสององค์ประกอบถูกสร้างขึ้นและกำหนดค่าต่าง ๆ แล้ว แต่ยังไม่ได้ถูกเพิ่มเข้าไปใน DOM (Document Object Model) ของเว็บ
        const newQuestionElement = document.createElement('p');
        newQuestionElement.id = 'question';
        newQuestionElement.innerHTML = newItem.card_question;

        const newAnswerElement = document.createElement('p');
        newAnswerElement.id = 'answer';
        newAnswerElement.innerHTML = newItem.card_answer;

        // ดึงข้อมูลขององค์ประกอบที่เป็นต้นแบบ (parent elements)"
        // "Parent element" หมายถึง องค์ประกอบที่ต่ำกว่า (ติดต่อกันไป) ในลำดับของโครงสร้าง HTML หรือ DOM (Document Object Model)
        const questionParent = document.getElementById('question').parentElement;
        const answerParent = document.getElementById('answer').parentElement;

        // Replace existing elements with the new ones
        // การนี้มีไว้เพื่อทำการแทนที่ (replace) องค์ประกอบที่มี ID 'question' และ 'answer' ที่อยู่ใน DOM (Document Object Model) ของหน้าเว็บ ด้วยองค์ประกอบใหม่ที่ถูกสร้างขึ้นมา 
        // หลังจากที่การแทนที่เสร็จสิ้น, องค์ประกอบใหม่จะถูกเพิ่มเข้าไปใน DOM และองค์ประกอบเดิมจะถูกลบทิ้ง.
        questionParent.replaceChild(newQuestionElement, document.getElementById('question'));
        answerParent.replaceChild(newAnswerElement, document.getElementById('answer'));

        // Apply syntax highlighting to the new elements
        // hljs.highlightElement() จากไลบรารี highlight.js เพื่อให้มีการเน้น (highlight) ไวยากรณ์ของโค้ด (syntax highlighting) บนองค์ประกอบ HTML ที่ถูกสร้างขึ้นใหม่สำหรับคำถามและคำตอบ.
        hljs.highlightElement(newQuestionElement);
        hljs.highlightElement(newAnswerElement);
      }
      });

    } else {
      console.log('ไม่มีข้อมูลใน dataArray');
    }

    // data.flashcard.forEach(each => {
    //     console.log(each);

  })
  .catch(err => console.log(err));



