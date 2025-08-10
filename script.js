// HTML 요소 가져오기
const mainCategoryList = document.getElementById('main-category-list');
const subSituationList = document.getElementById('sub-situation-list');
const dialogueList = document.getElementById('dialogue-list');
const header = document.querySelector('header h1');

// JSON 파일 불러오기
fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        header.textContent = data.app_title;
        displayMainCategories(data.data);
    })
    .catch(error => console.error('Error fetching data:', error));

// 메인 카테고리 목록을 보여주는 함수
function displayMainCategories(categories) {
    mainCategoryList.innerHTML = '';
    subSituationList.innerHTML = '';
    dialogueList.innerHTML = '';

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
    subSituationList.innerHTML = '';
    dialogueList.innerHTML = '';

    // 뒤로가기 버튼 추가
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '뒤로가기';
    backButton.addEventListener('click', () => {
        location.reload();
    });
    subSituationList.appendChild(backButton);

    subSituations.forEach(sub => {
        const button = document.createElement('button');
        button.className = 'sub-situation-button';
        button.textContent = sub.title;
        button.addEventListener('click', () => {
            displayDialogue(sub.dialogues);
        });
        subSituationList.appendChild(button);
    });
}

// 대화 문장을 보여주는 함수
function displayDialogue(dialogues) {
    subSituationList.style.display = 'none';
    dialogueList.innerHTML = '';

    // 뒤로가기 버튼 추가 (대화 목록에서 서브 상황 목록으로)
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '뒤로가기';
    backButton.addEventListener('click', () => {
        // 새로고침 대신 서브 상황 목록으로 돌아가는 로직 추가 가능
        location.reload(); // 일단은 간단하게 새로고침으로 구현
    });
    dialogueList.appendChild(backButton);

    dialogues.forEach(line => {
        const card = document.createElement('div');
        card.className = 'dialogue-card';

        const speaker = document.createElement('p');
        speaker.className = 'speaker';
        speaker.textContent = line.speaker;

        const koreanText = document.createElement('p');
        koreanText.className = 'korean';
        koreanText.textContent = line.korean;

        const japaneseText = document.createElement('p');
        japaneseText.className = 'japanese';
        japaneseText.textContent = line.japanese;
        
        const pronunciationText = document.createElement('p');
        pronunciationText.className = 'pronunciation';
        pronunciationText.textContent = line.pronunciation;

        // 클릭하면 일본어 텍스트가 클립보드에 복사되는 기능 추가
        card.addEventListener('click', () => {
            navigator.clipboard.writeText(line.japanese)
                .then(() => {
                    alert('일본어 문장이 복사되었습니다.');
                })
                .catch(err => {
                    console.error('클립보드 복사 실패:', err);
                });
        });

        card.appendChild(speaker);
        card.appendChild(koreanText);
        card.appendChild(japaneseText);
        card.appendChild(pronunciationText);
        dialogueList.appendChild(card);
    });
}