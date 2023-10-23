const generationURL = "http://127.2.0.1/vision-one-api/generate.php";
const placeholderPrompts = [
  "cute adorable puppy",
  "wolf in the night hunting, colorful bright",
  "Albert Einstein as a Hindu monk, praying, colorful 8K",
  "an alien monster wering black armour in snow",
  "a tan skin Mayan queen all blue and gold elaborate outfit, with huge headpiece center piece, blue/gold makeup with oversized headdress with long bird feathers, with depth of field, fantastical edgy and regal themed outfit, captured in vivid colors, embodying the essence of fantasy, minimalist.",
  "an adorable and fluffy baby dinosaur, cowboy, bandana over mouth, western, desert, with a western village and saloon, sandstorm, gun, bright sky, with blur background, high quality, 8k",
  "Elon musk playing Holi in India front facing, clear joyful",
  "a blonde man in light brown pinstripe double breasted suit, standing in a park",
];
var c = 0, m = 3, textUpdate;

/* utility functions */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const updateGenerationText = (t) => { $(".subscribe").html(`<h4>${t}</h4>`); }

const updatePlaceholder = () => {
  let i = randomInt(1, placeholderPrompts.length);
  $(".outputImage").attr("src", `assets/img/placeholders/${i}.jfif`);
  $(".prompt").attr("placeholder", `Try "${placeholderPrompts[i - 1]}"`);
}

const downloadBase64File = (contentType, base64Data, fileName) => {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

$(function () {

  updatePlaceholder();

  $(".generate").click(() => {

    const accessPhrase = "sudo su palash"
    let prompt = $(".prompt").val();

    $(".outputImage").css("display", "none");
    $(".outputImagePlaceholder").css("display", "block");
    $(".outputImage, .outputImagePlaceholder").animate({
      "height": "50vh"
    }, 500);

    if (!prompt.toLowerCase().includes(accessPhrase)) {
      updateGenerationText(`Authentication unsuccessful <br/> <br/> <button class="btn btn-primary" onclick="window.location.reload()">Try agin</button>`);
      $("video").remove();
      return;
    }

    prompt = prompt.replace(accessPhrase, "").trim();

    updateGenerationText(`Thinking about image ideas`);

    textUpdate = setTimeout(function () {
      textUpdate = setInterval(function () {
        let t = "";
        c += 1;
        for (let i = 1; i <= c; i++) t += '.';
        updateGenerationText(`Creating your awesome image ` + t);
        if (c >= m) c = 0;
      }, 500)
    }, 3000)

    $.post(generationURL, {
      prompt: prompt,
    },
      function (data, status) {
        const json = JSON.parse(data);
        const base64Image = json["artifacts"][0]["base64"];
        const seed = json["artifacts"][0]["seed"];
        clearInterval(textUpdate);
        $(".outputImagePlaceholder").css("display", "none");
        $(".outputImage").attr("src", `data:image/png;base64,${base64Image}`);
        $(".outputImage").css("display", "block");
        updateGenerationText(`<button class="btn btn-primary download">Download</button> &nbsp; <button class="btn btn-primary" onclick="window.location.reload()">Generate more</button>`);
        $(".download").click(() => {
          downloadBase64File("image/png", base64Image, `vision-one-${seed}.png`)
        });
      });
  })
})