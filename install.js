module.exports = {
  run: [
    // Edit this step to customize the git repository to use
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/lllyasviel/stable-diffusion-webui-forge app",
        ]
      }
    },
//    {
//      method: "fs.download",
//      params: {
//        uri: [
//          "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/anime_lora_comfy_converted.safetensors?download=true",
//          "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/art_lora_comfy_converted.safetensors?download=true",
//          "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/disney_lora_comfy_converted.safetensors?download=true",
//          "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/mjv6_lora_comfy_converted.safetensors?download=true",
//          "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/realism_lora_comfy_converted.safetensors?download=true",
//          "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/scenery_lora_comfy_converted.safetensors?download=true"
//        ],
//        dir: "app/models/Lora"
//      }
//    },
    {
      method: "self.set",
      params: {
        "app/ui-config.json": {
          "txt2img/CFG Scale/value": 1.0
        },
        "app/config.json": {
          "forge_preset": "flux"
        }
      }
    },
    {
      method: "shell.run",
      params: {
        message: " ",
        venv: "app/venv"
      }
    },
    {
      method: "shell.run",
      params: {
        message: "{{platform === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
        env: {
          SD_WEBUI_RESTARTING: 1,
        },
        path: "app",
        on: [{ "event": "/http:\/\/[0-9.:]+/", "kill": true }]
      }
    },
    // nvidia 50 series
    {
      "when": "{{gpu === 'nvidia' && kernel.gpu_model && / 50.+/.test(kernel.gpu_model) }}",
      "method": "shell.run",
      "params": {
        "venv": "venv",
        "path": "app",
        "message": [
          "uv pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128 --force-reinstall",
          "uv pip install numpy==1.26.2 --force-reinstall"
        ]
      },
    },
    {
      method: "fs.share",
      params: {
        drive: {
          upscale_models: [
            "app/models/ESRGAN",
          ],
          checkpoints: "app/models/Stable-diffusion",
          vae_approx: "app/models/VAE-approx",
          vae: "app/models/VAE",
          deepbooru: "app/models/deepbooru",
          karlo: "app/models/karlo",
          svd: "app/models/svd",
//          text_encoder: "app/models/text_encoder",
          embeddings: "app/embeddings",
          clip: "app/models/text_encoder",
          z123: "app/models/z123",
          codeformer: "app/models/Codeformer",
          controlnet: "app/models/ControlNet",
          controlnetpreprocessor: "app/models/ControlNetPreprocessor",
          diffusers: "app/models/diffusers",
          gfpgan: "app/models/GFPGAN",
          hypernetworks: "app/models/hypernetworks",
          loras: "app/models/Lora"
        },
        peers: [
          "https://github.com/cocktailpeanut/fluxgym.git",
          "https://github.com/pinokiofactory/comfy.git",
          "https://github.com/cocktailpeanutlabs/comfyui.git",
          "https://github.com/cocktailpeanutlabs/fooocus.git",
          "https://github.com/cocktailpeanutlabs/automatic1111.git",
        ]
      }
    },
    {
      when: "{{gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        message: [
          "conda install -y conda-forge::huggingface_hub",
          //"huggingface-cli download lllyasviel/flux1-dev-bnb-nf4 flux1-dev-bnb-nf4.safetensors --local-dir app/models/Stable-diffusion"
          "huggingface-cli download lllyasviel/flux1-dev-bnb-nf4 flux1-dev-bnb-nf4-v2.safetensors --local-dir app/models/Stable-diffusion"
        ]
      }
    },
    {
      when: "{{gpu !== 'nvidia'}}",
      method: "shell.run",
      params: {
        message: [
          "conda install -y conda-forge::huggingface_hub",
          "huggingface-cli download lllyasviel/flux1_dev flux1-dev-fp8.safetensors --local-dir app/models/Stable-diffusion"
        ]
      }
    },
    {
      method: "fs.share",
      params: {
        drive: {
          outputs: "app/outputs"
        }
      }
    },
  ]
}
