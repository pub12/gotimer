# GoTimer Mascots — Adventure Explorers

The chosen mascot set for GoTimer.org. Three characters in a consistent Pixar-quality 3D chibi toy figurine style.

---

## Style System

### Master Style Suffix
Append this to **every** character prompt, unchanged:

```
3D rendered chibi toy figurine, Pixar-quality CGI render, head is roughly half the total body height, big round chubby head with soft rosy cheeks, large round expressive eyes with bright white highlight reflections, tiny cute button nose, small cheerful mouth, short stubby arms and legs, chubby rounded hands, smooth warm skin with subtle soft-shading, warm soft studio lighting with a gentle rim light on the left, highly detailed fabric texture on costume including visible stitching and buckle details, standing upright on both feet facing slightly forward, pure white background, full body visible from top of hat to bottom of boots, no shadows on ground, ultra high quality render, sharp focus
```

### Master Negative Prompt
Use this for **every** character, unchanged:

```
2D illustration, flat art, anime, sketch, watercolor, painting, realistic human proportions, elongated body, tall figure, scary, dark, violent, ugly, deformed, blurry, low quality, text, words, numbers, watermark, logo, signature, multiple characters in one image, group shot, nsfw, checkered background, dark background, grey background
```

### API Config
| Field | Value |
|---|---|
| Endpoint | `https://api.runware.ai/v1` |
| Model | `runware:101@1` |
| Width | 1024 |
| Height | 1024 |
| Output format | PNG |
| Output type | URL |

---

## Characters

---

### 1. Drake — The Rugged Explorer

**Character prompt (combine with Master Style Suffix above):**
```
single male chibi character named Drake the Explorer, wearing a weathered cognac-brown wide-brim leather fedora hat with a dark brown hatband, wearing a warm tan-brown distressed leather jacket with a collar turned up slightly and rolled sleeves, wearing dark olive-green cargo pants with side pockets, wearing dark brown leather lace-up boots, a coiled brown leather bullwhip hanging from his left hip belt loop, a worn tan canvas satchel bag strap crossing his chest right-to-left, short dark brown hair peeking under hat brim, light warm tan skin tone with very slight stubble on chin, confident slightly smug expression with one eyebrow raised and a small smirk, arms relaxed at sides with right hand slightly forward as if ready for action
```

**Reference image (approved generation):**
https://im.runware.ai/image/os/a08dlim3/ws/2/ii/964df0eb-8d6f-46f4-b875-855256e17f4c.png

**Key design details:**
- Hat: weathered cognac-brown wide-brim leather fedora, dark brown hatband
- Jacket: warm tan-brown distressed leather, collar up, rolled sleeves
- Pants: dark olive-green cargo with side pockets
- Boots: dark brown leather lace-up
- Accessories: coiled bullwhip at left hip, tan canvas satchel strap across chest
- Hair: short dark brown, under hat
- Skin: light warm tan, slight chin stubble
- Expression: one eyebrow raised, small smug smirk

---

### 2. Scout — The Field Archaeologist

**Character prompt (combine with Master Style Suffix above):**
```
single female chibi character named Scout the Archaeologist, wearing a khaki safari field jacket with two large chest pockets with flap buttons and slightly rolled-up sleeves, wearing olive-green cargo pants with side zip pockets, wearing dark brown leather ankle boots, wearing a tan wide-brim safari hat with a dark band, holding a small glowing golden ancient stone tablet artifact in her raised right hand, holding a lit brass oil lantern in her lowered left hand with a warm golden glow, long dark brown hair in a ponytail coming through the back of the hat, warm tan skin with rosy cheeks, very wide excited sparkling eyes and a big open-mouthed joyful smile, leaning slightly forward in an excited discovery pose
```

**Reference image (approved generation):**
https://im.runware.ai/image/os/a08dlim3/ws/2/ii/91f9bf4f-2287-4fa4-b588-2b9a7747cd00.png

**Key design details:**
- Hat: tan wide-brim safari hat, dark band
- Jacket: khaki safari field jacket, chest flap pockets, rolled sleeves
- Pants: olive-green cargo with side zip pockets
- Boots: dark brown leather ankle boots
- Accessories: glowing golden artifact (right hand, raised), lit brass lantern (left hand, lowered)
- Hair: long dark brown ponytail through back of hat
- Skin: warm tan with rosy cheeks
- Expression: wide excited sparkling eyes, big open-mouthed joyful smile

---

### 3. Prof — The Ancient Scholar

**Character prompt (combine with Master Style Suffix above):**
```
single elderly male chibi character named Prof the Ancient Scholar, wearing a worn warm-brown tweed jacket with large tan elbow patches and visible herringbone texture, wearing a light blue collared shirt underneath with a loosely knotted dark green tie, wearing dark brown trousers, wearing brown leather oxford shoes, wild voluminous white and grey hair sticking out in all directions from sides and back of head bald on top, a thick white bushy mustache and short white beard, large round gold-framed spectacles with thick lenses sitting low on his nose, holding an open rolled-out ancient parchment map with both hands the map yellowed and aged with red dotted route lines, pale-fair wrinkled skin, expression of delighted surprise with wide eyes and open mouth as if just discovered something
```

**Reference image (approved generation):**
https://im.runware.ai/image/os/a05d22/ws/2/ii/91684f1c-92c5-4301-8c12-582564225aa9.png

**Key design details:**
- Jacket: worn warm-brown tweed, herringbone texture, large tan elbow patches
- Shirt: light blue collared with loosely knotted dark green tie
- Pants: dark brown trousers
- Shoes: brown leather oxfords
- Hair: wild white/grey sticking out all sides, bald on top
- Facial hair: thick white bushy mustache, short white beard
- Glasses: large round gold-framed, thick lenses, sitting low on nose
- Prop: yellowed parchment map unrolled in both hands, red dotted route lines
- Skin: pale-fair, wrinkled
- Expression: delighted surprise, wide eyes, open mouth

---

## JavaScript — Regenerate All Three

Paste this into the browser console on gotimer.org to regenerate:

```javascript
window.uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16);
});

const STYLE = "3D rendered chibi toy figurine, Pixar-quality CGI render, head is roughly half the total body height, big round chubby head with soft rosy cheeks, large round expressive eyes with bright white highlight reflections, tiny cute button nose, small cheerful mouth, short stubby arms and legs, chubby rounded hands, smooth warm skin with subtle soft-shading, warm soft studio lighting with a gentle rim light on the left, highly detailed fabric texture on costume including visible stitching and buckle details, standing upright on both feet facing slightly forward, pure white background, full body visible from top of hat to bottom of boots, no shadows on ground, ultra high quality render, sharp focus";

const NEG = "2D illustration, flat art, anime, sketch, watercolor, painting, realistic human proportions, elongated body, tall figure, scary, dark, violent, ugly, deformed, blurry, low quality, text, words, numbers, watermark, logo, signature, multiple characters in one image, group shot, nsfw, checkered background, dark background, grey background";

const TOKEN = "BxkgqFxpT8uOBioCc0qa6wFqUOmUjcXy";

async function gen(name, charPrompt) {
  const res = await fetch("https://api.runware.ai/v1", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + TOKEN },
    body: JSON.stringify([{
      taskType: "imageInference", taskUUID: window.uuidv4(),
      positivePrompt: charPrompt + ", " + STYLE,
      negativePrompt: NEG,
      model: "runware:101@1", width: 1024, height: 1024,
      numberResults: 1, outputFormat: "PNG", outputType: "URL"
    }])
  });
  const d = await res.json();
  const url = d?.data?.[0]?.imageURL;
  console.log(name + ":", url);
  return url;
}

(async () => {
  const drake = await gen("Drake",
    "single male chibi character named Drake the Explorer, wearing a weathered cognac-brown wide-brim leather fedora hat with a dark brown hatband, wearing a warm tan-brown distressed leather jacket with a collar turned up slightly and rolled sleeves, wearing dark olive-green cargo pants with side pockets, wearing dark brown leather lace-up boots, a coiled brown leather bullwhip hanging from his left hip belt loop, a worn tan canvas satchel bag strap crossing his chest right-to-left, short dark brown hair peeking under hat brim, light warm tan skin tone with very slight stubble on chin, confident slightly smug expression with one eyebrow raised and a small smirk, arms relaxed at sides with right hand slightly forward as if ready for action"
  );
  const scout = await gen("Scout",
    "single female chibi character named Scout the Archaeologist, wearing a khaki safari field jacket with two large chest pockets with flap buttons and slightly rolled-up sleeves, wearing olive-green cargo pants with side zip pockets, wearing dark brown leather ankle boots, wearing a tan wide-brim safari hat with a dark band, holding a small glowing golden ancient stone tablet artifact in her raised right hand, holding a lit brass oil lantern in her lowered left hand with a warm golden glow, long dark brown hair in a ponytail coming through the back of the hat, warm tan skin with rosy cheeks, very wide excited sparkling eyes and a big open-mouthed joyful smile, leaning slightly forward in an excited discovery pose"
  );
  const prof = await gen("Prof",
    "single elderly male chibi character named Prof the Ancient Scholar, wearing a worn warm-brown tweed jacket with large tan elbow patches and visible herringbone texture, wearing a light blue collared shirt underneath with a loosely knotted dark green tie, wearing dark brown trousers, wearing brown leather oxford shoes, wild voluminous white and grey hair sticking out in all directions from sides and back of head bald on top, a thick white bushy mustache and short white beard, large round gold-framed spectacles with thick lenses sitting low on his nose, holding an open rolled-out ancient parchment map with both hands the map yellowed and aged with red dotted route lines, pale-fair wrinkled skin, expression of delighted surprise with wide eyes and open mouth as if just discovered something"
  );
  console.log("Done!", { drake, scout, prof });
})();
```

---

## Consistency Notes

- **Do not shorten the prompts.** The detail is what locks in the consistent Pixar 3D toy style. Shorter prompts drift into anime/2D or lose the figurine aesthetic.
- **The Master Style Suffix is the backbone.** Every character must use it verbatim.
- **Runware CDN URLs expire.** Download and save the approved reference PNGs locally immediately after generation.
- **Variation is expected.** The same prompt will produce slight variations each run due to random seeds. If a generation drifts, run again — it usually corrects within 1–2 retries.
- **Do not mix styles.** Adding other style words (e.g. "street art", "anime") will override the chibi Pixar look.