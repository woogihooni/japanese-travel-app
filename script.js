// HTML 요소 가져오기
const categoryList = document.getElementById('category-list');
const phraseList = document.getElementById('phrase-list');

// JSON 파일 불러오기
fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        // 데이터 로드 성공 후 카테고리 표시
        displayCategories(data.data);
    })
    .catch(error => console.error('Error fetching data:', error));

// 카테고리 목록을 화면에 보여주는 함수
function displayCategories(categories) {
    categoryList.innerHTML = ''; // 기존 내용 지우기
    phraseList.innerHTML = ''; // 문장 목록도 지우기

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category.category_title;
        button.addEventListener('click', () => {
            displayPhrases(category.phrases);
        });
        categoryList.appendChild(button);
    });
}

// 회화 문장을 화면에 보여주는 함수
function displayPhrases(phrases) {
    categoryList.style.display = 'none'; // 카테고리 버튼 숨기기
    phraseList.innerHTML = ''; // 기존 내용 지우기

    // 뒤로가기 버튼 추가
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '뒤로가기';
    backButton.addEventListener('click', () => {
        location.reload(); // 새로고침으로 처음 화면으로 돌아가기
    });
    phraseList.appendChild(backButton);

    phrases.forEach(phrase => {
        const card = document.createElement('div');
        card.className = 'phrase-card';

        const koreanText = document.createElement('p');
        koreanText.className = 'korean';
        koreanText.textContent = phrase.korean;

        const japaneseText = document.createElement('p');
        japaneseText.className = 'japanese';
        japaneseText.textContent = phrase.japanese;
        
        const pronunciationText = document.createElement('p');
        pronunciationText.className = 'pronunciation';
        pronunciationText.textContent = phrase.pronunciation;

        // 클릭하면 일본어 텍스트가 클립보드에 복사되는 기능 추가
        card.addEventListener('click', () => {
            navigator.clipboard.writeText(phrase.japanese)
                .then(() => {
                    alert('일본어 문장이 복사되었습니다.');
                })
                .catch(err => {
                    console.error('클립보드 복사 실패:', err);
                });
        });

        card.appendChild(koreanText);
        card.appendChild(japaneseText);
        card.appendChild(pronunciationText);
        phraseList.appendChild(card);
    });
}