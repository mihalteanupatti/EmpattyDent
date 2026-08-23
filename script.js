const BACKEND_URL='https://script.google.com/macros/s/AKfycbzZLW-tiw9nZe7cobcWooy4yk3kiMXWpzWWayWrR4MFolTkxUq6KtUJanzbKEmR_RO1/exec';
const CART_KEY='empattydent_cart_v1';
let cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]');
const drawer=document.querySelector('.cart-drawer'),overlay=document.querySelector('.overlay'),items=document.querySelector('.cart-items'),count=document.querySelector('.cart-count'),total=document.querySelector('.cart-total'),toast=document.querySelector('.toast'),checkoutModal=document.querySelector('.checkout-modal');
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart))}
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
function renderCart(){
  const qty=cart.reduce((s,x)=>s+x.qty,0); count.textContent=qty;
  const sum=cart.reduce((s,x)=>s+x.price*x.qty,0); total.textContent=`${sum} lei`;
  items.innerHTML=cart.length?cart.map((item,i)=>`<div class="cart-item"><div><b>${item.name}</b><div class="qty"><button data-dec="${i}" aria-label="Scade cantitatea">−</button><span>${item.qty}</span><button data-inc="${i}" aria-label="Crește cantitatea">+</button><button class="remove" data-remove="${i}">Elimină</button></div></div><strong>${item.price*item.qty} lei</strong></div>`).join(''):'<p class="empty">Coșul tău este gol.</p>';
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);saveCart();renderCart()});
  document.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{cart[+b.dataset.inc].qty++;saveCart();renderCart()});
  document.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{const i=+b.dataset.dec;if(cart[i].qty>1)cart[i].qty--;else cart.splice(i,1);saveCart();renderCart()});
}
function toggleCart(open){drawer.classList.toggle('open',open);overlay.classList.toggle('open',open);drawer.setAttribute('aria-hidden',!open)}
function openCheckout(){
  if(!cart.length){showToast('Adaugă cel puțin un produs în coș.');return}
  toggleCart(false);checkoutModal.classList.add('open');checkoutModal.setAttribute('aria-hidden','false');
  document.getElementById('order-products').textContent=cart.map(x=>`${x.name} × ${x.qty}`).join(', ');
  document.getElementById('order-total').textContent=`${cart.reduce((s,x)=>s+x.price*x.qty,0)} lei`;
}
function closeCheckout(){checkoutModal.classList.remove('open');checkoutModal.setAttribute('aria-hidden','true')}
document.querySelector('.cart-button').onclick=()=>toggleCart(true);
document.querySelector('.close-cart').onclick=()=>toggleCart(false);
overlay.onclick=()=>toggleCart(false);
document.querySelector('.checkout').onclick=openCheckout;
document.querySelector('.close-checkout').onclick=closeCheckout;
document.querySelector('.close-success').onclick=closeCheckout;
checkoutModal.addEventListener('click',e=>{if(e.target===checkoutModal)closeCheckout()});

const PRODUCT_DATA={
  'clasa-ii':{
    category:'MODEL PENTRU RESTAURARE',title:'Restaurări clasa a II-a',image:'assets/restaurari-clasa-ii-albastru.png',thumbs:['assets/restaurari-clasa-ii-albastru.png','assets/restaurari-clasa-ii-crem.png'],
    description:'Model anatomic imprimat 3D din rășină, realizat în producție proprie și conceput pentru exercițiu repetat și control precis.',
    body:`<h3>Acest model este conceput pentru a te ajuta să exersezi:</h3><ul><li>Controlul profunzimii</li><li>Adaptarea compozitului</li><li>Anatomia ocluzală</li><li>Finisarea și lustruirea</li></ul><p>Modelul este printat din rășină, în producție proprie, cu detalii fine care îți permit să lucrezi repetat într-un mediu controlat.</p><p>Este potrivit pentru studenți și medici stomatologi care vor să exerseze în afara clinicii și să își îmbunătățească îndemânarea prin repetiție.</p>`,
    packs:[['1 bucată',30],['3 bucăți',80],['6 bucăți',160]]
  },
  'clasa-i-maxilar':{
    category:'MODEL PENTRU RESTAURARE',title:'Restaurări clasa I — maxilar',image:'assets/restaurari-clasa-i-maxilar.png',thumbs:['assets/restaurari-clasa-i-maxilar.png'],
    description:'Model anatomic maxilar imprimat 3D din rășină, cu detalii fine și produs în atelierul EmpattyDent pentru practică repetată.',
    body:`<h3>Acest model este conceput pentru a te ajuta să exersezi:</h3><ul><li>Controlul profunzimii</li><li>Adaptarea compozitului</li><li>Anatomia ocluzală</li><li>Finisarea și lustruirea</li></ul><p>Este potrivit pentru studenți și medici stomatologi care vor să practice în afara clinicii și să își îmbunătățească îndemânarea prin repetiție.</p>`,
    packs:[['1 bucată',30],['3 bucăți',80],['6 bucăți',160]]
  },
  'clasa-i-mandibula':{
    category:'MODEL PENTRU RESTAURARE',title:'Restaurări clasa I — mandibulă',image:'assets/restaurari-clasa-i-mandibula.png',thumbs:['assets/restaurari-clasa-i-mandibula.png'],
    description:'Model anatomic mandibular imprimat 3D din rășină, cu detalii fine, realizat în producție proprie pentru antrenament precis și repetabil.',
    body:`<h3>Acest model este conceput pentru a te ajuta să exersezi:</h3><ul><li>Controlul profunzimii</li><li>Adaptarea compozitului</li><li>Anatomia ocluzală</li><li>Finisarea și lustruirea</li></ul><p>Este potrivit pentru studenți și medici stomatologi care vor să practice în afara clinicii și să își îmbunătățească îndemânarea prin repetiție.</p>`,
    packs:[['1 bucată',30],['3 bucăți',80],['6 bucăți',160]]
  },
  'kit':{
    category:'KIT COMPLET DE PRACTICĂ',title:'Kit complet pentru restaurări dentare',image:'assets/kit-restaurari.png',thumbs:['assets/kit-restaurari.png'],
    description:'Tot ce ai nevoie pentru a începe să exersezi restaurările dentare acasă, într-un singur kit.',
    body:`<h3>Kitul conține:</h3><ul><li>5 modele printate din rășină</li><li>2 spatule pentru restaurări</li><li>Lampă UV</li><li>Compozit</li><li>Pene</li><li>Matrici</li><li>Pensulă pentru modelat</li><li><strong>Cartea tipărită „Dexteritate & lucru în oglindă” — gratuit</strong></li></ul><p>Modelele sunt produse în regim propriu, prin imprimare 3D din rășină, cu detalii fine pentru exercițiu și repetiție.</p>`,
    packs:[['Kit complet',450]]
  },
  'carte':{
    category:'CARTE DE PRACTICĂ',title:'Dexteritate & lucru în oglindă',image:'assets/ebook-dexteritate.png',thumbs:['assets/ebook-dexteritate.png'],
    description:'Cartea tipărită de exerciții pentru studenți și medici stomatologi care vor să își dezvolte precizia și controlul mâinii.',
    body:`<h3>De ce este importantă practica?</h3><p>Stomatologia este o profesie în care îndemânarea se construiește prin exercițiu. Cartea te ajută să repeți mișcări, trasee, simetrii și exerciții de control înainte de a le aplica în cabinet.</p><p>Este o resursă fizică, tipărită, pe care o poți folosi ori de câte ori ai nevoie de câteva minute de antrenament.</p>`,
    packs:[['1 carte tipărită',79]]
  }
};

const productModal=document.querySelector('.product-modal');
const detailImage=document.getElementById('detail-image');
const detailThumbs=document.getElementById('detail-thumbs');
const detailCategory=document.getElementById('detail-category');
const detailTitle=document.getElementById('detail-title');
const detailDescription=document.getElementById('detail-description');
const detailBody=document.getElementById('detail-body');
const detailOptions=document.getElementById('detail-options');
const detailPrice=document.getElementById('detail-price');
const detailAdd=document.getElementById('detail-add');
let activeProduct=null;
let activePack=null;

function addToCart(name,price){const existing=cart.find(x=>x.name===name);if(existing)existing.qty++;else cart.push({name,price,qty:1});saveCart();renderCart();showToast('Produs adăugat în coș')}

document.querySelectorAll('.add').forEach(button=>button.onclick=()=>{
  const product=button.dataset.product;
  if(product==='kit'){addToCart('Kit complet pentru restaurări dentare',450);return}
});

function openProduct(productKey){
  const p=PRODUCT_DATA[productKey]; if(!p)return;
  activeProduct=productKey; activePack=0;
  detailCategory.textContent=p.category;detailTitle.textContent=p.title;detailDescription.textContent=p.description;detailBody.innerHTML=p.body;
  detailImage.src=p.image;detailImage.alt=p.title;
  detailThumbs.innerHTML=p.thumbs.map((src,i)=>`<button class="detail-thumb ${i===0?'active':''}" data-src="${src}" aria-label="Vezi imaginea ${i+1}"><img src="${src}" alt=""></button>`).join('');
  detailThumbs.querySelectorAll('.detail-thumb').forEach(b=>b.onclick=()=>{detailThumbs.querySelectorAll('.detail-thumb').forEach(x=>x.classList.remove('active'));b.classList.add('active');detailImage.src=b.dataset.src});
  detailOptions.innerHTML=p.packs.map((pack,i)=>`<button class="pack-option ${i===0?'active':''}" data-pack="${i}"><span>${pack[0]}</span><strong>${pack[1]} lei</strong></button>`).join('');
  detailOptions.querySelectorAll('.pack-option').forEach(b=>b.onclick=()=>{activePack=+b.dataset.pack;detailOptions.querySelectorAll('.pack-option').forEach(x=>x.classList.remove('active'));b.classList.add('active');detailPrice.textContent=`${p.packs[activePack][1]} lei`});
  detailPrice.textContent=`${p.packs[0][1]} lei`;
  detailAdd.onclick=()=>{const [label,price]=p.packs[activePack];addToCart(`${p.title} — ${label}`,price);closeProduct()};
  productModal.classList.add('open');productModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  history.replaceState(null,'',`#produs-${productKey}`);
}
function closeProduct(){productModal.classList.remove('open');productModal.setAttribute('aria-hidden','true');document.body.style.overflow='';if(location.hash.startsWith('#produs-'))history.replaceState(null,'',location.pathname+location.search)}
document.querySelectorAll('.details').forEach(b=>b.onclick=()=>openProduct(b.dataset.product));
document.querySelectorAll('.product-card[data-product]').forEach(card=>{card.style.cursor='pointer';card.addEventListener('click',e=>{if(e.target.closest('button,a'))return;openProduct(card.dataset.product)});});
document.querySelector('.close-product').onclick=closeProduct;
productModal.addEventListener('click',e=>{if(e.target===productModal)closeProduct()});

document.querySelectorAll('.filters button').forEach(button=>button.onclick=()=>{document.querySelector('.filters .active').classList.remove('active');button.classList.add('active');document.querySelectorAll('.product-card').forEach(card=>card.style.display=button.dataset.filter==='all'||card.dataset.category===button.dataset.filter?'block':'none')});
document.querySelector('.menu-btn').onclick=e=>{const nav=document.querySelector('.header nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',nav.classList.contains('open'))};

document.querySelector('.newsletter form').onsubmit=async e=>{
  e.preventDefault();const email=document.getElementById('email').value.trim().toLowerCase();
  try{await fetch(BACKEND_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({type:'newsletter',email})});e.currentTarget.reset();showToast('Mulțumim! Te-ai abonat cu succes.')}catch(err){showToast('Nu am putut înregistra abonarea. Încearcă din nou.')}
};

document.getElementById('order-form').onsubmit=async e=>{
  e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const products=cart.map(x=>`${x.name} × ${x.qty}`).join(' | ');const totalValue=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const payload={type:'order',client:data.get('client'),phone:data.get('phone'),email:data.get('email'),county:data.get('county'),city:data.get('city'),address:data.get('address'),products,total:String(totalValue),notes:data.get('notes')||''};
  const button=form.querySelector('.order-submit');button.disabled=true;button.innerHTML='Se trimite…';
  try{await fetch(BACKEND_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams(payload)});form.hidden=true;document.querySelector('.order-success').hidden=false;cart=[];saveCart();renderCart()}catch(err){showToast('Comanda nu a putut fi trimisă. Încearcă din nou.')}finally{button.disabled=false;button.innerHTML='Trimite comanda <span>→</span>'}
};
renderCart();
