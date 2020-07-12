class App {
  constructor() {
    this.cart = [];

    this.divProducts = document.querySelector('.products');
    
    this.carrinhoMenu = document.querySelector('header .cart a');
    this.carrinho = document.querySelector('.carrinho');
  }

  async addProducts() {
    try {
      const productsResponse = await fetch('./resources/data.json');
      const productsJSON = await productsResponse.json();
      
      const products = productsJSON.items;

      products.forEach(item => {
        let { name, images, price: { value: price, installments, installmentValue: installmentPrice } } = item.product;

        price = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        installmentPrice = installmentPrice.toFixed(2).replace('.', ',');

        // Criando a div product
        const divProduct = document.createElement('div');
        divProduct.classList.add('product');


        // Criando a div.tab-nav
        const divTabNav = document.createElement('div');
        divTabNav.classList.add('tab-nav');

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



        divProduct.appendChild(divTabNav);
        divProduct.appendChild(divImg);
        divProduct.appendChild(divInfo);

        this.divProducts.appendChild(divProduct);

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
    this.carrinho.classList.toggle('ativo');
  }

  addFavorite(event) {
    event.preventDefault();
    event.currentTarget.firstElementChild.classList.toggle('ativo');
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

  registerHandlers() {
    this.carrinhoMenu.onclick = event => this.openCart(event);

    this.favoritos.forEach(favorito => favorito.onclick = event => this.addFavorite(event));
    this.imagesNav.forEach(imageNav => imageNav.onclick = event => this.changeMainImage(event));
  }

  async init() {
    // Esperando primeiro adicionar os produtos para depois executar as outras funções
    await this.addProducts();
    
    // Guardando os botões para favoritar, só depois de adicionar todos os produtos no DOM 
    this.favoritos = document.querySelectorAll('.product .info .title h1 a');
    this.imagesNav = document.querySelectorAll('.product .tab-nav ul li a');

    this.registerHandlers();
  }

  // setLoading(loading = true) {
  //   if (loading === true) {
  //     let loadingEl = document.createElement('span');
  //     loadingEl.setAttribute('id', 'loading');
  //     loadingEl.innerText = 'Carregando...'; 

  //     this.formEl.appendChild(loadingEl);
  //   } else {
  //     document.getElementById('loading').remove();
  //   }

  // }



  // async addRepository(event) {
  //   event.preventDefault();

  //   const repoInput = this.inputEl.value;

  //   if (repoInput.length === 0) 
  //     return;

  //   this.setLoading();

  //   try {
  //     const response = await api.get(`./resources/data.json`);

  //     const { name, description, html_url, owner: { avatar_url } } = response.data;


  //     this.repositories.push({
  //       name,
  //       description,
  //       avatar_url,
  //       html_url,
  //     });

  //     this.inputEl.value = ''

  //     this.render();
  //   } catch (error) {
  //     alert('O repositório não existe!');
  //   }

  //   this.setLoading(false);
  // }

  // render() {
  //   this.listEl.innerHTML = '';

  //   this.repositories.forEach(repo => {
  //     let imgEl = document.createElement('img');
  //     imgEl.setAttribute('src', repo.avatar_url);

  //     let titleEl = document.createElement('strong');
  //     titleEl.innerText = repo.name;

  //     let descriptionEl = document.createElement('p');
  //     descriptionEl.innerText = repo.description;

  //     let linkEl = document.createElement('a');
  //     linkEl.setAttribute('href', repo.html_url);
  //     linkEl.setAttribute('target', '_blank');
  //     linkEl.innerText = 'Acessar';


  //     let listItemEl = document.createElement('li');
  //     listItemEl.appendChild(imgEl);
  //     listItemEl.appendChild(titleEl);
  //     listItemEl.appendChild(descriptionEl);
  //     listItemEl.appendChild(linkEl);

  //     this.listEl.appendChild(listItemEl)
  //   })
  // }
}

new App().init();