const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Frss.xml';

async function loadNews() {
  try {
    const res = await fetch(RSS_URL);
    const data = await res.json();
    
    const container = document.querySelector('.latest-grid');
    if (!container || !data.items) return;

    // الحفاظ على المقال الخاص بك كما هو بكل تفاصيله
    const customArticles = container.querySelectorAll('.my-article');
    let customHTML = '';
    customArticles.forEach(art => customHTML += art.outerHTML);

    // معالجة أخبار RSS
    const fetchedCards = data.items.slice(0, 11).map(item => {
      let imgUrl = item.thumbnail || (item.enclosure && item.enclosure.link);
      if (!imgUrl) {
        const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
        imgUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500';
      }

      const cleanText = item.description.replace(/<[^>]*>?/gm, '');

      return `
        <article class="news-card">
          <div class="card-image-wrap">
            <img src="${imgUrl}" alt="News Image">
          </div>
          <div class="news-card-content">
            <span class="news-source">BBC NEWS</span>
            <h3>${item.title}</h3>
            <p>${cleanText.substring(0, 110)}...</p>
            <div class="card-footer">
              <span class="news-date">${new Date(item.pubDate).toLocaleDateString()}</span>
              <a href="${item.link}" target="_blank" style="color:#bb1919; font-weight:bold; font-size:0.8rem; text-decoration:none;">Read story →</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = customHTML + fetchedCards;

  } catch (err) {
    console.error('Error loading RSS feed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
