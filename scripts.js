// I created a separate file for the data im gonna use
// within that file contains three variable arrays containing drills
import {warmUpDrills, skillDrills, gameDrills} from './drills.js';

const practiceWarmup = document.querySelector("#practice-warmup");
const practiceSkill = document.querySelector("#practice-skill");
const practiceGame = document.querySelector("#practice-game");
let planKey; 
let warmupKeyLS = [];
let skillKeyLS = [];
let gameKeyLS = [];

// This function populates cards to the drill container
// this will be called by clicking on the buttons in the nav
function populateDrills(drillType) {
    const cardContainer = document.querySelector("#card-container");

    // testing drilltype
    // console.log(drillType);
    /**
     * drillType will be an array of objects [{},{},{}]
    */
    
    // clear card-container
    cardContainer.innerHTML = '';
    
    // populate the card-container with the drills
    // the drills will be shown as cards
    for(let i = 0; i < drillType.length; i++){
        let title = drillType[i].name;
        let description = drillType[i].description;
        let image = drillType[i].image;
        let video = drillType[i].video;

        cardContainer.innerHTML += createCard(title, description, image, video);
    }
    // add an event listener to the newly created card buttons
    // for the add-to-practice-btn 
    document.querySelectorAll(".add-to-practice-btn").forEach(addbtn => {
        addbtn.addEventListener('click', e => addToPlan(e.currentTarget));
    });
}
// this function returns the card html (in the form of a string)
// called within populateDrills() function 
function createCard(title, description, image, video){
    if(image != ""){
        return `
        <div class="drill-card">
            <div class="media-container">
                <img src="${image}" alt="Drill Image">
            </div>
            <div class="card-contents">
                <h2>${title}</h2>
                <p>${description}</p>
            </div> 
            <div class="card-buttons">
                <button>Learn More</button>
                <button class="add-to-practice-btn">Add</button>
            </div>
        </div>
        `;
    }else if(video != ""){
        return `
        <div class="drill-card">
            <div class="media-container">
                ${video}
            </div>
            <div class="card-contents">
                <h2>${title}</h2>
                <p>${description}</p>
            </div>
            <div class="card-buttons">
                <button>Learn More</button>
                <button class="add-to-practice-btn">Add</button>
            </div>
        </div>
        `;
    }else{
        return `
        <div class="drill-card">
            <div class="card-contents">
                <h2>${title}</h2>
                <p>${description}</p>
            </div>
            <div class="card-buttons">
                <button>Learn More</button>
                <button class="add-to-practice-btn">Add</button>
            </div>
        </div>
        `;
    }
    
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
        // changes the css so it persists
        btn.classList = "selected";
        });
})
// this function adds the selected drillcard into localStorage
// grabs the drillName from h2, and description from p element
// check if it exists in the warmupKeyLS, skillKeyLS, or gameKeyLS array
// pushes the object into the array based on plankey
// re-stores it in localStorage as a string
function addToPlan(e){
    let drillCard = e.closest('.drill-card');

    // Get the drill name and description from the 'drill-card' element
    let drillName = drillCard.querySelector('h2').textContent;
    let drillDescription = drillCard.querySelector('p').textContent;

    // switch statement for checking if drill is already in the array 
    // based on planKey, checks if an object[key] exists within its respective array
    // the respective arrays are global arrays at the top
    switch(planKey){
        case "warmup":
            for(let obj of warmupKeyLS){// iterate through each element of the array
                if (obj[drillName]){ // check if it exists
                    alert("Drill already added.");
                    return;
                }
                else{
                    // console.log("went through warmupLS loop")
                } 
            }
            warmupKeyLS.push({[drillName] : drillDescription}); // if it doesnt exist, push an obj based on the selected target data
            // console.log("warmupLS: ", warmupKeyLS);     
            // store the array values to localStorage as json string
            localStorage.setItem(planKey, JSON.stringify(warmupKeyLS)); // update the value in localStorage
            break;
        case "skill":
            for(let obj of skillKeyLS){
                if (obj[drillName]){
                    alert("Drill already added.");
                    return;
                }
                else{
                    // console.log("went through skillLS loop")
                } 
            }
            skillKeyLS.push({[drillName] : drillDescription});
            // console.log("skillKeyLS: ", skillKeyLS); 
            // store the array values to localStorage as json string
            localStorage.setItem(planKey, JSON.stringify(skillKeyLS));   
            break;
        case "game": 
            for(let obj of gameKeyLS){
                if (obj[drillName]){
                    alert("Drill already added.");
                    return;
                }
                else{
                    // console.log("went through gameLS loop")
                } 
            }
            gameKeyLS.push({[drillName] : drillDescription});
            console.log("gameLS: ", gameKeyLS); 
            // store the array values to localStorage as json string
            localStorage.setItem(planKey, JSON.stringify(gameKeyLS));
            break;
        default:
            console.log("went through switch statement. may have an error");
    };
 
    // populate the drills from localStorage into practice plan 
    populateFromStorage();
}
// this function takes the data stored in localStorage and outputs it onto the practice plan
// using localStorage so data persists until the browser is closed.
// first it should add whatever is currently in localStorage into the global arrays (warmupKeyLS, skillKeyLS, gameKeyLS)
// then output the data into the practice plan
function populateFromStorage(){
    // check if key exists in localStorage so it doesnt set the array variable to null
    if(localStorage.getItem("warmup")){ // if key exists...
        warmupKeyLS = JSON.parse(localStorage.getItem("warmup")); // set the global variable to its value
    }
    if(localStorage.getItem("skill")){
        skillKeyLS = JSON.parse(localStorage.getItem("skill"));
    }
    if(localStorage.getItem("game")){
        gameKeyLS = JSON.parse(localStorage.getItem("game"));
    }

    // clear the practice plan sections
    // output the data to the respective sections
    practiceWarmup.innerHTML = '';
    practiceSkill.innerHTML = '';
    practiceGame.innerHTML = '';
    practicePlanOutput(warmupKeyLS);
    practicePlanOutput(skillKeyLS);
    practicePlanOutput(gameKeyLS);

    function practicePlanOutput(keyLS){
        for(let obj of keyLS){
            for(let prop in obj){
                let drillName = prop;
                let drillDescription = obj[prop];
                let drillItem = document.createElement('div');
                drillItem.classList.add("drillItem");
                drillItem.innerHTML = `
                    <div class="dragDiv">
                        <div class="dragger">:::</div>
                        <h3>${drillName}</h3>
                    </div>
                    <p>${drillDescription}</p>
                `;
                
                switch(keyLS){
                    case warmupKeyLS:
                        practiceWarmup.append(drillItem);
                        break;
                    case skillKeyLS:
                        practiceSkill.append(drillItem);
                        break;
                    case gameKeyLS:
                        practiceGame.append(drillItem);
                        break;
                    default:
                        console.log("Error in practicePlanOutput function switch statement.");
                }
               
            }
        }
    }
    // add the remove function 
    removeDrill();
};
populateFromStorage();

// for clear button on the practice plan section
// reset the localStorage, practice plan secttions and global variables
function clearStorage(){
    const clearBtn = document.querySelector("#practice-container button");
    clearBtn.addEventListener('click', e =>{
        // clear localstorage
        localStorage.clear();

        // clear practice plan containers
        practiceWarmup.innerHTML = '';
        practiceSkill.innerHTML = '';
        practiceGame.innerHTML = '';

        // reset global variables for local storage
        warmupKeyLS = [];
        skillKeyLS = [];
        gameKeyLS = [];
    });
};
clearStorage();

// this function adds event listener to the drill name titles that will remove it
// called every time the practice plan is populated, called within populateFromStorage
// queries the h3 elements, adds an event listener
// filters through the global arrays to remove the selected drill name
// update localStorage
function removeDrill(){
    let drill = document.querySelectorAll("#practice-container h3");
    drill.forEach(item => {item.addEventListener('dblclick', e => {
        // alert(item.textContent);
        let drillName = item.textContent;

        // go through each array to see if it exists
        warmupKeyLS = warmupKeyLS.filter(obj => Object.keys(obj)[0] !== drillName);
        skillKeyLS = skillKeyLS.filter(obj => Object.keys(obj)[0] !== drillName);
        gameKeyLS = gameKeyLS.filter(obj => Object.keys(obj)[0] !== drillName);
        // console.log("warmupLS: ", warmupKeyLS);
        // console.log("skillLS: ", skillKeyLS);
        // console.log("gameLS: ", gameKeyLS);

        // update localStorage by setting the filtered arrays to corresponding keys
        localStorage.setItem("warmup", JSON.stringify(warmupKeyLS));
        localStorage.setItem("skill", JSON.stringify(skillKeyLS));
        localStorage.setItem("game", JSON.stringify(gameKeyLS));
        populateFromStorage();
    })});

    // this is to put a line through it on one click
    drill.forEach(item => {item.addEventListener('click', e => {
        item.classList.toggle("oneClick");
    })});
}



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
- create different html element for cards based on the media in drills.js / if its an image or video or none
- update video linking; entire string, etc 
- create a modular for see more button
*/

