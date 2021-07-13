/*
Este código opcional é utilizado para efetuar o registro do
service worker.

register() não é/será chamado por padrão

Este desenvolver tem intuito de permitir que o aplicativo carregue mais 
rápido em visitas subsequentes na produção e por possuir recursos off-line.
No entanto, é relevante salientar que os desenvolvedores e usuários so irão ver
atualizações implantadas em visitas subsequentes a uma página, depois de 
fechar todas as guias existentes abertas, desde que previamente armazenadas 
em cache.

Os recursos são atualizados em segundo plano

para maiores informações sobre os benefícios deste modelo e algumas 
instruções sobre, como por exemplo opt-in, acessar:
https://cra.link/PWA

*/


const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    /* [::1] é considerado o endereço localhost para IPv6 */
    window.location.hostname === '[::1]' ||
    /* 
      127.0.0.1 é considerado localhost para IPv4 
      Explicação do uso do RegExp
      /^((1?\d{1,2}|2([0-4]\d|5[0-5]))\.){3}(1?\d{1,2}|2([0-4]\d|5[0-5]))$|^$/

      (1?\d{1,2}|2([0-4]\d|5[0-5])) -> esta parte do REGEXP vai validar
      números de 0 a 255

      ((1?\d{1,2}|2([0-4]\d|5[0-5]))\.){3} -> adendo ao '.' a verificação
      se repetirá 3 vezes

      outra forma:
      ^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$

    */
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    /* URL Constructor está disponível em todos os navegadores que suportam SW */
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    /*
      O nosso service worker não funcionará se caso o PUBLIC_URL
      estiver alocado em um diferente 'origin' de onde nossa página
      é vinculada. Isso so pode acontecer se um CDN(Content Delivery Network) 
      ou em outras palavras Rede de fornecimento, entrega e distribuição
      de conteúdo, for usado para serve assets

      para consulta:
      https://github.com/facebook/create-react-app/issues/2374

     */
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swURL = `${process.env.PUBLIC_URL}/serviceWorker.js`

      if (isLocalhost) {
        /* 
          Running on localhost. Fazer verificação se o service Worker já existe 
          ou não
        */
        checkValidServiceWorker(swURL, config);

        /*
          aplicando um registro adicional ao localhost, apontando os 
          developers para service worker/ PWA documentação
        */
        navigator.serviceWorker.ready.then(() => {
          console.log(
            ' This web app is being served cache-first by a service ' + 
            'worker. To learn more -> visit https://cra.link/PWA'
          )
        })
      } else {
        /* Não é localhost, desta forma, basta registrar o service worker */
        registerValidServiceWorker(swURL, config);
      }
    })

  }
}

function registerValidServiceWorker(swURL: string, config?: Config) {
  navigator.serviceWorker.register(swURL).then(registration => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing
      if (installingWorker == null) {
        return;
      }

      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            /* 
              At this point, the updated precached content has been fetched,
              but the previous service worker will still serve the older
              content until all client tabs are closed.
            */
           console.log(
            'New content is available and will be used when all ' +
            'tabs for this page are closed. See https://cra.link/PWA.'
           )

           /* Execute callback */
           if (config && config.onUpdate) {
             config.onUpdate(registration);
           }
          } else {
            /* 
              At this point, everything has been precached.
              It's the perfect time to display a
              "Content is cached for offline use." message.
            */
           console.log('Content is cached for offline use.');

           /* Execute callback */
           if (config && config.onSuccess) {
             config.onSuccess(registration);
           }
          }
        }
      }
    }
  }).catch(error => {
    console.error('Error during service worker registration: ', error);
  })
}

function checkValidServiceWorker(swURL: string, config?: Config) {
  /* 
    Verificando se o service worker pode ser encontrado, caso não for possível, 
    efetuar reload na página
  */

  fetch(swURL, { headers: { 'ServiceWorker': 'script' } })
    .then(response => {
      /* 
        Certificando que o service worker existe e que realmente 
        estamos recebendo um arquivo JS
      */
     const contentType = response.headers.get('content-type');
     if (
          response.status === 404 || 
          (contentType != null && 
          contentType.indexOf('javascript') === -1)
        ) {
          /* 
            Nenhum service worker foi encontrado. Provavelmente é 
            um App diferente, efetuar o reload da página
          */
         navigator.serviceWorker.ready.then(registration => {
           registration.unregister().then(() => {
             window.location.reload();
           })
         })
     } else {
       /* 
          caso o service worker for encontrado.
       */
      registerValidServiceWorker(swURL, config);
     }
    }).catch(() => {
      console.log('Não foi possível encontrar uma conexão com a internet. O App está rodando em modo "offline".')
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    }).catch(error => {
      console.error(error.message);
    })
  }
}