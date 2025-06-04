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
