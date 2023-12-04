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
            let Item = dataArray[i];
            console.log(i);

            // หรือให้แสดงข้อมูลบนหน้าเว็บ
            const decks = document.getElementById("innerhtmlflashcard")
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
                        <code id="question">${Item.card_question}</code>
                </pre>
            </div>
            <hr class="style">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 50px; padding-top: 50px;"><ins> Answer </ins></h1>
                </div>
                <div class="col-md-12">
                    <pre class="d-flex justify-content-center text-start">
                        <code id="answer">${Item.card_answer}</code>
                    </pre>
                </div>
            </div>
            `;
            decks.appendChild(deckCol);
            const answerBlock = document.getElementById("answer");
            hljs.highlightElement(answerBlock);
            const btnquestion = document.getElementById("btnnextquestion")
            btnquestion.addEventListener("click", () => {
                i++;
                console.log(i);
                Item = dataArray[i];

                // Update the displayed question and answer
                const questionBlock = document.getElementById("question");
                questionBlock.innerText = Item.card_question;
                answerBlock.innerText = Item.card_answer;

                // Highlight the code
                answerBlock.dataset.highlighted = '';
                hljs.highlightElement(answerBlock);
            });
        } else {
            console.log('ไม่มีข้อมูลใน dataArray');
        }
    })
    .catch(err => console.log(err));



