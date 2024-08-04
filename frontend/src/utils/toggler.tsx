export function toggler(element:HTMLElement|null, classname:string):boolean|undefined {
  console.log(element);
  let toggleContainer = element;
  if (!toggleContainer) {
    console.error(`Element with ID '${element}' not found.`);
    return;
  }
  if (toggleContainer.classList.contains(classname)) {
    toggleContainer.classList.remove(classname);
    return false;
  } else {
    toggleContainer.classList.add(classname);
    return true;
  }
}
