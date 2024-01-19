let owner = 'compl3xX';

let repo = 'NoteIT';

async function fetchUserDetails() {
    let userData;
    const rawData = await fetch(`https://api.github.com/users/${owner}`)
    const jsonifiedData = await rawData.json()
    userData = jsonifiedData

    let rawRepos = await fetch(`https://api.github.com/users/${owner}/repos`)

    let jsonifiedRepos = await rawRepos.json()

    console.log(userData)
    
    document.getElementById('name').innerHTML = userData.name
    document.getElementById('bio').innerHTML = userData.bio
    document.getElementById('place').innerHTML = userData.location
    document.getElementById('twitter').innerHTML = userData.twitter_username
    document.getElementById('profile_img').src = await userData.avatar_url
    document.getElementById('profile_link').textContent=userData.html_url
    document.getElementById('profile_link').href=userData.html_url



    for (let i = 0; i < jsonifiedRepos.length; i++) {
        let repo = jsonifiedRepos[i]
        const node = await fetchUserRepo(repo.name)
        document.getElementById('repos').appendChild(node)
    }



}

fetchUserDetails()


async function fetchUserRepo(repo) {

    const rawData = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Accept: 'application/vnd.github.mercy-preview+json',
        },
    })

    const jsonifiedData = await rawData.json()



    let card = document.createElement("li");

    let title = document.createElement('h2');
    title.textContent = jsonifiedData.name

    let desc = document.createElement("p")
    desc.textContent = jsonifiedData.description

    let topic = document.createElement('ul')
    topic.classList.add('card_topics')



    for (let i = 0; i < jsonifiedData.topics.length; i++) {
        let topics = document.createElement('li')
        topics.classList.add('card_topic')
        topics.textContent = jsonifiedData.topics[i]
        topic.appendChild(topics)
    }

    card.appendChild(title)
    card.appendChild(desc)
    card.appendChild(topic)

    console.log(card)

    card.classList.add('card')


    return card
}

// fetchUserRepo()





// fetch(`https://api.github.com/repos/${owner}/${repo}`, {
//     headers: {
//         Accept: 'application/vnd.github.mercy-preview+json',
//     },
// })
//     .then(response => response.json())
//     .then(data => {
//         if (data.topics) {
//             console.log('Topics:', data.topics);
//         } else {
//             console.log('No topics found for this repository.');
//         }
//     })
//     .catch(error => console.error('Error:', error));



// async function getData() {
//     let data = await fetch(`https://api.github.com/users/compl3xX`)
//     console.log(await data.json())
//     // let repos = await fetch(`https://api.github.com/repos/compl3xX`)
//     // console.log(await repos.json())

// }



// getData()

// const octokit = new Octokit({
//     auth: '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'
// });

// const data = await octokit.request(`GET /users/{username}/repos`, {
//     owner: `${owner}`,
//     repo: `${repo}`,
//     headers: {
//         'X-GitHub-Api-Version': '2022-11-28'
//     }
// })


// fetch(`https://api.github.com/users/compl3xX`)
//     .then(response => response.json())
//     .then(data => {
//         if (data.topics) {
//             console.log('Topics:', data.topics);
//         } else {
//             console.log('No topics found for this repository.');
//         }
//     })
//     .catch(error => console.error('Error:', error));
