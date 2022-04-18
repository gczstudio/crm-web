import request from "@/utils/request"
import { backend } from '@/config'
import { Notification } from 'element-ui'
import { getUserInfo, getUrl, downFile } from '@/utils'
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
import { CommonModule } from '@/store/modules/common'

// 导出轮询事件队列
class EventQueue {
  private queueMgr:any = {}
  

  addEvent (key: any, delay = 10000) {
    this.querySeachFile(key);
    var timer = setInterval(() => {
      this.querySeachFile(key);
    }, delay)
    this.queueMgr[key] = timer
  }

  removeEvent (key: any) {
    clearInterval(this.queueMgr[key])
    delete this.queueMgr[key]
  }


  querySeachFile (fileName: string) {
    request({
      method: 'GET',
      url: backend.fileService + '/api/downloadManage/search',
      params: {
        condition: JSON.stringify({
          creatUser: getUserInfo().userId,
          fileName
        })
      }
    }).then(res => {
      if(res.data[0]?.downState === "3") {
        this.removeEvent(fileName)
        this.showNotify(res.data[0])
      }
    })
  }

  showNotify (data:any) {
    CommonModule.UPDATE_DOWNLOAD_FILE(1)
    let h = new Vue().$createElement;
    let notify: any = null;
    let messageDom = h('div', {}, [
      h('div', { class: 'down-notify__filename'}, data.fileName),
      h('div', { class: 'down-notify__download' }, [
        h('span', {
          class: 'down-notify__download-text',
          on: {
            click: () => {
              this.exportFn(data, notify)
            }
          }
        }, '保存到本地')
      ])
    ])
    notify = Notification({
      customClass: 'down-notify',
      type: 'success',
      title: '下载完成',
      message: messageDom,
      duration: 0
    })
  }

  exportFn (row: any, notify: any) {
    CommonModule.UPDATE_DOWNLOAD_FILE(0);
    var param = {
      fileName: row.fileName,
      filePath: row.filePath
    };
    let url = getUrl(backend.fileService + '/api/downloadManage/downloadFile');
    downFile({
      method: 'post',
      url: url,
      fileName: param.fileName,
      data: {
        access_token: UserModule.token,
        condition: JSON.stringify(param)
      }
    });
    notify.close();
  }

}


export default new EventQueue()