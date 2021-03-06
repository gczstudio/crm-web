/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2022-04-20 09:02:46
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-13 08:59:02
 * @FilePath: /edmp-web/server/mock/lowcode.js
 */
var Mock = require("mockjs");

var layoutList = Mock.mock({
  "list|1-10": [
    {
      "rowId|+1": 1,
      "id|+1": 1,
      layoutName: "@ctitle",
      layoutSts: "@boolean",
      layoutConfig: "1,1,1,1,1,2,3,4,1,2",
    },
  ],
});

var compList = Mock.mock({
  "list|1-10": [
    {
      "id|+1": 1,
      compRegisterName: "@first",
      compName: "@ctitle",
      compType: "1",
    },
  ],
});

var custCompList = Mock.mock({
  "list|1-10": [
    {
      "id|+1": 1,
      modName: "@ctitle",
      modType: "@first",
      modSts: "@boolean",
      modConfig: "1",
    },
  ],
});

var columnsList = Mock.mock({
  "list|1-10": [
    {
      "id|+1": 1,
      label: "@first",
      prop: '@string("lower", 5)',
    },
  ],
});

module.exports = function (router) {
  router.get("/lowcode/layout/list", (req, res, nexy) => {
    res.send({
      code: 0,
      data: layoutList.list,
      total: 10,
    });
  });

  router.get("/lowcode/comp/list", (req, res, nexy) => {
    res.send({
      code: 0,
      data: compList.list,
      total: 10,
    });
  });

  router.get("/lowcode/custcomp/list", (req, res, nexy) => {
    res.send({
      code: 0,
      data: custCompList.list,
      total: 10,
    });
  });

  router.get("/lowcode/columns/list", (req, res, nexy) => {
    res.send({
      code: 0,
      data: columnsList.list,
      total: 10,
    });
  });
};
