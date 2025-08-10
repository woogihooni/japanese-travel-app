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
        displayMainCategories(); // 데이터 로드 완료 후 함수 호출
    })
    .catch(error => console.error('Error fetching data:', error));

// 뒤로가기 버튼 클릭 이벤트 (하나의 버튼으로 모든 뒤로가기 처리)
backButton.addEventListener('click', () => {
    if (dialogueList.style.display === 'block') {
        // 대화 목록 -> 서브 상황 목록
        displaySubSituations(currentMainCategory.main_category_title, currentMainCategory.sub_situations);
    } else if (subSituationList.style.display === 'flex') {
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
    if (currentData) {
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
}

// 서브 상황 목록을 보여주는 함수
function displaySubSituations(mainTitleText, subSituations) {
    mainTitle.style.display = 'none';
    backButton.style.display = 'block';
    mainCategoryList.style.display = 'none';
    subSituationList.style.display = 'flex';
    dialogueList.style.display = 'none';

    subSituationTitle.textContent = mainTitleText;
    subSituationList.innerHTML = '';
    subSituationList.appendChild(subSituationTitle);
    
    subSituations.forEach(sub => {
        const button = document.createElement('button');
        button.className = 'sub-situation-button';
        button.textContent = sub.title;
        button.addEventListener('click', () => {
            displayDialogue(mainTitleText, sub.title, sub.dialogues);
        });
        subSituationList.appendChild(button);
    });
}

// 대화 문장을 보여주는 함수 (수정된 로직)
function displayDialogue(mainTitleText, subTitle, dialogues) {
    mainTitle.style.display = 'none';
    backButton.style.display = 'block';
    mainCategoryList.style.display = 'none';
    subSituationList.style.display = 'none';
    dialogueList.style.display = 'block';

    dialogueTitle.textContent = `${mainTitleText} - ${subTitle}`;
    dialogueList.innerHTML = '';
    dialogueList.appendChild(dialogueTitle);

    dialogues.forEach(line => {
        const dialogueBox = document.createElement('div');
        dialogueBox.className = 'dialogue-box';

        // 원문 텍스트를 data 속성에 저장
        dialogueBox.dataset.originalKorean = line.korean;
        dialogueBox.dataset.originalJapanese = line.japanese;
        dialogueBox.dataset.originalPronunciation = line.pronunciation;

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
        
        dialogueBox.appendChild(koreanContent);
        dialogueBox.appendChild(hiddenContent);

        // 클릭하면 일본어/발음 보여주기/숨기기 토글
        dialogueBox.addEventListener('click', () => {
            dialogueBox.classList.toggle('active');
        });
        
        // 대체 단어 기능 추가
        if (line.replacements && line.replacements.length > 0) {
            const replacementsContainer = document.createElement('div');
            replacementsContainer.className = 'replacements-container';
            
            const firstReplacement = line.replacements[0];
            
            firstReplacement.alternatives.forEach((alt, altIndex) => {
                const button = document.createElement('button');
                button.className = 'replacement-button';
                button.textContent = alt;
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // 대화 박스의 클릭 이벤트 전파 방지
                    
                    const koreanEl = dialogueBox.querySelector('.korean');
                    const japaneseEl = dialogueBox.querySelector('.japanese');
                    const pronunciationEl = dialogueBox.querySelector('.pronunciation');

                    const currentButtons = replacementsContainer.querySelectorAll('.replacement-button');

                    // 이미 선택된 버튼을 다시 클릭하면 원문으로 돌아가도록 처리
                    if (button.classList.contains('selected')) {
                        koreanEl.textContent = dialogueBox.dataset.originalKorean;
                        japaneseEl.textContent = dialogueBox.dataset.originalJapanese;
                        pronunciationEl.textContent = dialogueBox.dataset.originalPronunciation;
                        currentButtons.forEach(btn => btn.classList.remove('selected'));
                    } else {
                        // 교체 로직
                        const target = firstReplacement.target;
                        const japaneseTarget = firstReplacement.japanese_alternatives[0];
                        const pronunciationTarget = firstReplacement.pronunciation_alternatives[0];

                        const newKorean = line.korean.replace(target, alt);
                        const newJapanese = line.japanese.replace(japaneseTarget, firstReplacement.japanese_alternatives[altIndex]);
                        const newPronunciation = line.pronunciation.replace(pronunciationTarget, firstReplacement.pronunciation_alternatives[altIndex]);
                        
                        koreanEl.textContent = newKorean;
                        japaneseEl.textContent = newJapanese;
                        pronunciationEl.textContent = newPronunciation;
                        
                        currentButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                    }
                });
                replacementsContainer.appendChild(button);
            });
            dialogueBox.appendChild(replacementsContainer);
        }
        
        dialogueList.appendChild(dialogueBox);
    });
}

// 초기 화면 표시
displayMainCategories();