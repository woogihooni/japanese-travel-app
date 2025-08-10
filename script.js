// HTML 요소 가져오기
const mainCategoryList = document.getElementById('main-category-list');
const subSituationList = document.getElementById('sub-situation-list');
const dialogueList = document.getElementById('dialogue-list');
const dialogueTitle = document.getElementById('dialogue-title');
const startDialogueButton = document.getElementById('start-dialogue-button');
const dialogueContent = document.getElementById('dialogue-content');
const header = document.querySelector('header h1');

// 현재 상태를 저장할 변수
let currentData = null;

// JSON 파일 불러오기
fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        currentData = data.data; // 데이터 저장
        header.textContent = data.app_title;
        displayMainCategories(currentData);
    })
    .catch(error => console.error('Error fetching data:', error));

// 메인 카테고리 목록을 보여주는 함수
function displayMainCategories(categories) {
    mainCategoryList.style.display = 'flex';
    subSituationList.style.display = 'none';
    dialogueList.style.display = 'none';
    mainCategoryList.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'main-category-button';
        button.textContent = category.main_category_title;
        button.addEventListener('click', () => {
            displaySubSituations(category.main_category_title, category.sub_situations);
        });
        mainCategoryList.appendChild(button);
    });
}

// 서브 상황 목록을 보여주는 함수
function displaySubSituations(mainTitle, subSituations) {
    mainCategoryList.style.display = 'none';
    subSituationList.style.display = 'flex';
    dialogueList.style.display = 'none';
    subSituationList.innerHTML = '';
    
    // 뒤로가기 버튼 추가 (서브 상황 목록에서 메인 목록으로)
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '뒤로가기';
    backButton.addEventListener('click', () => {
        displayMainCategories(currentData);
    });
    subSituationList.appendChild(backButton);

    subSituations.forEach(sub => {
        const button = document.createElement('button');
        button.className = 'sub-situation-button';
        button.textContent = sub.title;
        button.addEventListener('click', () => {
            displayDialogue(mainTitle, sub.title, sub.dialogues);
        });
        subSituationList.appendChild(button);
    });
}

// 대화 문장을 보여주는 함수 (새로운 로직)
function displayDialogue(mainTitle, subTitle, dialogues) {
    mainCategoryList.style.display = 'none';
    subSituationList.style.display = 'none';
    dialogueList.style.display = 'block';
    
    // 대화 시작 전 화면
    dialogueTitle.textContent = `${mainTitle} - ${subTitle}`;
    dialogueContent.innerHTML = '';
    startDialogueButton.style.display = 'block';

    // 뒤로가기 버튼 추가
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '뒤로가기';
    backButton.addEventListener('click', () => {
        const selectedMainCategory = currentData.find(cat => cat.main_category_title === mainTitle);
        displaySubSituations(mainTitle, selectedMainCategory.sub_situations);
    });
    dialogueList.insertBefore(backButton, dialogueTitle);
    
    startDialogueButton.onclick = () => {
        startDialogueButton.style.display = 'none';
        dialogueContent.innerHTML = '';
        
        dialogues.forEach(line => {
            const dialogueBox = document.createElement('div');
            dialogueBox.className = 'dialogue-box';

            // 한글 대화 내용만 먼저 표시
            const koreanContent = document.createElement('div');
            koreanContent.innerHTML = `
                <p class="speaker">${line.speaker}</p>
                <hr>
                <p class="korean">${line.korean}</p>
            `;

            // 일본어와 발음은 숨겨진 상태로 추가
            const hiddenContent = document.createElement('div');
            hiddenContent.className = 'hidden';
            hiddenContent.innerHTML = `
                <p class="japanese">${line.japanese}</p>
                <p class="pronunciation">${line.pronunciation}</p>
            `;

            dialogueBox.appendChild(koreanContent);
            dialogueBox.appendChild(hiddenContent);

            // 클릭하면 일본어/발음 보여주기
            dialogueBox.addEventListener('click', () => {
                hiddenContent.classList.remove('hidden');
                // 클릭 후에는 다시 숨기지 않도록 이벤트 리스너 제거
                dialogueBox.style.pointerEvents = 'none';
            });
            dialogueContent.appendChild(dialogueBox);
        });
    };
}