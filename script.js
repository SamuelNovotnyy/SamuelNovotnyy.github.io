// Document ready function
$(document).ready(() => {
  // Cache DOM elements
  const $document = $(document);
  const $window = $(window);
  const htmlName = location.pathname;
  const root = $(":root");
  const rootStyles = window.getComputedStyle(root[0]);
  const $body = $("body");
  const $html = $("html");
  const $heroVideo = $("#pc-index-hero-video");
  const $heroVideoContainer = $("#pc-index-video-container");
  const $moon = $("#moon");
  const $sun = $("#sun");
  const $langContainer = $(".container-lang");
  const $subLangMenu = $(".sub-lang-menu");
  const $selectedLangDisplay = $(".selected-lang-display");
  const $selectLang = $("[data-lang-toggle]");
  const $selection = $('[id="inputselect"]');
  const $heroSelect = $("#pc-skeleton-hero-select");
  const $fadeinElements = $(".fadein");
  const $indexHeroContainer = $("#index-hero-all-container");

  // ReCaptcha widget
  const captchaManager = {
    init() {
      this.container = $(".recaptcha-container");
      this.widgetId = null;
      this.currentTheme = themeManager.currentTheme;
      this.currentLang = langManager.currentLang;
      this.isScriptLoaded = false;
      this.pendingRender = false;
      if (this.container.length > 0) {
        this.loadRecaptchaScript();
      }
    },

    loadRecaptchaScript() {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isScriptLoaded = true;
        this.waitForGrecaptcha();
      };
      document.head.appendChild(script);
    },

    waitForGrecaptcha() {
      if (typeof grecaptcha !== "undefined" && grecaptcha.render) {
        this.renderRecaptcha();
      } else {
        setTimeout(() => this.waitForGrecaptcha(), 100);
      }
    },

    renderRecaptcha() {
      if (!this.isScriptLoaded) {
        this.pendingRender = true;
        return;
      }

      if (!this.container) {
        console.error("reCAPTCHA container not found");
        return;
      }

      try {
        if (this.widgetId === null) {
          this.widgetId = grecaptcha.render(this.container[0], {
            sitekey: "6LedPjQqAAAAAJMU6rOa7uttjsfEQQJmP0oBnWC4",
            theme: this.currentTheme,
            hl: this.getLangCode(this.currentLang),
          });
        } else {
          grecaptcha.reset(this.widgetId, {
            theme: this.currentTheme,
            hl: this.getLangCode(this.currentLang),
          });
        }
      } catch (error) {
        console.error("Error rendering reCAPTCHA:", error);
      }
    },

    updateTheme(theme) {
      this.currentTheme = theme;
      if (this.isScriptLoaded && this.widgetId !== null) {
        this.renderRecaptcha();
      }
    },

    updateLanguage(lang) {
      this.currentLang = lang;
      if (this.isScriptLoaded && this.widgetId !== null) {
        this.renderRecaptcha();
      }
    },

    getLangCode(lang) {
      const langMap = {
        en: "en",
        sk: "sk",
        ch: "zh-CN",
      };
      return langMap[lang] || "en";
    },
  };

  // Theme management
  const themeManager = {
    init() {
      this.$themeSelect = $("#m-skeleton-theme-select");
      this.$themeToggle = $("[data-theme-toggle]");
      this.themeMap = {
        light: "light",
        dark: "dark",
        neo: "dark",
        metro: "light",
        code: "dark",
      };

      this.currentTheme = this.getTheme();
      this.updateTheme(this.currentTheme);
      this.updateSelectValue(this.currentTheme);
      this.bindEvents();
      this.addResizeListener();
    },

    canUseAltThemes() {
      return $(window).width() < 1280;
    },

    getTheme() {
      if (this.canUseAltThemes()) {
        return (
          localStorage.getItem("altTheme") ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light")
        );
      } else {
        return (
          localStorage.getItem("theme") ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light")
        );
      }
    },

    async updateCaptcha(theme) {
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      while (captchaManager.widgetId === null || captchaManager.widgetId === undefined) {
        await delay(100);
      }

      const captchaTheme = this.themeMap[theme] || "dark";
      captchaManager.updateTheme(captchaTheme);
    },

    updateTheme(theme) {
      this.currentTheme = theme;
      this.updateCaptcha(theme);
      $("html").attr("data-theme", theme);
      $("#moon").toggleClass("hidden", theme === "dark");
      $("#sun").toggleClass("hidden", theme === "light");
    },

    updateSelectValue(theme) {
      this.$themeSelect.val(theme);
    },

    toggleTheme() {
      const newTheme = this.currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("theme", newTheme);
      localStorage.setItem("altTheme", newTheme);

      this.updateSelectValue(newTheme);
      this.updateTheme(newTheme);
    },

    selectTheme(selectedTheme) {
      localStorage.setItem("altTheme", selectedTheme);

      this.updateSelectValue(selectedTheme);
      this.updateTheme(selectedTheme);
    },

    bindEvents() {
      this.$themeToggle.on("click", () => this.toggleTheme());
      this.$themeSelect.on("change", (e) => this.selectTheme(e.target.value));
    },

    addResizeListener() {
      let lastCanUseAltThemes = this.canUseAltThemes();
    
      $(window).on("resize", () => {
        const currentCanUseAltThemes = this.canUseAltThemes();
    
        if (!currentCanUseAltThemes && this.currentTheme !== "light" && this.currentTheme !== "dark") {
          const newTheme = this.themeMap[this.currentTheme] || "dark";
          this.updateTheme(newTheme);
          this.updateSelectValue(newTheme);
        } else if (currentCanUseAltThemes && !lastCanUseAltThemes) {
          const newTheme = localStorage.getItem("altTheme");
          this.updateTheme(newTheme);
          this.updateSelectValue(newTheme);
        }
    
        lastCanUseAltThemes = currentCanUseAltThemes;
      });
    }
  };

  // Language management
  const langManager = {
    init() {
      this.currentLang = localStorage.getItem("lang") || "en";
      this.setLocale(this.currentLang);
      this.bindEvents();
    },

    async setLocale(newLocale) {
      const newTranslations = await this.fetchTranslations(newLocale);
      this.currentLang = newLocale;
      this.translations = newTranslations;
      this.translatePage();
      this.setSelect(newLocale);
      formEventHandler.tempAlertTranslate(newLocale);
      localStorage.setItem("lang", newLocale);
      captchaManager.updateLanguage(newLocale);
    },

    setSelect(langSF) {
      $selectLang.val(langSF);
    },

    async fetchTranslations(newLocale) {
      const isIndexPage =
        location.pathname.endsWith("index.html") || location.pathname === "/";
      const langPath = isIndexPage
        ? `i18n/${newLocale}.json`
        : `../i18n/${newLocale}.json`;
      return $.getJSON(langPath);
    },

    translatePage() {
      $("[data-i18n-key]").each((_, el) => {
        const $el = $(el);
        const key = $el.data("i18n-key");
        $el.html(this.translations[key]);
      });

      $("[data-i18n]").each((_, el) => {
        const $el = $(el);
        const dataI18n = $el.data("i18n");
        const matches = dataI18n.match(/\[(.+?)\](.+)/);
        if (matches) {
          const attribute = matches[1];
          const key = matches[2];
          if (this.translations[key]) {
            $el.attr(attribute, this.translations[key]);
          }
        }
      });
    },

    bindEvents() {
      $selectLang.on("change", (e) => this.setLocale(e.target.value));
    },
  };

  // Hero management
  const heroManager = {
    elements: {
      1: $("#pc-index-video-container"),
      2: $("#pc-index-photo-container"),
      3: $("#pc-index-hero-carousel"),
    },
    init: function () {
      this.updateHero();
      this.bindEvents();
    },
    updateHero: function () {
      const savedHero = localStorage.getItem("data-hero") || "3";
      $heroSelect.val(savedHero);
      this.changeHero(savedHero);
    },
    changeHero: function (index) {
      $.each(this.elements, (_, $el) => $el.addClass("hidden"));
      this.elements[index]?.removeClass("hidden");
    },
    bindEvents: function () {
      $heroSelect.on("change", (e) => {
        const selectedValue = e.target.value;
        localStorage.setItem("data-hero", selectedValue);
        selectedValue == 3 ? location.reload() : this.changeHero(selectedValue);
      });
    },
  };

  // Fade-in effect
  const fadeManager = {
    init: function () {
      this.checkFadeIn();
      this.bindEvents();
    },
    checkFadeIn: function () {
      const offset = 30;
      const viewportTop = $window.scrollTop();
      const viewportBottom = viewportTop + $window.height();

      $fadeinElements.each((_, el) => {
        const $el = $(el);
        const elementTop = $el.offset().top;
        const elementBottom = elementTop + $el.outerHeight();

        if (
          elementBottom > viewportTop + offset &&
          elementTop < viewportBottom - offset
        ) {
          $el
            .css({ opacity: 1, transform: "translateY(0)" })
            .addClass("visible");
        } else if (
          $el.hasClass("visible") &&
          elementTop > viewportBottom - offset
        ) {
          $el
            .css({ opacity: 0, transform: `translateY(${offset}px)` })
            .removeClass("visible");
        }
      });
    },
    bindEvents: function () {
      $window.on("scroll", this.checkFadeIn.bind(this));
    },
  };

  // Carousel initialization
  const carouselManager = {
    init: function () {
      const $imagesHero = $("#pc-index-hero-carousel .carousel-cell");
      const $imagesAp = $("#pc-index-appliances-carousel .carousel-cell");
      let loadedImages = 0;

      $imagesHero.each((_, image) => {
        const img = new Image();
        img.src = $(image).css("background-image").slice(5, -2);
        img.onload = () => {
          if (++loadedImages === $imagesHero.length) {
            this.initHeroCarousel();
            loadedImages = 0;
          }
        };
      });

      $imagesAp.each((_, image) => {
        const img = new Image();
        img.src = $(image)
          .find(".appliance-img")
          .css("background-image")
          .slice(5, -2);
        img.onload = () => {
          if (++loadedImages === $imagesAp.length) {
            this.initApCarousel();
            loadedImages = 0;
          }
        };
      });
    },
    initHeroCarousel: function () {
      const $carouselElement = $("#pc-index-hero-carousel");
      const cellCount = $carouselElement.find(".carousel-cell").length;
      const randomIndex = Math.floor(Math.random() * cellCount);

      const $carousel = new Flickity("#pc-index-hero-carousel", {
        wrapAround: true,
        draggable: true,
        selectedAttraction: 0.08,
        friction: 0.6,
        autoPlay: 3000,
        imagesLoaded: true,
        pauseAutoPlayOnHover: false,
        cellAlign: "center",
        contain: true,
        percentPosition: false,
        pageDots: false,
        prevNextButtons: false,
        initialIndex: randomIndex,
      });

      $carousel.on("dragEnd", () => $carousel.playPlayer());
    },

    initApCarousel: function () {
      let tries;

      const $carouselElement = $("#pc-index-appliances-carousel");
      const cellCount = $carouselElement.find(".carousel-cell").length;
      const randomIndex = Math.floor(Math.random() * cellCount);

      const $carousel = new Flickity("#pc-index-appliances-carousel", {
        wrapAround: true,
        draggable: true,
        selectedAttraction: 0.02,
        friction: 0.4,
        autoPlay: 2500,
        imagesLoaded: true,
        pauseAutoPlayOnHover: true,
        cellAlign: "center",
        contain: true,
        percentPosition: false,
        pageDots: false,
        prevNextButtons: true,
        initialIndex: randomIndex,
      });

      let isExpanded = false;

      $carousel.on(
        "staticClick",
        function (event, pointer, cellElement, cellIndex) {
          if (!cellElement) return;

          const $cell = $(cellElement);
          const $button = $cell.find("button");

          if (
            $button.length &&
            (event.target === $button[0] ||
              $.contains($button[0], event.target))
          ) {
            $cell.toggleClass("expanded");
            isExpanded = !isExpanded;

            $carousel.options.draggable = !isExpanded;

            if (isExpanded) {
              $carousel.unbindDrag();
              $carousel.stopPlayer();
              $button.data("i18n-key", "index-choice-expand-button-e");
            } else {
              $carousel.bindDrag();
              $carousel.playPlayer();
              $button.data("i18n-key", "index-choice-expand-button");
            }

            langManager.translatePage();
            $carousel.reposition();
          }
        }
      );

      if (
        $carouselElement &&
        $carouselElement.find(".flickity-viewport").css("height") != "600px" &&
        tries < 10
      ) {
        console.warn("Carousel hasn't loaded properly, trying again...");
        this.initApCarousel();
        tries++;
        return;
      }
      $window.on("resize", () => $carousel.reposition());
      $carousel.on("dragEnd", () => $carousel.playPlayer());
    },
  };

  // Contact options initialization
  const contactOptionsManager = {
    init: function () {
      this.$options = $(".click-option");
      this.$optionContent = $(".content-option");
      var storedSelected = localStorage.getItem("contactOption") || 0;
      this.setOption(storedSelected);
      this.bindEvents();
    },
    setOption: function (index) {
      this.$options.removeClass("selected");
      this.$options.eq(index).addClass("selected");
      this.$optionContent.hide();
      this.$optionContent.eq(index).show();
      localStorage.setItem("contactOption", index);
    },
    bindEvents: function () {
      const self = this;
      this.$options.on("click", function () {
        const index = self.$options.index(this);
        self.setOption(index);
      });
    },
  };

  // Form Valiation
  const formEventHandler = {
    init() {
      this.$form = $(".form");
      this.$formInputs = this.$form.find("input, select, textarea");
      this.$formInputsRadio = this.$form.find("input[type=radio]");
      this.$formWarning = $("#form-warning-sent");
      this.$imageDisplay = $("#image-display");
      this.$formInfoWarning = $("#form-warning-filled");
      this.$infoMessage = this.$formInfoWarning.text();
      this.$warningText = this.$formWarning.find("h5");
      this.$submitButton = this.$form.find(".form-submit");
      this.$spinner = this.$form.find(".fa-circle-notch");
      this.defaultNumberRegion = "SK";

      if (this.$form.length > 0) {
        this.phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
      }

      this.$form.on("submit", this.handleSubmit.bind(this));
      this.$submitButton.on("click", this.validateForm.bind(this));
      this.$formInputs.on("input", function (event) {
        formEventHandler.hideErrorMessage(event.target);
        formEventHandler.toggleErrorMessage(" ", false);
      });

      this.initTelAutoFormat();
    },

    submitLoading(show) {
      if (show) {
        this.$submitButton.attr("data-type", "sub00");
        this.tempAlertTranslate(localStorage.getItem("lang"));

        let buttonValue = this.$submitButton.val();
        let dotCount = 0;

        this.dotInterval = setInterval(() => {
          dotCount = (dotCount % 3) + 1;
          this.$submitButton.val(buttonValue + ".".repeat(dotCount));
        }, 300);
      } else {
        clearInterval(this.dotInterval);
        this.$submitButton.attr("data-type", "sub0");
        this.tempAlertTranslate(localStorage.getItem("lang"));
      }
    },

    handleSubmit(event) {
      event.preventDefault();
      this.submitLoading(true);

      try {
        if (!this.validateForm(false)) {
          this.submitLoading(false);
          return;
        }

        const captchaResponse = grecaptcha.getResponse();
        if (captchaResponse.length === 0) {
          this.tempAlert(
            document.getElementsByClassName("recaptcha-container"),
            "cap"
          );
          this.showWarning("Please complete the CAPTCHA.");
          this.submitLoading(false);
          return;
        }

        this.sendFormData();
      } catch (err) {
        console.log(err);
        this.submitLoading(false);
        this.$submitButton.val("Something went wrong");
      }
    },

    validateForm() {
      let isValid = true;

      this.$form
        .find("input[required], textarea[required], input[type=file]")
        .each((_, element) => {
          const $element = $(element);
          const value = $.trim($element.val());

          if (!value && $element.attr("type") != "file") {
            this.tempAlert(element, "emp");
            isValid = false;
            return;
          } else if ($element.attr("type") === "tel") {
            const number = this.phoneUtil.parseAndKeepRawInput(
              value,
              this.getRegionCode()
            );
            if (!this.phoneUtil.isValidNumber(number)) {
              this.tempAlert(element, "tel");
              isValid = false;
              return;
            }
          } else if ($element.is("textarea")) {
            if (value.replace(/\s/g, "").length < 10) {
              this.tempAlert(element, "len");
              isValid = false;
              return;
            }
          } else if ($element.attr("type") === "file") {
            if (parseInt($element.get(0).files.length) > 8) {
              this.tempAlert(element, "fle");
              isValid = false;
              return;
            }
          } else if ($element.attr("type") === "radio") {
            var groupName = $element.attr("name");
            if ($("input[name='" + groupName + "']:checked").length === 0) {
              this.tempAlert(element, "rad");
              isValid = false;
              return;
            }
          }
        });

      this.toggleErrorMessage(
        "Please fill out all the required fields properly",
        !isValid
      );
      return isValid;
    },

    sendFormData() {
      const formData = new FormData(this.$form[0]);
      const $phoneInput = $("input[name='phone']");
      const number = $phoneInput.val();

      if ($phoneInput) {
        let numberType = "Unknown";
        const numberParse = this.phoneUtil.parse(number, this.getRegionCode());

        if (this.phoneUtil.isValidNumber(numberParse)) {
          // Get number type
          numberType = this.phoneUtil.getNumberType(numberParse);
          switch (numberType) {
            case libphonenumber.PhoneNumberType.FIXED_LINE:
              numberType = "Fixed Line";
              break;
            case libphonenumber.PhoneNumberType.MOBILE:
              numberType = "Mobile";
              break;
            case libphonenumber.PhoneNumberType.FIXED_LINE_OR_MOBILE:
              numberType = "Fixed Line or Mobile";
              break;
            default:
              numberType = "Other";
          }
        }
        formData.set("phone-number-type", numberType);
        formData.set("phone", number);
        formData.set("ip-country", this.ipAddress);
      }

      $.ajax({
        url: "../mailer-tester.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: () => {
          this.submitLoading(false);
          this.toggleErrorMessage(" ", false);
          this.$submitButton
            .css("pointer-events", "none")
            .attr("data-type", "sub01");
          this.tempAlertTranslate(localStorage.getItem("lang"));
          setTimeout(() => {
            this.$form[0].reset();
            try {
              displayImage.removeImage("_");
            } catch (e) {}
            grecaptcha.reset();
            this.$submitButton
              .css("pointer-events", "all")
              .attr("data-type", "sub0");
            this.$imageDisplay.css("background-image", "none");
            this.tempAlertTranslate(localStorage.getItem("lang"));
            this.$form
              .find(".form-alert")
              .filter(function () {
                return !$(this).prev().find("input[type=submit]").length;
              })
              .hide();
          }, 2000);
        },
        error: () => {
          this.submitLoading(false);
          this.showWarning(
            "There was a problem sending your message. Please try again later."
          );
        },
      });
    },

    getRegionCode() {
      if (this.phoneNumberRegion != "failed") {
        return this.phoneNumberRegion;
      } else {
        return this.defaultNumberRegion;
      }
    },

    getExampleNumber() {
      try {
        var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        var numberObj = phoneUtil.getExampleNumberForType(
          this.getRegionCode(),
          3
        );
        var format =
          this.phoneNumberRegion === "SK"
            ? libphonenumber.PhoneNumberFormat.NATIONAL
            : libphonenumber.PhoneNumberFormat.INTERNATIONAL;
        return phoneUtil.format(numberObj, format);
      } catch (e) {
        return "";
      }
    },

    initTelAutoFormat() {
      const telInput = this.$form.find("input[type=tel]");
      //const apiKey = "4e823293eb8e899168ec5555930887b8";
      const apiKey = "1734de5f3114d9";

      //$.get(`http://api.ipstack.com/check?access_key=${apiKey}`, (data) => {
      $.get(`https://ipinfo.io/json?token=${apiKey}`, (data) => {
        if (data && data.country) {
          this.phoneNumberRegion = data.country;
          this.ipAddress = `${data.country}, ${data.city}, ${
            data.region || data.region_code
          }`;
          console.log(data);
        } else {
          this.phoneNumberRegion = "failed";
          console.error(
            "Location detection failed, using default " +
              this.defaultNumberRegion
          );
        }
      }).fail(() => {
        this.phoneNumberRegion = "failed";
        console.warn(
          "IP info request failed, using default " + this.defaultNumberRegion
        );
      });

      telInput.on("input", this.formatPhoneNumber.bind(this));
    },

    formatPhoneNumber(event) {
      const inputField = $(event.target);
      const val = inputField.val();
      const countryCode = this.getRegionCode();
      let clean = val.replace(/\D/g, "");

      if (clean.length > 2) {
        try {
          const parsed = this.phoneUtil.parse(clean, countryCode);
          const formatter = new libphonenumber.AsYouTypeFormatter(countryCode);
          let result = "";
          let next;

          if (
            clean.length > 4 &&
            !this.phoneUtil.isPossibleNumber(parsed) &&
            val.substr(0, 1) != "+"
          ) {
            this.tempAlert(event.target, "frm");
            return;
          }

          if (val.substr(0, 1) == "+") {
            clean = "+" + clean;
          }

          for (let i = 0; i < clean.length; i++) {
            next = formatter.inputDigit(clean.charAt(i));
            if (
              result &&
              next.length <= result.length &&
              next.indexOf(" ") == -1
            ) {
              break;
            }
            result = next;
          }

          if (result.charAt(result.length - 1) == " ") {
            result = result.substr(0, result.length - 1);
          }

          // Update the input field with the formatted number
          inputField.val(result);
        } catch (err) {
          console.error("Error formatting phone number:", err);
          // If there's an error, just keep the original input
          inputField.val(val);
        }
      }
    },

    toggleErrorMessage(message, show) {
      const $parent = this.$formInfoWarning.parent();
      const $icon = $parent.find("i");

      if (show) {
        this.$formInfoWarning.text(message);
        $icon.addClass("fa-triangle-exclamation");
        $icon.removeClass("fa-circle-info");
        $parent.css("color", "var(--warning-text)").attr("data-type", "sub1");
        this.tempAlertTranslate(localStorage.getItem("lang"));
      } else {
        this.$formInfoWarning.text(this.$infoMessage);
        $icon.removeClass("fa-triangle-exclamation");
        $icon.addClass("fa-circle-info");
        $parent.css("color", "inherit").attr("data-type", "sub2");
        this.tempAlertTranslate(localStorage.getItem("lang"));
      }
    },

    hideErrorMessage(el) {
      const $element = $(el);
      const clean = $(el).val().replace(/\D/g, "");

      if ($element.attr("type") === "radio") {
        var groupName = $element.attr("name");
        document.getElementsByName(groupName).forEach(function (el) {
          el.setCustomValidity("");
        });
      }
      try {
        el.setCustomValidity("");
      } catch (e) {
        console.log(e);
      }

      if ($element.attr("type") === "radio") {
        var $parent = $element.parents(":eq(1)");
      } else if ($element[0] === $("#form-remove-files")[0]) {
        var $parent = $element.parents(":eq(1)");
      } else {
        var $parent = $element.parent();
      }

      //console.log($parent);
      if (clean.length > 3 && $(el).attr("type") === "tel") {
        const number = this.phoneUtil.parseAndKeepRawInput(
          clean,
          this.getRegionCode()
        );
        if (this.phoneUtil.isValidNumber(number)) {
          $parent.find(".form-alert").hide();
        }
      } else {
        $parent.find(".form-alert").hide();
      }
    },

    tempAlert(el, type) {
      const lang = localStorage.getItem("lang") || "en"; // default to English if no language is set

      const constraints = this.getConstraintsByLang(lang);
      const $element = $(el);

      let $parent;
      if ($element.attr("type") === "radio") {
        $parent = $element.parents(":eq(1)");
      } else if (type === "rem") {
        $parent = $element.parents(":eq(1)");
        $parent.find(".form-alert").css("color", "inherit");
        $parent
          .find(".form-alert i")
          .removeClass("fa-triangle-exclamation")
          .addClass("fa-circle-info");
      } else {
        $parent = $element.parent();
      }

      const $alert = $parent.find(".form-alert");
      $alert.show();
      $alert.attr("data-type", type); // Assign the data-type attribute
      $alert.find("h5").text(constraints[type]);

      if (type != "rem") {
        $alert.css("color", "var(--warning-text)");
      }

      if (!$(el).hasClass("g-recaptcha") && type != "frm" && type != "rem") {
        try {
          el.setCustomValidity(constraints[type]);
          el.reportValidity();
        } catch (err) {
          console.error("Error setting custom validity:", err);
        }
      }
    },

    tempAlertTranslate(lang) {
      const constraints = this.getConstraintsByLang(lang);

      $(".form-alert").each(function () {
        const type = $(this).attr("data-type");
        $(this).find("h5").text(constraints[type]);
      });
      $("input[type=submit]").each(function () {
        const type = $(this).attr("data-type");
        $(this).val(constraints[type]);
      });
    },

    getConstraintsByLang(lang) {
      const constraints = {
        emp: {
          en: "This field is required.",
          sk: "Toto pole je povinné.",
          ch: "此字段为必填项。",
        },
        len: {
          en: "The message must be greater than 10 characters.",
          sk: "Správa musí obsahovať viac ako 10 znakov.",
          ch: "消息必须超过 10 个字符。",
        },
        tel: {
          en:
            "The number you provided is invalid. Expected value might be: " +
            this.getExampleNumber() +
            ".",
          sk:
            "Zadané číslo je neplatné. Očakávaná hodnota môže byť: " +
            this.getExampleNumber() +
            ".",
          ch:
            "您提供的号码无效。预期值可能是：" + this.getExampleNumber() + "。",
        },
        rad: {
          en: "At least one option must be picked",
          sk: "Musí byť vybraná aspoň jedna možnosť",
          ch: "必须选择至少一个选项",
        },
        fle: {
          en: "You can only upload a maximum of 8 files",
          sk: "Môžete nahrať maximálne 8 súborov",
          ch: "您最多只能上传 8 个文件",
        },
        cap: {
          en: "Please complete the CAPTCHA",
          sk: "Prosím, vyplňte CAPTCHA",
          ch: "请完成 CAPTCHA 验证",
        },
        frm: {
          en: "If the number isn't being auto-formatted, it hasn't been recognized by our system. Please try the international format with a leading '+' symbol.",
          sk: "Ak číslo nie je automaticky formátované, nebolo rozpoznané naším systémom. Skúste medzinárodný formát s predponou '+' symbolu.",
          ch: "如果号码未自动格式化，则可能未被我们的系统识别。请尝试使用带有 '+' 符号的国际格式。",
        },
        rem: {
          en: "Files successfully removed...",
          sk: "Súbory úspešne odstránené...",
          ch: "文件已成功删除...",
        },
        sub0: {
          en: "Submit",
          sk: "Odoslať",
          ch: "提交",
        },
        sub00: {
          en: "Submitting",
          sk: "Odosiela sa",
          ch: "正在提交",
        },
        sub01: {
          en: "Form submitted successfully",
          sk: "Formulár bol úspešne odoslaný",
          ch: "表格已成功提交。",
        },
        sub1: {
          en: "Please fill out all the required fields properly.",
          sk: "Prosím, vyplňte všetky povinné polia správne.",
          ch: "请正确填写所有必填字段",
        },
        sub2: {
          en: "All fields containing an asterisk * are required.",
          sk: "Všetky polia s hviezdičkou * sú povinné",
          ch: "所有包含星号 * 的字段都是必填项。",
        },
      };

      return Object.fromEntries(
        Object.entries(constraints).map(([key, value]) => [key, value[lang]])
      );
    },

    showWarning(message) {
      this.$warningText.text(message);
      this.$formWarning.css("opacity", "1");
    },
  };

  // scroll snapping functions
  const scrollHandler = {
    threshold: 100, // pixels
    snapStartDelay: 100, //milliseconds
    snapDuration: 300, // milliseconds

    init: function () {
      this.isScrolling = false;
      this.scrollTimeout = null;

      // Get the header height after a short delay to ensure it's rendered
      setTimeout(() => {
        this.headerHeight = $("#skeleton-header-container").outerHeight() || 0;
      }, 1000);

      $(window).on("scroll", this.handleScroll.bind(this), { passive: true });
    },

    handleScroll: function () {
      if (this.isScrolling) return;

      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.snapToElement();
      }, this.snapStartDelay);
    },

    snapToElement: function () {
      const scrollTop = $(window).scrollTop();
      const viewportHeight = $(window).innerHeight();

      let closestElement = null;
      let closestDistance = Infinity;

      $(".flex-align").each((element) => {
        const rect = $(element).offset();
        const elementTop = rect.top + scrollTop - this.headerHeight;
        const distanceFromViewportTop = Math.abs(elementTop - scrollTop);

        if (distanceFromViewportTop < closestDistance) {
          closestElement = element;
          closestDistance = distanceFromViewportTop;
        }
      });

      if (closestElement && closestDistance <= this.threshold) {
        this.isScrolling = true;
        const targetScrollTop =
          closestElement.offset().top + window.scrollTop - this.headerHeight;

        $(window).scrollTop(targetScrollTop);

        setTimeout(() => {
          this.isScrolling = false;
        }, this.snapDuration);
      }
    },
  };

  // form display image
  const displayImage = {
    init() {
      this.$imageInput = $("#imgInp");
      const $removeButton = $("#form-remove-files");

      this.$imageInput.on("change", (event) => this.readURL(event.target));
      $removeButton.on("click", (event) => this.removeImage(event.target));
    },

    readURL(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          $(".custom-file-upload").css({
            "background-image": "url(" + e.target.result + ")",
          });
        };

        reader.readAsDataURL(input.files[0]);
      } else {
        $(".custom-file-upload").css({
          "background-image": "none",
        });
      }
    },

    removeImage(input) {
      this.$imageInput.val("");
      this.readURL(input);
      formEventHandler.tempAlert(input, "rem");
      setTimeout(() => formEventHandler.hideErrorMessage(input), 2000);
    },
  };

  // copy to clipboard
  const copyToClipboard = {
    init() {
      this.$copyButtons = $(".option-text i");
      this.$copyButtons.on("click", (event) => this.copyText(event.target));
    },

    copyText(button) {
      const $button = $(button);
      // Find the closest <p> tag within the same <div> as the button
      const $p = $button.closest("div").find("p");
      const text = $p.text().trim();

      // Create a temporary input to hold the text
      const $tempInput = $("<input>");
      $("body").append($tempInput);
      $tempInput.val(text).select();

      // Copy the text to the clipboard
      document.execCommand("copy");
      $tempInput.remove();

      // Optionally, select the text inside the <p> tag for user feedback
      const range = document.createRange();
      range.selectNode($p[0]);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Notify the user
      buttonFontSize = $button.css("font-size");
      $button
        .addClass("show-popup show-popup-text fa-circle-check")
        .removeClass("fa-clone")
        .css("font-size", "1.24rem");
      setTimeout(() => {
        $button.removeClass("show-popup");
      }, 1500);
      setTimeout(() => {
        $button
          .removeClass("show-popup-text fa-circle-check")
          .addClass("fa-clone")
          .css("font-size", buttonFontSize);
      }, 2000);
    },
  };

  // form_contact animation
  const FCanimation = {
    init() {
      this.movingContainer = $("#index-form_contact-d2");
      this.animationClass = "movingContainer-animate"; // CSS class that triggers animations

      this.bindEvents();
    },

    bindEvents() {
      $(window).on("scroll", () => {
        this.checkAnimationTrigger();
      });
    },

    checkAnimationTrigger() {
      const containerTop = this.movingContainer.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();

      if (windowBottom >= containerTop) {
        this.triggerAnimation();
      }
    },

    triggerAnimation() {
      this.movingContainer.addClass(this.animationClass);
    },
  };

  // sidebar handler
  const sidebarHandler = {
    init() {
      this.$sidebar = $("#sidebar");
      this.$darkenBody = $("#bg-darken-all");
      this.$sidebarToggle = $("#sidebar-toggle-icon");
      this.$sidebarClose = $(".sidebar-close");
      this.$sidebarContent = $(".sidebar-content");
      this.$sidebarToggle.on("click", (event) => this.toggleSidebar(event));
      this.$sidebarClose.on("click", (event) => this.toggleSidebar(event));
      this.$darkenBody.on("click", (event) => this.toggleSidebar(event));
    },

    toggleSidebar(event) {
      event.preventDefault();
      this.$sidebar.toggleClass("sidebar-open");
      this.$darkenBody.toggleClass("darkenAll-open");
      $body.toggleClass("noscroll");
    },
  };

  //check the window isn't inside an iframe
  if (window.self == window.top) {
    //initialize global managers
    themeManager.init();
    langManager.init();
    fadeManager.init();
    sidebarHandler.init();
    //scrollHandler.init();

    // Initialize specific managers based on the page URL
    window.onload = function () {
      const topLocation = window.top.location.href;

      if (topLocation.endsWith("index.html")) {
        heroManager.init();
        carouselManager.init();
        FCanimation.init();
      } else if (topLocation.endsWith("form.html")) {
        captchaManager.init();
        formEventHandler.init();
        displayImage.init();
      } else if (topLocation.endsWith("contact.html")) {
        captchaManager.init();
        contactOptionsManager.init();
        formEventHandler.init();
        copyToClipboard.init();
      } else if (topLocation.endsWith("info.html")) {
        // Nothing yet
      } else {
        console.error("Invalid page URL:", topLocation, "Redirecting to index");
        window.top.location.href = "index.html";
      }
    };
  } else {
    var topNav = document.getElementById("skeleton-header-container");
    var body = $("body");
    if (topNav) {
      topNav.parentNode.removeChild(topNav);
      topNav.remove();
    }
    body.css("margin-top", "0");
    $(".hero-container").css("height", "100vh");
    $("#form-hero").parent().css("align-items", "bottom");

    // Initialize only some managers
    themeManager.init();
    langManager.init();
    fadeManager.init();
    contactOptionsManager.init();
  }
});
