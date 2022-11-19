const fs = require('fs');

const dataUrls = require('./src/urls.json');

const SOURCE_FILE = './src/index.html';
const TARGET_FILE = './dist/index.html';

let content = [];

dataUrls.forEach( series => {
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
            let [url, title, desc, favicon] = site;

            if (!url || !title) {
                return;
            }

            !favicon && (favicon = url.match(/http(s)?:\/\/[^\/]*/)[0] + '/favicon.ico');

            content.push(`
                <li class="site"><a class="site-url" href="${url}" target="_blank" title="${title}${desc ? ':'+desc : ''}" style="background-image:url(${favicon})">${title} <span class="site-desc">${desc}</span></a></li>
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

// 简单清理
content = content.join('').replace(/\s+/g, ' ');

let template = fs.readFileSync(SOURCE_FILE, 'utf-8')
let targetContent = template.replace(/{{%PLH_CONTENT%}}/, content);

fs.writeFileSync(TARGET_FILE, targetContent);


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
