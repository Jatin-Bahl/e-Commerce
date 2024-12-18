let products = [];
      let displayedProducts = 0;
      const productsPerPage = 8;
      const minPriceInput = document.getElementById('minPriceInput');  // Min price input
      const maxPriceInput = document.getElementById('maxPriceInput');  // Max price input


      async function fetchProducts() {
        try {
          const response = await fetch("https://fakestoreapi.com/products");
          if (!response.ok) throw new Error("Failed to fetch products");
          products = await response.json();
          populateFilters();
          renderProducts();
        } catch (error) {
          console.error(error.message);
          document.getElementById("productList").innerHTML =
            "<p>Error loading products. Please try again later.</p>";
        }
      }

      function populateFilters() {
        const categoryFilter = document.getElementById("categoryFilter");
        const categories = [...new Set(products.map((p) => p.category))];
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
        });
      }

      function renderProducts() {
        const productList = document.getElementById("productList");
        const fragment = document.createDocumentFragment();

        const filteredProducts = filterProducts();
        const paginatedProducts = filteredProducts.slice(
          displayedProducts,
          displayedProducts + productsPerPage
        );

        paginatedProducts.forEach((product) => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <span>$${product.price}</span>
                    </a>
                `;
          fragment.appendChild(card);
        });

        productList.appendChild(fragment);
        displayedProducts += paginatedProducts.length;
      }
      function filterProducts() {
        const search = document.getElementById("search").value.toLowerCase();
        const category = document.getElementById("categoryFilter").value;
        const sort = document.getElementById("sortFilter").value;
        const minPrice = parseInt(document.getElementById('minPriceRange').value);
        const maxPrice = parseInt(document.getElementById('maxPriceRange').value);

        let filtered = products;

        if (search) {
          filtered = filtered.filter((p) =>
            p.title.toLowerCase().includes(search)
          );
        }

        if (category) {
          filtered = filtered.filter((p) => p.category === category);
        }
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);


        if (sort === "price-asc") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === "price-desc") {
          filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;
      }

      document.getElementById("loadMore").addEventListener("click", () => {
        renderProducts();
      });

      document.getElementById("search").addEventListener("input", () => {
        displayedProducts = 0;
        document.getElementById("productList").innerHTML = "";
        renderProducts();
      });

      document.getElementById('minPriceRange').addEventListener('input', (e) => {
        document.getElementById('minPrice').textContent = e.target.value;
        displayedProducts = 0;
        document.getElementById('productList').innerHTML = '';
        renderProducts();
      });


      document.getElementById('maxPriceRange').addEventListener('input', (e) => {
        document.getElementById('maxPrice').textContent = e.target.value;
        displayedProducts = 0;
        document.getElementById('productList').innerHTML = '';
        renderProducts();
      });

      document.getElementById("categoryFilter")
        .addEventListener("change", () => {
          displayedProducts = 0;
          document.getElementById("productList").innerHTML = "";
          renderProducts();
        });

      document.getElementById("sortFilter").addEventListener("change", () => {
        displayedProducts = 0;
        document.getElementById("productList").innerHTML = "";
        renderProducts();
      });

      fetchProducts();

