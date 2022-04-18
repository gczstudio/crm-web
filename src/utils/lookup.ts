import { getWebList } from '@/api/common'
import { CommonModule } from '@/store/modules/common'


class Lookup {

  options:any = {
    remoteParamName: 'lookupCodes', // 远程参数名
    codeKey: 'key', // 对应后台字段key
    codeValue: 'value', // 对应后台字段value
  }

  /**
   * 设置字典管理
   * 将请求的字典统一管理在vuex中
   * @param lookupMgr
   */
  setLookupMgr(lookupMgr:any) {
    CommonModule.SET_LOOKUP_MGR(lookupMgr);
  }

  /**
   * 加载远程字典
   * @param types
   */
  loadRemote(types: string, callback: Function) {
    const typeArr = types.split(',');
    let needPostType = typeArr.filter(type => !CommonModule.lookupMgr[type]);
    if(!needPostType.join(',')) {
      typeof callback === 'function' && callback();
      return;
    }
    getWebList({[this.options.remoteParamName]: needPostType.join(',')}).then((res: any) => {
      if(res.code === 0) {
        let copylookupMgr = {...CommonModule.lookupMgr, ...res.data};
        this.setLookupMgr(copylookupMgr);
        typeof callback === 'function' && callback(res.data);
      }
    });
  }

  /**
   * 字段转换方法
   * @param type 字典类型
   * @param sourceVal 要转换的值
   * @param source 源字段
   * @param target 目标字段
   * @returns {*}
   */
  convert(type: any, sourceVal: string | number, source: string, target: string) {
    let lookup = [], targetVal = sourceVal;
    if(Array.isArray(type)) {
      lookup = type;
    } else {
      lookup = CommonModule.lookupMgr[type]
      if (!lookup) {
        console.warn('【' + type + '】字典未加载！');
        return targetVal;
      }
    }
    
    for (var i = 0, len = lookup.length; i < len; i++) {
      var item = lookup[i];
      // 不直接使用双等号而使用三等号，原因在于避免0 == false的情况
      if ('' + item[source] === '' + sourceVal) {
        targetVal = item[target];
        break;
      }
    }
    return targetVal;
  }

  /**
   * 将字典注册到字典管理器中
   * @param types string,必须
   * @param callback function,可选
   */
  reg(types: string, callback: Function) {
    const typeArr = types.split(',');
    let needPostType = typeArr.filter(type => !CommonModule.lookupMgr[type]).join(',');
    this.loadRemote(needPostType, callback);
  };

  /**
   * 将数据字典绑定到对象上
   * @param type 字典类型
   * @param callback 回调方法参数即是字典数组对象
   */
  bind (type: string, callback: Function) {
    let lookup = CommonModule.lookupMgr[type];
    if (lookup) {
      callback.call(this, lookup);
      return;
    }
    this.loadRemote(type, (data: any) => {
      lookup = data[type];
      callback.call(this, lookup);
    });
  };

  /**
   * 根据字典类别查找
   * @param type 要查找的字典类型
   * @param isArray 是否返回数组（可选参数）, true: 是，false: 否； 默认true
   */
  find(type: string, isArray: boolean) {
    isArray = isArray !== false;
    var lookup = CommonModule.lookupMgr[type];
    if (!isArray) {
      lookup = !lookup ? {} : this.array2Map(lookup);
    }
    return lookup;
  };

  /**
   * 数组转Map
   * @param lookup
   * @returns {Map}
   */
  array2Map(lookup: any) {
    lookup = lookup ? lookup.reduce((acc:any, cur:any) => {
      acc[cur[this.options.codeKey]] = cur[this.options.codeValue];
      return acc;
    }, {}) : {};
    return lookup;
  };

  /**
   * 字典码转换为字典值
   * @param type 字典类型
   * @param key 字典码
   * @returns {*} 字典值
   */
  convertKey(type:string, key:string) {
    return this.convert(type, key, this.options.codeKey, this.options.codeValue);
  };

  /**
   * 字典值转换为字典码
   * @param type 字典类型
   * @param value 字典值
   * @returns {*} 字典码
   */
  convertValue(type:string, value:string) {
    return this.convert(type, value, this.options.codeValue, this.options.codeKey);
  };

}

export default new Lookup();
