// Render menu as a table for perfect column alignment
const menuItems = [
    "Uva", "China", "Mango", "Parcha", "Granada", "Blueberry", "Limonada", "Piña Colada",
    "Coco Berrie", "Coco Fresa", "Coco Limón", "Coco Mango", "Coco Parcha", "Green Apple",
    "Mango Fresa", "Mango Piña", "Morisoñando", "Mango Parcha", "Limonada Fresa",
    "Limonada Parcha", "Frutas Tropicales", "Granada Coco", "Coco Blue", "Fresa Parcha",
    "Melón"
];
const menuList = document.getElementById('menu-list');
if (menuList) {
    menuList.innerHTML = '';
    // Use a CSS grid for modern responsive layout
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    menuItems.forEach((item, idx) => {
        let gridItem = document.createElement('div');
        gridItem.className = 'menu-grid-item';
        let label = document.createElement('span');
        label.textContent = item;
        label.style.cursor = 'pointer';
        label.onclick = function() {
            selectedDrink = item;
            lastMenuSelectedDrink = item;
            document.getElementById('options-modal').style.display = 'flex';
            // Unselect any previous selection
            document.querySelectorAll('#menu-list span').forEach(sp => sp.classList.remove('selected-menu-item'));
            label.classList.add('selected-menu-item');
            // Show/hide 'Sin pulpa' option based on drink
            const sinPulpaLabel = document.getElementById('sin-pulpa-label');
            const showSinPulpa = [
                'Parcha',
                'Limonada Parcha',
                'Coco Parcha',
                'Mango Parcha',
                'Fresa Parcha'
            ].includes(selectedDrink);
            if (showSinPulpa) {
                sinPulpaLabel.style.display = 'block';
            } else {
                sinPulpaLabel.style.display = 'none';
                sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
            }
        };
        gridItem.appendChild(label);
        grid.appendChild(gridItem);
    });
    menuList.appendChild(grid);
    // Modal logic
    menuList.addEventListener('change', function(e) {
        if (e.target.name === 'drink') {
            selectedDrink = e.target.value;
            // Uncheck all other drinks
            document.querySelectorAll('input[name="drink"]').forEach(cb => {
                if (cb !== e.target) cb.checked = false;
            });
            document.getElementById('options-modal').style.display = 'flex';
        }
    });
}

// Dropdown menu options logic
const menuOption = document.getElementById('dropdown-menu-menu');
if (menuOption) {
    menuOption.addEventListener('click', function() {
        // Go to main menu (reload or navigate as needed)
        window.location.href = 'edeili_nutrition_menu.html';
    });
}
const contactOption = document.getElementById('dropdown-menu-contact');
if (contactOption) {
    contactOption.addEventListener('click', function() {
        // Go to contact page (if it exists)
        window.location.href = 'contact.html';
    });
}
// Cart icon logic
const cartIcon = document.getElementById('cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
        // Hide any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => m.style.display = 'none');
        // Open cart popup
        cartPopup.style.display = 'block';
        renderCartPopup();
    });
}
// Hamburger menu logic (cleaned up, only using menuIcon and menuDropdown)
const menuIcon = document.getElementById('main-menu-icon');
const menuDropdown = document.getElementById('main-menu-dropdown');
if (menuIcon && menuDropdown) {
    menuIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        menuDropdown.style.display = (menuDropdown.style.display === 'block') ? 'none' : 'block';
    });
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (menuDropdown.style.display === 'block' && !menuDropdown.contains(e.target) && e.target !== menuIcon) {
            menuDropdown.style.display = 'none';
        }
    });
    // Menu option
    const menuOption = document.getElementById('main-menu-link');
    if (menuOption) {
        menuOption.addEventListener('click', function() {
            window.location.href = 'edeili_nutrition_menu.html';
        });
    }
    // Contact option
    const contactOption = document.getElementById('contacto-link');
    if (contactOption) {
        contactOption.addEventListener('click', function() {
            window.location.href = 'contact.html';
        });
    }
}

// Declare all variables only once at the top
const cartPopup = document.getElementById('cart-popup');
const closeCartPopup = document.getElementById('close-cart-popup');
const cartPopupItems = document.getElementById('cart-popup-items');
const cancelCartPopupBtn = document.getElementById('cancel-cart-popup');
const goToInfoPopup = document.getElementById('go-to-info-popup');
const optionsModal = document.getElementById('options-modal');
const addToCartBtn = document.getElementById('add-to-cart');
const goToCartBtn = document.getElementById('go-to-cart');
const cancelModalBtn = document.getElementById('cancel-modal');
const cancelInfoBtn = document.getElementById('cancel-info');
const backToCartBtn = document.getElementById('back-to-cart');
const backToMainBtn = document.getElementById('back-to-main');
let selectedDrink = null;
let lastMenuSelectedDrink = null; // NEW: remember last selected drink from menu
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let editingCartIndex = null;

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

if (closeCartPopup && cartPopup) {
    closeCartPopup.addEventListener('click', function() {
        cartPopup.style.display = 'none';
    });
}
if (cancelCartPopupBtn) {
    cancelCartPopupBtn.addEventListener('click', function() {
        if (cartPopup) cartPopup.style.display = 'none';
        // Clear Personalizar modal selections and comment box
        clearSelectedOptions();
        const sinPulpaLabel = document.getElementById('sin-pulpa-label');
        if (sinPulpaLabel) {
            sinPulpaLabel.style.display = 'none';
            sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
        }
        const commentBox = document.getElementById('item-comment-box');
        if (commentBox) commentBox.value = '';
        selectedDrink = null;
        lastMenuSelectedDrink = null;
        document.querySelector('.order-form').style.display = 'block';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'none';
        document.querySelector('.thankyou-page').style.display = 'none';
    });
}
if (goToInfoPopup) {
    goToInfoPopup.addEventListener('click', function() {
        if (cart.length === 0) {
            return;
        }
        cartPopup.style.display = 'none';
        document.querySelector('.order-form').style.display = 'none';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'block';
        clearInfoFormFields(); // Always clear fields when showing form
    });
}
if (document.getElementById('go-to-info')) {
    document.getElementById('go-to-info').addEventListener('click', function() {
        document.querySelector('.order-form').style.display = 'none';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'block';
        clearInfoFormFields(); // Always clear fields when showing form
    });
}
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
        // Use lastMenuSelectedDrink if not editing
        if (editingCartIndex === null) {
            if (!selectedDrink && lastMenuSelectedDrink) selectedDrink = lastMenuSelectedDrink;
        } else {
            // In edit mode, selectedDrink is set by edit logic
        }
        const selectedOptions = getSelectedOptions();
        const commentBox = document.getElementById('item-comment-box');
        const itemComment = commentBox ? commentBox.value.trim() : '';
        if (selectedDrink) {
            if (editingCartIndex !== null) {
                cart[editingCartIndex] = { drink: selectedDrink, options: selectedOptions, comment: itemComment };
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCartPopup();
                // Show confirmation overlay for edit
                const confirmDiv = document.getElementById('personalizar-confirm');
                if (confirmDiv) {
                    confirmDiv.style.display = 'block';
                    setTimeout(() => {
                        confirmDiv.style.display = 'none';
                        if (optionsModal) optionsModal.style.display = 'none';
                        editingCartIndex = null;
                        if (cartPopup) {
                            cartPopup.style.display = 'block';
                            renderCartPopup();
                        }
                    }, 1000);
                    return; // Prevent immediate modal close
                }
                // Stay in edit mode until another button is clicked (if no confirmDiv)
                return;
            } else {
                cart.push({ drink: selectedDrink, options: selectedOptions, comment: itemComment });
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCartPopup();
                // Show confirmation overlay for new add, but keep modal open
                const confirmDiv = document.getElementById('personalizar-confirm');
                if (confirmDiv) {
                    confirmDiv.style.display = 'block';
                    setTimeout(() => {
                        confirmDiv.style.display = 'none';
                    }, 1000);
                    // Clear selection for next item after showing message
                    document.querySelectorAll('#menu-list span').forEach(sp => sp.classList.remove('selected-menu-item'));
                    clearSelectedOptions();
                    if (commentBox) commentBox.value = '';
                    // Do NOT clear selectedDrink or lastMenuSelectedDrink so user can add same item again
                    return;
                }
                // Clear selection for next item, but keep modal open (fallback)
                document.querySelectorAll('#menu-list span').forEach(sp => sp.classList.remove('selected-menu-item'));
                clearSelectedOptions();
                if (commentBox) commentBox.value = '';
                // Do NOT clear selectedDrink or lastMenuSelectedDrink so user can add same item again
            }
        }
        // Stay in Personalizar (do not close modal) in edit mode
    });
}
// When leaving Personalizar (Cancelar or Ir al Carrito), clear editingCartIndex
if (goToCartBtn) {
    goToCartBtn.addEventListener('click', function() {
        if (optionsModal) optionsModal.style.display = 'none';
        editingCartIndex = null;
        if (cartPopup) {
            cartPopup.style.display = 'block';
            renderCartPopup();
        }
    });
}
if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', function() {
        if (optionsModal) optionsModal.style.display = 'none';
        const commentBox = document.getElementById('item-comment-box');
        if (editingCartIndex !== null) {
            // In edit mode, clear selections and comment box after closing
            editingCartIndex = null;
            if (cartPopup) cartPopup.style.display = 'none';
            clearSelectedOptions();
            // Also clear sin pulpa state
            const sinPulpaLabel = document.getElementById('sin-pulpa-label');
            if (sinPulpaLabel) {
                sinPulpaLabel.style.display = 'none';
                sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
            }
            if (commentBox) commentBox.value = '';
            selectedDrink = null;
            lastMenuSelectedDrink = null;
            return;
        }
        // Not editing: clear selections and comment box
        clearSelectedOptions();
        // Also clear sin pulpa state
        const sinPulpaLabel = document.getElementById('sin-pulpa-label');
        if (sinPulpaLabel) {
            sinPulpaLabel.style.display = 'none';
            sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
        }
        if (commentBox) commentBox.value = '';
        selectedDrink = null; // Reset selectedDrink on cancel
        lastMenuSelectedDrink = null; // Reset lastMenuSelectedDrink on cancel
        if (cartPopup) cartPopup.style.display = 'none';
        document.querySelector('.order-form').style.display = 'block';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'none';
        document.querySelector('.thankyou-page').style.display = 'none';
    });
}
if (cancelInfoBtn) {
    cancelInfoBtn.addEventListener('click', function() {
        // Clear Personalizar modal selections and comment box
        clearSelectedOptions();
        const sinPulpaLabel = document.getElementById('sin-pulpa-label');
        if (sinPulpaLabel) {
            sinPulpaLabel.style.display = 'none';
            sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
        }
        const commentBox = document.getElementById('item-comment-box');
        if (commentBox) commentBox.value = '';
        selectedDrink = null;
        lastMenuSelectedDrink = null;
        document.querySelector('.order-form').style.display = 'block';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'none';
        document.querySelector('.thankyou-page').style.display = 'none';
    });
}
if (backToCartBtn) {
    backToCartBtn.addEventListener('click', function() {
        document.querySelector('.order-form').style.display = 'block';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'none';
        document.querySelector('.thankyou-page').style.display = 'none';
        if (cartPopup) {
            cartPopup.style.display = 'block';
            renderCartPopup();
        }
        clearInfoFormFields(); // Clear fields
    });
}
if (backToMainBtn) {
    backToMainBtn.addEventListener('click', function() {
        // Just show menu, do not clear cart here
        document.querySelector('.order-form').style.display = 'block';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'none';
        document.querySelector('.thankyou-page').style.display = 'none';
    });
}

// Add this after the DOMContentLoaded or after all DOM elements are declared
const infoForm = document.getElementById('delivery-form');
if (infoForm) {
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Prepare order summary and total before clearing cart
        let orderSummary = [];
        let total = 0;
        cart.forEach(item => {
            let itemCost = getItemCost(item);
            total += itemCost;
            // Build summary line with options and comment
            let summaryLine = `<strong>${item.drink}</strong>`;
            if (item.options && item.options.length) {
                summaryLine += ` <span style='color:#444;'>(` + item.options.join(', ') + ")</span>";
            }
            if (item.comment && item.comment.trim() !== '') {
                summaryLine += `<div style='font-style:italic; font-size:0.97em; background:#f7f7f7; padding:4px 8px; border-radius:4px; margin-top:2px;'>${item.comment}</div>`;
            }
            orderSummary.push(summaryLine);
        });
        // Clear the cart only after successful order
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartPopup();
        document.querySelector('.order-form').style.display = 'none';
        document.querySelector('.cart-page').style.display = 'none';
        document.querySelector('.info-form').style.display = 'none';
        document.querySelector('.thankyou-page').style.display = 'block';
        // Add name to thank you
        const nameInput = infoForm.querySelector('input[type="text"]');
        const thankyouTitle = document.getElementById('thankyou-title');
        if (thankyouTitle && nameInput) {
            thankyouTitle.textContent = `¡Gracias, ${nameInput.value.trim()}!`;
        }
        // Show order summary and total in thank you page
        let summaryHtml = `<div style='margin-top:18px;'><b>Resumen de la orden:</b><br>${orderSummary.join('<br>')}</div><div style='font-weight:bold; margin-top:10px;'>Total: $${total}</div>`;
        const orderSummaryDiv = document.getElementById('order-summary');
        if (orderSummaryDiv) {
        orderSummaryDiv.innerHTML = summaryHtml;
}
    });
}

// Cart popup logic
function renderCartPopup() {
    if (!cartPopupItems) return;
    cartPopupItems.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartPopupItems.innerHTML = '<li>El carrito está vacío.</li>';
    } else {
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.marginBottom = '18px';
            // Drink name
            let itemText = item.drink || item;
            // $10 · 32oz below drink name
            let priceLine = '<div style="color:#444; margin-bottom:2px;">$10 · 32oz</div>';
            // Options
            let optionsLine = '';
            let itemCost = getItemCost(item);
            if (item.options && item.options.length) {
                optionsLine = ' (' + item.options.join(', ') + ')';
            }
            total += itemCost;
            li.innerHTML = `<strong>${itemText}</strong>${optionsLine}<br>${priceLine}`;
            // Add comment if present
            if (item.comment && item.comment.trim() !== '') {
                const commentDiv = document.createElement('div');
                commentDiv.style.margin = '6px 0 0 0';
                commentDiv.style.fontStyle = 'italic';
                commentDiv.style.fontSize = '0.97em';
                commentDiv.style.background = '#f7f7f7';
                commentDiv.style.padding = '4px 8px';
                commentDiv.style.borderRadius = '4px';
                commentDiv.textContent = ' ' + item.comment;
                li.appendChild(commentDiv);
            }
            // Create a container for the buttons below the item
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '6px';
            // Add Editar and Remover buttons
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.style.marginRight = '8px';
            editBtn.onclick = function() {
                // Set editing state
                editingCartIndex = idx;
                selectedDrink = item.drink || item;
                // Hide carrito popup while editing
                if (cartPopup) cartPopup.style.display = 'none';
                if (optionsModal) optionsModal.style.display = 'flex';
                document.querySelectorAll('#menu-list span').forEach(sp => {
                    if (sp.textContent === selectedDrink) sp.classList.add('selected-menu-item');
                    else sp.classList.remove('selected-menu-item');
                });
                setSelectedOptions(item.options || [], item.comment || '');
            };
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.onclick = function() {
                cart.splice(idx, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCartPopup();
            };
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(removeBtn);
            li.appendChild(document.createElement('br'));
            li.appendChild(btnContainer);
            cartPopupItems.appendChild(li);
        });
        // Only show total at the bottom
        const totalDiv = document.createElement('div');
        totalDiv.style.margin = '18px 0 0 0';
        totalDiv.style.padding = '10px 0 0 0';
        totalDiv.style.borderTop = '1px solid #ddd';
        totalDiv.innerHTML = `<div style='font-weight:bold; text-align:right;'>Total: $${total}</div>`;
        cartPopupItems.appendChild(totalDiv);
    }
}

// Helper to get selected options from checkboxes
function getSelectedOptions() {
    const options = [];
    document.querySelectorAll('#options-modal input[type=checkbox]').forEach(cb => {
        if (cb.checked) options.push(cb.parentElement.textContent.trim());
    });
    return options;
}
// Helper to set checkboxes from options array
function setSelectedOptions(optionsArr, comment) {
    // Show/hide sin pulpa based on selectedDrink
    const sinPulpaLabel = document.getElementById('sin-pulpa-label');
    const showSinPulpa = [
        'Parcha',
        'Limonada Parcha',
        'Coco Parcha',
        'Mango Parcha',
        'Fresa Parcha'
    ].includes(selectedDrink);
    if (showSinPulpa) {
        sinPulpaLabel.style.display = 'block';
    } else {
        sinPulpaLabel.style.display = 'none';
        sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
    }
    document.querySelectorAll('#options-modal input[type=checkbox]').forEach(cb => {
        cb.checked = optionsArr && optionsArr.includes(cb.parentElement.textContent.trim());
    });
    // Restore comment
    const commentBox = document.getElementById('item-comment-box');
    if (commentBox) commentBox.value = comment || '';
}
// Helper to clear all checkboxes
function clearSelectedOptions() {
    document.querySelectorAll('#options-modal input[type=checkbox]').forEach(cb => {
        cb.checked = false;
    });
    // Also clear sin pulpa state
    const sinPulpaLabel = document.getElementById('sin-pulpa-label');
    if (sinPulpaLabel) {
        sinPulpaLabel.style.display = 'none';
        sinPulpaLabel.querySelector('input[type=checkbox]').checked = false;
    }
}

// Branding image switcher
const brandingImg = document.querySelector('.branding .logo');
if (brandingImg) {
    const images = ['Edeili.png', 'megate.png'];
    let current = 0;
    setInterval(() => {
        current = 1 - current;
        brandingImg.src = images[current];
    }, 3000);
}

// Clear info form fields
function clearInfoFormFields() {
    const infoForm = document.querySelector('.info-form form');
    if (infoForm) {
        infoForm.reset();
    }
}

// Helper to calculate item cost
function getItemCost(item) {
    let itemCost = 10;
    if (item.options && item.options.length) {
        if (item.options.includes('Fibra +$2')) itemCost += 2;
        if (item.options.includes('Immunity +$2')) itemCost += 2;
        if (item.options.includes('Best Defense(Vitamin C) +$2')) itemCost += 2;
        if (item.options.includes('Probiótico $2')) itemCost += 2;
        if (item.options.includes('Doble Liftoff $3')) itemCost += 3;
        if (item.options.includes('Creatina $2')) itemCost += 2;
    }
    return itemCost;
}
