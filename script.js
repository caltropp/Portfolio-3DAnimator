'use strict';
const svgNS = 'http://www.w3.org/2000/svg';
function gearMarkup(radius, teeth, fill, stroke) {
  const points = [];
  for (let i = 0; i < teeth * 4; i++) {
    const angle = i / (teeth * 4) * Math.PI * 2;
    const r = radius * (i % 4 === 1 || i % 4 === 2 ? 1 : .87);
    points.push(`${Math.cos(angle) * r},${Math.sin(angle) * r}`);
  }
  const group = document.createElementNS(svgNS, 'g');
  group.classList.add('rotor');
  group.innerHTML = `<polygon points="${points.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle r="${radius * .65}" fill="none" stroke="${stroke}" stroke-width="2"/><circle r="${radius * .48}" fill="${stroke}"/><circle r="${radius * .29}" fill="${fill}"/><path d="M0 ${-radius*.6}v${radius*.3}M0 ${radius*.3}v${radius*.3}M${-radius*.6} 0h${radius*.3}M${radius*.3} 0h${radius*.3}" stroke="${stroke}" stroke-width="6"/>`;
  return group;
}
document.querySelector('[data-gear="large"]').append(gearMarkup(99, 20, 'url(#metal)', '#596150'));
document.querySelector('[data-gear="small"]').append(gearMarkup(58, 12, 'url(#metal)', '#596150'));
document.querySelectorAll('[data-flat-gear]').forEach(el => el.append(gearMarkup(Number(el.dataset.flatGear), 16, '#d4b78f', '#66513e')));
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused) {
  document.querySelector('.hero-art').classList.toggle('paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
}
setMotion(reducedMotion.matches);
reducedMotion.addEventListener('change', e => setMotion(e.matches));
motionToggle.addEventListener('click', () => setMotion(motionToggle.getAttribute('aria-pressed') !== 'true'));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelectorAll('.project').forEach(project => {
    project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
  });
}));
const projects = {
  spider: { title: 'Hydraulic Spider', description: 'An illustrated exploration of a multi-legged mechanical creature, where every joint suggests a clear purpose.', process: 'The study starts with a central body and paired articulated limbs. A full rig would use constrained joint ranges and independent foot targets, keeping the body free to shift its weight while the feet maintain contact.', tags: ['Creature mechanics', 'Joint systems', 'Rigging concept'] },
  clockwork: { title: 'Clockwork Assembly', description: 'A study of connected rotation and the visual rhythm of a compact gear train.', process: 'The composition pairs a large driver with a smaller follower. In a production mechanism, tooth counts set the rotation ratio and the follower turns in the opposite direction. The aim is to make that transfer of energy easy to read.', tags: ['Gear ratios', 'Procedural motion', 'Assembly concept'] },
  piston: { title: 'The Piston Principle', description: 'A simplified industrial actuator study focused on readable forms, construction, and linear movement.', process: 'A cylinder, rod, and mounting eye establish the essential silhouette. Separating fixed and moving parts creates a clear starting point for a constrained extension rig, with the stroke kept within the housing’s physical limits.', tags: ['Hard-surface design', 'Linear motion', 'Industrial concept'] }
};
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-process').textContent = project.process;
  document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
  dialog.showModal(); document.body.classList.add('modal-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.querySelector('#year').textContent = new Date().getFullYear();
