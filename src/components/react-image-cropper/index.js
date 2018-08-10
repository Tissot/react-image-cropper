import React, { PureComponent } from 'react';
import './index.css';

class ReactImageCropper extends PureComponent {
  constructor(props) {
    super(props);

    this.uploadImage = this.uploadImage.bind(this);
    this.enableOperations = this.enableOperations.bind(this);
    this.moveCropper = this.moveCropper.bind(this);
    this.resizeCropperInTop = this.resizeCropperInTop.bind(this);
    this.resizeCropperInBottom = this.resizeCropperInBottom.bind(this);
    this.resizeCropperInLeft = this.resizeCropperInLeft.bind(this);
    this.resizeCropperInRight = this.resizeCropperInRight.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.disableAllOperations = this.disableAllOperations.bind(this);

    this.state={
      uploadedImage: '',
      sX: 0,
      sY: 0,
      sWidth: 0,
      sHeight: 0,
      dWidth: 0,
      dHeight: 0
    };
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.disableAllOperations);
  }

  render() {
    return (
      <div className="react-image-cropper">
        <div ref={el => this.drawer = el} className="drawer">
          <div
            style={{
              position: 'absolute',
              width: this.state.dWidth,
              height: this.state.dHeight,
              backgroundColor: 'rgba(0, 0, 0, .5)'
            }}
          >
            {
              this.state.uploadedImage && <div
                style={{
                  position: 'absolute',
                  top: this.state.sY,
                  left: this.state.sX,
                  width: this.state.sWidth,
                  height: this.state.sHeight,
                  backgroundColor: '#fff',
                  backgroundImage: `url(${this.state.uploadedImage})`,
                  backgroundPosition: `-${this.state.sX}px -${this.state.sY}px`,
                  backgroundSize: `${this.state.dWidth}px ${this.state.dHeight}px`,
                  backgroundRepeat: 'no-repeat',
                  cursor: 'move',
                  zIndex: 100
                }}
                onMouseDown={e => this.enableOperations(e, 'cropperMovable')}
              >
                <div
                  className="cropper-resizer top-left-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInTop', 'cropperResizableInLeft')}
                />
                <div
                  className="cropper-resizer top-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInTop')}
                />
                <div
                  className="cropper-resizer top-right-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInTop', 'cropperResizableInRight')}
                />
                <div
                  className="cropper-resizer left-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInLeft')}
                />
                <div
                  className="cropper-resizer right-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInRight')}
                />
                <div
                  className="cropper-resizer bottom-left-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInBottom', 'cropperResizableInLeft')}
                />
                <div
                  className="cropper-resizer bottom-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInBottom')}
                />
                <div
                  className="cropper-resizer bottom-right-resizer"
                  onMouseDown={e => this.enableOperations(e, 'cropperResizableInBottom', 'cropperResizableInRight')}
                />
              </div>
            }
          </div>
          <img
            ref={el => this.uploadedImage = el}
            src={this.state.uploadedImage}
            alt=""
            style={{
              width: this.state.dWidth,
              height: this.state.dHeight,
              backgroundColor: '#fff'
            }}
            className="uploaded-image"
          />
        </div>
        <div>
          <input type="file" accept="image/*" onChange={this.uploadImage}/>
          <button onClick={this.saveImage}>保存</button>
        </div>
      </div>
    );
  }

  uploadImage(e) {
    const reader = new FileReader();
    reader.onload = e => this.drawUploadedImage(e.target.result);

    e.target.files[0] && reader.readAsDataURL(e.target.files[0]);
  }

  drawUploadedImage(imgDataURL) {
    // 对上传的图片进行缩小或者放大以适应画布。
    const img = new Image();
    img.onload = () => {
      const widthRatio = this.drawer.clientWidth / img.width;
      const heightRatio = this.drawer.clientHeight / img.height;

      if (widthRatio === heightRatio) {
        this.scaleRatio = widthRatio;
        this.setState({
          uploadedImage: imgDataURL,
          sWidth: this.drawer.clientWidth,
          sHeight: this.drawer.clientHeight,
          dWidth: this.drawer.clientWidth,
          dHeight: this.drawer.clientHeight
        });
      } else if (widthRatio < heightRatio) {
        this.scaleRatio = widthRatio;
        const dHeight = widthRatio * img.height;
        this.setState({
          uploadedImage: imgDataURL,
          sWidth: this.drawer.clientWidth,
          sHeight: dHeight,
          dWidth: this.drawer.clientWidth,
          dHeight
        });
      } else {
        this.scaleRatio = heightRatio;
        const dWidth = heightRatio * img.width;
        this.setState({
          uploadedImage: imgDataURL,
          sWidth: dWidth,
          sHeight: this.drawer.clientHeight,
          dWidth: dWidth,
          dHeight: this.drawer.clientHeight
        });
      }
    };

    img.src = imgDataURL;
  }

  enableOperations(e, ...operations) {
    e.preventDefault();
    e.stopPropagation();

    for (let i = 0; i < operations.length; ++i) {
      this[operations[i]] = true;
    }

    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  moveCropper(e) {
    if (this.cropperMovable) {
      let endX = e.clientX;
      let endY = e.clientY;
      let sX = this.state.sX + endX - this.startX;
      let sY = this.state.sY + endY - this.startY;

      // 超出边界进行修正。
      const maxX = this.state.dWidth - this.state.sWidth;
      if (sX < 0) {
        sX = 0;
        endX = this.startX + sX - this.state.sX;
      } else if (sX > maxX) {
        sX = maxX;
        endX = this.startX + sX - this.state.sX;
      }

      const maxY = this.state.dHeight - this.state.sHeight;
      if (sY < 0) {
        sY = 0;
        endY = this.startY + sY - this.state.sY;
      } else if (sY > maxY) {
        sY = maxY;
        endY = this.startY + sY - this.state.sY;
      }

      this.setState({ sX, sY }, () => {
        this.startX = endX;
        this.startY = endY;
      });
    }
  }

  resizeCropperInTop(e) {
    if (this.cropperResizableInTop) {
      let endY = e.clientY;
      let moveY = endY - this.startY;
      let sY = this.state.sY + moveY;
      let sHeight = this.state.sHeight - moveY;

      // 缩小时要考虑裁剪框的最小高度，放大时超出上边界要进行修正。
      const minSHeight = 50;
      if (sHeight < minSHeight) {
        sHeight = minSHeight;
        endY = this.startY + sHeight - this.state.sHeight;
        sY = this.state.sY + this.state.sHeight - sHeight;
      } else if (sY < 0) {
        sY = 0;
        endY = this.startY + sY - this.state.sY;
        sHeight = this.state.sHeight - (endY - this.startY);
      }

      this.setState({ sY, sHeight }, () => this.startY = endY);
    }
  }

  resizeCropperInBottom(e) {
    if (this.cropperResizableInBottom) {
      let endY = e.clientY;
      let moveY = endY - this.startY;
      let sHeight = this.state.sHeight + moveY;

      // 缩小时要考虑裁剪框的最小高度，放大时超出下边界要进行修正。
      const minSHeight = 50;
      const maxSHeight = this.state.dHeight - this.state.sY;
      if (sHeight < minSHeight) {
        sHeight = minSHeight;
        endY = this.startY + sHeight - this.state.sHeight;
      } else if (sHeight > maxSHeight) {
        sHeight = maxSHeight;
        endY = sHeight - this.state.sHeight + this.startY;
      }

      this.setState({ sHeight }, () => this.startY = endY);
    }
  }

  resizeCropperInLeft(e) {
    if (this.cropperResizableInLeft) {
      let endX = e.clientX;
      let moveX = endX - this.startX;
      let sX = this.state.sX + moveX;
      let sWidth = this.state.sWidth - moveX;

      // 缩小时要考虑裁剪框的最小宽度，放大时超出左边界要进行修正。
      const minSWidth = 50;
      if (sWidth < minSWidth) {
        sWidth = minSWidth;
        endX = this.startX + sWidth - this.state.sWidth;
        sX = this.state.sX + this.state.sWidth - sWidth;
      } else if (sX < 0) {
        sX = 0;
        endX = this.startX + sX - this.state.sX;
        sWidth = this.state.sWidth - (endX - this.startX);
      }

      this.setState({ sX, sWidth }, () => this.startX = endX);
    }
  }

  resizeCropperInRight(e) {
    if (this.cropperResizableInRight) {
      let endX = e.clientX;
      let moveX = endX - this.startX;
      let sWidth = this.state.sWidth + moveX;

      // 缩小时要考虑裁剪框的最小宽度，放大时超出右边界要进行修正。
      const minSWidth = 50;
      const maxSWidth = this.state.dWidth - this.state.sX;
      if (sWidth < minSWidth) {
        sWidth = minSWidth;
        endX = this.startX + sWidth - this.state.sWidth;
      } else if (sWidth > maxSWidth) {
        sWidth = maxSWidth;
        endX = sWidth - this.state.sWidth + this.startX;
      }

      this.setState({ sWidth }, () => this.startX = endX);
    }
  }

  onMouseMove(e) {
    // 汇总监听器，减少监听器数量。
    this.moveCropper(e);
    this.resizeCropperInTop(e);
    this.resizeCropperInBottom(e);
    this.resizeCropperInLeft(e);
    this.resizeCropperInRight(e);
  }

  disableAllOperations() {
    this.cropperMovable = false;
    this.cropperResizableInTop = false;
    this.cropperResizableInBottom = false;
    this.cropperResizableInLeft = false;
    this.cropperResizableInRight = false;
  }

  saveImage() {
    const { sX, sY, sWidth, sHeight } = this.state;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sWidth;
    canvas.height = sHeight;
    ctx.drawImage(this.uploadedImage, sX / this.scaleRatio, sY / this.scaleRatio, sWidth / this.scaleRatio, sHeight / this.scaleRatio, 0, 0, sWidth, sHeight);
    this.props.saveImage(canvas.toDataURL());
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.disableAllOperations);
  }
}

export default ReactImageCropper;