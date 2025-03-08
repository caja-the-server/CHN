export async function renderBlobToCanvas(
  blob: Blob
): Promise<HTMLCanvasElement> {
  return await new Promise<HTMLCanvasElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        try {
          canvas.width = image.width;
          canvas.height = image.height;

          const context = canvas.getContext("2d");
          if (context === null) {
            return reject(new Error("Failed to load image"));
          }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          return resolve(canvas);
        } finally {
          image.remove();
        }
      });
      image.addEventListener("error", () => {
        image.remove();
        return reject(new Error("Failed to load image"));
      });

      const src = reader.result;
      if (typeof src !== "string") {
        return reject(new Error("Failed to load image"));
      }
      image.src = src;
    });
    reader.addEventListener("error", () => {
      return reject(new Error("Failed to read file"));
    });
    reader.readAsDataURL(blob);
  });
}
