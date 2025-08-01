function toggleSubmenu(event) {
    event.preventDefault(); // impede o link de recarregar a página
    const parent = event.target.closest('.submenu');
    parent.classList.toggle('open');
}

function toggleSubmenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.submenu');
    const isOpen = parent.classList.contains('open');

    // Fecha todos os submenus antes de abrir o atual
    document.querySelectorAll('.submenu').forEach(el => el.classList.remove('open'));

    if (!isOpen) {
        parent.classList.add('open');
    }
}