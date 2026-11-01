const $=id=>document.getElementById(id);
const K="rp_users",S="rp_session";
const rd=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}};
const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const b64=u=>btoa(String.fromCharCode(...u));
const unb=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function hash(pw,salt){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]);return b64(new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:100000,hash:"SHA-256"},k,256)))}
let mode="up";
function setMode(m){mode=m;const up=m==="up";$("tUp").setAttribute("aria-selected",up);$("tIn").setAttribute("aria-selected",!up);$("nmw").style.display=up?"":"none";$("sb").textContent=up?"Criar conta":"Entrar";$("dt").textContent=up?"Crie sua conta":"Bem-vindo de volta";$("pw").autocomplete=up?"new-password":"current-password";$("msg").textContent=""}
function openD(m){setMode(m);$("dlg").showModal();(m==="up"?$("nm"):$("em")).focus()}
const err=m=>{$("msg").textContent=m};
$("tUp").onclick=()=>setMode("up");$("tIn").onclick=()=>setMode("in");
$("cl").onclick=()=>$("dlg").close();
$("heroCta").onclick=()=>openD("up");
function auth(){
const s=rd(S),n=$("navauth");n.textContent="";
if(s){const h=document.createElement("span");h.className="hi";h.textContent="Olá, "+s.n.split(" ")[0];const b=document.createElement("button");b.className="btn sm ghost";b.type="button";b.textContent="Sair";b.onclick=()=>{try{localStorage.removeItem(S)}catch(e){}auth()};n.append(h,b)}
else{const b=document.createElement("button");b.className="btn sm";b.type="button";b.textContent="Entrar";b.onclick=()=>openD("in");n.append(b)}
$("heroCta").style.display=s?"none":""}
$("af").onsubmit=async e=>{e.preventDefault();
const em=$("em").value.trim().toLowerCase(),pw=$("pw").value,nm=$("nm").value.trim();
if(mode==="up"&&!nm)return err("Digite seu nome.");
if(!/^\S+@\S+\.\S+$/.test(em))return err("Digite um e-mail válido, como nome@email.com.");
if(mode==="up"&&pw.length<6)return err("A senha precisa ter pelo menos 6 caracteres.");
if(!pw)return err("Digite sua senha.");
if(!(window.crypto&&crypto.subtle))return err("Este navegador não permite criar contas aqui. Abra a página em uma conexão segura (https).");
const db=rd(K)||{};
if(mode==="up"){
if(db[em])return err("Este e-mail já tem conta. Toque em Entrar e use sua senha.");
const salt=crypto.getRandomValues(new Uint8Array(16));
db[em]={n:nm,s:b64(salt),h:await hash(pw,salt)};
if(!wr(K,db))return err("Não foi possível salvar a conta neste navegador.")}
else{const u=db[em];if(!u||u.h!==await hash(pw,unb(u.s)))return err("E-mail ou senha incorretos.")}
wr(S,{e:em,n:db[em].n});$("af").reset();$("dlg").close();auth()};
auth();
const P=[["Marina S.",820,"#FF5470"],["Pedro H.",640,"#12B886"],["Júlia M.",510,"#FFB800"],["Caio R.",380,"#0C7C78"],["Bia L.",260,"#FF7A45"]];
document.getElementById("board").innerHTML=P.map((p,k)=>`<div class="row"><span class="pos">${k+1}</span><span class="av" style="background:${p[2]}">${p[0][0]}</span><span class="nm">${p[0]}</span><span class="xp">${p[1]} XP</span></div>`).join("");
