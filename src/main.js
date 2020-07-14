class App {
  constructor() {
    // Atualizando o vetor cart com os itens guardados no localStorage
    // Caso ainda não tenha o item no localStorage, o ou (||) o define como um array vazio
    this.cart = this.getFromStorage() || [];

    this.productsDiv = document.querySelector('.products');
    
    this.cartMenu = document.querySelector('header .cart a');
    this.cartDiv = document.querySelector('.carrinho');
  }

  async addProducts() {
    try {
      const productsResponse = await fetch('./assets/data.json');
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


        // Criando a div img-nav
        const imgNavDiv = document.createElement('div');
        imgNavDiv.classList.add('img-nav');

        const ul = document.createElement('ul');
        images.forEach(imgUrl => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="#">
              <img src="${imgUrl}">
            </a>
          `;
          ul.appendChild(li);
        })

        imgNavDiv.appendChild(ul);



        // Criando a div img
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img');

        imgDiv.innerHTML = `<img src="${images[0]}" alt="${name}">`



        // Criando a div info
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        infoDiv.innerHTML = `
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


        // Adicionando na div product as divs criadas
        productDiv.appendChild(imgNavDiv);
        productDiv.appendChild(imgDiv);
        productDiv.appendChild(infoDiv);

        // Adicionando a div product na div products
        this.productsDiv.appendChild(productDiv);


        // Adicionando a classe ativo nas primeiras imagens da img-nav
        document.querySelectorAll('.product .img-nav ul').forEach(ul => ul.firstElementChild.classList.add('ativo'));
      });
    } catch (err) {
      console.warn('Erro ao inserir os produtos');
    }
  }

  openCart(event) {
    event.preventDefault();

    // Adicionando ou removendo a classe ativo ao clicar em abrir carrinho
    this.cartDiv.classList.toggle('ativo');
  }

  changeMainImage(event) {
    event.preventDefault();  

    // Armazenando o elemento img clicado
    const target = event.currentTarget.firstElementChild;
    
    // Volta para o elemento ul e armazena todas as lis 
    const lis = target.parentElement.parentElement.parentElement.querySelectorAll('li')

    // Faz o loop em todos lis, removendo a classe ativo
    lis.forEach(li => li.classList.remove('ativo'));

    // Adiciona a classe ativo no li selecionado
    target.parentElement.parentElement.classList.add('ativo');

    // Armazenando o elemento da imagem principal
    const image = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].firstElementChild;

    // Atribuindo o src da imagem principal ao da imagem do li clicado
    image.src = target.src;
  }

  addFavorite(event) {
    event.preventDefault();

    // Adicionando ou removendo a classe ativo nos corações clicados
    event.currentTarget.firstElementChild.classList.toggle('ativo');
  } 

  updateCartLenght() {
    // Pegando o elemento que contém a quantidade de itens do carrinho
    const qtde = this.cartMenu.firstElementChild.firstElementChild;

    // Atualizando a quantidade de itens da DOM de acordo com o tamanho da array this.cart
    qtde.innerText = this.cart.length;
    
    // Caso não haja nenhum item no array, adiciona a classe hide na div que contém a quantidade
    if (!+qtde.innerText) this.cartMenu.firstElementChild.classList.add('hide');
    
    // Caso tenha, remove a classe hide e mostra a div que contém a quantidade
    else this.cartMenu.firstElementChild.classList.remove('hide');
  
  }

  addToCart(event) {
    // Armazenando a div product que contém o button clicado
    const target = event.currentTarget.parentElement.parentElement.parentElement;

    // Reservando a url da imagem do produto que será adicionado ao carrinho
    const urlImage = target.querySelectorAll('.img-nav ul li a img')[0].src;
    
    // Conferindo se já há um item no carrinho com o mesmo urlImage
    const arrayNomes = this.cart.map(item => item.urlImage).includes(urlImage);
    
    // Caso já tenha um mesmo item no array, encerra a função
    if (arrayNomes) return;

    // Caso não tenha, continua o codigo

    // Reservando os outros valores
    const name = target.querySelector('.info .title h1').innerText;
    const installments = +(target.querySelector('.info .prices h2 .parcela').innerText);
    const installmentPrice = +(target.querySelector('.info .prices h2 .parcelado').innerText.replace(',', '.'));
    const price = +(target.querySelector('.info .prices h3 span').innerText.replace('R$', '').replace('.', '').replace(',', '.'));

    // Inserindo os valores no vetor
    this.cart.push({
      urlImage,
      name,
      installments,
      installmentPrice,
      price,
    });

    // Atualizando a div do carrinho com os novos produtos
    this.renderCart();

    // Salvando no storage o array com os novos produtos
    this.saveToStorage();
  }

  removeFromCart(event) {
    event.preventDefault();

    // Busca na div carrinho-item a url da imagem do item que foi clicado, armazenando-a
    const urlImage = event.currentTarget.parentElement.querySelector('.image-carrinho').getAttribute('style').replace("background-image: url('", "").replace("');", "");

    // Armazenando o index do elemento clicado.
    // Caso não encontre, o findIndex retorna -1
    const indexCart = this.cart.findIndex(cart => (cart.urlImage === urlImage));
    
    // Se o indexCart for igual a -1, o código encerra aqui e retorna o aviso de erro
    if (indexCart === -1) return console.warn('Não foi possível remover o item');

    // Caso seja diferente de -1, o código continua
    
    // Removendo do array o item clicado
    this.cart.splice(indexCart, 1); 

    // Atualiza a quantidade de itens no carrinho
    this.updateCartLenght();
    
    // Atualiza o conteúdo da div carrinho, com o array modificado
    this.renderCart();

    // Salvando no localStorage o array cart modificado
    this.saveToStorage();
  }

  registerHandlers() {
    // Registrando todos os clicks nos elementos e executando as funções respectivas
    // Serão executados apenas depois do fetch dos produtos
    
    // Click para abrir a div carrinho 
    this.cartMenu.onclick = event => this.openCart(event);
    
    // Click para trocar a imagem principal 
    this.imagesNav.forEach(imageNav => imageNav.onclick = event => this.changeMainImage(event));

    // Click para adicionar um produto como favorito
    this.favorites.forEach(favorito => favorito.onclick = event => this.addFavorite(event));

    // Click para adicionar um produto ao carrinho (array)
    this.btnsAddToCart.forEach(btnAddToCart => btnAddToCart.onclick = event => this.addToCart(event));
  }
  
  registerRemoveHandler() {
    // Isolando o click para remover um item do carrinho
    // Será executado toda vez que o array cart for atualizado 
    this.btnsRemoveFromCart.forEach(btnRemoveFromCart => btnRemoveFromCart.onclick = event => this.removeFromCart(event)); 
  }

  renderCart() {
    // Pegando a div carrinho-items
    const cartItems = this.cartDiv.firstElementChild;

    // Zerando o conteúdo da div carrinho-items
    cartItems.innerHTML = ''; 

    // Caso não tenha nenhum item no array cart, a classe ativo é removida da div carrinho. O return é apenas para parar a função e não executar mais nada que esteja abaixo.
    if (!this.cart.length) return this.cartDiv.classList.remove('ativo');

    // Preenchendo a div carrinho-item, de acordo com os itens presentes no array this.cart
    this.cart.forEach(cart => {    
      let { urlImage, name, installments, installmentPrice, price } = cart;
      
      // Formatando o valor parcelado e a vista para o padrão do R$
      installmentPrice = cart.installmentPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
      price = cart.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  
      // Criando a div carrinho-item
      const itemCartDiv = document.createElement('div');
      itemCartDiv.classList.add('carrinho-item');
  
      // Preenchendo a div carrinho-item
      itemCartDiv.innerHTML = `
        <div class="left">
          <div class="image-carrinho" style="background-image: url('${urlImage}');">
          </div>

          <div class="info-carrinho">
            <h1 class="name-carrinho">${name}</h1>
            <h2 class="installments-carrinho">${installments}x ${installmentPrice}</h2>
            <h2 class="price-carrinho">${price} à vista</h2>
          </div>
        </div>

        <a href="#">X</a>
      `;
      
      // Adicionando a div carrinho-item na div carrinho-items
      cartItems.appendChild(itemCartDiv);
    });
    
    // Armazenando a soma dos preços dos itens
    const total = this.cart.map(cart => cart.price).reduce((acc, cur) => acc + cur);
    
    // Armezenando o menor nº de parcelas presente nos itens
    const minInstallment = this.cart.map(cart => cart.installments).reduce((acc, cur) => (cur < acc) ? cur : acc);

    // Faz a média da quantidade de parcelas
    const installmentsAverage = (this.cart.map(cart => cart.installments).reduce((acc, cur) => cur + acc)) / this.cart.length;

    // Confere se a quantidade de parcelas é a mesma em todos os itens do vetor
    const sameInstallments = (installmentsAverage == minInstallment);

    let installmentTotal;
    if (sameInstallments) {
      // Caso a quantidade de parcelas seja a mesma, o total parcelado é a soma dos valores dessas parcelas
      installmentTotal = this.cart.map(cart => cart.installmentPrice).reduce((acc, cur) => acc + cur);
    } else {
      // Caso seja diferente, o total parcelado inicialmente é a soma dos valores de cada parcela multiplicado pela sua quantidade 
      installmentTotal = this.cart.map(cart => (cart.installmentPrice * cart.installments)).reduce((acc, cur) => acc + cur);
      
      // O total parcelado agora é o valor arrecado anteriormente divido pela menor parcela de todos os produtos no carrinho 
      installmentTotal /= minInstallment;

      // **É opicional, apenas para deixar o subtotal mais lógico o possível
    }
    
    
    // Convertando o valor do total para o padrão de moeda R$
    const convertedTotal = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

    // Convertando o valor do total parcelado para o padrão de moeda R$
    installmentTotal = installmentTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    
    // Criando a div do subtotal do carrinho
    const subtotalDiv = document.createElement('div');
    subtotalDiv.classList.add('subtotal');

    // Preenchendo a div
    subtotalDiv.innerHTML = `
      <div class="subtotal">
        <h2 class="subtotal-carrinho">subtotal</h2>
        <h2 class="subtotal-installments">${minInstallment}x de ${installmentTotal}</h2>
        <h2 class="subtotal-price">ou ${convertedTotal} à vista</h2>
      </div>
    `;
    
    // Adicionando a div do subtotal do carrinho na div carrinho-items
    cartItems.appendChild(subtotalDiv);
    
    // Atualizando a quantidade de itens presentes no array cart
    this.updateCartLenght();
    
    // Após inserir os dados de acordo com os ítens presentes no array cart, atualiza a variável dos botões para excluir
    this.btnsRemoveFromCart = document.querySelectorAll('.carrinho-items .carrinho-item a');

    // Chamando a função que adiciona o evento de click nos botões atualizados
    this.registerRemoveHandler();
  }

  saveToStorage() {
    // Criando o item cart no localStorage e guardando o valor, convertido em JSON, do array cart nele
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getFromStorage() {
    // Converte o valor do item cart, que está em JSON, retornando seu valor
    return JSON.parse(localStorage.getItem('cart'));
  }

  async init() {
    // Esperando primeiro adicionar os produtos na DOM para depois executar as outras funções
    await this.addProducts();
    
    // Armazenando os botões dependentes do fetch dos produtos
    this.imagesNav = document.querySelectorAll('.product .img-nav ul li a');
    this.favorites = document.querySelectorAll('.product .info .title h1 a');
    this.btnsAddToCart = document.querySelectorAll('.add-carrinho');

    // Renderiza a div carrinho-items, caso já tenha produtos salvos no localStorage
    this.renderCart();
    
    // Executa a função que escuta os clicks dos elementos dependentes do fetch
    this.registerHandlers();

    // Atualiza a quantidade de itens no array cart
    // Inicia 0, pois ainda não adicionamos nenhum produto
    this.updateCartLenght();
  }
}

new App().init();