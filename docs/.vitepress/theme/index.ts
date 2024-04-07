import Theme from "vitepress/theme";
import "./style/var.css";

export default {
  ...Theme,
  async enhanceApp() {
    if (!import.meta.env.SSR) {
      const { loadOml2d } = await import('oh-my-live2d');
      loadOml2d({
        models: [
          {
            "path": "https://model.oml2d.com/cat-black/model.json",
            "scale": 0.12,
            "position": [0, 60],
            "stageStyle": {
              "height": 350
            }
          }
        ]
      });
    }
  }
};