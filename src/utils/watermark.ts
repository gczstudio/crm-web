/**  水印添加方法  */

import { getUserInfo } from "@/utils";
import moment from "moment";

class Watermark {
  private options = {
    watermarkText: "",
    fontFamily: "Times New Roman",
    fontColor: "rgba(0,0,0,0.2)",
    fontSize: 16,
  };

  // 获取水印图片
  getWatermarkPic() {
    const { watermarkText, fontColor, fontSize, fontFamily } = this.options;
    const canvas = document.createElement("canvas");
    const context: any = canvas.getContext("2d");

    canvas.width = context.measureText(watermarkText).width * 1.5;
    canvas.height = canvas.width;

    context.font = fontSize + "px " + fontFamily;
    context.fillStyle = fontColor;
    context.textBaseline = "middle";
    context.rotate((-45 * Math.PI) / 180);
    context.fillText(watermarkText, -canvas.width / 2, canvas.width / 2 + fontSize * 2);
    return canvas.toDataURL("image/png");
  }

  // 设置水印
  setWatermark() {
    const userInfo = getUserInfo();
    this.options.watermarkText = `${userInfo.userName}    ${userInfo.userId}    ${moment().format("YYYYMMDD")}`;
    const svg = document.createElement("svg");
    svg.setAttribute("id", "svg-watermark");
    svg.style.background = "url(" + this.getWatermarkPic() + ") repeat";
    (document as any).querySelector(".app-main").appendChild(svg);
  }
}

export default new Watermark();
