import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router()
const productManager = new ProductManager('./data/products.json')

router.get('/', async (req, res) => {
    const result = await productManager.getProducts()
    const limit = req.query.limit
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6) })
    } 
    res.status(200).json({ status: 'success', payload: result.slice(0, limit) })
})

router.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const result = await productManager.getProductById(id)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6) })
    } 
    res.status(200).json({status: 'success',payload: result })
})

router.put('/:id', async (req, res) =>{
    const id = parseInt(req.params.id)
    const productUpdate = req.body
    const products = await productManager.getProducts()
    const idProduct = products.find((product) => product.id === id)
    if (!idProduct) return res.status(404).json({ status: "error", error: "ID does not exists" })
    const newProduct = await productManager.updateProduct(id, productUpdate)
    res.status(200).json({ status: "succes", payload: newProduct });
})

router.post('/', async (req,res) =>{
    const product = req.body
    const result = await productManager.addProduct(product)
    if( typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6) })
    }
    res.status(201).json({status: 'success',payload: result })
})

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const products = await productManager.getProducts()
    const exist = products.find((product) => product.id === id)
    if(!exist) return res.status(404).json({ status: "error", error: "ID does not exist" });
    await productManager.deleteProduct(id)
    res.status(200).json({ status: "success", payload: `Product ID: ${id} was deleted` });


})

export default router