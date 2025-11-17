module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/lllyasviel/stable-diffusion-webui-forge app",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        message: "conda update -y -c conda-forge huggingface_hub"
      }
    },
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
        message: "{{platform === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
        env: {
          SD_WEBUI_RESTARTING: 1,
        },
        path: "app",
        on: [{
          "event": "/Launching Web UI with arguments: /",
          "kill": true
        }]
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
          "uv pip install -U bitsandbytes --force-reinstall",
          "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 xformers==0.0.30 --index-url https://download.pytorch.org/whl/cu128 --force-reinstall --no-deps"
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
          "hf download lllyasviel/flux1-dev-bnb-nf4 flux1-dev-bnb-nf4-v2.safetensors --local-dir app/models/Stable-diffusion"
        ]
      }
    },
    {
      when: "{{gpu !== 'nvidia'}}",
      method: "shell.run",
      params: {
        message: [
          "hf download lllyasviel/flux1_dev flux1-dev-fp8.safetensors --local-dir app/models/Stable-diffusion"
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
    }
  ]
}
