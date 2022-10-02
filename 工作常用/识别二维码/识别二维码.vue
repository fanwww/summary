<script>
  上传文件成功回调
  const handleUrlSuccess = (uploadFile: any) => {
    // 转化Uint8ClampedArray
    const filetoblob = (file:any)=>{
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          resolve(reader.result)
        }
        reader.onerror = function (e) {
          resolve(reader.result)
        }
      })
    }
    filetoblob(uploadFile.raw).then(res=>{
      // Uint8ClampedArray转cavans
      imageDataFromSource(res).then(re=>{
        // 从cavans里提取二维码并调用识别插件
        const code = jsQR(re.data, re.width, re.height);
        // 给路径赋值
        url.value = code!.data
    })
    })
    // 封装好的解析cavans
    async function imageDataFromSource (source:any) {
      const image = Object.assign(new Image(), { src: source });
      await new Promise(resolve => image.addEventListener('load', () => resolve(1)));
      const context = Object.assign(document.createElement('canvas'), {
          width: image.width,
          height: image.height
      }).getContext('2d');
      context!.imageSmoothingEnabled = false;
      context!.drawImage(image, 0, 0);
      return context!.getImageData(0, 0, image.width, image.height);
    }
  };
</script>