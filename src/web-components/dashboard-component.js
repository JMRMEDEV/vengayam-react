import "./widget-wrapper";
import "./cash-in-cash-out";
import "./task-list";
import "./account-summary";

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

class DashboardComponent extends HTMLElement {
  widgets = ["cash-in-cash-out", "task-list", "account-summary"];
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = this.getInnerHTML();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    console.log(this.getAttribute("widgets"));
    const outerData = this.getAttribute("widgets")
      ? this.getAttribute("widgets")
      : [];
    if (outerData.length > 0) {
      // Store the data passed to the web component
      this.widgets = JSON.parse(outerData);
    }
    const columnContainer = this.shadowRoot.getElementById("column-container");
    this.chooseConentToRender(columnContainer, this.widgets);
  }

  /**
   * Function meant to isolate the HTML template from the constructor, for
   * terms of order and structure.
   * @returns
   */
  getInnerHTML() {
    return /*html*/ `
    <style>
      .dashboard-section:hover {
        font-weight: bold;
        cursor: pointer;
        background-color: ${colors.svbBlue.mediumLighter};
      }
    </style>
    <!-- Dashboard main container -->
    <div class='dashboard-widget'>
      <div id="content-container" style="display: flex; flex-direction: column; min-height: 100%; width: 100%;">
        <!-- Columns -->
        <div id="column-container" style="display: flex; flex-direction: row; justify-content: center; height: 100%; width: 100%; align-items: flex-start;">    
          <div id="column-0" style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; width: 50%;">
          </div>
          <div id="column-1" style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 50%;">
          </div>
        </div>
      </div> 
    </div>`;
  }

  /**
   * Function that returns corresponding widget HTML based on widget name.
   * @param {*} widgets
   */
  renderWidgets(widgets) {
    let widgetsHTML = [];
    widgets.forEach((widget) => {
      if (widget === "cash-in-cash-out") {
        widgetsHTML.push(/*html*/ `
          <widget-wrapper
            width="400px"
            height="500px"
            title="Cash In & Out"
          >
            <cash-in-cash-out
              slot="children"
              data='[{"month":10,"cashIn":634,"cashOut":800},{"month":8,"cashIn":576,"cashOut":453}]'
            ></cash-in-cash-out>
          </widget-wrapper>`);
      }
      if (widget === "task-list") {
        widgetsHTML.push(/*html*/ `
          <widget-wrapper
              width="300px"
              height="400px"
              title="Tasks"
          >
            <task-list slot="children"></task-list>
          </widget-wrapper>`);
      }
      if (widget === "account-summary") {
        widgetsHTML.push(/*html*/ `
          <widget-wrapper
              width="300px"
              height="400px"
              title="Summary"
          >
            <account-summary slot="children"></account-summary>
          </widget-wrapper>`);
      }
    });
    return widgetsHTML;
  }

  chooseConentToRender(container, widgets) {
    if (widgets.length > 0) {
      if (widgets.length === 1) {
        const widgetToRender = this.renderWidgets(widgets);
        container.innerHTML = widgetToRender[0];
      } else if (widgets.length === 2) {
        const widgetsToRender = this.renderWidgets(widgets);
        const column0 = container.querySelector("#column-0");
        column0.innerHTML = widgetsToRender[0];
        const column1 = container.querySelector("#column-1");
        column1.innerHTML = widgetsToRender[1];
      } else if (widgets.length === 3) {
        const widgetsToRender = this.renderWidgets(widgets);
        const column0 = container.querySelector("#column-0");
        column0.innerHTML = widgetsToRender[0];
        const column1 = container.querySelector("#column-1");
        column1.innerHTML = `${widgetsToRender[1]}${widgetsToRender[2]}`;
      }
    } else {
      container.innerHTML = /*html*/ `
      <div>
        <h3>You have not added any widgets yet.</h3>
      </div>`;
    }
  }

  connectedCallback() {
    console.log(this.getAttribute("widgets"));
    const columnContainer = this.shadowRoot.getElementById("column-container");
    const outerData = this.getAttribute("widgets")
      ? this.getAttribute("widgets")
      : [];
    if (outerData.length > 0) {
      // Store the data passed to the web component
      this.widgets = JSON.parse(outerData);
    }
    this.chooseConentToRender(columnContainer, this.widgets);
    this.render();
  }

  render() {
    this.getElementsByClassName("dashboard-component");
  }
}

customElements.get("dashboard-component") ||
  window.customElements.define("dashboard-component", DashboardComponent);
