// HTML 요소 가져오기
const mainTitle = document.getElementById('main-title');
const backButton = document.getElementById('back-button');
const mainCategoryList = document.getElementById('main-category-list');
const subSituationList = document.getElementById('sub-situation-list');
const dialogueList = document.getElementById('dialogue-list');
const subSituationTitle = document.getElementById('sub-situation-title');
const dialogueTitle = document.getElementById('dialogue-title');

// 현재 상태를 저장할 변수
let currentData = null;
let currentMainCategory = null;

// JSON 파일 불러오기
fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        currentData = data.data; // 데이터 저장
        displayMainCategories();
    })
    .catch(error => console.error('Error fetching data:', error));

// 뒤로가기 버튼 클릭 이벤트 (하나의 버튼으로 모든 뒤로가기 처리)
backButton.addEventListener('click', () => {
    if (dialogueList.style.display === 'block') {
        // 대화 목록 -> 서브 상황 목록
        displaySubSituations(currentMainCategory.main_category_title, currentMainCategory.sub_situations);
    } else if (subSituationList.style.display === 'block') {
        // 서브 상황 목록 -> 메인 카테고리 목록
        displayMainCategories();
    }
});

// 메인 카테고리 목록을 보여주는 함수
function displayMainCategories() {
    mainTitle.style.display = 'block';
    backButton.style.display = 'none';
    mainCategoryList.style.display = 'flex';
    subSituationList.style.display = 'none';
    dialogueList.style.display = 'none';

    mainCategoryList.innerHTML = '';
    currentData.forEach(category => {
        const button = document.createElement('button');
        button.className = 'main-category-button';
        button.textContent = category.main_category_title;
        button.addEventListener('click', () => {
            currentMainCategory = category;
            displaySubSituations(category.main_category_title, category.sub_situations);
        });
        mainCategoryList.appendChild(button);
    });
}

// 서브 상황 목록을 보여주는 함수
function displaySubSituations(mainTitle, subSituations) {
    mainTitle.style.display = 'none';
    backButton.style.display = 'block';
    mainCategoryList.style.display = 'none';
    subSituationList.style.display = 'flex';
    dialogueList.style.display = 'none';

    subSituationTitle.textContent = mainTitle;
    subSituationList.innerHTML = '';
    subSituationList.appendChild(subSituationTitle);
    
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
    mainTitle.style.display = 'none';
    backButton.style.display = 'block';
    mainCategoryList.style.display = 'none';
    subSituationList.style.display = 'none';
    dialogueList.style.display = 'block';

    dialogueTitle.textContent = `${mainTitle} - ${subTitle}`;
    dialogueList.innerHTML = '';
    dialogueList.appendChild(dialogueTitle);

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
        hiddenContent.innerHTML = `
            <p class="japanese">${line.japanese}</p>
            <p class="pronunciation">${line.pronunciation}</p>
        `;
        hiddenContent.classList.add('hidden-text');

        dialogueBox.appendChild(koreanContent);
        dialogueBox.appendChild(hiddenContent);

        // 클릭하면 일본어/발음 보여주기/숨기기 토글
        dialogueBox.addEventListener('click', () => {
            dialogueBox.classList.toggle('active');
        });
        dialogueList.appendChild(dialogueBox);
    });
}

// 초기 화면 표시
displayMainCategories();