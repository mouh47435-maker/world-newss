const feeds = [
  {
    name: "World",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Frss.xml"
  },
  {
    name: "Technology",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Ftechnology%2Frss.xml"
  },
  {
    name: "Business",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fbusiness%2Frss.xml"
  }
];

async function loadNews() {
  const articles = [];

  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url);
      const data = await response.json();

      if (data.status === "ok") {
        data.items.forEach(item => {
          articles.push({
            title: item.title,
            description: item.description
              ? item.description.replace(/<[^>]*>/g, "")
              : "",
            link: item.link,
            category: feed.name,
            date: item.pubDate
          });
        });
      }
    } catch (error) {
      console.log("News feed error:", error);
    }
  }

  displayNews(articles);
}

function displayNews(articles) {
  const latest = document.querySelector(".latest-grid");

  if (!latest) return;

  latest.innerHTML = "";

  articles.slice(0, 15).forEach(article => {
    const item = document.createElement("article");

    item.innerHTML = `
      <div class="mini">${article.category}</div>
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <small>${new Date(article.date).toLocaleString()}</small>
      <br>
      <a href="${article.link}" target="_blank" rel="noopener">
        Read full story →
      </a>
    `;

    latest.appendChild(item);
  });
}

loadNews();

// Refresh news every 10 minutes
setInterval(loadNews, 10 * 60 * 1000);
