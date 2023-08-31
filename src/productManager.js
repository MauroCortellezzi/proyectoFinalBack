import fsPromises from 'fs/promises';

export class ProductManager {
    #path;

    constructor(path) {
        this.#path = path;
        this.#init();
    }

    async #init() {
        try {
            await fsPromises.access(this.#path);
        } catch (error) {
            await fsPromises.writeFile(this.#path, JSON.stringify([], null, 2));
        }
    }

    #generateID(products) {
        return products.length === 0 ? 1 : products[products.length - 1].id + 1;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock)
            return '[400] Required fields missing';

        try {
            const data = await fsPromises.readFile(this.#path, 'utf-8');
            const products = JSON.parse(data);

            const found = products.find(item => item.code === product.code);
            if (found) return '[400] code already exists';

            const productToAdd = { id: this.#generateID(products), ...product };
            products.push(productToAdd);

            await fsPromises.writeFile(this.#path, JSON.stringify(products, null, 2));
            return productToAdd;
        } catch (error) {
            return '[400] Error adding product';
        }
    }

    async getProducts() {
        try {
            const data = await fsPromises.readFile(this.#path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            return '[400] Error fetching products';
        }
    }

    async getProductById(id) {
        try {
            const data = await fsPromises.readFile(this.#path, 'utf-8');
            const products = JSON.parse(data);

            const product = products.find(item => item.id === id);
            if (!product) return '[400] Product not found';

            return product;
        } catch (error) {
            return '[400] Error fetching product by ID';
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const data = await fsPromises.readFile(this.#path, 'utf-8');
            let products = JSON.parse(data);

            let isFound = false;
            let newProducts = products.map(item => {
                if (item.id === id) {
                    isFound = true;
                    return {
                        ...item,
                        ...updatedProduct
                    };
                } else return item;
            });

            if (!isFound) return '[ERR] Product not found';

            await fsPromises.writeFile(this.#path, JSON.stringify(newProducts, null, 2));
            return newProducts.find(item => item.id === id);
        } catch (error) {
            return '[400] Error updating product';
        }
    }

    async deleteProduct(id) {
        try {
            const data = await fsPromises.readFile(this.#path, 'utf-8');
            const products = JSON.parse(data);

            const newProducts = products.filter(item => item.id !== id);
            if (products.length === newProducts.length) return '[400] Product not found';

            await fsPromises.writeFile(this.#path, JSON.stringify(newProducts, null, 2));
            return newProducts;
        } catch (error) {
            return '[400] Error deleting product';
        }
    }
}


