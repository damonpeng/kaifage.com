const fs = require('fs');
const getDirName = require('path').dirname;

const config = [
    {
        data: './data/urls.json',
        source: './template/index.html',
        target: './dist/index.html',
        holder: 'PLH_URLS_CONTENT'
    },
    {
        data: './data/libs.json',
        source: './template/libs.html',
        target: './dist/libs.html',
        holder: 'PLH_LIBS_CONTENT'
    },
    {
        data: './data/snippets.json',
        source: './template/snippets.html',
        target: './dist/snippets.html',
        holder: 'PLH_SNIPPETS_CONTENT'
    }
];

const styleContent = `
* {margin:0;padding:0}
html{font-size:62.5%;font-family:-apple-system,BlinkMacSystemFont,'Microsoft YaHei',sans-serif,Helvetica,Tahoma}
body {font-size:1.6rem;line-height:1.33;font-size-adjust:none;background-color:var(--bg-color);color:var(--link-color)}
a {text-decoration: none;color:var(--link-color)}
/* a:hover{text-decoration: underline} */
li {list-style: none}
footer {text-align:center;padding:50px 0 30px}
.container {margin:5px}
.container-header {display:flex;align-items:flex-start;flex-wrap:wrap}
.logo {font-size:1.6rem}
.logo .prefix {font-size:2.4rem}
.logo small{color:var(--logo-color);font-weight:400}
.navigation {display:flex;width:100%;font-size:1.5rem;margin-top:10px;justify-content: space-between}
.navigation a {padding-bottom:2px;border-bottom:3px double var(--link-color)}
.navigation a.current {border-bottom:3px solid var(--link-color)}
.navigation a:hover {border-bottom:3px dashed var(--link-color)}
.theme {position:absolute;top:10px;right:20px;font-size:2.4rem;cursor:pointer;transition:transform .5s ease-in-out}
.contribute {position:absolute;top:16px;right:70px;font-size:1.3rem;padding-left:16px;background:url(https://github.githubassets.com/favicons/favicon.png) no-repeat 0 1px/14px}
.container-body{margin-top:20px}
.series {margin-bottom:10px}
.series-title {font-size:1.6rem;padding-bottom:3px;color:var(--series-color);border-bottom:1px solid var(--series-border-color)}
.groups {display:flex;flex-wrap:wrap;align-content:flex-start;justify-content:flex-start;margin-top:5px}
.group {display:flex;max-width:500px;min-width:300px;margin-bottom:8px;margin-right:30px}
.group img {height:16px;opacity:0.4;vertical-align:middle}
.github-url:hover img {opacity:1}
.group-title {width:20px;padding:5px;font-size:1,4rem;font-style:italic;font-weight:400;color:var(--group-color);word-wrap:break-word;letter-spacing:5px}
.sites {flex:2}
.site {padding:4px 0}
.site-url {padding:0 5px 0 22px;border-radius:3px;background-position:5px 50%;background-size:12px 12px;background-repeat:no-repeat}
.site-url:hover {transform: scale(1.01869) translate(0px, -4px);transition-duration: 0.2s;box-shadow: rgb(66 66 66 / 62%) 0px 6px 12px 0px}
.site-favicon {margin-right:2px}
.site-desc {font-size:1rem;color:var(--site-desc-color);font-family: "-apple-system", BlinkMacSystemFont, "Yu Gothic Medium", "游ゴシック Medium", YuGothic, "游ゴシック体", "Noto Sans Japanese", "ヒラギノ角ゴ Pro W3", "メイリオ", "Hiragino Kaku Gothic ProN", "MS PGothic", Osaka, "sans-serif";}
.bee-flying { display:inline-block;-webkit-animation:flying 2s ease-in-out infinite;animation:flying 2s ease-in-out infinite}
@keyframes flying {
    0% {-webkit-transform:translateY(5%) rotate(7deg) translateX(5%);transform:translateY(5%) rotate(7deg) translateX(5%)}
    25% {-webkit-transform:translateY(0) rotate(10deg) translateX(2.5%);transform:translateY(0) rotate(10deg) translateX(5%)}
    50% {-webkit-transform:translateY(5%) rotate(4deg) translateX(0);transform:translateY(5%) rotate(4deg) translateX(0)}
    75% {-webkit-transform:translateY(0) rotate(10deg) translateX(-2.5%);transform:translateY(0) rotate(10deg) translateX(-5%)}
    to {-webkit-transform:translateY(5%) rotate(7deg) translateX(5%);transform:translateY(5%) rotate(7deg) translateX(5%)}
}
/* smartphones, iPhone, portrait 480x320 phones */
@media (min-width:320px)  {
    .navigation {width:100%;padding:0 10px}
}
/* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
@media (min-width:641px)  {
    .navigation {width:360px;margin-left:100px}
}`;

const scriptContent = `
const themeMap = {
    'default': {
        '--bg-color': '#ffffff',
        '--link-color': '#000',
        '--logo-color': '#999',
        '--series-color': '#000',
        '--series-border-color': '#222',
        '--group-color': '#ddd',
        '--site-desc-color': '#aaa'
    },
    'purple':{"--bg-color":"#1f1e3b","--link-color":"#e59af0","--logo-color":"#e4cc59","--series-color":"#e4cc59","--series-border-color":"#e4cc5966","--group-color":"#afe9ea","--site-desc-color":"#aaa"},
    'matrix':{"--bg-color":"#010600","--link-color":"#7ae49a","--logo-color":"#7ae49a","--series-color":"#7ae49a","--series-border-color":"#7ae49aaa","--group-color":"#7ae49a33","--site-desc-color":"#5c5c5c"},
    'sakura':{"--bg-color":"#f8d4da","--link-color":"#e8459e","--logo-color":"#e8459e","--series-color":"#b7264c","--series-border-color":"#b7264caa","--group-color":"#e899a9","--site-desc-color":"#474b53"},
};

function updateThemeStyle(themeName) {
    if (!themeName) return;

    document.getElementById('theme').innerHTML = ':root '+ JSON.stringify(themeMap[themeName]).replace(/"/g, '').replace(/,/g, ';');
    localStorage.setItem('theme', themeName)
}

document.addEventListener('DOMContentLoaded', (event) => {
    let currentTheme = localStorage.getItem('theme');

    updateThemeStyle(currentTheme);

    let themeKeys = Object.keys(themeMap);
    let themeIdx = themeKeys.indexOf(currentTheme || 'default');
    document.getElementById('changeTheme').onclick = function() {
        themeIdx = (themeIdx + 1) % themeKeys.length;
        currentTheme = themeKeys[themeIdx];

        this.setAttribute('title', themeKeys[themeIdx]);
        this.setAttribute('style', 'transform:rotate('+ 360/themeKeys.length*themeIdx +'deg)');

        updateThemeStyle(currentTheme);
    };
});`;

/**
 * 生成文件
 * @param {object} config 
 */
function genContent(config) {
    const data = require(config.data);

    let content = [];

    data.forEach( series => {
        content.push(`
            <section class="series">
                <h2 class="series-title">${series[0]}</h2>
                <section class="groups">
        `);
        series[1].forEach( group => {
            if (!group[0] || !group[1]) {
                return;
            }
            // console.log(group[0])
            // console.table(group[1])

            content.push(`
                <div class="group">
                    <h3 class="group-title">${group[0]}</h3>
                    <ul class="sites">
            `)
            group[1].forEach( site => {
                let [url, title, desc, favicon, githubUrl] = site;

                if (!url || !title) {
                    return;
                }

                let github = githubUrl ? githubUrl.replace(/\.git$/, '').match(/(?:\:|github\.com\/)([\w\.\-]+)\/([\w\.\-]+)(\.git|$)/) : '';

                !favicon && (favicon = url.match(/http(s)?:\/\/[^\/]*/)[0] + '/favicon.ico');

                content.push(`
                    <li class="site">
                        <a class="site-url" href="${url}" target="_blank" title="${title}${desc ? ':'+desc : ''}" style="background-image:url(${favicon})">
                            ${title}
                            <span class="site-desc">${desc}</span>
                        </a>
                        ${github ?
                            '<a class="github-url" href="https://github.com/'+ github[1] +'/'+ github[2] +'/" target="_blank" title="跳转到 github"><img src="https://img.shields.io/github/license/'+ github[1] +'/'+ github[2] +'?style=flat-square&label=" /><img src="https://img.shields.io/github/stars/'+ github[1] +'/'+ github[2] +'?style=flat-square&label=" /></a>'
                            : ''
                        }
                    </li>
                `);
            });
            content.push(`
                </ul>
                </div>
            `)
        });
        content.push(`
                </section>
            </section>
        `);
    });

    // 替换模版内容
    let template = fs.readFileSync(config.source, 'utf-8')
    content = content.join('').replace(/\s+/g, ' ');
    let targetContent = template.replace('{{%'+ config.holder +'%}}', content)
                    .replace('{{%PLH_STYLE_CONTENT%}}', styleContent)
                    .replace('{{%PLH_SCRIPT_CONTENT%}}', scriptContent);

    fs.mkdir(getDirName(config.target), { recursive: true}, function (err) {
        fs.writeFileSync(config.target, targetContent);
    });

    console.log(`Write File: ${config.target}, size: ${targetContent.length}`);
}

config.forEach(item => {
    genContent(item);
});

console.log('Complete.')

// function string2Map(str) {
//     let cssMap = {};

//     str.split(';').forEach(item => {
//         let [key, value] = item.split(':');

//         if (!key || !value) return;

//         cssMap[key.trim()] = value.trim();
//     });

//     console.log('theme', JSON.stringify(cssMap));
// };

// string2Map(document.getElementById('theme').innerHTML.replace(/[^{]*{/, '').replace('}', ''))
