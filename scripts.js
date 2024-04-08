// I created a separate file for the data im gonna use
// within that file contains three variable arrays containing drills
import {warmUpDrills, skillDrills, gameDrills} from './drills.js';

const practiceWarmup = document.querySelector("#practice-warmup");
const practiceSkill = document.querySelector("#practice-skill");
const practiceGame = document.querySelector("#practice-game");
let planKey; 

// This function populates the drill cards to the drill container
// this will be called by clicking on the buttons in the nav
function populateDrills(drillType) {
    const cardContainer = document.querySelector("#card-container");
    
    // clear card-container
    cardContainer.innerHTML = '';
    
    // populate the card-container with the drills
    // the drills will be shown as cards
    for(let i = 0; i < drillType.length; i++){
        let title = drillType[i].name;
        let description = drillType[i].description;
        let image = drillType[i].image;

        cardContainer.innerHTML += createCard(title, description, image);
    }
    // add an event listener to the newly created card buttons
    // 
    document.querySelectorAll(".drill-card button").forEach(addbtn => {
        addbtn.addEventListener('click', e => addToPlan(e.currentTarget));
    });
}
// this function returns the card html (in the form of a string)
// called within populateDrills() function 
function createCard(title, description, image){
    return `
    <div class="drill-card">
        <div class="media-container">
            <img src="${image}" alt="Drill Image">
        </div>
        <div class="card-contents">
            <h2>${title}</h2>
            <p>${description}</p>
            <button>Add</button>
        </div>
        
    </div>
    `;
}
// this function determines the btn ID and calls the populateDrills() function
// to populate the appropriate drill type 
// could refactor this to be simpler, or done within populate func
// updates planKey for localstorage key
function determineID(btnID){
    switch(btnID){
        case "warmupbtn":
            populateDrills(warmUpDrills);
            planKey = "warmup";
            break;
        case "skillsbtn":
            populateDrills(skillDrills);
            planKey = 'skill';
            break;
        case "gamesbtn":
            populateDrills(gameDrills);
            planKey = "game";
            break;
        default:
            console.log("Error getting the drillType from drills.js");
    }
}
// adding event listeners for the nav buttons
// onlick, it would call the determineID() function 
// also toggles "selected" class when the button is clicked
document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener('click', function(){
        determineID(btn.id);
        // reset button css
        document.querySelectorAll("nav button").forEach(btn => {
            btn.classList = '';
        })
        // toggle "selected" class when nav button is clicked
        btn.classList = "selected";
        });
})
// this function adds the selected drill into localStorage
// will then pull data from localStorage to practice plan by calling populateFromStorage()
function addToPlan(e){
    // get the drill name and description of selected target
    let drillName = e.parentElement.querySelector('h2').textContent;
    let drillDescription = e.parentElement.querySelector('p').textContent;
    // combine name and desc into one string
    let value = drillName + "|" + drillDescription;
    console.log(value);
    /** value will look like this:
     * {"planKey": "drillName | drillDescription"}
     */

    // add the drill to local storage
    localStorage.setItem(planKey, value);

    // call the populateFromStorage() function to output the drills
    // from the localStorage
    populateFromStorage();

}
// this function takes the data stored in localstorage and outputs it onto the page
// this is so if user refreshes, any data kept will still be outputted
function populateFromStorage(){
    let keys = ["warmup", "skill", "game"];
    let values = {};
    keys.forEach(key=>{
        values[key] = localStorage.getItem(key);
        // split the value as it comes in one string 
        // check if key is empty, if not, perform population 
        if(values[key] != null){
            let parts = values[key].split("|");
            let drillDescription = parts[1];
            console.log(parts, drillDescription);

            let nameHtml = document.createElement("h3");
            nameHtml.innerHTML = parts[0];
            switch(key){
                case "warmup":
                    practiceWarmup.innerHTML = '';
                    practiceWarmup.append(nameHtml);
                    practiceWarmup.innerHTML += drillDescription; 
                    break;
                case "skill":
                    practiceSkill.innerHTML = '';
                    practiceSkill.append(nameHtml);
                    practiceSkill.innerHTML += drillDescription; 
                    break;
                case "game":
                    practiceGame.innerHTML = '';
                    practiceGame.append(nameHtml);
                    practiceGame.innerHTML += drillDescription; 
                    break;
                default:
                    console.log("Error in addToPlan Switch statement");
            }
        };

        
    });
    console.log(values);

    
};
populateFromStorage();

// IIFE for clear button on the practice plan section
function clearStorage(){
    const clearBtn = document.querySelector("#practice-container button");
    clearBtn.addEventListener('click', e =>{
        // clear localstorage
        localStorage.clear();

        // clear practice plan containers
        practiceWarmup.innerHTML = '';
        practiceSkill.innerHTML = '';
        practiceGame.innerHTML = '';
    });
};
clearStorage();
// TODO: 
/*
- add a clear plan button and remove btn
- write your own plan
- find a way to split skills into 2
- add instructions
- dynamic stretching notice
- update descriptions
- find images/video
- make it downloadable as pdf 
- practice plan sticky
- separate the add to plan function from localstorage
- create a favorite tab with favorited drills
- reference (Thrive volleyball, )

*/

