const projectList = [
    {
        title: 'DOM Sprint',
        href: 'dom-sprint/public/index.html'
    },
    {
        title: 'Angular Sprint 1',
        href: 'https://angular-sprint1-58294.web.app/wallet'
    },
    {
        title: 'Angular Sprint 2',
        href: 'https://hero-vs-villains2021.web.app/marvel-heroes'
    },
    {
        title: 'CSS Calculator',
        href: 'https://css-calculator-92843.web.app/'
    },
    {
        title: 'Adventure Game',
        href: 'https://sleepy-peak-05201.herokuapp.com/'
    },
];

const createProjectList = projectList => {
    projectList.forEach(p => {
        let e = document.createElement('a');
        e.innerHTML = p.title;
        e.href = p.href;
        e.target = '_blank';

        document.getElementById('main').appendChild(e);
    });
}

createProjectList(projectList);