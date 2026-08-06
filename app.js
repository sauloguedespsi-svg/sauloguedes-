let deferredPrompt = null;
const shareButton = document.getElementById('shareButton');
const installButton = document.getElementById('installButton');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
});

shareButton.addEventListener('click', async () => {
  const data = {
    title: 'Saulo Guedes | Psicanalista Clínico',
    text: 'Cartão profissional de Saulo Guedes.',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(data);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link do cartão copiado.');
    } else {
      showToast('Copie o endereço exibido no navegador.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      showToast('Não foi possível compartilhar agora.');
    }
  }
});

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (choice.outcome === 'accepted') {
      showToast('Aplicativo adicionado ao celular.');
    }
    return;
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    showToast('No Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.');
  } else {
    showToast('Abra o menu do navegador e escolha “Adicionar à tela inicial” ou “Instalar app”.');
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(console.error);
  });
}
