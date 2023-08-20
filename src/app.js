import express from 'express'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/cart.router.js'

const app= express()
app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => console.log('server up'))