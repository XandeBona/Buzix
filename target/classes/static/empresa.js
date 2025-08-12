function toggleSubmenu(event) {
    event.preventDefault(); // impede o link de recarregar a página
    const parent = event.target.closest('.submenu');
    parent.classList.toggle('open');
}