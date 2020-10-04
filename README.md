# PROYECTO DELILAH RESTO-ANDREA GAVIRIA

Para correr el proyecto se deben seguir los siguientes pasos:

0.  Descargar el proyecto de github, abrir la carpeta del proyecto en visual studio code, abrir la terminal de git, ubicarse en la raiz del proyecto y ejecutar el comando npm install.

1.  Abrir MYSQL o MAMP y ejecutar un nuevo query y pegar el script que se encuentra en DelilahDBCreation.sql

2.  Abrir el archivo db.js y cambiar el usuario agp por tu usuario y la contraseña andrea46. por tu contraseña.

3.  Luego de esto ir a la terminal y ubicarse en la carpeta "Proyecto Node Delila Restó"

4.  Ejecutar el comando npm start en la consola.

5.  En el navegador abrir la siguiente url: http://localhost:3000/api-docs.

Para testear los endpoints:

# USERS

## POST /users/register

1.  Para crear un usuario, hacer click en este endpoint
2.  Click en "try it out"
3.  se abre un campo con el siguiente JSON

              {
              "firstName": "string",
              "lastName": "string",
              "user": "string",
              "email": "string",
              "address": "string",
              "phone": "string",
              "password": "string",
              "rol": 0
              }

4.  Reemplar los string por datos de prueba

              {
              "firstName": "andrea",
              "lastName": "gaviria",
              "user": "angapa",
              "email": "andrea@hotmail.com",
              "address": "carrera76",
              "phone": "123 56 78",
              "password": "andrea123",
              "rol": 1
              }

5.  Click en "Execute". En caso de que haya sido exitoso, se muestra un string diciendo que el usuario ha sido registrado.

## POST /users/login

1.Hacer click en en este endpoint
2.Click en "try it out"

3.  Se mostrará el siguiente JSON:

                {
                "user": "string",
                "email": "string",
                "password": "string"
                }

4.  Reemplar los string por datos de prueba del anterior endpoint

                {
                "user": "angapa",
                "email": "andrea@hotmail.com",
                "password": "andrea123"
                }

5.  Si el usuario es logueado de maner aexitosa obtenemos el Token que debe ser usado para las demás peticiones. El token sólo dura activo 1 hora; pasada la hora deberá enviarse de nuevo la petición para generar otro Token.

# ORDERS

## POST /orders

1.  Click a este endpoint
2.  Click en "try it out"
3.  Pegar el token en el campo "token"
4.  Aparecerá el siguiente JSON:

            {
            "payment_id": 0,
            "status_id": 0,
            "user_id": 0,
            "productos": [
              0
            ]
            }

5.  Llenar los campos con los datos de prueba.

            {
            "payment_id": 1,
            "status_id": 2,
            "user_id": 4,
            "productos": [
              1,2,3
            ]
            }

6.  Si la petición es creada con exito, aparecerá un texto como el siguiente:

            {
            "Success": "Se creo orden con id 7,el producto con id 1 se agrego al pedido,el producto con id 3 se agrego al pedido,el producto con id 2 se agrego al pedido,"
            }

## PUT /orders/{order_id}/status

1.  VClick en este endpoint
2.  Click en "try it out"
3.  Pegamos el token activo
4.  ponemos un Id de la orden en el campo order_id
5.  Se mostrará el siguiente JSON:

                {
                "status_id": 0
                }

6.  Reemplazamos el valor del status_id:

                {
                "status_id": 3
                }

7.  si el request es exitoso, se actualizará el status de la orden

8.  Si cambiamos el rol del usuario por el 2 (1 para admin y 2 para usuario), no podremos realizar la consilta por que el usuario no está autorizado.

## POST /products

1.  Cambiamos de nuevo el rol al 1, para poder realizar la siguiente petición.
2.  Click en este endpoint.
3.  Click en "try it out"
4.  Pegamos el token
5.  Aparecerá el siguiente JSON:

                {
                "name": "string",
                "price": 0,
                "photo": "string"
                }

6.  Modificamos los campos con datos de ejemplo

                {
                    "name": "hamburguesa",
                    "price": 16000,
                    "photo": "www.mihamburguesa.com"
                }

7.  Click en "execute"
8.  Si la petición es exitosa, se crea el producto
9.  Si cambiamos de nuevo el rol en la base de datos por el 2, el usuario ya no podrá realizar esta petición.

# PUT /products/{product_id}

1.  Click a este endpoint
2.  Click en "try it out"
3.  Pegamos el token
4.  Ponemos el product_id
5.  Aparecerá el siguiente JSON:

                {
                    "name": "string",
                    "price": 0,
                    "photo": "string"
                }

6.  Modificamos lo que queramos pero solo enviamos los campos que querramos actualizar, ejemplo

                {
                    "name": "hamburguesa doble",
                    "price": 22000
                    "photo": "string"
                }

7.  click en "execute"
8.  si la petición es exitosa, saldrá un mensaje como el siguiente:

                {
                "Success": "se actualizo el nombre hamburguesa doble del producto con id 4,se actualizo el precio 22000 del producto con id 4,se actualizo la foto string del producto con id 4,"
                }

9.  Si cambiamos de nuevo el rol en la base de datos por el 2, el usuario ya no podrá realizar esta petición.

# DELETE /products/{product_id}

1.  Click a este endpoint
2.  Click en "try it out"
3.  Pegamos el token
4.  Ponemos el product_id que se desa eliminar. Ejemplo: 1
5.  Si la petición es exitosa, saldrá el siguiente mensaje:

                "El producto con id 1 fue eliminado"

6.  Si cambiamos de nuevo el rol en la base de datos por el 2, el usuario ya no podrá realizar esta petición.

# GET /orders

1.  Click a este endpoint
2.  Click en "try it out"
3.  Pegamos el token activo
4.  El servidor nos respondera con lista de ordenes

# DELETE /orders/{order_id}

1.  Damos click a este endpoint
2.  Click en "try it out"
3.  Pegamos el token activo
4.  Ponemos el order_id
5.  Cambiar el rol a 1 para que podamos eliminar la orden.
6.  Si el request es exitoso, nos saldrá el siguiente mensaje:

                "El pedido con id 3 fue eliminado"

7.  Si el rol se encuentra con el número 2, quiere decir que es un usuario el cual no puede realizar la petición. Para el cual saldrá el siguiente mensaje:

                {
                "Error": "usuario con rol no valido para esta consulta"
                }
