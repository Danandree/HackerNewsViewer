import "../css/style.css";
import defaultnewsImage from "../img/newsDefault.png";
import _ from "lodash";
import { createNewsCard } from "./createCard.js";

class NewsApp {
  container = document.getElementById("news-container");
  button = document.getElementById("pulsanteLoadMore");
  baseUrl = "https://hacker-news.firebaseio.com/v0/";
  idUrl = new URL(this.baseUrl + "newstories.json");
  proxyUrl = "https://corsproxy.io/?";
  idArray = [];
  defaultImageUrl = defaultnewsImage;
  testoPulsanteErrore = "Errore... Clicca per ricaricare";
  newsDaVisualizzare = 10;
  constructor() {
    this.button.addEventListener("click", this.getNewsFromId.bind(this));
  }

  async getNewsIds() {
    try {
      let response = await fetch(this.idUrl);
      this.idArray = await response.json();
      return 1;
    } catch (e) {
      console.log("getNewsIds Error: " + e);
      this.idArray = [];
      this.button.innerHTML = this.testoPulsanteErrore;
      return 0;
    }
  }

  async getNewsFromId() {
    for (let i = 0; i < this.newsDaVisualizzare; i++) {
      let id = this.idArray.shift();
      if (!id) {
        newsTest = await this.getNewsIds();
        if (newsTest == 0) {
          break;
        }
        i--;
        continue;
      }
      this.button.innerHTML = "Caricamento... [" + i + "/10]";
      try {
        let newsUrl = new URL(this.baseUrl + "item/" + id + ".json");
        let response = await fetch(newsUrl);
        let data = await response.json();
        let dataUrl = _.get(data, "url", 0);
        let dataTitle = _.get(data, "title", 0);
        if (!data || dataTitle == 0 || dataUrl == 0) {
          i--;
          continue;
        }
        data.imageUrl = await this.getOGimage(data.url);
        createNewsCard(this.container, data, this.defaultImageUrl);
      } catch (e) {
        console.log("getNewsFromId Error: " + e);
        i--;
        continue;
      }
    }
    newsTest == 1 ? (this.button.innerHTML = "Altre news") : (this.button.innerHTML = this.testoPulsanteErrore);
  }
  async getOGimage(url) {
    try {
      let newsMainUrl = new URL(this.proxyUrl + url);
      let mainUrlResponse = await fetch(newsMainUrl);
      let data = await mainUrlResponse.text();
      const parser = new DOMParser();
      const html = parser.parseFromString(data, "text/html");
      const imageUrl = html.querySelector('meta[property="og:image"]').getAttribute("content");
      const completeImgUrl = new URL(imageUrl);
      if (!completeImgUrl.protocol.startsWith("http")) {
        return this.defaultImageUrl;
      }
      return completeImgUrl;
    } catch (e) {
      console.log("getOGImage Error: " + e);
      return this.defaultImageUrl;
    }
  }
}

const newsApp = new NewsApp();
let newsTest = await newsApp.getNewsIds();
newsTest == 1 ? newsApp.getNewsFromId() : null;
