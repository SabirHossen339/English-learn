const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      removeActive();
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    })
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }
const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
  <div class="">
          <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : <span
              class="bangla">${word.pronunciation}</span>)</h2>
        </div>
        <div class="">
          <h2 class="font-bold">Meaning</h2>
          <p class="bangla-2">${word.meaning}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Example</h2>
          <p class="">${word.sentence}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Synonym</h2>
                  <div class="">${createElements(word.synonyms)}</div>
        </div>
  `;
  document.getElementById("word_modal").showModal();
}

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";


  if (words.length == 0) {
    wordContainer.innerHTML = `
<div class="text-center col-span-full space-y-4 ">
<img class="mx-auto" src="./assets/alert-error.png" />
      <p class="bangla-2 text-2xl font-medium text-gray-700">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="bangla-2 text-4xl font-bold ">নেক্সট Lesson এ যান</h2>
    </div>

   `;
  }
  //   {
  //     "id": 82,
  //     "level": 1,
  //     "word": "Car",
  //     "meaning": "গাড়ি",
  //     "pronunciation": "কার"
  // }

  words.forEach(word => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
      <h2 class="font-bold text-lg md:text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
      <p class="font-semibold">Meaning/Pronounciation</p>
      <div class="bangla-2 font-medium text-lg md:text-2xl">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>
      <div class="flex justify-between items-center">
        <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
        <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></i></button>
      </div>
    </div>
    `;
    wordContainer.append(card);
  });
};

const displayLesson = (lessons) => {
  // 1. get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2. get into every lessons
  for (let lesson of lessons) {
    // 3. create element
    console.log(lesson)
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `<button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no} </button>`
    // 4. append into container
    levelContainer.append(btnDiv);
  }
};
loadLessons();