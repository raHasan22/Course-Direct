function addToCart(variantId) {
  event.preventDefault();
  event.stopPropagation();
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          id: variantId,
          quantity: 1,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      showModal();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function showModal() {
  document.getElementById("notificationModal").style.display = "block";
}

function closeModal() {
  document.getElementById("notificationModal").style.display = "none";
}

function sharecard_product(url, title) {
  if (navigator.share) {
    navigator
      .share({
        title: title,
        url: url,
      })
      .catch((error) => console.log("Error sharing:", error));
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareUrl = `${window.location.origin}${url}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("notificationModal");
  if (event.target == modal) {
    closeModal();
  }
};

function toggleFavorite(button, productId, productHandle, productTitle) {
  // Get current favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if product is already favorited
  const index = favorites.findIndex((item) => item.id === productId);

  if (index === -1) {
    // Add to favorites
    favorites.push({
      id: productId,
      handle: productHandle,
      title: productTitle,
      dateAdded: new Date().toISOString(),
    });
    button.classList.add("is-favorite");
    console.log("Added to favorites:", productTitle);
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    button.classList.remove("is-favorite");
    console.log("Removed from favorites:", productTitle);
  }

  // Save back to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update UI
  updateFavoriteIcon(button, index === -1);

  // Optional: Trigger event for other parts of the page to update
  document.dispatchEvent(new CustomEvent("favoritesUpdated"));
}

// Update the heart icon appearance
function updateFavoriteIcon(button, isFavorite) {
  const heartIcon = button.querySelector(".heart-icon");
  if (heartIcon) {
    if (isFavorite) {
      heartIcon.setAttribute("fill", "red");
      heartIcon.setAttribute("stroke", "red");
    } else {
      heartIcon.removeAttribute("fill");
      heartIcon.setAttribute("stroke", "black");
    }
  }
}

// Favorite functionality using localStorage
function toggleFavorite(button) {
  const productId = button.getAttribute("data-product-id");
  const productHandle = button.getAttribute("data-product-handle");
  const productTitle = button.getAttribute("data-product-title");
  const productImage = button.getAttribute("data-product-image");

  // Get current favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if product is already favorited
  const index = favorites.findIndex((item) => item.id === productId);

  if (index === -1) {
    // Add to favorites
    favorites.push({
      id: productId,
      handle: productHandle,
      title: productTitle,
      image: productImage,
      dateAdded: new Date().toISOString(),
    });
    button.classList.add("is-favorite");
    console.log("Added to favorites:", productTitle);
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    button.classList.remove("is-favorite");
    console.log("Removed from favorites:", productTitle);
  }

  // Save back to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update UI
  updateFavoriteIcon(button, index === -1);

  // Update the favorites popup in header
  updateFavoritesPopup();
}

// Update the favorites popup in header
function updateFavoritesPopup() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesContainer = document.querySelector(
    ".cd-favorites-popup__items"
  );
  const emptyMessage = document.querySelector(".cd-favorites-popup__empty");

  if (favorites.length === 0) {
    emptyMessage.style.display = "block";
    favoritesContainer.innerHTML = "";
    favoritesContainer.appendChild(emptyMessage);
    return;
  }

  emptyMessage.style.display = "none";

  // Create HTML for each favorite item
  let favoritesHTML = "";
  favorites.forEach((item) => {
    favoritesHTML += `
      <div class="cd-favorites-item">
        <a href="${item.handle}" class="cd-favorites-item__link">
          <img src="${item.image}" alt="${item.title}" class="cd-favorites-item__image">
          <div class="cd-favorites-item__info">
            <h4 class="cd-favorites-item__title">${item.title}</h4>
            <button class="cd-favorites-item__remove" data-product-id="${item.id}">Remove</button>
          </div>
        </a>
      </div>
    `;
  });

  favoritesContainer.innerHTML = favoritesHTML;

  // Add event listeners to remove buttons
  document.querySelectorAll(".cd-favorites-item__remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = button.getAttribute("data-product-id");
      removeFavorite(productId);
    });
  });
}

// Remove favorite from everywhere
function removeFavorite(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((item) => item.id !== productId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update all favorite buttons
  document
    .querySelectorAll(`.favorite-button[data-product-id="${productId}"]`)
    .forEach((button) => {
      button.classList.remove("is-favorite");
      updateFavoriteIcon(button, false);
    });

  // Update the favorites popup
  updateFavoritesPopup();
}

// Update the heart icon appearance
function updateFavoriteIcon(button, isFavorite) {
  const heartIcon = button.querySelector(".heart-icon");
  if (heartIcon) {
    if (isFavorite) {
      heartIcon.setAttribute("fill", "red");
      heartIcon.setAttribute("stroke", "red");
    } else {
      heartIcon.removeAttribute("fill");
      heartIcon.setAttribute("stroke", "black");
    }
  }
}

// Initialize favorite buttons and popup on page load
function initializeFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Initialize product favorite buttons
  document.querySelectorAll(".favorite-button").forEach((button) => {
    const productId = button.getAttribute("data-product-id");
    const isFavorite = favorites.some((item) => item.id === productId);

    if (isFavorite) {
      button.classList.add("is-favorite");
      updateFavoriteIcon(button, true);
    }
  });

  // Initialize favorites popup
  updateFavoritesPopup();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeFavorites);

// Add event listener for the header favorites button
document
  .querySelector(".cd-header__favorites-btn")
  ?.addEventListener("click", function () {
    updateFavoritesPopup();
    document.querySelector(".cd-favorites-popup").style.display = "flex";
  });

// Close popup when clicking close button
document
  .querySelector(".cd-favorites-popup__close")
  ?.addEventListener("click", function () {
    document.querySelector(".cd-favorites-popup").style.display = "none";
  });

// Close popup when clicking outside
document
  .querySelector(".cd-favorites-popup")
  ?.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });
