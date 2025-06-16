document.addEventListener("DOMContentLoaded", function () {
  // Get all h2 elements in the content
  const headings = document.querySelectorAll(".nxt-singleCourse__content h2");
  const sidebarNav = document.querySelector(".sidebar-nav-list");

  // Store the original summary item
  const summaryItem = sidebarNav.querySelector("li").cloneNode(true);

  // Clear the sidebar
  sidebarNav.innerHTML = "";

  // Add back the summary item
  sidebarNav.appendChild(summaryItem);

  // Process each heading
  headings.forEach((heading, index) => {
    // Create a unique ID from the heading text
    const headingText = heading.textContent.trim();
    const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Set the ID on the heading
    heading.id = headingId;

    // Create sidebar nav item
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${headingId}`;
    a.className = "sidebar-nav-item";
    a.textContent = headingText;

    li.appendChild(a);
    sidebarNav.appendChild(li);
  });

  // Handle click events on sidebar items
  const sidebarItems = document.querySelectorAll(".sidebar-nav-item");
  sidebarItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all items
      sidebarItems.forEach((i) =>
        i.classList.remove("sidebar-nav-item--active")
      );

      // Add active class to clicked item
      this.classList.add("sidebar-nav-item--active");

      // Scroll to the target section
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Handle scroll events to update active state
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    // If we're at the top of the page, activate the Summary section
    if (scrollPosition < 200) {
      sidebarItems.forEach((item) => {
        item.classList.remove("sidebar-nav-item--active");
        if (item.getAttribute("href") === "#summary") {
          item.classList.add("sidebar-nav-item--active");
        }
      });
      return;
    }

    // Find the current section in view
    let currentSection = "";
    headings.forEach((heading) => {
      const sectionTop = heading.offsetTop - 100; // Offset for better detection
      if (scrollPosition >= sectionTop) {
        currentSection = heading.id;
      }
    });

    // Update active state in sidebar
    if (currentSection) {
      sidebarItems.forEach((item) => {
        item.classList.remove("sidebar-nav-item--active");
        if (item.getAttribute("href") === `#${currentSection}`) {
          item.classList.add("sidebar-nav-item--active");
        }
      });
    }
  });

  // Check course-details__content ul elements for more than 10 li elements
  const courseDetailLists = document.querySelectorAll(
    ".course-details__content ul"
  );
  courseDetailLists.forEach((list) => {
    const listItems = list.querySelectorAll("li");
    if (listItems.length > 10) {
      list.classList.add("course-details__list");
    }
  });

  // for accordion
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");
    const icon = item.querySelector(".accordion-icon");

    header.addEventListener("click", () => {
      // Close all other accordion items
      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem
            .querySelector(".accordion-content")
            .classList.remove("active");
          otherItem.querySelector(".accordion-icon").classList.remove("active");
        }
      });

      // Toggle current accordion item
      content.classList.toggle("active");
      icon.classList.toggle("active");
    });
  });
});
