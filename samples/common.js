(function(){
  const p=x=>String(x).padStart(2,'0'), d=['日','月','火','水','木','金','土'];
  function tick(){const n=new Date(Date.now()+9*3600e3);
    document.querySelectorAll('[data-time]').forEach(e=>e.textContent=p(n.getUTCHours())+':'+p(n.getUTCMinutes())+':'+p(n.getUTCSeconds()));
    document.querySelectorAll('[data-date]').forEach(e=>e.textContent=n.getUTCFullYear()+'.'+p(n.getUTCMonth()+1)+'.'+p(n.getUTCDate())+' ('+d[n.getUTCDay()]+')');}
  tick(); setInterval(tick,1000);
  const nu=document.querySelector('.nu'); if(nu){setInterval(()=>{nu.classList.remove('hop');void nu.offsetWidth;nu.classList.add('hop');},7000);}
})();
