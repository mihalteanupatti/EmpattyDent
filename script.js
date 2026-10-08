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

document.querySelectorAll('.add').forEach(button=>button.onclick=()=>{
  const name=button.dataset.name,price=+button.dataset.price;const existing=cart.find(x=>x.name===name);
  if(existing)existing.qty++;else cart.push({name,price,qty:1});saveCart();renderCart();showToast('Produs adăugat în coș');
});

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
