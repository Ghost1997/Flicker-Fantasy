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

  const rKey = "rzp_test_3VHA6PauX0jlhZ";

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
      if (theaterType === "one") theaterId = 0;
      else if (theaterType === "two") theaterId = 1;
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

  document.addEventListener("DOMContentLoaded", function () {
    var datePickerModal = document.getElementById("datePickerModal");
    datePickerModal.addEventListener("hidden.bs.modal", function () {
      resetModal();
    });
  });
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
        slotButton.innerHTML = slot.slotname;
        slotButton.name = "slot";
        slotButton.onclick = function () {
          slotContainer.classList.add("disabled");
          datePicker.disabled = true;
          openBookingForm(selectedDate, slot.slotname, slot.id, theaterId);
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
      <div class="mb-3">
    <label for="decoration" class="form-label">Celebration type</label>
    <select name="decoration" class="form-select" id="decoration" required >
        <option value="" selected>Not Required</option>
        <option value="privateTheater">Private Theater - @1199</option>
        <option value="birthday">Surprise Birthday - @1999</option>
        <option value="anniversary">Surprise Anniversary - @1999</option>
        <option value="momToBe">Surprise Mom To Be - @2299</option>
        <option value="brideToBe">Surprise Bride To Be - @2299</option>
        <option value="marriage">Surprise Love/Marriage Proposal - @2999</option>
  </select>
  </div>
  <div class="mb-3">
  
  <img src="" alt="Decoration" id="decorationImage" style="max-width: 100%; max-height: 100%;">
  </div>
        <h5>Date: ${slotDate} & Time: ${slotTime}</h5>
        <br/>
        <input type="hidden" value="${slotDate}" name="date" id="date">
        <input type="hidden" value="${slotId}" name="slot" id="slot">
        <input type="hidden" value="${theaterId}" name="theater" id="theater">
  
  <div class="mb-3">
    <label for="name" class="form-label">Booking Name</label>
    <input type="text" name="name" class="form-control" id="name" required>
  </div>
  
  <div class="mb-3">
    <label for="whatsapp" class="form-label">WhatsApp Number</label>
    <input name="whatsapp" type="tel" class="form-control" id="whatsapp" pattern="[0-9]{10}" placeholder="10-digit number" required>
  </div>
  
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" name="email" class="form-control" id="email">
  </div>
  
  <div class="mb-3">
    <label for="numberOfPeople" class="form-label">Number of People</label>
    <input type="number" name="count" class="form-control" id="numberOfPeople" required>
  </div>
  
  <div class="mb-3">
    <label for="cake" class="form-label">Cake</label>
    <select name="cake" class="form-select" id="cake">
      <option value="blackForestRound">Black Forest Round</option>
      <option value="blackForestHeart">Black Forest Heart</option>
      <option value="butterScotchRound">Butter Scotch Round</option>
      <option value="butterScotchHeart">Butter Scotch Heart</option>
      <option value="chocolateRound">Chocolate Round</option>
      <option value="chocolateHeart">Chocolate Heart</option>
      <option value="pineAppleRound">Pine Apple Round</option>
      <option value="pineAppleHeart">Pine Apple Heart</option>
      <option value="roundRedVelvetRound">Red Velvet Round</option>
      <option value="roundRedVelvetHeart">Red Velvet Heart</option>
      <option value="buleBerryRound">Blueberry Round</option>
      <option value="buleBerryHeart">Blueberry Heart</option>
      <option value="mangoCakeRound">Mango Cake Round</option>
      <option value="mangoCakeHeart">Mango Cake Heart</option>
    </select>
  </div>
  <div class="mb-3">
    <label for="message" class="form-label">Message on Cake</label>
    <input type="message" name="message" class="form-control" id="message" placeholder="Upto 25 Character" maxlength="25">
    <small id="charCount" class="form-text text-muted">0/25 characters</small>
  </div>
  <div class="mb-3">
    <label for="addOn" class="form-label">Add On</label>
    <div class="row">
      <div class="col-md-6">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="bouquet" name="bouquet">
          <label class="form-check-label" for="bouquet">Bouquet: ₹349</label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="chocolate" value= name="chocolate">
          <label class="form-check-label" for="chocolate">Chocolate: ₹449</label>
        </div>
      </div>
    </div>
    <small class="form-text text-muted">Bouquet: <a href="/img/bouquet.jpg" target="_blank">Click here</a> & Chocolates: <a href="/img/chocolate.jpg" target="_blank">Click here</a></small>
  </div>

  
  <button type="submit" id="checkPrice" class="btn btn-primary">Check Price</button>
  <br>
  <br>
  <br>
  <div class="mb-3 text-center">
  <button  id="payButton" style="display: none; background-color: green" class="btn btn-primary"></button>
  </div>
  
      `;
    const theaterid = document.getElementById("theater").value;
    const numberOfPeopleInput = document.getElementById("numberOfPeople");
    if (theaterid === "2") {
      numberOfPeopleInput.max = 4;
      numberOfPeopleInput.min = 1;
      numberOfPeopleInput.placeholder = "1 - 4";
    } else {
      numberOfPeopleInput.max = 10;
      numberOfPeopleInput.min = 1;
      numberOfPeopleInput.placeholder = "1 - 10";
    }
    const messageInput = document.getElementById("message");
    const charCount = document.getElementById("charCount");

    messageInput.addEventListener("input", function () {
      charCount.textContent = `${messageInput.value.length}/25 characters`;
    });
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
      const total = responseData.total;

      await updatePayButtonPrice(amount, total, responseData.orderId, responseData.payload);
    });

    const cakeDropdown = document.getElementById("cake");
    const decorationDropdown = document.getElementById("decoration");
    const noOfPerson = document.getElementById("numberOfPeople");
    const chocolate = document.getElementById("chocolate");
    const bouquet = document.getElementById("bouquet");

    cakeDropdown.addEventListener("change", changePayButtonPrice);
    noOfPerson.addEventListener("change", changePayButtonPrice);
    decorationDropdown.addEventListener("change", changePayButtonPrice);
    chocolate.addEventListener("change", changePayButtonPrice);
    bouquet.addEventListener("change", changePayButtonPrice);

    const decorationImage = document.getElementById("decorationImage");

    decorationDropdown.addEventListener("change", function () {
      const selectedOption = decorationDropdown.value;

      // Set the image source based on the selected option
      switch (selectedOption) {
        case "privateTheater":
          setDecorationImageSource("/img/theater.jpg");
          break;
        case "birthday":
          setDecorationImageSource("/img/birthday.jpg");
          break;
        case "anniversary":
          setDecorationImageSource("/img/anniversary.jpg");
          break;
        case "momToBe":
          setDecorationImageSource("/img/mom.jpg");
          break;
        case "brideToBe":
          setDecorationImageSource("/img/bride.jpg");
          break;
        case "marriage":
          setDecorationImageSource("/img/marriage.jpg");
          break;
        default:
          setDecorationImageSource("");
      }
    });

    // Trigger the change event to initialize the image based on the default selected option
    decorationDropdown.dispatchEvent(new Event("change"));
    function setDecorationImageSource(source) {
      // Check if the source is valid
      if (source && source.trim() !== "") {
        decorationImage.src = source;
        decorationImage.style.display = "block"; // Show the image
      } else {
        decorationImage.src = "";
        decorationImage.style.display = "none"; // Hide the image
      }
    }
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
    const message = document.getElementById("message").value;
    const chocolate = document.getElementById("chocolate").checked;
    const bouquet = document.getElementById("bouquet").checked;
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
        message,
        chocolate,
        bouquet,
      }),
    });
    return response;
  };

  const updatePayButtonPrice = async (amount, total, orderId, payload) => {
    const payButton = document.getElementById("payButton");
    payButton.textContent = `Book Now: ₹${total}`;
    payButton.style.display = "inline";

    // Add event listener to the payButton
    payButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent the default behavior of the button click event

      const response = await fetch(`/adminBookingRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload,
          amount,
          orderId,
          total,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) window.location.href = `/requestSent`;
    });
  };
  const changePayButtonPrice = async () => {
    const payButton = document.getElementById("payButton");
    const clonedPayButton = payButton.cloneNode(true);
    payButton.parentNode.replaceChild(clonedPayButton, payButton);

    // Hide the pay button
    clonedPayButton.style.display = "none";
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
