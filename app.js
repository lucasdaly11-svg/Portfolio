const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-categories]')];
function filterProjects(category) {
  let count = 0;
  for (const card of cards) {
    const visible = category === 'all' || card.dataset.categories.split(' ').includes(category);
    card.hidden = !visible;
    if (visible) count++;
  }
  for (const button of filterButtons) {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  document.getElementById('project-count').textContent = category === 'all' ? '5 projects & learning areas' : `${count} ${count === 1 ? 'item' : 'items'} shown`;
}
for (const button of filterButtons) button.addEventListener('click', () => filterProjects(button.dataset.filter));

const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });

const diagnosticData = {
  device: ['DEVICE', 'Start with the local connection.', 'If other devices work, check whether this PC is connected to the expected network and whether its cable or Wi-Fi connection is active. Change one thing, then test again.'],
  network: ['NETWORK', 'Look for the shared point of failure.', 'If several devices are affected, check the router connection and service status. Establish whether the issue is local or with the provider before changing settings or interrupting everyone’s connection.'],
  website: ['SERVICE', 'Separate a website issue from a connection issue.', 'Try another website and compare the same site on another device. If the rest of the internet works, investigate that service or its address before assuming the whole network is down.']
};
for (const button of document.querySelectorAll('[data-check]')) button.addEventListener('click', () => {
  for (const item of document.querySelectorAll('[data-check]')) { const active = item === button; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active)); }
  const [label, title, description] = diagnosticData[button.dataset.check];
  const result = document.getElementById('diagnostic-result');
  result.querySelector('span').textContent = `NARROW IT DOWN / ${label}`;
  result.querySelector('h4').textContent = title;
  result.querySelector('p').textContent = description;
});

const roleData = {
  support: { title: 'Technical curiosity, with people skills.', body: 'Personal PC troubleshooting and Windows setup give me a practical starting point. Customer-facing work has taught me to listen, communicate clearly and work as part of a team.', items: ['Informal hardware and software support for friends', 'Windows installation and setup', 'Customer service and following procedures'] },
  hardware: { title: 'Comfortable getting hands-on.', body: 'Building multiple desktop PCs has given me experience with components and connections. I want to develop that interest in a hardware support, repair or workshop environment.', items: ['Desktop PC assembly and component familiarity', 'Practical fault-finding and research', 'A careful approach to learning unfamiliar systems'] },
  networking: { title: 'Curious about the bigger connection.', body: 'Networking is an area I want to grow into. My starting point is practical PC experience, an interest in connectivity and a willingness to learn from experienced people.', items: ['A hands-on foundation in computer hardware', 'A methodical approach to narrowing down a problem', 'Keen to learn network fundamentals through training'] }
};
const tabs = [...document.querySelectorAll('[data-role]')];
function selectRole(button, moveFocus = false) {
  for (const tab of tabs) { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; }
  const data = roleData[button.dataset.role];
  const panel = document.getElementById('role-panel');
  panel.setAttribute('aria-labelledby', button.id);
  panel.querySelector('h3').textContent = data.title;
  panel.querySelector('h3 + p').textContent = data.body;
  const list = panel.querySelector('ul');
  list.replaceChildren(...data.items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  panel.querySelector('[data-role-projects]').dataset.roleProjects = button.dataset.role;
  if (moveFocus) button.focus();
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectRole(button));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectRole(tabs[next], true); }
  });
});
document.querySelector('[data-role-projects]').addEventListener('click', event => filterProjects(event.currentTarget.dataset.roleProjects));

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  status.textContent = 'Copying email address…';
  try {
    await Promise.race([
      navigator.clipboard.writeText('lucasdaly156@outlook.com'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Clipboard unavailable')), 2000))
    ]);
    status.textContent = 'Email address copied.';
  }
  catch { status.textContent = 'Please select and copy the email address above, or tap it to open your email app.'; }
});
