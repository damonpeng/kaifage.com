const fs = require('fs');

const config = [
    {
        data: './src/urls.json',
        source: './src/index.html',
        target: './dist/index.html',
        holder: 'PLH_URLS_CONTENT'
    },
    {
        data: './src/libs.json',
        source: './src/libs.html',
        target: './dist/libs.html',
        holder: 'PLH_LIBS_CONTENT'
    },
    {
        data: './src/snippets.json',
        source: './src/snippets.html',
        target: './dist/snippets.html',
        holder: 'PLH_SNIPPETS_CONTENT'
    }
];

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

                let github = githubUrl ? githubUrl.match(/:(\w+)\/(\w+)/) : '';

                !favicon && (favicon = url.match(/http(s)?:\/\/[^\/]*/)[0] + '/favicon.ico');

                content.push(`
                    <li class="site">
                        <a class="site-url" href="${url}" target="_blank" title="${title}${desc ? ':'+desc : ''}" style="background-image:url(${favicon})">
                        ${title}
                        <span class="site-desc">${desc}</span>
                        ${github ? '<img src="https://img.shields.io/github/license/'+ github[1] +'/'+ github[2] +'?style=flat-square" />' : ''}
                        ${github ? '<img src="https://img.shields.io/github/stars/'+ github[1] +'/'+ github[2] +'?style=flat-square" />' : ''}
                        </a>
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
    let targetContent = template.replace('{{%'+ config.holder +'%}}', content);

    fs.writeFileSync(config.target, targetContent);

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
