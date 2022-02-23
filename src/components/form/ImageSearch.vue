<template>
  <input
    :disabled="imageTag && !hideBar"
    class="form-control form-control-sm"
    :id="this.randomId"
    type="file"
    @change="recognize"
    accept="image/*"
    capture="environment"
  />
  <div class="mt-3">
    <div class="progress" v-if="imageTag && !hideBar">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated bg-secondary"
        role="progressbar"
        :aria-valuenow="recognizeProgress"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="'width: ' + recognizeProgress + '%'"
      ></div>
    </div>
    <small v-if="!imageTag && this.imgIdExternal">Puede subir una imagen para escanear la caravana</small>
  </div>
  <img
    v-if="!this.imgIdExternal"
    alt="Identificador"
    :id="this.imgId"
    hidden
    :src="require('../../assets/images/bovine/tag_bovino.png')"
  />
</template>

<script>
import { createWorker, PSM } from 'tesseract.js';

const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;

export default {
  name: 'ImageSearch',
  emits: ['finishTagHandle'],
  props: {
    imgIdExternal: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      imageTag: null,
      recognizeProgress: 0,
      worker: null,
      hideBar: false,
      randomId: 'bovineTagFile' + Math.random().toString(36).slice(2),
    };
  },
  mounted() {
    this.worker = createWorker({
      logger: (m) => {
        console.log(m);
        if (m.status === 'recognizing text') {
          this.recognizeProgress = Math.floor(m.progress * 100) + 1;
        }
      },
    });
    this.setupSW();
  },
  computed: {
    imgId() {
      if (!this.imgIdExternal) {
        return this.randomId + '-tagImg';
      }
      return this.imgIdExternal;
    },
  },
  methods: {
    async setupSW() {
      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      await this.worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
    },
    async recognize(e) {
      this.hideBar = false;
      this.recognizeProgress = 1;
      let files = e.target.files;
      if (!files.length) return;
      this.imageTag = URL.createObjectURL(files[0]);

      const img = document.getElementById(this.imgId);
      const [newWidth, newHeight] = this.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const dataUrl = canvas.toDataURL();
        const {
          data: { text },
        } = await this.worker.recognize(dataUrl);
        console.log(text);
        this.$emit('finishTagHandle', text.trim().replace(/\s+/g, ''));
        this.hideBar = true;
      };
      img.src = this.imageTag;
    },
    calculateSize(img, maxWidth, maxHeight) {
      let width = img.width;
      let height = img.height;
      // calculate the width and height, constraining the proportions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      return [width, height];
    },
  },
};
</script>

<style scoped></style>
