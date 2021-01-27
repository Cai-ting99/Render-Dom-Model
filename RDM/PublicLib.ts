import RDM from "./RDM";

/**
 * 是否是标签模型
 * @param obj 要验证的对象
 */
export function IsTagModel(obj: object) {
  return (
    typeof obj === "object" &&
    !obj.hasOwnProperty("Bind") &&
    !obj.hasOwnProperty("Prop") &&
    !obj.hasOwnProperty("template") &&
    !Array.isArray(obj)
  );
}
/**
 * 是否是循环的Dom节点
 */
export function IsForTagModel(obj: object) {
  if (obj["f"]) return true;
  return false;
}
/**
 * 通过属性字符串获取值
 * @param PropStr 值位置字符串 例：div.a.p
 * @param model 原型对象
 */
export function GetValueByPropStr(
  PropStr: string,
  model: object,
  OutParam: boolean = false
): any {
  if (PropStr.match(/\<.*?\>/)) {
    PropStr = PropStr.substring(1, PropStr.length - 1);
  }
  let Prop = { key: "", Item: null, arrlen: 0 };
  // let PropArr = PropStr.split(".");
  // for (let i = 0; i < PropArr.length; i++) {
  //   let idx = PropArr[i].match(/\[[0-9]+\]/);
  //   if (idx) {
  //     idx[0] = idx[0].substring(1, idx[0].length - 1);
  //     model = model[PropArr[i].replace("[" + idx[0] + "]", "")];
  //     Prop.arrlen = (model as any).length;
  //     Prop.key = idx[0];
  //     Prop.Item = model;
  //     model = model[idx[0]];
  //     continue;
  //   }
  //   Prop.key = PropArr[i];
  //   Prop.Item = model;
  //   model = model[PropArr[i]];
  // }
  PropStr.split(".").forEach((s) => {
    let idx = s.match(/\[[0-9]+\]/);
    if (idx) {
      idx[0] = idx[0].substring(1, idx[0].length - 1);
      model = model[s.replace("[" + idx[0] + "]", "")];
      Prop.arrlen = (model as any).length;
      Prop.key = idx[0];
      Prop.Item = model;
      model = model[idx[0]];
      return;
    }
    Prop.key = s;
    Prop.Item = model;
    model = model[s];
  });
  if (OutParam) {
    return { model, Prop, BindStr: PropStr };
  }
  return model;
}
/**
 * 双向绑定
 * @param PorpStr prop位置字符串
 */
export function Bind(PorpStr): any {
  return { Bind: PorpStr };
}
/**
 * 属性监听器
 * @param WatchFunc 监听方法
 */
export function Watch(WatchFunc: Function) {
  return function (_target: any, attr: any) {
    RDM.$WatchFuncList.push({
      key: attr,
      func: function (nv, ov, key) {
        WatchFunc.apply(this.$Module, [nv, ov]);
        this.$BackModule[key] = nv;
      },
    });
  };
}
