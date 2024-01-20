let owner = 'compl3xX';

let repo = 'NoteIT';

let perPage = 10;

let page = 1;

let totalPages

import TOKEN from './config.js'

const backBtn = document.getElementById('pagination_btn_back')
const frwdBtn = document.getElementById('pagination_btn_forw')
const pagination = document.getElementById('pagination')
const repoContainer = document.getElementById('repos')
const loader = document.getElementById('loader')
const profileContainer = document.getElementById('profile_info_container')
const navNextBnt = document.getElementById('nav_btn_next')
const navBackBnt = document.getElementById('nav_btn_prev')


//Initialization

fetchUserDetails(owner)
calPages(owner, perPage)
navBackBnt.classList.add('notactive')
backBtn.classList.add('notactive')


// Seachbar

const searchQuery = document.getElementById('search_user_repo')

searchQuery.addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
        if (repoContainer.innerHTML !== " ") repoContainer.innerHTML = " "
        owner = searchQuery.value
        fetchUserDetails(searchQuery.value)
    }
})

// Number of repos pers page

const dropdown = document.getElementById('no_of_repos')

dropdown.addEventListener('change', function () {
    perPage = dropdown.value
    calPages(owner, perPage)
    currentPage(owner, page)
})



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

function nextPage(userName, pageNo) {

    let curPageNo = pageNo ? pageNo : page;


    if (curPageNo !== totalPages) {
        page == curPageNo;
        page++;
        if (page === totalPages) {
            navNextBnt.classList.add('notactive')
            frwdBtn.classList.add('notactive')
        }
        navBackBnt.classList.remove('notactive')
        backBtn.classList.remove('notactive')
        currentPage(userName, page)
        changePaginationPage(page)

    }

}

function prevPage(userName, pageNo) {

    let curPageNo = pageNo ? pageNo : page;

    if (curPageNo !== 1) {
        page == curPageNo;
        page--;
        if (page === 1) {
            navBackBnt.classList.add('notactive')
            backBtn.classList.add('notactive')
        }
        currentPage(userName, page)
        changePaginationPage(page)
        navNextBnt.classList.remove('notactive')
        frwdBtn.classList.remove('notactive')
    }


}

backBtn.addEventListener('click', function () {


    prevPage(owner, page)
})

frwdBtn.addEventListener('click', function () {


    nextPage(owner, page)

})

navNextBnt.addEventListener('click', function () {
    nextPage(owner, page)
})

navBackBnt.addEventListener('click', function () {
    prevPage(owner, page)
})





async function fetchUserDetails(userName) {

    let userData;

    profileContainer.classList.add('hide')
    loader.classList.remove('hide');


    const rawData = await fetch(`https://api.github.com/users/${userName}`, {
        headers: {
            Authorization: `token ${TOKEN}`,
        }
    })

    const jsonifiedData = await rawData.json()

    userData = jsonifiedData

    console.log(userData)

    document.getElementById('name').innerHTML = userData.name
    document.getElementById('bio').innerHTML = userData.bio
    document.getElementById('place').innerHTML = userData.location
    document.getElementById('twitter_link').textContent = userData.twitter_username
    document.getElementById('twitter_link').href = `https://twitter.com/${userData.twitter_username}`
    document.getElementById('profile_img').src = await userData.avatar_url
    document.getElementById('profile_link').textContent = userData.html_url
    document.getElementById('profile_link').href = userData.html_url



    profileContainer.classList.remove('hide')
    loader.classList.add('hide');
    currentPage(userName, 1);
}


// populate repo section with repos
async function currentPage(userName, pageNo) {

    repoContainer.classList.add('hide');
    loader.classList.remove('hide');

    let rawRepos = await fetch(`https://api.github.com/users/${userName}/repos?per_page=${perPage}&page=${pageNo}`, {
        headers: {
            Authorization: `token ${TOKEN}`,
        }
    })

    let jsonifiedRepos = await rawRepos.json()



    if (repoContainer.innerHTML !== " ") {
        repoContainer.innerHTML = " "
    }



    for (let i = 0; i < jsonifiedRepos.length; i++) {
        let repo = jsonifiedRepos[i]
        const node = await fetchUserRepo(repo.name)
        repoContainer.appendChild(node)
    }

    loader.classList.add('hide');
    repoContainer.classList.remove('hide');
}

// cal the number of page for pagination accordiong to user choice

async function calPages(userName, repoPerPage) {

    const rawAllPages = await fetch(`https://api.github.com/users/${userName}/repos`, {
        headers: {
            Authorization: `token ${TOKEN}`,
        }
    })

    const allPages = await rawAllPages.json()

    totalPages = Math.ceil(allPages.length / repoPerPage)

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


// fetch detail about the particular repo

async function fetchUserRepo(repo) {

    const rawData = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `token ${TOKEN}`,
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


