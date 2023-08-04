(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $(".navbar").addClass("sticky-top shadow-sm");
    } else {
      $(".navbar").removeClass("sticky-top shadow-sm");
    }
  });

  // Dropdown on mouse hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (this.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  });

  const datePicker = document.getElementById("datepicker");
  const slotContainer = document.getElementById("slotContainer");
  const theaterRadios = document.querySelectorAll("[data-theater]");
  const modalBody = document.querySelector(".final-form");

  theaterRadios.forEach((radio) => {
    radio.addEventListener("click", function () {
      const theaterType = this.getAttribute("data-theater");
      const today = new Date().toISOString().split("T")[0];
      datePicker.setAttribute("min", today);
    });
  });

  const slotsData = [
    { id: 1, value: "09:00 - 10:45", booked: true },
    { id: 2, value: "11:00 - 12:45", booked: false },
    { id: 3, value: "13:00 - 14:45", booked: false },
    { id: 4, value: "11:00 - 12:45", booked: false },
    { id: 5, value: "13:00 - 14:45", booked: false },
    { id: 6, value: "11:00 - 12:45", booked: false },
    { id: 7, value: "13:00 - 14:45", booked: false },
  ];

  function updateSlotDisplay(selectedDate) {
    slotContainer.innerHTML = "";

    // Generate and append slot buttons for available slots
    const availableSlots = slotsData.filter((slot) => !slot.booked);
    availableSlots.forEach((slot) => {
      const slotButton = document.createElement("button");
      slotButton.className = "slot-button";
      slotButton.innerHTML = slot.value;
      slotButton.onclick = function () {
        openBookingForm(selectedDate, slot.value);
      };
      slotContainer.appendChild(slotButton);
    });
  }

  datePicker.addEventListener("change", function () {
    const selectedDate = this.value;
    updateSlotDisplay(selectedDate);
  });

  function openBookingForm(slotDate, slotTime) {
    modalBody.innerHTML = `
    <br/>
      <h5>Date: ${slotDate} & Time: ${slotTime}</h5>
      <br/>
      <form id="userDetailsForm">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" required>
      </div>
      <div class="mb-3">
        <label for="whatsapp" class="form-label">WhatsApp Number</label>
        <input type="tel" class="form-control" id="whatsapp" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="numberOfPeople" class="form-label">Number of People</label>
        <input type="number" class="form-control" id="numberOfPeople" min="0" max="20" required>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="decorationRequired">
        <label class="form-check-label" for="decorationRequired">Decoration Required</label>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="cakeRequired">
        <label class="form-check-label" for="cakeRequired">Cake Required</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    `;

    // Show the modal
    const datePickerModal = new bootstrap.Modal(document.getElementById("datePickerModal"));
    datePickerModal.show();

    // Handle form submission
    const userDetailsForm = document.getElementById("userDetailsForm");
    userDetailsForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Process form data here...

      // Clear selected date and slot
      datePicker.value = "";
      slotContainer.innerHTML = "";
      modalBody.innerHTML = "";

      // Close the modal
      datePickerModal.hide();
    });
  }

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);
