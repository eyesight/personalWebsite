import Helper from './Helper';

class OpenOnClick {
  constructor() {
    this.allBtns = Array.prototype.slice.call(document.querySelectorAll('.anchor--inline'));

    if (this.allBtns.length > 0) {
      this.clickLeftRight(this.allBtns);
      this.clickOutSide(this.allBtns);
      //this.followCursor();
    }
  }

  clickLeftRight(elements) {
    elements.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (item.parentNode.parentNode.nextElementSibling) {
          if (item.parentNode.parentNode.nextElementSibling.classList.contains('active-animated')) {
            e.target.innerHTML = 'See here';
            Helper.removeClass(item.parentNode.parentNode.nextElementSibling, 'active-animated');
            setTimeout(function () { Helper.removeClass(item.parentNode.parentNode.nextElementSibling, 'active') }, 500);
          } else {
            e.target.innerHTML = 'Close here';
            Helper.addClass(item.parentNode.parentNode.nextElementSibling, 'active');
            setTimeout(function () { Helper.addClass(item.parentNode.parentNode.nextElementSibling, 'active-animated') }, 500);
          }
        } else {
          if (item.parentNode.parentNode.previousElementSibling.classList.contains('active-animated')) {
            e.target.innerHTML = 'See here';
            Helper.removeClass(item.parentNode.parentNode.previousElementSibling, 'active-animated');
            setTimeout(function () { Helper.removeClass(item.parentNode.parentNode.previousElementSibling, 'active') }, 500);
          } else {
            e.target.innerHTML = 'Close here';
            Helper.addClass(item.parentNode.parentNode.previousElementSibling, 'active');
            setTimeout(function () { Helper.addClass(item.parentNode.parentNode.previousElementSibling, 'active-animated') }, 500);
          }
        }
      })
    });
  }

  clickOutSide(elements) {
    window.addEventListener("click", (e) => {
      if (!e.target.classList.contains('anchor--inline')) {
        elements.forEach((itemnew) => {
          Helper.removeClass(itemnew.parentNode.parentNode, 'active-animated');
          setTimeout(() => { Helper.removeClass(itemnew.parentNode.parentNode, 'active') }, 500);
          itemnew.innerHTML = 'See here';
        });
      }
    });
  }

  /*   followCursor() {
      let cursor = document.querySelector('.cursor');
      document.addEventListener('mousemove', (e) => {
        let x = e.clientX;
        let y = e.clientY;
        cursor.style.left = x - 10 + 'px';
        cursor.style.top = y - 10 + 'px';
      });
  
      document.querySelectorAll('.anchor').forEach((item) => {
        item.addEventListener('mouseenter', (e) => {
          Helper.addClass(cursor, 'over');
        });
        item.addEventListener('mouseleave', (e) => {
          Helper.removeClass(cursor, 'over');
        });
      });
    } */
}

export default OpenOnClick;