(()=>{
const P=window.EQUARROW_PUZZLES;
const SYM={NW:'↖',NE:'↗',SW:'↙',SE:'↘'},LEFT=d=>d==='NW'||d==='SW',UP=d=>d==='NW'||d==='NE';
const qs=new URLSearchParams(location.search),requested=qs.get('p')||'004',id=P[requested]?requested:'004',p=P[id];
const diffSlug=p.difficulty.toLowerCase()+'-puzzles.html';
document.title=`EQUARROW · ${p.difficulty} ${id}`;
document.getElementById('title').textContent='Puzzle '+id;document.getElementById('subtitle').textContent=p.subtitle;
document.getElementById('diffPill').textContent=p.difficulty;document.getElementById('crumbDiff').textContent=p.difficulty;document.getElementById('crumbDiff').href=diffSlug;document.getElementById('crumbPuzzle').textContent=id;
document.getElementById('backDiff').href=diffSlug;document.getElementById('backDiff').textContent='← All '+p.difficulty+' puzzles';document.getElementById('allDiff').href=diffSlug;document.getElementById('allDiff').textContent='All '+p.difficulty;
const ids=Object.keys(P).filter(k=>P[k].difficulty===p.difficulty).sort(),pos=ids.indexOf(id),next=ids[pos+1]||null;
const nextEl=document.getElementById('nextPuzzle');if(next)nextEl.href='play.html?p='+next;else{nextEl.href=diffSlug;nextEl.textContent='Back to '+p.difficulty;}
let grid,selected=null,start=Date.now(),done=false,timerId;const givens=new Set(p.givens.map(x=>x.join(',')));
const board=document.getElementById('board'),rows=document.getElementById('rows'),cols=document.getElementById('cols'),status=document.getElementById('status'),timer=document.getElementById('timer'),message=document.getElementById('message'),win=document.getElementById('win');
const inward=(rr,cc)=>rr===0?(cc===0?'SE':'SW'):(cc===0?'NE':'NW');
function initial(){grid=Array.from({length:4},()=>Array(4).fill(''));p.givens.forEach(([r,c])=>grid[r][c]=p.solution[r][c]);}
function fmt(ms){const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function tick(){if(!done)timer.textContent=fmt(Date.now()-start)}
function dotInfo(r,c){let n=0,f=0;for(let rr=0;rr<2;rr++)for(let cc=0;cc<2;cc++){const d=grid[r+rr][c+cc];if(d){f++;if(d===inward(rr,cc))n++}}return{n,f}}
function conflicts(){const out=[];for(let r=0;r<4;r++){const v=grid[r].filter(Boolean),l=v.filter(LEFT).length;if(l>2||v.length-l>2)out.push(`Row ${r+1} has too many arrows pointing one way.`)}for(let c=0;c<4;c++){const v=grid.map(x=>x[c]).filter(Boolean),u=v.filter(UP).length;if(u>2||v.length-u>2)out.push(`Column ${c+1} has too many arrows pointing one way.`)}for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=dotInfo(r,c);if(x.n>1)out.push('An interior dot has more than one arrow pointing at it.');if(x.f===4&&x.n!==1)out.push('A completed interior dot does not have exactly one incoming arrow.')}return out}
function stats(){rows.innerHTML='';cols.innerHTML='';for(let r=0;r<4;r++){const v=grid[r].filter(Boolean),l=v.filter(LEFT).length;rows.innerHTML+=`<div class="stat"><b>${l}L · ${v.length-l}R</b>need 2/2</div>`}for(let c=0;c<4;c++){const v=grid.map(x=>x[c]).filter(Boolean),u=v.filter(UP).length;cols.innerHTML+=`<div class="stat"><b>${u}U · ${v.length-u}D</b>need 2/2</div>`}}
function render(){board.innerHTML='';for(let r=0;r<4;r++)for(let c=0;c<4;c++){const b=document.createElement('button');b.className='cell';if(givens.has(`${r},${c}`))b.classList.add('given');if(selected&&selected[0]===r&&selected[1]===c)b.classList.add('selected');b.textContent=grid[r][c]?SYM[grid[r][c]]:'';b.onclick=()=>{if(!givens.has(`${r},${c}`)){selected=[r,c];message.classList.remove('show');render()}};board.appendChild(b)}for(let r=1;r<4;r++)for(let c=1;c<4;c++){const d=document.createElement('i'),x=dotInfo(r-1,c-1);d.className='dot';d.style.left=`${c*25}%`;d.style.top=`${r*25}%`;if(x.n>1||(x.f===4&&x.n!==1))d.classList.add('bad');else if(x.f===4&&x.n===1)d.classList.add('good');board.appendChild(d)}stats();const bad=conflicts().length,filled=grid.flat().filter(Boolean).length;status.className='status'+(bad?' bad':'');status.textContent=bad?'Rule conflict':`${filled}/16 filled`}
document.querySelectorAll('.pick').forEach(b=>b.onclick=()=>{if(!selected){status.textContent='Select a square';return}const[r,c]=selected;if(givens.has(`${r},${c}`))return;grid[r][c]=b.dataset.d;win.classList.remove('show');message.classList.remove('show');render()});
function exactSolved(){return grid.flat().every(Boolean)&&grid.every((row,r)=>row.every((d,c)=>d===p.solution[r][c]))}
function saveSolved(t){let best=t;try{const old=JSON.parse(localStorage.getItem('equarrow:'+id)||'{}');if(old.best){const sec=x=>{const[a,b]=x.split(':').map(Number);return a*60+b};if(sec(old.best)<sec(t))best=old.best;}}catch(e){}localStorage.setItem('equarrow:'+id,JSON.stringify({solved:true,best}));return best}
function finish(){done=true;clearInterval(timerId);tick();const t=timer.textContent,best=saveSolved(t);status.className='status good';status.textContent='Solved!';document.getElementById('winText').innerHTML=`Time <strong>${t}</strong>${best!==t?` · Best <strong>${best}</strong>`:''}`;win.classList.add('show')}
document.getElementById('check').onclick=()=>{const bad=conflicts();if(bad.length){message.textContent=bad[0];message.classList.add('show');return}if(exactSolved())finish();else{message.textContent=grid.flat().some(x=>!x)?'No conflicts so far. Keep going.':'The board is full, but at least one arrow is not part of the unique solution.';message.classList.add('show')}};
document.getElementById('reset').onclick=()=>{initial();selected=null;done=false;start=Date.now();clearInterval(timerId);timerId=setInterval(tick,1000);win.classList.remove('show');message.classList.remove('show');render();tick()};
initial();timerId=setInterval(tick,1000);tick();render();
})();
