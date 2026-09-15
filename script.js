const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Frss.xml';

async function loadNews() {
  try {
    const res = await fetch(RSS_URL);
    const data = await res.json();
    
    const container = document.querySelector('.latest-grid');
    if (!container || !data.items) return;

    // الحفاظ على مقالك المخصص
    const customArticles = container.querySelectorAll('.my-article');
    let customHTML = '';
    customArticles.forEach(art => customHTML += art.outerHTML);

    // جلب الأخبار الجديدة
    const fetchedCards = data.items.slice(0, 9).map(item => `
      <article class="news-card">
        <div class="news-card-content">
          <span class="news-source">BBC News</span>
          <h3>${item.title}</h3>
          <p>${item.description.replace(/<[^>]*>?/gm, '')}</p>
          <span class="news-date">${new Date(item.pubDate).toLocaleDateString()}</span>
          <a href="${item.link}" target="_blank" style="margin-top:10px; color:#bb1919; font-weight:bold; text-decoration:none;">Read full story →</a>
        </div>
      </article>
    `).join('');

    // دمج المقال الخاص بك في البداية مع باقي الأخبار
    container.innerHTML = customHTML + fetchedCards;

  } catch (err) {
    console.error('Error loading RSS feed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
