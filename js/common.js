// Shared UI helpers (no modules, classic script)
window.toast = function(msg, kind){
  let w = document.getElementById("toast-wrap");
  if(!w){ w = document.createElement("div"); w.id="toast-wrap"; w.className="toast-wrap"; document.body.appendChild(w); }
  const t = document.createElement("div");
  t.className = "toast " + (kind||"");
  t.textContent = msg;
  w.appendChild(t);
  setTimeout(()=>t.remove(), 3500);
};

window.applyTheme = function(){
  const t = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("light", t === "light");
};
window.toggleTheme = function(){
  const cur = localStorage.getItem("theme") || "dark";
  localStorage.setItem("theme", cur === "dark" ? "light" : "dark");
  window.applyTheme();
  // propagate to all iframes
  document.querySelectorAll("iframe").forEach(f=>{
    try{ f.contentWindow.postMessage({type:"theme"}, "*"); }catch(e){}
  });
};
window.addEventListener("message", e=>{
  if(e.data && e.data.type==="theme") window.applyTheme();
});
window.applyTheme();

// number / date utils
window.fmtINR = n => "₹" + (Number(n||0)).toLocaleString("en-IN",{maximumFractionDigits:2});
window.monthName = m => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][(m-1)|0];
window.todayISO = ()=> new Date().toISOString().slice(0,10);
window.thisYM = ()=>{ const d=new Date(); return {y:d.getFullYear(), m:d.getMonth()+1}; };
