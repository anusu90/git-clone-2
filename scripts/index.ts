const { Octokit } = require("@octokit/core"); // KINDLY IGNORE THE FIRST THREE LINES
let {myGitKey} = process.env; //IGNORE
const octokit = new Octokit({ auth: myGitKey }); //IGNORE


//FIRST WE LISTEN TO TO THE SUBMIT OF INPUT IN THE NAVBAR. THIS WOULD GIVE US OUR SEARCH QUERY

(<HTMLFormElement>document.getElementById('myForm')).addEventListener("submit", (e) => {
    e.preventDefault(); //PREVENT DEFAULT TO STOP FORM FROM SUBMITTING
    let query = (<HTMLInputElement>document.getElementById('query')).value;
    console.log(query)
    searchGithubUser(query); // CALL THE FUNCTION TO SEARCH THE USER THROUGH API FOR THE GIVEN QUERY
})


// FUNCTION TO SEARCH FOR USER

async function searchGithubUser (query:string){

    const url = "https://api.github.com/users/"+query;
    const request = await fetch(url);
    if (request.status >= 200 && request.status <=299){ //THIS SHOWS IF THE REQUEST IS SUCCESSFUL SHOWING THAT WE FOUND THE USER
        const user = await request.json();
        DisplayUser(user);                              // DisplayUSer Function is called for DOM
    } else {

        console.log('the status code is ',request.status);
        alert ("No such user found. Please try again.");
    }
}

// FUNCTION FOR DISPLAYING ALL THE REPOS OF THE USER

async function userlistAllRepos(user:any) {

    console.log(user);
    const userAllRepoListReq = await fetch(`https://api.github.com/users/${user.login}/repos`);
    const userAllRepoListResponse = await userAllRepoListReq.json();
    console.log(userAllRepoListResponse)

    DisplayUserRepos(user, userAllRepoListResponse ); // THIS FUNCTION IS CALLED AGAIN FOR DOM TO DISPLAY REPOS
    
}

//THIS FUNCTION PERFORMS DOM AND PRESENTS US WITH THE USER IN FORM OF BOOTSTRAP CARD

function DisplayUser(user:any) {

    let inHTML = `<div class="card mb-3 w-100 user-card shadow p-3 mb-5 bg-white rounded">` +
        `  <div class="row no-gutters">` +
        ` <div class="col-md-4">` +
        `  <img src="${user.avatar_url}" class="card-img" alt="...">` +
        `   </div>` +
        `  <div class="col-md-8">` +
        ` <div class="card-body">` +
        `  <h5 class="card-title">${user.name}</h5>` +
        ` <p class="card-text">BIO: ${user.bio} </p>` +
        `<p class="card-text"><small class="my-muted-text">Login: ${user.login}. Total Public Repos: ${user.public_repos}</small></p>` +
        `<a href="${user.html_url}" target="_blank"><button class=" btn btn-primary">GitHub Profile</button></a> <button class=" btn btn-success" id= "${user.name}-btn">See Repositories</button>`+
        ` </div>` +
        `   </div>` +
        `  </div>` +
        `</div>`;

    //THE ABOVE HTML TEXT ALSO CREATES 2 BUTTONS ONE TO GO TO THE USER'S GITHUB PROFILE AND ANOTHER TO LIST THE REPOS
    // THE REPO LISTING FUNCTION HAS ALREADY BEING DEFINED

    (<HTMLElement>document.getElementById('display-col')).innerHTML = inHTML;

    (<HTMLButtonElement>document.getElementById(`${user.name}-btn`)).addEventListener(('click'), () => {
        
        userlistAllRepos(user);  // WE HAVE ADDED AN EVENT LISTENER ON THE BUTTON TO SHOW THE REPOS
    })

}

//FOLLOWING FUNCTION DOES DOM TO SHOW ALL THE REPOS OF THE USER

function DisplayUserRepos(user,userAllRepoListResponse){

    userAllRepoListResponse.forEach ((repo) => {

        let card = document.createElement('div');
        card.classList.add('card', 'shadow-sm', "p-3" ,"mb-5", "bg-white" ,"rounded", "repo-card")

        let inHTMLforCards =  `<div class="card-header repo-header"> ${repo.name} </div>` +
            `<div class="card-body">` +
            `<h5 class="card-title"> ${repo.full_name}</h5>` +
            `<p class="card-text">Language: ${repo.language}.      Created on: ${String(repo.created_at).slice(0,10)}</p>` +
            `<div class="file-list" id="${repo.full_name}-file-list"></div>`+
            ` <button class="btn btn-info" id ="${repo.name}-list">List Files</button> <a href="${repo.html_url}" target="_blank" class="btn btn-dark">Go to Repo</a>` +
            `</div>`;

        // IN THE ABOVE HTML WE HAVE CREATED A BUTTON TO LIST THE FILES PRESENT IN THAT REPO
        // TO THAT BUTTON WE ATTACK EVENTLISTENER
        
        card.innerHTML = inHTMLforCards;
        (<HTMLElement>document.getElementById('display-col')).append(card); //WE ARE DISPLAYING THE REPOS THROUGH BOOTSTRAP CARDS

        (<HTMLElement>document.getElementById(`${repo.name}-list`)).addEventListener('click', (e)=> {
            displayRepoFileList(repo,e); //EVEN LISTENER WILL CALL THIS FUNCTION TO SHOW THE REPO LIST
        })

    })


}

// FOLLOWING FUNCTION FETCHES INFORMATION FROM API AND DOES DOM TO SHOW THE FILE LIST OF PARTICULAR REPO OF A USER
// IT IS DONE THROUGH BY APPENDING A NEW DIV TO THE CARD OF REPOS

async function displayRepoFileList(repo,e) {

    if(e.target.innerHTML === 'List Files'){

        e.target.innerHTML = "Collapse Files"

        let url = repo.contents_url;
        let n = url.length
        let newUrl = url.slice(0,n-7)
    
        let requestForRepoFiles = await fetch(newUrl);
        let responseForRepoFiles = await requestForRepoFiles.json();
        let fileListDisplayDiv = (<HTMLElement>document.getElementById(`${repo.full_name}-file-list`))
    
        // console.log(responseForRepoFiles)
    
        responseForRepoFiles.forEach(file => {
            let pTagforFile = document.createElement('p');
            pTagforFile.innerHTML = file.name;
            fileListDisplayDiv.append(pTagforFile);
        });
    } else {

        let fileListDisplayDiv = (<HTMLElement>document.getElementById(`${repo.full_name}-file-list`));
        fileListDisplayDiv.innerHTML ="";
        e.target.innerHTML = "List Files"

    }

    
}