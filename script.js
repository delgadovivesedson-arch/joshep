'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => { document.querySelector('#service').value = a.dataset.service; }));
document.querySelector('#year').textContent = new Date().getFullYear();
const number = String(window.JOSHEP_CONFIG?.whatsapp || '').replace(/[^0-9]/g, '');
const hasWhatsApp = /^[1-9]\d{7,14}$/.test(number);
if (hasWhatsApp) {
  document.querySelector('#submit-button').innerHTML = 'Consultar por WhatsApp <span aria-hidden="true">↗</span>';
  document.querySelector('#contact-note').textContent = 'Se abrirá WhatsApp con tu consulta. Vos decidís cuándo enviarla.';
}
document.querySelector('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.querySelector('#name');
  const message = document.querySelector('#message');
  if (!name.value.trim() || !message.value.trim()) {
    (!name.value.trim() ? name : message).focus();
    return;
  }
  const text = `¡Hola, Joshep! Soy ${name.value.trim()}.\nMe interesa: ${document.querySelector('#service').value}.\n\n${message.value.trim()}`;
  if (hasWhatsApp) { window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer'); }
  document.querySelector('#prepared-message').value = text;
  document.querySelector('#result').hidden = false;
  document.querySelector('#status').textContent = hasWhatsApp ? 'También podés copiar tu consulta aquí.' : 'Mensaje preparado. Copialo y compartilo con Joshep por el medio que usés para contactarlo.';
  document.querySelector('#prepared-message').focus();
});
document.querySelector('#copy').addEventListener('click', async () => {
  const field = document.querySelector('#prepared-message');
  const status = document.querySelector('#status');
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('manual');
    await navigator.clipboard.writeText(field.value);
    status.textContent = '¡Copiado! Ya podés compartirlo con Joshep.';
  } catch {
    field.focus(); field.select(); field.setSelectionRange(0, field.value.length);
    status.textContent = 'Mensaje seleccionado. Usá Ctrl+C (o mantené presionado y elegí Copiar en el celular).';
  }
});
