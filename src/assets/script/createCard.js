export function createNewsCard(container, obj, defaultImageUrl) {
  const div = createElement("div", "news-card", container);
  div.addEventListener("click", () => { window.location.href = obj.url; });
  const imgDiv = createElement("div", "news-card-img", div);
  imgDiv.style.backgroundImage = `url(${defaultImageUrl})`;
  imgDiv.style.backgroundImage = `url(${obj.imageUrl})`;
  imgDiv.style.backgroundSize = "cover";
  const footerDiv = createElement("div", "news-card-footer", div);
  const newsTitle = createElement("h2", "news-title", footerDiv, obj.title);
  const dataAndSite = createElement("div", "data-and-site", footerDiv);
  const linkToSite = createElement("a", "news-link", dataAndSite, getDomainUrl(obj.url));
  linkToSite.href = "http://www." + getDomainUrl(obj.url);
  const newsData = createElement("p", "news-data", dataAndSite, getData(obj.time));
}

function createElement(tag, className, container, text = null) {
  const element = document.createElement(tag);
  element.className = className;
  container.appendChild(element);
  text ? (element.innerHTML = text) : null;
  return element;
}

function getData(tempo) {
  return new Date(tempo * 1000).toLocaleString().slice(0, -3);
}

function getDomainUrl(url) {
  return url.replace("http://", "").replace("https://", "").replace("www.", "").split(/[/?#]/)[0];
}