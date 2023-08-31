import { Router } from "express";
import { CartManager } from "../cartManager.js";

const router = Router ()
const cartManager = new CartManager('./data/carts.json')

router.post('/', async (req, res) =>{
    const result = await cartManager.createCart()
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6)})
    }
    res.status(201).json({ status:'success', payload: result})
})

router.get('/:cid', async (req, res) => {
    const id =parseInt(req.params.cid)
    const result = await cartManager.getProductsFromCart(id)
    if(typeof result == 'string') {
        const error =result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6)})
    }
    res.status(200).json({ status:'success', payload: result})
})

router.post('/:cid/product/:pid', async (req, res) =>{
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const carts = await cartManager.getCart()
    const result = carts.find((cart) => cart.id === cid)
    if(!result) return res.status(404).json({ status: "error", error: `Cart id: ${cid} does not exist` });
    const idProduct = result.products.find((product) => product.pid === pid)
   

    const newCart = await addProductToCart(cid, result)
    res.status(201).json({ status: "success", payload: newCart });

})

export default router