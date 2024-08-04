import axios from "axios";

export async function imageSlider(
  imgcontainer: HTMLImageElement,
  productImages: string[],
  is_right: boolean
): Promise<void> {
  const id = imgcontainer.getAttribute("id");
  let nextid: number;
  if (!is_right) {
    if (parseInt(id!) - 1 >= 0) {
      nextid = parseInt(id!) - 1;
    } else {
      nextid = productImages.length - 1;
    }
  } else {
    if (parseInt(id!) + 1 < productImages.length) {
      nextid = parseInt(id!) + 1;
    } else {
      nextid = 0;
    }
  }
  imgcontainer.style.opacity = "0";

  try {
    const response = await axios.get(productImages[nextid], {
      responseType: "blob",
    });
    const blob = response.data;
    const imageUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.src = imageUrl;

    img.onload = function () {
      setTimeout(() => {
        imgcontainer.src = imageUrl;
        imgcontainer.setAttribute("id", String(nextid));
        imgcontainer.style.opacity = "1";
      }, 500);
    };
  } catch (error) {
    console.log("Error fetching image:");
    imgcontainer.style.opacity = "1";
    // Handle error
  }
}
