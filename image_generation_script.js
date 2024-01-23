// Event listener for image generation by uploading
document.addEventListener('DOMContentLoaded', () => {
    const generateImageButton = document.getElementById('generate-image-button');
    generateImageButton.addEventListener('click', () => {
      const input = document.getElementById('image-upload-input');
      const file = input.files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = async function (e) {
          const imageData = e.target.result.split(",")[1]; // Extract base64 image data
          const buffer = Buffer.from(imageData, 'base64');
  
          await performImageGeneration(buffer);
        };
  
        reader.readAsDataURL(file);
      }
    });
  
    // Event listener for text-based image generation
    const generateTextImageButton = document.getElementById('generate-text-image-button');
    generateTextImageButton.addEventListener('click', async () => {
      const textInput = document.getElementById('text-input').value;
      await performTextBasedImageGeneration(textInput);
    });
  });
  
  async function performImageGeneration(buffer) {
    const openai = new OpenAI();
    const canvas = document.getElementById('generation-result-canvas');
    const context = canvas.getContext('2d');
  
    try {
      const image = await openai.images.createVariation({
        model: "dall-e-2",
        image: buffer,
        n: 1,
        size: "1024x1024"
      });
  
      // Display the generated image on the canvas
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
      };
      img.src = image.data.data[0].url;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function performTextBasedImageGeneration(textInput) {
    const openai = new OpenAI();
    const canvas = document.getElementById('generation-result-canvas');
    const context = canvas.getContext('2d');
  
    try {
      const response = await openai.createImage({
        model: "dall-e-3",
        prompt: textInput,
        n: 1,
        size: "1024x1024",
      });
  
      // Display the generated image on the canvas
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
      };
      img.src = response.data.data[0].url;
    } catch (error) {
      console.error(error);
    }
  }
  