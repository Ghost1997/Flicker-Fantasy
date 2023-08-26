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

  const rKey = "rzp_test_OdnawryqhvxPn7";

  const datePicker = document.getElementById("datepicker");
  const slotContainer = document.getElementById("slotContainer");
  const theaterRadios = document.querySelectorAll("[data-theater]");
  const modalBody = document.querySelector(".final-form");
  const movieContainer1 = document.querySelector(".movie-container1");
  const movieContainer2 = document.querySelector(".movie-container2");
  let theaterId;
  const closeModalButton = document.getElementById("closeModalButton");
  theaterRadios.forEach((radio) => {
    radio.addEventListener("click", function () {
      const theaterType = this.getAttribute("data-theater");
      if (theaterType === "executive") theaterId = 0;
      else if (theaterType === "standerd") theaterId = 1;
      else if (theaterType === "couple") theaterId = 2;

      if (theaterId === 2) showMovieContainer("movie-container2");
      else showMovieContainer("movie-container1");
      const todayIST = new Date();
      todayIST.setHours(todayIST.getHours() + 5); // Add 5 hours for UTC+5
      todayIST.setMinutes(todayIST.getMinutes() + 30); // Add 30 minutes for UTC+5:30

      const todayISTFormatted = todayIST.toISOString().split("T")[0];
      datePicker.setAttribute("min", todayISTFormatted);
    });
  });
  datePicker.addEventListener("change", async function () {
    const selectedDate = formatDateFromISOToDMY(this.value);

    // Make API call to get slot info
    try {
      const response = await fetch(`/theater/getSlotInfo`, {
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
    resetModal();
  });

  function showMovieContainer(containerClass) {
    movieContainer1.style.display = "none";
    movieContainer2.style.display = "none";

    const selectedContainer = document.querySelector(`.${containerClass}`);
    selectedContainer.style.display = "block";
  }

  function resetModal() {
    // Clear the selected date
    document.getElementById("datepicker").value = "";
    document.getElementById("slotContainer").innerHTML = "";
    document.querySelector(".final-form").innerHTML = "";
    $("#datePickerModal").modal("hide");
    datePicker.disabled = false;
    slotContainer.classList.remove("disabled");
  }

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
  <optgroup label="Regular Decoration - ₹300">
      <option value="Birthday">Birthday</option>
      <option value="Anniversary">Anniversary</option>
      <option value="Romantic Date">Romantic Date</option>
      <option value="Marriage Proposal">Marriage Proposal</option>
      <option value="Bride To Be">Bride To Be</option>
      <option value="Farewell">Farewell</option>
      <option value="Congratulations">Congratulations</option>
      <option value="Baby Shower">Baby Shower</option>
  </optgroup>
  <optgroup label="Advanced Decoration - ₹500">
      <option value="Birthday-Advance">Birthday - Advanced</option>
      <option value="Anniversary-Advance">Anniversary - Advanced</option>
      <option value="Romantic Date-Advance">Romantic Date - Advanced</option>
      <option value="Marriage Proposal-Advance">Marriage Proposal - Advanced</option>
      <option value="Bride To Be-Advance">Bride To Be - Advanced</option>
      <option value="Farewell-Advance">Farewell - Advanced</option>
      <option value="Congratulations-Advance">Congratulations - Advanced</option>
      <option value="Baby Shower-Advance">Baby Shower - Advanced</option>
  </optgroup>
</select>
</div>
<button type="submit" class="btn btn-primary">Check Price</button>
<div class="note-text">
    <p class="note-red">Please note:</p>
    <p class="note-content">
      Final amount will consist of Booking fee + 2.5% platform fees
    </p>
  </div>
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

      await updatePayButtonPrice(amount, responseData.orderId, responseData.payload);
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
    const response = await fetch(`/calculate`, {
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
  const updatePayButtonPrice = async (amount, orderId, payload) => {
    const payButton = document.getElementById("payButton");
    payButton.textContent = `Pay Now: ₹${amount}`;
    payButton.style.display = "inline";
    payButton.addEventListener("click", async function () {
      const options = {
        key: rKey, // Replace with your actual Razorpay API key
        amount: amount * 100, // Razorpay amount is in paisa, so multiply by 100
        currency: "INR",
        name: "Flicker Fantasy",
        description: "Booking Payment",
        order_id: orderId,
        prefill: {
          name: payload.name,
          email: payload.email,
          contact: payload.whatsapp,
        },
        handler: async (response) => {
          const bookingResponse = await confirmBooking(response, payload);
          const responseData = await bookingResponse.json();
          const queryParams = new URLSearchParams(responseData).toString();
          window.location.href = `/booking/success?${queryParams}`;
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

  const confirmBooking = async (paymentInfo, userInfo) => {
    const response = await fetch(`/booking/bookTheater`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentInfo,
        userInfo,
      }),
    });
    return response;
  };
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
