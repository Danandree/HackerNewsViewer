import { createNewsCard } from "./createCard.js";

class NewsApp {
    container = document.getElementById("news-container");
    button = document.getElementById("pulsanteLoadMore");
    baseUrl = "https://hacker-news.firebaseio.com/v0/";
    idUrl = new URL(this.baseUrl + "newstories.json");
    proxyUrl = "https://corsproxy.io/?";
    idArray = [];
    defaultImageUrl = "assets/img/newsDefault.png";
    constructor() {
        this.button.addEventListener("click", this.getNewsFromId.bind(this));
    }

    async getNewsIds() {
        let response = await fetch(this.idUrl);
        this.idArray = await response.json();
    }

    async getNewsFromId() {
        for (let i = 0; i < 10; i++) {
            this.button.innerHTML = "Caricamento... [" + i + "/10]";
            let id = this.idArray.shift()
            if (!id) {
                await this.getNewsIds();
                i--;
                continue;
            }
            let newsUrl = new URL(this.baseUrl + "item/" + id + ".json");
            let response = await fetch(newsUrl);
            let data = await response.json();
            if (!data || !data.url || !data.title) {
                i--;
                continue;
            }
            let imageUrl = await this.getOGimage(data.url);
            createNewsCard(this.container, data, imageUrl);
        }
        this.button.innerHTML = "Altre news";
    }
    async getOGimage(url) {
        try {
            let newsMainUrl = new URL(this.proxyUrl + url);
            let mainUrlResponse = await fetch(newsMainUrl);
            let data = await mainUrlResponse.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(data, 'text/html');
            const image = html.querySelector('meta[property="og:image"]').getAttribute('content');
            return image;
        } catch (e) {
            console.log("OG Error: " + e);
            return this.defaultImageUrl;
        }
    }

}

const newsApp = new NewsApp();
newsApp.getNewsIds();
newsApp.getNewsFromId();