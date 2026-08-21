(()=>{
const P=window.EQUARROW_PUZZLES;if(!P)return;
const q=new URLSearchParams(location.search),req=q.get('p')||'004',id=P[req]?req:'004',key='equarrow-progress:'+id;
const board=document.getElementById('board'),timer=document.getElementById('timer'),message=document.getElementById('message'),win=document.getElementById('win'),reset=document.getElementById('reset'),check=document.getElementById('check'),undo=document.getElementById('undo'),redo=document.getElementById('redo'),autosave=document.getElementById('autosaveNote');
if(!board||!reset||!undo||!redo)return;
const T={
 en:{undo:'Undo',redo:'Redo',reset:'Reset puzzle',saved:'Progress saves automatically',restored:'Progress restored.',confirm:'Reset this puzzle? Your current progress will be cleared.'},
 pl:{undo:'Cofnij',redo:'Ponów',reset:'Resetuj łamigłówkę',saved:'Postęp zapisuje się automatycznie',restored:'Przywrócono postęp.',confirm:'Zresetować łamigłówkę? Bieżący postęp zostanie usunięty.'},
 es:{undo:'Deshacer',redo:'Rehacer',reset:'Reiniciar puzzle',saved:'El progreso se guarda automáticamente',restored:'Progreso restaurado.',confirm:'¿Reiniciar este puzzle? Se borrará tu progreso actual.'},
 de:{undo:'Rückgängig',redo:'Wiederholen',reset:'Puzzle zurücksetzen',saved:'Fortschritt wird automatisch gespeichert',restored:'Fortschritt wiederhergestellt.',confirm:'Dieses Puzzle zurücksetzen? Dein aktueller Fortschritt wird gelöscht.'},
 fr:{undo:'Annuler',redo:'Rétablir',reset:'Réinitialiser la grille',saved:'La progression est enregistrée automatiquement',restored:'Progression restaurée.',confirm:'Réinitialiser cette grille ? Votre progression actuelle sera effacée.'}
};
function lang(){const s=document.querySelector('[data-language-select]'),v=(s&&s.value)||document.documentElement.lang||localStorage.getItem('equarrow-language')||'en';return (v||'en').slice(0,2)}function tr(){return T[lang()]||T.en}
const glyphToCode={'↖':'NW','↗':'NE','↙':'SW','↘':'SE','←':'L','→':'R','↑':'U','↓':'D'};
const codeToDiag={NW:'NW',NE:'NE',SW:'SW',SE:'SE'},codeToNote={L:'L',R:'R',U:'U',D:'D'};
let history=[],future=[],restoring=false,finished=false,baseElapsed=0,sessionStarted=Date.now(),clockId=null;
function cells(){return [...board.querySelectorAll('.cell')]}
function snap(){return cells().map(c=>{if(c.classList.contains('given'))return '';const n=c.querySelector('.cell-note');if(n)return glyphToCode[n.textContent.trim()]||'';return glyphToCode[c.textContent.trim()]||''})}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function active(a=snap()){return a.some(Boolean)}
function elapsed(){return baseElapsed+(Date.now()-sessionStarted)}
function fmt(ms){const s=Math.max(0,Math.floor(ms/1000));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function paintClock(){if(!finished)timer.textContent=fmt(elapsed())}
function save(a=snap()){if(finished){localStorage.removeItem(key);return}if(active(a))localStorage.setItem(key,JSON.stringify({cells:a,elapsedMs:elapsed(),savedAt:Date.now()}));else localStorage.removeItem(key)}
function buttons(){undo.disabled=finished||history.length<2;redo.disabled=finished||future.length===0}
function labels(){const z=tr();undo.textContent='↶ '+z.undo;redo.textContent='↷ '+z.redo;reset.textContent=z.reset;if(autosave)autosave.textContent=z.saved}
function showRestored(){if(!message)return;message.textContent=tr().restored;message.classList.add('show');setTimeout(()=>{if(message.textContent===tr().restored)message.classList.remove('show')},1800)}
function select(i){const c=cells()[i];if(c&&!c.classList.contains('given'))c.click()}
function eraseAt(i){select(i);document.querySelector('.pick[data-d=""]')?.click()}
function placeAt(i,code){select(i);if(codeToDiag[code])document.querySelector(`.pick[data-d="${code}"]`)?.click();else if(codeToNote[code])document.querySelector(`.note-pick[data-note="${code}"]`)?.click()}
function restore(a){restoring=true;const now=snap();for(let i=0;i<16;i++)if(now[i])eraseAt(i);for(let i=0;i<16;i++)if(a[i])placeAt(i,a[i]);restoring=false;save(a);buttons()}
function record(){if(restoring||finished)return;const a=snap(),last=history[history.length-1];if(!last||!same(a,last)){history.push(a);if(history.length>120)history.shift();future=[];save(a);buttons()}}
function scheduleRecord(){if(restoring||finished)return;setTimeout(record,0)}
document.querySelectorAll('.pick,.note-pick').forEach(b=>b.addEventListener('click',scheduleRecord));
undo.onclick=()=>{if(history.length<2||finished)return;future.push(history.pop());restore(history[history.length-1])};
redo.onclick=()=>{if(!future.length||finished)return;const a=future.pop();history.push(a);restore(a)};
const originalReset=reset.onclick;reset.onclick=e=>{if(restoring)return originalReset&&originalReset.call(reset,e);const a=snap();if(active(a)&&!window.confirm(tr().confirm))return;localStorage.removeItem(key);history=[];future=[];baseElapsed=0;sessionStarted=Date.now();finished=false;const out=originalReset&&originalReset.call(reset,e);setTimeout(()=>{history=[snap()];buttons();paintClock()},0);return out};
if(check){check.addEventListener('click',paintClock,true);check.addEventListener('click',()=>setTimeout(()=>{if(win&&win.classList.contains('show')){finished=true;clearInterval(clockId);localStorage.removeItem(key);buttons()}},0))}
window.addEventListener('beforeunload',()=>{if(!finished)save()});
document.addEventListener('equarrow-language-change',labels);
let saved=null;try{saved=JSON.parse(localStorage.getItem(key)||'null')}catch(e){localStorage.removeItem(key)}
const initial=snap();if(saved&&Array.isArray(saved.cells)&&saved.cells.length===16){baseElapsed=Number(saved.elapsedMs)||0;sessionStarted=Date.now();restore(saved.cells);history=[saved.cells.slice()];showRestored()}else history=[initial];
labels();buttons();paintClock();clockId=setInterval(paintClock,250);
})();
