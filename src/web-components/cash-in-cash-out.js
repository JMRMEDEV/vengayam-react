const colors = {
  svbBlue: {
    darker: "#10466a",
    dark: "#1164a8",
    medium: "#2b70b6",
    mediumLighter: "#3f80bd",
    light: "#6fc0ec"
  },
  gray: {
    light: "#fafafa",
    darker: "#e0e0e0",
    dark: "#6d6e6d"
  }
};

const noDataIcon = /*html*/ `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill=${colors.gray.dark} class="bi bi-list-ul" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg>`;

class CashInCashOut extends HTMLElement {
  // Max and min values for using in the graphs
  maxCashValue = 0;
  midCashValue = 0;
  // Field for storaging the currently selected month
  selectedMonth = "";
  // Actual data passed to the component
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = this.getInnerHTML();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const outerData = this.getAttribute("data");
    if (outerData.length > 0) {
      // Store the data passed to the web component
      this.data = JSON.parse(outerData);
    }
    // Reference the <div> that contains the rest of the elements
    var componentContainer = this.shadowRoot.getElementById(
      "component-container"
    );
    // Programatically set style
    var cashGraphContainer = componentContainer.querySelector(
      "#cash-graph-container"
    );
    var cashTexts = componentContainer.querySelector("#cash-texts");
    this.selectedMonth = this.getMonthString(new Date().getMonth());
    this.determineGraphValues(this.data);
    this.graphSetup(cashGraphContainer, cashTexts, this.data);
  }

  /**
   * Function meant to isolate the HTML template from the constructor, for
   * terms of order and structure.
   * @returns
   */
  getInnerHTML() {
    return /*html*/ `
    <style>
      .month-graphic:hover {
        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: white;
        cursor: pointer;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      }
    </style>
    <!-- Main container -->
    <div id="component-container" class="cash-in-cash-out" style="height: 100%; border-radius: 5px; padding: 0px 10px 10px 10px; display: flex; flex-direction: column; align-items: center; justify-content: space-around;">
        <!-- Cash Texts (In & Out), as well as graph colors references -->
        <div id="cash-texts" style="width: 100%; display: flex; background-color: transparent; padding-bottom: 15px; justify-content: left; margin-top: -6px"></div>
        <!--  Container for the whole graphics (the three months as well as the scales) -->
        <div id="cash-graph-container" style="display: flex; width: 100%; height: 80%; padding-bottom: 10px;">
            <!-- Reference scales -->
            <div id="cash-values" style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 75%">
                <div id="max" style="flex: 1; display: flex; align-items: flex-start; margin-top: -10px;"></div>
                <div id="mid" style="flex: 1; display: flex; align-items: center;"></div>
                <div style="flex: 1; display: flex; align-items: flex-end;"><b>0</b></div>
            </div>
            <!-- Actual graphics with month names -->
            <div class="month-cash-container" id="month-cash-container" style="flex: 9; display: flex; background-color: ${colors.gray.light}; border: 1px solid ${colors.gray.darker};">
                <div id="month-1" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;"></div>
                <div id="month-2" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;"></div>
                <div id="month-3" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;"></div>
            </div>
        </div>
    </div>`;
  }

  /**
   * Function that returns a month string from a month number.
   * @param {*} monthNumber
   * @returns month string
   */
  getMonthString(monthNumber) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    return months[monthNumber];
  }

  /**
   * Function for setting the content of the strings below the texts (cash in and cash out amounts)
   * @param {*} data
   * @returns    this.containerWidth = this.getAttribute("width");
    this.containerHeight = this.getAttribute("height");
   */
  setCashTextContent(data) {
    const monthData = data.filter((cashFlow) => {
      if (this.getMonthString(cashFlow.month) === this.selectedMonth) {
        return cashFlow;
      } else {
        return null;
      }
    });
    return /*html*/ `
    <!-- Quantities' containers (cash in & cash out) -->
    <div style="display: flex; flex-direction: column; justify-content: flex-start; flex: 1">
        <!-- Reference quantity color (which quantity represents which color) -->
        <div style="display: flex;">
            <svg width="16" height="16" style="margin-top: 15px;">
                <circle cx="10" cy="10" r="5" fill=${colors.svbBlue.light} />
            </svg>
            <p style="padding-left: 4px;">${this.selectedMonth} Cash In</p>
        </div>
        <!-- Cash string with USD currency -->
        <b style="margin-top: -14px; padding-left: 2px;">+${
          monthData.length > 0 ? monthData[0].cashIn : "NA"
        } USD</b>
    </div>
    <div style="display: flex; flex-direction: column; flex: 1;">
        <div style="display: flex;">
            <svg width="16" height="16" style="margin-top: 15px;">
                <circle cx="10" cy="10" r="5" fill=${colors.svbBlue.dark} />
            </svg>
            <p style="padding-left: 4px;">${this.selectedMonth} Cash Out</p>
        </div>
        <b style="margin-top: -14px; padding-left: 2px;">-${
          monthData.length > 0 ? monthData[0].cashOut : "NA"
        } USD</b>
    </div>`;
  }

  /**
   * Handler function for setting the selected month
   * @param {*} month
   */
  handleOnMonthClick(month) {
    this.selectedMonth = this.getMonthString(month);
  }

  /**
   * Function for returning the graphics that correspond to each month data
   * @param {*} monthNumber
   * @param {*} cashData
   * @returns
   */
  getMonthGraphic(monthNumber, cashData) {
    if (cashData !== undefined) {
      const cashInSize = `${(cashData.cashIn * 100) / this.maxCashValue}%`;
      const cashOutSize = `${(cashData.cashOut * 100) / this.maxCashValue}%`;
      return /*html*/ `
        <!-- Graphic month container (actual graphic and month string) -->
        <div id="month-graphic" class="month-graphic" style="display: flex; height: 100%; width: 100%; align-items: center; flex-direction: column;">
            <!-- Container for both graphics (cash in & cash out)-->
            <div style="display: flex; height: 90%; width: 100%; flex-direction: row; align-items: flex-end;">
            <!-- Cash in -->
            <div style="flex: 1; background-color: ${
              colors.svbBlue.light
            }; width: 50%; height: ${cashInSize}; margin: 0px 2px 0px 2px; border-radius: 5px;"></div>
            <!-- Cash out -->
            <div style="flex: 1; background-color: ${
              colors.svbBlue.dark
            }; width: 50%; height: ${cashOutSize}; margin: 0px 2px 0px 2px; border-radius: 5px;"></div>
            </div>
            <!-- Month string -->
            <p>${this.getMonthString(monthNumber)}</p>
        </div>`;
    } else {
      return /*html*/ `
        <div id="month-graphic" style="display: flex; height: 100%; width: 100%; align-items: center; flex-direction: column;">
            <div style="display: flex; height: 90%; width: 100%; flex-direction: row; align-items: flex-end;">
            <div style="flex: 1; width: 50%; height: 0%; margin: 0px 2px 0px 2px; border-radius: 5px; border-style: none none solid; border-width: 1px; border-color: ${
              colors.gray.darker
            };"></div>
            <div style="flex: 1; width: 50%; height: 0%; margin: 0px 2px 0px 2px; border-radius: 5px; border-style: none none solid; border-width: 1px; border-color: ${
              colors.gray.darker
            };"></div>
            </div>
            <p>${this.getMonthString(monthNumber)}</p>
        </div>`;
    }
  }

  /**
   * Function for setting class-level the max and mid values to be used for the graphics.
   * @param {*} data
   */
  determineGraphValues(data) {
    let cashQuantities = [];
    // Append quantities to dedicated array in order to get the min and mid
    // values that are going to be as reference for the graphics.
    data.forEach((cashFlow) => {
      cashQuantities.push(cashFlow.cashIn);
      cashQuantities.push(cashFlow.cashOut);
    });
    this.maxCashValue = cashQuantities.reduce(
      (a, b) => Math.max(a, b),
      -Infinity
    );
    this.midCashValue =
      cashQuantities.reduce((a, b) => Math.max(a, b), -Infinity) / 2;
  }

  /**
   * Function intended to set the full layout of the graphic, as well as all the logic involved on it,
   * based on the received data.
   * @param {*} cashGraphContainer
   * @param {*} cashTexts
   * @param {*} data
   */
  graphSetup(cashGraphContainer, cashTexts, data) {
    // Select the container for diplaying amounts
    var cashValuesContainer = cashGraphContainer.querySelector("#cash-values");
    var maxValue = cashValuesContainer.querySelector("#max");
    maxValue.innerHTML = `<b>${this.maxCashValue}</b>`;
    var midValue = cashValuesContainer.querySelector("#mid");
    midValue.innerHTML = `<b>${this.midCashValue}</b>`;
    // Select the container for displaying graphs per month
    var monthCashContainer = cashGraphContainer.querySelector(
      "#month-cash-container"
    );
    var month1 = monthCashContainer.querySelector("#month-1");
    var month2 = monthCashContainer.querySelector("#month-2");
    var month3 = monthCashContainer.querySelector("#month-3");
    // Get current month
    const currentMonth = new Date().getMonth();
    // Set the corresponding strings
    cashTexts.innerHTML = this.setCashTextContent(data);
    // We verify that we actually have data to display
    if (data.length > 0) {
      // We perform the following in order to fill with data those entries that
      // are not sucesive months
      let filledMissingMonths = [];
      data.forEach((dataEntry) => {
        if (dataEntry.month === currentMonth) {
          filledMissingMonths[2] = dataEntry;
        }
        if (dataEntry.month === currentMonth - 1) {
          filledMissingMonths[1] = dataEntry;
        } else {
          filledMissingMonths[1] = undefined;
        }
        if (dataEntry.month === currentMonth - 2) {
          filledMissingMonths[0] = dataEntry;
        } else {
          filledMissingMonths[0] = undefined;
        }
      });
      const sortedData = [...filledMissingMonths];
      // Only render month graphics if data array is greater than 0
      if (sortedData.length > 0) {
        sortedData.forEach((dataEntry, index) => {
          if (
            dataEntry !== undefined &&
            dataEntry.month === currentMonth &&
            index === sortedData.length - 1
          ) {
            // We should show at least one month graphic
            month3.innerHTML = this.getMonthGraphic(currentMonth, dataEntry);
            // We verify if we have data for the month prior to the current
          } else {
            month3.innerHTML = this.getMonthGraphic(currentMonth, undefined);
          }
          if (
            sortedData[index - 1] !== undefined &&
            sortedData[index - 1] !== null
          ) {
            month2.innerHTML = this.getMonthGraphic(
              currentMonth - 1,
              sortedData[index - 1]
            );
          } else {
            month2.innerHTML = this.getMonthGraphic(
              currentMonth - 1,
              undefined
            );
          }
          // We verify if we have data for the month prior to the previous
          if (
            sortedData[index - 2] !== undefined &&
            sortedData[index - 2] !== null
          ) {
            month1.innerHTML = this.getMonthGraphic(
              currentMonth - 2,
              sortedData[index - 2]
            );
          } else {
            month1.innerHTML = this.getMonthGraphic(
              currentMonth - 2,
              undefined
            );
          }
        });
      }
      // Add event listeners for clicks, redraw the cash text content if selected
      // month changed (only do it if elements exist)
      const month3Graphic = month3.querySelector("#month-graphic");
      if (month3Graphic !== null) {
        month3Graphic.addEventListener("click", () => {
          this.handleOnMonthClick(currentMonth);
          cashTexts.innerHTML = this.setCashTextContent(data);
        });
      }
      const month2Graphic = month2.querySelector("#month-graphic");
      if (month3Graphic !== null) {
        month2Graphic.addEventListener("click", () => {
          this.handleOnMonthClick(currentMonth - 1);
          cashTexts.innerHTML = this.setCashTextContent(data);
        });
      }
      const month1Graphic = month1.querySelector("#month-graphic");
      if (month3Graphic !== null) {
        month1Graphic.addEventListener("click", () => {
          this.handleOnMonthClick(currentMonth - 2);
          cashTexts.innerHTML = this.setCashTextContent(data);
        });
      }
    } else {
      cashGraphContainer.innerHTML = /*html*/ `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: ${colors.gray.dark}">
          ${noDataIcon}
          <b style="padding-top: 10px;">No cash movement yet</b>
          <p>Once you have cash move in or out from your account, it will appear here.</p>
        </div>`;
    }
  }

  // Callback called when the component is inserted into an HTML document’s DOM
  connectedCallback() {
    this.containerWidth = this.getAttribute("width");
    this.containerHeight = this.getAttribute("height");
    const outerData = this.getAttribute("data");
    if (outerData.length > 0) {
      // Store the data passed to the web component
      this.data = JSON.parse(outerData);
    }
    this.render();
  }

  render() {
    this.getElementsByClassName("cash-in-cash-out");
  }
}

customElements.get("cash-in-cash-out") ||
  window.customElements.define("cash-in-cash-out", CashInCashOut);
