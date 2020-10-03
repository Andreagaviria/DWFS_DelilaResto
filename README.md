# PROYECTO DELILAH RESTO-ANDREA GAVIRIA

Para correr el proyecto se deben seguir los siguientes pasos:

0.  Si descargaste el proyecto de github, debes agregar tu proyecto al workspace de visual studio, abrir la terminal, ubicarte en la raiz del proyecto y ejecutar el comando npm install. Si lo descargaste de un adjunto debes descomprimirlo y agregarlo al workspace de visual studio.

1.  Abrir un nuevo query en mysql y ejecutar:

        CREATE DATABASE IF NOT EXISTS delilah

2.  Abrir el archivo db.js y cambiar la palabra root por el usuario de tu servidor de base de datos y la palabra new_password por tu password.

3.  Luego de esto ir a la terminal y ubicarse en la carpeta DelilahResto

4.  Ejecutar el siguiente script node seed.js, al hacer esto se van a insertar datos de prueba para pedidos, usuarios, productos, pagos y stages. Si se quiere verificar esto se puede revisar las tablas en mysql.

5.  Ejecutar el script npm start.

6.  Abrir en el navegador la url http://localhost:3000/api-docs.

A continuacion se dan indicaciones para probar los endpoints:

# USUARIOS

## POST /usuarios/register

1.  Si se quiere crear un nuevo usuario damos click en este endpoint
2.  damos click en try it out
3.  se nos abre un are de texto con el siguiente JSON

              {
              "username": "string",
              "firstName": "string",
              "lastName": "string",
              "email": "string",
              "phoneNumber": "string",
              "deliveryAddress": "string",
              "password": "string",
              "rolId": "string"
              }

4.llenamos username con datos de prueba ejemplo

                {
                "username": "josegomez",
                "firstName": "jose",
                "lastName": "gomez",
                "email": "josegomez@gmail.com",
                "phoneNumber": "5555",
                "deliveryAddress": "cr 2 no 18-74",
                "password": "1234",
                "rolId": "1"
                }

5. Presionar Execute, si el registro fue exitoso se muestra el usuario creado, sino aparecera
   un mensaje diciendo que el email o usuario ya existen

## POST /usuarios/login

1.Damos click en en este endpoint
2.Damos click en try it out

3.  Aparecera un JSON como el que se muestra a continuacion:

                {
                "username": "string",
                "email": "string",
                "password": "string"
                }

4.  reemplazamos los campos con los datos del usuario creado

                {
                "username": "josegomez",
                "email": "josegomez@gmail.com",
                "password": "1234"
                }

5.  Si el logueo es exitoso obtendremos un token, este debera ser usado para todas las peticiones.
    Hay que tener en cuenta que este token es solo valido por 50 minutos. si se supera este tiempo,
    hay que generar otro.

# PEDIDOS

## POST /pedidos

1.  damos click a este endpoint
2.  pegamos el token en el campo user-token
3.  Nos aparecera un area de texto con un JSON como el siguiente:

            {
                "pagoId": 0,
                "stageId": 0,
                "usuarioId": 0,
                "chosenProductos": [
                    "string"
                    ]
            }

4.  podemos llenar los campos con los siguientes datos de prueba. en usuarioId no se debe poner nada
    porque el pedido toma el id del usuario logueado, tener en cuenta que pagoId debe ser un valor entre
    1 y 3 de otra forma se generara un error que dice que ese id no existe, el stageId debe estar entre 1
    y 5, de lo contrario genera error. En el momento solo hay creados tres productos si se pone un Id con otros ids simplemente estos no se agregan.

                {
                    "pagoId": 1,
                    "stageId": 2,
                    "usuarioId": 0,
                    "chosenProductos": [
                        "1","2","3"
                        ]
                }

5.  Al final si el producto se crea se obtendra un log como el que se muestra a continuacion.

                {
                    "Result": "producto con id 1 insertado: producto con id 2 insertado: producto con id 3 insertado: "
                }

## POST /pedidos/{pedidoId}/stage

1.  Vamos a este endpoint
2.  Click en try it out
3.  pegamos el token
4.  ponemos el Id del pedido, en nuestro ejemplo el id 4
5.  Aparecera un JSON como el siguiente:

                {
                    "stageId": 0
                }

6.  Reemplazamos el valor por un StageId distinto entre 1 y 5, sino aparecera error.

                {
                    "stageId": 2
                }

7.  si la respuesta es exitosa nos mostrara el pedido

8.  si vamos a la base de datos y modificamos el rolId del usuario por 2 e intentamos
    otra vez este endpoint, veremos que no estamos autorizados

## POST /productos

1.  Luego del paso 8 de la seccion anterior devolvemos el usuario a rolId 1.
2.  damos click en este endpoint.
3.  Click en try it out
4.  pegamos el user-token
5.  En el area de texto nos aparecera un JSON como el siguiente:

                {
                    "name": "string",
                    "price": 0,
                    "urlImage": "string"
                }

6.  Modificamos los campos con datos de ejemplo

                {
                    "name": "Asado Argetino",
                    "price": 45000,
                    "urlImage": "www.asado.com"
                }

7.  Click en execute
8.  Si el producto se crea exitoso aparece el pedido en la respuesta
9.  Si cambiamos el rolId de nuestro usuario en la base de datos por 2 e intentamos hacer esto
    otra vez nos respondera Usuario no autorizado

# PUT /productos/{productoId}

1.  Damos click a este endpoint
2.  Click en try it out
3.  Pegamos el user-token
4.  Ponemos el productId ejemplo 1
5.  En el area de texto nos aparecera un JSON como el siguiente:

                {
                    "name": "string",
                    "price": 0,
                    "urlImage": "string"
                }

6.  Modificamos lo que queramos pero solo enviamos los campos que querramos actualizar, ejemplo

                {
                    "name": "filete",
                    "price": 45000
                }

7.  click en execute
8.  si es exitoso nos responde un mensaje como el siguiente:

                {
                    "success": "se ha modificado"
                }

9.  Si cambiamos el rolId de nuestro usuario en la base de datos por 2 e intentamos hacer esto
    otra vez nos respondera Usuario no autorizado

# DELETE /productos/{productoId}

1.  Damos click a este endpoint
2.  Click en try it out
3.  Pegamos el user-token
4.  Ponemos el productId ejemplo 1
5.  Si la eliminacion es exitosa el servidor nos respondera

                {
                    "success": "se ha borrado el producto"
                }

6.  Si cambiamos el rolId de nuestro usuario en la base de datos por 2 e intentamos hacer esto
    otra vez nos respondera Usuario no autorizado

# GET /pedidos

1.  Damos click a este endpoint
2.  Click en try it out
3.  Pegamos el user-token
4.  El servidor nos respondera con una lista de pedidos
5.  Observamos que el pedido 1 fue creado por el usuarioId 1 pero nosotros somos el usuarioId 4
6.  Cambiamos nuestro rolId en la base de datos por 2

# GET /pedidos/{pedidoId}

1.  Damos click a este endpoint
2.  Click en try it out
3.  Pegamos el user-token
4.  Ponemos el PedidoId 1
5.  Dado que este pedido fue creado por el usuario 1 y nosotros no tenemos rolId 1 sino 2 (del paso 6 de la seccion anterior) nos tiene que aparecer el mensaje

        {
            "error": "Usted solo puede acceder a su informacion"
        }
