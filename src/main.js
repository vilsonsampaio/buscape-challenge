class App {
  constructor() {
    this.cart = [];

    this.productsDiv = document.querySelector('.products');
    
    this.cartMenu = document.querySelector('header .cart a');
    this.cartDiv = document.querySelector('.carrinho');
  }

  async addProducts() {
    try {
      const productsResponse = await fetch('./resources/data.json');
      const productsJSON = await productsResponse.json();
      
      const products = productsJSON.items;

      products.forEach(item => {
        let { name, images, price: { value: price, installments, installmentValue: installmentPrice } } = item.product;

        // Passando o price para o padrão da moeda R$
        price = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        installmentPrice = installmentPrice.toFixed(2).replace('.', ',');


        // Criando a div product
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');


        // Criando a div.tab-nav
        const imageNavDiv = document.createElement('div');
        imageNavDiv.classList.add('tab-nav');

        const ul = document.createElement('ul');
        images.forEach(image => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="#">
              <img src="${image}">
            </a>
          `;
          ul.appendChild(li);
        })

        imageNavDiv.appendChild(ul);



        // Criando a div.img
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img');

        imgDiv.innerHTML = `<img src="${images[0]}" alt="${name}">`



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
                  <span class="parcela">${installments}</span>x R$
                </span>
                <span class="parcelado">
                  ${installmentPrice}
                </span>
              </h2>
              <h3>ou <span class="a-vista">${price}</span> à vista</h3>
            </div>
            <div class="add-carrinho">
              <button>Adicionar ao carrinho</button>
            </div>
          </div>
        `;



        productDiv.appendChild(imageNavDiv);
        productDiv.appendChild(imgDiv);
        productDiv.appendChild(divInfo);

        this.productsDiv.appendChild(productDiv);

        // Adicionando a classe ativo nas primeiras imagens dos menus
        document.querySelectorAll('.product .tab-nav ul').forEach(ul => {
          ul.firstElementChild.classList.add('ativo')
        });
      });
    } catch (err) {
      console.warn('Erro ao inserir os produtos')
    }
  }

  openCart(event) {
    event.preventDefault();
    this.cartDiv.classList.toggle('ativo');
  }

  changeMainImage(event) {
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

  addFavorite(event) {
    event.preventDefault();
    event.currentTarget.firstElementChild.classList.toggle('ativo');
  } 

  updateCartLenght() {
    // Pegando o elemento que contém a quantidade de itens do carrinho
    const qtde = this.cartMenu.firstElementChild.firstElementChild;

    // Atualizando a quantidade de itens da DOM de acordo com o tamanho da array this.cart
    qtde.innerText = this.cart.length;
    
    if (!+qtde.innerText) {
      this.cartMenu.firstElementChild.classList.add('hide');
    } else {
      this.cartMenu.firstElementChild.classList.remove('hide');
    }

    return qtde.innerText;
  }

  addToCart(event) {
    const target = event.currentTarget;
    const targetPai = target.parentElement.parentElement.parentElement;

    const urlImagem = targetPai.querySelectorAll('.tab-nav ul li a img')[0].src;
    const name = targetPai.querySelector('.info .title h1').innerText;
    const installments = +(targetPai.querySelector('.info .prices h2 .parcela').innerText);
    const installmentPrice = +(targetPai.querySelector('.info .prices h2 .parcelado').innerText.replace(',', '.'));
    const price = +(targetPai.querySelector('.info .prices h3 span').innerText.replace('R$', '').replace('.', '').replace(',', '.'));

    // Conferindo se já há um item no carrinho
    const arrayNomes = this.cart.map(item => item.urlImagem).includes(urlImagem);
    if (!arrayNomes) {
      this.cart.push({
        urlImagem,
        name,
        installments,
        installmentPrice,
        price,
      });
    }

    this.renderCart();
  }

  removeFromCart(event) {
    event.preventDefault();

    // Armazenando a div carrinho-item
    const elementoPai = event.currentTarget.parentElement;

    // Armezanando a url da imagem do item que foi clicado
    const urlImagem = elementoPai.querySelector('.image-carrinho').getAttribute('style').replace("background-image: url('", "").replace("');", "");

    // Armazenando o index do elemento clicado
    // O findIndex 
    const indexCart = this.cart.findIndex(cart => (cart.urlImagem === urlImagem));
    if (indexCart !== -1) {
      this.cart.splice(indexCart, 1);
      this.updateCartLenght();
      this.renderCart();
    } else {
      console.warn('Não foi possível remover o ítem')
    }

  }

  registerHandlers() {
    this.cartMenu.onclick = event => this.openCart(event);

    this.imagesNav.forEach(imageNav => imageNav.onclick = event => this.changeMainImage(event));
    this.favorites.forEach(favorito => favorito.onclick = event => this.addFavorite(event));
    this.btnsAddToCart.forEach(btnAddToCart => btnAddToCart.onclick = event => this.addToCart(event));
  }
  
  registerRemoveHandler() {
    this.btnsRemoveFromCart.forEach(btnRemoveFromCart => btnRemoveFromCart.onclick = event => this.removeFromCart(event)); 
  }

  renderCart() {
    // Pegando a div carrinho-items
    const cartItem = this.cartDiv.firstElementChild;

    // Zerando o conteúdo da div 
    cartItem.innerHTML = ''; 

    // Caso não tenha nenhum item no array cart, ele não executa mais nada da função
    if (!this.cart.length) return;
  
    // Preenchendo a div com os itens presentes no array this.cart
    this.cart.forEach(cart => {    
      let { urlImagem, name, installments, installmentPrice, price } = cart;
      
      installmentPrice = cart.installmentPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
      price = cart.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  
      const divCarrinhoItem = document.createElement('div');
      divCarrinhoItem.classList.add('carrinho-item');
  
      divCarrinhoItem.innerHTML = `
        <div class="left">
          <div class="image-carrinho" style="background-image: url('${urlImagem}');">
          </div>

          <div class="info-carrinho">
            <h1 class="name-carrinho">${name}</h1>
            <h2 class="installments-carrinho">${installments}x ${installmentPrice}</h2>
            <h2 class="price-carrinho">${price} à vista</h2>
          </div>
        </div>

        <a href="#">X</a>
      `;
      
      cartItem.appendChild(divCarrinhoItem);
    });
    
    // Armazenando a soma dos preços dos itens
    const total = this.cart.map(cart => cart.price).reduce((acc, cur) => acc + cur);
    
    // Armezenando o menor nº de parcelas presente nos itens
    const minInstallment = this.cart.map(cart => cart.installments).reduce((acc, cur) => (cur < acc) ? cur : acc);

    // Faz a média da quantidade de parcelas
    const installmentsAverage = (this.cart.map(cart => cart.installments).reduce((acc, cur) => cur + acc)) / this.cart.length;

    // Confere se a quantidade de parcelas é a mesma em todos os itens do vetor
    const sameInstallments = (installmentsAverage == minInstallment);

    let totalParcelado;
    if (sameInstallments) {
      // Caso a quantidade de parcelas seja a mesma, o total parcelado é a soma dos valores dessas parcelas
      totalParcelado = this.cart.map(cart => cart.installmentPrice).reduce((acc, cur) => acc + cur).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    } else {
      // Caso seja diferente, o total parcelado é a soma dos valores de cada parcela multiplicado pela sua quantidade, e divido pela quantidade mínima de parcelas;
      // É opicional, apenas para deixar o subtotal mais real possível
      const totalParcelasDiferentes = this.cart.map(cart => (cart.installmentPrice * cart.installments)).reduce((acc, cur) => acc + cur);
      totalParcelado = (totalParcelasDiferentes / minInstallment).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }

    // Convertando o valor do total para o padrão de moeda R$
    const totalConvertido = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    
    // Preenchendo o subtotal do carrinho
    const divSubtotal = document.createElement('div');
    divSubtotal.classList.add('subtotal');

    divSubtotal.innerHTML = `
      <div class="subtotal">
        <h2 class="subtotal-carrinho">subtotal</h2>
        <h2 class="subtotal-installments">${minInstallment}x de ${totalParcelado}</h2>
        <h2 class="subtotal-price">ou ${totalConvertido} à vista</h2>
      </div>
    `;

    cartItem.appendChild(divSubtotal);
    
    // Atualizando a quantidade de itens presentes no carrinho
    this.updateCartLenght();
    
    // Após inserir os dados de acordo com os ítens presentes no array, atualizamos a variável dos botões para excluir e chamamos a função que adiciona o evento de click neles
    this.btnsRemoveFromCart = document.querySelectorAll('.carrinho-items .carrinho-item a');
    this.registerRemoveHandler();
  }

  async init() {
    // Esperando primeiro adicionar os produtos para depois executar as outras funções
    await this.addProducts();
    
    // Guardando os botões para favoritar, só depois de adicionar todos os produtos no DOM 
    this.imagesNav = document.querySelectorAll('.product .tab-nav ul li a');
    this.favorites = document.querySelectorAll('.product .info .title h1 a');
    this.btnsAddToCart = document.querySelectorAll('.add-carrinho');
    this.updateCartLenght();
    this.registerHandlers();
  }

}

new App().init();