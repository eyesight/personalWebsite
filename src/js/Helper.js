class Helper {
    static addClass(el, className) {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className += " " + className;
      }
      
      static removeClass(el, className) {
        if (el.classList) el.classList.remove(className);
        else if (hasClass(el, className)) {
          var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
          el.className = el.className.replace(reg, " ");
        }
      }
}

export default Helper;