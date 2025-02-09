const custom = {
    header: "New #Fortnite Shop Sections:", // title 
    lang: "en", // this language available: ar, de, en, es, es-419, fr, it, ja, ko, pl, pt-BR, ru, tr
    start: "- ", // what before the section is like: - Marvel 
}

const api = {
    api: `https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/mp-item-shop?=${custom.lang}`
}

module.exports = { custom, api }

/* 
 * if you have any issues or problems join my discord server
 * https://discord.com/invite/3AUtgD8sWy
*/