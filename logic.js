let owner = 'compl3xX';

let repo = 'NoteIT';

let perPage = 10;

let page = 1;

let totalPages


fetchUserDetails(owner)
calPages(owner, perPage)

const searchQuery = document.getElementById('search_user_repo')

searchQuery.addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
        owner = searchQuery.value
        fetchUserDetails(searchQuery.value)
    }
})

const dropdown = document.getElementById('no_of_repos')

dropdown.addEventListener('change', function () {
    perPage = dropdown.value
    calPages(owner, perPage)
    currentPage(owner, page)
})

const backBtn = document.getElementById('pagination_btn_back')
const frwdBtn = document.getElementById('pagination_btn_forw')
const pagination = document.getElementById('pagination')

function changePaginationPage(pageNo) {

    let activePage = pagination.querySelector('.active')
    activePage.classList.remove('active')

    const pages = pagination.querySelectorAll('.page')
    for (let x of pages) {
        if (x.textContent === `${pageNo}`) {
            x.classList.add('active')
        }

    }
}

backBtn.addEventListener('click', function () {

    if (page !== 1) {
        page--;
        currentPage(owner, page)
        changePaginationPage(page)
    }
})

frwdBtn.addEventListener('click', function () {

    if (page !== totalPages) {

        page++;
        currentPage(owner, page)
        changePaginationPage(page)

    }
})



async function fetchUserDetails(userName) {

    let userData;

    const rawData = await fetch(`https://api.github.com/users/${userName}`, {
        headers: {
            Authorization: `token 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`,
        }
    })

    const jsonifiedData = await rawData.json()

    userData = jsonifiedData

    // let rawRepos = await fetch(`https://api.github.com/users/${userName}/repos?per_page=${perPage}&page=${page}`)

    // let jsonifiedRepos = await rawRepos.json()

    console.log(userData)

    document.getElementById('name').innerHTML = userData.name
    document.getElementById('bio').innerHTML = userData.bio
    document.getElementById('place').innerHTML = userData.location
    document.getElementById('twitter_link').textContent = userData.twitter_username
    document.getElementById('twitter_link').href = `https://twitter.com/${userData.twitter_username}`
    document.getElementById('profile_img').src = await userData.avatar_url
    document.getElementById('profile_link').textContent = userData.html_url
    document.getElementById('profile_link').href = userData.html_url



    // for (let i = 0; i < jsonifiedRepos.length; i++) {
    //     let repo = jsonifiedRepos[i]
    //     const node = await fetchUserRepo(repo.name)
    //     document.getElementById('repos').appendChild(node)
    // }

    currentPage(userName, 1);
}



async function currentPage(userName, pageNo) {

    let rawRepos = await fetch(`https://api.github.com/users/${userName}/repos?per_page=${perPage}&page=${pageNo}`, {
        headers: {
            Authorization: `token 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`,
        }
    })

    let jsonifiedRepos = await rawRepos.json()

    let repoContainer = document.getElementById('repos')

    if (repoContainer.innerHTML !== " ") {
        repoContainer.innerHTML = " "
    }

    

    for (let i = 0; i < jsonifiedRepos.length; i++) {
        let repo = jsonifiedRepos[i]
        const node = await fetchUserRepo(repo.name)
        repoContainer.appendChild(node)
    }
}

async function calPages(userName, repoPerPage) {

    const rawAllPages = await fetch(`https://api.github.com/users/${userName}/repos`, {
        headers: {
            Authorization: `token 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`,
        }
    })

    const allPages = await rawAllPages.json()

    totalPages = Math.ceil(allPages.length / repoPerPage)

    // const pagination = document.getElementById('pagination')

    if (pagination.innerHTML !== " ") pagination.innerHTML = " "

    for (let i = 1; i <= totalPages; i++) {
        let pageNo = document.createElement('li')
        if (i === page) pageNo.classList.add('active')
        pageNo.classList.add('page')
        pageNo.textContent = i
        pageNo.addEventListener('click', function () {
            const activePage = pagination.querySelector('.active')
            activePage.classList.remove('active')
            pageNo.classList.add('active')
            currentPage(owner, i)
            page = i
        })
        pagination.appendChild(pageNo)
    }
}



async function fetchUserRepo(repo) {

    const rawData = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `token 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`,
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
