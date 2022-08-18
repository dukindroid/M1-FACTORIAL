# cPanel y MySQL

Vamos a ver ahora como conectar nuestros modelos y rutas a una base de datos 
activa en otro servidor. En este ejemplo conectamos el modelo del checkpoint
Simpsons corriendo en nuestro entorno local a una base de datos MySQL de un
servicio de hosting web, pero podríamos subir el modelo a Netlify y la base 
datos tenerla en local con Postgress, la idea es la misma.

![Diagrama de Red](/_src/assets/client-web-db.png)

Primero hay que establecer la base de datos y para ello tenemos que presentar 
al frabulloso cPanel. Esta es una herramienta administrativa para servicios 
de servidores de internet muy comúnmente usada. Permite agregar y quitar usuarios 
y dependiendo de la empresa podemos configurar y personalizar la oferta que hayamos
adquirido. En el caso de Hostinger, la plataforma que estaremos usando para este 
ejemplo, nos presenta al accesar algo así: 

![Portal de cPanel](/_src/assets/portalcpanel.png)

En la sección de Base de Datos, hacemos click en Base de Datos MySQL:

![Sección - Base de Datos](/_src/assets/basededatos.png)

Y se nos presenta una forma con la que podemos crear una base nueva y asignarle un
usuario con contraseña, así como también una lista con las bases que ya hemos creado:

![Bases ya creadas](/_src/assets/basesdetalle.png)

Una vez que rellenas la forma con tu nombre de usuario, contraseña y el nombre de la 
base de datos nueva, ya podrías accesarla desde un sitio creado dentro del mismo servicio
de hosting. Pero como este servidor no nos permite ejecutar javascript con node, 
tendremos que correr nuestro cliente para esta base ya sea en otro servidor libre
como Heroku o Netlify, o en nuestra computadora personal. Para esto deberemos de 
especificarle al servicio de Hostinger desde donde se hará la conexión para que la permita.
Esto lo encontramos en la sección de MySQL Remoto:

![MySQL Remoto](/_src/assets/mysqlremoto.png)

Acá mi recomendación particular es la de que te ayudes de una página como la de 
[What's My IP](https://www.whatsmyip.org/) para averiguar cual es tu IP externa. Sabiendo el 
servicio de hosting este dato, solo permitirá las conexiónes entrantes desde esta dirección
en particular y tu base se encontrará más segura:

![cualesmiip](/_src/assets/cualesmiip.png)

Ahora sí, ya tenemos todas las identificaciones preparadas para conectarnos, que sigue? 

### DotEnv

Como podrás imaginarte, toda esta información de login es privada, y conveniente que no 
caiga en manos insospechadas, llámese deploys a otros servicios de hosting sin acordarnos
nosotros de que dejamos la información ahí pegada. Para prevenir esto, lo más conveniente
es tener toda esta información por aparte, en un archivito especial llamado .env el cual 
convenientemente GitbHub y otras plataformas se encargaran de ignorar. Creamos pues este 
archivo en la raiz de nuestro proyecto:

![puntoenv](/_src/assets/puntoenv.png)

Y lo llenamos con la información que justo hemos creado: El nombre de la base de datos, 
nuestro usuario de sql, la contraseña... lo del host es opcional, realmente no es data
tan sensible pero igual a nadie daña que vaya acá. Cada dato va en un renglón por aparte
con el siguiente formato:

```
llave1='contenido1'
llave2='contenido2'
llave3='contenido3'
```

Listo. Bueno, y ahora que nuestras credenciales están sanas y salvas... Cómo las llamamos 
a nuestro código? Ah vaya, pues primero que nada habría que crear ese código, pero de 
momento lo que sí podemos hacer es instalar la librería 'dotenv' de NPM:

```
npm i dotenv --save
npm i sequelize
npm i mysql2
```

Y pues ya que andamos por ahí, de una podemos instalar la librería de sequelize y la mysql2.
Sequelize porque es lo que se vá a conectar a las credenciales que acabamos de crear, y mysql2
porque la pide Sequelize para entenderse con el dialecto en específico que maneja nuestro
servidor. En fín, estabamos con donenv. Para traer las llaves que guardamos a nuestro archivo
podríamos hacer un require() y asígnarles una variable, pero esto se me hace un tanto intrusivo
sobre todo para una data que lo que se quiere es que no salte a la vista. Chusmeando un poco 
en la documentacion de dotenv, dí con que la manera mas corta y entendible sin llamar la atención
es crear un nuevo script en tu archivo 'package.json' de esta manera:

![concredenciales](/_src/assets/code.png)

Como podrás ver, si ejecutamos 'npm run concredenciales', node ejecutará dotenv, mandándole 
como argumento nuestro programa (en este caso llamado App.js) a nodemon, y cargando nuestras 
credenciales, las cuales estarán accesibles mediante la variable global de proceso 
_process.env_. Continuemos ahora con lo más interezante

### Conectando con la base


