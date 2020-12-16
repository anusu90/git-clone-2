# GUVI HACKATHON TASK

### This task is submitted as a part of GUVI B18 Hackathon event. 

**Following were the requirements of the task**

1. Create functionality to list the repository names of a user.
2. Create functionality to find the user and repository.
3. List the files in the repository.

**Things to note**

- Webpack generates ```main.js``` in the ```scripts``` folder. But that file has not been pushed to GitHub. This is done to that we can use netlify's build command to compile main.js while deploying. Since ```Typescript``` is used, the relevant files can be seen in scripts directory. *Note the ```scripts``` from ``` package.json ```*

```
"scripts": {
    "build": "npm install && webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  }

```
- The build command in netlify's deployment tool is given as ``` npm run build```. This turns to the above ```script``` section and executes it. Thus installing all dependencies and compiling the ``` index.ts``` into ``` main.js``` while deployment


**Following is the deployed URL**

[Netlify-Deployment](https://wonderful-darwin-60d250.netlify.app/)


**Following is the screenshot**

![img](images/screenshot.png)