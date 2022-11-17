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

const gearIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${colors.svbBlue.dark} class="bi bi-gear-fill" viewBox="0 0 16 16"> <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /> </svg>`;

class WidgetWrapper extends HTMLElement {
  containerWidth = "200px";
  containerHeight = "100px";
  widgetTitle = "undefined widget";

  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = this.getInnerHTML();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.widgetTitle = this.getAttribute("title");
    this.shadowRoot.getElementById("title").innerText = this.widgetTitle;
    this.containerWidth = this.getAttribute("width");
    this.containerHeight = this.getAttribute("height");
    var componentContainer = this.shadowRoot.getElementById(
      "component-container"
    );
    componentContainer.style.width = this.containerWidth;
    componentContainer.style.height = this.containerHeight;
    componentContainer.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
    componentContainer.style.display = "flex";
    componentContainer.style.flexDirection = "column";
    componentContainer.style.alignItems = "center";
    componentContainer.style.justifyContent = "space-around";
    componentContainer.style.margin = "10px";
    this.shadowRoot.querySelector("h4").style.paddingTop = 0;
  }

  /**
   * Function meant to isolate the HTML template from the constructor, for
   * terms of order and structure.
   * @returns
   */
  getInnerHTML() {
    return /*html*/ `
    <div className='dashboard-widget'>
      <!-- Full widget container -->
      <div id="component-container">
        <div style="height: 15%; display: flex; width: 100%;">
          <!-- Title of the widget -->
          <div style="display: flex; justify-content: flex-start; flex: 1;">
            <h4 id="title" style="padding-left: 20px"></h4>
          </div>
          <!-- Gear icon -->
          <div style="display: flex; justify-content: flex-end; flex: 1; padding-right: 20px; padding-top: 20px;">
            ${gearIcon}
          </div>
        </div>
        <!-- Content to be displayed inside of the widget -->
        <div style="hieght: 75%; flex: 5; width: 100%;">
          <slot name="children">Children</slot>
        </div>
      </div> 
    </div>`;
  }

  connectedCallback() {
    this.containerWidth = this.getAttribute("width");
    this.containerHeight = this.getAttribute("height");
    this.widgetTitle = this.getAttribute("title");
    this.render();
  }

  render() {
    this.getElementsByClassName("widget-wrapper");
  }
}

customElements.get("widget-wrapper") ||
  window.customElements.define("widget-wrapper", WidgetWrapper);
