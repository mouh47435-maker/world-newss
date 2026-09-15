const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Frss.xml';

async function loadNews() {
  try {
    const res = await fetch(RSS_URL);
    const data = await res.json();
    
    const container = document.querySelector('.latest-grid');
    if (!container || !data.items) return;

    // الاحتفاظ بالمقال المخصص الخاص بك
    const customArticles = container.querySelectorAll('.my-article');
    let customHTML = '';
    customArticles.forEach(art => customHTML += art.outerHTML);

    // إنتاج بطاقات الأخبار التلقائية مع استخراج الصور
    const fetchedCards = data.items.slice(0, 12).map(item => {
      // البحث عن صورة داخل الخبر أو استخدام صورة افتراضية أنيقة
      let imgUrl = item.thumbnail || (item.enclosure && item.enclosure.link);
      if (!imgUrl) {
        const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
        imgUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500';
      }

      const cleanText = item.description.replace(/<[^>]*>?/gm, '');

      return `
        <article class="news-card">
          <img src="${imgUrl}" alt="News Image" class="news-img">
          <div class="news-card-content">
            <span class="news-source">BBC News</span>
            <h3>${item.title}</h3>
            <p>${cleanText.substring(0, 110)}...</p>
            <div class="card-footer">
              <span class="news-date">${new Date(item.pubDate).toLocaleDateString()}</span>
              <a href="${item.link}" target="_blank" class="read-btn">Read story →</a>
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
