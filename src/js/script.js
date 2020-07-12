// import initFetchProdutos from './modules/fetch-produtos.js';
// import initAdicionarFavorito from './modules/adicionar-favorito.js';
// import initTrocarImagem from './modules/fetch-produtos.js';


function initAdicionarFavorito() {
  const favoritos = document.querySelectorAll('.product .info .title h1 a');
  
  
  function adicionarFavorito(event) {
    event.preventDefault();
    event.currentTarget.firstElementChild.classList.toggle('ativo');
  }
  
  
  favoritos.forEach(favorito => {
    favorito.addEventListener('click', adicionarFavorito)
  })
}

function initTrocarImagem() {
  const tabNav = document.querySelectorAll('.product .tab-nav ul li a');
  const uls = document.querySelectorAll('.product .tab-nav ul');

  uls.forEach(ul => {
    ul.firstElementChild.classList.add('ativo')
  })
  // lis[0].classList.add('ativo');
  
  function trocaImagem(event) {
    event.preventDefault();
    const target = event.currentTarget.firstElementChild;
    const ul = target.parentElement.parentElement.parentElement;
    
    const lis = ul.querySelectorAll('li')

    lis.forEach(li => {
      li.classList.remove('ativo')
    });

    const liSelecionado = target.parentElement.parentElement;
    liSelecionado.classList.add('ativo');


    const imagem = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].firstElementChild;

    imagem.src = target.src;
  }
  
  tabNav.forEach(item => {
    item.addEventListener('click', trocaImagem)
  })
}

function initAbrirCarrinho() {
  const carrinhoMenu = document.querySelector('header .cart a');
  const carrinho = document.querySelector('.carrinho');
  
  
  function abrirCarrinho(event) {
    event.preventDefault();
    carrinho.classList.toggle('ativo')
  }
  
  carrinhoMenu.addEventListener('click', abrirCarrinho);

}

function alimentaCarrinho(carts) {
  const carrinho = document.querySelector('.carrinho-items');
  carrinho.innerHTML = '';
  carts.forEach(cart => {    
    const urlImagem = cart.urlImagem;
    const name = cart.name;
    const installmentPrice = cart.installmentPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    const price = cart.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

    const divCarrinhoItem = document.createElement('div');
    divCarrinhoItem.classList.add('carrinho-item');

    divCarrinhoItem.innerHTML = `
    <div class="left">
      <div class="image-carrinho" style="background-image: url('${urlImagem}');">

      </div>
      <div class="info-carrinho">
        <h1 class="name-carrinho">${name}</h1>
        <h2 class="installments-carrinho">10x ${installmentPrice}</h2>
        <h2 class="price-carrinho">${price} à vista</h2>
      </div>
    </div>
    <a href="#">X</a>
    `;
    
    carrinho.appendChild(divCarrinhoItem);
  });
  initAbrirCarrinho();
}

function alimentaSubtotal(carts) {
  const carrinho = document.querySelector('.carrinho-items');

  const arrayTotal = carts.map(cart => cart.price);  
  const total = arrayTotal.reduce((acc, cur) => acc + cur);

  const totalConvertido = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  const totalParcelado = (total / 10).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

  
  const divSubtotal = document.createElement('div');
  divSubtotal.classList.add('subtotal');

  divSubtotal.innerHTML = `
  <div class="subtotal">
    <h2 class="subtotal-carrinho">subtotal</h2>
    <h2 class="subtotal-installments">10x de ${totalParcelado}</h2>
    <h2 class="subtotal-price">ou ${totalConvertido} à vista</h2>
  </div>`;

  carrinho.appendChild(divSubtotal);
}

function alimentaQuantidade(quantidade) {
  const qtde = document.querySelector('header .cart .qtde span');
  qtde.innerText = cart.length;

  if (quantidade) {
    qtde.parentElement.classList.remove('hide');
  } else {
    qtde.parentElement.classList.add('hide');
  }
}

let cart = [];
function initCarrinho() {
  function btnClique(event) {
    const target = event.currentTarget;
    const targetPai = target.parentElement.parentElement.parentElement;

    const urlImagem = targetPai.querySelectorAll('.tab-nav ul li a img')[0].src;
    const name = targetPai.querySelector('.info .title h1').innerText;
    const installmentPrice = +(targetPai.querySelector('.info .prices h2 .parcelado').innerText.replace(',', '.'));
    const price = +(targetPai.querySelector('.info .prices h3 span').innerText.replace('R$', '').replace('.', '').replace(',', '.'));

    const arrayNomes = cart.map(item => item.name).includes(name);
    if (!arrayNomes) {
      cart.push({
        urlImagem: urlImagem,
        name: name,
        installmentPrice: installmentPrice,
        price: price
      });
      alimentaCarrinho(cart);
      alimentaSubtotal(cart);
      alimentaQuantidade(cart.length);
    } else {
      event.currentTarget.firstElementChild.innerText = "Já foi adicionado!";
    }
   

    const btnsExcluir = document.querySelectorAll('.carrinho-item a');
    btnsExcluir.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
      
        const elementoPai = event.currentTarget.parentElement;
  
        const urlImagem = elementoPai.querySelector('.image-carrinho').getAttribute('style').replace("background-image: url('", "").replace("');", "");
        const name = elementoPai.querySelector('h1.name-carrinho').innerText;
        const price = parseFloat(elementoPai.querySelector('h2.price-carrinho').innerText.split(' ')[0].split('R$')[1].replace('.', '').replace(',', '.'));
        const installmentPrice = parseFloat(elementoPai.querySelector('h2.installments-carrinho').innerText.split(' ')[1].split('R$')[1].replace('.', '').replace(',', '.'));
  
        const mascara = {
          urlImagem,
          name,
          installmentPrice,
          price,
        }
  
        const indexCart = cart.findIndex((item)=> item.urlImagem == mascara.urlImagem);
        cart.splice(indexCart, 1);
        alimentaCarrinho(cart);
        alimentaSubtotal(cart);
        alimentaQuantidade(cart.length);
      })
    })
    
    function excluirItem(event) {
      console.log(event.currentTarget)
      event.preventDefault();
      
      const elementoPai = event.currentTarget.parentElement;

      const urlImagem = elementoPai.querySelector('.image-carrinho').getAttribute('style').replace("background-image: url('", "").replace("');", "");
      const name = elementoPai.querySelector('h1.name-carrinho').innerText;
      const price = parseFloat(elementoPai.querySelector('h2.price-carrinho').innerText.split(' ')[0].split('R$')[1].replace('.', '').replace(',', '.'));
      const installmentPrice = parseFloat(elementoPai.querySelector('h2.installments-carrinho').innerText.split(' ')[1].split('R$')[1].replace('.', '').replace(',', '.'));

      const mascara = {
        urlImagem,
        name,
        installmentPrice,
        price,
      }

      const indexCart = cart.findIndex((item)=> item.urlImagem == mascara.urlImagem);
      cart.splice(indexCart, 1);
      alimentaCarrinho(cart);
      alimentaSubtotal(cart);
      alimentaQuantidade(cart.length);
    }
  }

  const btnsAdicionarAoCarrinho = document.querySelectorAll('.add-carrinho');
  btnsAdicionarAoCarrinho.forEach(btn => {
    btn.addEventListener('click', btnClique)
  })
}



async function fetchProdutos(url) {
  const fetchData = fetch(url);
  const dataJSON = await (await fetchData).json();
  const items = dataJSON.items;

  const divProducts = document.querySelector('.products');


  items.forEach(item => {
    const product = item.product;
    const name = product.name;
    const images = product.images;
    const price = (product.price.value).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    const installments = product.price.installments;
    const installmentPrice = (product.price.installmentValue).toFixed(2).replace('.', ',');



    
    const divProduct = document.createElement('div');
    divProduct.classList.add('product');


    // Criando a div.tab-nav
    const divTabNav = document.createElement('div');
    divTabNav.classList.add('tab-nav');

    const ul = document.createElement('ul');
    images.forEach(image => {
      const li = document.createElement('li');
      li.innerHTML = 
      `<a href="#">
        <img src="${image}">
      </a>`;
      ul.appendChild(li);
    })

    divTabNav.appendChild(ul);



    // Criando a div.img
    const divImg = document.createElement('div');
    divImg.classList.add('img');

    divImg.innerHTML = `<img src="${images[0]}" alt="${name}">`



    // Criando a div.info
    const divInfo = document.createElement('div');
    divInfo.classList.add('info');
    divInfo.innerHTML = `
    <div class="title">
      <h1>${name} <a href="#"><div></div></a></h1>
    </div>
     <div class="prices">
    <div class="price">
            <h2>
              <span class="parcelas">
                <span class="parcela">
                  ${installments}</span>x R$
              </span>
              <span class="parcelado">
                ${installmentPrice}
              </span>
            </h2>
            <h3>ou <span class="a-vista">${price}</span> à vista</h3>
          </div>
          <div class="add-carrinho">
            <button>Adicionar ao carrinho</button>
          </div>`



    divProduct.appendChild(divTabNav);
    divProduct.appendChild(divImg);
    divProduct.appendChild(divInfo);
    divProducts.appendChild(divProduct);
  });
  initAdicionarFavorito();
  initTrocarImagem();
  initCarrinho();
}

fetchProdutos('../resources/data.json');