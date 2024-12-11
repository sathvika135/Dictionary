const input = document.querySelector('.search-form input');
const btn = document.querySelector('.search-form button');
const dictionaryArea = document.querySelector('.dictionary-app');

async function dictionaryFn(word) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    return data[0];
}

btn.addEventListener('click', fetchandCreateCard);

async function fetchandCreateCard() {
    const word = input.value.trim();

    if (!word) {
        alert("Please enter a word to search.");
        return;
    }

    const data = await dictionaryFn(word);

    if (!data) {
        alert("Word not found.");
        return;
    }

    let partOfSpeechArray = [];
    let phonetics = data.phonetic || "Not available";
    let audioSrc = data.phonetics && data.phonetics.length > 0 ? data.phonetics[0].audio : "";

    if (data.meanings && data.meanings.length > 0) {
        for (let i = 0; i < data.meanings.length; i++) {
            partOfSpeechArray.push(data.meanings[i].partOfSpeech);
        }
    }

    let meaningsHTML = '';
    let examplesHTML = '';

    if (data.meanings && data.meanings.length > 0) {
        for (let i = 0; i < data.meanings.length; i++) {
            const meaning = data.meanings[i];
            meaningsHTML += `<div class="property">
                                <span class="property-title">Meaning:</span>
                                <span>${meaning.definitions[0].definition}</span>
                             </div>`;

            if (meaning.definitions[0].example) {
                examplesHTML += `<div class="property">
                                    <span class="property-title">Example:</span>
                                    <span>${meaning.definitions[0].example}</span>
                                 </div>`;
            }
        }
    }

    dictionaryArea.innerHTML = `
    <div class="card">
        <div class="property">
            <span class="property-title">Word:</span>
            <span>${data.word}</span>
        </div>

        <div class="property">
            <span class="property-title">Phonetics:</span>
            <span>${phonetics}</span>
        </div>

        <div class="property">
            <span class="property-title">Audio:</span>
            <audio controls src="${audioSrc}"></audio>
        </div>

        ${meaningsHTML}

        ${examplesHTML}

        <div class="property">
            <span class="property-title">Parts of Speech:</span>
            <span>${partOfSpeechArray.length > 0 ? partOfSpeechArray.join(', ') : "Not available"}</span>
        </div>
    </div>
    `;

    dictionaryArea.style.display = "block";
}
