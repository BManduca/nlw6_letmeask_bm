/// <reference lib="webworker" />

/*
O serviceWorker pode ser 'startado' ao criar o projeto, 
através da linha de comando:
 -> npx create-react-app my-app --template cra-template-pwa
 ou 
 -> npx create-react-app my-app --template cra-template-pwa-typescript

O serviceWorker pode ser customizado, so verificar o link
https://developers.google.com/web/tools/workbox/modules,
podendo assim verificar a lista de módulos do Workbox ou 
add qualquer outro módulo ao qual achar necessário

*/

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

clientsClaim();

/*
 precache all of your webpack-generated assets and 
 keep them up to date as you deploy updates.

 Their URLs are injected into the manifest variable below.
 This variable must be present somewhere in your service worker file,
 even if you decide not to use precaching.
*/

precacheAndRoute(self.__WB_MANIFEST);

/*
  Uma arquitetura de shell de aplicativo é a melhor abordagem para 
  aplicativos e sites que têm navegação relativamente rígida, 
  mas que têm conteúdo mudando constantemente.
*/

//[\w\-]{0,5}$
const fileExtensionRegexp = new RegExp('[^/?]+\\.[^/]+$');

registerRoute(
  // retornar false para isentar todas as solicitações de serem atendidas
  // por index.html
  ({ request, url }: { request: Request; url: URL }) => {

    // se não estiver em modo navegação, efetuar skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    /* se caso a URL iniciar com /_, efetuar skip */
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    /* No caso da URL for para um recurso, pois, contém uma 
    extensão, efetuar skip  */
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    /* retornando true, dando sinal que queremos utilizar o handler */
    return true;

  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
)

/*
  Exemplo de solicitações de rota de cache rodando em tempo de execução
  que não são tratadas pelo pré-cache, no caso, por exemplo .png requests
  como as que estão presentes na pasta public/
*/
registerRoute(
  /* Adicionando qualquer outra extensão de arquivo ou critérios
  que de roteamento que forem julgados necessário */

  ({ url }) => 
    url.origin === self.location.origin && url.pathname.endsWith('.png'),
  /* Necessário customizar essa estratégia, baseado, por exemplo 
    na troca para CacheFirst */
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      /* Buscar certificar-se que no momento que o cache de tempo que
      está em execução atingir seu tamanho máximo, aplicar a remoção 
      das imagens recentemente menos usadas. */
      new ExpirationPlugin({ maxEntries: 50 })
    ]
  })
)

/* função que permite que o aplicativo da web acione
o skipWaiting via registration.waiting.postMessage({type: 'SKIP_WAITING'}) */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
})

//para possíveis ou futuras customizações, podem ser adicionadas a partir daqui 