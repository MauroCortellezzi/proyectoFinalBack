const socket = io()

const table = document.getElementById('realProductTable')

document.getElementById('createBtn').addEventListener('click', () =>{
    const body ={
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
    }
    fetch('/api/products', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'content-type' : 'application/json'
        },
    })
    .then(result => result.json())
    .then(result => {
        if (result.status === 'error') throw new Error(result.error)
    })
    .then(() => fetch('/api/products'))
    .then(result => result.json())
    .then(result => {
        if (result.status === 'error') throw new Error (result.error)
        socket.emit('productList', result.payload)
        alert('OK todo salio bien \nEl producto se ha agregado con exito\n\nVista actualizada')
        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
        document.getElementById('price').value = ''
        document.getElementById('code').value = ''
        document.getElementById('stock').value = ''
        document.getElementById('category').value = ''
    })
    .catch(err => alert(`Ocurrio un error \n${err}`))
})

deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'delete',
    })
    .then(result => result.json())
    .then(result => {
        if (result.status === 'error') throw new Error (result.error)
        socket.emit('productList', result.payload)
        alert (' todo salio bien  \n El producto eliminado con exito')
    })
    .catch(err => alert (`ocurrio un error \n${err}`))
}

socket.on('updateProducts', data => {
    table.innerHTML =
    `<tr>
     <td></td>
     <td><strong>Producto</strong></td>
     <td><strong>Descripcion</strong></td>
     <td><strong>precio</strong></td>
     <td><strong>codigo</strong></td>
     <td><strong>stock</strong></td>
     <td><strong>categoria</strong></td>
    </tr>`;
    for (product of data) {
        let tr = document.createElement('tr')
        tr.innerHTML=
        `<td><button class='btn btn-danger' onclick='deleteProduct(${product.id}'>Eliminar</td>
         <td>${product.description}</td>
         <td>${product.description}</td>
         <td>${product.price}</td>
         <td>${product.code}</td>
         <td>${product.stock}</td>
         <td>${product.category}</td>
        `;
        table.getElementsByTagName('tbody')[0].appendChild(tr);
    }
})