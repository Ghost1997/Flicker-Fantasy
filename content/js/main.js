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
  const host = "https://restaurant-gmpb.onrender.com";
  // const host = "http://localhost:3000";
  const datePicker = document.getElementById("datepicker");
  const slotContainer = document.getElementById("slotContainer");
  const theaterRadios = document.querySelectorAll("[data-theater]");
  const modalBody = document.querySelector(".final-form");
  let theaterId;
  const closeModalButton = document.getElementById("closeModalButton");
  theaterRadios.forEach((radio) => {
    radio.addEventListener("click", function () {
      const theaterType = this.getAttribute("data-theater");
      if (theaterType === "executive") theaterId = 0;
      else if (theaterType === "standerd") theaterId = 1;
      else if (theaterType === "couple") theaterId = 2;
      const today = new Date().toISOString().split("T")[0];
      datePicker.setAttribute("min", today);
    });
  });
  datePicker.addEventListener("change", async function () {
    const selectedDate = formatDateFromISOToDMY(this.value);

    // Make API call to get slot info
    try {
      const response = await fetch(`${host}/theater/getSlotInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theaterId, // Replace with the actual theater ID
          dateValue: selectedDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Request Error: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Process the responseData to update slot display
      updateSlotDisplay(selectedDate, responseData.data, theaterId);
    } catch (error) {
      console.error(error.message);
    }
  });
  closeModalButton.addEventListener("click", function () {
    window.location.href = "/";
  });

  function updateSlotDisplay(selectedDate, slotsData, theaterId) {
    slotContainer.innerHTML = "";

    // if (slotsData.length === 0) {

    // } else {

    const availableSlots = slotsData.filter((slot) => !slot.booked);
    if (availableSlots.length) {
      const slotsAvailableMessage = document.createElement("h5");
      slotsAvailableMessage.textContent = "Slots available :";
      slotContainer.style.marginLeft = "2rem";
      slotContainer.appendChild(slotsAvailableMessage);
      availableSlots.forEach((slot) => {
        const slotButton = document.createElement("button");
        slotButton.className = "slot-button";
        slotButton.innerHTML = slot.value;
        slotButton.name = "slot";
        slotButton.onclick = function () {
          slotContainer.classList.add("disabled");
          datePicker.disabled = true;
          openBookingForm(selectedDate, slot.value, slot.id, theaterId);
        };
        slotContainer.appendChild(slotButton);
      });
    } else {
      const noSlotsMessage = document.createElement("h5");
      noSlotsMessage.textContent = "No slots available";
      slotContainer.style.marginLeft = "0";
      slotContainer.appendChild(noSlotsMessage);
    }
  }

  function openBookingForm(slotDate, slotTime, slotId, theaterId) {
    modalBody.innerHTML = `
    <br/>
      <h5>Date: ${slotDate} & Time: ${slotTime}</h5>
      <br/>
      <input type="hidden" value="${slotDate}" name="date" id="date">
      <input type="hidden" value="${slotId}" name="slot" id="slot">
      <input type="hidden" value="${theaterId}" name="theater" id="theater">

<div class="mb-3">
  <label for="name" class="form-label">Name</label>
  <input type="text" name="name" class="form-control" id="name" required>
</div>

<div class="mb-3">
  <label for="whatsapp" class="form-label">WhatsApp Number</label>
  <input name="whatsapp" type="tel" class="form-control" id="whatsapp" pattern="[0-9]{10}" placeholder="10-digit number" required>
</div>

<div class="mb-3">
  <label for="email" class="form-label">Email</label>
  <input type="email" name="email" class="form-control" id="email" required>
</div>

<div class="mb-3">
  <label for="numberOfPeople" class="form-label">Number of People</label>
  <input type="number" name="count" class="form-control" id="numberOfPeople" min="1" max="6" required>
</div>

<div class="mb-3">
  <label for="cake" class="form-label">Cake</label>
  <select name="cake" class="form-select" id="cake">
    <option value="" selected>Not Required</option>
    <option value="blackForest">Black Forest - ₹500</option>
    <option value="butterScotch">Butter Scotch - ₹500</option>
    <option value="chocolate">Chocolate - ₹500</option>
    <option value="pineApple">Pine Apple - ₹500</option>
    <option value="roundRedVelvet">Round Red Velvet - ₹600</option>
    <option value="buleBerry">Blueberry - ₹600</option>
    <option value="mangoCake">Mango Cake - ₹600</option>
    <option value="heartRedVelvet">Heart Red Velvet - ₹600</option>
    <option value="deathByChocolate">Death By Chocolate - ₹700</option>
    <option value="chocoAlmond">Choco Almond - ₹750</option>
    <option value="heartPinata">Heart Pinata - ₹850</option>
  </select>
</div>

<div class="mb-3">
  <label for="decoration" class="form-label">Decoration</label>
  <select name="decoration" class="form-select" id="decoration">
    <option value="" selected>Not Required</option>
    <option value="Birthday">Birthday - ₹300</option>
    <option value="Anniversary">Anniversary - ₹300</option>
    <option value="Romantic Date">Romantic Date - ₹300</option>
    <option value="Marriage Proposal">Marriage Proposal - ₹300</option>
    <option value="Bride To Be">Bride To Be - ₹300</option>
    <option value="Farewell">Farewell - ₹300</option>
    <option value="Congratulations">Congratulations - ₹300</option>
    <option value="Baby Shower">Baby Shower - ₹300</option>
  </select>
</div>
<button type="submit" class="btn btn-primary">Check Price</button>
<br>
<br>
<br>
<div class="mb-3 text-center">
<button id="payButton" style="display: none; background-color: green" class="btn btn-primary"></button>
</div>




    `;

    // Show the modal
    const datePickerModal = new bootstrap.Modal(document.getElementById("datePickerModal"));
    datePickerModal.show();

    // Handle form submission
    const userDetailsForm = document.getElementById("userDetailsForm");

    userDetailsForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const response = await calculatePrice();
      if (!response.ok) {
        throw new Error(`API Request Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      const amount = responseData.amount;

      await updatePayButtonPrice(amount, responseData.orderId);
    });

    const cakeDropdown = document.getElementById("cake");
    const decorationDropdown = document.getElementById("decoration");

    cakeDropdown.addEventListener("change", changePayButtonPrice);
    decorationDropdown.addEventListener("change", changePayButtonPrice);
  }

  const calculatePrice = async () => {
    const theaterid = document.getElementById("theater").value;
    const date = document.getElementById("date").value;
    const slot = document.getElementById("slot").value;
    const name = document.getElementById("name").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const email = document.getElementById("email").value;
    const count = document.getElementById("numberOfPeople").value;
    const decoration = document.getElementById("decoration").value;
    const cake = document.getElementById("cake").value;
    const response = await fetch(`${host}/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        slot,
        name,
        whatsapp,
        email,
        count,
        decoration,
        cake,
        theaterid,
      }),
    });
    return response;
  };
  const updatePayButtonPrice = async (amount, orderId) => {
    const payButton = document.getElementById("payButton");
    payButton.textContent = `Pay Now: ₹${amount}`;
    payButton.style.display = "inline";
    payButton.addEventListener("click", function () {
      const options = {
        key: "rzp_test_3VHA6PauX0jlhZ", // Replace with your actual Razorpay API key
        amount: amount * 100, // Razorpay amount is in paisa, so multiply by 100
        currency: "INR",
        name: "Flicker Fantasy",
        description: "Booking Payment",
        order_id: orderId, // This should come from your server response
        handler: function (response) {
          // Handle the payment success
          console.log("Payment successful:", response);
          // You can redirect or perform other actions after successful payment
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  };
  const changePayButtonPrice = async () => {
    const payButton = document.getElementById("payButton");
    payButton.style.display = "none";
  };

  function formatDateFromISOToDMY(isoDate) {
    const parts = isoDate.split("-");
    if (parts.length !== 3) {
      throw new Error("Invalid ISO date format");
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${day}/${month}/${year}`;
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
