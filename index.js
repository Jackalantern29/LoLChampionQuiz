// ==UserScript==

let randomChampion;
let randomChampionSkin;

document.getElementById('guess-input').addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        const guess = event.target.value.toLowerCase();
        const championName = randomChampion.toLowerCase();
        if (guess === championName) {
            alert("Correct! The champion was " + randomChampion);
            load();
        } else {
            alert("Incorrect! Try again.");
        }
        event.target.value = ''; // Clear the input field
    }

})

load();

async function load() {
    document.getElementById("patch-version").textContent = await getCurrentLeaguePatch();


    randomChampion = await getRandomChampion();
    randomChampionSkin = await getRandomChampionSkin(randomChampion);
    document.getElementById("champion-image").src = randomChampionSkin;
    // Change the background to match the random champion skin and blur the background
    document.body.style.backgroundImage = `url(${randomChampionSkin})`;
    document.body.style.backgroundSize = "cover";

}

async function getCurrentLeaguePatch() {
    // Get current league patch from https://ddragon.leagueoflegends.com/api/versions.json
    return fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(response => response.json())
        .then(data => {
            return data[0];
        })
        .catch(error => {
            console.error('Error fetching current patch:', error);
            throw error;
        });
}

async function getLeagueChampions() {
    // Get champion roster from https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion.json
    // Then for each champion, store the name of the champion in a new array and return that array. We only need the names.
    return fetch('https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion.json')
        .then(response => response.json())
        .then(data => {
            return Object.values(data.data).map(champion => champion.id);
        })
        .catch(error => {
            console.error('Error fetching champions:', error);
            throw error;
        });
}

async function getChampionSkins(championName) {
    // Get champion skins from https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion.json
    // Then for each champion, store the name of the champion in a new array and return that array. We only need the names.
    return fetch(`https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion/${championName}.json`)
        .then(response => response.json())
        .then(data => {
            return Object.values(data.data)[0].skins.map(skin => championName + "_" + skin.num);
        })
        .catch(error => {
            console.error('Error fetching champions:', error);
            throw error;
        });
}

async function getRandomChampion() {
    // Get a random champion from the list of champions
    const champions = await getLeagueChampions();
    return champions[Math.floor(Math.random() * champions.length)];
}

async function getRandomChampionSkin(championName) {
    // Get a random champion skin from the list of champions and skins
    const skins = await getChampionSkins(championName);
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${randomSkin}.jpg`
}
