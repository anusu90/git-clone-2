// async function searchGithubUser (query:string){
//     const url = "https://api.github.com/users/"+query;
//     const request = await fetch(url);
//     const response = await request.json();
//     console.log(response);
// }










const { Octokit } = require("@octokit/core");
let {myGitKey} = process.env;
const octokit = new Octokit({ auth: myGitKey });

(<HTMLFormElement>document.getElementById('myForm')).addEventListener("submit", (e) => {
    e.preventDefault();
    let query = (<HTMLInputElement>document.getElementById('query')).value;
    console.log(query)
    MyFunc(query);
})



async function MyFunc (query:string){
    try {
        const response = await octokit.request('GET /users/{user}',{
            user: query,
        });
        DisplayUser(response.data);
        console.log(response.data)
        
    } catch (error) {

        alert("no user by that name searching repositories")        
        const res2 = await octokit.request('GET /search/repositories', {
            q: query,
        });
        console.log(res2.data)   
    }
}

async function GetRepoContent (){
    const responseForRepo =  await octokit.request('GET /repos/{owner}/{repo}/contents/', {
        owner: 'anusu90',
        repo: '100-PYTHON-PROJECTS',
      })
}


async function userlistAllRepos(user:any) {

    console.log(user);
    const userAllRepoListReq = await fetch(`https://api.github.com/users/${user.login}/repos`);
    const userAllRepoListResponse = await userAllRepoListReq.json();
    console.log(userAllRepoListResponse)

    DisplayUserRepos(user, userAllRepoListResponse );
    
}


GetRepoContent();

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
        `<p class="card-text"><small class="text-muted">Login: ${user.login}. Total Public Repos: ${user.public_repos}</small></p>` +
        `<a href="${user.html_url}" target="_blank"><button class=" btn btn-primary">GitHub Profile</button></a> <button class=" btn btn-success" id= "${user.name}-btn">See Repositories</button>`+
        ` </div>` +
        `   </div>` +
        `  </div>` +
        `</div>`;

    (<HTMLElement>document.getElementById('display-col')).innerHTML = inHTML;

    (<HTMLButtonElement>document.getElementById(`${user.name}-btn`)).addEventListener(('click'), () => {
        
        userlistAllRepos(user);
    })

}

function DisplayUserRepos(user,userAllRepoListResponse){

    userAllRepoListResponse.forEach ((repo) => {

        let card = document.createElement('div');
        card.classList.add('card', 'shadow-sm', "p-3" ,"mb-5", "bg-white" ,"rounded")

        let inHTMLforCards =  `<div class="card-header"> ${repo.name} </div>` +
            `<div class="card-body">` +
            `<h5 class="card-title"> ${repo.full_name}</h5>` +
            `<p class="card-text">Language: ${repo.language}. Created at: ${repo.created_at}</p>` +
            ` <a href="#" class="btn btn-info" id ="${repo.name}-list">List Files</a> <a href="${repo.html_url}" target="_blank" class="btn btn-dark">Go to Repo</a>` +
            `</div>`;
        
        card.innerHTML = inHTMLforCards;
        (<HTMLElement>document.getElementById('display-col')).append(card)

    })


}
