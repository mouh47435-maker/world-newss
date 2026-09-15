const search=document.getElementById('search');
search?.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();document.querySelectorAll('article').forEach(a=>{a.style.display=(!q||a.innerText.toLowerCase().includes(q))?'':'none'})});
