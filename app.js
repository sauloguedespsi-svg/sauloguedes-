let deferredPrompt;
const installButton = document.getElementById('installButton');
const shareButton = document.getElementById('shareButton');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});

shareButton.addEventListener('click', async () => {
  const shareData = {
    title: 'Saulo Guedes | Psicanalista Clínico',
    text: 'Cartão profissional de Saulo Guedes.',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      const original = shareButton.querySelector('small').textContent;
      shareButton.querySelector('small').textContent = 'Link copiado';
      setTimeout(() => shareButton.querySelector('small').textContent = original, 1800);
    }
  } catch (error) {
    console.log('Compartilhamento cancelado ou indisponível.', error);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}
