export function sliderEffect(container: HTMLUListElement): void {
  let is_clicked = false;
  let click_start_x = 0;
  let click_move_x = 0;
  console.log("scrolling div", container);
  function scrollCategories(e: MouseEvent): void {
    console.log("scrolling div");
    if (is_clicked) {
      const delta_x = e.clientX - click_move_x;
      click_move_x = e.clientX;
      if (container.scrollLeft !== undefined) {
        container.scrollLeft -= delta_x * 2;
      }
    }
  }

  container.addEventListener("mouseleave", () => {
    is_clicked = false;
    console.log("scrolling mouseleave");
  });

  container.addEventListener("mousedown", (e: MouseEvent) => {
    console.log("scrolling mousedown");
    is_clicked = true;
    click_start_x = e.clientX;
    click_move_x = click_start_x;
  });

  container.addEventListener("mouseup", () => {
    is_clicked = false;
    console.log("scrolling mouseup");
  });

  container.addEventListener("mousemove", scrollCategories);
}
