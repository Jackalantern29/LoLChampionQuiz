// ==UserScript==

let randomChampion;
let randomChampionSkin;
let currentPatch;

document.getElementById('guess-input').addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        let guess = event.target.value.toLowerCase();
        const championName = randomChampion.toLowerCase();

        if (formatChampionToChampID(guess).toLowerCase() === championName.toLowerCase()) {
            alert("Correct! The champion was " + formatChampIDToChampion(randomChampion).replace(/(?:^|[\s'])\w/g, match => match.toUpperCase()));
            load();
        } else {
            alert("Incorrect! Try again.");
        }
        event.target.value = ''; // Clear the input field
    }

})

load();

async function load() {
    currentPatch = await getCurrentLeaguePatch();
    document.getElementById("patch-version").textContent = currentPatch;


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
    return fetch(`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/en_US/champion.json`)
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
    return fetch(`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/en_US/champion/${championName}.json`)
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
    if(randomSkin === "Fiddlesticks_9") {
        return 'resources/fiddlesticks_9.jpg'
    } else if(randomSkin === "Fiddlesticks_27") {
        return 'resources/fiddlesticks_27.jpg'
    } else if(randomSkin === "Fiddlesticks_37") {
        return 'resources/fiddlesticks_37.jpg'
    }
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${randomSkin}.jpg`
}

const nameMap = {
    "aurelion sol" : "aurelionsol",
    "bel'veth" : "belveth",
    "cho'gath" : "chogath",
    "dr. mundo" : "drmundo",
    "kai'sa" : "kaisa",
    "kha'zix" : "khazix",
    "kog'maw" : "kogmaw",
    "k'sante" : "ksante",
    "jarvan iv" : "jarvaniv",
    "lee sin" : "leesin",
    "master yi" : "masteryi",
    "miss fortune" : "missfortune",
    "nunu & willump" : "nunu",
    "rek'sai" : "reksai",
    "renata glasc" : "renata",
    "tahm kench" : "tahmkench",
    "twisted fate" : "twistedfate",
    "vel'koz" : "velkoz",
    "xin zhao" : "xinzhao",
    "wukong" : "monkeyking"
}

function formatChampionToChampID(name) {
    return nameMap[name] || name;
}

function formatChampIDToChampion(name) {
    for (const [key, value] of Object.entries(nameMap)) {
        if (value.toLowerCase() === name.toLowerCase()) {
            return key;
        }
    }
    return name;
}
