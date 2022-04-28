/**
 * 获取对应数据的根节点
 * @param data
 * @param attributes
 */
export const getTreeRoot = function (data: any, attributes: any) {
  let _root: any = {};
  if (data != null && data.length != 0) {
    _root = data[0];
    for (let k = 1; k < data.length; k++) {
      let i = 1;
      for (; i < data.length; i++) {
        if (data[i][attributes.id] == _root[attributes.pid]) {
          _root = data[i];
          break;
        }
      }
      if (i == data.length - 1) {
        break;
      }
    }

    return _root;
  }
};

/**
 * 根据数组和对应属性返回满足el-tree的树形数据
 * @param data
 * @param attr
 */
export const genTree = (data: any, attr: any) => {
  var root: any = {};
  if (data == null || data.length == 0) {
    return [attr.root];
  }
  if (attr.root == null || attr.root == undefined || attr.root == "") {
    root.id = getTreeRoot(data, attr)[attr.pid];
  } else if (typeof attr.root === "object") {
    var root = attr.root;
    root.id = root[attr.id] === undefined ? root.id : root[attr.id];
    root.pid = root[attr.pid] === undefined ? root.pid : root[attr.pid];
    root.label = root[attr.label] === undefined ? root.label : root[attr.label];
  } else {
    for (const i in data) {
      if (data[i][attr.id] == attr.root) {
        root.id = data[i][attr.pid];
        break;
      }
    }
    root.id = root.id == undefined ? attr.root : root.id;
  }

  const genTreeData = function (data: any, attr: any) {
    const ckey: any = {};
    const pkey: any = {};
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      row.id = row[attr.id];
      row.pid = row[attr.pid];
      row.label = row[attr.label];
      row.children = [];
      ckey[row.id] = row;
      if (pkey[row.pid]) {
        pkey[row.pid].push(row);
      } else {
        pkey[row.pid] = [row];
      }
      const c = pkey[row.id];
      if (c) {
        row.children = c.concat();
      }
      const p = ckey[row.pid];
      if (p) {
        p.children.push(row);
      }
    }
    return pkey;
  };

  if (root.label) {
    root.children = genTreeData(data, attr)[root.id];
    return [root];
  }
  return genTreeData(data, attr)[root.id];
};
